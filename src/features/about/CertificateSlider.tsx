"use client";

import { useRef } from "react";
import HorizontalDragRail from "../../components/ui/HorizontalDragRail";
import BootstrapIcon from "../../components/ui/BootstrapIcon";
import ImageViewer from "./ImageViewer";

const certificates: Array<{ file: string; title: string; width: number; height: number; source?: string }> = [
  { file: "batticoloa-license", title: "Batticaloa agency licence", width: 1600, height: 1135 },
  { file: "colombo-head-office-license", title: "Colombo head office SLBFE licence · 1162", width: 598, height: 430 },
  { file: "certified-training-partner", title: "Certified training partner", width: 794, height: 1122 },
  { file: "best-employer-brand-2016", title: "Best Employer Brand · 2016", width: 1015, height: 1558 },
  { file: "best-employer-brand-2018", title: "Best Employer Brand · 2018", width: 1783, height: 2560 },
  { file: "best-employer-brand-2019", title: "Best Employer Brand · 2019", width: 703, height: 1071 },
  { file: "best-employer-brand-2020", title: "Best Employer Brand · 2020", width: 1829, height: 2560 },
  { file: "best-employer-brand-2024", title: "Best Employer Brand · 2024", width: 1080, height: 1080 },
  { file: "excellence-awards-2012", title: "Excellence Awards · 2012", width: 768, height: 1058 },
  { file: "women-leadership-award-2017", title: "Women Leadership Award · 2017", width: 1804, height: 2560 },
];

export default function CertificateSlider() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const move = (direction: -1 | 1) => {
    const rail = carouselRef.current?.querySelector<HTMLElement>(".horizontal-drag-rail");
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>(".certificate-slide");
    const track = rail.querySelector<HTMLElement>(".horizontal-drag-rail__track");
    const gap = Number.parseFloat(track ? getComputedStyle(track).columnGap : "24") || 24;
    const step = (card?.getBoundingClientRect().width ?? rail.clientWidth * 0.8) + gap;
    rail.scrollLeft += direction * step;
  };

  return <div className="company-certificates">
    <div className="certificate-heading">
      <div><p className="section-kicker">Our credentials</p><h2 id="certificate-title">Company License &amp; registration</h2><p>Browse our licences, training credentials and awards. Select any document to view it full size.</p></div>
      <div className="certificate-controls" aria-label="Certificate navigation">
        <button type="button" aria-label="Previous certificates" onClick={() => move(-1)}><span className="certificate-arrow-back"><BootstrapIcon name="arrow-right" /></span></button>
        <button type="button" aria-label="Next certificates" onClick={() => move(1)}><BootstrapIcon name="arrow-right" /></button>
      </div>
    </div>
    <div className="certificate-carousel" ref={carouselRef}>
      <HorizontalDragRail className="certificate-loop" label="Company licences and registrations. Drag, swipe, scroll, or use the navigation buttons to browse." autoScroll loop>
        {certificates.map(({ file, title, width, height, ...source }) => {
          const fullImage = source.source ?? `/assets/certificates/${file}.webp`;
          const thumbnail = source.source ?? `/assets/certificates/previews/${file}.webp`;
          return <article className="certificate-slide" key={file}>
            <ImageViewer className="certificate-open" src={fullImage} alt={title} title={title}>
              <div className="certificate-image"><img src={thumbnail} alt="" width={width} height={height} decoding="async" /></div>
              <span className="certificate-open-hint" aria-hidden="true">View document <BootstrapIcon name="arrow-up-right" /></span>
            </ImageViewer>
            <span className="certificate-caption">{title}</span>
          </article>;
        })}
      </HorizontalDragRail>
    </div>
  </div>;
}
