import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";

type Job = {
  id: string;
  title: string;
  location: string;
  category: string;
  employmentType: string;
  urgent: boolean;
  image: string;
  imagePosition: string;
};

type Filters = { title: string; location: string; category: string };
type SortOption = "default" | "title-asc" | "location-asc";

const emptyFilters: Filters = { title: "", location: "", category: "" };

const jobs: Job[] = [
  {
    id: "barista-saudi-arabia",
    title: "Barista Positions in Saudi Arabia",
    location: "Saudi Arabia",
    category: "Hospitality",
    employmentType: "Full-time",
    urgent: true,
    image: "/assets/blog-interview-editorial.webp",
    imagePosition: "28% 50%",
  },
  {
    id: "assistant-general-manager-ireland",
    title: "Assistant General Manager (Hotel)",
    location: "Ireland",
    category: "Hospitality",
    employmentType: "Full-time",
    urgent: false,
    image: "/assets/hero-employer-partnership.webp",
    imagePosition: "72% 50%",
  },
  {
    id: "automotive-saudi-arabia",
    title: "Automotive Job Opportunities",
    location: "Saudi Arabia",
    category: "Automotive",
    employmentType: "Full-time",
    urgent: true,
    image: "/assets/blog-career-planning.webp",
    imagePosition: "30% 50%",
  },
  {
    id: "carpentry-industrial-serbia",
    title: "Carpentry and Industrial Jobs",
    location: "Serbia",
    category: "Skilled Trades",
    employmentType: "Full-time",
    urgent: false,
    image: "/assets/blog-global-careers.webp",
    imagePosition: "50% 50%",
  },
  {
    id: "warehouse-associates-serbia",
    title: "Warehouse Associates",
    location: "Serbia",
    category: "Logistics",
    employmentType: "Full-time",
    urgent: true,
    image: "/assets/blog-career-planning.webp",
    imagePosition: "30% 50%",
  },
  {
    id: "culinary-professionals-ireland",
    title: "Culinary Professionals",
    location: "Ireland",
    category: "Culinary",
    employmentType: "Full-time",
    urgent: false,
    image: "/assets/emerald-journey-hero.webp",
    imagePosition: "62% 50%",
  },
  {
    id: "culinary-opportunities-kuwait",
    title: "Culinary Job Opportunities",
    location: "Kuwait",
    category: "Culinary",
    employmentType: "Full-time",
    urgent: true,
    image: "/assets/hero-travel-guidance.webp",
    imagePosition: "72% 50%",
  },
  {
    id: "executive-chef-kuwait",
    title: "Executive Chef Vacancy",
    location: "Kuwait",
    category: "Hospitality",
    employmentType: "Full-time",
    urgent: false,
    image: "/assets/blog-leadership-editorial.webp",
    imagePosition: "56% 50%",
  },
  {
    id: "grill-cooks-pizza-makers-kuwait",
    title: "Grill Cooks and Pizza Makers",
    location: "Kuwait",
    category: "Culinary",
    employmentType: "Full-time",
    urgent: true,
    image: "/assets/blog-global-careers.webp",
    imagePosition: "50% 50%",
  },
  {
    id: "aluminium-fabricators-serbia",
    title: "Aluminium Fabricators",
    location: "Serbia",
    category: "Engineering",
    employmentType: "Full-time",
    urgent: false,
    image: "/assets/blog-career-planning.webp",
    imagePosition: "30% 50%",
  },
  {
    id: "merchandisers-kuwait",
    title: "Merchandiser Positions",
    location: "Kuwait",
    category: "Retail",
    employmentType: "Full-time",
    urgent: false,
    image: "/assets/blog-interview-editorial.webp",
    imagePosition: "28% 50%",
  },
  {
    id: "cafm-storekeeper-saudi-arabia",
    title: "CAFM Coordinator and Storekeeper",
    location: "Saudi Arabia",
    category: "Facilities",
    employmentType: "Full-time",
    urgent: true,
    image: "/assets/blog-global-careers.webp",
    imagePosition: "50% 50%",
  },
];

