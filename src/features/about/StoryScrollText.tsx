"use client";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

function Letter({ character, progress, start, end }: { character: string; progress: ReturnType<typeof useScroll>["scrollYProgress"]; start: number; end: number }) {
  const opacity = useTransform(progress, [start, end], [0.18, 1]);
  return <motion.span style={{ opacity }}>{character}</motion.span>;
}

export function StoryScrollText({ paragraphs }: { paragraphs: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 100%", "end 50%"] });
  const total = paragraphs.reduce((count, paragraph) => count + Array.from(paragraph).length, 0);
  let position = 0;
  return <div ref={ref}>
    {paragraphs.map((paragraph, paragraphIndex) => reducedMotion ? <p key={paragraphIndex}>{paragraph}</p> : <p key={paragraphIndex} aria-label={paragraph}>
      <span aria-hidden="true">
        {paragraph.split(" ").map((word, wordIndex, words) => <span key={wordIndex} style={{ display: "inline-block", whiteSpace: "nowrap", marginRight: wordIndex < words.length - 1 ? "0.25em" : 0 }}>
          {Array.from(word).map((character, letterIndex) => {
            const start = position++ / total;
            return <Letter key={letterIndex} character={character} progress={scrollYProgress} start={start} end={Math.min(1, start + 1 / total)} />;
          })}
          {wordIndex < words.length - 1 && (position += 1, null)}
        </span>)}
      </span>
    </p>)}
  </div>;
}
