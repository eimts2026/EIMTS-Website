type SocialName = "facebook" | "instagram" | "linkedin";

function SocialIcon({ name }: { name: SocialName }) {
  if (name === "facebook") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8.5V6.8c0-.8.5-1 1-1h2.5V2.1L14.1 2C10.8 2 9 4 9 6.5v2H6v4h3V22h5v-9.5h3.3l.6-4H14Z" /></svg>;
  if (name === "instagram") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.4 2h9.2A5.4 5.4 0 0 1 22 7.4v9.2a5.4 5.4 0 0 1-5.4 5.4H7.4A5.4 5.4 0 0 1 2 16.6V7.4A5.4 5.4 0 0 1 7.4 2Zm-.2 2A3.2 3.2 0 0 0 4 7.2v9.6A3.2 3.2 0 0 0 7.2 20h9.6a3.2 3.2 0 0 0 3.2-3.2V7.2A3.2 3.2 0 0 0 16.8 4H7.2Zm10.3 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.3 7.3H1.7V22h3.6V7.3ZM3.5 2A2.1 2.1 0 1 0 3.5 6.2 2.1 2.1 0 0 0 3.5 2ZM22 13.6c0-4.4-2.4-6.5-5.6-6.5a4.8 4.8 0 0 0-4.3 2.4h-.1V7.3H8.6V22h3.6v-7.3c0-1.9.4-3.8 2.8-3.8 2.4 0 2.4 2.2 2.4 3.9V22H22v-8.4Z" /></svg>;
}

const socials: Array<{ name: SocialName; label: string; href: string }> = [
  { name: "facebook", label: "Facebook", href: "https://www.facebook.com/EmeraldIsleRecruitment" },
  { name: "instagram", label: "Instagram", href: "https://www.instagram.com/emeraldforeignjobs_/" },
  { name: "linkedin", label: "LinkedIn", href: "https://lk.linkedin.com/company/emeraldislerecruitment" },
];

export function SiteFooter() {
  return <footer className="global-footer">
    <div className="wide-container global-footer-lead">
      <p>Global careers begin with a trusted conversation.</p>
      <a href="/contact/">
        Start yours
        <span className="global-footer-lead__icon-wrapper">
          <svg viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="global-footer-lead__icon-svg" width={10} height={10}>
            <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" />
          </svg>
          <svg viewBox="0 0 14 15" fill="none" width={10} height={10} xmlns="http://www.w3.org/2000/svg" className="global-footer-lead__icon-svg global-footer-lead__icon-svg--copy">
            <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" />
          </svg>
        </span>
      </a>
    </div>
    <div className="wide-container global-footer-grid">
      <div className="global-footer-brand"><img src="/assets/emerald-isle-logo.webp" width="214" height="55" alt="Emerald Isle Manpower" loading="lazy" /><p>Responsible international recruitment and travel guidance since 1995.</p><a href="tel:+94114335444">+94 11 433 5444</a></div>
      <div><h2>Job seekers</h2><a href="https://registration.emeraldislemanpower.com/">Register</a><a href="/foreign-job-vacancies/">Find jobs</a><a href="https://registration.emeraldislemanpower.com/login.php">Candidate login</a></div>
      <div><h2>Employers</h2><a href="/client-recruitment-solutions/">Recruitment solutions</a><a href="/contact/">Talk to our team</a><a href="/education-page/">Education services</a></div>
      <div><h2>Emerald Isle</h2><a href="/about-us-emerald-isle-manpower/">About us</a><a className="footer-contact-link" href="/contact/">Contact us</a><a href="/insightful-and-engaging-blog-posts-discover-our-latest-articles/">Blogs</a><a href="/emerald-isle-manpower-faq/">FAQ</a></div>
    </div>
    <div className="wide-container global-footer-bottom">
      <span>© {new Date().getFullYear()} Emerald Isle. All rights reserved.</span>
      <div className="footer-socials" aria-label="Follow Emerald Isle">
        {socials.map((social) => <a href={social.href} aria-label={social.label} title={social.label} target="_blank" rel="noreferrer" key={social.name}><SocialIcon name={social.name} /></a>)}
      </div>
    </div>
  </footer>;
}