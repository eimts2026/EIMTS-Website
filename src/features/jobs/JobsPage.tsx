"use client";

import { useEffect, useId, useRef, useState, useTransition, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { emptyJobFilters, jobSearchParams, type JobFilters, type JobSearch, type JobSort } from "@/lib/job-search-params";
import type { JobSearchResult } from "@/lib/job-search";
import { JobApplicationForm } from "@/components/jobs/JobApplicationForm";
import { countryFlagPath } from "@/lib/country-flags";

export type Job = {
  id: string;
  slug?: string;
  title: string;
  location: string;
  country?: string;
  salary?: string | null;
  expiresAt?: string | null;
  category: string;
  employmentType: string;
  urgent: boolean;
  image: string;
  imagePosition: string;
};

type Filters = JobFilters;
type SortOption = JobSort;

const emptyFilters = emptyJobFilters;

const sortOptions = [
  { value: "default", label: "Sort by: Recommended" },
  { value: "title-asc", label: "Job title: A to Z" },
  { value: "location-asc", label: "Location: A to Z" },
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

function JobCardContent({ job }: { job: Job }) {
  const flag = countryFlagPath(job.country);
  return <>
    <span className={"job-status" + (job.urgent ? " is-urgent" : "")}>{job.urgent ? "Urgent" : "Open"}</span>
    <span className="job-card-image job-card-flag">
      {flag ? <img src={flag} alt={`${job.country} flag`} loading="lazy" /> : (
        <svg viewBox="0 0 24 24" aria-label="Country" role="img"><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18M5 6h14M5 18h14" /></svg>
      )}
    </span>
    <span className="job-card-category">{job.category}</span>
    <strong>{job.title}</strong>
    <span className="job-card-location"><PinIcon /> {job.location}</span>
    <span className="job-card-salary">{job.salary || "Salary not specified"}</span>
    <span className="job-card-footer">View details <b aria-hidden="true">&gt;</b></span>
  </>;
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
export default function JobsPage({ initialResult, search, loadError = "" }: { initialResult: JobSearchResult; search: JobSearch; loadError?: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [draft, setDraft] = useState<Filters>(search);
  const previous = useRef(new Map<string,string>());
  const previousSearch = useRef(jobSearchParams(search).toString());
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const jobs = initialResult.items;
  const visibleJobs = jobs;
  const sort = search.sort;
  const pageSize = search.pageSize;
  const locationOptions = [{value:"",label:"All locations"}, ...initialResult.locations.map(facet => ({value:facet.value,label:facet.value+" ("+facet.count+")"}))];
  const categoryOptions = [{value:"",label:"All categories"}, ...initialResult.categories.map(facet => ({value:facet.value,label:facet.value+" ("+facet.count+")"}))];
  if (search.location && !locationOptions.some(option => option.value === search.location)) locationOptions.push({value:search.location,label:search.location+" (0)"});
  if (search.category && !categoryOptions.some(option => option.value === search.category)) categoryOptions.push({value:search.category,label:search.category+" (0)"});
  const popularSearches = initialResult.categories.slice(0,4).map(facet => facet.value);
  useEffect(() => { setDraft({title:search.title,location:search.location,category:search.category}); },[search.title,search.location,search.category]);
  useEffect(() => {
    const key = jobSearchParams(search).toString();
    if (previousSearch.current !== key) {
      previousSearch.current = key;
      const frame = requestAnimationFrame(() => document.querySelector(".jobs-results-toolbar")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }));
      return () => cancelAnimationFrame(frame);
    }
  }, [search]);
  function navigate(next: JobSearch) {
    const query = jobSearchParams(next).toString();
    startTransition(() => router.push("/foreign-job-vacancies/" + (query ? "?"+query : ""), {scroll:false}));
  }
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

  function commitFilters(filters: Filters) { previous.current.clear(); navigate({...search,...filters,cursor:""}); }
  function applyFilters(event: FormEvent<HTMLFormElement>) { event.preventDefault(); commitFilters(draft); }
  function clearFilters() { commitFilters(emptyFilters); }
  function choosePopularSearch(term: string) { commitFilters({...emptyFilters,title:term}); }
  function nextPage() {
    if (!initialResult.nextCursor || pending) return;
    previous.current.set(initialResult.nextCursor,search.cursor);
    navigate({...search,cursor:initialResult.nextCursor});
  }
  function previousPage() { navigate({...search,cursor:previous.current.get(search.cursor) || ""}); }
  return <main id="main" className="jobs-shell">
    <section className="jobs-search-hero" aria-labelledby="jobs-page-title">
      <div className="container">
        <div className="jobs-search-intro">
          <p className="section-kicker">Verified overseas opportunities</p>
          <h1 id="jobs-page-title">Find work that moves you forward.</h1>
          <p>Search current international vacancies and apply directly for the role that suits you.</p>
        </div>

        <form aria-busy={pending} className="jobs-filter jobs-filter-modern" onSubmit={applyFilters}>
          <label>
            <span className="sr-only">Job title or keyword</span>
            <i><SearchIcon /></i>
            <input name="filter-title" type="search" maxLength={100} placeholder="Job title or keyword" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
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
          <button type="submit" disabled={pending}>Find jobs <span aria-hidden="true">-&gt;</span></button>
        </form>

        {popularSearches.length > 0 && <div className="jobs-popular" aria-label="Popular job searches">
          <span>Popular searches:</span>
          {popularSearches.map((term) => <button type="button" key={term} onClick={() => choosePopularSearch(term)}>{term}</button>)}
        </div>}
      </div>
    </section>

    <section className="jobs-page" aria-labelledby="jobs-results-title">
      <div className="container">
        <div className="jobs-results-toolbar">
          <div>
            <p className="section-kicker">Current openings</p>
            <h2 id="jobs-results-title">Opportunities ready for you</h2>
            <p aria-live="polite">{pending ? "Loading vacancies…" : `${initialResult.total} ${initialResult.total === 1 ? "vacancy" : "vacancies"} · ${visibleJobs.length} on this page`}</p>
          </div>
          <div className="jobs-results-controls">
            <SelectMenu
              className="job-toolbar-select job-sort-select"
              label="Sort jobs"
              value={sort}
              options={sortOptions}
              onChange={(nextSort) => { previous.current.clear(); navigate({...search,sort:nextSort as SortOption,cursor:""}); }}
            />
            <SelectMenu
              className="job-toolbar-select job-page-size-select"
              label="Jobs per page"
              value={String(pageSize)}
              options={pageSizeOptions}
              onChange={(nextPageSize) => { previous.current.clear(); navigate({...search,pageSize:Number(nextPageSize) as 6 | 12,cursor:""}); }}
            />
          </div>
        </div>

        {loadError ? <div className="jobs-empty" role="alert"><h3>Vacancies could not be loaded</h3><p>{loadError}</p><button type="button" onClick={() => router.refresh()}>Try again</button></div> : visibleJobs.length ? <div className="job-directory-grid" aria-busy={pending}>
          {visibleJobs.map((job) => <article className="job-listing-card" key={job.id}>
            {job.slug
              ? <a className="job-card-open" href={`/foreign-job-vacancies/${job.slug}/`} aria-label={"View details for " + job.title}><JobCardContent job={job} /></a>
              : <button className="job-card-open" type="button" onClick={() => setSelectedJob(job)} aria-label={"View details for " + job.title}><JobCardContent job={job} /></button>}
          </article>)}
        </div> : (search.title || search.location || search.category || search.cursor) ? <div className="jobs-empty">
          <span aria-hidden="true"><SearchIcon /></span>
          <h3>No exact matches yet</h3>
          <p>Try a broader keyword or clear the filters to see every current vacancy.</p>
          <button type="button" onClick={clearFilters}>Clear all filters</button>
        </div> : <div className="jobs-empty">
          <span aria-hidden="true"><SearchIcon /></span>
          <h3>New vacancies are on the way</h3>
          <p>We are preparing our next round of overseas opportunities. Check back soon or contact our team to register your interest.</p>
          <a className="jobs-empty-contact" href="/contact/">Contact our team</a>
        </div>}

        {(search.cursor || initialResult.nextCursor) && <nav className="jobs-pagination" aria-label="Job results pages">
          <button type="button" disabled={!search.cursor || pending} onClick={previousPage}>{previous.current.has(search.cursor) ? "← Previous" : "← First page"}</button>
          <button type="button" disabled={!initialResult.nextCursor || pending} onClick={nextPage}>Next →</button>
        </nav>}
      </div>
    </section>

    <dialog className="job-detail-dialog" ref={dialogRef} aria-labelledby={selectedJob ? "job-detail-title" : undefined} onClose={() => setSelectedJob(null)} onClick={(event) => { if (event.target === event.currentTarget) setSelectedJob(null); }}>
      {selectedJob && <div className="job-detail-panel">
        <button className="job-detail-close" type="button" onClick={() => setSelectedJob(null)} aria-label="Close job details">x</button>
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
          <p className="job-detail-note">Apply directly below. Please include an up-to-date CV so our recruitment team can review your application for this vacancy.</p>
          <JobApplicationForm key={selectedJob.id} jobId={selectedJob.id} className="job-application-form" />
        </div>
      </div>}
    </dialog>
  </main>;
}
