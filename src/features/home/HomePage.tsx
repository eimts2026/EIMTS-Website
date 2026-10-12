"use client";
import { useRef } from "react";
import type { HeroContent } from "../../lib/hero";
import Link from "../../components/ui/Link";
import { EmployerInquiryForm } from "../../components/ui/EmployerInquiryForm";
import type { Job } from "../jobs/JobsPage";
import ClientGlobe from "../../components/visuals/ClientGlobe";
import "./HomePage.css";
import * as Flags from "country-flag-icons/react/3x2";
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
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const occasion = hero.takeover ? hero.slides[0] : null;
  const enquire = () => { trigger.current = document.activeElement as HTMLElement; dialog.current?.showModal(); };
  return <main id="main" className="home-foundation">
    <section className="recruit-hero" aria-labelledby="home-title"><div className="hf-shell">
      <div className="recruit-hero-top"><span>Emerald Isle · International recruitment</span><span>Since 1995 / Sri Lanka</span></div>
      <div className="recruit-hero-grid"><div className="recruit-hero-copy">
        <p className="recruit-hero-kicker">Your next chapter starts here</p>
        <h1 id="home-title">{occasion ? occasion.title : <>Your skills.<br />A world of<br /><span>opportunity.</span></>}</h1>
        <p className="recruit-hero-lead">{occasion ? occasion.copy : "Take your career beyond borders. We connect Sri Lankan talent with overseas employers, with guidance from your first application to arrival."}</p>
        <div className="recruit-hero-actions"><Link className="hf-button" href={jobsUrl}>Explore overseas jobs <span aria-hidden="true">↗</span></Link><button className="hf-link" onClick={enquire}>I’m hiring talent <span aria-hidden="true">↗</span></button></div>
        <div className="recruit-hero-license"><span aria-hidden="true">✓</span> SLBFE licensed · License No. 1162</div>
      </div><div className="recruit-board" aria-label="Current overseas opportunities">
        <div className="recruit-board-heading"><span className="recruit-board-dot" />Now recruiting <span className="recruit-board-code">LK → WORLD</span></div>
        <div className="recruit-board-title">Where will your<br />skills take you?</div>
        <div className="recruit-board-jobs">{urgentJobs.length ? urgentJobs.slice(0,3).map((job,index)=><Link key={job.id} href={jobsUrl+job.slug+"/"} className="recruit-board-job"><span className="recruit-board-number">0{index+1}</span><div><small>{job.country || job.location}</small><strong>{job.title}</strong><span>{job.category}</span></div><span aria-hidden="true">↗</span></Link>) : <div className="recruit-board-empty"><p>Your next destination begins with a conversation.</p><Link href={jobsUrl}>Browse current vacancies ↗</Link></div>}</div>
        <div className="recruit-board-bottom"><span>Find your role. Build your future.</span><svg viewBox="0 0 72 28" aria-hidden="true"><path d="M1 1v26m4-26v26m6-26v26m3-26v26m7-26v26m4-26v26m3-26v26m7-26v26m3-26v26m5-26v26m6-26v26m3-26v26m7-26v26m4-26v26m3-26v26" stroke="currentColor" strokeWidth="2" /></svg></div>
      </div></div>
      <div className="recruit-hero-foot"><span>Recruitment with responsibility.</span><div><span>Career guidance</span><span>Documentation</span><span>Deployment support</span></div><a href="#urgent-title">See opportunities ↓</a></div>
    </div></section>
    <section className="hf-section hf-jobs" aria-labelledby="urgent-title"><div className="hf-shell">
      <div className="hf-heading"><div><p className="hf-eyebrow"><i />Your next chapter</p><h2 id="urgent-title">Urgent opportunities.<br /><em>A world ahead of you.</em></h2></div><Link className="hf-link" href={jobsUrl}>View all vacancies <span aria-hidden="true">↗</span></Link></div>
      {urgentJobs.length > 0 ? <div className="hf-job-grid">{urgentJobs.map(job => <Link className="hf-job-card" href={jobsUrl + job.slug + "/"} key={job.id}>
        <div className="hf-job-image"><img src={job.image} alt="" loading="lazy" style={{ objectPosition: job.imagePosition }} /><span>Urgent hiring</span></div>
        <div className="hf-job-body"><p className="hf-eyebrow">{job.country && job.country !== job.location ? job.location + ", " + job.country : job.location}</p><h3>{job.title}</h3><div className="hf-job-meta"><span>{job.category}</span><span>{job.employmentType}</span></div><div className="hf-job-bottom"><small>{job.expiresAt ? "Apply by " + new Date(job.expiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Colombo" }) : "View job details"}</small><span aria-label="View job and apply">↗</span></div></div>
      </Link>)}</div> : <div className="hf-empty"><div><h3>Your next opportunity starts here.</h3><p>No urgent vacancies are listed right now. Explore our current openings or speak with our team for guidance.</p></div><Link className="hf-button" href={jobsUrl}>Explore vacancies <span aria-hidden="true">↗</span></Link></div>}
    </div></section>
    <section className="hf-section hf-paths" aria-labelledby="paths-title"><div className="hf-shell">
      <div className="hf-heading"><div><p className="hf-eyebrow">Different ambitions. Shared commitment.</p><h2 id="paths-title">Built for both sides<br />of the journey.</h2></div><p>Whether you’re taking your next career step or building your team, it starts with a conversation.</p></div>
      <div className="hf-path-grid">
        <article className="hf-path"><img src="/assets/home-story/career-guidance.webp" alt="" loading="lazy" /><div><p className="hf-eyebrow">For candidates</p><h3>A career that<br />takes you further.</h3><p>Verified vacancies, honest guidance and personal support from application to departure.</p><Link className="hf-button hf-white" href={jobsUrl}>Find your opportunity <span aria-hidden="true">↗</span></Link></div></article>
        <article className="hf-path"><img src="/assets/hero-employer-partnership.webp" alt="" loading="lazy" /><div><p className="hf-eyebrow">For employers</p><h3>The right people.<br />A stronger team.</h3><p>Industry-focused sourcing, rigorous screening and dependable deployment across borders.</p><button className="hf-button hf-white" onClick={enquire}>Start recruiting <span aria-hidden="true">↗</span></button><Link className="hf-path-contact" href="/client-recruitment-solutions/">Explore our solutions →</Link></div></article>
      </div>
    </div></section>
    <ClientGlobe />
    <section className="hf-section hf-purpose" aria-labelledby="purpose-title"><div className="hf-shell">
      <div className="hf-heading"><div><p className="hf-eyebrow">What we stand for</p><h2 id="purpose-title">People at the heart.<br /><em>Purpose in every placement.</em></h2></div><Link className="hf-link" href={aboutUrl}>Get to know us <span aria-hidden="true">↗</span></Link></div>
      <div className="hf-purpose-grid"><article><span aria-hidden="true">↗</span><h3>Our vision</h3><p>To be recognised globally as an innovative and efficient human capital solutions partner.</p></article><article><span aria-hidden="true">◎</span><h3>Our mission</h3><p>We enhance every client’s success and improve every employee’s quality of life through the dignity and power of gainful employment, delivering best-in-class human capital solutions.</p></article></div>
      <div className="hf-values"><h3>Our core values</h3><div>{["Respect", "Diversity", "Teamwork", "Empowerment", "Community"].map(value => <span key={value}><i aria-hidden="true">✳</i>{value}</span>)}</div></div>
    </div></section>
    <section className="hf-section hf-story" aria-labelledby="story-title"><div className="hf-shell hf-story-grid">
      <div className="hf-story-image"><img src="/assets/home-story/global-partnership.webp" alt="" loading="lazy" width="900" height="1000" /><span>Our roots are local.<br /><strong>Our outlook is global.</strong></span></div>
      <div className="hf-story-copy"><p className="hf-eyebrow">The Emerald Isle story · Since 1995</p><h2 id="story-title">Built one responsible<br /><em>journey at a time.</em></h2><p>Emerald Isle began with a simple belief: overseas opportunity should improve a person’s life without leaving them to navigate uncertainty alone.</p><p>Our teams connect recruitment, documentation and travel guidance into one continuous experience, supporting candidates and employers from first conversation to arrival.</p><div className="hf-story-facts"><div><strong>Since 1995</strong><span>Opening doors responsibly</span></div><div><strong>One team</strong><span>From application to arrival</span></div></div><Link className="hf-awards" href={aboutUrl}><img src="/assets/about-awards/award-hero-1.webp" alt="Emerald Isle award recognition" loading="lazy" /><div><strong>A recognised recruitment partner.</strong><span>Explore our awards and credentials ↗</span></div></Link></div>
    </div></section>
    <section className="hf-section hf-testimonials" aria-labelledby="testimonial-title"><div className="hf-shell">
      <div className="hf-heading"><div><p className="hf-eyebrow">Client testimonials</p><h2 id="testimonial-title">Good partnerships.<br /><em>In their own words.</em></h2></div><p>The people and organisations behind the journeys we make possible.</p></div>
      <div className="hf-quote-window" tabIndex={0} role="region" aria-label="Client testimonials; focus to pause scrolling"><div className="hf-quote-track">{[0, 1].map(copy => <div className="hf-quote-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{testimonials.map(item => { const Flag = Flags[item.country as keyof typeof Flags]; return <figure className="hf-quote" key={item.quote}><span className="hf-quote-mark" aria-hidden="true">“</span><blockquote>{item.quote}</blockquote><figcaption><Flag className="hf-country-flag" role="img" aria-label={new Intl.DisplayNames(["en"], {type:"region"}).of(item.country!)} /></figcaption></figure>; })}</div>)}</div></div>
    </div></section>
    <section className="hf-contact" aria-labelledby="contact-title"><div className="hf-shell"><div><p className="hf-eyebrow">Your next chapter starts here</p><h2 id="contact-title">Let’s move<br />forward, together.</h2></div><div><p>A new opportunity. A growing team.<br />Tell us where you want to go.</p><div className="hf-actions"><Link className="hf-button hf-white" href="/contact/">Talk to our team <span aria-hidden="true">↗</span></Link><button className="hf-link" onClick={enquire}>Hire talent <span aria-hidden="true">↗</span></button></div></div></div></section>
    <dialog ref={dialog} className="employer-inquiry-dialog" aria-labelledby="home-employer-inquiry-title" onClose={() => trigger.current?.focus()} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}><button type="button" className="employer-inquiry-dialog-close" onClick={() => dialog.current?.close()} aria-label="Close inquiry form">×</button><EmployerInquiryForm headingId="home-employer-inquiry-title" /></dialog>
  </main>;
}
