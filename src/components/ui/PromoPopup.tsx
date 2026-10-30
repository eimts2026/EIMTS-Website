"use client";
import { safeNavigationUrl } from "@/lib/safe-url";

import { useEffect, useState } from "react";
import type { PublicPopup } from "@/lib/popups";

type Props = {
  popups: PublicPopup[];
};

export function PromoPopup({ popups }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const popup = popups[activeIndex];
  const hasImage = popups.length > 0;
  const linkUrl = safeNavigationUrl(popup?.link_url);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!hasImage) return;
    const timer = window.setTimeout(() => setOpen(true), 900);
    return () => window.clearTimeout(timer);
  }, [hasImage]);

  useEffect(() => {
    setActiveIndex((index) => Math.min(index, Math.max(0, popups.length - 1)));
  }, [popups.length]);

  function move(step: number) {
    setActiveIndex((index) => (index + step + popups.length) % popups.length);
  }

  function dismiss() {
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
      if (popups.length > 1 && event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
      }
      if (popups.length > 1 && event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, popups.length]);

  if (!open || !hasImage || !popup?.image_url) return null;

  const image = (
    <img
      className="promo-popup-image"
      src={popup.image_url!}
      alt={popup.title || "Promotional popup"}
    />
  );

  return (
    <div
      className="promo-popup-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${popup.title || "Promotional popup"}, ${activeIndex + 1} of ${popups.length}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) dismiss();
      }}
    >
      <div className="promo-popup-layout">
        {popups.length > 1 && <button type="button" className="promo-popup-arrow promo-popup-arrow--previous" aria-label="Previous popup" onClick={() => move(-1)}>‹</button>}
        <div className="promo-popup-card">
          <button
            type="button"
            className="promo-popup-close"
            aria-label="Close popup"
            onClick={dismiss}
          >
            ×
          </button>
          {linkUrl ? (
            <a
              className="promo-popup-link"
              href={linkUrl}
              aria-label={popup.title || "Open popup destination"}
              onClick={dismiss}
            >
              {image}
            </a>
          ) : (
            <div className="promo-popup-image-frame">{image}</div>
          )}
        </div>
        {popups.length > 1 && <button type="button" className="promo-popup-arrow promo-popup-arrow--next" aria-label="Next popup" onClick={() => move(1)}>›</button>}
      </div>
      <style>{`
        .promo-popup-overlay {
          position: fixed;
          inset: 0;
          z-index: 999;
          display: grid;
          place-items: center;
          overflow-y: auto;
          overscroll-behavior: contain;
          padding: max(1rem, env(safe-area-inset-top)) max(1rem, env(safe-area-inset-right)) max(1rem, env(safe-area-inset-bottom)) max(1rem, env(safe-area-inset-left));
          background: rgba(7, 16, 12, 0.68);
          backdrop-filter: blur(8px);
          animation: promo-fade 0.3s ease both;
        }
        .promo-popup-layout {
          display: grid;
          grid-template-columns: 48px minmax(0, 900px) 48px;
          grid-template-areas: "previous card next";
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          width: min(100%, 1024px);
          margin: auto;
        }
        .promo-popup-card {
          position: relative;
          display: grid;
          place-items: center;
          grid-area: card;
          width: 100%;
          max-height: calc(100vh - 5rem);
          max-height: calc(100svh - 5rem);
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.72);
          border-radius: 22px;
          background: #09150f;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.48), 0 0 0 1px rgba(255, 255, 255, 0.08);
          animation: promo-rise 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .promo-popup-link,
        .promo-popup-image-frame {
          display: grid;
          place-items: center;
          width: 100%;
          max-width: 100%;
          max-height: calc(100vh - 5rem);
          max-height: calc(100svh - 5rem);
          line-height: 0;
          cursor: pointer;
        }
        .promo-popup-image {
          display: block;
          width: auto;
          max-width: 100%;
          height: auto;
          max-height: calc(100vh - 5rem);
          max-height: calc(100svh - 5rem);
          object-fit: contain;
          transition: transform 0.35s ease, filter 0.35s ease;
        }
        .promo-popup-link:hover .promo-popup-image {
          transform: scale(1.015);
          filter: brightness(1.04);
        }
        .promo-popup-close {
          position: absolute;
          top: 0.7rem;
          right: 0.7rem;
          z-index: 1;
          display: grid;
          place-items: center;
          width: 36px;
          height: 36px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 999px;
          background: rgba(7, 16, 12, 0.62);
          color: #fff;
          font-size: 1.3rem;
          line-height: 1;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .promo-popup-arrow {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          padding: 0;
          border: 1px solid rgba(255,255,255,.3);
          border-radius: 50%;
          background: rgba(7, 16, 12, 0.7);
          color: #fff;
          font: 400 1.75rem/1 system-ui, sans-serif;
          cursor: pointer;
          touch-action: manipulation;
          transition: transform .2s ease, background .2s ease;
        }
        .promo-popup-arrow:hover {
          transform: scale(1.04);
          background: rgba(7, 16, 12, 0.92);
        }
        .promo-popup-arrow--previous { grid-area: previous; }
        .promo-popup-arrow--next { grid-area: next; }
        .promo-popup-count {
          grid-area: count;
          justify-self: center;
          margin: 0;
          padding: .4rem .75rem;
          border: 1px solid rgba(255,255,255,.2);
          border-radius: 999px;
          background: rgba(7,16,12,.72);
          color: #fff;
          font: 600 .78rem/1.2 system-ui, sans-serif;
        }
        .promo-popup-close:hover {
          background: rgba(7, 16, 12, 0.9);
          transform: rotate(90deg);
        }
        @keyframes promo-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes promo-rise {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (max-width: 700px) {
          .promo-popup-overlay {
            padding: max(.5rem, env(safe-area-inset-top)) max(.5rem, env(safe-area-inset-right)) max(.5rem, env(safe-area-inset-bottom)) max(.5rem, env(safe-area-inset-left));
          }
          .promo-popup-layout {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          grid-template-areas: "card card" "previous next";
            gap: .65rem;
          }
          .promo-popup-card,
          .promo-popup-link,
          .promo-popup-image-frame,
          .promo-popup-image {
            max-height: calc(100vh - 9rem);
            max-height: calc(100svh - 9rem);
          }
          .promo-popup-arrow {
            width: 48px;
            height: 48px;
            justify-self: center;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .promo-popup-overlay,
          .promo-popup-card {
            animation: none;
          }
          .promo-popup-image {
            transition: none;
          }
          .promo-popup-arrow { transition: none; }
        }
      `}</style>
    </div>
  );
}
