"use client";

import { useRef, useState, type FormEvent } from "react";
import { TurnstileField, type TurnstileHandle } from "@/components/TurnstileField";
import { Loader2 } from "lucide-react";
import { TextAreaField, TextField } from "@/components/FormField";
import { SuccessMessage } from "@/components/SuccessMessage";
import { Button } from "@/components/ui/button";
import { isValidEmail, isValidPhone, required } from "@/lib/validation";

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const emptyForm: FormState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstile = useRef<TurnstileHandle>(null);

  const update = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!required(form.name)) next.name = "Enter your name.";
    if (!isValidEmail(form.email)) next.email = "Enter a valid email address.";
    if (!isValidPhone(form.phone)) {
      next.phone = "Enter a valid UK phone number.";
    }
    if (!required(form.subject)) next.subject = "Enter a subject.";
    if (!required(form.message)) next.message = "Enter your message.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    if (!turnstileToken) {
      setErrors({ form: "Confirm you are not a robot and try again." });
      return;
    }
    setStatus("loading");

    const body = new FormData();
    body.set("name", form.name);
    body.set("email", form.email);
    body.set("phone", form.phone);
    body.set("subject", form.subject);
    body.set("message", form.message);
    body.set("turnstileToken", turnstileToken);

    try {
      const response = await fetch("/api/contact", { method: "POST", body });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        fieldErrors?: Record<string, string>;
      };
      if (!response.ok) {
        setErrors({
          ...(data.fieldErrors ?? {}),
          form: data.error ?? "The form could not be saved. Try again.",
        });
        setStatus("idle");
        turnstile.current?.reset();
        return;
      }
      setStatus("success");
    } catch {
      setErrors({ form: "The form could not be saved. Try again." });
      setStatus("idle");
      turnstile.current?.reset();
    }
  };

  if (status === "success") {
    return (
      <SuccessMessage
        title="Message sent"
        description="Thank you for getting in touch. Our team will reply during business hours."
        primaryHref="/"
        primaryLabel="Back to home"
      />
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <TextField
        id="contact-name"
        label="Name"
        required
        value={form.name}
        onChange={(event) => update("name", event.target.value)}
        error={errors.name}
      />
      <TextField
        id="contact-email"
        label="Email"
        type="email"
        required
        value={form.email}
        onChange={(event) => update("email", event.target.value)}
        error={errors.email}
      />
      <TextField
        id="contact-phone"
        label="Phone"
        type="tel"
        required
        value={form.phone}
        onChange={(event) => update("phone", event.target.value)}
        error={errors.phone}
      />
      <TextField
        id="contact-subject"
        label="Subject"
        required
        value={form.subject}
        onChange={(event) => update("subject", event.target.value)}
        error={errors.subject}
      />
      <TextAreaField
        id="contact-message"
        label="Message"
        required
        value={form.message}
        onChange={(event) => update("message", event.target.value)}
        error={errors.message}
      />
      <TurnstileField ref={turnstile} action="contact" onToken={setTurnstileToken} />
      {errors.form ? <p className="text-sm text-destructive">{errors.form}</p> : null}
      <Button
        type="submit"
        size="xl"
        disabled={status === "loading" || !turnstileToken}
        className="w-full bg-brand-coral text-white hover:bg-brand-coral/90"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
}
