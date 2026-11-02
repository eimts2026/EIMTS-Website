"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const html = document.documentElement;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // The media-query rules in globals.css force [data-reveal] visible;
      // arming just retires the pre-hydration hide rule.
      html.classList.add("ei-reveal-armed");
      return;
    }
    // Normally set pre-paint by the inline script in layout.tsx; idempotent.
    html.classList.add("ei-motion-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.style.setProperty(
              "--reveal-delay",
              el.dataset.revealDelay ?? "0ms",
            );
            el.classList.add("is-visible");
          } else {
            // Reset only once fully off-screen so nothing blinks out at the
            // viewport edge; the element re-animates from either direction.
            const box = entry.boundingClientRect;
            if (box.bottom <= 0 || box.top >= window.innerHeight) {
              el.style.setProperty("--reveal-delay", "0ms");
              el.classList.remove("is-visible");
            }
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -12% 0px" },
    );

    const observed = new Set<Element>();

    const scan = (root: ParentNode) => {
      const elements = [...root.querySelectorAll<HTMLElement>("[data-reveal]")];
      if (root instanceof HTMLElement && root.matches("[data-reveal]")) elements.unshift(root);
      for (const el of elements) {
        if (!observed.has(el)) {
          observed.add(el);
          observer.observe(el);
        }
      }
      // Hand the pre-hydration hide rule over to per-element hiding.
      html.classList.add("ei-reveal-armed");
    };

    // This component lives in the root layout and can mount while route
    // content is still hydrating. Wait until React has finished the initial
    // pass before adding attributes to server-rendered DOM nodes.
    const initialScan = window.setTimeout(() => scan(document), 700);

    // Scan only newly inserted subtrees, not every paragraph on the page.
    // A bounded batch also handles removals so the observer cannot retain
    // detached result cards until the next route navigation.
    return () => {
      window.clearTimeout(initialScan);
      observer.disconnect();
      observed.clear();
      // ei-motion-ready stays: the hidden-state CSS depends on it, and this
      // effect re-runs on navigation — removing it would flash every
      // hardcoded [data-reveal] element visible.
    };
    // Re-scan the authored reveal targets after each route navigation.
  }, [pathname]);

  return null;
}
