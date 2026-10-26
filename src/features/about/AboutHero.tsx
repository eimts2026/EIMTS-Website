import Image from "next/image";
import BootstrapIcon from "../../components/ui/BootstrapIcon";
import "./AboutHero.css";

export default function AboutHero() {
  return (
    <section className="about-editorial" aria-labelledby="about-hero-title">
      <div className="container about-editorial-layout">
        <header className="about-editorial-heading">
          <p className="about-editorial-label">About Emerald Isle <span>Since 1995</span></p>
          <h1 id="about-hero-title">Connecting Sri Lankan talent with global opportunity.</h1>
        </header>
        <p className="about-editorial-intro">
          Get to know the people and purpose behind Emerald Isle.
          We connect people with overseas employment and help employers build capable teams.
        </p>
        <a className="about-editorial-story" href="#about-story">
          Discover our story
          <span aria-hidden="true"><BootstrapIcon name="arrow-down" /></span>
        </a>
        <figure className="about-editorial-portrait">
          <Image
            src="/assets/projects/qatar-compass/team-1.webp"
            alt="A group of candidates holding Emerald Isle folders at the office"
            width={2400}
            height={1350}
            sizes="(max-width: 620px) calc(100vw - 32px), (max-width: 1550px) calc(100vw - 160px), 1390px"
            preload
          />
          <figcaption>Our story starts with people.</figcaption>
        </figure>
      </div>
    </section>
  );
}
