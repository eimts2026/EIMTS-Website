type EmployerInquiryFormProps = {
  headingId?: string;
};

export function EmployerInquiryForm({ headingId = "employer-inquiry-title" }: EmployerInquiryFormProps) {
  return <form className="employer-inquiry-form" action="mailto:info@emeraldisle.lk" method="post" encType="text/plain">
    <div className="employer-inquiry-heading">
      <p className="section-kicker">Send an inquiry</p>
      <h2 id={headingId}>Tell us about your hiring needs.</h2>
      <p>Share the essentials and our employer team will help shape the next step.</p>
    </div>
    <div className="employer-form-row">
      <label><span>Your name</span><input required name="name" autoComplete="name" placeholder="Full name" /></label>
      <label><span>Work email</span><input required type="email" name="email" autoComplete="email" placeholder="name@company.com" /></label>
    </div>
    <div className="employer-form-row">
      <label><span>Company</span><input required name="company" autoComplete="organization" placeholder="Company name" /></label>
      <label><span>Company website</span><input name="website" type="url" autoComplete="url" inputMode="url" placeholder="https://company.com" /></label>
    </div>
    <div className="employer-form-row">
      <label><span>Phone</span><input name="phone" type="tel" autoComplete="tel" placeholder="+94" /></label>
      <label><span>Roles or workforce requirement</span><input required name="subject" placeholder="e.g. 20 hospitality staff for Dubai" /></label>
    </div>
    <label><span>How can we help?</span><textarea required name="message" rows={5} placeholder="Locations, target dates, roles and anything else we should know." /></label>
    <button className="employer-inquiry-submit" type="submit">Send inquiry <span aria-hidden="true">→</span></button>
  </form>;
}