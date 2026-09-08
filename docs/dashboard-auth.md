# Staff dashboard authentication

The dashboard uses Supabase email/password Auth with cookie sessions through
`@supabase/ssr`. Copy `dashboard/.env.example` to `dashboard/.env.local` and supply
the project URL and publishable key. Never put a secret/service-role key here.

The proxy refreshes and verifies sessions with `getUser`, preserves refreshed
cookies on redirects, and marks authenticated responses private/no-store.
Every protected page independently verifies identity and the database profile
role. Server actions and Supabase RLS enforce writes separately.

| Role | Access |
| --- | --- |
| Missing or unknown | Access-denied page |
| viewer | Listing pages; only records permitted by existing RLS |
| editor | Vacancy, hero and popup editing; candidate applications |
| admin | Editor access plus project editing |

Login, password reset, and access denied remain reachable without a staff role.
Login returns to a validated local destination. New dashboard pages must call
`requireRouteAccess` before loading data, and new mutations must check roles.

## Supabase Auth configuration

- Disable public signups for this staff-only project; provision staff accounts
  through Supabase Auth and assign roles through a trusted administrator.
- Set the Auth Site URL to the deployed dashboard origin.
- Allow the exact production `/reset-password` URL and
  `http://localhost:3001/reset-password` for development recovery.
- Configure email delivery, server-side rate limits, and password requirements
  in Supabase Auth. The login form's cooldown is only a usability feature.
- The reset flow uses the Supabase browser client's PKCE code exchange; open
  the recovery email in the browser that requested it.

Run `node --test dashboard/tests/auth-policy.test.cjs`, `npm run lint`, and
`npm run build:dashboard`. With dedicated test staff accounts, verify logged-out
deep links, login return destinations, expired sessions, each role, sign-out,
and a real recovery email before deployment.

Live inspection on 2026-09-08 confirmed role-based RLS policies. Supabase's
security advisor also reported existing exposed SECURITY DEFINER functions
and disabled leaked-password protection. These settings were not changed by
the route implementation; review their privileges and Auth configuration.
