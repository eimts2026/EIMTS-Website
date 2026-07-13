import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const routes = {
  "about-us-emerald-isle-manpower": ["About Emerald Isle Manpower & Travel Services", "Discover Emerald Isle Manpower's mission, values, licensed recruitment expertise and international network."],
  "contact": ["Contact Emerald Isle Manpower", "Contact Emerald Isle Manpower offices in Colombo, Kurunegala, Batticaloa, Kandy, Nepal and the UAE."],
  "foreign-job-vacancies": ["Foreign Job Vacancies for Sri Lankans", "Explore current foreign job vacancies in hospitality, automotive, construction, logistics and culinary sectors."],
  "client-recruitment-solutions": ["International Recruitment Solutions for Employers", "End-to-end international recruitment solutions for employers across hospitality, engineering, construction and more."],
  "education-page": ["Study Abroad & Global Education Services", "Study abroad guidance, applications, accommodation and financial support from Emerald Isle Education."],
  "insightful-and-engaging-blog-posts-discover-our-latest-articles": ["Career & Recruitment Insights", "Practical career, interview, leadership and international recruitment insights from Emerald Isle Manpower."],
  "emerald-isle-manpower-faq": ["Emerald Isle Manpower FAQ", "Answers about candidate accounts, passwords, CV uploads, profiles and foreign job applications."],
};

const template = await readFile("dist/index.html", "utf8");
for (const [route, [title, description]] of Object.entries(routes)) {
  const html = template
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content=".*?"\s*\/>/, `<meta name="description" content="${description}" />`)
    .replace(/<link rel="canonical" href=".*?"\s*\/>/, `<link rel="canonical" href="https://emeraldislemanpower.com/${route}/" />`);
  const directory = join("dist", route);
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, "index.html"), html);
}
