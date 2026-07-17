import { PageHero } from "../../components/ui/PageHero";

const offices = [
  ["Head Office", "198 Galle Road, Dehiwala–Mount Lavinia 10370, Colombo"],
  ["Kurunegala", "No. 72/1, 2nd Floor, Colombo Road, Kurunegala"],
  ["Batticaloa", "186 1/1, Fathima Building, Trinco Road, Batticaloa"],
  ["Kandy", "420/1, Kehelwala, Kiribathkumbura, Kandy"],
  ["Nepal", "Old Baneshwor-10, Kathmandu, Nepal"],
  ["United Arab Emirates", "Sheikh Khalifa Street, Ajman, United Arab Emirates"],
];

export default function ContactPage() {
  return <main id="main">
    <PageHero eyebrow="We are here to help" title="Tell us where you want to go next." description="Reach our recruitment and employer teams. Choose the nearest office or send us a message." />
    <section className="content-section alt"><div className="container contact-details">
      <div><p className="section-kicker">Our offices</p><h2>Speak with a local team</h2><div className="contact-panel">{offices.map(([name, address]) => <article className="contact-card" key={name}><h2>{name}</h2><p>{address}</p><a href="tel:+94114335444">+94 11 433 5444</a></article>)}</div></div>
      <form className="contact-route-form" action="mailto:info@emeraldisle.lk" method="post" encType="text/plain"><div><p className="section-kicker">Send an inquiry</p><h2>How can we help?</h2></div><div className="form-row"><label><span>Name</span><input required name="name" autoComplete="name" /></label><label><span>Email</span><input required type="email" name="email" autoComplete="email" /></label></div><div className="form-row"><label><span>Subject</span><input required name="subject" /></label><label><span>Phone</span><input name="phone" type="tel" autoComplete="tel" /></label></div><label><span>Comment</span><textarea required name="comment" rows={7} /></label><button className="primary-button" type="submit">Send message</button><p>Or email <a href="mailto:info@emeraldisle.lk">info@emeraldisle.lk</a></p></form>
    </div></section>
  </main>;
}
