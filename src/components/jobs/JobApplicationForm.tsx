"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";

import { APPLICATION_ACCEPT, MAX_CV_BYTES } from "@/lib/application-input";
import "./JobApplicationForm.css";
import { BotProtection } from "@/components/ui/BotProtection";

export function JobApplicationForm({ jobId, className }: { jobId: string; className?: string }) {
  const submitting = useRef(false);
  const cvInput = useRef<HTMLInputElement>(null);
  const [botToken, setBotToken] = useState("");
  const [botReset, setBotReset] = useState(0);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [selectedCv, setSelectedCv] = useState("");

  const [sent, setSent] = useState(false);
  useEffect(() => {
    if (!sent) return;
    const timer = window.setTimeout(() => { setSent(false); setMessage(""); }, 2000);
    return () => window.clearTimeout(timer);
  }, [sent]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || sent) return;
    if (!botToken) { setMessage("Please complete the spam protection check."); return; }
    const form = event.currentTarget;
    const formData = new FormData(form);
    const cv = formData.get("cv");

    if (!(cv instanceof File) || !cv.size) {
      setMessage("Please attach your CV.");
      return;
    }
    if (!["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(cv.type)) {
      setMessage("That file type is not supported. Please choose a PDF, DOC or DOCX file.");
      return;
    }
    if (cv.size > MAX_CV_BYTES) {
      setMessage("Your CV must be 4 MB or smaller. For a larger CV, email cv@emeraldisle.lk.");
      return;
    }

    submitting.current = true;
    setBusy(true);
    setMessage("Sending your application…");

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        body: formData,
        headers: { "x-turnstile-token": botToken },
      });
      const result = await response.json().catch(() => ({ message: response.status === 413 ? "This upload exceeds the server limit. Please email your CV to cv@emeraldisle.lk." : "We could not send your application. Please try again." })) as { message?: string };
      if (!response.ok) throw new Error(result.message || "We could not submit your application.");
      form.reset();
      setSelectedCv("");
      setMessage("Your application and CV have been sent to cv@emeraldisle.lk.");
      setSent(true);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "We could not submit your application.",
      );
    } finally {
      submitting.current = false;
      setBusy(false);
      setBotReset(value => value + 1);
    }
  }

  function handleCvChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    setSelectedCv(file?.name || "");
    if (!file) {
      setMessage("");
    } else if (!["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)) {
      setMessage("That file type is not supported. Please choose a PDF, DOC or DOCX file.");
    } else if (file.size > MAX_CV_BYTES) {
      setMessage("Your CV must be 4 MB or smaller. For a larger CV, email cv@emeraldisle.lk.");
    } else {
      setMessage("");
    }
  }

  function removeCv() {
    if (cvInput.current) cvInput.current.value = "";
    setSelectedCv("");
    setMessage("");
  }

  return (
    <div className="application-card" data-sent={sent}>
    <div className="application-card-turn">
    <form className={className || "job-application-form"} onSubmit={submit} inert={sent} aria-hidden={sent}>
      {/* The vacancy title is resolved server-side from this id. */}
      <input type="hidden" name="job_id" value={jobId} />
      <fieldset className="application-fields">
      <legend>Personal details</legend>
      <label className="application-field-wide">
        Full name
        <input name="name" autoComplete="name" minLength={2} maxLength={150} required />
      </label>
      <label>
        Age
        <input name="age" type="number" min="18" max="99" inputMode="numeric" required />
      </label>
      <label>NIC number<input name="nic" autoComplete="off" maxLength={12} pattern="([0-9]{9}[VvXx]|[0-9]{12})" title="9 digits followed by V or X, or 12 digits" required /></label>
      </fieldset>
      <fieldset className="application-fields application-contact-fields">
      <legend>Contact details</legend>
      <label>
        Email
        <input name="email" type="email" autoComplete="email" maxLength={254} required />
      </label>
      <label>
        Phone
        <input name="phone" type="tel" autoComplete="tel" maxLength={40} required />
      </label>
      </fieldset>
      <div className="application-cv-field">
        <span className="application-cv-label">Your CV</span>
        <div className="application-upload-widget">
          <label htmlFor="application-cv" className="application-upload-dropzone">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 10V9a5 5 0 0 1 10 0v1a5 5 0 0 1 2 9M7 10a5 5 0 0 0-2 9m7-7v9m0-9 3 3m-3-3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <strong>{selectedCv ? "Change your CV" : "Upload your CV"}</strong>
            <span>PDF, DOC or DOCX · Max 4 MB</span>
          </label>
        <input
          id="application-cv"
          className="application-upload-input"
          ref={cvInput}
          name="cv"
          type="file"
          accept={APPLICATION_ACCEPT}
          required
          disabled={busy}
          onChange={handleCvChange}
        />
          <div className="application-upload-footer">
            <svg className="application-upload-file-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 3.75h7l4.25 4.5v12H7zM14 3.75v4.5h4.25M10 13h5m-5 3h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span className="application-cv-name">{selectedCv || "No file selected"}</span>
            {selectedCv && <button className="application-cv-remove" type="button" onClick={removeCv} disabled={busy} aria-label="Remove selected CV"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4.5 7h15M9 7V4.5h6V7m-8.5 0 .8 13h9.4l.8-13M10 10.5v6m4-6v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>}
            <label htmlFor="application-cv" className="application-upload-browse">Browse</label>
          </div>
        </div>
      </div>
      <p className="application-upload-note">Larger CV? Email <a href="mailto:cv@emeraldisle.lk"><strong>cv@emeraldisle.lk</strong></a> with the vacancy title.</p>
      <p className="application-upload-note">Read our <a href="/privacy-policy/">privacy policy</a> to learn how we handle your application.</p>
      <BotProtection action="application" resetKey={botReset} onToken={setBotToken} />
      <button type="submit" disabled={busy || !botToken} aria-busy={busy}>
        {busy && <svg data-submit-spinner viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /></svg>}
        <span>{busy ? "Submitting…" : "Apply for this vacancy"}</span>
        {!busy && <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>}
      </button>
      {message && !sent && <p role="alert">{message}</p>}
    </form>
    <div className="application-card-success" aria-hidden={!sent}><span aria-hidden="true">✓</span><h3>Application sent</h3><p>Your details and CV have been sent to<br /><strong>cv@emeraldisle.lk</strong></p></div>
    </div>
    <p className="application-announcement" role="status">{sent ? message : ""}</p>
    <small className="application-registration">Candidates must complete online registration by clicking <a href="https://registration.emeraldislemanpower.com/">Register now</a> in the menu. The online registration fee is Rs. 300.</small>
    </div>
  );
}
