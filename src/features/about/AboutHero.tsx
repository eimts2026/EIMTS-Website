"use client";

import { useEffect, useState } from "react";
import "./AboutHero.css";
import ImageViewer from "./ImageViewer";

const slides = [
  { image: "award-hero-1.webp", title: "Recognition shared by our people.", copy: "A moment of recognition for the team behind Emerald Isle’s recruitment journeys.", alt: "A group receiving a trophy and certificate at an awards ceremony" },
  { image: "award-hero-2.webp", title: "Milestones built on commitment.", copy: "Our awards reflect a continuing commitment to professional recruitment and lasting relationships.", alt: "An award presentation with a gold star trophy" },
  { image: "award-hero-3.webp", title: "A standard we carry forward.", copy: "Each recognition strengthens our focus on the people and employers who place their trust in us.", alt: "Two award recipients holding a globe and stars trophy" },
];

export default function AboutHero() {
  const [active, setActive] = useState(0);
  const [viewing, setViewing] = useState(false);
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!document.hidden && !viewing) setActive((index) => (index + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [viewing]);
  return <section className="about-showcase ei-hero" aria-labelledby="about-hero-title" aria-roledescription="carousel">
    <ImageViewer className="about-showcase-media" src={`/assets/about-awards/${slides[active].image}`} alt={slides[active].alt} title={slides[active].title} onOpenChange={setViewing}>
      {slides.map((slide, index) => <img key={slide.image} src={`/assets/about-awards/${slide.image}`} alt={index === active ? slide.alt : ""} aria-hidden={index !== active} className={index === active ? "is-active" : ""} width="2560" height={index === 1 ? 1834 : index === 2 ? 1718 : 1706} fetchPriority={index === 0 ? "high" : "auto"} />)}
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
      <div className="about-showcase-indicators" aria-hidden="true">{slides.map((slide, index) => <span key={slide.image} className={active === index ? "is-active" : ""} />)}</div>
      <span className="about-showcase-count" aria-label="Current slide">0{active + 1} / {String(slides.length).padStart(2, "0")}</span>
    </div>
  </section>;
}
