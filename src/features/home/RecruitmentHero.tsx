"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import type { HeroContent } from "@/lib/hero";
import Link from "@/components/ui/Link";
import BootstrapIcon from "@/components/ui/BootstrapIcon";
import CountUp from "./CountUp";
import TypewriterHeading from "./TypewriterHeading";
import { complianceYears } from "./complianceYears";
import "./RecruitmentHero.css";

const ROTATE_EVERY_MS = 7500;
let heroRealtimeClient: ReturnType<typeof createClient> | null = null;

export default function RecruitmentHero({ hero }: { hero: HeroContent }) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slides = useMemo(() => hero.slides.filter((slide) => slide.image), [hero.slides]);
  const activeSlide = slides[activeIndex] ?? slides[0];

  useEffect(() => setActiveIndex(0), [hero.slides]);

  useEffect(() => {
    if (hero.takeover || slides.length < 2 || isPaused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        setActiveIndex((index) => (index + 1) % slides.length);
      }
    }, ROTATE_EVERY_MS);
    return () => window.clearInterval(timer);
  }, [hero.takeover, isPaused, slides.length]);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return;

    heroRealtimeClient ??= createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const supabase = heroRealtimeClient;
    const channel = supabase
      .channel("homepage-hero-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "hero_slides" }, () => router.refresh())
      .subscribe();

    return () => { void supabase.removeChannel(channel); };
  }, [router]);

  if (!activeSlide) return null;

  const changeSlide = (step: number) => {
    setActiveIndex((index) => (index + step + slides.length) % slides.length);
  };

  return (
    <section
      className="recruit-hero"
      aria-labelledby="home-title"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsPaused(false);
      }}
    >
      <div className="recruit-hero-background" aria-hidden="true">
        {slides.map((slide, index) => (
          <img
            key={`${slide.image}-${index}`}
            className={index === activeIndex ? "is-active" : ""}
            src={slide.image}
            alt=""
            fetchPriority={index === 0 ? "high" : "auto"}
          />
        ))}
      </div>
      <div className="hf-shell">
        <div className="recruit-hero-top"><span>Emerald Isle Manpower &amp; Travel Services</span><span>From Sri Lanka. Since 1995.</span></div>
        <div className="recruit-hero-mobile-image" aria-hidden="true">
          <img src={activeSlide.image} alt="" fetchPriority="high" />
        </div>
        <div className="recruit-hero-grid">
          <div className="recruit-hero-copy" aria-live={isPaused ? "polite" : "off"} aria-atomic="true">
            <p className="recruit-hero-kicker">{activeSlide.kicker || "Sri Lankan talent. Global opportunity."}</p>
            <div className="recruit-hero-title-entrance" key={`${activeIndex}-${activeSlide.title}`}>
              <TypewriterHeading text={activeSlide.title} />
            </div>
            <p className="recruit-hero-lead">{activeSlide.copy}</p>
            <div className="recruit-hero-actions">
              <Link className="register-pill recruit-action-pill" href="/foreign-job-vacancies/"><span className="register-pill__icon-wrapper" aria-hidden="true"><BootstrapIcon name="arrow-up-right" className="register-pill__icon-svg" /><BootstrapIcon name="arrow-up-right" className="register-pill__icon-svg register-pill__icon-svg--copy" /></span>Browse jobs</Link>
              <Link className="register-pill recruit-action-pill recruit-action-pill--employer" href="/client-recruitment-solutions/"><span className="register-pill__icon-wrapper" aria-hidden="true"><BootstrapIcon name="arrow-up-right" className="register-pill__icon-svg" /><BootstrapIcon name="arrow-up-right" className="register-pill__icon-svg register-pill__icon-svg--copy" /></span>For Clients</Link>
              <Link className="hf-link" href="/contact/">Contact us <span aria-hidden="true"><BootstrapIcon name="arrow-up-right" /></span></Link>
            </div>
            <a className="hero-review-trust" href="https://www.google.com/maps/place//@6.8425904,79.866525,17z/data=!3m1!4b1!4m3!3m2!1s0x3ae25b19204c0875:0xf99af88e1968c1a0!12e1?entry=ttu&g_ep=EgoyMDI2MDcxMy4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noreferrer" aria-label="930 plus Google reviews. Leave a review for Emerald Isle">
              <span className="hero-review-avatars" aria-hidden="true">{["8ab4cd865aa6b62352300cf71c5805c86d8523505636e2a499cda7932a803953", "a2ee1266115ad682a19f5d4752ea8efa7eefa3ae03e658f500cbb3e1a6145b0b", "f8db32ee1fe8c51fa678e3325eee3f8bf72a3a8cc8947784d5ef9c7bf5fb8adb", "449ffab8e7b480176aaea3dd5578119223a41e2e0c92c805a5a6b71ca4cbdd14"].map((image) => <img key={image} src={"https://cdn.21st.dev/assets/localized/" + image + ".jpg"} width={22} height={22} alt="" loading="lazy" />)}</span>
              <span><strong>930+</strong> Google reviews</span>
            </a>
          </div>
        </div>
        {!hero.takeover && slides.length > 1 && (
          <div className="recruit-hero-pagination" aria-label="Hero slides">
            <button type="button" onClick={() => changeSlide(-1)} aria-label="Previous hero slide"><BootstrapIcon name="arrow-right" className="recruit-hero-previous-icon" /></button>
            <div className="recruit-hero-dots">
              {slides.map((slide, index) => <button key={`${slide.title}-${index}`} type="button" aria-label={`Show slide ${index + 1}`} aria-current={index === activeIndex ? "true" : undefined} onClick={() => setActiveIndex(index)} />)}
            </div>
            <button type="button" onClick={() => changeSlide(1)} aria-label="Next hero slide"><BootstrapIcon name="arrow-right" /></button>
          </div>
        )}
        <div className="recruit-hero-proof" aria-label="Our recruitment credentials">
          <div><strong>One team</strong><span>Recruitment through deployment</span></div>
          <div><strong>SLBFE 1162</strong><span>Licensed recruitment agency</span></div>
          <div><strong>6 sectors</strong><span>Specialist recruitment support</span></div>
          <div><CountUp initialYears={complianceYears()} /><span>Years of Compliance</span></div>
        </div>
        <div className="recruit-hero-foot"><a href="#urgent-title">Explore current opportunities <BootstrapIcon name="arrow-down" /></a></div>
      </div>
    </section>
  );
}
