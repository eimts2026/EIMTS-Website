import "server-only";
import { createClient } from "@supabase/supabase-js";
import { publicCache } from "./public-cache";
import { mapPublishedJob, type PublishedJobRow } from "./jobs";
import type { Job } from "@/features/jobs/JobsPage";
import type { JobSearch, JobFacet } from "./job-search-params";

export type JobSearchResult = { items: Job[]; total: number; nextCursor: string | null; locations: JobFacet[]; categories: JobFacet[] };
type Cursor = { id: string; urgent: boolean; published_at: string | null; sort_value: string };

function decodeCursor(value: string): Cursor | null {
  if (!value) return null;
  try {
    const cursor = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
    if (!cursor || typeof cursor !== "object" || !/^[0-9a-f-]{36}$/i.test(cursor.id) || typeof cursor.urgent !== "boolean" || typeof cursor.sort_value !== "string" || cursor.sort_value.length > 1000 || (cursor.published_at !== null && (typeof cursor.published_at !== "string" || !Number.isFinite(Date.parse(cursor.published_at))))) throw new Error();
    return cursor;
  } catch { throw new Error("Invalid page link. Please start a new search."); }
}

export const searchPublicJobs = publicCache("job-search", async (search: JobSearch): Promise<JobSearchResult> => {
  const cursor = decodeCursor(search.cursor);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Vacancies are temporarily unavailable. Please try again shortly.");
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await db.rpc("search_public_jobs", { p_keyword: search.title, p_location: search.location, p_category: search.category, p_sort: search.sort, p_page_size: search.pageSize, p_cursor: cursor });
  if (error || !data) {
    console.error("Public job search failed", { code: error?.code });
    throw new Error("Vacancies could not be loaded. Please try again shortly.");
  }
  const result = data as { items: PublishedJobRow[]; total: number; nextCursor: Cursor | null; locations: JobFacet[]; categories: JobFacet[] };
  return { ...result, items: result.items.map(mapPublishedJob), nextCursor: result.nextCursor ? Buffer.from(JSON.stringify(result.nextCursor)).toString("base64url") : null };
});
