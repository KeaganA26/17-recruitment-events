"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { FileUpload } from "@/components/FileUpload";
import { SelectField, TextAreaField, TextField } from "@/components/FormField";
import { SuccessMessage } from "@/components/SuccessMessage";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  availabilityOptions,
  preferredRoles,
  regions,
} from "@/data/site";
import { isValidEmail, isValidPhone, required } from "@/lib/validation";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  city: string;
  region: string;
  role: string;
  experience: string;
  availability: string;
};

const emptyForm: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  city: "",
  region: "",
  role: "",
  experience: "",
  availability: "",
};

export function TalentForm() {
  const [form, setForm] = useState(emptyForm);
  const [cv, setCv] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const update = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!required(form.firstName)) next.firstName = "Enter your first name.";
    if (!required(form.lastName)) next.lastName = "Enter your last name.";
    if (!isValidEmail(form.email)) next.email = "Enter a valid email address.";
    if (!isValidPhone(form.mobile)) {
      next.mobile = "Enter a valid UK mobile number.";
    }
    if (!required(form.city)) next.city = "Enter your city.";
    if (!form.region) next.region = "Select your region.";
    if (!form.role) next.role = "Select a preferred role.";
    if (!required(form.experience)) {
      next.experience = "Tell us a little about your experience.";
    }
    if (!form.availability) next.availability = "Select your availability.";
    if (!cv) next.cv = "Attach your CV to continue.";
    if (!consent) next.consent = "Consent is required to join the talent network.";
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
        title="You are on the list"
        description="Thank you for registering. We will consider you for upcoming events and opportunities that match your profile."
        primaryHref="/jobs"
        primaryLabel="See current opportunities"
      />
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="talent-firstName"
          label="First Name"
          required
          value={form.firstName}
          onChange={(event) => update("firstName", event.target.value)}
          error={errors.firstName}
        />
        <TextField
          id="talent-lastName"
          label="Last Name"
          required
          value={form.lastName}
          onChange={(event) => update("lastName", event.target.value)}
          error={errors.lastName}
        />
      </div>
      <TextField
        id="talent-email"
        label="Email"
        type="email"
        required
        value={form.email}
        onChange={(event) => update("email", event.target.value)}
        error={errors.email}
      />
      <TextField
        id="talent-mobile"
        label="Mobile"
        type="tel"
        required
        placeholder="07700 900000"
        value={form.mobile}
        onChange={(event) => update("mobile", event.target.value)}
        error={errors.mobile}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="talent-city"
          label="City"
          required
          value={form.city}
          onChange={(event) => update("city", event.target.value)}
          error={errors.city}
        />
        <SelectField
          id="talent-region"
          label="Region"
          required
          value={form.region}
          onChange={(event) => update("region", event.target.value)}
          error={errors.region}
        >
          <option value="">Select region</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </SelectField>
      </div>
      <SelectField
        id="talent-role"
        label="Preferred Roles"
        required
        value={form.role}
        onChange={(event) => update("role", event.target.value)}
        error={errors.role}
      >
        <option value="">Select a preferred role</option>
        {preferredRoles.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </SelectField>
      <TextAreaField
        id="talent-experience"
        label="Previous Experience"
        required
        value={form.experience}
        onChange={(event) => update("experience", event.target.value)}
        error={errors.experience}
        placeholder="Events, hospitality, promotions or related work."
      />
      <SelectField
        id="talent-availability"
        label="Availability"
        required
        value={form.availability}
        onChange={(event) => update("availability", event.target.value)}
        error={errors.availability}
      >
        <option value="">Select availability</option>
        {availabilityOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </SelectField>
      <FileUpload
        label="CV Upload"
        required
        error={errors.cv}
        onFileChange={setCv}
      />
      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <Checkbox
            id="talent-consent"
            checked={consent}
            onCheckedChange={(checked) => setConsent(checked === true)}
            className="mt-0.5"
          />
          <Label htmlFor="talent-consent" className="text-sm leading-6 font-normal">
            I consent to 17 Recruitment Events using my information for
            recruitment purposes.
          </Label>
        </div>
        {errors.consent ? (
          <p className="text-sm text-destructive">{errors.consent}</p>
        ) : null}
      </div>
      <Button
        type="submit"
        size="xl"
        disabled={status === "loading"}
        className="w-full bg-brand-coral text-white hover:bg-brand-coral/90"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Join The Talent Network"
        )}
      </Button>
    </form>
  );
}
