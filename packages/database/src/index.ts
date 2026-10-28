export type JobStatus = "draft" | "published" | "paused" | "expired";

export type JobRecord = {
  id: string;
  slug: string;
  title: string;
  country: string;
  location: string | null;
  category: string;
  employment_type: string;
  salary_negotiable?: boolean;
  salary_amount: number | null;
  salary_lkr: number | null;
  currency: string;
  summary: string;
  description: string;
  requirements: string[];
  image_url: string | null;
  image_position: string;
  urgent: boolean;
  featured: boolean;
  status: JobStatus;
  published_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ProfileRole = "admin" | "editor" | "viewer";

export type HeroSlideRecord = {
  id: string;
  kicker: string | null;
  title: string;
  copy: string;
  image_url: string;
  cta_label: string | null;
  cta_url: string | null;
  cta2_label: string | null;
  cta2_url: string | null;
  sort_order: number;
  is_takeover: boolean;
  active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectImageRecord = {
  id: string;
  image_url: string;
  storage_path: string | null;
  alt_text: string;
};

export type ProjectRecord = {
  id: string;
  slug: string;
  name: string;
  country: string;
  client: string;
  images: ProjectImageRecord[];
  hero_image_id: string;
  hero_position_x: number;
  hero_position_y: number;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type PopupRecord = {
  id: string;
  title: string;
  message: string | null;
  image_url: string | null;
  link_url: string | null;
  link_label: string | null;
  active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
};
