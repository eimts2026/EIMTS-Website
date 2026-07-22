type SocialName = "facebook" | "instagram" | "linkedin";

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
      <div><h2>Employers</h2><a href="/client-recruitment-solutions/">Recruitment solutions</a><a href="/projects/">Projects</a><a href="/contact/">Talk to our team</a></div>
      <div><h2>Emerald Isle</h2><a href="/about-us-emerald-isle-manpower/">About us</a><a className="footer-contact-link" href="/contact/">Contact us</a><a href="/insightful-and-engaging-blog-posts-discover-our-latest-articles/">Blogs</a><a href="/emerald-isle-manpower-faq/">FAQ</a></div>
      <div className="footer-review-column"><h2>Review Emerald Isle</h2><p>Your feedback helps us keep every journey accountable.</p><a className="footer-review" href="https://www.google.com/maps/place//@6.8425904,79.866525,17z/data=!3m1!4b1!4m3!3m2!1s0x3ae25b19204c0875:0xf99af88e1968c1a0!12e1?entry=ttu&g_ep=EgoyMDI2MDcxMy4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noreferrer" aria-label="Leave Emerald Isle a Google review"><span className="footer-review__google" aria-hidden="true"><svg viewBox="0 0 24 24"><path fill="#4285F4" d="M21.35 12.23c0-.71-.06-1.39-.17-2.05H12v3.88h5.25a4.49 4.49 0 0 1-1.95 2.95v2.51h3.23a9.77 9.77 0 0 0 2.82-7.29Z" /><path fill="#34A853" d="M12 21.77c2.64 0 4.86-.87 6.48-2.36l-3.23-2.51c-.9.6-2.05.96-3.25.96-2.5 0-4.63-1.69-5.39-3.96H3.28v2.59A9.78 9.78 0 0 0 12 21.77Z" /><path fill="#FBBC05" d="M6.61 13.9a5.88 5.88 0 0 1 0-3.8V7.51H3.28a9.77 9.77 0 0 0 0 8.98l3.33-2.59Z" /><path fill="#EA4335" d="M12 6.14c1.44 0 2.73.5 3.75 1.48l2.81-2.81C16.85 3.22 14.63 2.23 12 2.23a9.78 9.78 0 0 0-8.72 5.28l3.33 2.59C7.37 7.83 9.5 6.14 12 6.14Z" /></svg></span><span><small>Share your experience</small><strong>Review us on Google <b aria-hidden="true">↗</b></strong></span></a></div>
    </div>
    <div className="wide-container global-footer-bottom">
      <span>{new Date().getFullYear()} Emerald Isle. All rights reserved.</span>
    </div>
  </footer>;
}