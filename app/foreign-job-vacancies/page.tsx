import { PageHero } from "../components/PageHero";

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

export default function JobsPage() {
  return <main id="main">
    <PageHero eyebrow="Build your international career" title="Foreign Job Vacancies" description="Search verified overseas opportunities and find a role that matches your skills, experience and career goals." />
    <section className="jobs-page"><div className="container">
      <form className="jobs-filter" action="/foreign-job-vacancies/" method="get"><label><span>Job title</span><input name="filter-title" type="search" placeholder="Title or keyword" /></label><label><span>Location</span><select name="filter-location" defaultValue=""><option value="">All locations</option><option>Ireland</option><option>Saudi Arabia</option><option>Serbia</option><option>Kuwait</option></select></label><label><span>Category</span><select name="filter-category" defaultValue=""><option value="">All categories</option><option>Hospitality</option><option>Automotive</option><option>Culinary</option><option>Engineering</option></select></label><button type="submit">Search jobs</button></form>
      <div className="jobs-results-title"><h2>Latest opportunities</h2><span>{jobs.length} vacancies displayed</span></div>
      <div className="jobs-list-grid">{jobs.map(([title, location, type]) => <article className="route-job-card" key={title}><span className="job-type">{type}</span><h3>{title}</h3><p>{location} · Full-time</p><a href="https://registration.emeraldislemanpower.com/" target="_blank" rel="noreferrer">Register to apply →</a></article>)}</div>
    </div></section>
  </main>;
}
