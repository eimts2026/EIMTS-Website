import Image from "next/image";
import "./BlogPage.css";
import Link from "next/link";
import { articles } from "@/lib/articles";
import { siteName, siteUrl } from "@/lib/site";

export default function BlogPage() {
  const featured = articles.find(
    (article) => article.slug === "how-recruitment-agencies-simplify-overseas-recruitment",
  ) ?? articles[0];
  const latestArticles = articles.filter((article) => article.slug !== featured.slug);
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `Career and recruitment insights from ${siteName}`,
    url: `${siteUrl}/insightful-and-engaging-blog-posts-discover-our-latest-articles/`,
    blogPost: articles.map((article) => ({
      "@type": "BlogPosting",
      headline: article.title,
      datePublished: article.publishedDate,
      url: `${siteUrl}/${article.slug}/`,
      image: `${siteUrl}${article.image}`,
      description: article.excerpt,
      author: {
        "@type": article.author === "Emerald Isle Editorial Team" ? "Organization" : "Person",
        name: article.author,
      },
    })),
  };

  return (
    <main id="main" className="journal-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="journal-hero" aria-labelledby="journal-title">

        <div className="container journal-hero-grid">
          <div className="journal-hero-copy">
            <p className="eyebrow">Career and recruitment insights</p>
            <h1 id="journal-title">Navigate the world of work with clarity.</h1>
            <p>Practical guidance for candidates, employers and professionals building careers across borders.</p><a className="journal-browse" href="#latest-journal-title">Explore all articles <span aria-hidden="true">↓</span></a>
          </div>

          <Link className="journal-feature" href={`/${featured.slug}/`} aria-label={`Read ${featured.title}`}>
            <span className="journal-feature-image"><Image
              src={featured.image}
              alt={featured.imageAlt}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 55vw"
            />
            </span>
            <span className="journal-feature-content"><span className="journal-feature-label">Featured insight</span>
              <span className="journal-feature-meta">
                <time dateTime={featured.publishedDate}>{featured.displayDate}</time>
                <span aria-hidden="true">/</span>
                <span>{featured.topic}</span>
                <span aria-hidden="true">/</span>
                <span>{featured.readTime}</span>
              </span>
              <h2 className="journal-feature-title">{featured.title}</h2>
              <span className="journal-feature-excerpt">{featured.excerpt}</span><span className="journal-author">By {featured.author}</span><span className="journal-feature-link">Read the field note <span aria-hidden="true">{"↗"}</span></span>
            </span>
          </Link>
        </div>
      </section>

      <section className="journal-index" aria-labelledby="latest-journal-title">
        <div className="container journal-index-heading">
          <div>
            <p className="eyebrow">Latest thinking</p>
            <h2 id="latest-journal-title">Ideas you can put to work.</h2>
          </div>
          <p>{articles.length} articles on interviews, careers, leadership and international recruitment.</p>
        </div>

        <div className="container journal-grid">
          {latestArticles.map((article) => (
            <article className="journal-card" key={article.slug}>
              <Link
                className="journal-card-link"
                href={`/${article.slug}/`}
                aria-label={`Read more: ${article.title}`}
              >
                <span className="journal-card-image">
                  <Image
                    src={article.image}
                    alt=""
                    fill
                    sizes="(max-width: 620px) 100vw, (max-width: 900px) 50vw, 33vw"
                  />
                </span>
                <span className="journal-card-body">
                  <span className="journal-card-meta">
                  <time dateTime={article.publishedDate}>{article.displayDate}</time>
                  <span>{article.topic}</span>
                  <span>{article.readTime}</span>
                  </span>
                  <h2 className="journal-card-title">{article.title}</h2>
                  <span className="journal-card-excerpt">{article.excerpt}</span>
                  <span className="journal-author">By {article.author}</span><span className="journal-card-read">Read more <span aria-hidden="true">{"↗"}</span></span>
                </span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
