/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";

const vacancies = [
  ["Barista Positions in Saudi Arabia", "Saudi Arabia", "Hospitality"],
  ["Assistant General Manager – Hotel", "Ireland", "Hospitality"],
  ["Automotive Technicians", "Saudi Arabia", "Automotive"],
  ["Carpentry & Industrial Jobs", "Serbia", "Skilled Trades"],
  ["Warehouse Associates", "Serbia", "Logistics"],
  ["Culinary Professionals", "Ireland", "Culinary"],
];

const categories = ["Engineering & Technical", "Automotive Services", "Construction & Trades", "Hotel & Restaurant", "Logistics & Warehouse", "Healthcare", "Retail & Administration", "Transport & Driving"];

export const metadata: Metadata = {
  title: "Emerald Isle Manpower – Top Recruitment Agency in Sri Lanka",
  description: "Award-winning recruitment agency in Sri Lanka, connecting skilled candidates with trusted foreign employers and overseas job opportunities.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "en_GB", url: "/", siteName: "Emerald Isle Manpower", title: "Turn Your Dream Job Into Reality", description: "Trusted overseas recruitment and human capital solutions from Sri Lanka.", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Emerald Isle Manpower" }] },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": "https://emeraldislemanpower.com/#organization", name: "Emerald Isle Manpower", url: "https://emeraldislemanpower.com/", email: "info@emeraldisle.lk", telephone: "+94-11-433-5444", address: { "@type": "PostalAddress", streetAddress: "198 Galle Road", addressLocality: "Dehiwala–Mount Lavinia", postalCode: "10370", addressCountry: "LK" } },
    { "@type": "WebSite", "@id": "https://emeraldislemanpower.com/#website", url: "https://emeraldislemanpower.com/", name: "Emerald Isle Manpower", publisher: { "@id": "https://emeraldislemanpower.com/#organization" }, inLanguage: "en-GB" },
  ],
};

