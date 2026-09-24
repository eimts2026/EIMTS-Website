import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendApplicationEmail } from "@/lib/email";

const allowedTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

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

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > 6 * 1024 * 1024) {
    return failure("Your application is too large.", 413);
  }
  const formData = await request.formData();
  const jobId = String(formData.get("job_id") || "");
  const fullName = String(formData.get("name") || "").trim();
  const age = Number(formData.get("age"));
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const cv = formData.get("cv");

  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      jobId,
    )
  ) {
    return failure("This vacancy is not yet accepting online applications.");
  }
  if (!fullName || !email || !Number.isInteger(age) || age < 18 || age > 99) {
    return failure("Please complete all required application details.");
  }
  if (!(cv instanceof File) || !cv.size) {
    return failure("Please attach your CV.");
  }
  if (cv.size > 5 * 1024 * 1024) {
    return failure("Your CV must be 5 MB or smaller.");
  }
  if (!allowedTypes.has(cv.type)) {
    return failure("Please upload a PDF, DOC or DOCX CV.");
  }

  const supabase = createClient(url, publishableKey, {
    auth: { persistSession: false },
  });

  // The vacancy is resolved from the database rather than the submitted form,
  // so the stored application and the recruitment email always name the real
  // job. Visitors only ever see published, unexpired vacancies, so a missing
  // row also means the vacancy closed between opening the page and applying —
  // catching it here avoids uploading a CV the insert would then reject.
  const { data: job } = await supabase
    .from("jobs")
    .select("title")
    .eq("id", jobId)
    .maybeSingle();

  if (!job) {
    return failure("This vacancy is no longer accepting online applications.");
  }

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
  const cvPath = `${jobId}/${crypto.randomUUID()}.${extension}`;
  const bytes = await cv.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from("candidate-cvs")
    .upload(cvPath, bytes, {
      contentType: cv.type,
      upsert: false,
    });

  if (uploadError) {
    return failure(
      "We could not upload your CV. Please try again or email cv@emeraldisle.lk.",
      500,
    );
  }

  const { error: applicationError } = await supabase
    .from("applications")
    .insert({
      job_id: jobId,
      full_name: fullName,
      age,
      email,
      phone: phone || null,
      cv_path: cvPath,
    });

  if (applicationError) {
    await supabase.storage.from("candidate-cvs").remove([cvPath]);
    return failure(
      "We could not save your application. Please email cv@emeraldisle.lk.",
      500,
    );
  }

  // Forward the application to the recruitment inboxes with the CV attached.
  // The application is already saved above, so an email failure must not
  // fail the candidate's submission — it is logged for follow-up instead.
  try {
    const result = await sendApplicationEmail({
      jobTitle: job.title,
      fullName,
      age,
      email,
      phone: phone || null,
      cvFileName: cv.name,
      cvContentType: cv.type,
      cvBytes: bytes,
    });
    if (!result.sent) {
      console.warn("Application email skipped:", result.reason);
    }
  } catch (error) {
    console.error("Application email failed:", error);
  }

  return NextResponse.json({
    message: "Application submitted successfully.",
  });
}
