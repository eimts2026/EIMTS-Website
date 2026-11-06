import type { NextConfig } from "next";

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  {
    protocol: "https",
    hostname: "emeraldislemanpower.com",
    port: "",
    pathname: "/assets/projects/**",
    search: "",
  },
];

try {
  const supabaseUrl = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || "");
  for (const bucket of ["job-media", "project-media"]) {
    remotePatterns?.push({
      protocol: supabaseUrl.protocol === "http:" ? "http" : "https",
      hostname: supabaseUrl.hostname,
      port: supabaseUrl.port,
      pathname: `/storage/v1/object/public/${bucket}/**`,
      search: "",
    });
  }
} catch {
  // Builds without Supabase configured still use the bundled project images.
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  distDir: process.env.EIMTS_BUILD_DIR || ".next",
  trailingSlash: true,
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "Content-Security-Policy", value: [
          "default-src 'self'",
          `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://challenges.cloudflare.com https://va.vercel-scripts.com${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
          "script-src-attr 'none'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob: https:",
          "font-src 'self' data:",
          "connect-src 'self' https: wss:",
          "frame-src https://challenges.cloudflare.com",
          "worker-src 'self' blob:",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'self'",
          "upgrade-insecure-requests",
        ].join("; ") },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
      ],
    }];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 70, 78, 85],
    minimumCacheTTL: 2678400,
    remotePatterns,
  },
  async redirects() {
    return [
      {
        source: "/contact-us/",
        destination: "/contact/",
        permanent: true,
      },
      {
        source: "/contact-us-emerald-isle-manpower/",
        destination: "/contact/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
