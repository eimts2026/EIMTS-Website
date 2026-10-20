"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";

const endings = [
  "starts with a single decision.",
  "is where your real potential unfolds.",
  "deserves a story worth telling.",
];

export default function HeroTagline() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    if (reducedMotion !== false || !visible || !inView) return;
    const timer = window.setInterval(() => setIndex(value => (value + 1) % endings.length), 5000);
    return () => window.clearInterval(timer);
  }, [reducedMotion, visible, inView]);

  return <div ref={ref} className="hero-tagline">
    <h1 id="home-title" aria-label={`Your next chapter ${endings[0]}`}>
      Your next chapter{" "}
      <span className="hero-tagline-endings" aria-hidden="true">
        {/* Reserve the longest phrase's height at every screen width. */}
        {endings.map(ending => <span className="hero-tagline-spacer" key={ending}>{ending}</span>)}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={index}
            className="hero-tagline-active"
            initial={{ y: "100%", opacity: 0, filter: "blur(4px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: "-100%", opacity: 0, filter: "blur(4px)" }}
            transition={reducedMotion ? { duration: 0 } : {
              y: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              filter: { duration: 0.2 },
            }}
          >
            <motion.span
              className="hero-tagline-gradient"
              initial={{ backgroundPosition: "100% 0%" }}
              animate={{ backgroundPosition: "0% 0%" }}
              transition={{ duration: reducedMotion ? 0 : 0.8, ease: "easeInOut", delay: reducedMotion ? 0 : 0.1 }}
            >{endings[index]}</motion.span>
          </motion.span>
        </AnimatePresence>
      </span>
    </h1>
  </div>;
}
