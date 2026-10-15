import { InquiryForm } from "./InquiryForm";
export function EmployerInquiryForm({ headingId = "employer-inquiry-title" }: { headingId?: string }) {
  return <InquiryForm headingId={headingId} />;
}
