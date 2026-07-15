type PageHeroProps = { eyebrow: string; title: string; description: string };

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return <section className="page-hero page-hero-animated">
    <div className="page-hero-atmosphere" aria-hidden="true"><span /><span /><span /></div>
    <div className="page-hero-orb" aria-hidden="true" />
    <div className="container page-hero-content">
      <span className="page-hero-line" aria-hidden="true" />
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  </section>;
}