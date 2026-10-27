import { createClient } from "@supabase/supabase-js";

export type PublicPopup = {
  id: string;
  title: string;
  message: string | null;
  image_url: string | null;
  link_url: string | null;
  link_label: string | null;
  updated_at: string;
};

export async function getActivePopups(): Promise<PublicPopup[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) return [];

  const supabase = createClient(url, publishableKey, {
    auth: { persistSession: false },
  });

  // Row-level security hides inactive and out-of-window popups from anonymous
  // readers. Return every live popup for the public carousel.
  const { data, error } = await supabase
    .from("popups")
    .select("id,title,message,image_url,link_url,link_label,updated_at")
    .not("image_url", "is", null)
    .order("updated_at", { ascending: false });

  if (error || !data) return [];
  return data as PublicPopup[];
}
