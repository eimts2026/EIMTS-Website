"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import "./ImageViewer.css";

export default function ImageViewer({ src, alt, title, children, className = "", onOpenChange }: {
  src: string; alt: string; title: string; children: ReactNode; className?: string; onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.showModal();
    return () => {
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [open]);
  const close = () => {
    dialogRef.current?.close();
    setOpen(false);
    onOpenChange?.(false);
  };
  return <>
    <button ref={triggerRef} type="button" className={`ei-image-trigger ${className}`} aria-label={`View full image: ${title}`} aria-haspopup="dialog" onClick={() => { setOpen(true); onOpenChange?.(true); }}>
      {children}
    </button>
    {open && createPortal(<dialog ref={dialogRef} className="ei-image-viewer" aria-label={title} onPointerDown={(event) => event.stopPropagation()} onPointerUp={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()} onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => { event.stopPropagation(); if (event.target === event.currentTarget) close(); }}>
      <div className="ei-image-viewer-content">
        <button type="button" className="ei-image-viewer-close" aria-label="Close full image" onClick={close} autoFocus>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>
        <img src={src} alt={alt} />
        <p>{title}</p>
      </div>
    </dialog>, document.body)}
  </>;
}
