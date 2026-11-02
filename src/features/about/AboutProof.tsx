"use client";

import { useEffect, useState } from "react";

const figures = [500, 65000, 20];
const labels = ["Global employers", "Job seekers placed", "Destinations worldwide"];

export default function AboutProof() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const finish = () => { cancelAnimationFrame(frame); setProgress(1); };
    if (motion.matches) {
      finish();
    } else {
      setProgress(0);
      let startTime = 0;
      const tick = (time: number) => {
        if (!startTime) startTime = time;
        const elapsed = Math.min((time - startTime) / 4000, 1);
        setProgress(1 - Math.pow(1 - elapsed, 2));
        if (elapsed < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }
    const onMotionChange = () => { if (motion.matches) finish(); };
    motion.addEventListener("change", onMotionChange);
    return () => { motion.removeEventListener("change", onMotionChange); cancelAnimationFrame(frame); };
  }, []);

  return <ul className="about-editorial-proof" aria-label="Emerald Isle at a glance">
    {figures.map((figure, index) => <li key={figure}>
      <strong aria-label={`${figure.toLocaleString("en-US")} or more`}><span aria-hidden="true">{Math.round(figure * progress).toLocaleString("en-US")}<span className="about-proof-plus">+</span></span></strong>
      <span>{labels[index]}</span>
    </li>)}
    <li><strong className="about-proof-certification">ISO<br />9001:2015</strong><span>Quality management</span></li>
    <li><a className="about-proof-review" href="https://www.google.com/maps/place//@6.8425904,79.866525,17z/data=!3m1!4b1!4m3!3m2!1s0x3ae25b19204c0875:0xf99af88e1968c1a0!12e1?entry=ttu&g_ep=EgoyMDI2MDcxMy4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noreferrer" aria-label="Review Emerald Isle on Google (opens in a new tab)"><strong className="about-proof-stars is-animated" aria-hidden="true">{[0, 1, 2, 3, 4].map(index => <span key={index} style={{ animationDelay: `${450 + index * 220}ms` }}>⭐</span>)}</strong><span>5-star recognised</span></a></li>
  </ul>;
}
