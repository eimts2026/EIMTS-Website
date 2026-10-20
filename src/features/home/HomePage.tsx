import { preload } from "react-dom";
import type { HeroContent } from "../../lib/hero";
import Link from "../../components/ui/Link";
import type { Job } from "../jobs/JobsPage";
import ClientGlobe from "../../components/visuals/ClientGlobe";
import TestimonialsRail from "./TestimonialsRail";
import HeroTagline from "./HeroTagline";
import BootstrapIcon from "../../components/ui/BootstrapIcon";
import "./HomePage.css";
import "./RecruitmentHero.css";
const jobsUrl = "/foreign-job-vacancies/";
const industries = [
  { title: "Roads & building construction", description: "Site engineers, supervisors and skilled trades for building and infrastructure projects.", icon: "houses" },
  { title: "Engineering & technical services", description: "Mechanical and electrical engineers, maintenance technicians and technical specialists.", icon: "lightning" },
  { title: "Hospitality", description: "People for hotel operations, food service and guest-facing teams.", icon: "heart" },
  { title: "Transport & logistics", description: "Drivers, operators and logistics professionals who keep work moving.", icon: "compass" },
  { title: "Retail & manufacturing", description: "Talent for customer service, production and quality-focused operations.", icon: "briefcase" },
  { title: "Agriculture", description: "Workers and specialists supporting farms and agricultural operations.", icon: "globe" },
] as const;
export default function Home({ hero, urgentJobs = [] }: { hero: HeroContent; urgentJobs?: Job[] }) {
  preload("/assets/emerald-journey-hero.webp", { as: "image", fetchPriority: "high" });
  const occasion = hero.takeover ? hero.slides[0] : null;
  return <main id="main" className="home-foundation">
    <section className="recruit-hero" aria-labelledby="home-title"><div className="hf-shell">
      <div className="recruit-hero-top"><span>Emerald Isle Manpower &amp; Travel Services</span><span>From Sri Lanka. Since 1995.</span></div>
      <div className="recruit-hero-grid"><div className="recruit-hero-copy">
        <p className="recruit-hero-kicker">Sri Lankan talent. Global opportunity.</p>
        {occasion ? <h1 id="home-title">{occasion.title}</h1> : <HeroTagline />}
        <p className="recruit-hero-lead">{occasion ? occasion.copy : "We connect people with overseas careers and employers with dependable teams. From recruitment to documentation and deployment, our team helps you take the next step."}</p>
        <div className="recruit-hero-actions">
          <Link className="register-pill recruit-action-pill" href={jobsUrl}><span className="register-pill__icon-wrapper" aria-hidden="true"><BootstrapIcon name="arrow-up-right" className="register-pill__icon-svg" /><BootstrapIcon name="arrow-up-right" className="register-pill__icon-svg register-pill__icon-svg--copy" /></span>Browse jobs</Link>
          <Link className="register-pill recruit-action-pill recruit-action-pill--employer" href="/client-recruitment-solutions/"><span className="register-pill__icon-wrapper" aria-hidden="true"><BootstrapIcon name="arrow-up-right" className="register-pill__icon-svg" /><BootstrapIcon name="arrow-up-right" className="register-pill__icon-svg register-pill__icon-svg--copy" /></span>For employers</Link>
          <Link className="hf-link" href="/contact/">Contact us <span aria-hidden="true"><BootstrapIcon name="arrow-up-right" /></span></Link>
        </div>
      </div><div className="recruit-hero-art"><img src="/assets/emerald-journey-hero.webp" alt="" fetchPriority="high" /><div className="recruit-hero-caption"><span>From Sri Lanka to the world</span><p>People first.<br />Every step of the journey.</p></div></div></div>
      <div className="recruit-hero-proof" aria-label="Our recruitment credentials">
        <div><strong>One team</strong><span>Recruitment through deployment</span></div>
        <div><strong>SLBFE 1162</strong><span>Licensed recruitment agency</span></div>
        <div><strong>6 sectors</strong><span>Specialist recruitment support</span></div>
        <div><strong>32+ </strong><span>Years of Compliance</span></div>
      </div>
      <div className="recruit-hero-foot"><a href="#urgent-title">Explore current opportunities <BootstrapIcon name="arrow-down" /></a></div>
    </div></section>
    <section className="hf-section hf-jobs" aria-labelledby="urgent-title"><div className="hf-shell">
      <div className="hf-heading"><div><p className="hf-eyebrow"><i />Your next chapter</p><h2 id="urgent-title">Urgent opportunities.<br /><em>A world ahead of you.</em></h2></div><Link className="hf-link" href={jobsUrl}>View all vacancies <span aria-hidden="true"><BootstrapIcon name="arrow-up-right" /></span></Link></div>
      {urgentJobs.length > 0 ? <div className="hf-job-grid">{urgentJobs.map(job => <Link className="hf-job-card" href={jobsUrl + job.slug + "/"} key={job.id}>
        <div className="hf-job-image"><img src={job.image} alt="" loading="lazy" style={{ objectPosition: job.imagePosition }} /><span>Urgent hiring</span></div>
        <div className="hf-job-body"><p className="hf-eyebrow">{job.country && job.country !== job.location ? job.location + ", " + job.country : job.location}</p><h3>{job.title}</h3><div className="hf-job-meta"><span>{job.category}</span><span>{job.employmentType}</span></div><div className="hf-job-bottom"><small>{job.expiresAt ? "Apply by " + new Date(job.expiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Colombo" }) : "View job details"}</small><span aria-hidden="true"><BootstrapIcon name="arrow-up-right" /></span></div></div>
      </Link>)}</div> : <div className="hf-empty"><div><h3>Your next opportunity starts here.</h3><p>No urgent vacancies are listed right now. Explore our current openings or speak with our team for guidance.</p></div></div>}
    </div></section>
    <ClientGlobe />
    <section className="hf-section hf-purpose" aria-labelledby="purpose-title"><div className="hf-shell">
      <div className="hf-heading"><div><p className="hf-eyebrow">What we stand for</p><h2 id="purpose-title">People at the heart.<br /><em>Purpose in every placement.</em></h2></div></div>
      <div className="hf-purpose-grid"><article><span aria-hidden="true"><i className="hf-purpose-icon hf-purpose-icon--vision" /></span><h3>Our vision</h3><p>To be recognised globally as an innovative and efficient human capital solutions partner.</p></article><article><span aria-hidden="true"><i className="hf-purpose-icon hf-purpose-icon--mission" /></span><h3>Our mission</h3><p>We enhance every client’s success and improve every employee’s quality of life through the dignity and power of gainful employment, delivering best-in-class human capital solutions.</p></article>
        <div className="hf-values"><h3>Our core values</h3><div>{[["Respect", "heart"], ["Diversity", "people"], ["Teamwork", "diagram"], ["Empowerment", "lightning"], ["Community", "houses"]].map(([value, icon]) => <span key={value}><i className={`hf-value-icon hf-value-icon--${icon}`} aria-hidden="true" />{value}</span>)}</div></div>
      </div>
    </div></section>
    <section className="hf-section hf-industries" aria-labelledby="industries-title"><div className="hf-shell">
      <div className="hf-industries-heading"><p className="hf-eyebrow">Where we work</p><h2 id="industries-title">Industries we serve.</h2><p>From skilled trades to service teams, we help employers find people across these sectors. Open roles vary by employer and destination.</p></div>
      <div className="hf-industries-grid">{industries.map(industry => <article className="hf-industry-card" key={industry.title}><span className="hf-industry-icon" aria-hidden="true"><i className={`hf-industry-icon--${industry.icon}`} /></span><h3>{industry.title}</h3><p>{industry.description}</p></article>)}</div>
      <div className="hf-industries-end"><span>Looking for your next role?</span><Link className="hf-link" href={jobsUrl}>Browse current vacancies <span aria-hidden="true"><BootstrapIcon name="arrow-up-right" /></span></Link></div>
    </div></section>
    <section className="hf-section hf-testimonials" aria-labelledby="testimonial-title"><div className="hf-shell">
      <div className="hf-heading"><div><p className="hf-eyebrow">Client testimonials</p><h2 id="testimonial-title">Good partnerships.<br /><em>In their own words.</em></h2></div><p>The people and organisations behind the journeys we make possible.</p></div>
      <TestimonialsRail />
    </div></section>
  </main>;
}
