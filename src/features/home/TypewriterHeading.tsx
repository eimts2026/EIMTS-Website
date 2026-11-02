"use client";

import { useEffect, useState } from "react";

export default function TypewriterHeading({ text, id = "home-title", accent, skeleton = false }: { text: string; id?: string; accent?: string; skeleton?: boolean }) {
  const characters = Array.from(text);
  const [visible, setVisible] = useState(1);
  const [ready, setReady] = useState(!skeleton);

  useEffect(() => {
    setReady(true);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(Array.from(text).length);
      return;
    }
    setVisible(1);
    const length = Array.from(text).length;
    // Finish even long headlines before the next carousel slide.
    const delay = Math.min(45, 3000 / Math.max(length, 1));
    let count = 1;
    const timer = window.setInterval(() => {
      count += 1;
      setVisible(count);
      if (count >= length) window.clearInterval(timer);
    }, delay);
    return () => window.clearInterval(timer);
  }, [text]);

  let index = 0;
  const accentStart = accent ? text.indexOf(accent) : -1;
  return <h1 id={id} className="hero-typewriter" aria-label={text}>
    {!ready && <span className="about-heading-skeleton" aria-hidden="true"><span /><span /><span /></span>}
    <span style={!ready ? { opacity: 0 } : undefined}>
    <span aria-hidden="true">
      {text.split(/(\s+)/).map((word, wordIndex) => <span className="hero-typewriter-word" key={wordIndex}>
        {Array.from(word).map(character => {
          const position = index++;
          return <span key={position} style={{ visibility: position < visible ? "visible" : "hidden" }} className={[position === visible - 1 && visible < characters.length ? "hero-typewriter-cursor" : "", accentStart >= 0 && position >= accentStart ? "heading-accent" : ""].filter(Boolean).join(" ") || undefined}>{character}</span>;
        })}
      </span>)}
    </span>
    </span>
  </h1>;
}
