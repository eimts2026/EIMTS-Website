import { NextResponse } from "next/server";
import { parseJobSearch } from "@/lib/job-search-params";
import { searchPublicJobs } from "@/lib/job-search";

export async function GET(request: Request) {
  let search;
  try { search = parseJobSearch(new URL(request.url).searchParams); }
  catch (error) { return NextResponse.json({ message: (error as Error).message }, { status: 400 }); }
  try { return NextResponse.json(await searchPublicJobs(search), { headers: { "Cache-Control": "private, no-store" } }); }
  catch (error) { return NextResponse.json({ message: (error as Error).message }, { status: 503 }); }
}
