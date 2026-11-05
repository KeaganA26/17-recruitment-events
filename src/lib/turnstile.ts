type SiteverifyResult = {
  success?: boolean;
  action?: string;
  hostname?: string;
};

function expectedHostnames() {
  return new Set(
    (process.env.TURNSTILE_HOSTNAMES ?? "")
      .split(",")
      .map((hostname) => hostname.trim())
      .filter(Boolean),
  );
}

export async function hasValidTurnstile(request: Request, token: string, action: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const hostnames = expectedHostnames();
  if (!secret || hostnames.size === 0 || token.length === 0 || token.length > 2048) return false;

  const remoteip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal: AbortSignal.timeout(10_000),
      body: new URLSearchParams({
        secret,
        response: token,
        ...(remoteip ? { remoteip } : {}),
      }),
    });
    if (!response.ok) return false;
    const result = (await response.json()) as SiteverifyResult;
    return (
      result.success === true &&
      result.action === action &&
      typeof result.hostname === "string" &&
      hostnames.has(result.hostname)
    );
  } catch {
    return false;
  }
}
