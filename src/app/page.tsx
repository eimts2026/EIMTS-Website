import { getPublishedJobs } from "@/lib/jobs";
import HomePage from "@/features/home/HomePage";
import { getHeroContent } from "@/lib/hero";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Recruitment Agency in Sri Lanka",
  "Explore foreign job vacancies with Emerald Isle Manpower, a recruitment agency in Sri Lanka supporting candidates and employers from application to deployment.",
  "/",
);

// Keep occasion content dynamic; anonymous jobs use a tagged 60-second data cache.
export const dynamic = "force-dynamic";

export default async function Page() {
  const [hero, jobs] = await Promise.all([getHeroContent(), getPublishedJobs({ urgentOnly: true, limit: 8 }).catch(() => {
    console.error(JSON.stringify({ event: "homepage_jobs_unavailable" }));
    return [];
  })]);
  const urgentJobs = jobs;
  return <HomePage hero={hero} urgentJobs={urgentJobs} />;
}
