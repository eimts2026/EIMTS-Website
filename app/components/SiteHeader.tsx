const routes = {
  home: "/",
  about: "/about-us-emerald-isle-manpower/",
  contact: "/contact/",
  jobs: "/foreign-job-vacancies/",
  employer: "/client-recruitment-solutions/",
  education: "/education-page/",
  blog: "/insightful-and-engaging-blog-posts-discover-our-latest-articles/",
  faq: "/emerald-isle-manpower-faq/",
};

const jobGroups = [
  {
    title: "Engineering",
    links: ["Automotive / Vehicle Maintenance / Service & Repair", "Marine / Aviation / Watersports", "Construction / Skilled Trades", "General Labour / Cleaners", "Agricultural / Gardening", "Engineering / Technical", "Transport / Driving", "Security / Safety"],
  },
  {
    title: "Retail/Admin/Accounts",
    links: ["Accounting / Auditing / Finance", "Logistic / Warehouse / Transport", "Sales / Marketing / Merchandise", "Secretary / Admin", "HR / Training", "Retail"],
  },
  {
    title: "Hospitality/Hospitals",
    links: ["Hotel / Restaurant / Food", "Spa / Beauty / Salon", "Healthcare"],
  },
];

function Caret() {
  return <span className="nav-caret" aria-hidden="true" />;
}

function JobMegaMenu() {
  return <div className="jobs-mega-menu" aria-label="Job categories">
    <div className="wide-container jobs-mega-grid">
      {jobGroups.map((group) => <section className="mega-column" key={group.title}><h2>{group.title}</h2>{group.links.map((label) => <a href={`${routes.jobs}?filter-category=${encodeURIComponent(label)}`} key={label}>{label}</a>)}</section>)}
      <section className="mega-column"><h2>Candidate</h2><a className="mega-highlight" href={routes.blog}>Career Advice</a><a href={routes.jobs}>All Foreign Job Vacancies</a><a href="https://registration.emeraldislemanpower.com/">Register as a Job Seeker</a></section>
    </div>
  </div>;
}

export function SiteHeader() {
  return (
    <header className="global-header">
      <div className="wide-container nav-shell">
        <a className="global-brand" href={routes.home} aria-label="Emerald Isle Manpower home">
          <img src="/assets/emerald-isle-logo.webp" width="214" height="55" alt="Emerald Isle Manpower" />
        </a>

        <nav className="top-nav" aria-label="Primary navigation">
          <a href={routes.home}>Home</a>
          <a href={routes.about}>About Us</a>
          <div className="nav-group">
            <a href={routes.contact}>Contact Us</a><button type="button" aria-label="Show Contact Us menu"><Caret /></button>
            <div className="nav-submenu"><a href={routes.contact}>Contact our offices</a><a href={routes.faq}>Frequently asked questions</a></div>
          </div>
          <div className="nav-group jobs-nav-group">
            <a href={routes.jobs}>Find Jobs</a><button type="button" aria-label="Show job categories"><Caret /></button>
            <JobMegaMenu />
          </div>
          <a href={routes.employer}>Employer</a>
          <a href={routes.education}>Education</a>
          <a href={routes.blog}>Blog</a>
          <div className="language-item" aria-label="Website language: English UK"><img src="/assets/en-gb.svg" width="20" height="15" alt="" /><span>EN_GB</span><Caret /></div>
        </nav>

        <a className="register-pill" href="https://registration.emeraldislemanpower.com/">Register</a>

        <details className="global-mobile-menu">
          <summary aria-label="Open navigation"><span>Menu</span><span className="menu-lines" aria-hidden="true" /></summary>
          <nav aria-label="Mobile navigation">
            <a href={routes.home}>Home</a><a href={routes.about}>About Us</a><a href={routes.contact}>Contact Us</a>
            <details className="mobile-job-menu"><summary>Find Jobs <Caret /></summary><a href={routes.jobs}>All Foreign Job Vacancies</a>{jobGroups.flatMap((group) => group.links).map((label) => <a href={`${routes.jobs}?filter-category=${encodeURIComponent(label)}`} key={label}>{label}</a>)}</details>
            <a href={routes.employer}>Employer</a><a href={routes.education}>Education</a><a href={routes.blog}>Blog</a><a href={routes.faq}>FAQ</a><a href="https://registration.emeraldislemanpower.com/">Register</a>
          </nav>
        </details>
      </div>
    </header>
  );
}
