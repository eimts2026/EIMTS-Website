import { useEffect, useState } from "react";
import Link from "../../components/ui/Link";
import ClientGlobe from "../../components/visuals/ClientGlobe";

const categories = [
  ["Engineering & Technical", "Skilled roles across complex industries"],
  ["Hospitality & Culinary", "Hotels, restaurants and guest experiences"],
  ["Automotive & Transport", "Mobility, maintenance and logistics"],
  ["Construction & Trades", "Experienced hands for ambitious projects"],
  ["Healthcare", "Care professionals for global organisations"],
  ["Retail & Administration", "People who keep businesses moving"],
];

const testimonials = [
  { quote: "Always the best support, whenever it is required. A recruitment partner we genuinely value.", name: "Mohammed Haneefa", company: "Apparel Group", place: "Saudi Arabia" },
  { quote: "Professional staff, a welcoming environment and service that makes every requirement feel carefully handled.", name: "Rajakumar", company: "Thabat", place: "K.S.A" },
  { quote: "From the first day, the team took our requirements seriously. I truly appreciate the partnership.", name: "Sultan Rashid", company: "Alshaheen Arabic Modern", place: "Muscat, Oman" },
  { quote: "A fantastic experience from start to finish. The communication, care and candidate support were excellent.", name: "Taniya Perera", company: "Raffles & Fairmont", place: "Qatar" },
];

const heroSlides = [
  {
    image: "/assets/emerald-journey-hero.webp",
    kicker: "Global careers. Human guidance.",
    title: "Your next chapter starts beyond borders.",
    copy: "Trusted manpower and travel services connecting Sri Lankan talent with respected employers since 1995.",
  },
  {
    image: "/assets/hero-employer-partnership.webp",
    kicker: "Trusted recruitment. Stronger teams.",
    title: "Exceptional people build stronger businesses.",
    copy: "Industry-focused recruitment connecting respected employers with carefully screened talent.",
  },
  {
    image: "/assets/hero-travel-guidance.webp",
    kicker: "From application to arrival.",
    title: "Every overseas journey deserves clear guidance.",
    copy: "Recruitment, documentation and travel support brought together by one accountable team.",
  },
];

