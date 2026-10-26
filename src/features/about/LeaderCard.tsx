"use client";

import { useId, useState } from "react";

export type Leader = {
  name: string;
  role: string;
  initials: string;
  image?: string;
  linkedinUrl?: string;
};

export default function LeaderCard({ leader }: { leader: Leader }) {
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const linkedinUrl = leader.linkedinUrl?.trim();

  return (
    <article
      className="ei-leader-card"
      data-open={open}
      aria-label={`${leader.name}, ${leader.role}`}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse" && !event.currentTarget.contains(document.activeElement)) setOpen(false);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setOpen(false);
          event.currentTarget.querySelector<HTMLButtonElement>("button")?.focus();
        }
      }}
    >
      <div className="ei-leader-portrait">
        {leader.image
          ? <img src={leader.image} alt="" width="640" height="800" loading="lazy" />
          : <span className="ei-leader-placeholder" aria-hidden="true">{leader.initials}</span>}
      </div>
      <button
        type="button"
        className="ei-leader-toggle"
        aria-expanded={open}
        aria-controls={detailsId}
        aria-label={`${open ? "Hide" : "Show"} details for ${leader.name}`}
        onClick={() => setOpen((value) => !value)}
      >
      </button>
      <div id={detailsId} className="ei-leader-details" aria-hidden={!open} inert={!open}>
        <h3>{leader.name}</h3>
        <p>{leader.role}</p>
        {linkedinUrl && (
          <a className="ei-leader-linkedin" href={linkedinUrl} target="_blank" rel="noopener noreferrer">
            <span aria-hidden="true">in</span> <span className="ei-leader-linkedin-label">LinkedIn</span>
            <span className="sr-only"> profile for {leader.name} (opens in a new tab)</span>
            <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </article>
  );
}
