import { verifyBotProtection, SubmissionError } from "./bot-protection";
import { limitSubmission } from "./submission-service";
import { queueInquiry } from "./inquiry-queue";
import { NextResponse } from "next/server";
const fail = (message: string, status = 400) => NextResponse.json({ message }, { status });

export async function handleInquiry(request: Request, contact = false) {
  try { await verifyBotProtection(request, contact ? "contact" : "employer"); }
  catch (error) { return error instanceof SubmissionError ? fail(error.message, error.status) : fail("Verification unavailable.", 503); }
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
  const required = contact ? ["name", "email", "subject", "phone", "message"] : ["name", "email", "phone", "message"];
  if (required.some(key => !input[key])) return fail("Please complete all required fields.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) return fail("Please enter a valid email address.");
  if (input.website) { try { if (!["http:", "https:"].includes(new URL(input.website).protocol)) throw new Error(); } catch { return fail("Please enter a website beginning with https:// or leave it empty."); } }
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) return fail("Online inquiries are temporarily unavailable. Please contact our team by email or phone.", 503);
  try {
    await limitSubmission(request, input.email, "inquiry");
    const reference = await queueInquiry(request, contact ? "contact" : "employer", input);
    return NextResponse.json({ message: "Your inquiry has been received. Our team will be in touch.", reference }, {status: 202});
  } catch(error) { return error instanceof SubmissionError ? fail(error.message,error.status) : fail("Your inquiry could not be saved. Please try again.",503); }
}