const companyStory = [
  {
    year: "1995",
    title: "A Sri Lankan promise with a global horizon.",
    copy: "Emerald Isle began with a simple belief: overseas opportunity should improve a person’s life without leaving them to navigate uncertainty alone.",
    image: "/assets/candidate-service.webp",
    marker: "Founded in Sri Lanka",
  },
  {
    year: "Responsible recruitment",
    title: "Trust became the way we work.",
    copy: "Careful screening, honest communication and accountable processes shaped every placement. Today we continue that standard as an SLBFE-licensed recruitment partner.",
    image: "/assets/employer-service.webp",
    marker: "SLBFE License No. 1162",
  },
  {
    year: "One journey",
    title: "Recruitment does not end with an offer letter.",
    copy: "Our teams connect recruitment, documentation and travel guidance into one continuous experience, supporting candidates and employers from first conversation to arrival.",
    image: "/assets/hero-travel-guidance.webp",
    marker: "Recruitment · documents · travel",
  },
  {
    year: "Today",
    title: "32 years on, the promise still travels.",
    copy: "Seven recognitions, regional partnerships and long-standing client relationships reflect a reputation built one responsible placement at a time.",
    image: "/assets/hero-employer-partnership.webp",
    marker: "7 awards · 32+ years",
  },
];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeStory, setActiveStory] = useState(0);
  const activeHero = heroSlides[activeSlide];

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    document.documentElement.classList.add("ei-motion-ready");
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.14 });

    nodes.forEach((node) => observer.observe(node));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("ei-motion-ready");
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const steps = Array.from(document.querySelectorAll<HTMLElement>("[data-story-step]"));
    if (steps.length === 0) return;

    let ticking = false;

    const updateActiveStory = () => {
      const viewportCenter = window.innerHeight / 2;
      let closestStep = 0;
      let minDistance = Infinity;

      steps.forEach((step, index) => {
        const rect = step.getBoundingClientRect();
        const stepCenter = rect.top + rect.height / 2;
        const distance = Math.abs(stepCenter - viewportCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestStep = index;
        }
      });

      setActiveStory(closestStep);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveStory);
        ticking = true;
      }
    };

    updateActiveStory();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return <main id="main" className="ei-home">
    <section className="ei-hero ei-hero-slider" aria-labelledby="home-title">
      <div className="ei-hero-slides" aria-hidden="true">
        {heroSlides.map((slide, index) => <img
          className={"ei-hero-image ei-hero-slide" + (index === activeSlide ? " is-active" : "")}
          src={slide.image}
          alt=""
          width="1824"
          height="1024"
          fetchPriority={index === 0 ? "high" : "auto"}
          loading={index === 0 ? "eager" : "lazy"}
          key={slide.image}
        />)}
      </div>
      <div className="ei-hero-shade" />
      <div className="container ei-hero-content">
        <div className="ei-hero-copy" key={activeHero.image}>
          <p className="ei-kicker">{activeHero.kicker}</p>
          <h1 id="home-title">{activeHero.title}</h1>
          <p>{activeHero.copy}</p>
          <div className="ei-actions">
            <Link className="ei-button ei-button-bright" href="/foreign-job-vacancies/">
              Explore foreign jobs
              <span className="ei-button__icon-wrapper">
                <svg viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="ei-button__icon-svg" width={10} height={10}>
                  <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" />
                </svg>
                <svg viewBox="0 0 14 15" fill="none" width={10} height={10} xmlns="http://www.w3.org/2000/svg" className="ei-button__icon-svg ei-button__icon-svg--copy">
                  <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" />
                </svg>
              </span>
            </Link>
            <Link className="ei-text-action" href="/client-recruitment-solutions/">Hire exceptional talent <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </div>
      <div className="container ei-hero-foot" aria-label="Company credentials"><span>Licensed by SLBFE</span><span>License No. 1162</span><span>Europe · Middle East · Asia · Africa</span></div>
    </section>

    <section className="ei-intro" data-reveal><div className="container ei-intro-grid"><p className="ei-side-note">One journey. One accountable partner.</p><div><h2>Opportunity should feel exciting, never uncertain.</h2><p>For three decades, we have helped people and organisations move forward with clarity. This is the story behind every journey we support.</p></div></div></section>

    <section className="ei-company-story" aria-labelledby="company-story-title">
      <div className="container ei-story-heading" data-reveal>
        <p>Our story</p>
        <h2 id="company-story-title">Built one responsible journey at a time.</h2>
      </div>
      <div className="container ei-story-layout">
        <div className="ei-story-stage" aria-hidden="true">
          <div className="ei-story-images">
            {companyStory.map((chapter, index) => <img className={index === activeStory ? "is-active" : ""} src={chapter.image} alt="" width="900" height="1125" loading="lazy" key={chapter.title} />)}
            <div className="ei-story-image-shade" />
            <p>{companyStory[activeStory].marker}</p>
          </div>
          <div className="ei-story-progress">
            <span>{String(activeStory + 1).padStart(2, "0")}</span>
            <div>{companyStory.map((chapter, index) => <i className={index <= activeStory ? "is-active" : ""} key={chapter.title} />)}</div>
            <span>{String(companyStory.length).padStart(2, "0")}</span>
          </div>
        </div>
        <div className="ei-story-chapters">
          {companyStory.map((chapter, index) => <article className={"ei-story-chapter" + (index === activeStory ? " is-active" : "")} data-story-step={index} key={chapter.title}>
            <img className="ei-story-mobile-image" src={chapter.image} alt="" width="900" height="650" loading="lazy" />
            <span>{chapter.year}</span>
            <h3>{chapter.title}</h3>
            <p>{chapter.copy}</p>
            {index === companyStory.length - 1 && <Link href="/about-us-emerald-isle-manpower/">Discover our company <b aria-hidden="true">→</b></Link>}
          </article>)}
        </div>
      </div>
    </section>

    <section className="ei-paths" aria-labelledby="paths-title"><div className="container">
      <div className="ei-title-row" data-reveal><h2 id="paths-title">Built for both sides of the journey.</h2><Link href="/about-us-emerald-isle-manpower/">Why Emerald Isle <span aria-hidden="true">→</span></Link></div>
      <div className="ei-path-grid"><article className="ei-path ei-path-candidate" data-reveal><span>For candidates</span><h3>Find work that takes your life forward.</h3><p>Verified vacancies, honest guidance and personal support from application to departure.</p><Link href="/foreign-job-vacancies/">Find your opportunity <b className="ei-path__icon-wrapper"><svg viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="ei-path__icon-svg" width={10} height={10}><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" /></svg><svg viewBox="0 0 14 15" fill="none" width={10} height={10} xmlns="http://www.w3.org/2000/svg" className="ei-path__icon-svg ei-path__icon-svg--copy"><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" /></svg></b></Link></article><article className="ei-path ei-path-employer" data-reveal><span>For employers</span><h3>Build teams ready to make an impact.</h3><p>Industry-focused sourcing, rigorous screening and dependable deployment across borders.</p><Link href="/client-recruitment-solutions/">Start recruiting <b className="ei-path__icon-wrapper"><svg viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="ei-path__icon-svg" width={10} height={10}><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" /></svg><svg viewBox="0 0 14 15" fill="none" width={10} height={10} xmlns="http://www.w3.org/2000/svg" className="ei-path__icon-svg ei-path__icon-svg--copy"><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" /></svg></b></Link></article></div>
    </div></section>

    <section className="ei-categories" aria-labelledby="categories-title"><div className="container ei-categories-layout">
      <div className="ei-categories-copy" data-reveal><p className="ei-kicker">Where talent travels</p><h2 id="categories-title">Careers for every kind of ambition.</h2><p>Specialist teams understand the skills, standards and cultures behind every placement.</p><Link className="ei-button ei-button-dark" href="/foreign-job-vacancies/">View every vacancy <span className="ei-button__icon-wrapper"><svg viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="ei-button__icon-svg" width={10} height={10}><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" /></svg><svg viewBox="0 0 14 15" fill="none" width={10} height={10} xmlns="http://www.w3.org/2000/svg" className="ei-button__icon-svg ei-button__icon-svg--copy"><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" /></svg></span></Link></div>
      <div className="ei-category-list">{categories.map(([name, copy], index) => <Link data-reveal href="/foreign-job-vacancies/" key={name}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{name}</strong><small>{copy}</small></div><b aria-hidden="true">↗</b></Link>)}</div>
    </div></section>

    <section className="ei-proof" aria-labelledby="proof-title"><div className="container ei-proof-grid">
      <div className="ei-award-statement" data-reveal><span className="ei-award-number">7</span><div><p className="ei-kicker">Awards and recognitions</p><h2 id="proof-title">Excellence is not a claim. It is a record.</h2><p>Five Star recognition, employer-brand honours and decades of responsible recruitment reflect the standard we protect every day.</p><Link href="/about-us-emerald-isle-manpower/">See our credentials <span aria-hidden="true">→</span></Link></div></div>
      <div className="ei-proof-facts" data-reveal><div><strong>30+</strong><span>years serving people and organisations</span></div><div><strong>8</strong><span>regional partner and branch markets</span></div><div><strong>One</strong><span>team from recruitment to travel</span></div></div>
    </div></section>

    <ClientGlobe />

    <section className="ei-testimonials" aria-labelledby="testimonial-title">
      <div className="container">
        <div className="ei-testimonial-heading" data-reveal>
          <h2 id="testimonial-title">Client testimonials</h2>
        </div>
      </div>
      <div className="ei-testimonials-slider-wrapper">
        <div className="ei-testimonials-slider-track">
          {[...testimonials, ...testimonials, ...testimonials].map((item, index) => (
            <figure className="ei-testimonial-slide-card" key={index}>
              <div className="ei-testimonial-quote-icon" aria-hidden="true">&ldquo;</div>
              <blockquote>{item.quote}</blockquote>
              <figcaption>
                <strong>{item.name}</strong>
                <span>{item.company} &middot; {item.place}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  </main>;
}