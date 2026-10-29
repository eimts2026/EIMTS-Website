import type { HeroContent } from "../../lib/hero";
import Link from "../../components/ui/Link";
import type { Job } from "../jobs/JobsPage";
import ClientGlobe from "../../components/visuals/ClientGlobe";
import TestimonialsRail from "./TestimonialsRail";
import RecruitmentHero from "./RecruitmentHero";
import BootstrapIcon from "../../components/ui/BootstrapIcon";
import "./HomePage.css";
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
  const newestUrgentJobs = urgentJobs.filter(job => job.urgent).slice(0, 8);
  return <main id="main" className="home-foundation">
    <RecruitmentHero hero={hero} />
    <section className="hf-section hf-jobs" aria-labelledby="urgent-title"><div className="hf-shell">
      <div className="hf-heading"><div><p className="hf-eyebrow"><i />Your next chapter</p><h2 id="urgent-title">Foreign job vacancies.<br /><em>A world ahead of you.</em></h2></div><Link className="hf-link" href={jobsUrl}>View all vacancies <span aria-hidden="true"><BootstrapIcon name="arrow-up-right" /></span></Link></div>
      {newestUrgentJobs.length > 0 ? <div className="hf-job-grid">{newestUrgentJobs.map(job => <Link className="hf-job-card" href={jobsUrl + job.slug + "/"} key={job.id}>
        <div className="hf-job-image"><img src={job.image} alt={job.image === "/assets/blog-global-careers.webp" ? "" : `${job.title} vacancy poster in ${job.country}`} loading="lazy" style={{ objectPosition: job.imagePosition }} /><span>Urgent hiring</span></div>
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
      <div className="hf-industries-heading"><p className="hf-eyebrow">Where we work</p><h2 id="industries-title">Recruitment services in Sri Lanka.</h2><p>From skilled trades to service teams, we help employers find people across these sectors. Open roles vary by employer and destination.</p></div>
      <div className="hf-industries-grid">{industries.map(industry => <article className="hf-industry-card" key={industry.title}><span className="hf-industry-icon" aria-hidden="true"><i className={`hf-industry-icon--${industry.icon}`} /></span><h3>{industry.title}</h3><p>{industry.description}</p></article>)}</div>
      <div className="hf-industries-end"><span>Looking for your next role?</span><Link className="hf-link" href={jobsUrl}>Browse current vacancies <span aria-hidden="true"><BootstrapIcon name="arrow-up-right" /></span></Link></div>
    </div></section>
    <section className="hf-section hf-testimonials" aria-labelledby="testimonial-title"><div className="hf-shell">
      <div className="hf-heading"><div><p className="hf-eyebrow">Client testimonials</p><h2 id="testimonial-title">Good partnerships.<br /><em>In their own words.</em></h2></div><p>The people and organisations behind the journeys we make possible.</p></div>
      <TestimonialsRail />
    </div></section>
  </main>;
}
