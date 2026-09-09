"use client";

import { useFormStatus } from "react-dom";

type Props = {
  children: React.ReactNode;
  message: string;
  className?: string;
};

export function ConfirmActionButton({ children, message, className }: Props) {
  const { pending } = useFormStatus();
  return (
    <button
      className={`${className || ""}${pending ? " action-pending" : ""}`}
      disabled={pending}
      aria-busy={pending}
      type="submit"
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {pending && <span className="action-spinner" aria-hidden="true" />}
      <span role="status" aria-live="polite">{pending ? "Deleting…" : children}</span>
    </button>
  );
}
