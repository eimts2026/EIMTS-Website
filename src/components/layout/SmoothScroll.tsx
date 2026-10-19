"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: true,
      respectReducedMotion: true,
      anchors: { offset: -110 },
      stopInertiaOnNavigate: true,
      prevent: (node) => Boolean(node.closest("[data-lenis-prevent], .leaflet-container, #mobile-navigation, dialog, textarea")),
    });
    // Dialogs lock body scrolling; keep Lenis in step with that existing behaviour.
    const syncLock = () => {
      if (document.body.style.overflow === "hidden") lenis.stop();
      else lenis.start();
    };
    const observer = new MutationObserver(syncLock);
    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    syncLock();
    const toTop = () => lenis.scrollTo(0);
    window.addEventListener("ei-scroll-top", toTop);
    return () => {
      observer.disconnect();
      window.removeEventListener("ei-scroll-top", toTop);
      lenis.destroy();
    };
  }, []);
  return null;
}
