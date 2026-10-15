"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createRecoveryClient } from "@/lib/supabase/browser";
import { AuthField } from "@/components/AuthField";
import { DotGridBackground } from "@/components/DotGridBackground";
import { RECOVERY_MARKER_KEY, verifyRecoveryLink, updateRecoveryPassword, type RecoveryMarker } from "@/lib/password-recovery";

type Phase = "checking" | "ready" | "invalid" | "done";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("checking");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const recoveryClient = useRef<ReturnType<typeof createRecoveryClient>>(null);
  const initialization = useRef<Promise<RecoveryMarker> | null>(null);
  const saving = useRef(false);
  useEffect(() => {
    let active = true;
    if (!initialization.current) {
      const client = createRecoveryClient();
      recoveryClient.current = client;
      let marker: RecoveryMarker | null = null;
      try { marker = JSON.parse(sessionStorage.getItem(RECOVERY_MARKER_KEY) || "null"); } catch { /* No stored recovery context. */ }
      const href = window.location.href;
      // Remove credentials/errors from the address bar and outgoing referrers.
      window.history.replaceState(null, "", "/reset-password");
      initialization.current = client ? verifyRecoveryLink(client, href, marker) : Promise.reject(new Error("Authentication is not configured. Contact your administrator."));
    }
    initialization.current.then(marker => {
      if (!active) return;
      try { sessionStorage.setItem(RECOVERY_MARKER_KEY, JSON.stringify(marker)); } catch { /* Refresh will require another link. */ }
      setPhase("ready");
    }).catch(error => {
      if (!active) return;
      try { sessionStorage.removeItem(RECOVERY_MARKER_KEY); } catch { /* No storage available. */ }
      setError(error instanceof Error ? error.message : "This reset link could not be verified. Request a new link.");
      setPhase("invalid");
    });
    return () => { active = false; };
  }, []);

  const rules = [
    { label: "At least 12 characters", met: password.length >= 12 },
    { label: "Contains a letter", met: /[a-zA-Z]/.test(password) },
    { label: "Contains a number", met: /\d/.test(password) },
  ];
  const strongEnough = rules.every((rule) => rule.met);
  const mismatch = confirm.length > 0 && password !== confirm;

  async function savePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || saving.current || phase !== "ready") return;
    if (!strongEnough) { setError("Choose a password that meets all three requirements below."); return; }
    if (password !== confirm) { setError("The two passwords do not match."); return; }
    const supabase = recoveryClient.current;
    if (!supabase) { setError("Authentication is not configured. Contact your administrator."); return; }
    saving.current = true; setBusy(true); setError("");
    try {
      await updateRecoveryPassword(supabase, password);
      setPassword(""); setConfirm("");
      try { sessionStorage.removeItem(RECOVERY_MARKER_KEY); } catch { /* No storage available. */ }
      setPhase("done");
    } catch (updateError) {
      const authError = updateError as { code?: string; status?: number };
      if (["session_not_found", "refresh_token_not_found", "refresh_token_already_used"].includes(authError?.code || "") || authError?.status === 401 || authError?.status === 403) setPhase("invalid");
      setError(updateError instanceof Error ? updateError.message : "We could not update your password. Check your connection and try again.");
    } finally { saving.current = false; setBusy(false); }
  }

  return (
    <main className="auth-page">
      <DotGridBackground />
      <div className="auth-vignette" aria-hidden="true" />

      <section className="auth-card">
        <span className="auth-mark" aria-hidden="true">
          EI
        </span>

        {phase === "checking" && (
          <>
            <h1>Checking your link…</h1>
            <p className="auth-sub">Hold on while we verify the reset link.</p>
          </>
        )}

        {phase === "invalid" && (
          <>
            <h1>Reset link unavailable</h1>
            <p className="auth-sub">
              {error || "Request a fresh reset link and open the newest email in the browser that requested it."}
            </p>
            <div className="auth-links">
              <a href="/login?view=forgot">Request a new reset link</a>
              <a href="/login">Back to sign in</a>
            </div>
          </>
        )}

        {phase === "ready" && (
          <>
            <h1>Choose a new password</h1>
            <p className="auth-sub">
              Set a strong password you have not used anywhere else.
            </p>
            <form className="auth-form" onSubmit={savePassword}>
              <AuthField
                label="New password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Minimum 12 characters"
                required
                minLength={12}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <ul className="password-hints">
                {rules.map((rule) => (
                  <li key={rule.label} className={rule.met ? "met" : ""}>
                    {rule.label}
                  </li>
                ))}
              </ul>
              <AuthField
                label="Confirm new password"
                name="confirm"
                type="password"
                autoComplete="new-password"
                placeholder="Repeat the password"
                required
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
              />
              <button
                className={`primary-button auth-submit${busy ? " is-pending" : ""}`}
                type="submit"
                disabled={busy}
              >
                {busy ? "Saving…" : "Save new password"}
              </button>
              <p className="auth-message" aria-live="polite" role="alert">
                {mismatch && !error ? "The two passwords do not match." : error}
              </p>
            </form>
          </>
        )}

        {phase === "done" && (
          <>
            <h1>Password updated</h1>
            <p className="auth-sub">
              Your password has been updated. Sign in again using your new password.
            </p>
            <button
              className="primary-button auth-submit"
              type="button"
              onClick={() => {
                router.replace("/login");
                router.refresh();
              }}
            >
              Back to sign in
            </button>
          </>
        )}

        <p className="auth-footnote">
          Restricted area for authorised Emerald Isle staff. Accounts are
          created by an administrator — sign-ups are disabled.
        </p>
      </section>
    </main>
  );
}
