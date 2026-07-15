import Link from "../../components/ui/Link";
import { PageHero } from "../../components/ui/PageHero";

const values = [
  ["Respect", "We treat every client, candidate and colleague with dignity."],
  ["Diversity", "Broader perspectives create stronger workplaces."],
  ["Teamwork", "One connected team owns the recruitment outcome."],
  ["Empowerment", "Clear information helps people make better decisions."],
  ["Community", "Responsible recruitment should benefit every community."],
];

const services = [
  ["Workforce planning", "Define roles, timelines and the recruitment model that fits your operation."],
  ["Candidate assessment", "Source, screen and assess candidates against skills and culture requirements."],
  ["Mobilisation support", "Coordinate documentation, compliance, travel and deployment with one accountable team."],
];

export default function EmployerPage() {
  return <main id="main">
    <PageHero eyebrow="Client recruitment solutions" title="The right people, ready for what comes next." description="We provide a dependable international talent pipeline, from workforce planning and screening through documentation and deployment." />
    <section className="content-section"><div className="container split-layout"><div className="split-copy"><p className="section-kicker">A proven partner</p><h2>Recruit flexibly and grow confidently</h2><p>Since 1995, Emerald Isle has served employers throughout the GCC, Europe, Africa and Asia under Sri Lanka Bureau of Foreign Employment License No. 1162.</p><p>Our sector knowledge covers hospitality, sales, finance, administration, HR, engineering, construction, automotive and transport.</p><Link className="primary-button" href="/contact/">Discuss your hiring needs</Link></div><div className="route-image-stack"><img src="/assets/employer-service.webp" alt="Employer recruitment meeting" /><img src="/assets/candidate-service.webp" alt="Candidates receiving career guidance" /><div className="metric-card"><strong>One source</strong><span>from brief to deployment</span></div></div></div></section>
    <section className="content-section alt"><div className="container"><div className="section-copy center"><p className="section-kicker">Our values</p><h2>Relationships that last</h2></div><div className="values-grid">{values.map(([title, body], index) => <article className="value-card" key={title}><span className="card-number">0{index + 1}</span><h3>{title}</h3><p>{body}</p></article>)}</div></div></section>
    <section className="content-section"><div className="container"><div className="section-copy"><p className="section-kicker">How we work</p><h2>A complete recruitment service</h2></div><div className="service-grid">{services.map(([title, body], index) => <article className="service-card" key={title}><span className="card-number">0{index + 1}</span><h3>{title}</h3><p>{body}</p></article>)}</div></div></section>
    <section className="cta-band"><div className="container cta-band-inner"><div><h2>Ready to build your next team?</h2><p>Tell us about your roles, locations and target timeline.</p></div><Link className="primary-button inverse-button" href="/contact/">Get in touch</Link></div></section>
  </main>;
}
