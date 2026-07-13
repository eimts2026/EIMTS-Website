import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../components/PageHero";

export const metadata: Metadata = {
  title: "Study Abroad & Global Education Services",
  description: "Study abroad guidance, applications, accommodation and financial support from Emerald Isle Education.",
  alternates: { canonical: "/education-page/" },
};

const services = [
  ["Free consultation", "Clarify your goals, preferred countries, programmes and budget with an education adviser."],
  ["Application support", "Prepare applications and supporting documents with clear guidance at every step."],
  ["Accommodation", "Understand housing options and plan your arrival with greater confidence."],
  ["B2B partnerships", "Connect education institutions and partners through trusted local representation."],
  ["Financial assistance", "Explore available payment, scholarship and financial planning pathways."],
  ["Online & hybrid support", "Stay connected with advisers before, during and after your application."],
];

export default function EducationPage() {
  return <main id="main">
    <PageHero eyebrow="Emerald Isle Education" title="Your Gateway to Global Education" description="Turn your study-abroad ambition into a clear plan with personal guidance from consultation to arrival." />
    <section className="content-section"><div className="container"><div className="section-copy center"><p className="section-kicker">Study abroad</p><h2>Support for every stage of your journey</h2><p>We help students compare destinations, prepare strong applications and understand the practical details of studying overseas.</p></div><div className="service-grid">{services.map(([title, body], index) => <article className="service-card" key={title}><span className="card-number">0{index + 1}</span><h3>{title}</h3><p>{body}</p></article>)}</div></div></section>
    <section className="credential-band"><div className="container credential-grid"><div><strong>Destination guidance</strong><span>Explore education pathways across leading study destinations</span></div><div><strong>Personal application plan</strong><span>Know your next action, document and deadline</span></div><div><strong>Human support</strong><span>Speak directly with an adviser throughout the process</span></div></div></section>
    <section className="cta-band"><div className="container cta-band-inner"><div><h2>Plan your study-abroad journey</h2><p>Email em.education@emeraldisle.lk or call +94 77 353 9668.</p></div><Link className="primary-button inverse-button" href="/contact/">Book a consultation</Link></div></section>
  </main>;
}
