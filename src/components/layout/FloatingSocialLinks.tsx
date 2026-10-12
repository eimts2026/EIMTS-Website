"use client";
import { useEffect, useRef, useState } from "react";
import "./FloatingSocialLinks.css";
type SocialName = "facebook" | "youtube" | "linkedin" | "whatsapp";

function SocialIcon({ name }: { name: SocialName }) {
  if (name === "facebook") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8.5V6.8c0-.8.5-1 1-1h2.5V2.1L14.1 2C10.8 2 9 4 9 6.5v2H6v4h3V22h5v-9.5h3.3l.6-4H14Z" /></svg>;
  if (name === "youtube") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" /></svg>;
  if (name === "linkedin") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.3 7.3H1.7V22h3.6V7.3ZM3.5 2A2.1 2.1 0 1 0 3.5 6.2 2.1 2.1 0 0 0 3.5 2ZM22 13.6c0-4.4-2.4-6.5-5.6-6.5a4.8 4.8 0 0 0-4.3 2.4h-.1V7.3H8.6V22h3.6v-7.3c0-1.9.4-3.8 2.8-3.8 2.4 0 2.4 2.2 2.4 3.9V22H22v-8.4Z" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5A10.5 10.5 0 0 0 3.3 15.7L2 22l6.5-1.7A10.5 10.5 0 1 0 20.5 3.5ZM12 20.2a8.1 8.1 0 0 1-3.9-1l-.3-.2-3.5.9.9-3.4-.2-.3A8.1 8.1 0 1 1 12 20.2Zm4.4-6c-.2-.1-1.4-.7-1.6-.7-.2-.1-.4-.1-.5.1s-.6.7-.8.9c-.1.2-.3.2-.5.1-1.3-.7-2.1-1.2-2.9-2.8-.2-.2 0-.4.1-.5l.4-.5c.1-.1.1-.3.2-.4 0-.2-.1-.3-.1-.4l-.7-1.6c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.7 2.7 4.2 3.7.6.3 1 .4 1.4.5.6.2 1.1.2 1.5.1.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.2-1.2 0-.1-.2-.2-.4-.3Z" /></svg>;
}

const socials: Array<{ name: SocialName; label: string; href: string }> = [
  { name: "youtube", label: "YouTube", href: "https://www.youtube.com/@EmeraldIsleManpower" },
  { name: "facebook", label: "Facebook", href: "https://www.facebook.com/EmeraldIsleRecruitment" },
  { name: "linkedin", label: "LinkedIn", href: "https://lk.linkedin.com/company/emeraldislerecruitment" },
  { name: "whatsapp", label: "WhatsApp", href: "https://api.whatsapp.com/send?phone=94773876467" },
];

export function FloatingSocialLinks() {
  const [open, setOpen] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const emiRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    let frame = 0;
    const sample = () => {
      frame = 0;
      const link = emiRef.current;
      if (!link) return;
      const rect = link.getBoundingClientRect();
      const x = Math.min(innerWidth - 1, Math.max(0, rect.left + 40));
      const y = Math.min(innerHeight - 1, Math.max(0, rect.top + rect.height / 2));
      const underneath = document.elementsFromPoint(x, y).find(el => !link.contains(el) && el !== link);
      let el: Element | null = underneath ?? null;
      while (el) {
        const color = getComputedStyle(el).backgroundColor.match(/[\d.]+/g)?.map(Number);
        if (color && color.length >= 3 && (color[3] === undefined || color[3] > .8)) {
          setOnDark((color[0] * .299 + color[1] * .587 + color[2] * .114) < 140);
          return;
        }
        el = el.parentElement;
      }
      setOnDark(false);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(sample); };
    sample();
    const initialSample = window.setTimeout(schedule, 350);
    window.addEventListener("load", schedule);
    window.addEventListener("scroll", schedule, {passive:true});
    window.addEventListener("resize", schedule);
    return () => {clearTimeout(initialSample);cancelAnimationFrame(frame);window.removeEventListener("load",schedule);window.removeEventListener("scroll",schedule);window.removeEventListener("resize",schedule);};
  }, []);
  const dockRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!dockRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggleRef.current?.focus(); }
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const resize = () => { if (desktop.matches) setOpen(false); };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", escape);
    desktop.addEventListener("change", resize);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", escape);
      desktop.removeEventListener("change", resize);
    };
  }, [open]);
  return <>
    <a
      ref={emiRef}
      className={"ei-whatsapp-bot" + (onDark ? " is-on-dark" : "")}
      href="https://wa.me/94765606454?text=Hi%20EMI%2C%20I%20need%20some%20guidance."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Ask EMI, our AI guide on WhatsApp (opens in a new tab)"
    >
      <span className="ei-whatsapp-bot-copy"><strong>Ask from EMI</strong><span>WhatsApp AI guide ↗</span></span>
      <img className="ei-emi-avatar" src="/assets/emi-guide.webp" alt="EMI, your virtual recruitment guide" width="96" height="112" />
    </a>
    <aside className="ei-social-tabs" aria-label="Follow Emerald Isle">
      {socials.map((social) => <a className={`ei-social-link ei-social-link--${social.name}`} href={social.href} aria-label={`Emerald Isle on ${social.label}`} target="_blank" rel="noreferrer" key={social.name}><span>{social.label}</span><SocialIcon name={social.name} /></a>)}
    </aside>
    <div className={`ei-social-dock${open ? " is-open" : ""}`} ref={dockRef} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false); }}>
      <nav className="ei-social-dock-links" id="social-dock-links" aria-label="Social media" inert={!open}>
        {socials.map((social, index) => <a style={{ transitionDelay: open ? `${index * 50}ms` : "0ms" }} className={`ei-social-link ei-social-link--${social.name}`} href={social.href} aria-label={`Emerald Isle on ${social.label}`} target="_blank" rel="noreferrer" key={social.name} onClick={() => setOpen(false)}><span>{social.label}</span><SocialIcon name={social.name} /></a>)}
      </nav>
      <button className="ei-social-toggle" ref={toggleRef} type="button" aria-label={open ? "Close social links" : "Open social links"} aria-expanded={open} aria-controls="social-dock-links" onClick={() => setOpen(!open)}>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {open ? <path d="m6 6 12 12M18 6 6 18" /> : <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4" /></>}
        </svg>
      </button>
    </div>
  </>;
}
