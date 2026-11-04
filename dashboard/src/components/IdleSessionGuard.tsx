"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

const IDLE_LIMIT_MS = 30 * 60 * 1000;
const WARNING_PERIOD_MS = 2 * 60 * 1000;
const ACTIVITY_KEY = "ei-dashboard-last-activity";
const PUBLIC_PATHS = new Set(["/login", "/reset-password", "/access-denied"]);

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function IdleSessionGuard() {
  const pathname = usePathname();
  const lastActivity = useRef(Date.now());
  const isSigningOut = useRef(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    const isPublicPath = PUBLIC_PATHS.has(pathname);
    const expireSession = async () => {
      if (isSigningOut.current) return;
      isSigningOut.current = true;
      setSecondsRemaining(null);
      try {
        await supabase.auth.signOut({ scope: "local" });
      } catch {
        // The local timeout still redirects to the sign-in screen if Auth is offline.
      } finally {
        window.location.replace("/login?reason=idle");
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        const now = Date.now();
        lastActivity.current = now;
        window.localStorage.setItem(ACTIVITY_KEY, String(now));
        isSigningOut.current = false;
      }
      if (event === "SIGNED_OUT" && !PUBLIC_PATHS.has(window.location.pathname)) {
        window.localStorage.removeItem(ACTIVITY_KEY);
        window.location.replace("/login");
      }
    });

    if (isPublicPath) {
      return () => {
        subscription.unsubscribe();
      };
    }

    const now = Date.now();
    const storedActivity = Number(window.localStorage.getItem(ACTIVITY_KEY));
    if (Number.isFinite(storedActivity) && storedActivity > 0) {
      if (now - storedActivity >= IDLE_LIMIT_MS) {
        void expireSession();
      } else {
        lastActivity.current = storedActivity;
      }
    } else {
      lastActivity.current = now;
      window.localStorage.setItem(ACTIVITY_KEY, String(now));
    }

    let lastPersistedAt = 0;
    const recordActivity = () => {
      if (isSigningOut.current) return;
      const time = Date.now();
      if (time - lastActivity.current >= IDLE_LIMIT_MS) {
        void expireSession();
        return;
      }
      lastActivity.current = time;
      setSecondsRemaining(null);
      if (time - lastPersistedAt >= 3000) {
        lastPersistedAt = time;
        window.localStorage.setItem(ACTIVITY_KEY, String(time));
      }
    };

    const updateCountdown = () => {
      const idleFor = Math.max(0, Date.now() - lastActivity.current);
      const remaining = Math.ceil((IDLE_LIMIT_MS - idleFor) / 1000);
      if (remaining <= 0) {
        void expireSession();
        return;
      }
      setSecondsRemaining(remaining <= WARNING_PERIOD_MS / 1000 ? remaining : null);
    };

    const syncOtherTabs = (event: StorageEvent) => {
      if (event.key !== ACTIVITY_KEY || !event.newValue) return;
      const otherTabActivity = Number(event.newValue);
      if (Number.isFinite(otherTabActivity) && otherTabActivity > lastActivity.current) {
        lastActivity.current = otherTabActivity;
        setSecondsRemaining(null);
      }
    };

    const checkOnReturn = () => {
      if (document.visibilityState === "visible") updateCountdown();
    };

    const activityEvents = ["pointerdown", "keydown", "touchstart", "scroll", "click", "input"] as const;
    activityEvents.forEach((eventName) => window.addEventListener(eventName, recordActivity, { passive: true }));
    window.addEventListener("storage", syncOtherTabs);
    window.addEventListener("focus", checkOnReturn);
    document.addEventListener("visibilitychange", checkOnReturn);
    const timer = window.setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => {
      window.clearInterval(timer);
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, recordActivity));
      window.removeEventListener("storage", syncOtherTabs);
      window.removeEventListener("focus", checkOnReturn);
      document.removeEventListener("visibilitychange", checkOnReturn);
      subscription.unsubscribe();
    };
  }, [pathname]);

  if (secondsRemaining === null || PUBLIC_PATHS.has(pathname)) return null;

  return (
    <div className="idle-session-backdrop">
      <section className="idle-session-dialog" role="alertdialog" aria-modal="true" aria-labelledby="idle-session-title" aria-describedby="idle-session-description">
        <p className="eyebrow">Session timeout</p>
        <h2 id="idle-session-title">Still working?</h2>
        <p id="idle-session-description">You’ll be signed out for inactivity in <strong>{formatTime(secondsRemaining)}</strong>.</p>
        <button className="primary-button" type="button" onClick={() => {
          const now = Date.now();
          lastActivity.current = now;
          window.localStorage.setItem(ACTIVITY_KEY, String(now));
          setSecondsRemaining(null);
        }}>Stay signed in</button>
      </section>
    </div>
  );
}
