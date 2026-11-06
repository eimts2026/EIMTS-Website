import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { connection } from "next/server";
import { IdleSessionGuard } from "@/components/IdleSessionGuard";
import "./styles.css";


const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Emerald Isle Content Desk",
  description: "Private vacancy, hero, popup and project management for Emerald Isle staff.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await connection();
  const nonce = (await headers()).get("x-nonce") || undefined;
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <script
          nonce={nonce}
          // Applies the stored theme before first paint to avoid a flash.
          dangerouslySetInnerHTML={{
            __html:
              'try{if(localStorage.getItem("ei-dashboard-theme")==="light")document.documentElement.dataset.theme="light"}catch(e){}',
          }}
        />

        <IdleSessionGuard />
        {children}
        <footer className="dashboard-footer"><span>All rights reserved — EmeraldIsle Man Power</span><span>Crafted with <span className="footer-rgb-heart" aria-label="love">❤️</span></span></footer>
      </body>
    </html>
  );
}
