import "server-only";
import { cache } from "react";
import { publicCache } from "./public-cache";
import { createClient } from "@supabase/supabase-js";
import type { Job } from "@/features/jobs/JobsPage";
import { formatJobSalary } from "@/lib/salary";

export type PublicJobDetail = {
  id: string;
  slug: string;
  title: string;
  country: string;
  location: string | null;
  category: string;
  employment_type: string;
  salary_amount: number | null;
  salary_lkr: number | null;
  currency: string;
  summary: string;
  description: string;
  requirements: string[];
  image_url: string | null;
  urgent: boolean;
  published_at: string | null;
  expires_at: string | null;
};

export type PublishedJobRow = {
  salary_amount: number | null;
  salary_lkr: number | null;
  currency: string;
  id: string;
  slug: string;
  title: string;
  country: string;
  location: string | null;
  category: string;
  employment_type: string;
  urgent: boolean;
  image_url: string | null;
  image_position: string | null;
  expires_at: string | null;
};

async function loadPublishedJobs(options: { urgentOnly?: boolean; limit?: number } = {}): Promise<Job[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) return [];

  const supabase = createClient(url, publishableKey, {
    auth: { persistSession: false },
  });

  let query = supabase
    .from("jobs")
    .select(
      "id,slug,title,country,location,category,employment_type,urgent,image_url,image_position,expires_at,salary_amount,salary_lkr,currency",
    )
    .eq("status", "published")
    .or(`expires_at.is.null,expires_at.gte.${new Date().toISOString()}`)
    .order("urgent", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("id", { ascending: false });

  if (options.urgentOnly) query = query.eq("urgent", true).not("slug", "is", null).neq("slug", "");
  query = query.limit(Math.min(Math.max(options.limit || 6, 1), 12));
  const { data, error } = await query;

  if (error || !data) throw new Error("Could not load published jobs");

  return (data as PublishedJobRow[]).map(mapPublishedJob);
}

export function mapPublishedJob(job: PublishedJobRow): Job { return {
    id: job.id,
    slug: job.slug,
    title: job.title,
    location: job.location || job.country,
    country: job.country,
    salary: formatJobSalary(job),
    expiresAt: job.expires_at,
    category: job.category,
    employmentType: job.employment_type,
    urgent: job.urgent,
    image: job.image_url || "/assets/blog-global-careers.webp",
    imagePosition: job.image_position || "50% 50%",
  }; }

const loadPublishedJobBySlug = publicCache("job-detail", async function getPublishedJobBySlug(
  slug: string,
): Promise<PublicJobDetail | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) return null;

  const supabase = createClient(url, publishableKey, {
    auth: { persistSession: false },
  });
  const { data, error } = await supabase
    .from("jobs")
    .select(
      "id,slug,title,country,location,category,employment_type,salary_amount,salary_lkr,currency,summary,description,requirements,image_url,urgent,published_at,expires_at",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw new Error("Could not load vacancy details");
  return data as PublicJobDetail | null;
});

export const getPublishedJobBySlug = cache(loadPublishedJobBySlug);

export const getPublishedJobs = publicCache("urgent-jobs", loadPublishedJobs);

export async function getPublishedJobSlugs(): Promise<
  Array<{ slug: string; updated_at: string }>
> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) return [];

  const supabase = createClient(url, publishableKey, {
    auth: { persistSession: false },
  });
  const { data, error } = await supabase
    .from("jobs")
    .select("slug,updated_at")
    .eq("status", "published");

  if (error || !data) return [];
  return data as Array<{ slug: string; updated_at: string }>;
}
