"use client";

import { useFormStatus } from "react-dom";
import type { ComponentProps } from "react";

type SubmitButtonProps = Omit<ComponentProps<"button">, "children"> & {
  label: string;
  pendingLabel?: string;
};

export function SubmitButton({ label, pendingLabel = "Saving…", className = "primary-button", disabled, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      {...props}
      className={`${className}${pending ? " action-pending" : ""}`}
      type="submit"
      disabled={disabled || pending}
      aria-busy={pending}
    >
      {pending && <span className="action-spinner" aria-hidden="true" />}
      <span role="status" aria-live="polite">{pending ? pendingLabel : label}</span>
    </button>
  );
}
