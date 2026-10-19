"use client";

const certificates = [
  ["batticoloa-license", "Batticaloa agency licence", 1600, 1135],
  ["certified-training-partner", "Certified training partner", 794, 1122],
  ["best-employer-brand-2016", "Best Employer Brand · 2016", 1015, 1558],
  ["best-employer-brand-2018", "Best Employer Brand · 2018", 1783, 2560],
  ["best-employer-brand-2019", "Best Employer Brand · 2019", 703, 1071],
  ["best-employer-brand-2020", "Best Employer Brand · 2020", 1829, 2560],
  ["best-employer-brand-2024", "Best Employer Brand · 2024", 1080, 1080],
  ["excellence-awards-2012", "Excellence Awards · 2012", 768, 1058],
  ["women-leadership-award-2017", "Women Leadership Award · 2017", 1804, 2560],
] as const;

export default function CertificateSlider() {
  return <div className="company-certificates">
      <div className="certificate-heading"><div><p className="section-kicker">Our credentials</p><h2 id="certificate-title">Company License &amp; registration</h2><p>Explore our licence, training credentials and award certificates. Select a document to view it at full size.</p></div></div>
      <div className="certificate-loop" role="region" aria-label="Company certificates; hover or focus to pause" tabIndex={0}>
        <div className="certificate-track">
          {[0, 1].map(copy => <div className="certificate-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
            {certificates.map(([file, title, width, height]) => <a className="certificate-slide" key={file} href={`/assets/certificates/${file}.webp`} target="_blank" rel="noreferrer" tabIndex={copy === 1 ? -1 : undefined} aria-label={`${title} — open full-size document in a new tab`}><div className="certificate-image"><img src={`/assets/certificates/previews/${file}.webp`} alt={copy === 1 ? "" : title} width={width} height={height} decoding="async" /></div><span>{title}<span aria-hidden="true">↗</span></span></a>)}
          </div>)}
        </div>
      </div>
  </div>;
}
