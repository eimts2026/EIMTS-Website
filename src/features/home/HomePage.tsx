import type { HeroContent } from "../../lib/hero";
import Link from "../../components/ui/Link";
import type { Job } from "../jobs/JobsPage";
import ClientGlobe from "../../components/visuals/ClientGlobe";
import "./HomePage.css";
import "./RecruitmentHero.css";
const testimonials = [
  { quote: "This 5th intake is one of the most challenging intake recruitment drives in recent memory with the holiday season and Simultaneously deployment of 3rd and 4th intake nurses. Inspite of the challenges. This recruitment drive has also seen the largest number", country: "SG" },
  { quote: "Always the best support, whenever it is required. A recruitment partner we genuinely value.", country: "SA" },
  { quote: "Professional staff, a welcoming environment and service that makes every requirement feel carefully handled.", country: "SA" },
  { quote: "From the first day, the team took our requirements seriously. I truly appreciate the partnership.", country: "OM" },
  { quote: "A fantastic experience from start to finish. The communication, care and candidate support were excellent.", country: "QA" },
];


const jobsUrl = "/foreign-job-vacancies/";
const aboutUrl = "/about-us-emerald-isle-manpower/";
export default function Home({ hero, urgentJobs = [] }: { hero: HeroContent; urgentJobs?: Job[] }) {
  const occasion = hero.takeover ? hero.slides[0] : null;
  return <main id="main" className="home-foundation">
    <section className="recruit-hero" aria-labelledby="home-title"><div className="hf-shell">
      <div className="recruit-hero-top"><span>Emerald Isle Manpower &amp; Travel Services</span><span>From Sri Lanka. Since 1995.</span></div>
      <div className="recruit-hero-grid"><div className="recruit-hero-copy">
        <p className="recruit-hero-kicker">People make the difference.</p>
        <h1 id="home-title">{occasion ? occasion.title : <>Good people.<br />Global<br />possibilities.</>}</h1>
        <p className="recruit-hero-lead">{occasion ? occasion.copy : "Your ambition deserves a wider world. We bring Sri Lankan talent and overseas employers together, with responsible recruitment every step of the way."}</p>
        <div className="recruit-hero-actions"><Link className="hf-button" href={jobsUrl}>Find your next role <span aria-hidden="true">↗</span></Link><Link className="hf-link" href="/client-recruitment-solutions/">Build your team <span aria-hidden="true">↗</span></Link></div>
      </div><div className="recruit-hero-art" aria-label="From local talent to global opportunity">
        <div className="recruit-seal"><span>Recruitment with responsibility</span><strong>Since<br /><b>1995</b></strong><span>Sri Lanka → the world</span></div>
        <svg className="recruit-route-art" viewBox="0 0 460 480" aria-hidden="true"><circle cx="230" cy="240" r="186" /><circle cx="230" cy="240" r="145" /><path d="M50 370C145 425 385 340 392 150S150 40 85 135" /><circle className="recruit-route-point" cx="50" cy="370" r="7" /><circle className="recruit-route-point" cx="392" cy="150" r="7" /><path className="recruit-route-arrow" d="m365 154 27-4-7 27" /></svg>
        <span className="recruit-origin">Local talent</span><span className="recruit-destination">Global opportunity</span>
        <p className="recruit-hero-art-note">The right connection<br />changes everything.</p>
      </div></div>
      <div className="recruit-hero-foot"><span className="recruit-license"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 8 3v6c0 5-8 11-8 11S4 16 4 11V5Z"/><path d="m8 11 3 3 5-6"/></svg>SLBFE licensed · No. 1162</span><span>Recruitment / Documentation / Deployment support</span><a href="#urgent-title">Explore current opportunities ↓</a></div>
    </div></section>
    <section className="hf-section hf-jobs" aria-labelledby="urgent-title"><div className="hf-shell">
      <div className="hf-heading"><div><p className="hf-eyebrow"><i />Your next chapter</p><h2 id="urgent-title">Urgent opportunities.<br /><em>A world ahead of you.</em></h2></div><Link className="hf-link" href={jobsUrl}>View all vacancies <span aria-hidden="true">↗</span></Link></div>
      {urgentJobs.length > 0 ? <div className="hf-job-grid">{urgentJobs.map(job => <Link className="hf-job-card" href={jobsUrl + job.slug + "/"} key={job.id}>
        <div className="hf-job-image"><img src={job.image} alt="" loading="lazy" style={{ objectPosition: job.imagePosition }} /><span>Urgent hiring</span></div>
        <div className="hf-job-body"><p className="hf-eyebrow">{job.country && job.country !== job.location ? job.location + ", " + job.country : job.location}</p><h3>{job.title}</h3><div className="hf-job-meta"><span>{job.category}</span><span>{job.employmentType}</span></div><div className="hf-job-bottom"><small>{job.expiresAt ? "Apply by " + new Date(job.expiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Colombo" }) : "View job details"}</small><span aria-label="View job and apply">↗</span></div></div>
      </Link>)}</div> : <div className="hf-empty"><div><h3>Your next opportunity starts here.</h3><p>No urgent vacancies are listed right now. Explore our current openings or speak with our team for guidance.</p></div></div>}
    </div></section>
    <ClientGlobe />
    <section className="hf-section hf-purpose" aria-labelledby="purpose-title"><div className="hf-shell">
      <div className="hf-heading"><div><p className="hf-eyebrow">What we stand for</p><h2 id="purpose-title">People at the heart.<br /><em>Purpose in every placement.</em></h2></div></div>
      <div className="hf-purpose-grid"><article><span aria-hidden="true">↗</span><h3>Our vision</h3><p>To be recognised globally as an innovative and efficient human capital solutions partner.</p></article><article><span aria-hidden="true">◎</span><h3>Our mission</h3><p>We enhance every client’s success and improve every employee’s quality of life through the dignity and power of gainful employment, delivering best-in-class human capital solutions.</p></article></div>
      <div className="hf-values"><h3>Our core values</h3><div>{["Respect", "Diversity", "Teamwork", "Empowerment", "Community"].map(value => <span key={value}><i aria-hidden="true">✳</i>{value}</span>)}</div></div>
    </div></section>
    <section className="hf-section hf-story" aria-labelledby="story-title"><div className="hf-shell hf-story-grid">
      <div className="hf-story-image"><img src="/assets/home-story/global-partnership.webp" alt="" loading="lazy" width="900" height="1000" /><span>Our roots are local.<br /><strong>Our outlook is global.</strong></span></div>
      <div className="hf-story-copy"><p className="hf-eyebrow">The Emerald Isle story · Since 1995</p><h2 id="story-title">Built one responsible<br /><em>journey at a time.</em></h2><p>Emerald Isle began with a simple belief: overseas opportunity should improve a person’s life without leaving them to navigate uncertainty alone.</p><p>Our teams connect recruitment, documentation and travel guidance into one continuous experience, supporting candidates and employers from first conversation to arrival.</p><div className="hf-story-facts"><div><strong>Since 1995</strong><span>Opening doors responsibly</span></div><div><strong>One team</strong><span>From application to arrival</span></div></div><Link className="hf-awards" href={aboutUrl}><img src="/assets/about-awards/award-hero-1.webp" alt="Emerald Isle award recognition" loading="lazy" /><div><strong>A recognised recruitment partner.</strong><span>Explore our awards and credentials ↗</span></div></Link></div>
    </div></section>
    <section className="hf-section hf-testimonials" aria-labelledby="testimonial-title"><div className="hf-shell">
      <div className="hf-heading"><div><p className="hf-eyebrow">Client testimonials</p><h2 id="testimonial-title">Good partnerships.<br /><em>In their own words.</em></h2></div><p>The people and organisations behind the journeys we make possible.</p></div>
      <div className="hf-quote-window" tabIndex={0} role="region" aria-label="Client testimonials; focus to pause scrolling"><div className="hf-quote-track">{[0, 1].map(copy => <div className="hf-quote-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{testimonials.map(item => { return <figure className="hf-quote" key={item.quote}><span className="hf-quote-mark" aria-hidden="true">“</span><blockquote>{item.quote}</blockquote><figcaption><img className="hf-country-flag" src={"/assets/flags/" + item.country.toLowerCase() + ".svg"} alt={{SG:"Singapore",SA:"Saudi Arabia",OM:"Oman",QA:"Qatar"}[item.country]} width="42" height="28" loading="lazy" /></figcaption></figure>; })}</div>)}</div></div>
    </div></section>
  </main>;
}
