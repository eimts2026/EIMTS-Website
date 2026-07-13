import type { ComponentType } from "react";
import Home from "../app/page";
import AboutPage from "../app/about-us-emerald-isle-manpower/page";
import EmployerPage from "../app/client-recruitment-solutions/page";
import ContactPage from "../app/contact/page";
import EducationPage from "../app/education-page/page";
import FaqPage from "../app/emerald-isle-manpower-faq/page";
import JobsPage from "../app/foreign-job-vacancies/page";
import BlogPage from "../app/insightful-and-engaging-blog-posts-discover-our-latest-articles/page";
import { SiteFooter } from "../app/components/SiteFooter";
import { SiteHeader } from "../app/components/SiteHeader";

const routes: Record<string, ComponentType> = {
  "/": Home,
  "/about-us-emerald-isle-manpower": AboutPage,
  "/client-recruitment-solutions": EmployerPage,
  "/contact": ContactPage,
  "/education-page": EducationPage,
  "/emerald-isle-manpower-faq": FaqPage,
  "/foreign-job-vacancies": JobsPage,
  "/insightful-and-engaging-blog-posts-discover-our-latest-articles": BlogPage,
};

function normalizedPath() {
  const path = window.location.pathname.replace(/\/+$/, "");
  return path || "/";
}

export function App() {
  const Page = routes[normalizedPath()];

  if (!Page) {
    return <><SiteHeader /><main id="main" className="content-section"><div className="container section-copy center"><p className="section-kicker">404</p><h1>Page not found</h1><p>The page you requested does not exist.</p><a className="primary-button" href="/">Return home</a></div></main><SiteFooter /></>;
  }

  return <><a className="skip-link" href="#main">Skip to main content</a><SiteHeader /><Page /><SiteFooter /></>;
}
