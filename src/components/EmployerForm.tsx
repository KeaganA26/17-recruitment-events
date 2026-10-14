"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { SelectField, TextAreaField, TextField } from "@/components/FormField";
import { SuccessMessage } from "@/components/SuccessMessage";
import { Button } from "@/components/ui/button";
import { preferredRoles } from "@/data/site";
import { isValidEmail, isValidPhone, required } from "@/lib/validation";

type FormState = {
  company: string;
  contact: string;
  email: string;
  phone: string;
  eventDate: string;
  location: string;
  staffCount: string;
  staffType: string;
  message: string;
};

const emptyForm: FormState = {
  company: "",
  contact: "",
  email: "",
  phone: "",
  eventDate: "",
  location: "",
  staffCount: "",
  staffType: "",
  message: "",
};

export function EmployerForm() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const update = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!required(form.company)) next.company = "Enter your company name.";
    if (!required(form.contact)) next.contact = "Enter a contact person.";
    if (!isValidEmail(form.email)) next.email = "Enter a valid email address.";
    if (!isValidPhone(form.phone)) {
      next.phone = "Enter a valid UK phone number.";
    }
    if (!form.eventDate) next.eventDate = "Select an event date.";
    if (!required(form.location)) next.location = "Enter the event location.";
    if (!form.staffCount) next.staffCount = "Tell us how many staff you need.";
    if (!form.staffType) next.staffType = "Select a staff type.";
    if (!required(form.message)) next.message = "Share a short brief.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    await new Promise((resolve) => setTimeout(resolve, 900));
    setStatus("success");
  };

  if (status === "success") {
    return (
      <SuccessMessage
        title="Staff request received"
        description="Thank you. A 17 Recruitment Events consultant will review your brief and come back to you shortly."
        primaryHref="/contact"
        primaryLabel="Talk to the team"
      />
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="company"
          label="Company Name"
          required
          value={form.company}
          onChange={(event) => update("company", event.target.value)}
          error={errors.company}
        />
        <TextField
          id="contact"
          label="Contact Person"
          required
          value={form.contact}
          onChange={(event) => update("contact", event.target.value)}
          error={errors.contact}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="employer-email"
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(event) => update("email", event.target.value)}
          error={errors.email}
        />
        <TextField
          id="employer-phone"
          label="Phone"
          type="tel"
          required
          value={form.phone}
          onChange={(event) => update("phone", event.target.value)}
          error={errors.phone}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="eventDate"
          label="Event Date"
          type="date"
          required
          value={form.eventDate}
          onChange={(event) => update("eventDate", event.target.value)}
          error={errors.eventDate}
        />
        <TextField
          id="event-location"
          label="Event Location"
          required
          value={form.location}
          onChange={(event) => update("location", event.target.value)}
          error={errors.location}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          id="staffCount"
          label="Number of Staff Required"
          required
          value={form.staffCount}
          onChange={(event) => update("staffCount", event.target.value)}
          error={errors.staffCount}
        >
          <option value="">Select number</option>
          {["1-5", "6-10", "11-20", "21-50", "50+"].map((count) => (
            <option key={count} value={count}>
              {count}
            </option>
          ))}
        </SelectField>
        <SelectField
          id="staffType"
          label="Staff Type"
          required
          value={form.staffType}
          onChange={(event) => update("staffType", event.target.value)}
          error={errors.staffType}
        >
          <option value="">Select staff type</option>
          {preferredRoles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </SelectField>
      </div>
      <TextAreaField
        id="employer-message"
        label="Message"
        required
        value={form.message}
        onChange={(event) => update("message", event.target.value)}
        error={errors.message}
        placeholder="Tell us about the event, dress code, call time and any special requirements."
      />
      <Button
        type="submit"
        size="xl"
        disabled={status === "loading"}
        className="w-full bg-brand-coral text-white hover:bg-brand-coral/90"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending request...
          </>
        ) : (
          "Request Staff"
        )}
      </Button>
    </form>
  );
}
