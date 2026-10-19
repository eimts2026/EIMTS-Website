import "server-only";

export async function revalidatePublicJobs() {
  const origin = process.env.PUBLIC_WEBSITE_ORIGIN;
  const secret = process.env.PUBLIC_CACHE_REVALIDATION_SECRET;
  if (!origin || !secret) {
    console.warn(JSON.stringify({ event: "public_jobs_invalidation_unconfigured", fallbackSeconds: 60 }));
    return;
  }
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(new URL("/api/revalidate/jobs/", origin), { method: "POST", cache: "no-store", signal: AbortSignal.timeout(5000), headers: { Authorization: `Bearer ${secret}` } });
      if (response.ok) return;
    } catch { /* One immediate retry; never undo a successful database write. */ }
  }
  console.error(JSON.stringify({ event: "public_jobs_invalidation_failed", fallbackSeconds: 60 }));
}
