"use client";
import { useEffect, useRef, useState } from "react";
import type { HeroContent } from "../../lib/hero";
import Link from "../../components/ui/Link";
import { EmployerInquiryForm } from "../../components/ui/EmployerInquiryForm";
import type { Job } from "../jobs/JobsPage";
import ClientGlobe from "../../components/visuals/ClientGlobe";
import "./HomePage.css";
const testimonials = [
  { quote: "Professional approach at Emeraldisle", name: "Chandana weerasinghe", company: "Afaq Al saree", place: "", avatar: "" },
  { quote: "This 5th intake is one of the most challenging intake recruitment drives in recent memory with the holiday season and Simultaneously deployment of 3rd and 4th intake nurses. Inspite of the challenges. This recruitment drive has also seen the largest number", name: "Mr.Aden", company: "Vision Manpower Singapore", place: "", avatar: "" },
  { quote: "Always the best support, whenever it is required. A recruitment partner we genuinely value.", name: "Mohammed Haneefa", company: "Apparel Group", place: "Saudi Arabia", avatar: "" },
  { quote: "Professional staff, a welcoming environment and service that makes every requirement feel carefully handled.", name: "Rajakumar", company: "Thabat", place: "Saudi Arabia", avatar: "" },
  { quote: "From the first day, the team took our requirements seriously. I truly appreciate the partnership.", name: "Sultan Rashid", company: "Alshaheen Arabic Modern", place: "Muscat, Oman", avatar: "" },
  { quote: "A fantastic experience from start to finish. The communication, care and candidate support were excellent.", name: "Taniya Perera", company: "Raffles & Fairmont", place: "Qatar", avatar: "" },
];


