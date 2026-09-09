"use client";

import { useActionState } from "react";
import { migrateBundledProjectImages } from "@/app/actions";
import { SubmitButton } from "./SubmitButton";

export function MoveToStorageButton({ projectId }: { projectId: string }) {
  const [state, action] = useActionState(
    async () => migrateBundledProjectImages(projectId),
    { error: null },
  );

  return (
    <form action={action}>
      <SubmitButton className="" label="Move to storage" pendingLabel="Moving to storage…" />
      {state.error && <p role="alert" style={{ maxWidth: "20rem", whiteSpace: "normal" }}>{state.error}</p>}
    </form>
  );
}
