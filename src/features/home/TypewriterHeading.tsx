"use client";

import { useEffect, useState } from "react";

export default function TypewriterHeading({ text }: { text: string }) {
  const characters = Array.from(text);
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    setVisible(0);
    const length = Array.from(text).length;
    // Finish even long headlines before the next carousel slide.
    const delay = Math.min(45, 3000 / Math.max(length, 1));
    let count = 0;
    const timer = window.setInterval(() => {
      count += 1;
      setVisible(count);
      if (count >= length) window.clearInterval(timer);
    }, delay);
    return () => window.clearInterval(timer);
  }, [text]);

  let index = 0;
  return <h1 id="home-title" className="hero-typewriter" aria-label={text}>
    <span aria-hidden="true">
      {text.split(/(\s+)/).map((word, wordIndex) => <span className="hero-typewriter-word" key={wordIndex}>
        {Array.from(word).map(character => {
          const position = index++;
          return <span key={position} style={{ visibility: position < visible ? "visible" : "hidden" }} className={position === visible - 1 && visible < characters.length ? "hero-typewriter-cursor" : undefined}>{character}</span>;
        })}
      </span>)}
    </span>
  </h1>;
}
