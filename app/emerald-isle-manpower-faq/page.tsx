import Link from "../components/Link";
import { PageHero } from "../components/PageHero";

const faqs = [
  ["How do I log in to my jobseeker account?", "Open the candidate login page and enter the email address and password used during registration."],
  ["How do I reset a forgotten password?", "Use the password recovery option on the candidate login page. Follow the instructions sent to your registered email address."],
  ["How can I change my email address or phone number?", "Sign in to your profile and update your contact details. Contact our support team if you no longer have access to your registered email."],
  ["How do I upload a new CV?", "Sign in, open your profile and replace the existing CV with an up-to-date PDF or Word document."],
  ["How can I make my profile 100% complete?", "Complete every required personal, education and work-experience field, then add a current CV and contact details."],
  ["How do I apply for foreign jobs?", "Browse Foreign Job Vacancies, register or sign in, complete your profile and follow the application instructions for the selected role."],
];

const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) };

export default function FaqPage() {
  return <main id="main">
    <PageHero eyebrow="Candidate support" title="Emerald Isle Manpower FAQ" description="Quick answers to common questions about your account, CV, profile and foreign job applications." />
    <section className="content-section alt"><div className="container"><div className="section-copy center"><p className="section-kicker">Frequently asked questions</p><h2>Get the help you need</h2></div><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></div></section>
    <section className="cta-band"><div className="container cta-band-inner"><div><h2>Still need help?</h2><p>Our team can guide you through the next step.</p></div><div><Link className="primary-button inverse-button" href="/contact/">Contact support</Link></div></div></section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
  </main>;
}
