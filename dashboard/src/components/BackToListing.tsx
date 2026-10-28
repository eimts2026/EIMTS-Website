import Link from "next/link";

export function BackToListing({ href, label }: { href: string; label: string }) {
  return <Link className="back-to-listing" href={href}><span aria-hidden="true">←</span> Back to {label}</Link>;
}
