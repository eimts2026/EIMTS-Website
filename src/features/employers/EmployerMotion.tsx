"use client";
import { useEffect } from "react";
import { animate } from "animejs";
import Lenis from "lenis";
export function EmployerMotion() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, anchors: true, duration: .85, smoothWheel: true });
    const animation = animate(".employer-page .employer-hero-copy, .employer-page .employer-certificate", { opacity: [0, 1], translateY: [18, 0], duration: 700, delay: 120, ease: "out(3)" });
    return () => { animation.revert(); lenis.destroy(); };
  }, []);
  return null;
}

