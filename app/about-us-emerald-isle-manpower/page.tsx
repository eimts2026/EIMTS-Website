/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../components/PageHero";

export const metadata: Metadata = {
  title: "About Emerald Isle Manpower & Travel Services",
  description: "Discover Emerald Isle Manpower''s mission, values, licensed recruitment expertise and international employer network.",
  alternates: { canonical: "/about-us-emerald-isle-manpower/" },
};

const beliefs = [
  ["Mission", "To connect capable people with meaningful international careers through transparent, responsible recruitment."],
  ["Vision", "To be the most trusted Sri Lankan partner for global human capital solutions."],
  ["Values", "Integrity, respect, service excellence and long-term relationships guide every placement."],
];

export default function AboutPage() {
  return <main id="main">
    <PageHero eyebrow="Who we are" title="About Emerald Isle Manpower & Travel Services" description="A people-first recruitment partner connecting Sri Lankan talent with trusted employers across Europe, the Middle East, Africa and Asia." />
    <section className="content-section"><div className="container split-layout">
      <div className="route-image-stack"><img src="/assets/candidate-service.webp" alt="Candidate receiving recruitment guidance" /><img src="/assets/employer-service.webp" alt="International employer recruitment consultation" /><div className="metric-card"><strong>Since 1995</strong><span>international recruitment expertise</span></div></div>
      <div className="split-copy"><p className="section-kicker">Our story</p><h2>Recruitment built on trust</h2><p>Emerald Isle Manpower and Travel Services has helped candidates build rewarding careers and employers create capable teams for more than three decades. We combine local knowledge, careful screening and end-to-end support to make every recruitment journey clear and dependable.</p><p>Our team serves hospitality, engineering, construction, automotive, transport, finance, administration and many other sectors.</p><Link className="primary-button" href="/contact/">Talk to our team</Link></div>
    </div></section>
    <section className="content-section alt"><div className="container"><div className="section-copy center"><p className="section-kicker">Our core beliefs</p><h2>People are at the heart of every placement</h2><p>We measure success by the lasting value we create for candidates, employers and communities.</p></div><div className="feature-grid">{beliefs.map(([title, body], index) => <article className="feature-card" key={title}><span className="card-number">0{index + 1}</span><h3>{title}</h3><p>{body}</p></article>)}</div></div></section>
    <section className="credential-band"><div className="container credential-grid"><div><strong>SLBFE License No. 1162</strong><span>Licensed by the Sri Lanka Bureau of Foreign Employment</span></div><div><strong>Award-winning employer brand</strong><span>Recognised for consistent service and responsible recruitment</span></div><div><strong>Global employer network</strong><span>Longstanding relationships across multiple regions and industries</span></div></div></section>
  </main>;
}
