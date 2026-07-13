import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../components/PageHero";

export const metadata: Metadata = {
  title: "Career & Recruitment Insights",
  description: "Practical career, interview, leadership and international recruitment insights from Emerald Isle Manpower.",
  alternates: { canonical: "/insightful-and-engaging-blog-posts-discover-our-latest-articles/" },
};

const posts = [
  ["Interview", "How to Face an Online Interview Like a Professional", "Prepare your space, technology and examples so you can communicate with confidence."],
  ["Career", "How to Stand Out in the Competitive Job Market", "Build a focused profile that makes your experience and value easy to understand."],
  ["Recruitment", "How Gen Z Is Redefining the Recruitment Landscape", "What emerging expectations mean for employers, teams and candidate communication."],
  ["Global jobs", "How Global Politics Shapes the Gulf Job Market", "Understand how changing policy and investment can influence overseas opportunities."],
  ["Growth", "Mentorship for Personal and Professional Growth", "Use structured guidance and reflection to accelerate practical learning."],
  ["Leadership", "Emotional Intelligence in Management", "Lead with awareness, empathy and calm communication during demanding moments."],
  ["Productivity", "Strategies to Boost Consistency and Productivity", "Simple systems that help turn good intentions into dependable progress."],
  ["Interview", "Interview Tips to Land Your Dream Job", "Answer clearly, show relevant evidence and leave a memorable professional impression."],
  ["Career", "10 Strategies to Realign Your Career Goals", "Review where you are, define what matters and convert ambition into practical next steps."],
];

export default function BlogPage() {
  return <main id="main">
    <PageHero eyebrow="Ideas for ambitious careers" title="Blogs & Insights" description="Practical guidance for job seekers, employers and professionals navigating a changing world of work." />
    <section className="content-section alt"><div className="container"><div className="blog-grid">{posts.map(([topic, title, body]) => <article className="blog-card" key={title}><span className="blog-topic">{topic}</span><h2>{title}</h2><p>{body}</p><Link href="/contact/">Ask our team →</Link></article>)}</div></div></section>
  </main>;
}
