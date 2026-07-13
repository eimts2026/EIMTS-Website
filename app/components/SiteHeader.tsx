/* eslint-disable @next/next/no-img-element */

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

function Caret() {
  return <span className="nav-caret" aria-hidden="true" />;
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
          <div className="nav-group">
            <a href={routes.jobs}>Find Jobs</a><button type="button" aria-label="Show Find Jobs menu"><Caret /></button>
            <div className="nav-submenu"><a href={routes.jobs}>Foreign job vacancies</a><a href="https://registration.emeraldislemanpower.com/">Job seeker registration</a><a href="https://registration.emeraldislemanpower.com/login.php">Candidate login</a></div>
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
            <a href={routes.home}>Home</a><a href={routes.about}>About Us</a><a href={routes.contact}>Contact Us</a><a href={routes.jobs}>Find Jobs</a><a href={routes.employer}>Employer</a><a href={routes.education}>Education</a><a href={routes.blog}>Blog</a><a href={routes.faq}>FAQ</a><a href="https://registration.emeraldislemanpower.com/">Register</a>
          </nav>
        </details>
      </div>
    </header>
  );
}
