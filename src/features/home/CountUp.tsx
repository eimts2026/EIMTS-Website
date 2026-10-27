"use client";

import { useEffect, useRef, useState } from "react";
import { complianceYears, untilSriLankaMidnight } from "./complianceYears";

export default function CountUp({ initialYears }: { initialYears: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [years, setYears] = useState(initialYears);

  useEffect(() => {
    let timer: number;
    const sync = () => {
      window.clearTimeout(timer);
      setYears(complianceYears());
      timer = window.setTimeout(sync, untilSriLankaMidnight() + 100);
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => { window.clearTimeout(timer); document.removeEventListener("visibilitychange", sync); };
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = false;
    const render = (value: number) => {
      node.textContent = String(value);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      if (motion.matches) { render(years); return; }
      render(0);
      let started = 0;
      const tick = (time: number) => {
        if (!started) started = time;
        const progress = Math.min((time - started) / 4200, 1);
        render(Math.round(years * progress * progress));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !visible) { visible = true; start(); }
      else if (!entry.isIntersecting && visible) { visible = false; cancelAnimationFrame(frame); render(years); }
    }, { threshold: 0.3 });
    const motionChanged = () => { if (visible) start(); else render(years); };
    observer.observe(node);
    motion.addEventListener("change", motionChanged);
    return () => { observer.disconnect(); motion.removeEventListener("change", motionChanged); cancelAnimationFrame(frame); };
  }, [years]);

  return <strong aria-label={`${years} or more`}><span ref={ref} aria-hidden="true">{years}</span><span aria-hidden="true">+</span></strong>;
}
