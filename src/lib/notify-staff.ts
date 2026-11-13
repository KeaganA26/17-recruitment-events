const studioUrl = "https://17recruitment.com/studio/applications";
const recipient = "jenna@17recruitment.com";

const kindLabel: Record<string, string> = {
  job: "Job application",
  talent: "Talent network",
  employer: "Employer request",
  contact: "Contact message",
};

async function graphAccessToken(tenantId: string, clientId: string, clientSecret: string) {
  const response = await fetch(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      }),
      signal: AbortSignal.timeout(10_000),
    },
  );
  if (!response.ok) {
    throw new Error(`token ${response.status}`);
  }
  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error("token missing");
  }
  return data.access_token;
}

export async function notifyStaff(input: { kind: string; name: string; role: string }) {
  const tenantId = process.env.MICROSOFT_TENANT_ID;
  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
  const from = process.env.MICROSOFT_MAIL_FROM || "jenna@17recruitment.com";
  if (!tenantId || !clientId || !clientSecret) {
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
    const accessToken = await graphAccessToken(tenantId, clientId, clientSecret);
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(from)}/sendMail`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(10_000),
        body: JSON.stringify({
          message: {
            subject: `${label}: ${input.name}`,
            body: { contentType: "Text", content: text },
            toRecipients: [{ emailAddress: { address: recipient } }],
          },
          saveToSentItems: false,
        }),
      },
    );
    if (!response.ok) console.error("Staff email failed", response.status);
  } catch (error) {
    console.error("Staff email failed", error instanceof Error ? error.name : "Error");
  }
}
