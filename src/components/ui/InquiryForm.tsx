"use client";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import "./InquiryForm.css";
import { BotProtection } from "./BotProtection";
import BootstrapIcon from "./BootstrapIcon";
export function InquiryForm({ kind = "employer", headingId }: { kind?: "employer" | "contact"; headingId?: string }) {
  const id = useId();
  const [botToken, setBotToken] = useState("");
  const [botReset, setBotReset] = useState(0);
  const submissionId = useRef<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const confirmation = useRef<HTMLDivElement>(null);
  const submitting = useRef(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const contact = kind === "contact";
  const titleId = headingId || `${id}-title`;
  function returnToForm() { setStatus("idle"); setFeedback(""); requestAnimationFrame(() => formRef.current?.querySelector<HTMLInputElement>('input[name="name"]')?.focus({ preventScroll: true })); }
  useEffect(() => {
    if (status !== "success") return;
    confirmation.current?.focus({ preventScroll: true });
    const timer = setTimeout(() => { setStatus("idle"); setFeedback(""); formRef.current?.querySelector<HTMLInputElement>('input[name="name"]')?.focus({ preventScroll: true }); }, 6000);
    return () => clearTimeout(timer);
  }, [status]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    if (!botToken) { setStatus("error"); setFeedback("Please complete the spam protection check."); return; }
    submissionId.current ??= crypto.randomUUID();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    submitting.current = true; setStatus("sending"); setFeedback("");
    try {
      const response = await fetch(`/api/${contact ? "contact" : "employer"}-inquiry`, { method: "POST", body: JSON.stringify(payload), headers: { "Content-Type": "application/json", "x-turnstile-token": botToken, "Idempotency-Key": submissionId.current } });
      const result = await response.json();
      if (response.status === 409) submissionId.current = null;
      if (!response.ok) throw new Error(result.message || "We could not send your inquiry. Please try again.");
      const confirmationMessage = result.delivery === "accepted"
        ? "Your inquiry was accepted by our email service and sent to the team. We’ll be in touch."
        : result.delivery === "retrying"
          ? "Your inquiry was saved, but email delivery is delayed. We’re retrying it now; email info@emeraldislemanpower.com if your request is urgent."
          : result.delivery === "attention"
            ? "Your inquiry was saved, but email delivery needs attention. Please email info@emeraldislemanpower.com so we can respond promptly."
            : "Your inquiry was saved and is waiting for email processing. Email info@emeraldislemanpower.com if your request is urgent.";
      form.reset(); submissionId.current = null; setFeedback(confirmationMessage); setStatus("success");
    } catch (error) { setStatus("error"); setFeedback(error instanceof Error ? error.message : "Connection interrupted. Please try again."); }
    finally { submitting.current = false; setBotReset(value => value + 1); }
  }
  const employerFields = [
    { name: "name", label: "Your name", placeholder: "Full name", required: true, autoComplete: "name", maxLength: 150 },
    { name: "email", label: "Company email", placeholder: "name@company.com", type: "email", required: true, autoComplete: "email", maxLength: 254 },
    { name: "company", label: "Company", placeholder: "Company name", required: false, autoComplete: "organization", maxLength: 200 },
    { name: "website", label: "Company website", placeholder: "https://company.com", type: "url", required: false, autoComplete: "url", maxLength: 2048 },
    { name: "phone", label: "Phone", placeholder: "+94", type: "tel", required: true, autoComplete: "tel", maxLength: 40 },
    { name: "subject", label: "Workforce requirement", placeholder: "20 hospitality staff for Dubai", required: false, maxLength: 200 },
  ];
  const contactFields = [
    { name: "name", label: "Name", placeholder: "Full name", required: true, autoComplete: "name", maxLength: 150 },
    { name: "email", label: "Email", placeholder: "you@example.com", type: "email", required: true, autoComplete: "email", maxLength: 254 },
    { name: "subject", label: "Subject", placeholder: "What would you like to discuss?", required: true, maxLength: 200 },
    { name: "phone", label: "Phone", placeholder: "+94", type: "tel", required: true, autoComplete: "tel", maxLength: 40 },
  ];
  const success = status === "success";
  return <div className={`secure-inquiry-card ${contact ? "secure-inquiry-contact" : ""}`}>
    <div className={`inquiry-flip-inner ${success ? "is-flipped" : ""}`}>
      <div className="inquiry-flip-front" inert={success} aria-hidden={success}>
        <form ref={formRef} className="secure-inquiry-form flex flex-col gap-4" onSubmit={submit} aria-labelledby={titleId} aria-busy={status === "sending"}>
          <div className="secure-inquiry-heading"><p className="section-kicker">Send an inquiry</p><h2 id={titleId}>{contact ? "How can we help?" : "Tell us about your hiring needs."}</h2><p>{contact ? "Reach our recruitment and employer teams. Send us a message." : "Share the essentials and our employer team will help shape the next step."}</p></div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{(contact ? contactFields : employerFields).map(({ label, ...field }) => <div className="flex flex-col gap-2" key={field.name}><label htmlFor={`${id}-${field.name}`}>{label} <span className="inquiry-field-hint">{field.required ? "*" : "Optional"}</span></label><input {...field} id={`${id}-${field.name}`} disabled={status === "sending"} /></div>)}</div>
          <div className="flex flex-col gap-2"><label htmlFor={`${id}-message`}>{contact ? "Comment" : "How can we help?"} <span className="inquiry-field-hint">*</span></label><textarea id={`${id}-message`} required name="message" maxLength={4000} rows={3} disabled={status === "sending"} placeholder={contact ? "Tell us what you need help with." : "Locations, target dates, roles and anything else we should know."} /></div>
          <div className="form-honeypot" aria-hidden="true"><label>Leave this empty<input name="fax" tabIndex={-1} autoComplete="off" /></label></div>
          <BotProtection action={kind} resetKey={botReset} onToken={setBotToken} />
          <div className="inquiry-form-footer"><button className="secure-inquiry-submit" type="submit" disabled={status === "sending" || !botToken}>{status === "sending" ? "Sending inquiry…" : "Send inquiry"}<span aria-hidden="true"><BootstrapIcon name="arrow-up-right" /></span></button><small>{contact ? "All fields are required." : "Fields marked * are required."}</small></div>
          <p className="secure-inquiry-error" role="alert">{status === "error" ? feedback : ""}</p>
          {contact && <p className="inquiry-email-alternative">Or email <a href="mailto:info@emeraldisle.lk">info@emeraldisle.lk</a></p>}
        </form>
      </div>
      <div ref={confirmation} className="inquiry-flip-back" inert={!success} aria-hidden={!success} tabIndex={-1} role="status" aria-live="polite">
        <span className="inquiry-success-mark" aria-hidden="true">✓</span><h2>Inquiry received.</h2><p>{success ? feedback : "Our team will be in touch."}</p><small>Thank you for Reaching Emerald isle Manpower.</small><button type="button" onClick={returnToForm}>Back to form</button>
      </div>
    </div>
  </div>;
}
