type SeoEntry = { title: string; description: string };

const seo: Record<string, SeoEntry> = {
  "/": { title: "Emerald Isle Manpower – Top Recruitment Agency in Sri Lanka", description: "Award-winning recruitment agency in Sri Lanka connecting skilled candidates with trusted foreign employers." },
  "/about-us-emerald-isle-manpower": { title: "About Emerald Isle Manpower & Travel Services", description: "Discover Emerald Isle Manpower's mission, values, licensed recruitment expertise and international network." },
  "/contact": { title: "Contact Emerald Isle Manpower", description: "Contact Emerald Isle Manpower offices in Colombo, Kurunegala, Batticaloa, Kandy, Nepal and the UAE." },
  "/foreign-job-vacancies": { title: "Foreign Job Vacancies for Sri Lankans", description: "Explore current foreign job vacancies in hospitality, automotive, construction, logistics and culinary sectors." },
  "/client-recruitment-solutions": { title: "International Recruitment Solutions for Employers", description: "End-to-end international recruitment solutions for employers across hospitality, engineering, construction and more." },
  "/education-page": { title: "Study Abroad & Global Education Services", description: "Study abroad guidance, applications, accommodation and financial support from Emerald Isle Education." },
  "/insightful-and-engaging-blog-posts-discover-our-latest-articles": { title: "Career & Recruitment Insights", description: "Practical career, interview, leadership and international recruitment insights from Emerald Isle Manpower." },
  "/emerald-isle-manpower-faq": { title: "Emerald Isle Manpower FAQ", description: "Answers about candidate accounts, passwords, CV uploads, profiles and foreign job applications." },
};

export function updateSeo(pathname: string) {
  const path = pathname.replace(/\/+$/, "") || "/";
  const entry = seo[path] ?? { title: "Page Not Found | Emerald Isle Manpower", description: "The requested page could not be found." };
  document.title = entry.title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", entry.description);
  document.querySelector('link[rel="canonical"]')?.setAttribute("href", `https://emeraldislemanpower.com${path === "/" ? "/" : `${path}/`}`);
}
