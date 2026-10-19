import "server-only";

export class SubmissionError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

export async function verifyBotProtection(request: Request, action: string) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) throw new SubmissionError("Please submit from our website.", 403);
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) throw new SubmissionError("Online verification is temporarily unavailable. Please email our team.", 503);
  const token = request.headers.get("x-turnstile-token");
  if (!token || token.length > 2048) throw new SubmissionError("Please complete the spam protection check.", 400);
  const configuredHosts = (process.env.TURNSTILE_ALLOWED_HOSTNAMES || "").split(",").map(host => host.trim().toLowerCase()).filter(Boolean);
  const hosts = configuredHosts.length ? configuredHosts : [new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://emeraldislemanpower.com").hostname];
  if (process.env.NODE_ENV !== "production") hosts.push("localhost", "127.0.0.1");
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST", cache: "no-store", signal: AbortSignal.timeout(8000),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token }),
    });
    if (!response.ok) throw new Error("siteverify unavailable");
    const result = await response.json() as { success?: boolean; action?: string; hostname?: string };
    if (!result.success || result.action !== action || !result.hostname || !hosts.includes(result.hostname.toLowerCase())) {
      throw new SubmissionError("Verification expired or failed. Please try the check again.", 403);
    }
  } catch (error) {
    if (error instanceof SubmissionError) throw error;
    throw new SubmissionError("Verification is temporarily unavailable. Please try again shortly.", 503);
  }
}
