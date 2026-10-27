import JobsPage from "@/features/jobs/JobsPage";
import { PromoPopup } from "@/components/ui/PromoPopup";
import { searchPublicJobs, type JobSearchResult } from "@/lib/job-search";
import { parseJobSearch } from "@/lib/job-search-params";
import { getActivePopups } from "@/lib/popups";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Foreign Job Vacancies for Sri Lankans",
  "Explore current foreign job vacancies in hospitality, automotive, construction, logistics and culinary sectors.",
  "/foreign-job-vacancies",
);

// The page is dynamic for URL filters and fresh promotions; public jobs use
// a shared data cache, invalidated after dashboard changes.
export const dynamic = "force-dynamic";

export default async function Page({searchParams}: {searchParams: Promise<Record<string,string | string[] | undefined>>}) {
  const values = await searchParams;
  const params = new URLSearchParams();
  for(const [key,value] of Object.entries(values)) if(typeof value === "string") params.set(key,value);
  let loadError = "";
  let search;
  try { search = parseJobSearch(params); }
  catch(error) { loadError = (error as Error).message; search = parseJobSearch(new URLSearchParams()); }
  const empty: JobSearchResult = {items:[],total:0,nextCursor:null,locations:[],categories:[]};
  const [result,popup] = await Promise.all([
    loadError ? Promise.resolve(empty) : searchPublicJobs(search).catch(error => { loadError = (error as Error).message; return empty; }),
    getActivePopups(),
  ]);
  return <><JobsPage initialResult={result} search={search} loadError={loadError} /><PromoPopup popups={popup} /></>;
}
