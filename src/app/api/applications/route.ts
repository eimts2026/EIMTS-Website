import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendApplicationEmail, isEmailConfigured } from "@/lib/email";

import { ApplicationInputError, readApplicationForm, validateApplication } from "@/lib/application-input";

function failure(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) {
    return failure(
      "Online applications are being configured. Please email your CV to cv@emeraldisle.lk.",
      503,
    );
  }

  if (!isEmailConfigured()) return failure("Applications are temporarily unavailable. Please email your CV to cv@emeraldisle.lk.", 503);

  let input: ReturnType<typeof validateApplication>;
  try {
    input = validateApplication(await readApplicationForm(request));
  } catch (error) {
    return error instanceof ApplicationInputError
      ? failure(error.message, error.status)
      : failure("Your application could not be read. Please try again.");
  }
  const { jobId, fullName, age, email, phone, cv } = input;

  const extension = cv.type === "application/pdf"
    ? "pdf"
    : cv.type === "application/msword"
      ? "doc"
      : "docx";
  const header = new Uint8Array(await cv.slice(0, 8).arrayBuffer());
  const isPdf = cv.type === "application/pdf" &&
    new TextDecoder().decode(header.slice(0, 5)) === "%PDF-";
  const isOffice = cv.type === "application/msword"
    ? header[0] === 0xd0 && header[1] === 0xcf && header[2] === 0x11 && header[3] === 0xe0
    : cv.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      && header[0] === 0x50 && header[1] === 0x4b && header[2] === 0x03 && header[3] === 0x04;
  if (!isPdf && !isOffice) {
    return failure("The CV contents do not match the selected file type.");
  }

  const supabase = createClient(url, publishableKey, {
    auth: { persistSession: false },
  });

  // Resolve trusted vacancy details from the database.
  const { data: job } = await supabase
    .from("jobs")
    .select("title,category")
    .eq("id", jobId)
    .eq("status", "published")
    .or(`expires_at.is.null,expires_at.gte.${new Date().toISOString()}`)
    .maybeSingle();

  if (!job) {
    return failure("This vacancy is no longer accepting online applications.");
  }

  try {
    const result = await sendApplicationEmail({
      jobTitle: job.title,
      category: job.category || "General recruitment",
      fullName,
      age,
      email,
      phone,
      cvFileName: `candidate-cv.${extension}`,
      cvContentType: cv.type,
      cvBytes: await cv.arrayBuffer(),
    });
    if (!result.sent) {
      return failure("We could not send your application. Please try again or email cv@emeraldisle.lk.", 503);
    }
  } catch (error) {
    console.error("Application email failed", { code: (error as { code?: string }).code || "delivery_failed" });
    return failure("We could not send your application. Please try again or email cv@emeraldisle.lk.", 502);
  }

  return NextResponse.json({
    message: "Your application and CV have been sent to cv@emeraldisle.lk.",
  });
}