const popularSearches = ["Hospitality", "Automotive", "Culinary", "Engineering"];
const locationOptions = [
  { value: "", label: "All locations" },
  { value: "Ireland", label: "Ireland" },
  { value: "Saudi Arabia", label: "Saudi Arabia" },
  { value: "Serbia", label: "Serbia" },
  { value: "Kuwait", label: "Kuwait" },
];
const categoryOptions = [
  { value: "", label: "All categories" },
  { value: "Hospitality", label: "Hospitality" },
  { value: "Automotive", label: "Automotive" },
  { value: "Culinary", label: "Culinary" },
  { value: "Engineering", label: "Engineering" },
  { value: "Skilled Trades", label: "Skilled Trades" },
  { value: "Logistics", label: "Logistics" },
  { value: "Retail", label: "Retail" },
  { value: "Facilities", label: "Facilities" },
];
const sortOptions = [
  { value: "default", label: "Sort by: Recommended" },
  { value: "title-asc", label: "Job title: A–Z" },
  { value: "location-asc", label: "Location: A–Z" },
];
const pageSizeOptions = [
  { value: "6", label: "6 per page" },
  { value: "12", label: "12 per page" },
];
function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg>;
}

function PinIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s6-5.1 6-12a6 6 0 1 0-12 0c0 6.9 6 12 6 12Z" /><circle cx="12" cy="9" r="2" /></svg>;
}

function CategoryIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>;
}

function ChevronIcon() {
  return <svg className="job-select-chevron" viewBox="0 0 20 20" aria-hidden="true"><path d="m5.5 7.5 4.5 4.5 4.5-4.5" /></svg>;
}

function CheckIcon() {
  return <svg className="job-select-check" viewBox="0 0 20 20" aria-hidden="true"><path d="m4.5 10.2 3.2 3.2 7.8-7.8" /></svg>;
}

type SelectOption = { value: string; label: string };

type SelectMenuProps = {
  label: string;
  name?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  icon?: ReactNode;
  className?: string;
};

function SelectMenu({ label, name, value, options, onChange, icon, className = "" }: SelectMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listId = useId();
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));
  const selectedOption = options[selectedIndex];

  useEffect(() => {
    if (!isOpen) return;

    setActiveIndex(selectedIndex);
    const focusFrame = requestAnimationFrame(() => optionRefs.current[selectedIndex]?.focus());
    const closeOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, selectedIndex]);

  function focusOption(index: number) {
    const nextIndex = (index + options.length) % options.length;
    setActiveIndex(nextIndex);
    requestAnimationFrame(() => optionRefs.current[nextIndex]?.focus());
  }

  function handleOptionKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusOption(index + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusOption(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusOption(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusOption(options.length - 1);
    } else if (event.key === "Tab") {
      setIsOpen(false);
    }
  }

  function selectOption(option: SelectOption) {
    onChange(option.value);
    setIsOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  return <div className={"job-select " + (icon ? "has-icon " : "") + className} ref={rootRef}>
    {name && <input type="hidden" name={name} value={value} />}
    <button
      className="job-select-trigger"
      type="button"
      ref={triggerRef}
      aria-label={label}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-controls={listId}
      onClick={() => setIsOpen((open) => !open)}
      onKeyDown={(event) => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          setIsOpen(true);
        }
      }}
    >
      {icon && <i>{icon}</i>}
      <span>{selectedOption.label}</span>
      <ChevronIcon />
    </button>
    {isOpen && <div className="job-select-menu" id={listId} role="listbox" aria-label={label}>
      {options.map((option, index) => <button
        className="job-select-option"
        type="button"
        role="option"
        aria-selected={option.value === value}
        tabIndex={index === activeIndex ? 0 : -1}
        key={option.value || "all"}
        ref={(element) => { optionRefs.current[index] = element; }}
        onMouseEnter={() => setActiveIndex(index)}
        onKeyDown={(event) => handleOptionKeyDown(event, index)}
        onClick={() => selectOption(option)}
      >
        <span>{option.label}</span>
        {option.value === value && <CheckIcon />}
      </button>)}
    </div>}
  </div>;
}
function queryFilters(): Filters {
  if (typeof window === "undefined") return emptyFilters;
  const params = new URLSearchParams(window.location.search);
  return {
    title: params.get("filter-title") || "",
    location: params.get("filter-location") || "",
    category: params.get("filter-category") || "",
  };
}

