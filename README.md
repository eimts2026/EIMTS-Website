# Emerald Isle Website — Developer Handover

This repository contains two Next.js applications that share one Supabase project:

- **Public website:** `https://www.emeraldislemanpower.com`
- **Private staff dashboard:** `https://admin.emeraldislemanpower.com`

The site publishes vacancies, employer and contact information, projects, hero slides and promotional popups. Staff manage this content in the dashboard. Candidate applications and CVs are emailed directly; candidate CVs are not saved in the dashboard or Supabase Storage.

## Start here

1. Install Node.js `>=20.9` and npm `>=10`.
2. Clone the repository and run `npm install` from the repository root.
3. Copy `.env.example` to `.env.local` and `dashboard/.env.example` to `dashboard/.env.local`.
4. Request the needed Supabase and Vercel access from the project owner. Do not copy production secrets into Git, tickets, or chat.
5. Start one or both apps using the commands below.

```bash
npm run dev                 # Public website at http://localhost:3000
npm run dev:dashboard       # Staff dashboard at http://localhost:3001
```

Each application loads its own `.env.local`. The public site and dashboard should use the same Supabase project URL and publishable key.

## Repository map

| Path                          | Purpose                                                              |
| ----------------------------- | -------------------------------------------------------------------- |
| `src/app/`                    | Public routes, metadata, sitemap, robots rules and API handlers      |
| `src/features/`               | Public page experiences and domain-specific UI                       |
| `src/components/`             | Shared public components, forms and layout                           |
| `src/lib/`                    | Supabase reads, email delivery, bot checks, caching and shared logic |
| `public/`                     | Public assets, images, fonts and documents                           |
| `dashboard/src/app/`          | Dashboard routes, server actions and login                           |
| `dashboard/src/components/`   | Dashboard forms, navigation and reusable UI                          |
| `dashboard/src/lib/supabase/` | Browser and server Supabase clients                                  |
| `packages/database/`          | Shared TypeScript database contracts                                 |
| `supabase/migrations/`        | Ordered SQL changes, RLS, storage, and database functions            |
| `docs/`                       | Architecture, operations, security and product notes                 |

## Environment configuration

Use the example files as the source of truth for variable names. Common settings include:

### Public app (`.env.local`)

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, and optionally `TURNSTILE_ALLOWED_HOSTNAMES`
- SMTP settings: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and optional `APPLICATIONS_EMAIL_FROM`
- Server-only `SUPABASE_SECRET_KEY` for submission rate limits and inquiry processing
- `CRON_SECRET` for the scheduled inquiry worker
- `PUBLIC_CACHE_REVALIDATION_SECRET` for invalidating the public vacancy cache

### Dashboard (`dashboard/.env.local`)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `PUBLIC_WEBSITE_ORIGIN`
- `PUBLIC_CACHE_REVALIDATION_SECRET` (must match the public app)
- Optional `PROJECT_ASSET_ORIGIN`

Keep secret values server-side. Never prefix a secret or service key with `NEXT_PUBLIC_`. The repository does not need real production values to type-check.

## Local commands

Run from the repository root:

| Command                                      | Purpose                                                                        |
| -------------------------------------------- | ------------------------------------------------------------------------------ |
| `npm run lint`                               | TypeScript checks for both applications                                        |
| `npm run build:web`                          | Production build for the public website                                        |
| `npm run build:dashboard`                    | Production build for the dashboard                                             |
| `npm run build`                              | Build public website, then dashboard                                           |
| `npm run dev`                                | Run public website on port 3000                                                |
| `npm run dev:dashboard`                      | Run dashboard on port 3001                                                     |
| `npm run start`                              | Serve the built public site on port 3000                                       |
| `npm run start --workspace=@eimts/dashboard` | Serve the built dashboard on port 3001                                         |
| `npm run images:projects:webp`               | Convert project images to WebP; inspect script options before removing sources |

`npm run test` currently runs the production build; it is not a separate test suite. The default Next.js Turbopack build may be sensitive to local process/network limits; run the standard CI build before release. The dashboard can be built with `npx next build --webpack` from `dashboard/` when diagnosing a Turbopack-only failure.

## Data and access model

