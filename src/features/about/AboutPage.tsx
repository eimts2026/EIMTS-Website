import { StoryScrollText } from "./StoryScrollText";
import Link from "../../components/ui/Link";
import AboutHero from "./AboutHero";
import LeaderCard, { type Leader } from "./LeaderCard";
import CertificateSlider from "./CertificateSlider";
import RollingGallery, { type RollingGalleryItem } from "./RollingGallery";
import BootstrapIcon from "../../components/ui/BootstrapIcon";
import "./AboutPage.css";

// ============================================================================
// 1. LEADERSHIP TEAM DIRECTORY
// Edit executive names, roles, initials, and portrait image paths here.
// Image files stored in: /public/assets/leadership/
// ============================================================================

// Personal LinkedIn profiles. Omit linkedinUrl to hide the link, as for Tara.

const leaders: Leader[] = [
  { name: "Hemantha Sapumohotti", role: "Chief Executive Officer", initials: "HS", image: "/assets/leadership/hemantha.webp", linkedinUrl: "https://www.linkedin.com/in/hemanthasapumohotti/" },
  { name: "Linda Gray, MBA (UWS, Australia)", role: "Talent & Culture Director", initials: "LG", image: "/assets/leadership/linda.webp", linkedinUrl: "https://www.linkedin.com/in/linda-gray-eimts/" },
  { name: "Dr. Tara Giovanna, MB, BCh, BAO (Hons)", role: "Director", initials: "TG", image: "/assets/leadership/tara.webp" },
  { name: "Dharshini", role: "Business Development Manager", initials: "D", image: "/assets/leadership/dharshini.webp", linkedinUrl: "https://www.linkedin.com/in/udhaya-dharshini-7825882a9/" },
  { name: "Angeline Cooke", role: "Senior Administrative Manager", initials: "AC", image: "/assets/leadership/angeline.webp", linkedinUrl: "https://www.linkedin.com/in/angeline-cooke/" },
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
    <AboutHero />
    <section className="ei-about-story" id="about-story"><div className="container ei-about-story-grid"><div><h2>Sri Lankan talent. Global opportunity.</h2></div><div><StoryScrollText paragraphs={["Emerald Isle Manpower & Travel Services is a Sri Lankan recruitment agency connecting people with overseas employment and helping employers build capable teams. Since 1995, we have brought personal attention and industry expertise to international recruitment.","Every recruitment assignment is unique. Our specialist teams combine labour-market research, careful screening and close client collaboration to create the right fit for skills, culture and long-term success.","From Sri Lanka, our network extends through Nepal, Bangladesh, India, Pakistan, Indonesia, the Philippines, Kenya and Myanmar, supporting placements across the Middle East, Europe, Romania and Ireland."]} /><div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center", marginTop: "24px" }}><Link className="ei-button ei-button-dark" href="/client-recruitment-solutions/#employer-inquiry">Talk to our team <span className="ei-button__icon-wrapper"><svg viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="ei-button__icon-svg" width={10} height={10}><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" /></svg><svg viewBox="0 0 14 15" fill="none" width={10} height={10} xmlns="http://www.w3.org/2000/svg" className="ei-button__icon-svg ei-button__icon-svg--copy"><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" /></svg></span></Link><Link className="ei-button ei-button-amber" href="/contact/#branch-map-section">Find us <span className="ei-button__icon-wrapper"><svg viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="ei-button__icon-svg" width={10} height={10}><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" /></svg><svg viewBox="0 0 14 15" fill="none" width={10} height={10} xmlns="http://www.w3.org/2000/svg" className="ei-button__icon-svg ei-button__icon-svg--copy"><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" /></svg></span></Link></div></div></div></section>

    <section className="ei-about-credentials" aria-labelledby="credentials-title">
      <div className="container">
        <div className="ei-about-credentials-head"><h2 id="credentials-title">Our recruitment licences</h2><p>Registered with the Sri Lanka Bureau of Foreign Employment.</p></div>
        <dl className="ei-about-license-list">
          <div><dt>Head office · Mount Lavinia</dt><dd><span>SLBFE licence no.</span>1162</dd></div>
          <div><dt>Kandy branch</dt><dd><span>SLBFE licence no.</span>1162</dd></div>
          <div><dt>Batticaloa branch</dt><dd><span>SLBFE licence no.</span>2169</dd></div>
          <div><dt>Kurunegala branch</dt><dd><span>SLBFE licence no.</span>2268</dd></div>
        </dl>
        <a className="ei-about-verify" href="https://www.slbfe.lk/" target="_blank" rel="noreferrer">Check agency registration with SLBFE <span className="sr-only">(opens in a new tab)</span></a>
      </div>
    </section>
    <section className="ei-management" aria-labelledby="management-title">
      <div className="container">
        <div className="ei-title-row">
          <h2 id="management-title">The people guiding Emerald Isle.</h2>
          <p>Experienced leadership, shared standards and a commitment to responsible recruitment.</p>
        </div>
        <div className="ei-leader-list">
          {leaders.map((leader) => <LeaderCard key={leader.name} leader={leader} />)}
        </div>
      </div>
    </section>
    <section className="ei-about-strengths" aria-labelledby="strengths-title">
      <div className="container ei-about-strengths-grid">
        <div><h2 id="strengths-title">Why employers and candidates choose Emerald Isle.</h2><p>Recruitment that starts with understanding people and follows through on the details.</p></div>
        <div className="ei-about-strengths-list">
          <article><span className="ei-strength-icon ei-strength-icon--briefcase" aria-hidden="true" /><div><h3>Specialists who understand your industry</h3><p>Dedicated teams combine labour-market research with a clear understanding of each employer’s requirements.</p></div></article>
          <article><span className="ei-strength-icon ei-strength-icon--person-check" aria-hidden="true" /><div><h3>Careful screening. A considered match.</h3><p>We look at skills, experience and ambitions to connect candidates with roles that fit and employers with capable people.</p></div></article>
          <article><span className="ei-strength-icon ei-strength-icon--compass" aria-hidden="true" /><div><h3>Guidance through the recruitment journey</h3><p>From the first conversation to documentation and deployment support, our team helps candidates understand their next steps.</p></div></article>
          <article><span className="ei-strength-icon ei-strength-icon--globe" aria-hidden="true" /><div><h3>Local knowledge. International reach.</h3><p>Our Sri Lankan roots and overseas network bring people and employers together across borders.</p></div></article>
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
              <span className="ei-recognition-arrow" aria-hidden="true"><BootstrapIcon name="arrow-up-right" /></span>
            </article>)}
          </div>
        </div>
      </div>
    </section>
    <section className="ei-award-showcase" aria-labelledby="award-showcase-title">
      <div className="container">
        <div className="ei-award-showcase-head">
          <h2 id="award-showcase-title">Awards & Achievements.</h2>
          <p>A closer look at the milestones that recognise our standards, service and recruitment excellence.</p>
        </div>
        <RollingGallery items={awardGallery} autoplay pauseOnHover={false} />
        <CertificateSlider />
      </div>
    </section>
  </main>;
}