const jobsUrl = "/foreign-job-vacancies/";
const aboutUrl = "/about-us-emerald-isle-manpower/";
export default function Home({ hero, urgentJobs = [] }: { hero: HeroContent; urgentJobs?: Job[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const slide = hero.slides[active] ?? hero.slides[0];
  useEffect(() => {
    if (paused || hero.takeover || hero.slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive(n => (n + 1) % hero.slides.length), 7000);
    return () => window.clearInterval(timer);
  }, [paused, hero.takeover, hero.slides.length]);
  const enquire = () => { trigger.current = document.activeElement as HTMLElement; dialog.current?.showModal(); };
  return <main id="main" className="home-foundation">
    <section className="hf-hero" aria-labelledby="home-title">
      <div className="hf-shell hf-hero-layout">
        <div className="hf-hero-copy">
          <p className="hf-eyebrow"><i />{slide.kicker || "People. Possibility. Partnership."}</p>
          <h1 id="home-title">{slide.title}</h1>
          <p className="hf-lead">{slide.copy}</p>
          <div className="hf-actions">
            {slide.ctaLabel && slide.ctaUrl && <Link className="hf-button" href={slide.ctaUrl}>{slide.ctaLabel}<span aria-hidden="true">↗</span></Link>}
            {slide.cta2Label && slide.cta2Url && <Link className="hf-link" href={slide.cta2Url}>{slide.cta2Label}<span aria-hidden="true">↗</span></Link>}
          </div>
          <div className="hf-assurance"><b aria-hidden="true">✓</b><div><strong>Opportunity, with peace of mind.</strong><small>SLBFE licensed · License No. 1162</small></div></div>
        </div>
        <div className="hf-hero-visual">
          {hero.slides.map((item, index) => <img className={index === active ? "is-active" : ""} key={index} src={item.image} alt="" width="900" height="1050" loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} />)}
          <div className="hf-image-note"><span>ROOTED IN SRI LANKA</span><strong>Connected to a<br />world of possibility.</strong><a href="#client-network" aria-label="Explore our global network">↗</a></div>
          {hero.slides.length > 1 && !hero.takeover && <div className="hf-slide-controls" aria-label="Hero slides">{hero.slides.map((_, index) => <button key={index} aria-label={"Show slide " + (index + 1)} aria-pressed={index === active} onClick={() => { setActive(index); setPaused(true); }} />)}<button className="hf-pause" aria-label={paused ? "Play slideshow" : "Pause slideshow"} onClick={() => setPaused(!paused)}>{paused ? "▶" : "Ⅱ"}</button></div>}
        </div>
      </div>
      <div className="hf-shell hf-trust"><span>Bringing people and opportunity together.</span><strong>Since 1995</strong><span>Recruitment</span><span>Documentation</span><span>Travel guidance</span></div>
    </section>
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
        <article className="hf-path"><img src="/assets/home-story/career-guidance.webp" alt="" loading="lazy" /><div><p className="hf-eyebrow">For candidates</p><h3>A career that<br />takes you further.</h3><p>Verified vacancies, honest guidance and personal support from application to departure.</p><Link className="hf-button hf-white" href={jobsUrl}>Find your opportunity <span aria-hidden="true">↗</span></Link><Link className="hf-path-contact" href="/contact/">Talk to our team →</Link></div></article>
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
      <div className="hf-story-copy"><p className="hf-eyebrow">The Emerald Isle story · Since 1995</p><h2 id="story-title">Built one responsible<br /><em>journey at a time.</em></h2><p>Emerald Isle began with a simple belief: overseas opportunity should improve a person’s life without leaving them to navigate uncertainty alone.</p><p>Our teams connect recruitment, documentation and travel guidance into one continuous experience, supporting candidates and employers from first conversation to arrival.</p><div className="hf-story-facts"><div><strong>Since 1995</strong><span>Opening doors responsibly</span></div><div><strong>One team</strong><span>From application to arrival</span></div></div><Link className="hf-link" href={aboutUrl}>Discover our company <span aria-hidden="true">↗</span></Link><Link className="hf-awards" href={aboutUrl}><img src="/assets/about-awards/award-hero-1.webp" alt="Emerald Isle award recognition" loading="lazy" /><div><strong>A recognised recruitment partner.</strong><span>Explore our awards and credentials ↗</span></div></Link></div>
    </div></section>
    <section className="hf-section hf-testimonials" aria-labelledby="testimonial-title"><div className="hf-shell">
      <div className="hf-heading"><div><p className="hf-eyebrow">Client testimonials</p><h2 id="testimonial-title">Good partnerships.<br /><em>In their own words.</em></h2></div><p>The people and organisations behind the journeys we make possible.</p></div>
      <div className="hf-quote-grid">{testimonials.map(item => <figure className="hf-quote" key={item.name}><span className="hf-quote-mark" aria-hidden="true">“</span><blockquote>{item.quote}</blockquote><figcaption><span className="hf-avatar" aria-hidden="true">{item.name.split(" ").slice(0, 2).map(part => part[0]).join("")}</span><div><strong>{item.name}</strong><span>{item.company}</span>{item.place && <small>{item.place}</small>}</div></figcaption></figure>)}</div>
    </div></section>
    <section className="hf-contact" aria-labelledby="contact-title"><div className="hf-shell"><div><p className="hf-eyebrow">Your next chapter starts here</p><h2 id="contact-title">Let’s move<br />forward, together.</h2></div><div><p>A new opportunity. A growing team.<br />Tell us where you want to go.</p><div className="hf-actions"><Link className="hf-button hf-white" href="/contact/">Talk to our team <span aria-hidden="true">↗</span></Link><button className="hf-link" onClick={enquire}>Hire talent <span aria-hidden="true">↗</span></button></div></div></div></section>
    <dialog ref={dialog} className="employer-inquiry-dialog" aria-labelledby="home-employer-inquiry-title" onClose={() => trigger.current?.focus()} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}><button type="button" className="employer-inquiry-dialog-close" onClick={() => dialog.current?.close()} aria-label="Close inquiry form">×</button><EmployerInquiryForm headingId="home-employer-inquiry-title" /></dialog>
  </main>;
}
