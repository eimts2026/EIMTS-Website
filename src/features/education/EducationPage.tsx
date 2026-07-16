import Link from "../../components/ui/Link";

const destinations = [
  ["IE", "Ireland", "World-class learning, welcoming communities", "\uD83C\uDDEE\uD83C\uDDEA"],
  ["AU", "Australia", "Globally recognised degrees and vibrant cities", "\uD83C\uDDE6\uD83C\uDDFA"],
  ["CA", "Canada", "Career-focused programmes in an inclusive setting", "\uD83C\uDDE8\uD83C\uDDE6"],
  ["AE", "Dubai, UAE", "International campuses at a global business hub", "\uD83C\uDDE6\uD83C\uDDEA"],
  ["DE", "Germany", "Innovation-led education with strong industry links", "\uD83C\uDDE9\uD83C\uDDEA"],
  ["FR", "France", "Academic tradition, culture and global opportunity", "\uD83C\uDDEB\uD83C\uDDF7"],
  ["MT", "Malta", "English-speaking study in the heart of Europe", "\uD83C\uDDF2\uD83C\uDDF9"],
  ["SG", "Singapore", "A future-facing centre for learning and technology", "\uD83C\uDDF8\uD83C\uDDEC"],
  ["CN", "China", "A dynamic study experience across leading institutions", "\uD83C\uDDE8\uD83C\uDDF3"],
  ["GB", "United Kingdom", "Prestigious qualifications with worldwide reach", "\uD83C\uDDEC\uD83C\uDDE7"],
];

const services = [
  ["Free Consultation", "Get a personalized eligibility check and expert advice to plan your education abroad."],
  ["Application Support", "Receive full guidance for application and admission processes to secure your ideal education program."],
  ["Accommodation", "We help students find safe and affordable housing and part-time work opportunities to support their education journey."],
  ["B2B Partnerships", "We collaborate with schools and universities to deliver professional education services for both students and institutional clients."],
  ["Financial Assistance", "We guide students to scholarships and funding options to make pursuing education abroad accessible and affordable."],
  ["Online & Hybrid Support", "Flexible learning formats allow students to combine online and on-campus education according to their needs."],
];

function ArrowIcon() {
  return <span className="ei-button__icon-wrapper" aria-hidden="true">
    <svg viewBox="0 0 14 15" fill="none" className="ei-button__icon-svg" width={10} height={10}><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" /></svg>
    <svg viewBox="0 0 14 15" fill="none" className="ei-button__icon-svg ei-button__icon-svg--copy" width={10} height={10}><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" /></svg>
  </span>;
}


function CountryFlag({ code }: { code: string }) {
  const label = `${code} flag`;
  if (code === "IE") return <svg viewBox="0 0 36 24" role="img" aria-label={label}><rect width="12" height="24" fill="#169b62" /><rect x="12" width="12" height="24" fill="#fff" /><rect x="24" width="12" height="24" fill="#ff883e" /></svg>;
  if (code === "AU") return <svg viewBox="0 0 36 24" role="img" aria-label={label}><rect width="36" height="24" fill="#012169" /><path d="M0 0l16 10M16 0L0 10" stroke="#fff" strokeWidth="3" /><path d="M0 0l16 10M16 0L0 10" stroke="#c8102e" strokeWidth="1.4" /><path d="M8 0v10M0 5h16" stroke="#fff" strokeWidth="4" /><path d="M8 0v10M0 5h16" stroke="#c8102e" strokeWidth="2" /><circle cx="25" cy="7" r="1.3" fill="#fff" /><circle cx="30" cy="12" r="1.1" fill="#fff" /><circle cx="23" cy="17" r="1.2" fill="#fff" /><circle cx="31" cy="20" r=".9" fill="#fff" /></svg>;
  if (code === "CA") return <svg viewBox="0 0 36 24" role="img" aria-label={label}><rect width="36" height="24" fill="#fff" /><rect width="9" height="24" fill="#d80621" /><rect x="27" width="9" height="24" fill="#d80621" /><path d="M18 4l1.4 4 3-1.5-1 3.4 3 .5-3.7 3.2.9 2.6-3.1-.7.1 4.4h-1.2l.1-4.4-3.1.7.9-2.6-3.7-3.2 3-.5-1-3.4 3 1.5z" fill="#d80621" /></svg>;
  if (code === "AE") return <svg viewBox="0 0 36 24" role="img" aria-label={label}><rect width="36" height="8" fill="#00732f" /><rect y="8" width="36" height="8" fill="#fff" /><rect y="16" width="36" height="8" fill="#000" /><rect width="9" height="24" fill="#ef3340" /></svg>;
  if (code === "DE") return <svg viewBox="0 0 36 24" role="img" aria-label={label}><rect width="36" height="8" fill="#111" /><rect y="8" width="36" height="8" fill="#dd0000" /><rect y="16" width="36" height="8" fill="#ffce00" /></svg>;
  if (code === "FR") return <svg viewBox="0 0 36 24" role="img" aria-label={label}><rect width="12" height="24" fill="#0055a4" /><rect x="12" width="12" height="24" fill="#fff" /><rect x="24" width="12" height="24" fill="#ef4135" /></svg>;
  if (code === "MT") return <svg viewBox="0 0 36 24" role="img" aria-label={label}><rect width="18" height="24" fill="#fff" /><rect x="18" width="18" height="24" fill="#cf142b" /><path d="M5 3h5v1.5h1.5v5H10V11H5V9.5H3.5v-5H5z" fill="#b7b7b7" stroke="#8b8b8b" strokeWidth=".5" /></svg>;
  if (code === "SG") return <svg viewBox="0 0 36 24" role="img" aria-label={label}><rect width="36" height="12" fill="#ef3340" /><rect y="12" width="36" height="12" fill="#fff" /><circle cx="9" cy="6" r="4.2" fill="#fff" /><circle cx="10.8" cy="6" r="3.5" fill="#ef3340" /><circle cx="14" cy="3.2" r=".65" fill="#fff" /><circle cx="15.7" cy="5.2" r=".65" fill="#fff" /><circle cx="15" cy="7.7" r=".65" fill="#fff" /></svg>;
  if (code === "CN") return <svg viewBox="0 0 36 24" role="img" aria-label={label}><rect width="36" height="24" fill="#de2910" /><polygon points="7,3 8.2,6.5 12,6.5 9,8.7 10.1,12.2 7,10 3.9,12.2 5,8.7 2,6.5 5.8,6.5" fill="#ffde00" /><circle cx="15" cy="4" r=".8" fill="#ffde00" /><circle cx="18" cy="7" r=".8" fill="#ffde00" /><circle cx="17" cy="11" r=".8" fill="#ffde00" /></svg>;
  return <svg viewBox="0 0 36 24" role="img" aria-label={label}><rect width="36" height="24" fill="#012169" /><path d="M0 0l36 24M36 0L0 24" stroke="#fff" strokeWidth="6" /><path d="M0 0l36 24M36 0L0 24" stroke="#c8102e" strokeWidth="2.4" /><path d="M18 0v24M0 12h36" stroke="#fff" strokeWidth="8" /><path d="M18 0v24M0 12h36" stroke="#c8102e" strokeWidth="4" /></svg>;
}

