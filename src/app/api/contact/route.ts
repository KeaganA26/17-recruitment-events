import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
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

function splitName(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "The form could not be read." }, { status: 400 });
  }

  const fields = {
    name: text(formData, "name"),
    email: text(formData, "email"),
    phone: text(formData, "phone"),
    subject: text(formData, "subject"),
    message: text(formData, "message"),
  };
  const fieldErrors: Record<string, string> = {};

  if (!(await hasValidTurnstile(request, text(formData, "turnstileToken"), "contact"))) {
    return NextResponse.json(
      { error: "Confirm you are not a robot and try again." },
      { status: 403 },
    );
  }

  if (!required(fields.name)) fieldErrors.name = "Enter your name.";
  if (!isValidEmail(fields.email)) fieldErrors.email = "Enter a valid email address.";
  if (!isValidPhone(fields.phone)) fieldErrors.phone = "Enter a valid UK phone number.";
  if (!required(fields.subject)) fieldErrors.subject = "Enter a subject.";
  if (fields.subject.length > 200) fieldErrors.subject = "Keep the subject under 200 characters.";
  if (!required(fields.message)) fieldErrors.message = "Enter your message.";
  if (fields.message.length > MAX_MESSAGE_LENGTH) {
    fieldErrors.message = "Keep your message under 2000 characters.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json({ error: "Check the highlighted fields.", fieldErrors }, { status: 400 });
  }

  const name = splitName(fields.name);
  try {
    await insertApplication({
      id: randomUUID(),
      kind: "contact",
      jobSlug: "",
      jobTitle: fields.subject,
      firstName: name.firstName,
      lastName: name.lastName,
      email: fields.email,
      mobile: fields.phone,
      city: "",
      region: "",
      message: fields.message,
      consent: true,
      createdAt: new Date().toISOString(),
      cvUrl: "",
      details: { subject: fields.subject },
    });
  } catch (error) {
    console.error("Contact insert failed", error instanceof Error ? error.name : "Error");
    return NextResponse.json({ error: "The form could not be saved. Try again." }, { status: 500 });
  }

  await notifyStaff({
    kind: "contact",
    name: fields.name,
    role: fields.subject,
  });

  return NextResponse.json({ success: true });
}
