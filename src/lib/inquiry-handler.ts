import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
const fail = (message: string, status = 400) => NextResponse.json({ message }, { status });

export async function handleInquiry(request: Request, contact = false) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return fail("Please submit from our website.", 403);
  if (!request.headers.get("content-type")?.includes("application/json")) return fail("Unsupported form format.", 415);
  const reader = request.body?.getReader();
  if (!reader) return fail("Please complete the inquiry form.");
  let text = ""; let size = 0; const decoder = new TextDecoder();
  try {
    while (true) {
      const { value, done } = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > 24000) { await reader.cancel(); return fail("Your inquiry is too long.", 413); }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
  } catch { return fail("Your inquiry could not be read."); }
  finally { reader.releaseLock(); }
  let data: Record<string, unknown>;
  try { data = JSON.parse(text); if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error(); }
  catch { return fail("Please complete the inquiry form."); }
  if (data.fax) return fail("Your inquiry could not be accepted.");
  const limits = { name: 150, email: 254, company: 200, website: 2048, phone: 40, subject: 200, message: 4000 };
  const input: Record<string, string> = {};
  for (const [key, max] of Object.entries(limits)) {
    if (data[key] !== undefined && typeof data[key] !== "string") return fail("Please check your form fields.");
    input[key] = ((data[key] as string) || "").trim();
    if (input[key].length > max || (key !== "message" && /[\r\n\x00]/.test(input[key]))) return fail(`Please check the ${key} field.`);
  }
  const required = contact ? ["name", "email", "subject", "phone", "message"] : ["name", "email", "message"];
  if (required.some(key => !input[key])) return fail("Please complete all required fields.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) return fail("Please enter a valid email address.");
  if (input.website) { try { if (!["http:", "https:"].includes(new URL(input.website).protocol)) throw new Error(); } catch { return fail("Please enter a website beginning with https:// or leave it empty."); } }
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) return fail("Online inquiries are temporarily unavailable. Please contact our team by email or phone.", 503);
  const recipients = contact ? ["info@emeraldisle.lk"] : ["bd@emeraldisle.lk", "admin@emerldisle.lk"];
  const port = Number(process.env.SMTP_PORT || 465);
  const transport = nodemailer.createTransport({ host: process.env.SMTP_HOST, port, secure: port === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }, connectionTimeout: 10000, socketTimeout: 20000 });
  try {
    const result = await transport.sendMail({ from: process.env.APPLICATIONS_EMAIL_FROM || process.env.SMTP_USER, to: recipients, replyTo: input.email,
      subject: `${contact ? "Contact" : "Employer"} inquiry: ${input.subject || "Hiring needs"}`, text: Object.entries(input).map(([key, value]) => `${key}: ${value || "Not provided"}`).join("\n\n") });
    if (result.rejected?.length || result.accepted?.length !== recipients.length) return fail("Delivery could not be confirmed for every inbox. Please contact our team before resubmitting.", 502);
    return NextResponse.json({ message: "Your inquiry has been sent. Our team will be in touch." });
  } catch { return fail("We could not send your inquiry. Please try again or contact our team by email.", 502); }
  finally { transport.close(); }
}
