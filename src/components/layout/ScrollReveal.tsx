"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Headings and paragraphs inside page content and the footer. Skipped:
// screen-reader-only text, dialog content, the header mega menu, and
// descendants of hardcoded [data-reveal] containers (those sections animate
// as one block; tagging their children too would compound the motion).
const TARGETS =
  "main :is(h1,h2,h3,h4,h5,h6,p,img), main :is(.hf-purpose-grid article,.contact-office-group,.ei-leader-card,.project-showcase-card), .global-footer :is(h1,h2,h3,h4,h5,h6,p)";
const EXCLUDE = ".sr-only, dialog *, .jobs-mega-menu *, [data-reveal] *, .recruit-hero *, .about-showcase-media *, .hf-quote-track *, .certificate-track *, .ei-rolling-gallery *, .leaflet-container *, .market-flags *, [aria-hidden=true] *";

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
      const select = (selector: string) => [
        ...(root instanceof HTMLElement && root.matches(selector) ? [root] : []),
        ...root.querySelectorAll<HTMLElement>(selector),
      ];
      // Hardcoded [data-reveal] blocks (home page sections) join the same
      // observer, upgrading them from reveal-once to toggle-both-ways.
      for (const el of select("[data-reveal]")) {
        if (!observed.has(el)) {
          observed.add(el);
          observer.observe(el);
        }
      }
      const fresh = Array.from(
        select(TARGETS),
      ).filter((el) => {
        if (el.hasAttribute("data-reveal") || el.matches(EXCLUDE)) return false;
        const storyBlock = el.closest(".hf-purpose-grid article,.contact-office-group,.ei-leader-card,.project-showcase-card");
        return !storyBlock || storyBlock === el;
      });
      // Siblings tagged in the same pass reveal with a short cascade.
      const perParent = new Map<Element, number>();
      for (const el of fresh) {
        const parent = el.parentElement ?? document.body;
        const index = perParent.get(parent) ?? 0;
        perParent.set(parent, index + 1);
        el.dataset.revealDelay = `${Math.min(index * 80, 320)}ms`;
        el.setAttribute("data-reveal", el.tagName === "P" ? "p" : el.tagName === "IMG" ? "image" : el.matches("article,.contact-office-group") ? "block" : "h");
        observed.add(el);
        observer.observe(el);
      }
      // Hand the pre-hydration hide rule over to per-element hiding.
      html.classList.add("ei-reveal-armed");
    };

    scan(document);

    // Scan only newly inserted subtrees, not every paragraph on the page.
    // A bounded batch also handles removals so the observer cannot retain
    // detached result cards until the next route navigation.
    let debounce: ReturnType<typeof setTimeout> | undefined;
    const pending = new Set<HTMLElement>();
    const mutations = new MutationObserver((records) => {
      let hasRemovals = false;
      for (const record of records) {
        hasRemovals ||= record.removedNodes.length > 0;
        for (const node of record.addedNodes) {
          if (node instanceof HTMLElement && !node.matches(EXCLUDE)) pending.add(node);
        }
      }
      if (!pending.size && !hasRemovals) return;
      if (debounce !== undefined) return;
      debounce = setTimeout(() => {
        debounce = undefined;
        for (const el of observed) {
          if (!el.isConnected) { observer.unobserve(el); observed.delete(el); }
        }
        for (const root of pending) {
          if (!root.isConnected) continue;
          // A queued ancestor already covers this subtree.
          let parent = root.parentElement;
          while (parent && !pending.has(parent)) parent = parent.parentElement;
          if (!parent) scan(root);
        }
        pending.clear();
      }, 100);
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(debounce);
      mutations.disconnect();
      observer.disconnect();
      observed.clear();
      pending.clear();
      // ei-motion-ready stays: the hidden-state CSS depends on it, and this
      // effect re-runs on navigation — removing it would flash every
      // hardcoded [data-reveal] element visible.
    };
    // Re-scan per navigation so a freshly swapped <main> is tagged even if the
    // MutationObserver ever misses it.
  }, [pathname]);

  return null;
}
