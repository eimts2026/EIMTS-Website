import { timingSafeEqual } from "node:crypto";
import nodemailer from "nodemailer";
import { submissionDatabase } from "@/lib/submission-service";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const token = request.headers.get("authorization")?.replace(/^Bearer /, "") || "";
  if (!secret || Buffer.byteLength(token) !== Buffer.byteLength(secret) || !timingSafeEqual(Buffer.from(token), Buffer.from(secret))) return Response.json({ message: "Unauthorized" }, { status: 401 });
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) return Response.json({ message: "Email is not configured" }, { status: 503 });
  const db = submissionDatabase();
  const now = new Date().toISOString();
  // Exhausted leases are held for manual review, never silently discarded.
  await db.from("website_inquiry_outbox").update({ status: "dead", last_error: "lease_exhausted", locked_until: null }).eq("status", "processing").gte("attempts", 5).lt("locked_until", now);
  await db.from("website_rate_limits").delete().lt("expires_at", now);
  await db.from("website_inquiry_outbox").delete().in("status", ["sent", "dead"]).lt("created_at", new Date(Date.now() - 7 * 86400000).toISOString());
  const { data: jobs, error } = await db.rpc("claim_website_inquiries", { p_limit: 3 });
  if (error) return Response.json({ message: "Queue unavailable" }, { status: 503 });
  const port = Number(process.env.SMTP_PORT || 465);
  const transport = nodemailer.createTransport({ host: process.env.SMTP_HOST, port, secure: port === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }, connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 20000 });
  let sent = 0; let deferred = 0;
  try {
    // Serial delivery bounds SMTP connections and memory, including across
    // overlapping invocations via database leases and SKIP LOCKED claims.
    for (const job of jobs || []) {
      const input = job.payload as Record<string, string>;
      const to = ["info@emeraldislemanpower.com"];
      const cc = job.kind === "contact" ? ["admin@emeraldisle.lk"] : ["admin@emeraldisle.lk", "it@emeraldisle.lk"];
      const recipients = [...to, ...cc];
      let accepted = false;
      try {
        const result = await transport.sendMail({ from: process.env.APPLICATIONS_EMAIL_FROM || process.env.SMTP_USER, to, cc, replyTo: input.email, messageId: `<inquiry-${job.id}@emeraldislemanpower.com>`, subject: `${job.kind === "contact" ? "Contact" : "Employer"} inquiry: ${input.subject || "Hiring needs"}`, text: Object.entries(input).map(([key,value]) => `${key}: ${value || "Not provided"}`).join("\n\n") });
        if (result.rejected?.length || result.accepted?.length !== recipients.length) {
          // Avoid resending to recipients that already accepted the message.
          await db.from("website_inquiry_outbox").update({ status: "dead", locked_until: null, last_error: "partial_acceptance" }).eq("id", job.id).eq("attempts", job.attempts);
          deferred++; continue;
        }
        accepted = true;
        const { error: updateError } = await db.from("website_inquiry_outbox").update({ status: "sent", payload: {}, completed_at: now, locked_until: null, last_error: null }).eq("id", job.id).eq("attempts", job.attempts);
        if (updateError) throw new Error("receipt_update_failed");
        sent++;
      } catch {
        const delay = Math.min(60 * 2 ** job.attempts, 21600);
        const { error: updateError } = await db.from("website_inquiry_outbox").update({ status: accepted || job.attempts >= 5 ? "dead" : "pending", available_at: new Date(Date.now() + delay * 1000).toISOString(), locked_until: null, last_error: accepted ? "accepted_receipt_uncertain" : "smtp_delivery_failed" }).eq("id", job.id).eq("attempts", job.attempts);
        if (updateError) console.error(JSON.stringify({ event: "inquiry_receipt_write_failed", id: job.id }));
        deferred++;
      }
    }
  } finally { transport.close(); }
  console.info(JSON.stringify({ event: "inquiry_worker", claimed: jobs?.length || 0, sent, deferred }));
  return Response.json({ sent, deferred });
}
