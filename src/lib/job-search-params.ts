export type JobFilters = { title: string; location: string; category: string };
export type JobSort = "default" | "title-asc" | "location-asc";
export type JobSearch = JobFilters & { sort: JobSort; pageSize: 6 | 12; cursor: string };
export type JobFacet = { value: string; count: number };
export const emptyJobFilters: JobFilters = { title: "", location: "", category: "" };

export function parseJobSearch(params: URLSearchParams): JobSearch {
  const text = (key: string, max: number) => {
    const value = (params.get(key) || "").trim();
    if (value.length > max || /[\u0000-\u001f]/.test(value)) throw new Error("Please shorten your search filters.");
    return value;
  };
  const sort = params.get("sort") || "default";
  const size = params.get("size") || "6";
  if (!["default", "title-asc", "location-asc"].includes(sort) || !["6", "12"].includes(size)) throw new Error("Invalid search options.");
  return { title: text("filter-title", 100), location: text("filter-location", 160), category: text("filter-category", 160), sort: sort as JobSort, pageSize: Number(size) as 6 | 12, cursor: text("cursor", 1500) };
}

export function jobSearchParams(search: JobSearch): URLSearchParams {
  const params = new URLSearchParams();
  if (search.title) params.set("filter-title", search.title);
  if (search.location) params.set("filter-location", search.location);
  if (search.category) params.set("filter-category", search.category);
  if (search.sort !== "default") params.set("sort", search.sort);
  if (search.pageSize !== 6) params.set("size", String(search.pageSize));
  if (search.cursor) params.set("cursor", search.cursor);
  return params;
}