export default function Home() {
  return <>
    <main id="main">
      <section className="hero" id="top">
        <div className="hero-orb orb-one" aria-hidden="true" /><div className="hero-orb orb-two" aria-hidden="true" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Trusted overseas recruitment since 1995</p>
            <h1>Turn Your Dream Job Into Reality</h1>
            <p className="hero-lede">Find your next foreign job with Sri Lanka&apos;s award-winning manpower and travel services partner.</p>
            <form className="job-search" action="/foreign-job-vacancies/" method="get">
              <label><span>Job title</span><input name="filter-title" type="search" placeholder="Job title or keywords" /></label>
              <label><span>Location</span><select name="filter-location" defaultValue=""><option value="">All locations</option><option>Ireland</option><option>Saudi Arabia</option><option>Serbia</option><option>Kuwait</option></select></label>
              <label><span>Category</span><select name="filter-category" defaultValue=""><option value="">All categories</option><option>Engineering</option><option>Hospitality</option><option>Automotive</option><option>Healthcare</option></select></label>
              <button type="submit">Find jobs</button>
            </form>
            <p className="popular-searches"><strong>Popular:</strong> Engineer · Driver · Barista · Chef · Technician</p>
          </div>
          <div className="hero-visual" aria-label="Recruitment services for candidates and employers">
            <div className="hero-image-card hero-image-main"><img src="/assets/candidate-service.webp" width="300" height="300" alt="Recruitment support for job candidates" /></div>
            <div className="hero-image-card hero-image-secondary"><img src="/assets/employer-service.webp" width="300" height="300" alt="Recruitment partnership with employers" /></div>
            <div className="success-card"><strong>Trusted placements</strong><span>Across Europe &amp; the Middle East</span></div>
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Recruitment credentials"><div className="container trust-grid"><div><strong>30+</strong><span>Years of service</span></div><div><strong>15+</strong><span>Destination countries</span></div><div><strong>1,000s</strong><span>Successful placements</span></div><div><strong>24/7</strong><span>Candidate support</span></div></div></section>

      <section className="urgent-section" id="jobs"><div className="container">
        <div className="section-heading light-heading"><div><p className="eyebrow">Latest opportunities</p><h2>Urgent Jobs</h2></div><Link className="text-link light-link" href="/foreign-job-vacancies/">View all foreign jobs →</Link></div>
        <p className="section-intro light-copy">Know your worth and find a suitable foreign job that matches your profession.</p>
        <div className="job-grid">{vacancies.map(([title, place, type]) => <article className="job-card" key={title}><span className="job-type">{type}</span><h3>{title}</h3><p>{place} · Full-time</p><Link href="/foreign-job-vacancies/" aria-label={`View ${title}`}>View opportunity <span>→</span></Link></article>)}</div>
      </div></section>

      <section className="about-section" id="about"><div className="container about-grid">
        <div className="about-collage"><img className="about-image-one" src="/assets/candidate-service.webp" width="300" height="300" alt="Candidate recruitment consultation" loading="lazy" /><img className="about-image-two" src="/assets/employer-service.webp" width="300" height="300" alt="Employer recruitment meeting" loading="lazy" /><div className="experience-badge"><strong>No. 01</strong><span>human capital solutions</span></div></div>
        <div className="about-copy"><p className="eyebrow">Better service starts here</p><h2>Professional, honest and people-first recruitment</h2><p>Emerald Isle Manpower and Travel Services is an award-winning recruitment agency in Sri Lanka. Our skilled recruitment officers use modern methods and personalized service to connect candidates with jobs they will love.</p><p>We look beyond qualifications to find the right fit for each company culture, profession and long-term career goal.</p><ul className="check-list"><li>Transparent guidance at every stage</li><li>Verified international employers</li><li>Personalized candidate support</li></ul><Link className="primary-button" href="/about-us-emerald-isle-manpower/">Discover our story</Link></div>
      </div></section>

      <section className="categories-section" id="categories"><div className="container">
        <div className="section-heading light-heading"><div><p className="eyebrow">Explore your path</p><h2>Popular Job Categories</h2></div></div>
        <div className="category-grid">{categories.map((name, index) => <Link className="category-card" href="/foreign-job-vacancies/" key={name}><span className="category-number">{String(index + 1).padStart(2, "0")}</span><span><strong>{name}</strong><small>View opportunities</small></span><span className="category-arrow">↗</span></Link>)}</div>
      </div></section>

      <section className="employer-section" id="employers"><div className="container employer-grid"><div><p className="eyebrow">Serving our clients as one source</p><h2>Recruitment solutions built around your workforce</h2></div><div><p>From role scoping and candidate screening to documentation and deployment, our team provides one accountable recruitment partnership.</p><Link className="primary-button inverse-button" href="/client-recruitment-solutions/">Recruit with us</Link></div></div><div className="container client-list" aria-label="Selected clients"><span>Apparel Group</span><span>Raffles &amp; Fairmont</span><span>Thabat</span><span>Alshaheen</span></div></section>

      <section className="contact-section" id="contact"><div className="container contact-grid">
        <div className="contact-copy"><p className="eyebrow">Let&apos;s talk</p><h2>Start your inquiry</h2><p>Tell us whether you are looking for your next career opportunity or the right people for your organization.</p><address><strong>Emerald Isle Manpower</strong><br />198 Galle Road, Dehiwala–Mount Lavinia 10370, Sri Lanka<br /><a href="tel:+94114335444">+94 11 433 5444</a><br /><a href="mailto:info@emeraldisle.lk">info@emeraldisle.lk</a></address><Link className="text-link" href="/contact/">View every office →</Link></div>
        <form className="inquiry-form" action="mailto:info@emeraldisle.lk" method="post" encType="text/plain"><div className="form-row"><label><span>Your name</span><input required name="name" autoComplete="name" /></label><label><span>Email address</span><input required name="email" type="email" autoComplete="email" /></label></div><label><span>I am interested in</span><select name="interest" defaultValue="Job seeker"><option>Job seeker</option><option>Employer recruitment</option><option>Education services</option><option>General inquiry</option></select></label><label><span>Your message</span><textarea required name="message" rows={5} /></label><button className="primary-button" type="submit">Send inquiry</button></form>
      </div></section>
    </main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  </>;
}
