"use client";

import { type PointerEvent, type ReactNode, useEffect, useRef } from "react";

type HorizontalDragRailProps = {
  children: ReactNode;
  className?: string;
  label: string;
  autoScroll?: boolean;
  loop?: boolean;
};

/** Native scroll-snap rail with mouse and touch drag support. */
export default function HorizontalDragRail({ children, className = "", label, autoScroll = true, loop = false }: HorizontalDragRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const gesture = useRef({ active: false, startX: 0, startScroll: 0, dragged: false });
  const hoverFrame = useRef<number | null>(null);

  useEffect(() => {
    const rail = railRef.current;
    const track = rail?.querySelector<HTMLElement>(".horizontal-drag-rail__track");
    if (!rail || !track || !autoScroll || rail.scrollWidth <= rail.clientWidth) return;
    track.querySelector<HTMLElement>(".horizontal-drag-rail__set[aria-hidden='true']")
      ?.querySelectorAll<HTMLElement>("a, button, [tabindex]")
      .forEach((item) => item.tabIndex = -1);
    let loopWidth = 0;
    const readLoopWidth = () => {
      const firstSet = track.firstElementChild as HTMLElement | null;
      if (!firstSet) return 0;
      const trackGap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
      return firstSet.getBoundingClientRect().width + trackGap;
    };
    if (loop) {
      loopWidth = readLoopWidth();
      rail.scrollLeft = loopWidth;
    }

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let offset = 0;
    let previousTime = 0;
    let paused = motionPreference.matches;
    const readStep = () => {
      const card = track.firstElementChild as HTMLElement | null;
      return card ? card.getBoundingClientRect().width + (Number.parseFloat(getComputedStyle(track).columnGap) || 0) : 0;
    };
    let step = readStep();
    const resizeObserver = new ResizeObserver(() => { step = readStep(); if (loop) loopWidth = readLoopWidth(); });
    resizeObserver.observe(rail);
    if (track.firstElementChild) resizeObserver.observe(track.firstElementChild);
    rail.style.scrollSnapType = paused ? "x mandatory" : "none";

    const tick = (time: number) => {
      const card = track.firstElementChild as HTMLElement | null;
      if (!card) return;
      if (!paused && previousTime) {
        const delta = Math.min(time - previousTime, 48);
        if (loop && loopWidth > 0) {
          rail.scrollLeft += delta * 0.06;
          if (rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 1) rail.scrollLeft -= loopWidth;
          else if (rail.scrollLeft <= 0) rail.scrollLeft += loopWidth;
        } else {
          offset += delta * 0.026;
          while (step > 0 && offset >= step) {
            offset -= step;
            track.append(card);
          }
          track.style.transform = `translate3d(${-offset}px, 0, 0)`;
        }
      }
      previousTime = time;
      hoverFrame.current = window.requestAnimationFrame(tick);
    };

    const pause = () => { paused = true; rail.style.scrollSnapType = "x mandatory"; };
    const resume = () => { if (!motionPreference.matches && !document.querySelector("dialog[open]")) { paused = false; previousTime = 0; rail.style.scrollSnapType = "none"; } };
    const onFocusOut = (event: FocusEvent) => { if (!rail.contains(event.relatedTarget as Node | null)) resume(); };
    const onMotionChange = () => { if (motionPreference.matches) pause(); else resume(); };
    rail.addEventListener("mouseenter", pause);
    rail.addEventListener("mouseleave", resume);
    rail.addEventListener("focusin", pause);
    rail.addEventListener("focusout", onFocusOut);
    rail.addEventListener("pointerdown", pause);
    rail.addEventListener("pointerup", resume);
    rail.addEventListener("pointercancel", resume);
    rail.addEventListener("wheel", pause, { passive: true });
    motionPreference.addEventListener("change", onMotionChange);
    hoverFrame.current = window.requestAnimationFrame(tick);

    return () => {
      if (hoverFrame.current !== null) window.cancelAnimationFrame(hoverFrame.current);
      rail.removeEventListener("mouseenter", pause);
      rail.removeEventListener("mouseleave", resume);
      rail.removeEventListener("focusin", pause);
      rail.removeEventListener("focusout", onFocusOut);
      rail.removeEventListener("pointerdown", pause);
      rail.removeEventListener("pointerup", resume);
      rail.removeEventListener("pointercancel", resume);
      rail.removeEventListener("wheel", pause);
      motionPreference.removeEventListener("change", onMotionChange);
      resizeObserver.disconnect();
      track.style.transform = "";
      rail.style.scrollSnapType = "";
    };
  }, [autoScroll, loop]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const rail = railRef.current;
    if (!rail) return;
    gesture.current = { active: true, startX: event.clientX, startScroll: rail.scrollLeft, dragged: false };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail || !gesture.current.active) return;
    const distance = event.clientX - gesture.current.startX;
    if (Math.abs(distance) > 5 && !gesture.current.dragged) {
      gesture.current.dragged = true;
      rail.setPointerCapture(event.pointerId);
    }
    if (!gesture.current.dragged) return;
    rail.scrollLeft = gesture.current.startScroll - distance;
    event.preventDefault();
  };

  const onPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (rail?.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
    gesture.current.active = false;
  };

  return <div
    ref={railRef}
    className={`horizontal-drag-rail ${className}`}
    role="region"
    aria-label={label}
    tabIndex={0}
    data-lenis-prevent
    onPointerDown={onPointerDown}
    onPointerMove={onPointerMove}
    onPointerUp={onPointerEnd}
    onPointerCancel={onPointerEnd}
    onClickCapture={(event) => { if (gesture.current.dragged) { event.preventDefault(); event.stopPropagation(); gesture.current.dragged = false; } }}
  >
    <div className="horizontal-drag-rail__track" onClick={(event) => { if (gesture.current.dragged) { event.preventDefault(); event.stopPropagation(); gesture.current.dragged = false; } }}>
      <div className="horizontal-drag-rail__set">{children}</div>
      {loop && <div className="horizontal-drag-rail__set" aria-hidden="true">{children}</div>}
    </div>
  </div>;
}
