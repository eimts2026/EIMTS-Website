import { createBrowserClient } from "@supabase/ssr";
import {
  isSupabaseConfigured,
  supabasePublishableKey,
  supabaseUrl,
} from "./config";

export function createClient() {
  if (!isSupabaseConfigured()) return null;
  return createBrowserClient(supabaseUrl!, supabasePublishableKey!);
}

// Recovery explicitly consumes the URL once, before ordinary session checks.
export function createRecoveryClient() {
  if (!isSupabaseConfigured()) return null;
  return createBrowserClient(supabaseUrl!, supabasePublishableKey!, {
    isSingleton: false,
    auth: { detectSessionInUrl: false },
  });
}
