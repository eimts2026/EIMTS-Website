"use client";

import { useEffect } from "react";
import { BranchMap } from "./BranchMap";
import { PageHero } from "../../components/ui/PageHero";
import { InquiryForm } from "../../components/ui/InquiryForm";

import { branches } from "./branches";
import "./ContactPage.css";

export default function ContactPage() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const targetId = window.location.hash.substring(1);
      const jumpToTarget = () => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "start" });
        }
      };
      jumpToTarget();
      const timer = setTimeout(jumpToTarget, 50);
      return () => clearTimeout(timer);
    }
  }, []);

  return <main id="main" className="contact-page">
    {/* ====================================================================== */}
    {/* PAGE HERO HEADER                                                       */}
    {/* ====================================================================== */}
    <PageHero
      eyebrow="We are here to help"
      title="Tell us where you want to go next."
      description="Reach our recruitment and employer teams. Choose the nearest office or send us a message."
    />

    {/* ====================================================================== */}
    {/* CONTACT SECTION: OFFICES DIRECTORY & INQUIRY FORM                      */}
    {/* ====================================================================== */}
    <section className="content-section alt">
      <div className="container contact-details">
        {/* Left Column: Office directory */}
        <div>
          <p className="section-kicker">Our offices</p>
          <h2>Speak with a local team</h2>
          <p className="contact-intro">Visit a team in Sri Lanka or explore our international network. Choose a location below for available details.</p>
          {(["local", "international"] as const).map((region) => <section className="contact-office-group" key={region} aria-labelledby={`offices-${region}`}>
            <header><h3 id={`offices-${region}`}>{region === "local" ? "Sri Lanka" : "International"}</h3><a className="contact-map-link" href={`#branch-map-${region}`}>Explore map</a></header>
            <div className="contact-panel">
              {branches.filter((office) => office.region === region).map((office) => <article className="contact-card" key={office.id}>
                <h4>{office.name}</h4><p>{office.address}</p><a href={office.phoneHref}>{office.phone}</a>
              </article>)}
            </div>
          </section>)}
        </div>

        {/* Protected inquiry submission with confirmed-delivery feedback. */}
        <InquiryForm kind="contact" />
      </div>
    </section>

    {/* ====================================================================== */}
    {/* INTERACTIVE INTERNATIONAL BRANCH MAP WITH PINS & MOBILE TOUCH SLIDER       */}
    {/* Map settings and pins defined in ./BranchMap.tsx                      */}
    {/* ====================================================================== */}
    <BranchMap />
  </main>;
}
