# Website and Admin Dashboard Security Remediation

**Prepared for:** Emerald Isle leadership  
**Date:** 6 November 2026  
**Status:** Code changes completed locally; production deployment and live recheck remain pending.

## Executive summary

The public website was missing five standard browser security headers. The admin dashboard had most of those headers but lacked a Content Security Policy (CSP). A public admin login response also showed an open CORS header and a CDN cache hit despite a `no-store` instruction.

The code now adds the missing public headers, introduces CSP on both applications, restricts the dashboard's CORS response to its own origin, and prevents the dashboard's HTML from being statically prerendered or stored by Vercel's CDN. These measures reduce exposure, but they do not prove that the live sites are fixed until the changes are deployed and measured again.

## What changed

| Area | Change | Practical effect |
| --- | --- | --- |
| Public website | Added CSP, frame, MIME, referrer, and permissions headers | Limits where scripts and other resources can load from and strengthens browser handling of pages. |
| Public website | Disabled the `X-Powered-By` response header | Removes an unnecessary framework identifier. |
| Admin dashboard | Added a per-request CSP nonce | Allows authorized scripts while blocking unapproved scripts on dynamically rendered pages. |
| Admin dashboard | Made the root layout request-rendered | Prevents the login page from being served as a reusable static HTML artifact. |
| Admin dashboard | Added explicit `private, no-store` and Vercel CDN `no-store` headers in the request proxy | Directs browsers and the CDN not to store dashboard HTML and redirects. |
| Admin dashboard | Replaced the wildcard CORS response with the dashboard's exact origin | Removes the observed `*` value from application responses. |
| Both apps | Disabled the `X-Powered-By` response header | Reduces unnecessary platform detail in responses. |

## Remaining limits and decisions

- The public website CSP still permits inline scripts because the current statically rendered Next.js pages depend on them. It restricts external script origins and blocks inline event-handler attributes, but it is not a full XSS containment policy. A stricter nonce-based public CSP would require changing rendering and performance behavior; test that separately before rollout.
- HSTS was already present on both live hosts with a two-year duration. No change was needed. Extending it to all subdomains requires an inventory of every subdomain first.
- The admin cache observation was from an anonymous login page. It did not establish that private staff content was cached. After deployment, inspect an authenticated page and its framework data responses using a test staff account.
- The current code already applies Turnstile and database-backed limits to public submissions: three per email and, when a Vercel forwarded IP is available, fifteen per IP in ten minutes. This was source-reviewed, not confirmed against the live database. Supabase Auth rate-limit settings and Vercel firewall rules could not be read with the available team access.
- Open ports, TLS protocol versions and ciphers, certificate chain, and authenticated penetration tests were outside the available network access. No claim of a complete network penetration test is made.

## Verification performed

- TypeScript checks passed for the public application and dashboard.
- `git diff --check` passed.
- The public production build passed when run with normal network and process access.
- The dashboard production build passed with Next.js's documented `--webpack` option. Its route output marks all dashboard routes, including `/login`, as dynamically rendered.
- The default dashboard Turbopack build encountered a local process failure while processing CSS. A restricted first attempt also could not fetch the existing Google Inter font. These are build-environment limitations; CI should still run the default build before deployment.
- A local production server started, but the restricted shell could not connect to its loopback port, so local HTTP response headers were not measured.
- The Vercel connector returned a team authorization error, so deployment and a post-deployment live header scan could not be completed here.

## Release checklist

1. Build both applications in the normal CI environment.
2. Deploy the public site and dashboard.
3. Rescan the public homepage, public API, admin login, and an authenticated admin page. Confirm the new headers and that legitimate scripts, images, uploads, and forms work.
4. Confirm authenticated responses show `private, no-store`, `Vercel-CDN-Cache-Control: no-store`, and no CDN cache hit.
5. Review Supabase Auth rate-limit settings and Vercel firewall rules in the project dashboards.

## Evidence reviewed

- [Public homepage header scan](https://securityheaders.com/?q=https%3A%2F%2Fwww.emeraldislemanpower.com%2F&followRedirects=on)
- [Admin login header scan](https://securityheaders.com/?q=https%3A%2F%2Fadmin.emeraldislemanpower.com%2Flogin&followRedirects=on)
- [Unauthenticated admin root scan](https://securityheaders.com/?q=https%3A%2F%2Fadmin.emeraldislemanpower.com%2F&followRedirects=off)
- Local `next.config.ts`, `dashboard/next.config.ts`, `dashboard/src/proxy.ts`, and `dashboard/src/app/layout.tsx`
