import Link from "../../components/ui/Link";
import { PageHero } from "../../components/ui/PageHero";
import { Timeline, type TimelineEntry } from "../../components/ui/Timeline";

const timelineData: TimelineEntry[] = [
  {
    title: "2022",
    content: <div className="project-timeline-gallery">
      <img src="/assets/candidate-service.webp" alt="Candidate consultation at Emerald Isle Manpower" width="1600" height="1067" loading="lazy" />
      <img src="/assets/employer-service.webp" alt="Emerald Isle employer recruitment service" width="1600" height="1067" loading="lazy" />
    </div>,
  },
  {
    title: "2023",
    content: <div className="project-timeline-gallery">
      <img src="/assets/hero-employer-partnership.webp" alt="International employer partnership project" width="1600" height="1067" loading="lazy" />
      <img src="/assets/employer-handshake.png" alt="Employer partnership meeting" width="1664" height="936" loading="lazy" />
    </div>,
  },
  {
    title: "2024",
    content: <div className="project-timeline-gallery">
      <img src="/assets/emerald-journey-hero.webp" alt="Emerald Isle international recruitment journey" width="1600" height="1067" loading="lazy" />
      <img src="/assets/slbfe-license-reference.png" alt="Emerald Isle SLBFE recruitment licence" width="1603" height="637" loading="lazy" />
    </div>,
  },  {
    title: "2025",
    content: <div className="project-timeline-gallery">
      <img src="/assets/about-awards/award-hero-1.webp" alt="Emerald Isle project recognition" width="1600" height="1067" loading="lazy" />
      <img src="/assets/about-awards/award-hero-2.webp" alt="Emerald Isle team achievement" width="1600" height="1067" loading="lazy" />
    </div>,
  },
  {
    title: "2026",
    content: <div className="project-timeline-gallery">
      <img src="/assets/about-awards/award-hero-3.webp" alt="Emerald Isle project showcase" width="1600" height="1067" loading="lazy" />
      <img src="/assets/about-awards/employer-brand-award.webp" alt="Emerald Isle employer brand recognition" width="1600" height="1067" loading="lazy" />
    </div>,
  },
];

export default function ProjectsPage() {
  return <main id="main" className="projects-page">
    <PageHero
      eyebrow="Projects"
      title="Workforce projects, delivered responsibly."
      description="From focused recruitment campaigns to large-scale workforce mobilisation, explore the work delivered by Emerald Isle."
    />

    <Timeline data={timelineData} />

    <section className="cta-band" aria-labelledby="projects-cta-title">
      <div className="container cta-band-inner">
        <div><h2 id="projects-cta-title">Have a workforce project in mind?</h2><p>Tell us what you need, where you need it and when your team should be ready.</p></div>
        <Link className="primary-button inverse-button" href="/contact/">Start a conversation</Link>
      </div>
    </section>
  </main>;
}