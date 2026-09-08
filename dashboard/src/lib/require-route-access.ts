import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import { canAccessRoute } from "./auth-policy";

// Recheck at the page boundary; proxy redirects are not the data security boundary.
export async function requireRouteAccess(path: string) {
  const supabase = await createClient();
  if (!supabase) redirect("/login");
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user || user.is_anonymous) redirect(`/login?next=${encodeURIComponent(path)}`);
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!canAccessRoute(path, profile?.role)) redirect("/access-denied");
}
