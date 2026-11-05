const studioUrl = "https://17-recruitment-events.vercel.app/studio/applications";
const recipient = "ancillkeagan@gmail.com";

const kindLabel: Record<string, string> = {
  job: "Job application",
  talent: "Talent network",
  employer: "Employer request",
  contact: "Contact message",
};

export async function notifyStaff(input: { kind: string; name: string; role: string }) {
  const token = process.env.CLOUDFLARE_EMAIL_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || process.env.R2_ACCOUNT_ID;
  const from = process.env.CLOUDFLARE_EMAIL_FROM;
  if (!token || !accountId || !from) {
    console.error("Staff email is not configured");
    return;
  }

  const label = kindLabel[input.kind] ?? "New submission";
  const text = [
    `${label} from ${input.name}.`,
    `Role: ${input.role || "Not specified"}`,
    "",
    `Review it in Studio: ${studioUrl}`,
  ].join("\n");

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/email/sending/send`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(10_000),
        body: JSON.stringify({
          from: { address: from, name: "17 Recruitment Events" },
          to: recipient,
          subject: `${label}: ${input.name}`,
          text,
        }),
      },
    );
    if (!response.ok) console.error("Staff email failed", response.status);
  } catch (error) {
    console.error("Staff email failed", error instanceof Error ? error.name : "Error");
  }
}
