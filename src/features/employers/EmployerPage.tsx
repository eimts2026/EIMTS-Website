import Link from "../../components/ui/Link";
import { EmployerInquiryForm } from "../../components/ui/EmployerInquiryForm";

const values = [
  ["Respect", "Building strong relationships through honest communication is essential. We respect our colleagues and understand the perspectives of our clients, ensuring professional and courteous engagement at every level.", "respect"],
  ["Diversity", "We embrace diversity in all its forms. By valuing unique backgrounds, experiences and ideas, we foster inclusive and innovative solutions for employees and clients alike.", "diversity"],
  ["Teamwork", "Collaboration drives success. We share knowledge, support each other and work responsibly to achieve the best outcomes for our clients.", "teamwork"],
  ["Empowerment", "We take accountability for our actions, focus on excellent solutions and make decisions with stakeholders and clients in mind.", "empowerment"],
  ["Community", "We engage with people in mutually beneficial ways. By uplifting each other, we ensure stronger support for our clients and the communities we serve.", "community"],
] as const;

function ValueIcon({ type }: { type: typeof values[number][2] }) {
  const paths = {
    respect: <><path d="M7 12.5 12.5 7a3.2 3.2 0 0 1 4.5 0l.5.5" /><path d="m17 7 7.2 7.2a2 2 0 0 1-2.8 2.8l-5.7-5.7" /><path d="m18.5 14.1 1.5 1.5a2 2 0 0 1-2.8 2.8l-1.5-1.5m0 0 .8.8a2 2 0 0 1-2.8 2.8l-1.2-1.2m3.2-2.4-3.2 2.4-6.7-6.7a3.2 3.2 0 0 1 0-4.5L7 7a3.2 3.2 0 0 1 4.5 0l1 1" /><path d="m7.5 16.5-1 1a1.8 1.8 0 0 1-2.5-2.5l1-1m5 5-1 1a1.8 1.8 0 0 1-2.5-2.5l1-1" /></>,
    diversity: <><circle cx="8" cy="7" r="3" /><circle cx="24" cy="7" r="3" /><path d="M3 25v-8a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v8m6 0v-8a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v8" /><path d="M11 20h10m-3-3 3 3-3 3m-4-6-3 3 3 3" /></>,
    teamwork: <><circle cx="16" cy="8" r="4" /><circle cx="7" cy="12" r="3" /><circle cx="25" cy="12" r="3" /><path d="M9 27v-5a7 7 0 0 1 14 0v5M2 27v-4a5 5 0 0 1 7-4.6M30 27v-4a5 5 0 0 0-7-4.6" /></>,
    empowerment: <><path d="m4 12 6 5 6-10 6 10 6-5-3 13H7L4 12Z" /><path d="M8 28h16" /><circle cx="4" cy="9" r="1" /><circle cx="16" cy="4" r="1" /><circle cx="28" cy="9" r="1" /></>,
    community: <><circle cx="16" cy="12" r="3" /><circle cx="8" cy="15" r="2.5" /><circle cx="24" cy="15" r="2.5" /><path d="M11 27v-4a5 5 0 0 1 10 0v4M3 27v-3a4 4 0 0 1 6-3.6M29 27v-3a4 4 0 0 0-6-3.6" /><path d="M10 4h12v5H10zM4 6h4v4H4m20-4h4v4h-4" /></>,
  };
  return <svg className="employer-value-icon" viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{paths[type]}</svg>;
}

const partnershipPrinciples = [
  ["Relationships first", "We stay close to each brief, communicate clearly and remain accountable from planning through deployment.", "respect"],
  ["Shared expertise", "Recruiters, compliance specialists and regional partners bring their knowledge together around every hiring need.", "teamwork"],
  ["Knowledge in motion", "Market insight, candidate feedback and regulatory guidance are shared early so employers can make confident decisions.", "community"],
  ["Built to grow", "Flexible recruitment models help teams scale without compromising candidate care, compliance or long-term fit.", "empowerment"],
] as const;

