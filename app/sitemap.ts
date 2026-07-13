import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    ["", 1, "weekly"],
    ["about-us-emerald-isle-manpower/", 0.8, "monthly"],
    ["contact/", 0.8, "monthly"],
    ["foreign-job-vacancies/", 0.9, "daily"],
    ["client-recruitment-solutions/", 0.8, "monthly"],
    ["education-page/", 0.8, "monthly"],
    ["insightful-and-engaging-blog-posts-discover-our-latest-articles/", 0.7, "weekly"],
    ["emerald-isle-manpower-faq/", 0.6, "monthly"],
  ] as const;

  return routes.map(([path, priority, changeFrequency]) => ({
    url: `https://emeraldislemanpower.com/${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
