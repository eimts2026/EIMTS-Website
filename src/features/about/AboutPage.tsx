import Link from "../../components/ui/Link";
import RollingGallery, { type RollingGalleryItem } from "./RollingGallery";
import "./AboutPage.css";

type Leader = {
  name: string;
  role: string;
  initials: string;
  image?: string;
};

const leaders: Leader[] = [
  { name: "Hemantha Sapumohotti", role: "Chief Executive Officer", initials: "HS", image: "/assets/leadership/hemantha.webp" },
  { name: "Linda Gray, MBA (UWS, Australia)", role: "Talent & Culture Director", initials: "LG", image: "/assets/leadership/linda.webp" },
  { name: "Dr. Tara Giovanna, MB, BCh, BAO (Hons)", role: "Director", initials: "TG", image: "/assets/leadership/tara.webp" },
  { name: "Melani White", role: "Operations Manager", initials: "MW", image: "/assets/leadership/melani.webp" },
  { name: "Angeline Cooke", role: "Senior Administrative Manager", initials: "AC", image: "/assets/leadership/angeline.webp" },
];
const recognitionMilestones = [
  { marker: "2016—2024", name: "Best Employer Brand", detail: "Recognised for nine consecutive years" },
  { marker: "Asia", name: "Top 100 Employer Brands", detail: "World HRD Congress, Singapore" },
  { marker: "Recruitment", name: "Five Star Award", detail: "Recruitment excellence" },
  { marker: "Service", name: "Excellence Award", detail: "Consistent service standards" },
  { marker: "Development", name: "Certified Training Partner", detail: "Professional development" },
];
const awardGallery: RollingGalleryItem[] = [
  {
    title: "Golden Award 2022",
    image: "/assets/about-awards/golden-award-2022.webp",
    alt: "Emerald Isle Golden Award 2022 trophy",
  },
  {
    title: "Excellence Award 2012",
    image: "/assets/about-awards/excellence-award-2012.webp",
    alt: "Emerald Isle Excellence Award 2012 trophy",
  },
  {
    title: "Women Leadership Award",
    image: "/assets/about-awards/women-leadership-award.webp",
    alt: "Emerald Isle Sri Lanka Women Leadership Award trophy",
  },
  {
    title: "Employer Brand Award",
    image: "/assets/about-awards/employer-brand-award.webp",
    alt: "Emerald Isle Employer Brand Award trophy",
  },
  {
    title: "Excellence Award 2014",
    image: "/assets/about-awards/excellence-award-2014.webp",
    alt: "Emerald Isle Excellence Award 2014 trophy",
  },
];

