"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

type ConnectionStatus = "connecting" | "live" | "offline";

const STATUS_LABELS: Record<ConnectionStatus, string> = {
  connecting: "Connecting",
  live: "Live",
  offline: "Offline",
};

export function RealtimeStatus() {
  const [status, setStatus] = useState<ConnectionStatus>("connecting");

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setStatus("offline");
      return;
    }

    const updateForNetwork = () => {
      setStatus(navigator.onLine ? "connecting" : "offline");
    };

    updateForNetwork();
    window.addEventListener("online", updateForNetwork);
    window.addEventListener("offline", updateForNetwork);

    const channel = supabase.channel("dashboard-live-status");
    channel.subscribe((channelStatus) => {
      if (channelStatus === "SUBSCRIBED") {
        setStatus(navigator.onLine ? "live" : "offline");
      } else if (
        channelStatus === "CHANNEL_ERROR" ||
        channelStatus === "TIMED_OUT" ||
        channelStatus === "CLOSED"
      ) {
        setStatus(navigator.onLine ? "connecting" : "offline");
      }
    });

    return () => {
      window.removeEventListener("online", updateForNetwork);
      window.removeEventListener("offline", updateForNetwork);
      void supabase.removeChannel(channel);
    };
  }, []);

  return (
    <span
      className={`connection-status connection-status-${status}`}
      role="status"
      aria-live="polite"
      title={`Supabase Realtime: ${STATUS_LABELS[status]}`}
    >
      <span className="connection-status-dot" aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  );
}
