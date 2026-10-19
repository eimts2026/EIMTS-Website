import "server-only";
import { unstable_cache } from "next/cache";

export const JOBS_CACHE_TAG = "public-jobs-v1";
export const PUBLIC_CACHE_SECONDS = 60;

// Cache only anonymous public data. A failed load throws and is never persisted
// as a successful empty catalogue. Fill/read events can be aggregated in logs.
export function publicCache<Args extends unknown[], Result>(name: string, load: (...args: Args) => Promise<Result>) {
  const cached = unstable_cache(async (...args: Args) => {
    const started = performance.now();
    const value = await load(...args);
    console.info(JSON.stringify({ event: "public_cache_fill", cache: name, durationMs: Math.round(performance.now() - started) }));
    return { value, loadedAt: Date.now() };
  }, [name, "v1", process.env.NEXT_PUBLIC_SUPABASE_URL || "unconfigured"], { tags: [JOBS_CACHE_TAG], revalidate: PUBLIC_CACHE_SECONDS });
  return async (...args: Args): Promise<Result> => {
    const entry = await cached(...args);
    if (process.env.PERFORMANCE_LOGS === "1") console.info(JSON.stringify({ event: "public_cache_read", cache: name, ageMs: Date.now() - entry.loadedAt }));
    return entry.value;
  };
}
