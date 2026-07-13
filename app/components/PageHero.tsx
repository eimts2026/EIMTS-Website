type PageHeroProps = { eyebrow: string; title: string; description: string };

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return <section className="page-hero"><div className="page-hero-orb" aria-hidden="true" /><div className="container page-hero-content"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div></section>;
}
