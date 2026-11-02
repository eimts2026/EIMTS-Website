import Image from "next/image";
import ProjectShowcase from "../../components/ui/3d-interactive-timeline";
import type { PublicProject } from "../../lib/projects";
import BootstrapIcon from "../../components/ui/BootstrapIcon";
import { AnimatedText } from "../../components/ui/AnimatedText";

export default function ProjectsPage({ projects }: { projects: PublicProject[] }) {
  const photoCount = projects.reduce(
    (count, project) => count + project.images.length,
    0,
  );

  return (
    <main id="main" className="projects-page">
      <section className="projects-hero" aria-labelledby="projects-hero-title">
        <header className="container projects-hero-top">
          <div>
            <p className="eyebrow">Global recruitment &amp; mobilisation</p>
            <h1 id="projects-hero-title"><AnimatedText text="From Colombo to the world." accent="to the world." /></h1>
          </div>
          <p className="projects-hero-note">
            {projects.length} flagship deployments, {photoCount} photographs.
            Every crew below was recruited, prepared and flown out by Emerald Isle.
          </p>
        </header>
        {projects.length > 0 ? (
          <nav className="projects-hero-wall" aria-label="Browse projects" data-reveal>
            {projects.map((project, index) => (
              <a className="projects-hero-panel" key={project.id} href={`#${project.id}`}>
                <Image
                  src={project.hero.src}
                  alt={`Candidates recruited for ${project.client} in ${project.country}`}
                  fill
                  sizes="(max-width: 860px) 50vw, 25vw"
                  quality={78}
                  preload={index === 0}
                  loading={index === 0 ? undefined : "lazy"}
                  style={{ objectFit: "cover", objectPosition: project.hero.position }}
                />
                <span className="projects-hero-country">{project.country}</span>
                <span className="projects-hero-client">
                  {project.client}
                  <span className="projects-hero-cue" aria-hidden="true">
                    See the photos <BootstrapIcon name="arrow-down" />
                  </span>
                </span>
              </a>
            ))}
          </nav>
        ) : (
          <div className="container projects-empty">
            <p>Our latest project stories are being prepared.</p>
          </div>
        )}
      </section>

      {projects.length > 0 && <ProjectShowcase projects={projects} />}

    </main>
  );
}
