export const MAX_CV_BYTES = 3 * 1024 * 1024;
export const MAX_APPLICATION_BYTES = 4 * 1024 * 1024;
export const APPLICATION_ACCEPT = ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export class ApplicationInputError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

/** Bound the actual stream before multipart parsing, including chunked requests. */
export async function readApplicationForm(request: Request): Promise<FormData> {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().startsWith("multipart/form-data;")) {
    throw new ApplicationInputError("Send your application using the application form.", 415);
  }
  const declared = request.headers.get("content-length");
  if (declared && (!/^\d+$/.test(declared) || Number(declared) > MAX_APPLICATION_BYTES)) {
    throw new ApplicationInputError("Your application is too large.", 413);
  }
  if (!request.body) throw new ApplicationInputError("Your application is empty.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const {done, value} = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_APPLICATION_BYTES) {
        void reader.cancel().catch(() => undefined);
        throw new ApplicationInputError("Your application is too large.", 413);
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  try {
    return await new Response(bytes, {headers: {"content-type": contentType}}).formData();
  } catch {
    throw new ApplicationInputError("Your application could not be read. Please try again.");
  }
}

export function validateApplication(form: FormData) {
  const field = (key: string, max: number) => {
    const values = form.getAll(key);
    const raw = values[0] ?? "";
    if (values.length > 1 || typeof raw !== "string" || raw.length > max || /[\u0000-\u001f\u007f]/.test(raw)) {
      throw new ApplicationInputError("Please enter valid application details.");
    }
    return raw.trim();
  };
  const jobId = field("job_id", 36);
  const fullName = field("name", 150);
  const email = field("email", 254);
  const phone = field("phone", 40);
  const nic = field("nic", 12).toUpperCase();
  if (!/^(?:[0-9]{9}[VX]|[0-9]{12})$/.test(nic)) throw new ApplicationInputError("Enter a valid NIC number.");
  const ageText = field("age", 2);
  const age = Number(ageText);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(jobId)) {
    throw new ApplicationInputError("This vacancy is not yet accepting online applications.");
  }
  if (fullName.length < 2 || !/^\d{2}$/.test(ageText) || age < 18 || age > 99) {
    throw new ApplicationInputError("Please complete all required application details.");
  }
  if (!/^[^\s@<>(),;:\\"]+@[^\s@<>(),;:\\"]+\.[^\s@<>(),;:\\"]+$/.test(email)) {
    throw new ApplicationInputError("Please enter a valid email address.");
  }
  if (!/^\+?[\d ()\-.]{6,40}$/.test(phone) || phone.replace(/\D/g, "").length < 6) {
    throw new ApplicationInputError("Please enter a valid phone number.");
  }
  const cv = form.get("cv");
  if (form.getAll("cv").length !== 1 || !(cv instanceof File) || !cv.size) {
    throw new ApplicationInputError("Please attach your CV.");
  }
  if (cv.size > MAX_CV_BYTES) throw new ApplicationInputError("Your CV must be 3 MB or smaller. For a larger CV, email cv@emeraldisle.lk.");
  if (!["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(cv.type)) {
    throw new ApplicationInputError("Please upload a PDF, DOC or DOCX CV.");
  }
  return {jobId, fullName, email, phone, age, nic, cv};
}
