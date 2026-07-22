import type { ComponentType } from "react";
import Home from "../features/home/HomePage";
import AboutPage from "../features/about/AboutPage";
import EmployerPage from "../features/employers/EmployerPage";
import ContactPage from "../features/contact/ContactPage";
import ProjectsPage from "../features/projects/ProjectsPage";
import FaqPage from "../features/faq/FaqPage";
import JobsPage from "../features/jobs/JobsPage";
import BlogPage from "../features/blog/BlogPage";
import { SiteFooter } from "../components/layout/SiteFooter";
import { SiteHeader } from "../components/layout/SiteHeader";
import { FloatingSocialLinks } from "../components/layout/FloatingSocialLinks";
import { ScrollToTop } from "../components/layout/ScrollToTop";

const routes: Record<string, ComponentType> = {
  "/": Home,
  "/about-us-emerald-isle-manpower": AboutPage,
  "/client-recruitment-solutions": EmployerPage,
  "/contact": ContactPage,
  "/projects": ProjectsPage,
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
    return <><SiteHeader /><main id="main" className="content-section"><div className="container section-copy center"><p className="section-kicker">404</p><h1>Page not found</h1><p>The page you requested does not exist.</p><a className="primary-button" href="/">Return home</a></div></main><SiteFooter /><FloatingSocialLinks /><ScrollToTop /></>;
  }

  return <><a className="skip-link" href="#main">Skip to main content</a><SiteHeader /><Page /><SiteFooter /><FloatingSocialLinks /><ScrollToTop /></>;
}
