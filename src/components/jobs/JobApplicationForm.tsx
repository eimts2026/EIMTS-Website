"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

import { APPLICATION_ACCEPT, MAX_CV_BYTES } from "@/lib/application-input";
import "./JobApplicationForm.css";
import { BotProtection } from "@/components/ui/BotProtection";

export function JobApplicationForm({ jobId, className }: { jobId: string; className?: string }) {
  const submitting = useRef(false);
  const [botToken, setBotToken] = useState("");
  const [botReset, setBotReset] = useState(0);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

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
    if (cv.size > MAX_CV_BYTES) {
      setMessage("Your CV must be 3 MB or smaller. For a larger CV, email cv@emeraldisle.lk.");
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

  return (
    <div className="application-card" data-sent={sent}>
    <div className="application-card-turn">
    <form className={className || "job-application-form"} onSubmit={submit} inert={sent} aria-hidden={sent}>
      {/* The vacancy title is resolved server-side from this id. */}
      <input type="hidden" name="job_id" value={jobId} />
      <label>
        Full name
        <input name="name" autoComplete="name" minLength={2} maxLength={150} required />
      </label>
      <label>
        Age
        <input name="age" type="number" min="18" max="99" inputMode="numeric" required />
      </label>
      <label>
        Email
        <input name="email" type="email" autoComplete="email" maxLength={254} required />
      </label>
      <label>
        Phone *
        <input name="phone" type="tel" autoComplete="tel" maxLength={40} required />
      </label>
      <label>
        CV (PDF, DOC or DOCX · maximum 3 MB)
        <input
          name="cv"
          type="file"
          accept={APPLICATION_ACCEPT}
          required
          disabled={busy}
        />
      </label>
      <p className="application-upload-note">Larger CV? Email <a href="mailto:cv@emeraldisle.lk">cv@emeraldisle.lk</a> with the vacancy title.</p>
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
