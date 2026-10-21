import { timingSafeEqual } from "node:crypto";
import { processInquiryQueue } from "@/lib/inquiry-delivery";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const token = request.headers.get("authorization")?.replace(/^Bearer /, "") || "";
  if (!secret || Buffer.byteLength(token) !== Buffer.byteLength(secret) || !timingSafeEqual(Buffer.from(token), Buffer.from(secret))) return Response.json({ message: "Unauthorized" }, { status: 401 });
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) return Response.json({ message: "Email is not configured" }, { status: 503 });
  try {
    const result = await processInquiryQueue({ cleanup: true });
    return Response.json({ sent: result.sent, deferred: result.deferred });
  } catch {
    console.error(JSON.stringify({ event: "inquiry_worker_failed" }));
    return Response.json({ message: "Inquiry queue unavailable" }, { status: 503 });
  }
}
