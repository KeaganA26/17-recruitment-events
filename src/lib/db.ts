import { Pool } from "pg";

let pool: Pool | undefined;
let schemaReady: Promise<void> | undefined;

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
  schemaReady ??= getPool().query(`
    CREATE TABLE IF NOT EXISTS applications (
      id uuid PRIMARY KEY,
      job_slug text NOT NULL,
      job_title text NOT NULL,
      first_name text NOT NULL,
      last_name text NOT NULL,
      email text NOT NULL,
      mobile text NOT NULL,
      city text NOT NULL,
      region text NOT NULL,
      message text,
      consent boolean NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      cv_url text NOT NULL
    )
  `).then(() => undefined);
  await schemaReady;
}

export type ApplicationRecord = {
  id: string;
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
};

export async function insertApplication(application: ApplicationRecord) {
  await ensureSchema();
  await getPool().query(
    `INSERT INTO applications (
      id, job_slug, job_title, first_name, last_name, email, mobile, city, region, message, consent, created_at, cv_url
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
    [
      application.id,
      application.jobSlug,
      application.jobTitle,
      application.firstName,
      application.lastName,
      application.email,
      application.mobile,
      application.city,
      application.region,
      application.message,
      application.consent,
      application.createdAt,
      application.cvUrl,
    ],
  );
}

export type ApplicationSummary = {
  id: string;
  jobTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  city: string;
  region: string;
  message: string;
  createdAt: string;
};

type ApplicationRow = {
  id: string;
  job_slug: string;
  job_title: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  city: string;
  region: string;
  message: string | null;
  consent: boolean;
  created_at: Date;
  cv_url: string;
};

function toRecord(row: ApplicationRow): ApplicationRecord {
  return {
    id: row.id,
    jobSlug: row.job_slug,
    jobTitle: row.job_title,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    mobile: row.mobile,
    city: row.city,
    region: row.region,
    message: row.message ?? "",
    consent: row.consent,
    createdAt: row.created_at.toISOString(),
    cvUrl: row.cv_url,
  };
}

export async function listApplications(): Promise<ApplicationSummary[]> {
  await ensureSchema();
  const result = await getPool().query<ApplicationRow>(
    `SELECT id, job_slug, job_title, first_name, last_name, email, mobile, city, region, message, consent, created_at, cv_url
     FROM applications
     ORDER BY created_at DESC`,
  );
  return result.rows.map((row) => {
    const application = toRecord(row);
    return {
      id: application.id,
      jobTitle: application.jobTitle,
      firstName: application.firstName,
      lastName: application.lastName,
      email: application.email,
      mobile: application.mobile,
      city: application.city,
      region: application.region,
      message: application.message,
      createdAt: application.createdAt,
    };
  });
}

export async function getApplications(ids: string[]): Promise<ApplicationRecord[]> {
  await ensureSchema();
  if (ids.length === 0) return [];
  const result = await getPool().query<ApplicationRow>(
    `SELECT id, job_slug, job_title, first_name, last_name, email, mobile, city, region, message, consent, created_at, cv_url
     FROM applications
     WHERE id = ANY($1::uuid[])`,
    [ids],
  );
  return result.rows.map(toRecord);
}

export async function getApplication(id: string): Promise<ApplicationRecord | null> {
  await ensureSchema();
  const result = await getPool().query<ApplicationRow>(
    `SELECT id, job_slug, job_title, first_name, last_name, email, mobile, city, region, message, consent, created_at, cv_url
     FROM applications
     WHERE id = $1`,
    [id],
  );
  const row = result.rows[0];
  return row ? toRecord(row) : null;
}