export default function AboutPage() {
  return <main id="main" className="ei-about-page">
    <section className="ei-about-hero" aria-labelledby="about-hero-title">
      <div className="ei-about-hero-slides" aria-hidden="true">
        <div className="ei-about-hero-slide">
          <img className="ei-about-hero-blur" src="/assets/about-awards/award-hero-1.webp" alt="" width="2560" height="1706" />
          <img className="ei-about-hero-image" src="/assets/about-awards/award-hero-1.webp" alt="" width="2560" height="1706" fetchPriority="high" />
        </div>
        <div className="ei-about-hero-slide">
          <img className="ei-about-hero-blur" src="/assets/about-awards/award-hero-2.webp" alt="" width="2560" height="1834" />
          <img className="ei-about-hero-image" src="/assets/about-awards/award-hero-2.webp" alt="" width="2560" height="1834" loading="eager" />
        </div>
        <div className="ei-about-hero-slide">
          <img className="ei-about-hero-blur" src="/assets/about-awards/award-hero-3.webp" alt="" width="2560" height="1718" />
          <img className="ei-about-hero-image" src="/assets/about-awards/award-hero-3.webp" alt="" width="2560" height="1718" loading="eager" />
        </div>
      </div>
      <div className="ei-about-hero-shade" aria-hidden="true" />
      <div className="container ei-about-hero-content">
        <p className="ei-about-anniversary-kicker"><span>32nd anniversary</span> Since 1995</p>
        <h1 id="about-hero-title">
          <span className="ei-about-anniversary-line">32 years of trust.</span>
          <span className="ei-about-anniversary-title">Opening doors across the world.</span>
        </h1>
        <div className="ei-about-hero-foot">
          <p>Celebrating 32 years of connecting Sri Lankan talent with respected employers through responsible recruitment.</p>
          <a href="#about-story">Our story <span aria-hidden="true">↓</span></a>
        </div>
      </div>
    </section>
    <section className="ei-about-story" id="about-story"><div className="container ei-about-story-grid"><div><h2>Built on trust. Designed around people.</h2></div><div><p>Every recruitment assignment is unique. Our specialist teams combine labour-market research, careful screening and close client collaboration to create the right fit for skills, culture and long-term success.</p><p>From Sri Lanka, our network extends through Nepal, Bangladesh, India, Pakistan, Indonesia, the Philippines, Kenya and Myanmar, supporting placements across the Middle East, Europe, Romania and Ireland.</p><Link className="ei-button ei-button-dark" href="/contact/">Talk to our team <span className="ei-button__icon-wrapper"><svg viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="ei-button__icon-svg" width={10} height={10}><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" /></svg><svg viewBox="0 0 14 15" fill="none" width={10} height={10} xmlns="http://www.w3.org/2000/svg" className="ei-button__icon-svg ei-button__icon-svg--copy"><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" /></svg></span></Link></div></div></section>
    <section className="ei-beliefs"><div className="container"><div className="ei-belief-grid"><article><span>Vision</span><h2>To be recognised globally as an innovative and efficient human capital solutions partner.</h2></article><article><span>Mission</span><p>We enhance every client’s success and improve every employee’s quality of life through the dignity and power of gainful employment, delivering best-in-class human capital solutions.</p></article><article><span>Values</span><div className="ei-values"><strong>Respect</strong><strong>Diversity</strong><strong>Teamwork</strong><strong>Empowerment</strong><strong>Community</strong></div></article></div></div></section>
    <section className="ei-management" aria-labelledby="management-title">
      <div className="container">
        <div className="ei-title-row">
          <h2 id="management-title">The people guiding Emerald Isle.</h2>
          <p>Experienced leadership, shared standards and a commitment to responsible recruitment.</p>
        </div>
        <div className="ei-leader-list">
          {leaders.map((leader) => <article className="ei-leader-card" key={leader.name} tabIndex={0} aria-label={`${leader.name}, ${leader.role}`}>
            <div className="ei-leader-portrait">
              {leader.image
                ? <img src={leader.image} alt="" width="640" height="800" loading="lazy" />
                : <span className="ei-leader-placeholder" aria-hidden="true">{leader.initials}</span>}
            </div>
            <div className="ei-leader-details">

              <h3>{leader.name}</h3>
              <p>{leader.role}</p>
            </div>
          </article>)}
        </div>
      </div>
    </section>
    <section className="ei-recognition" aria-labelledby="recognition-title">
      <div className="container">
        <div className="ei-recognition-head">
          <h2 id="recognition-title">Trusted by clients.<br />Recognised by the industry.</h2>
          <p>Every distinction points back to the same standard: responsible recruitment, strong leadership and better outcomes for people.</p>
        </div>
        <div className="ei-recognition-wall">
          <article className="ei-recognition-feature">
            <div className="ei-recognition-stars" aria-hidden="true">★★★★★</div>
            <p className="ei-recognition-source">Sri Lanka Bureau of Foreign Employment</p>
            <h3>Five Star<br />Award</h3>
            <p>The only SLBFE Five Star Award-winning recruitment company in Sri Lanka, recognised on two consecutive occasions.</p>
            <div className="ei-recognition-feature-foot">
              <strong>2×</strong>
              <span>consecutive<br />recognition</span>
            </div>
          </article>
          <div className="ei-recognition-ledger" aria-label="Additional recognitions">
            {recognitionMilestones.map((milestone) => <article className="ei-recognition-milestone" key={milestone.name}>
              <span className="ei-recognition-marker">{milestone.marker}</span>
              <div>
                <h3>{milestone.name}</h3>
                <p>{milestone.detail}</p>
              </div>
              <span className="ei-recognition-arrow" aria-hidden="true">↗</span>
            </article>)}
          </div>
        </div>
      </div>
    </section>
    <section className="ei-award-showcase" aria-labelledby="award-showcase-title">
      <div className="container">
        <div className="ei-award-showcase-head">
          <h2 id="award-showcase-title">Awards in focus.</h2>
          <p>A closer look at the milestones that recognise our standards, service and recruitment excellence.</p>
        </div>
        <RollingGallery items={awardGallery} autoplay pauseOnHover={false} />
      </div>
    </section>
    <section className="ei-license"><div className="container"><div><p>Licensed and accountable</p><h2>SLBFE License No. 1162</h2></div><p>We operate under the Sri Lanka Bureau of Foreign Employment and follow regulatory requirements for compliant, ethical international recruitment.</p></div></section>
  </main>;
}
