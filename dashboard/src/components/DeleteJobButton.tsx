"use client";

import { useState, useTransition } from "react";
import { deleteJob } from "@/app/actions";

export function DeleteJobButton({ id, title }: { id: string; title: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <button
        type="button"
        className="danger-button"
        disabled={pending}
        aria-label={`Delete ${title}`}
        onClick={() => {
          if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) return;
          setError(null);
          startTransition(async () => {
            try {
              const result = await deleteJob(id);
              if (result) setError(result.error);
            } catch {
              setError("Could not delete this vacancy. Please try again.");
            }
          });
        }}
      >
        {pending ? "Deleting…" : "Delete"}
      </button>
      {error && <p role="alert" style={{ maxWidth: "16rem", whiteSpace: "normal" }}>{error}</p>}
    </div>
  );
}
