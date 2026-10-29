"use client";

import HorizontalDragRail from "../../components/ui/HorizontalDragRail";

const testimonials = [
  { quote: "This 5th intake is one of the most challenging intake recruitment drives in recent memory with the holiday season and simultaneous deployment of 3rd and 4th intake nurses. In spite of the challenges, this recruitment drive has also seen the largest number", country: "SG" },
  { quote: "Always the best support, whenever it is required. A recruitment partner we genuinely value.", country: "SA" },
  { quote: "Professional staff, a welcoming environment and service that makes every requirement feel carefully handled.", country: "SA" },
  { quote: "From the first day, the team took our requirements seriously. I truly appreciate the partnership.", country: "OM" },
  { quote: "A fantastic experience from start to finish. The communication, care and candidate support were excellent.", country: "QA" },
];

const countryNames: Record<string, string> = { SG: "Singapore", SA: "Saudi Arabia", OM: "Oman", QA: "Qatar" };

export default function TestimonialsRail() {
  return <HorizontalDragRail className="hf-testimonial-rail" label="Client testimonials. Drag, swipe, or scroll to browse." loop>
    {testimonials.map((item) => <figure className="hf-quote" key={item.quote}>
      <span className="hf-quote-mark" aria-hidden="true">“</span>
      <div className="hf-quote-rating" role="img" aria-label="Five out of five stars"><span aria-hidden="true">★★★★★</span></div>
      <blockquote>{item.quote}</blockquote>
      <figcaption><img className="hf-country-flag" src={`/assets/flags/${item.country.toLowerCase()}.svg`} alt={countryNames[item.country]} width="42" height="28" loading="lazy" /></figcaption>
    </figure>)}
  </HorizontalDragRail>;
}