export default function EducationPage() {
  return <main id="main" className="education-page">
    <section className="education-hero education-hero-minimal" aria-labelledby="education-hero-title">
      <div className="education-hero-glow" aria-hidden="true" />
      <div className="education-hero-canvas" aria-hidden="true">
        <svg viewBox="0 0 900 700" fill="none">
          <circle cx="610" cy="340" r="245" />
          <circle cx="610" cy="340" r="156" />
          <path d="M238 576C332 526 311 416 420 382C543 344 500 232 621 192C704 165 758 118 799 54" />
        </svg>
        <span className="education-canvas-point canvas-one" /><span className="education-canvas-point canvas-two" /><span className="education-canvas-point canvas-three" />
      </div>
      <div className="container education-hero-grid">
        <div className="education-hero-copy">
          <p className="education-hero-kicker"><span>Emerald Isle Education</span> Your next chapter starts here</p>
          <h1 id="education-hero-title">Study further.<br />Go further.</h1>
          <p className="education-hero-lede">From choosing a destination to settling into your new home, we turn an international education ambition into a clear, supported journey.</p>
          <div className="education-hero-actions">
            <a href="#education-destinations" className="education-text-link">Explore destinations <span aria-hidden="true">&darr;</span></a>
          </div>
        </div>
      </div>
    </section>

    <section className="education-destinations" id="education-destinations" aria-labelledby="education-destinations-title">
      <div className="container">
        <div className="education-section-head">
          <p>Where will you go?</p>
          <h2 id="education-destinations-title">Ten destinations.<br />One clear way forward.</h2>
          <div><p>Compare respected study destinations with an adviser who listens to your goals, budget and long-term plans.</p><Link href="/contact/">Help me choose <span aria-hidden="true">&#8599;</span></Link></div>
        </div>
        <ol className="education-destination-list">
          {destinations.map(([code, country, note], index) => <li key={code}>
            <span className="education-destination-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="education-country-flag"><CountryFlag code={code} /></span>
            <strong>{country}</strong><p>{note}</p><span className="education-country-code">{code}</span>
          </li>)}
        </ol>
      </div>
    </section>

    <section className="education-services" aria-labelledby="education-services-title">
      <div className="container education-services-grid">
        <div className="education-services-intro"><p>Our services</p><h2 id="education-services-title">Support that stays with you.</h2><p>Practical help at every turning point&mdash;before you apply, while you prepare and after your study journey begins.</p></div>
        <div className="education-services-list">
          {services.map(([title, body], index) => <article className="education-service" key={title}>
            <span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{body}</p></div><i aria-hidden="true">&#8599;</i>
          </article>)}
        </div>
      </div>
    </section>

    <section className="education-final-cta" aria-labelledby="education-cta-title">
      <div className="education-cta-orbit" aria-hidden="true"><span /><span /></div>
      <div className="container education-final-cta-inner">
        <p>Ready when you are</p>
        <h2 id="education-cta-title">Start your <em>education</em> journey today with Emerald Isle Manpower.</h2>
        <div className="education-cta-bottom"><p>Your trusted partner in international learning and career growth.</p><div>
          <Link className="ei-button ei-button-bright" href="/contact/">Talk to an education adviser <ArrowIcon /></Link>
          <a href="mailto:em.education@emeraldisle.lk">em.education@emeraldisle.lk</a>
        </div></div>
      </div>
    </section>
  </main>;
}