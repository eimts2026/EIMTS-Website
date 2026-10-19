"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type Turnstile = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};
declare global { interface Window { turnstile?: Turnstile } }

export function BotProtection({ action, resetKey, onToken }: {
  action: "contact" | "employer" | "application";
  resetKey: number;
  onToken: (token: string) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const callback = useRef(onToken);
  callback.current = onToken;
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [compact, setCompact] = useState(false);
  const [error, setError] = useState("");
  const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: "200px" });
    observer.observe(element);
    const resize = new ResizeObserver(entries => setCompact(entries[0].contentRect.width < 300));
    resize.observe(element);
    return () => { observer.disconnect(); resize.disconnect(); };
  }, []);

  useEffect(() => {
    const api = window.turnstile;
    const element = container.current;
    callback.current("");
    if (!loaded || !visible || !sitekey || !api || !element) return;
    setError("");
    const id = api.render(element, {
      sitekey, action, theme: "auto", size: compact ? "compact" : "flexible", "response-field": false,
      callback: (token: string) => { setError(""); callback.current(token); },
      "expired-callback": () => callback.current(""),
      "error-callback": () => { callback.current(""); setError("Verification could not load. Check your connection or email our team."); },
    });
    return () => { api.remove(id); callback.current(""); };
  }, [loaded, visible, sitekey, action, resetKey, compact]);

  return <div className="bot-protection">
    {visible && sitekey && <Script id="turnstile-api" src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={() => setLoaded(true)} onError={() => setError("Verification could not load. Please email our team.")} />}
    <div ref={container} style={{ minHeight: compact ? 140 : 65, width: "100%", minWidth: 0 }} />
    {(!sitekey || error) && <p role="status">{error || "Online verification is being configured. Please contact our team by email or phone."}</p>}
  </div>;
}
