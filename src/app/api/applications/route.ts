import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getJobBySlug } from "@/data/jobs";
import { regions } from "@/data/site";
import { insertApplication, listApplications } from "@/lib/db";
import { createR2Client } from "@/lib/r2";
import { hasProjectAccess } from "@/lib/studio-auth";
import { isValidEmail, isValidPhone, required } from "@/lib/validation";

export const runtime = "nodejs";

const MAX_CV_BYTES = 5 * 1024 * 1024;
const MAX_MESSAGE_LENGTH = 2000;

type CvExtension = "pdf" | "doc" | "docx";

const extensionByType: Record<string, CvExtension> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
};

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function extensionFromName(name: string): CvExtension | null {
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf")) return "pdf";
  if (lower.endsWith(".docx")) return "docx";
  if (lower.endsWith(".doc")) return "doc";
  return null;
}

function looksLikeCv(bytes: Uint8Array, extension: CvExtension) {
  if (extension === "pdf") {
    return (
      bytes.length > 4 &&
      bytes[0] === 0x25 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x44 &&
      bytes[3] === 0x46
    );
  }
  if (extension === "docx") {
    return bytes.length > 4 && bytes[0] === 0x50 && bytes[1] === 0x4b;
  }
  return (
    bytes.length > 8 &&
    bytes[0] === 0xd0 &&
    bytes[1] === 0xcf &&
    bytes[2] === 0x11 &&
    bytes[3] === 0xe0
  );
}

export async function GET(request: Request) {
  if (!(await hasProjectAccess(request))) {
    return NextResponse.json(
      { error: "Sign in to Sanity to review applications." },
      { status: 401 },
    );
  }

  try {
    const applications = await listApplications();
    return NextResponse.json(
      { applications },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    console.error("Application list failed", error instanceof Error ? error.name : "Error");
    return NextResponse.json(
      { error: "Applications could not be loaded." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "The application could not be read. Check the CV is under 5MB." },
      { status: 400 },
    );
  }

  const fields = {
    firstName: text(formData, "firstName"),
    lastName: text(formData, "lastName"),
    email: text(formData, "email"),
    mobile: text(formData, "mobile"),
    city: text(formData, "city"),
    region: text(formData, "region"),
    message: text(formData, "message"),
  };
  const jobSlug = text(formData, "jobSlug");
  const consent = text(formData, "consent") === "true";
  const cv = formData.get("cv");
  const fieldErrors: Record<string, string> = {};

  if (!required(fields.firstName)) fieldErrors.firstName = "Enter your first name.";
  if (!required(fields.lastName)) fieldErrors.lastName = "Enter your last name.";
  if (!isValidEmail(fields.email)) fieldErrors.email = "Enter a valid email address.";
  if (!isValidPhone(fields.mobile)) {
    fieldErrors.mobile = "Enter a valid UK mobile number.";
  }
  if (!required(fields.city)) fieldErrors.city = "Enter your city.";
  if (!(regions as readonly string[]).includes(fields.region)) {
    fieldErrors.region = "Select your region.";
  }
  if (fields.message.length > MAX_MESSAGE_LENGTH) {
    fieldErrors.message = "Keep your message under 2000 characters.";
  }
  if (!consent) fieldErrors.consent = "Consent is required to submit your application.";

  const file = cv instanceof File && cv.size > 0 ? cv : null;
  const extension = file
    ? extensionFromName(file.name) ?? extensionByType[file.type] ?? null
    : null;
  const typedExtension = file ? extensionByType[file.type] : undefined;
  if (!file || !extension) {
    fieldErrors.cv = "Attach a PDF or Word CV.";
  } else if (typedExtension && typedExtension !== extension) {
    fieldErrors.cv = "Attach a PDF or Word CV.";
  } else if (file.size > MAX_CV_BYTES) {
    fieldErrors.cv = "CV must be 5MB or smaller.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { error: "Check the highlighted fields.", fieldErrors },
      { status: 400 },
    );
  }

  const job = await getJobBySlug(jobSlug);
  if (!job) {
    return NextResponse.json({ error: "That role is no longer available." }, { status: 404 });
  }

  const bytes = new Uint8Array(await file!.arrayBuffer());
  if (!looksLikeCv(bytes, extension!)) {
    return NextResponse.json(
      {
        error: "Check the highlighted fields.",
        fieldErrors: { cv: "Attach a PDF or Word CV." },
      },
      { status: 400 },
    );
  }

  let r2: ReturnType<typeof createR2Client>;
  try {
    r2 = createR2Client();
  } catch {
    return NextResponse.json(
      { error: "Applications are temporarily unavailable." },
      { status: 500 },
    );
  }

  const id = randomUUID();
  const cvKey = `applications/${id}/cv.${extension}`;

  try {
    await r2.client.send(
      new PutObjectCommand({
        Bucket: r2.bucket,
        Key: cvKey,
        Body: bytes,
        ContentType: file!.type || "application/octet-stream",
      }),
    );
  } catch (error) {
    console.error("CV upload failed", error instanceof Error ? error.name : "Error");
    return NextResponse.json(
      { error: "The application could not be saved. Try again." },
      { status: 500 },
    );
  }

  try {
    await insertApplication({
      id,
      jobSlug: job.slug,
      jobTitle: job.title,
      firstName: fields.firstName,
      lastName: fields.lastName,
      email: fields.email,
      mobile: fields.mobile,
      city: fields.city,
      region: fields.region,
      message: fields.message,
      consent: true,
      createdAt: new Date().toISOString(),
      cvUrl: cvKey,
    });
  } catch (error) {
    console.error("Application insert failed", error instanceof Error ? error.name : "Error");
    await r2.client
      .send(new DeleteObjectCommand({ Bucket: r2.bucket, Key: cvKey }))
      .catch(() => undefined);
    return NextResponse.json(
      { error: "The application could not be saved. Try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
