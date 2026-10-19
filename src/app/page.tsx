import { getPublishedJobs } from "@/lib/jobs";
import HomePage from "@/features/home/HomePage";
import { getHeroContent } from "@/lib/hero";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Emerald Isle Manpower – Top Recruitment Agency in Sri Lanka",
  "Award-winning recruitment agency in Sri Lanka connecting skilled candidates with trusted foreign employers.",
  "/",
);

// Keep occasion content dynamic; anonymous jobs use a tagged 60-second data cache.
export const dynamic = "force-dynamic";

export default async function Page() {
  const [hero, jobs] = await Promise.all([getHeroContent(), getPublishedJobs({ urgentOnly: true, limit: 6 }).catch(() => {
    console.error(JSON.stringify({ event: "homepage_jobs_unavailable" }));
    return [];
  })]);
  const urgentJobs = jobs;
  return <HomePage hero={hero} urgentJobs={urgentJobs} />;
}
