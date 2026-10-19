import "server-only";
import { createHash } from "node:crypto";
import { SubmissionError } from "./bot-protection";
import { submissionDatabase } from "./submission-service";

export async function queueInquiry(request: Request, kind: "contact" | "employer", input: Record<string, string>) {
  if (!process.env.CRON_SECRET) throw new SubmissionError("Online inquiries are temporarily unavailable. Please email our team.", 503);
  const id = request.headers.get("Idempotency-Key") || "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) throw new SubmissionError("Please refresh the form and try again.");
  const db = submissionDatabase();
  const hash = createHash("sha256").update(JSON.stringify({ kind, input })).digest("hex");
  const { error } = await db.from("website_inquiry_outbox").upsert({ id, kind, payload: input, payload_hash: hash }, { onConflict: "id", ignoreDuplicates: true });
  if (error) throw new SubmissionError("Your inquiry could not be saved. Please try again shortly.", 503);
  const { data, error: readError } = await db.from("website_inquiry_outbox").select("payload_hash,status").eq("id", id).single();
  if (readError || !data) throw new SubmissionError("Your inquiry could not be confirmed. Please try again shortly.", 503);
  if (data.payload_hash !== hash) throw new SubmissionError("The inquiry changed. Please submit it again.", 409);
  if (data.status === "dead") throw new SubmissionError("Delivery needs our attention. Please contact our team by email.", 503);
  return id;
}
