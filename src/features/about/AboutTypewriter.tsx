"use client";

import { useEffect, useState } from "react";

const heading = "Connecting Sri Lankan talent with global opportunity.";
const letters = Array.from(heading);

export default function AboutTypewriter() {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    let count = 0;
    const timer = window.setInterval(() => {
      count += 1;
      setVisible(count);
      if (count >= letters.length) window.clearInterval(timer);
    }, 28);
    return () => window.clearInterval(timer);
  }, []);

  return <h1 id="about-hero-title" aria-label={heading}><span aria-hidden="true">{letters.map((letter, index) => <span className={index < visible ? "about-typewriter-letter is-visible" : "about-typewriter-letter"} key={index}>{letter}</span>)}</span></h1>;
}
