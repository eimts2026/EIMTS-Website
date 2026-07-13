import { PageHero } from "../components/PageHero";

const posts = [
  { topic: "Interview", date: "November 25, 2024", title: "How to Face an Online Interview Like a Professional", body: "Prepare your space, technology and examples so you can communicate with confidence.", image: "/assets/blog-online-interview.jpg", alt: "Professional preparing for an online job interview", url: "https://emeraldislemanpower.com/how-to-face-an-online-interview-like-a-pro-tips-for-success/" },
  { topic: "Career Advice", date: "November 11, 2024", title: "How to Stand Out in the Competitive Job Market", body: "Build a focused profile that makes your experience and value easy to understand.", image: "/assets/blog-job-market.jpg", alt: "Career candidates navigating a competitive job market", url: "https://emeraldislemanpower.com/how-to-stand-out-in-the-competitive-job-market/" },
  { topic: "Recruitment", date: "October 23, 2024", title: "How Gen Z Is Redefining the Recruitment Landscape", body: "What emerging expectations mean for employers, teams and candidate communication.", image: "/assets/blog-job-market.jpg", alt: "Modern recruitment and changing workforce expectations", url: "https://emeraldislemanpower.com/how-gen-z-is-redefining-the-recruitment-landscape/" },
  { topic: "Career Advice", date: "October 16, 2024", title: "How Global Politics Shapes the Gulf Job Market", body: "Understand how changing policy and investment can influence overseas opportunities.", image: "/assets/blog-gulf-market.jpg", alt: "Professional reviewing trends in the Gulf job market", url: "https://emeraldislemanpower.com/how-global-politics-shapes-the-gulf-job-market/" },
  { topic: "Growth", date: "October 10, 2024", title: "Mentorship for Personal and Professional Growth", body: "Use structured guidance and reflection to accelerate practical learning.", image: "/assets/blog-productivity.jpg", alt: "Mentorship and professional development planning", url: "https://emeraldislemanpower.com/mentorship-programs-for-personal-professional-growth/" },
  { topic: "Leadership", date: "October 4, 2024", title: "Emotional Intelligence in Management", body: "Lead with awareness, empathy and calm communication during demanding moments.", image: "/assets/blog-emotional-intelligence.webp", alt: "Emotional intelligence skills for managers and teams", url: "https://emeraldislemanpower.com/how-emotional-intelligence-in-management-strengthens-teams/" },
  { topic: "Productivity", date: "September 19, 2024", title: "Strategies to Boost Consistency and Productivity", body: "Simple systems that help turn good intentions into dependable progress.", image: "/assets/blog-productivity.jpg", alt: "Workplace productivity and consistency strategies", url: "https://emeraldislemanpower.com/unique-strategies-to-boost-consistency-and-productivity-at-work/" },
  { topic: "Interview", date: "September 9, 2024", title: "Interview Tips to Land Your Dream Job", body: "Answer clearly, show relevant evidence and leave a memorable professional impression.", image: "/assets/blog-online-interview.jpg", alt: "Candidate preparing to succeed at a job interview", url: "https://emeraldislemanpower.com/effective-interview-tips-to-land-your-dream-job/" },
  { topic: "Career", date: "September 2, 2024", title: "10 Strategies to Realign Your Career Goals", body: "Review where you are, define what matters and convert ambition into practical next steps.", image: "/assets/blog-career-goals.webp", alt: "Professional reviewing and realigning career goals", url: "https://emeraldislemanpower.com/10-strategies-to-realign-your-career-goals-regularly/" },
];

export default function BlogPage() {
  return <main id="main">
    <PageHero eyebrow="Ideas for ambitious careers" title="Blogs & Insights" description="Practical guidance for job seekers, employers and professionals navigating a changing world of work." />
    <section className="content-section alt"><div className="container"><div className="blog-grid">{posts.map((post) => <article className="blog-card" key={post.title}>
      <a className="blog-image-link" href={post.url} target="_blank" rel="noreferrer" aria-label={`Read ${post.title}`}><img className="blog-card-image" src={post.image} width="1000" height="580" loading="lazy" alt={post.alt} /></a>
      <div className="blog-card-content"><div className="blog-meta"><span>{post.date}</span><span>{post.topic}</span><span>0 Comments</span></div><h2>{post.title}</h2><p>{post.body}</p><a href={post.url} target="_blank" rel="noreferrer">Read more →</a></div>
    </article>)}</div></div></section>
  </main>;
}
