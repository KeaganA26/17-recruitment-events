import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getJobBySlug } from "@/data/jobs";
import { regions } from "@/data/site";
import { cvFieldError, uploadPrivateCv } from "@/lib/cv-upload";
import { insertApplication, listApplications } from "@/lib/db";
import { notifyStaff } from "@/lib/notify-staff";
import { hasProjectAccess } from "@/lib/studio-auth";
import { hasValidTurnstile } from "@/lib/turnstile";
import { isValidEmail, isValidPhone, required } from "@/lib/validation";

export const runtime = "nodejs";

const MAX_MESSAGE_LENGTH = 2000;

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
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
  const turnstileToken = text(formData, "turnstileToken");
  const fieldErrors: Record<string, string> = {};

  if (!(await hasValidTurnstile(request, turnstileToken, "apply"))) {
    return NextResponse.json(
      { error: "Confirm you are not a robot and try again." },
      { status: 403 },
    );
  }

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

  const cvError = cvFieldError(cv);
  if (cvError) fieldErrors.cv = cvError;

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

  const file = cv instanceof File ? cv : null;
  const id = randomUUID();
  const uploaded = await uploadPrivateCv(id, file!);
  if ("error" in uploaded) {
    if (uploaded.error === "Attach a PDF or Word CV.") {
      return NextResponse.json(
        { error: "Check the highlighted fields.", fieldErrors: { cv: uploaded.error } },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        error:
          uploaded.error === "unavailable"
            ? "Applications are temporarily unavailable."
            : "The application could not be saved. Try again.",
      },
      { status: 500 },
    );
  }

  try {
    await insertApplication({
      id,
      kind: "job",
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
      cvUrl: uploaded.cvKey,
      details: {},
    });
  } catch (error) {
    console.error("Application insert failed", error instanceof Error ? error.name : "Error");
    await uploaded.remove();
    return NextResponse.json(
      { error: "The application could not be saved. Try again." },
      { status: 500 },
    );
  }

  await notifyStaff({
    kind: "job",
    name: `${fields.firstName} ${fields.lastName}`,
    role: job.title,
  });

  return NextResponse.json({ success: true });
}
