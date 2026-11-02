import TypewriterHeading from "../home/TypewriterHeading";
import AboutProof from "./AboutProof";
import BootstrapIcon from "../../components/ui/BootstrapIcon";
import "./AboutHero.css";

export default function AboutHero() {
  return (
    <section className="about-editorial" aria-labelledby="about-hero-title">
      <div className="container about-editorial-layout">
        <header className="about-editorial-heading">
          <p className="about-editorial-label">About Emerald Isle</p>
          <TypewriterHeading id="about-hero-title" text="Three decades connecting Sri Lankan talent with global opportunity." accent="global opportunity." skeleton />
        </header>
        <p className="about-editorial-intro">
          Since 1995, we have connected Sri Lankan talent with overseas employment and helped employers build capable teams.
        </p>
        <nav className="about-editorial-actions" aria-label="About Emerald Isle links">
          <a className="register-pill about-editorial-story" href="#about-story"><span className="register-pill__icon-wrapper" aria-hidden="true"><BootstrapIcon name="arrow-down" className="register-pill__icon-svg" /><BootstrapIcon name="arrow-down" className="register-pill__icon-svg register-pill__icon-svg--copy" /></span>Our story</a>
        </nav>
        <AboutProof />
      </div>
    </section>
  );
}
