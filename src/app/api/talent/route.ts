import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { availabilityOptions, preferredRoles, regions } from "@/data/site";
import { cvFieldError, uploadPrivateCv } from "@/lib/cv-upload";
import { insertApplication } from "@/lib/db";
import { notifyStaff } from "@/lib/notify-staff";
import { hasValidTurnstile } from "@/lib/turnstile";
import { isValidEmail, isValidPhone, required } from "@/lib/validation";

export const runtime = "nodejs";

const MAX_MESSAGE_LENGTH = 2000;

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "The form could not be read. Check the CV is under 5MB." },
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
    role: text(formData, "role"),
    experience: text(formData, "experience"),
    availability: text(formData, "availability"),
  };
  const consent = text(formData, "consent") === "true";
  const cv = formData.get("cv");
  const fieldErrors: Record<string, string> = {};

  if (!(await hasValidTurnstile(request, text(formData, "turnstileToken"), "talent"))) {
    return NextResponse.json(
      { error: "Confirm you are not a robot and try again." },
      { status: 403 },
    );
  }

  if (!required(fields.firstName)) fieldErrors.firstName = "Enter your first name.";
  if (!required(fields.lastName)) fieldErrors.lastName = "Enter your last name.";
  if (!isValidEmail(fields.email)) fieldErrors.email = "Enter a valid email address.";
  if (!isValidPhone(fields.mobile)) fieldErrors.mobile = "Enter a valid UK mobile number.";
  if (!required(fields.city)) fieldErrors.city = "Enter your city.";
  if (!(regions as readonly string[]).includes(fields.region)) fieldErrors.region = "Select your region.";
  if (!(preferredRoles as readonly string[]).includes(fields.role)) {
    fieldErrors.role = "Select a preferred role.";
  }
  if (!required(fields.experience)) fieldErrors.experience = "Tell us a little about your experience.";
  if (fields.experience.length > MAX_MESSAGE_LENGTH) {
    fieldErrors.experience = "Keep your experience under 2000 characters.";
  }
  if (!(availabilityOptions as readonly string[]).includes(fields.availability)) {
    fieldErrors.availability = "Select your availability.";
  }
  if (!consent) fieldErrors.consent = "Consent is required to join the talent network.";
  const cvError = cvFieldError(cv);
  if (cvError) fieldErrors.cv = cvError;

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json({ error: "Check the highlighted fields.", fieldErrors }, { status: 400 });
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
            : "The form could not be saved. Try again.",
      },
      { status: 500 },
    );
  }

  try {
    await insertApplication({
      id,
      kind: "talent",
      jobSlug: "",
      jobTitle: fields.role,
      firstName: fields.firstName,
      lastName: fields.lastName,
      email: fields.email,
      mobile: fields.mobile,
      city: fields.city,
      region: fields.region,
      message: fields.experience,
      consent: true,
      createdAt: new Date().toISOString(),
      cvUrl: uploaded.cvKey,
      details: {
        role: fields.role,
        experience: fields.experience,
        availability: fields.availability,
      },
    });
  } catch (error) {
    console.error("Talent insert failed", error instanceof Error ? error.name : "Error");
    await uploaded.remove();
    return NextResponse.json({ error: "The form could not be saved. Try again." }, { status: 500 });
  }

  await notifyStaff({
    kind: "talent",
    name: `${fields.firstName} ${fields.lastName}`,
    role: fields.role,
  });

  return NextResponse.json({ success: true });
}
