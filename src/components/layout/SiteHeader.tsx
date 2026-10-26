"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

const routes = {
  home: "/",
  about: "/about-us-emerald-isle-manpower/",
  jobs: "/foreign-job-vacancies/",
  employer: "/client-recruitment-solutions/",
  projects: "/projects/",
  blog: "/insightful-and-engaging-blog-posts-discover-our-latest-articles/",
  faq: "/emerald-isle-manpower-faq/",
  contact: "/contact/",
};

const jobGroups = [
  { title: "Engineering", links: ["Automotive / Vehicle Maintenance / Service & Repair", "Marine / Aviation / Watersports", "Construction / Skilled Trades", "General Labour / Cleaners", "Agricultural / Gardening", "Engineering / Technical", "Transport / Driving", "Security / Safety"] },
  { title: "Retail, Admin & Accounts", links: ["Accounting / Auditing / Finance", "Logistic / Warehouse / Transport", "Sales / Marketing / Merchandise", "Secretary / Admin", "HR / Training", "Retail"] },
  { title: "Hospitality & Healthcare", links: ["Hotel / Restaurant / Food", "Spa / Beauty / Salon", "Healthcare"] },
];

function Caret() {
  return <span className="nav-caret" aria-hidden="true" />;
}

function JobMegaMenu({ onClose }: { onClose?: () => void }) {
  return (
    <div className="jobs-mega-menu" aria-label="Job categories">
      <div className="jobs-mega-grid">
        {jobGroups.map((group) => (
          <section className="mega-column" key={group.title}>
            <h2>{group.title}</h2>
            {group.links.map((label) => (
              <a
                href={routes.jobs + "?filter-category=" + encodeURIComponent(label)}
                key={label}
                onClick={onClose}
              >
                {label}
              </a>
            ))}
          </section>
        ))}
        <section className="mega-column mega-candidate-desk">
          <h2>Candidate desk</h2>
          <a className="mega-highlight" href={routes.blog} onClick={onClose}>Career advice</a>
          <a href={routes.jobs} onClick={onClose}>All foreign vacancies</a>
          <a href="https://registration.emeraldislemanpower.com/" onClick={onClose}>Register as a job seeker</a>
        </section>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const contactMenuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const mobileTimeline = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const root = mobileMenuRef.current;
    if (!root) return;
    const context = gsap.context(() => {
      const panel = root.querySelector<HTMLElement>("nav")!;
      const lines = root.querySelectorAll(".mobile-icon-line");
      const items = Array.from(panel.children);
      gsap.set(panel, { autoAlpha: 0, y: -8, clipPath: "inset(0 0 100% 0 round 18px)" });
      gsap.set(items, { opacity: 0, y: 12 });
      mobileTimeline.current = gsap.timeline({ paused: true, defaults: { ease: "power3.out", easeReverse: "power2.out" } })
        .to(lines[1], { scaleX: 0, opacity: 0, duration: 0.14 }, 0)
        .to(lines[0], { y: 6, duration: 0.16 }, 0)
        .to(lines[2], { y: -6, duration: 0.16 }, 0)
        .to(lines[0], { rotation: 45, duration: 0.22 }, 0.12)
        .to(lines[2], { rotation: -45, duration: 0.22 }, 0.12)
        .to(panel, { autoAlpha: 1, y: 0, clipPath: "inset(0 0 0% 0 round 18px)", duration: 0.36 }, 0.08)
        .to(items, { opacity: 1, y: 0, duration: 0.24, stagger: 0.025 }, 0.18);
    }, root);
    return () => { context.revert(); mobileTimeline.current = null; };
  }, []);

  useEffect(() => {
    const timeline = mobileTimeline.current;
    if (!timeline) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => {
      if (reducedMotion.matches) timeline.progress(isMobileMenuOpen ? 1 : 0).pause();
      else if (isMobileMenuOpen) timeline.play();
      else timeline.reverse();
    };
    updateMotion();
    reducedMotion.addEventListener("change", updateMotion);
    return () => reducedMotion.removeEventListener("change", updateMotion);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (contactMenuRef.current && !contactMenuRef.current.contains(event.target as Node)) setIsContactOpen(false);
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateHeader = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      const headerHasFocus = headerRef.current?.contains(document.activeElement);
      const menuIsOpen = isOpen || isMobileMenuOpen || isContactOpen;

      if (currentScrollY <= 80 || delta < -6 || headerHasFocus || menuIsOpen) {
        setIsHidden(false);
      } else if (delta > 6 && currentScrollY > 140) {
        setIsHidden(true);
        setIsOpen(false);
        setIsMobileMenuOpen(false);
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen, isMobileMenuOpen, isContactOpen]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isContactOpen) setIsContactOpen(false);
      if (event.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        mobileToggleRef.current?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 1041px)");
    const closeOnDesktop = () => { if (desktop.matches) setIsMobileMenuOpen(false); };
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [isMobileMenuOpen, isContactOpen]);

  return <header ref={headerRef} className={"global-header" + (isHidden ? " is-hidden" : "")}>
    <div className="wide-container nav-shell">
      <a className="global-brand" href={routes.home} aria-label="Emerald Isle Manpower home"><img src="/assets/emerald-isle-logo.webp" width="214" height="55" alt="Emerald Isle Manpower" /></a>
      <nav className="top-nav" aria-label="Primary navigation">
        <a href={routes.home}>Home</a>
        <a href={routes.about}>About us</a>
        <div
          className={"nav-group jobs-nav-group" + (isOpen ? " is-open" : "")}
          ref={menuRef}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <a
            className="nav-group-trigger"
            href={routes.jobs}
            aria-label="View all foreign job vacancies"
          >
            Find jobs <Caret />
          </a>
          <JobMegaMenu />
        </div>
        <a href={routes.employer}>Employer</a>
        <a href={routes.projects}>Projects</a>
        <a href={routes.blog}>Blogs</a>
        <div
          className={"nav-group contact-nav-group" + (isContactOpen ? " is-open" : "")}
          ref={contactMenuRef}
          onMouseEnter={() => setIsContactOpen(true)}
          onMouseLeave={() => setIsContactOpen(false)}
          onFocus={() => setIsContactOpen(true)}
          onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setIsContactOpen(false); }}
        >
          <a className="nav-group-trigger" href={routes.contact} aria-expanded={isContactOpen} aria-controls="contact-nav-dropdown">Contact us <Caret /></a>
          <div className="contact-nav-dropdown" id="contact-nav-dropdown"><a href={routes.contact}>Contact us<span>Find an office or send an inquiry</span></a><a href={routes.faq}>FAQ<span>Answers to common questions</span></a></div>
        </div>
      </nav>
      <a className="register-pill" href="https://registration.emeraldislemanpower.com/">
        <span className="register-pill__icon-wrapper">
          <svg viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="register-pill__icon-svg" width={10} height={10}>
            <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" />
          </svg>
          <svg viewBox="0 0 14 15" fill="none" width={10} height={10} xmlns="http://www.w3.org/2000/svg" className="register-pill__icon-svg register-pill__icon-svg--copy">
            <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" />
          </svg>
        </span>
        Register now
      </a>
      <div className={"global-mobile-menu" + (isMobileMenuOpen ? " is-open" : "")} ref={mobileMenuRef}
        onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) closeMobileMenu(); }}>
        <button type="button" className="mobile-nav-toggle" ref={mobileToggleRef} onClick={toggleMobileMenu} aria-expanded={isMobileMenuOpen} aria-controls="mobile-navigation" aria-label={isMobileMenuOpen ? "Close navigation" : "Open navigation"}>
          <span className="mobile-menu-icon" aria-hidden="true"><span className="mobile-icon-line" /><span className="mobile-icon-line" /><span className="mobile-icon-line" /></span>
        </button>
        <nav id="mobile-navigation" aria-label="Mobile navigation" inert={!isMobileMenuOpen} onClick={(event) => { if ((event.target as Element).closest("a")) closeMobileMenu(); }}>
          <p className="mobile-nav-heading">Explore Emerald Isle</p>
          <a href={routes.home}>Home</a>
          <a href={routes.about}>About us</a>
          <details className="mobile-job-menu">
            <summary>Find jobs <Caret /></summary>
            <a className="mobile-all-jobs" href={routes.jobs}>All foreign vacancies</a>
            {jobGroups.map((group) => <div className="mobile-job-group" key={group.title}><p>{group.title}</p>{group.links.map((label) => <a href={routes.jobs + "?filter-category=" + encodeURIComponent(label)} key={label}>{label}</a>)}</div>)}
          </details>
          <a href={routes.employer}>Employers</a>
          <a href={routes.projects}>Projects</a>
          <a href={routes.blog}>Blogs</a>
          <details className="mobile-job-menu mobile-contact-menu"><summary>Contact us <Caret /></summary><a href={routes.contact}>Contact us</a><a href={routes.faq}>FAQ</a></details>
          <a href="https://registration.emeraldislemanpower.com/">Register now</a>
        </nav>
      </div>
    </div>
  </header>;
}
