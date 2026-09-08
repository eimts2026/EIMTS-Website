import { getPublishedJobs } from "@/lib/jobs";
import HomePage from "@/features/home/HomePage";
import { getHeroContent } from "@/lib/hero";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Emerald Isle Manpower – Top Recruitment Agency in Sri Lanka",
  "Award-winning recruitment agency in Sri Lanka connecting skilled candidates with trusted foreign employers.",
  "/",
);

// Match Find Jobs: dashboard publishing and expiry changes appear on page load.
export const dynamic = "force-dynamic";

export default async function Page() {
  const [hero, jobs] = await Promise.all([getHeroContent(), getPublishedJobs()]);
  const urgentJobs = jobs.filter((job) => job.urgent && job.slug).slice(0, 6);
  return <HomePage hero={hero} urgentJobs={urgentJobs} />;
}
