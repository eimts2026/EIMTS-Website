"use client";

import { useEffect, useState } from "react";
import "./AboutHero.css";
import ImageViewer from "./ImageViewer";

const slides = [
  { image: "award-hero-2.webp", title: "Receiving recognition from former President Mahinda Rajapaksa.", copy: "A milestone in Emerald Isle’s journey of connecting Sri Lankan talent with global opportunity.", alt: "Emerald Isle receiving a gold star trophy at an award presentation", height: 1834 },
  { image: "award-hero-3.webp", title: "A standard we carry forward.", copy: "Each recognition strengthens our focus on the people and employers who place their trust in us.", alt: "Two award recipients holding a globe and stars trophy", height: 1718 },
];

export default function AboutHero() {
  const [active, setActive] = useState(0);
  const [viewing, setViewing] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (paused || viewing || reducedMotion) return;
    const timer = window.setInterval(() => {
      if (!document.hidden && !viewing) setActive((index) => (index + 1) % slides.length);
    }, 9000);
    return () => window.clearInterval(timer);
  }, [viewing, paused, reducedMotion]);
  return <section className="about-showcase ei-hero" aria-labelledby="about-hero-title" aria-roledescription="carousel" onFocusCapture={() => setPaused(true)}>
    <ImageViewer className="about-showcase-media" src={`/assets/about-awards/${slides[active].image}`} alt={slides[active].alt} title={slides[active].title} onOpenChange={setViewing}>
      {slides.map((slide, index) => <img key={slide.image} src={`/assets/about-awards/${slide.image}`} alt={index === active ? slide.alt : ""} aria-hidden={index !== active} className={index === active ? "is-active" : ""} width="2560" height={slide.height} fetchPriority={index === 0 ? "high" : "auto"} />)}
    </ImageViewer>
    <div className="about-showcase-shade" aria-hidden="true" />
    <div className="container about-showcase-content">
      <p className="ei-kicker">About Emerald Isle · Since 1995</p>
      <div className="about-showcase-copy" key={active} aria-live="off">
        <h1 id="about-hero-title">{slides[active].title}</h1>
        <p>{slides[active].copy}</p>
      </div>
      <a className="about-showcase-story" href="#about-story">Discover our story <span aria-hidden="true">↓</span></a>
    </div>
    <div className="container about-showcase-foot">
      <span>Our people. Our milestones.</span>
    </div>
  </section>;
}
