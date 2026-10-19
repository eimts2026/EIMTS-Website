import "server-only";
import { createHmac } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { SubmissionError } from "./bot-protection";

export function submissionDatabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new SubmissionError("Online submissions are temporarily unavailable. Please email our team.", 503);
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function limitSubmission(request: Request, email: string, kind: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) throw new SubmissionError("Verification is unavailable.", 503);
  const db = submissionDatabase();
  // Email is normalized then HMACed; raw addresses and IPs are never retained.
  const identities = [{ identity: `email:${email.trim().toLowerCase()}`, limit: 3 }];
  const ip = process.env.VERCEL === "1" ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim() : null;
  if (ip) identities.push({ identity: `ip:${ip}`, limit: 15 });
  for (const { identity, limit } of identities) {
    const key = createHmac("sha256", secret).update(`${kind}:${identity}`).digest("hex");
    const { data, error } = await db.rpc("allow_website_submission", { p_key: key, p_limit: limit, p_seconds: 600 });
    if (error) throw new SubmissionError("Submissions are temporarily unavailable. Please try again shortly.", 503);
    if (!data) throw new SubmissionError("Too many attempts. Please wait 10 minutes before trying again.", 429);
  }
}