- Supabase provides PostgreSQL, staff authentication and public media storage.
- Dashboard routes and write actions check the signed-in user and their `profiles.role`; roles are `admin`, `editor` and `viewer`.
- Database Row-Level Security (RLS) is the data access boundary. UI hiding and route redirects are additional controls, not substitutes for RLS.
- Public vacancy and project content reads from Supabase with application cache/revalidation behavior.
- Application CVs are validated and emailed to the recruitment team. They are not stored as dashboard application records.
- General contact and employer inquiries enter a protected Supabase outbox, then send via SMTP. The `/api/cron/inquiries` worker retries queued messages and requires `CRON_SECRET`.
- Turnstile and database-backed per-email/IP limits protect public submission flows. Confirm production settings before changing limits or disabling bot protection.

### Supabase migrations

SQL files in `supabase/migrations/` are applied in filename order. Before applying changes to a hosted project:

1. Check the Supabase migration history and current schema.
2. Confirm whether the migration is already applied; do not replay applied migrations.
3. Review security-sensitive changes to RLS, functions, storage policies and grants.
4. Apply through the team's approved migration workflow and verify afterward.

Do not reset, recreate, or modify production data as part of local development. The latest migration in this checkout is `20261030033919_category_menu_matching.sql`; check the directory and hosted history for newer changes before making a release.

## Deployments

The Vercel projects linked in this checkout are:

| App             | Vercel project       | Production domain               |
| --------------- | -------------------- | ------------------------------- |
| Public website  | `eimts-website`      | `www.emeraldislemanpower.com`   |
| Staff dashboard | `eimts-website-dash` | `admin.emeraldislemanpower.com` |

From the repository root:

```bash
vercel --prod                                      # Public website
vercel --prod --project eimts-website-dash         # Dashboard
npm run deploy                                     # Both, sequentially
```

Use `vercel` or `vercel --project eimts-website-dash` for previews. Avoid `vercel dashboard`: Vercel treats `dashboard` as a path argument in this repository. Confirm the selected Vercel team and project before deploying; this workspace's Vercel project access may require team authorization.

After deployment, verify both hostnames, dashboard sign-in and role access, public job updates, inquiry/application delivery, and relevant response headers. A successful build alone does not confirm production configuration or live data behavior.

## Current security handover

On 6 November 2026, a live header review found that the public homepage lacked CSP, frame protection, MIME protection, Referrer-Policy and Permissions-Policy. The admin login exposed wildcard CORS and showed a CDN cache hit alongside `private, no-store`; authenticated content was not demonstrated to have been cached.

Local code changes now configure headers and CSP for both applications, restrict admin CORS to its own origin, and make dashboard responses dynamic with private/no-store cache instructions. The public CSP currently permits inline scripts required by static rendering, so it is a starting restriction rather than a strict nonce-based policy. Production deployment and a post-deploy scan are still required. See [the security remediation report](docs/security-remediation-report-2026-11-06.md) for verification results and release checks.

## Further reading

- [Project structure](docs/PROJECT-STRUCTURE.md)
- [Employer inquiries and delivery](docs/employer-inquiries.md)
- [Performance implementation and operations](docs/performance-implementation-report.md)
- [Design system](docs/DESIGN.md)
- [Product and brand guidance](docs/PRODUCT.md)
- [Migration checklist](docs/MIGRATION-CHECKLIST.md)
- [Project plan](docs/PROJECT_PLAN.md)

## Ownership

This is a private, proprietary repository for Emerald Isle Manpower & Travel Services. Preserve existing database access controls and never commit credentials, applicant data, or production exports.

```text
  ___ ___ __  __ _____ ___   __      ___ ___ ___ ___ ___ _____ ___
 | __|_ _|  \/  |_   _/ __|  \ \    / / __| _ ) __|_ _|_   _| __|
 | _| | || |\/| | | | \__ \   \ \/\/ /| _|| _ \__ \| |  | | | _|
 |___|___|_|  |_| |_| |___/    \_/\_/ |___|___/___/___| |_| |___|

 =================================================================
  EMERALD ISLE MANPOWER & TRAVEL SERVICES (EIMTS)
  Developed & Maintained by Gaveen Perera
 =================================================================
```
