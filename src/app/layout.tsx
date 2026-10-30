import type { Metadata } from "next";
import Script from "next/script";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { FloatingSocialLinks } from "@/components/layout/FloatingSocialLinks";
import { ScrollReveal } from "@/components/layout/ScrollReveal";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import "lenis/dist/lenis.css";
import { siteName, siteUrl } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "@/styles/globals.css";
import "@/styles/employer-tailwind.css";
import "@/styles/ui-refinements.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Emerald Isle Manpower – Top Recruitment Agency in Sri Lanka",
    template: `%s | ${siteName}`,
  },
  description:
    "Explore foreign job vacancies with Emerald Isle Manpower, a recruitment agency in Sri Lanka supporting candidates and employers from application to deployment.",
  applicationName: siteName,
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/fonts/raleway/raleway-latin-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GF4XKVLTXY"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-GF4XKVLTXY');
          `}
        </Script>
      </head>
      <body>
        {/* Runs before first paint so reveal targets start hidden instead of
            flashing visible then re-animating. Without JS it never runs and
            every reveal rule stays inert (see globals.css ei-motion-ready). */}
        <Script
          id="ei-motion-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html:
              "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('ei-motion-ready')}catch(e){}",
          }}
        />
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": siteUrl + "/#organization",
          name: siteName,
          url: siteUrl + "/",
          logo: siteUrl + "/assets/emerald-isle-logo.webp",
          telephone: "+94114335444",
          sameAs: [
            "https://www.instagram.com/emeraldforeignjobs_/",
            "https://www.facebook.com/EmeraldIsleRecruitment",
            "https://www.youtube.com/@EmeraldIsleManpower",
            "https://lk.linkedin.com/company/emeraldislerecruitment",
          ],
          address: { "@type": "PostalAddress", streetAddress: "198 Galle Road", addressLocality: "Dehiwala-Mount Lavinia", postalCode: "10370", addressCountry: "LK" },
        }).replace(/</g, "\\u003c") }} />
        <SmoothScroll />
        <SiteHeader />
        {children}
        <SiteFooter />
        <FloatingSocialLinks />
        <ScrollReveal />
        <ScrollToTop />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
