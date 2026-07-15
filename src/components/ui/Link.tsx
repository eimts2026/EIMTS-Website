import type { AnchorHTMLAttributes, ReactNode } from "react";

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode };

export default function Link(props: LinkProps) {
  return <a {...props} />;
}