export default function EmployerPage() {
  return <main id="main">
    <section className="employer-hero" aria-labelledby="employer-hero-title">
      <div className="container employer-hero-grid">
        <div className="employer-hero-copy">
          <p className="employer-hero-kicker"><span>Five Star</span> Employer solutions since 1995</p>
          <h1 id="employer-hero-title">Build global teams with confidence.</h1>
          <p className="employer-hero-lede">As the only SLBFE <strong>Five Star Award-winning recruitment company in Sri Lanka</strong>, we have proudly served clients across the GCC, Europe, Africa and Asia since 1995, providing tailored staffing solutions under <strong>License No. 1162</strong>.</p>
          <div className="employer-hero-actions">
            <Link className="ei-button ei-button-bright" href="#employer-inquiry">Discuss your hiring needs <span className="ei-button__icon-wrapper" aria-hidden="true"><svg viewBox="0 0 14 15" fill="none" className="ei-button__icon-svg" width={10} height={10}><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" /></svg><svg viewBox="0 0 14 15" fill="none" className="ei-button__icon-svg ei-button__icon-svg--copy" width={10} height={10}><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" /></svg></span></Link>
            <a href="#employer-proof">See how we work <span aria-hidden="true">↓</span></a>
          </div>
          <div className="employer-hero-regions" aria-label="Regions served">
            <span>GCC</span><span>Europe</span><span>Africa</span><span>Asia</span>
          </div>
        </div>
        <figure className="employer-certificate">
          <div className="employer-certificate-crop">
            <img src="/assets/slbfe-license-reference.png" alt="Sri Lanka Bureau of Foreign Employment licence No. 1162 issued to Emerald Isle Manpower and Travel Services" width="1603" height="637" fetchPriority="high" />
          </div>
          <figcaption><span>Official credential</span><strong>SLBFE License No. 1162</strong></figcaption>
          <div className="employer-certificate-seal" aria-hidden="true"><strong>5</strong><span>Star<br />Award</span></div>
        </figure>
      </div>
    </section>
    <section className="content-section employer-proof" id="employer-proof"><div className="container split-layout"><div className="split-copy"><p className="section-kicker">Licensed recruitment partner</p><h2>Recruit flexibly. Grow with confidence.</h2><p>Since 1995, Emerald Isle has helped employers build dependable international teams across the GCC, Europe, Africa and Asia.</p><p>Our specialists cover hospitality, sales, finance, administration, HR, engineering, construction, automotive and transport—with compliance considered from the first brief.</p><div className="employer-proof-license"><strong>SLBFE 1162</strong><span>Licensed and accountable</span></div></div><div className="employer-proof-visual"><div className="employer-proof-image"><img src="/assets/candidate-service.webp" alt="Candidate and employer discussing an international recruitment opportunity" /></div><div className="metric-card"><strong>30+ years</strong><span>of responsible recruitment</span></div></div></div></section>
    <section className="content-section alt employer-values" aria-labelledby="employer-values-title"><div className="container"><div className="section-copy center"><p className="section-kicker">Our values</p><h2 id="employer-values-title">Relationships that last</h2></div><div className="values-grid employer-values-grid">{values.map(([title, body, icon]) => <article className="value-card employer-value-card" key={title}><ValueIcon type={icon} /><h3>{title}</h3><p>{body}</p></article>)}</div></div></section>
    <section className="employer-partnership" aria-labelledby="partnership-title"><div className="container"><div className="employer-partnership-head"><div><p className="section-kicker">A better working relationship</p><h2 id="partnership-title">Partnership beyond placement</h2></div><p>Strong hiring outcomes come from shared context, honest communication and a team that keeps learning alongside yours.</p></div><div className="employer-principles">{partnershipPrinciples.map(([title, body, icon]) => <article className="employer-principle" key={title}><ValueIcon type={icon} /><div><h3>{title}</h3><p>{body}</p></div></article>)}</div></div></section>
    <section className="employer-inquiry" id="employer-inquiry" aria-labelledby="employer-inquiry-title">
      <div className="container employer-inquiry-grid">
        <EmployerInquiryForm />
        <aside className="employer-whatsapp" aria-label="Contact us on WhatsApp">
          <div className="employer-handshake-animation" aria-hidden="true">
            <img src="/assets/employer-handshake.png" alt="" width="1664" height="936" loading="lazy" />
          </div>
          <p className="section-kicker">Prefer a quick conversation?</p>
          <h2>Continue on WhatsApp.</h2>
          <p>Connect directly with our employer solutions team for a faster first conversation about your staffing requirements.</p>
          <a href="https://api.whatsapp.com/send?phone=94773876467" target="_blank" rel="noreferrer">Join us on WhatsApp <span aria-hidden="true">↗</span></a>
          <small>Available during Sri Lanka business hours</small>
        </aside>
      </div>
    </section>
  </main>;
}
