"use client";
import { useEffect } from "react";
import { animate } from "animejs";
export function EmployerMotion() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animation = animate(".employer-page .employer-hero-copy, .employer-page .employer-certificate", { opacity: [0, 1], translateY: [18, 0], duration: 700, delay: 120, ease: "out(3)" });
    return () => { animation.revert(); };
  }, []);
  return null;
}

