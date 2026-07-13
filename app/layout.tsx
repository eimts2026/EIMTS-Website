import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";

export const metadata: Metadata = {
  metadataBase: new URL("https://emeraldislemanpower.com"),
  title: "Emerald Isle Manpower",
  description: "Trusted overseas recruitment and human capital solutions from Sri Lanka.",
  icons: { icon: "/favicon.png", shortcut: "/favicon.png", apple: "/favicon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-GB"><body><a className="skip-link" href="#main">Skip to main content</a><SiteHeader />{children}<SiteFooter /></body></html>;
}
