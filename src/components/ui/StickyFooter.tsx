"use client";

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import "./StickyFooter.css";

export default function StickyFooter({ children }: { children: ReactNode }) {
  const shellRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const measure = () => {
      const naturalHeight = Math.ceil(content.getBoundingClientRect().height);
      setHeight(!motion.matches && naturalHeight <= window.innerHeight - 100 ? naturalHeight : 0);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    window.addEventListener("resize", measure);
    motion.addEventListener("change", measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      motion.removeEventListener("change", measure);
    };
  }, []);
  return <div ref={shellRef} className={`ei-footer-reveal${height ? " is-sticky" : ""}`} style={{ "--footer-height": `${height}px` } as CSSProperties} onFocusCapture={() => {
    // Bring the clipped footer fully into view when reached by keyboard.
    if (height && shellRef.current && shellRef.current.getBoundingClientRect().bottom > window.innerHeight) {
      shellRef.current.scrollIntoView({ block: "end", behavior: "instant" });
    }
  }}>
    <div ref={contentRef} className="ei-footer-reveal-content">{children}</div>
  </div>;
}
