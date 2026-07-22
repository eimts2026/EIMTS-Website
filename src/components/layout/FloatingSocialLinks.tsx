type SocialName = "facebook" | "youtube" | "linkedin" | "whatsapp";

function SocialIcon({ name }: { name: SocialName }) {
  if (name === "facebook") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8.5V6.8c0-.8.5-1 1-1h2.5V2.1L14.1 2C10.8 2 9 4 9 6.5v2H6v4h3V22h5v-9.5h3.3l.6-4H14Z" /></svg>;
  if (name === "youtube") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" /></svg>;
  if (name === "linkedin") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.3 7.3H1.7V22h3.6V7.3ZM3.5 2A2.1 2.1 0 1 0 3.5 6.2 2.1 2.1 0 0 0 3.5 2ZM22 13.6c0-4.4-2.4-6.5-5.6-6.5a4.8 4.8 0 0 0-4.3 2.4h-.1V7.3H8.6V22h3.6v-7.3c0-1.9.4-3.8 2.8-3.8 2.4 0 2.4 2.2 2.4 3.9V22H22v-8.4Z" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5A10.5 10.5 0 0 0 3.3 15.7L2 22l6.5-1.7A10.5 10.5 0 1 0 20.5 3.5ZM12 20.2a8.1 8.1 0 0 1-3.9-1l-.3-.2-3.5.9.9-3.4-.2-.3A8.1 8.1 0 1 1 12 20.2Zm4.4-6c-.2-.1-1.4-.7-1.6-.7-.2-.1-.4-.1-.5.1s-.6.7-.8.9c-.1.2-.3.2-.5.1-1.3-.7-2.1-1.2-2.9-2.8-.2-.2 0-.4.1-.5l.4-.5c.1-.1.1-.3.2-.4 0-.2-.1-.3-.1-.4l-.7-1.6c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.7 2.7 4.2 3.7.6.3 1 .4 1.4.5.6.2 1.1.2 1.5.1.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.2-1.2 0-.1-.2-.2-.4-.3Z" /></svg>;
}

const socials: Array<{ name: SocialName; label: string; href: string }> = [
  { name: "youtube", label: "YouTube", href: "https://www.youtube.com/@EmeraldIsleManpower" },
  { name: "facebook", label: "Facebook", href: "https://www.facebook.com/EmeraldIsleRecruitment" },
  { name: "linkedin", label: "LinkedIn", href: "https://lk.linkedin.com/company/emeraldislerecruitment" },
  { name: "whatsapp", label: "WhatsApp", href: "https://api.whatsapp.com/send?phone=94773876467" },
];

export function FloatingSocialLinks() {
  return <aside className="floating-social-links" aria-label="Follow Emerald Isle">
    {socials.map((social) => <a className={`floating-social-links__link floating-social-links__link--${social.name}`} href={social.href} aria-label={`Follow Emerald Isle on ${social.label}`} title={social.label} target="_blank" rel="noreferrer" key={social.name}><SocialIcon name={social.name} /></a>)}
  </aside>;
}