function updateQuery(filters: Filters) {
  const params = new URLSearchParams();
  if (filters.title) params.set("filter-title", filters.title);
  if (filters.location) params.set("filter-location", filters.location);
  if (filters.category) params.set("filter-category", filters.category);
  const search = params.size ? "?" + params.toString() : "";
  window.history.replaceState({}, "", window.location.pathname + search);
}

export default function JobsPage() {
  const initial = queryFilters();
  const [draft, setDraft] = useState<Filters>(initial);
  const [active, setActive] = useState<Filters>(initial);
  const [sort, setSort] = useState<SortOption>("default");
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const filteredJobs = useMemo(() => {
    const filtered = jobs.filter((job) => {
      const term = active.title.trim().toLowerCase();
      const matchesTerm = !term || [job.title, job.category, job.location].some((value) => value.toLowerCase().includes(term));
      return matchesTerm
        && (!active.location || job.location === active.location)
        && (!active.category || job.category === active.category);
    });

    if (sort === "title-asc") return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "location-asc") return [...filtered].sort((a, b) => a.location.localeCompare(b.location));
    return filtered;
  }, [active, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));
  const visibleJobs = filteredJobs.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const resultStart = filteredJobs.length ? (currentPage - 1) * pageSize + 1 : 0;
  const resultEnd = Math.min(currentPage * pageSize, filteredJobs.length);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (!selectedJob) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [selectedJob]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selectedJob && !dialog.open) dialog.showModal();
    if (!selectedJob && dialog.open) dialog.close();
  }, [selectedJob]);

  function commitFilters(filters: Filters) {
    setDraft(filters);
    setActive(filters);
    setCurrentPage(1);
    updateQuery(filters);
  }

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    commitFilters(draft);
  }

  function clearFilters() {
    commitFilters(emptyFilters);
  }

  function choosePopularSearch(term: string) {
    commitFilters({ ...emptyFilters, title: term });
  }

  function goToPage(page: number) {
    setCurrentPage(page);
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    requestAnimationFrame(() => document.querySelector(".jobs-results-toolbar")?.scrollIntoView({ behavior, block: "start" }));
  }

  return <main id="main" className="jobs-shell">
    <section className="jobs-search-hero" aria-labelledby="jobs-page-title">
      <div className="container">
        <div className="jobs-search-intro">
          <p className="section-kicker">Verified overseas opportunities</p>
          <h1 id="jobs-page-title">Find work that moves you forward.</h1>
          <p>Search current international vacancies and open any role to see the essentials before you register.</p>
        </div>

        <form className="jobs-filter jobs-filter-modern" onSubmit={applyFilters}>
          <label>
            <span className="sr-only">Job title or keyword</span>
            <i><SearchIcon /></i>
            <input name="filter-title" type="search" placeholder="Job title or keyword" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
          </label>
          <SelectMenu
            className="job-filter-select"
            label="Location"
            name="filter-location"
            value={draft.location}
            options={locationOptions}
            icon={<PinIcon />}
            onChange={(location) => setDraft({ ...draft, location })}
          />
          <SelectMenu
            className="job-filter-select"
            label="Category"
            name="filter-category"
            value={draft.category}
            options={categoryOptions}
            icon={<CategoryIcon />}
            onChange={(category) => setDraft({ ...draft, category })}
          />
          <button type="submit">Find jobs <span aria-hidden="true">→</span></button>
        </form>

        <div className="jobs-popular" aria-label="Popular job searches">
          <span>Popular searches:</span>
          {popularSearches.map((term) => <button type="button" key={term} onClick={() => choosePopularSearch(term)}>{term}</button>)}
        </div>
      </div>
    </section>

    <section className="jobs-page" aria-labelledby="jobs-results-title">
      <div className="container">
        <div className="jobs-results-toolbar">
          <div>
            <p className="section-kicker">Current openings</p>
            <h2 id="jobs-results-title">Opportunities ready for you</h2>
            <p aria-live="polite">Showing {resultStart}–{resultEnd} of {filteredJobs.length} {filteredJobs.length === 1 ? "vacancy" : "vacancies"}</p>
          </div>
          <div className="jobs-results-controls">
            <SelectMenu
              className="job-toolbar-select job-sort-select"
              label="Sort jobs"
              value={sort}
              options={sortOptions}
              onChange={(nextSort) => { setSort(nextSort as SortOption); setCurrentPage(1); }}
            />
            <SelectMenu
              className="job-toolbar-select job-page-size-select"
              label="Jobs per page"
              value={String(pageSize)}
              options={pageSizeOptions}
              onChange={(nextPageSize) => { setPageSize(Number(nextPageSize)); setCurrentPage(1); }}
            />
          </div>
        </div>

        {visibleJobs.length ? <div className="job-directory-grid">
          {visibleJobs.map((job) => <article className="job-listing-card" key={job.id}>
            <button className="job-card-open" type="button" onClick={() => setSelectedJob(job)} aria-label={"View details for " + job.title}>
              <span className={"job-status" + (job.urgent ? " is-urgent" : "")}>{job.urgent ? "Urgent" : "Open"}</span>
              <span className="job-card-image"><img src={job.image} alt="" loading="lazy" style={{ objectPosition: job.imagePosition }} /></span>
              <span className="job-card-category">{job.category}</span>
              <strong>{job.title}</strong>
              <span className="job-card-location"><PinIcon /> {job.location}</span>
              <span className="job-card-footer">View details <b aria-hidden="true">↗</b></span>
            </button>
          </article>)}
        </div> : <div className="jobs-empty">
          <span aria-hidden="true"><SearchIcon /></span>
          <h3>No exact matches yet</h3>
          <p>Try a broader keyword or clear the filters to see every current vacancy.</p>
          <button type="button" onClick={clearFilters}>Clear all filters</button>
        </div>}

        {filteredJobs.length > pageSize && <nav className="jobs-pagination" aria-label="Job results pages">
          <button type="button" disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>← Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button type="button" disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>Next →</button>
        </nav>}
      </div>
    </section>

    <dialog className="job-detail-dialog" ref={dialogRef} aria-labelledby={selectedJob ? "job-detail-title" : undefined} onClose={() => setSelectedJob(null)} onClick={(event) => { if (event.target === event.currentTarget) setSelectedJob(null); }}>
      {selectedJob && <div className="job-detail-panel">
        <button className="job-detail-close" type="button" onClick={() => setSelectedJob(null)} aria-label="Close job details">×</button>
        <div className="job-detail-visual"><img src={selectedJob.image} alt="" style={{ objectPosition: selectedJob.imagePosition }} /><span>{selectedJob.category}</span></div>
        <div className="job-detail-content">
          <span className={"job-status" + (selectedJob.urgent ? " is-urgent" : "")}>{selectedJob.urgent ? "Urgent vacancy" : "Open vacancy"}</span>
          <h2 id="job-detail-title">{selectedJob.title}</h2>
          <p className="job-detail-meta"><span><PinIcon /> {selectedJob.location}</span><span>{selectedJob.employmentType}</span></p>
          <div className="job-detail-section">
            <h3>Vacancy details</h3>
            <dl className="job-detail-facts">
              <div><dt>Category</dt><dd>{selectedJob.category}</dd></div>
              <div><dt>Destination</dt><dd>{selectedJob.location}</dd></div>
              <div><dt>Employment</dt><dd>{selectedJob.employmentType}</dd></div>
              <div><dt>Status</dt><dd>{selectedJob.urgent ? "Urgent" : "Open"}</dd></div>
            </dl>
          </div>
          <p className="job-detail-note">The complete job description, eligibility criteria and document requirements will be shared by our recruitment team after you register your interest.</p>
          <a className="job-detail-apply" aria-label="Register to apply — opens in a new tab" href="https://registration.emeraldislemanpower.com/" target="_blank" rel="noreferrer">Register to apply <span aria-hidden="true">↗</span></a>
          <small className="job-detail-new-tab">Opens secure registration in a new tab</small>
        </div>
      </div>}
    </dialog>
  </main>;
}