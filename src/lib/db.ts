import { Pool } from "pg";

let pool: Pool | undefined;
let schemaReady: Promise<void> | undefined;

export type SubmissionKind = "job" | "talent" | "employer" | "contact";

export type SubmissionDetails = {
  role?: string;
  experience?: string;
  availability?: string;
  company?: string;
  eventDate?: string;
  location?: string;
  staffCount?: string;
  staffType?: string;
  subject?: string;
};

function databaseUrl() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Database is not configured");
  }
  const local = /@(127\.0\.0\.1|localhost)(:|\/)/.test(connectionString);
  if (local || connectionString.includes("uselibpqcompat=true")) return connectionString;
  const join = connectionString.includes("?") ? "&" : "?";
  return `${connectionString}${join}uselibpqcompat=true&sslmode=require`;
}

function getPool() {
  const connectionString = databaseUrl();
  const local = /@(127\.0\.0\.1|localhost)(:|\/)/.test(connectionString);
  pool ??= new Pool({ connectionString, max: local ? 10 : 1 });
  return pool;
}

async function ensureSchema() {
  schemaReady ??= getPool()
    .query(
      `
    CREATE TABLE IF NOT EXISTS applications (
      id uuid PRIMARY KEY,
      kind text NOT NULL DEFAULT 'job',
      job_slug text,
      job_title text,
      first_name text NOT NULL,
      last_name text NOT NULL,
      email text NOT NULL,
      mobile text NOT NULL,
      city text,
      region text,
      message text,
      consent boolean NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      cv_url text,
      details jsonb NOT NULL DEFAULT '{}'::jsonb
    )
  `,
    )
    .then(() =>
      getPool().query(`
        ALTER TABLE applications ADD COLUMN IF NOT EXISTS kind text;
        ALTER TABLE applications ADD COLUMN IF NOT EXISTS details jsonb;
        UPDATE applications SET kind = 'job' WHERE kind IS NULL;
        UPDATE applications SET details = '{}'::jsonb WHERE details IS NULL;
        ALTER TABLE applications ALTER COLUMN kind SET DEFAULT 'job';
        ALTER TABLE applications ALTER COLUMN details SET DEFAULT '{}'::jsonb;
        ALTER TABLE applications ALTER COLUMN job_slug DROP NOT NULL;
        ALTER TABLE applications ALTER COLUMN job_title DROP NOT NULL;
        ALTER TABLE applications ALTER COLUMN city DROP NOT NULL;
        ALTER TABLE applications ALTER COLUMN region DROP NOT NULL;
        ALTER TABLE applications ALTER COLUMN cv_url DROP NOT NULL;
        ALTER TABLE applications ALTER COLUMN kind SET NOT NULL;
        ALTER TABLE applications ALTER COLUMN details SET NOT NULL;
      `),
    )
    .then(() => undefined);
  await schemaReady;
}

export type ApplicationRecord = {
  id: string;
  kind: SubmissionKind;
  jobSlug: string;
  jobTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  city: string;
  region: string;
  message: string;
  consent: boolean;
  createdAt: string;
  cvUrl: string;
  details: SubmissionDetails;
};

export async function insertApplication(application: ApplicationRecord) {
  await ensureSchema();
  await getPool().query(
    `INSERT INTO applications (
      id, kind, job_slug, job_title, first_name, last_name, email, mobile, city, region, message, consent, created_at, cv_url, details
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15::jsonb)`,
    [
      application.id,
      application.kind,
      application.jobSlug || null,
      application.jobTitle || null,
      application.firstName,
      application.lastName,
      application.email,
      application.mobile,
      application.city || null,
      application.region || null,
      application.message,
      application.consent,
      application.createdAt,
      application.cvUrl || null,
      JSON.stringify(application.details),
    ],
  );
}

export type ApplicationSummary = {
  id: string;
  kind: SubmissionKind;
  jobTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  city: string;
  region: string;
  message: string;
  createdAt: string;
  hasCv: boolean;
  details: SubmissionDetails;
};

type ApplicationRow = {
  id: string;
  kind: string | null;
  job_slug: string | null;
  job_title: string | null;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  city: string | null;
  region: string | null;
  message: string | null;
  consent: boolean;
  created_at: Date;
  cv_url: string | null;
  details: SubmissionDetails | null;
};

const kinds = new Set<SubmissionKind>(["job", "talent", "employer", "contact"]);

function asKind(value: string | null): SubmissionKind {
  return value && kinds.has(value as SubmissionKind) ? (value as SubmissionKind) : "job";
}

function toRecord(row: ApplicationRow): ApplicationRecord {
  return {
    id: row.id,
    kind: asKind(row.kind),
    jobSlug: row.job_slug ?? "",
    jobTitle: row.job_title ?? "",
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    mobile: row.mobile,
    city: row.city ?? "",
    region: row.region ?? "",
    message: row.message ?? "",
    consent: row.consent,
    createdAt: row.created_at.toISOString(),
    cvUrl: row.cv_url ?? "",
    details: row.details ?? {},
  };
}

const summaryColumns = `id, kind, job_slug, job_title, first_name, last_name, email, mobile, city, region, message, consent, created_at, cv_url, details`;

function toSummary(row: ApplicationRow): ApplicationSummary {
  const application = toRecord(row);
  return {
    id: application.id,
    kind: application.kind,
    jobTitle: application.jobTitle,
    firstName: application.firstName,
    lastName: application.lastName,
    email: application.email,
    mobile: application.mobile,
    city: application.city,
    region: application.region,
    message: application.message,
    createdAt: application.createdAt,
    hasCv: Boolean(application.cvUrl),
    details: application.details,
  };
}

export async function listApplications(): Promise<ApplicationSummary[]> {
  await ensureSchema();
  const result = await getPool().query<ApplicationRow>(
    `SELECT ${summaryColumns}
     FROM applications
     ORDER BY created_at DESC`,
  );
  return result.rows.map(toSummary);
}

export async function getApplications(ids: string[]): Promise<ApplicationRecord[]> {
  await ensureSchema();
  if (ids.length === 0) return [];
  const result = await getPool().query<ApplicationRow>(
    `SELECT ${summaryColumns}
     FROM applications
     WHERE id = ANY($1::uuid[])`,
    [ids],
  );
  return result.rows.map(toRecord);
}

export async function getApplication(id: string): Promise<ApplicationRecord | null> {
  await ensureSchema();
  const result = await getPool().query<ApplicationRow>(
    `SELECT ${summaryColumns}
     FROM applications
     WHERE id = $1`,
    [id],
  );
  const row = result.rows[0];
  return row ? toRecord(row) : null;
}
