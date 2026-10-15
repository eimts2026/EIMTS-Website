import type { SupabaseClient } from "@supabase/supabase-js";
export const RECOVERY_MARKER_KEY = "ei-dashboard-recovery";
export type RecoveryMarker = { userId: string; expiresAt: number };
export function resetRequestFeedback(error: unknown) {
  const detail = error as { code?: string; status?: number };
  const code = detail?.code || "network_error";
  if (code === "over_email_send_rate_limit") return { message: "The email service has reached its sending limit. Please contact your administrator to restore reset-email delivery, or try again later.", cooldown: 60 };
  if (code === "over_request_rate_limit" || detail?.status === 429) return { message: "Too many reset requests. Wait before requesting another link. If this continues, contact your administrator.", cooldown: 60 };
  if (code === "email_address_not_authorized" || (detail?.status && detail.status >= 500)) return { message: "The password-reset email service is unavailable. Please contact your administrator to check email delivery.", cooldown: 60 };
  if (code === "captcha_failed") return { message: "The authentication service requires a security check. Please contact your administrator to check the dashboard's authentication configuration.", cooldown: 0 };
  return { message: "We could not request a reset link. Check your connection and try again. If it continues, contact your administrator.", cooldown: 0 };
}
export async function verifyRecoveryLink(client: SupabaseClient, href: string, marker: RecoveryMarker | null, now = Date.now()) {
  const url = new URL(href);
  const hash = new URLSearchParams(url.hash.slice(1));
  if (url.searchParams.has("error") || hash.has("error")) throw new Error("This reset link has expired or was already used. Request a new link.");
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  let verifiedLink = false;
  if (code) {
    const { error } = await client.auth.exchangeCodeForSession(code);
    if (error) throw new Error("This reset link could not be verified. Open the newest email in the same browser that requested it, or request a new link.");
    verifiedLink = true;
  } else if (tokenHash && url.searchParams.get("type") === "recovery") {
    const { error } = await client.auth.verifyOtp({ token_hash: tokenHash, type: "recovery" });
    if (error) throw new Error("This reset link has expired or was already used. Request a new link.");
    verifiedLink = true;
  } else if (hash.get("type") === "recovery" && hash.get("access_token") && hash.get("refresh_token")) {
    const { error } = await client.auth.setSession({ access_token: hash.get("access_token")!, refresh_token: hash.get("refresh_token")! });
    if (error) throw new Error("This reset link has expired. Request a new link.");
    verifiedLink = true;
  }
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user || user.is_anonymous) throw new Error("No valid recovery session was found. Request a new reset link.");
  // This marker only restores the UI after refresh. Identity is verified above.
  if (!verifiedLink && (!marker || marker.userId !== user.id || marker.expiresAt <= now)) throw new Error("Open the link in your reset email to choose a new password.");
  return { userId: user.id, expiresAt: verifiedLink ? now + 15 * 60 * 1000 : marker!.expiresAt };
}

export async function updateRecoveryPassword(client: SupabaseClient, password: string) {
  const { error } = await client.auth.updateUser({ password });
  if (error) throw error;
  // The update succeeded. A later sign-out failure must not report a failed update.
  try {
    const { error: signOutError } = await client.auth.signOut({ scope: "global" });
    if (signOutError) await client.auth.signOut({ scope: "local" });
  } catch { /* The password was changed successfully. */ }
}
