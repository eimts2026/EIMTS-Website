"use client";

import { useEffect, useState } from "react";
import { InquiryForm } from "./InquiryForm";
import "./InquiryForm.css";

export function ContactInquiryForm() {
  const [kind, setKind] = useState<"contact" | "employer">("contact");
  useEffect(() => {
    const sync = () => setKind(new URLSearchParams(window.location.search).get("inquiry") === "employer" ? "employer" : "contact");
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  return <div id="contact-inquiry" className="contact-inquiry-options">
    <fieldset className="inquiry-audience">
      <legend>How can we help you?</legend>
      <div className="inquiry-audience-choices">
        <label><input type="radio" name="inquiry-audience" value="contact" checked={kind === "contact"} onChange={() => setKind("contact")} /><span><strong>Job seeker</strong><small>Ask about jobs and recruitment</small></span></label>
        <label><input type="radio" name="inquiry-audience" value="employer" checked={kind === "employer"} onChange={() => setKind("employer")} /><span><strong>Client or employer</strong><small>Discuss your hiring requirements</small></span></label>
      </div>
    </fieldset>
    <InquiryForm key={kind} kind={kind} />
  </div>;
}
