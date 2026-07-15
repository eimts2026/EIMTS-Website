import { useMemo, useState } from "react";
import { PageHero } from "../../components/ui/PageHero";

const jobs = [
  ["Barista Positions in Saudi Arabia", "Saudi Arabia", "Hospitality"],
  ["Assistant General Manager (Hotel)", "Ireland", "Hospitality"],
  ["Automotive Job Opportunities", "Saudi Arabia", "Automotive"],
  ["Carpentry and Industrial Jobs", "Serbia", "Skilled Trades"],
  ["Warehouse Associates", "Serbia", "Logistics"],
  ["Culinary Professionals", "Ireland", "Culinary"],
  ["Culinary Job Opportunities", "Kuwait", "Culinary"],
  ["Executive Chef Vacancy", "Kuwait", "Hospitality"],
  ["Grill Cooks and Pizza Makers", "Kuwait", "Culinary"],
  ["Aluminium Fabricators", "Serbia", "Engineering"],
  ["Merchandiser Positions", "Kuwait", "Retail"],
  ["CAFM Coordinator and Storekeeper", "Saudi Arabia", "Facilities"],
];

type Filters = { title: string; location: string; category: string };
const emptyFilters: Filters = { title: "", location: "", category: "" };

function queryFilters(): Filters {
  if (typeof window === "undefined") return emptyFilters;
  const params = new URLSearchParams(window.location.search);
  return {
    title: params.get("filter-title") || "",
    location: params.get("filter-location") || "",
    category: params.get("filter-category") || "",
  };
}

export default function JobsPage() {
  const initial = queryFilters();
  const [draft, setDraft] = useState<Filters>(initial);
  const [active, setActive] = useState<Filters>(initial);

  const results = useMemo(() => jobs.filter(([title, location, type]) => {
    const term = active.title.trim().toLowerCase();
    return (!term || title.toLowerCase().includes(term) || type.toLowerCase().includes(term))
      && (!active.location || location === active.location)
      && (!active.category || type === active.category || active.category.toLowerCase().includes(type.toLowerCase()));
  }), [active]);

  function applyFilters(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActive(draft);
    const params = new URLSearchParams();
    if (draft.title) params.set("filter-title", draft.title);
    if (draft.location) params.set("filter-location", draft.location);
    if (draft.category) params.set("filter-category", draft.category);
    window.history.replaceState({}, "", window.location.pathname + (params.size ? "?" + params.toString() : ""));
  }

  function clearFilters() {
    setDraft(emptyFilters);
    setActive(emptyFilters);
    window.history.replaceState({}, "", window.location.pathname);
  }

  return <main id="main">
    <PageHero eyebrow="Build your international career" title="Foreign job vacancies" description="Search verified overseas opportunities and find a role that matches your skills, experience and career goals." />
    <section className="jobs-page"><div className="container">
      <form className="jobs-filter" onSubmit={applyFilters}>
        <label><span>Job title</span><input name="filter-title" type="search" placeholder="Title or keyword" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} /></label>
        <label><span>Location</span><select name="filter-location" value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })}><option value="">All locations</option><option>Ireland</option><option>Saudi Arabia</option><option>Serbia</option><option>Kuwait</option></select></label>
        <label><span>Category</span><select name="filter-category" value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}><option value="">All categories</option><option>Hospitality</option><option>Automotive</option><option>Culinary</option><option>Engineering</option><option>Skilled Trades</option><option>Logistics</option><option>Retail</option><option>Facilities</option></select></label>
        <button type="submit">Search jobs</button>
      </form>
      <div className="jobs-results-title"><div><p className="section-kicker">Current openings</p><h2>{results.length ? "Opportunities ready for you" : "No exact matches yet"}</h2></div><span>{results.length} {results.length === 1 ? "vacancy" : "vacancies"} displayed</span></div>
      {results.length ? <div className="jobs-list-grid">{results.map(([title, location, type]) => <article className="route-job-card" key={title}><span className="job-type">{type}</span><h3>{title}</h3><p>{location} · Full-time</p><a href="https://registration.emeraldislemanpower.com/" target="_blank" rel="noreferrer">Register to apply <span aria-hidden="true">↗</span></a></article>)}</div> : <div className="jobs-empty"><p>Try a broader keyword or clear the filters to see every current vacancy.</p><button type="button" onClick={clearFilters}>Clear all filters</button></div>}
    </div></section>
  </main>;
}
