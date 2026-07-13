export function SiteFooter() {
  return (
    <footer className="global-footer">
      <div className="container global-footer-grid">
        <div className="global-footer-brand"><img src="/assets/emerald-isle-logo.webp" width="214" height="55" alt="Emerald Isle Manpower" loading="lazy" /><p>Turning dream jobs into reality through trusted international recruitment.</p></div>
        <div><h2>For job seekers</h2><a href="https://registration.emeraldislemanpower.com/">Register</a><a href="/foreign-job-vacancies/">Find jobs</a><a href="https://registration.emeraldislemanpower.com/login.php">Login</a></div>
        <div><h2>For employers</h2><a href="/client-recruitment-solutions/">Recruitment solutions</a><a href="/contact/">Contact our team</a><a href="/education-page/">Education services</a></div>
        <div><h2>Company</h2><a href="/about-us-emerald-isle-manpower/">About us</a><a href="/insightful-and-engaging-blog-posts-discover-our-latest-articles/">Blog</a><a href="/emerald-isle-manpower-faq/">FAQ</a></div>
      </div>
      <div className="container global-footer-bottom"><span>© {new Date().getFullYear()} Emerald Isle. All rights reserved.</span><div><a href="https://www.facebook.com/EmeraldIsleRecruitment">Facebook</a><a href="https://www.instagram.com/emeraldforeignjobs_/">Instagram</a><a href="https://lk.linkedin.com/company/emeraldislerecruitment">LinkedIn</a></div></div>
    </footer>
  );
}
