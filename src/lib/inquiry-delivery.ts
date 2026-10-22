import "server-only";
import nodemailer from "nodemailer";
import { submissionDatabase } from "./submission-service";
import { inquiryEmailTemplate } from "./inquiry-email-template";

export async function processInquiryQueue({ cleanup = false }: { cleanup?: boolean } = {}) {
  const db = submissionDatabase();
  const now = new Date().toISOString();
  if (cleanup) {
    await db.from("website_inquiry_outbox").update({ status: "dead", last_error: "lease_exhausted", locked_until: null }).eq("status", "processing").gte("attempts", 5).lt("locked_until", now);
    await db.from("website_rate_limits").delete().lt("expires_at", now);
    await db.from("website_inquiry_outbox").delete().in("status", ["sent", "dead"]).lt("created_at", new Date(Date.now() - 7 * 86400000).toISOString());
  }
  const { data: jobs, error } = await db.rpc("claim_website_inquiries", { p_limit: 3 });
  if (error) throw new Error("inquiry_queue_unavailable");
  const port = Number(process.env.SMTP_PORT || 465);
  const transport = nodemailer.createTransport({ host: process.env.SMTP_HOST, port, secure: port === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }, connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 20000 });
  let sent = 0; let deferred = 0;
  const sentIds: string[] = []; const deferredIds: string[] = []; const attentionIds: string[] = [];
  try {
    for (const job of jobs || []) {
      const input = job.payload as Record<string, string>;
      const to = ["info@emeraldislemanpower.com"];
      const cc = job.kind === "contact" ? ["admin@emeraldisle.lk"] : ["recruitment@emeraldisle.lk", "linda@emeraldisle.lk"];
      const recipients = [...to, ...cc];
      let accepted = false;
      try {
        const isContact = job.kind === "contact";
        const subject = isContact
          ? `[GENERAL CONTACT] ${input.name} | ${input.email}`
          : `[CLIENT INQUIRY] ${input.company || input.name} | ${input.email}`;
        const { html, text } = inquiryEmailTemplate(isContact ? "contact" : "employer", input);
        const result = await transport.sendMail({ from: process.env.APPLICATIONS_EMAIL_FROM || process.env.SMTP_USER, to, cc, replyTo: input.email, messageId: `<inquiry-${job.id}@emeraldislemanpower.com>`, subject, html, text });
        const acceptedRecipients = new Set((result.accepted || []).map((address) => String(address).trim().toLowerCase()));
        const rejectedRecipients = new Set((result.rejected || []).map((address) => String(address).trim().toLowerCase()));
        const missingRecipients = recipients.filter((address) => !acceptedRecipients.has(address.toLowerCase()) || rejectedRecipients.has(address.toLowerCase()));
        if (missingRecipients.length) {
          const { error: updateError } = await db.from("website_inquiry_outbox").update({ status: "dead", locked_until: null, last_error: "partial_acceptance" }).eq("id", job.id).eq("attempts", job.attempts);
          if (updateError) console.error(JSON.stringify({ event: "inquiry_receipt_write_failed", id: job.id }));
          console.error(JSON.stringify({ event: "inquiry_recipient_rejected", id: job.id, missingRecipients }));
          deferred++;
          attentionIds.push(job.id);
          continue;
        }
        accepted = true;
        const { error: updateError } = await db.from("website_inquiry_outbox").update({ status: "sent", payload: {}, completed_at: now, locked_until: null, last_error: null }).eq("id", job.id).eq("attempts", job.attempts);
        if (updateError) throw Object.assign(new Error("receipt_update_failed"), { code: "receipt_update_failed" });
        sent++;
        sentIds.push(job.id);
      } catch (error) {
        const delay = Math.min(60 * 2 ** job.attempts, 21600);
        const errorCode = error && typeof error === "object" && "code" in error && typeof error.code === "string" ? error.code.slice(0, 60) : "unknown";
        const needsAttention = accepted || job.attempts >= 5;
        const { error: updateError } = await db.from("website_inquiry_outbox").update({ status: needsAttention ? "dead" : "pending", available_at: new Date(Date.now() + delay * 1000).toISOString(), locked_until: null, last_error: accepted ? "accepted_receipt_uncertain" : `smtp_delivery_failed:${errorCode}` }).eq("id", job.id).eq("attempts", job.attempts);
        if (updateError) console.error(JSON.stringify({ event: "inquiry_receipt_write_failed", id: job.id }));
        console.error(JSON.stringify({ event: "inquiry_smtp_failed", id: job.id, attempt: job.attempts, code: errorCode }));
        deferred++;
        (needsAttention ? attentionIds : deferredIds).push(job.id);
      }
    }
  } finally { transport.close(); }
  console.info(JSON.stringify({ event: "inquiry_worker", claimed: jobs?.length || 0, sent, deferred }));
  return { claimed: jobs?.length || 0, sent, deferred, sentIds, deferredIds, attentionIds };
}
