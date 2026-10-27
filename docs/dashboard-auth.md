# Staff dashboard authentication

The dashboard uses Supabase email/password Auth with cookie sessions through
`@supabase/ssr`. Copy `dashboard/.env.example` to `dashboard/.env.local` and supply
the project URL and publishable key. Never put a secret/service-role key here.

The proxy refreshes and verifies sessions with `getUser`, preserves refreshed
cookies on redirects, and marks authenticated responses private/no-store.
Every protected page independently verifies identity and the database profile
role. Server actions and Supabase RLS enforce writes separately.

The `authenticated` database role must retain `EXECUTE` on `public.is_staff()`
and `public.is_admin()`: RLS evaluates these helpers as the caller. Revoking
these grants breaks the profile lookup with `permission denied for function
is_staff`, even for an admin. Migration `20260930091329` restores these grants.
The helpers take no arguments and return only the current caller's membership,
using `auth.uid()` and protected profiles; anonymous execution remains revoked.
Supabase's signed-in SECURITY DEFINER advisor warnings for these two helpers
are intentional with this design. Do not silence them by revoking the grants;
moving the helpers to a non-exposed schema requires updating dependent policies.

| Role | Access |
| --- | --- |
| Missing or unknown | Access-denied page |
| viewer | Listing pages; only records permitted by existing RLS |
| editor | Vacancy, hero and popup editing |
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

## Password recovery: verified findings and operation (2026-10-15)

Live Auth logs showed `/recover` returning `429: email rate limit exceeded`. Live settings had custom SMTP disabled, no redirect allowlist, and Site URL pointing to `/login`. The website's local SMTP username is blank; its SMTP verification failed with EAUTH. Website Nodemailer environment variables do not configure Supabase Auth mail delivery.

The production Site URL is now `https://admin.emeraldislemanpower.com` and the allowed recovery URL is `https://admin.emeraldislemanpower.com/reset-password` (saved and verified in Supabase). Local recovery URLs must be explicitly added only when needed for development; no wildcard redirect was added.

### Finish Gmail / Google Workspace delivery

The user chose Gmail with an App Password. In Supabase > Authentication > Emails > SMTP Settings:

- Host: `smtp.gmail.com`; port: `465`.
- Sender email and SMTP username: the full Google/Workspace mailbox address. Use the same mailbox for both unless an authorised sender alias is configured.
- Sender name: Emerald Isle Staff Dashboard.
- Password: a Google App Password, entered directly by the account owner. Never paste it into chat, issues or source code. Google requires 2-Step Verification for App Passwords; some Workspace organisations restrict their use.
- Keep the minimum per-user interval at 60 seconds. Supabase's UI states enabling custom SMTP raises the project email quota to 30 per hour. Do not disable rate limiting to hide delivery errors.
- Save, then verify that custom SMTP remains enabled after refreshing. Check Auth logs for failed SMTP authentication, SMTP provider rejection or recipient restrictions if delivery still fails.

The agent prepared the host/port/name but did not enter credentials or save SMTP. SMTP configuration remains a user-owned step until confirmed. See [Supabase SMTP documentation](https://supabase.com/docs/guides/auth/auth-smtp) and [Google App Passwords](https://support.google.com/accounts/answer/185833).

### Normal staff workflow

1. On the dashboard login page choose Reset it, enter the staff email, and request one link.
2. A 60-second UI resend cooldown prevents accidental repeated requests. A provider quota error says the email service needs administrator attention; this cooldown is not a guarantee that a project quota resets in a minute.
3. The success screen deliberately does not reveal whether the account exists. Check inbox, junk and quarantine. Use the newest email in the browser that requested the reset.
4. `/reset-password` explicitly exchanges the PKCE code and verifies the user. Expired/used links, missing verifier, provider errors and network failures show recovery guidance rather than an endless spinner. Sensitive URL parameters are removed from the address bar.
5. Choose and confirm a password (at least 12 characters, a letter and a number). On success, the application requests global sign-out and asks the user to sign in again. It does not claim that already issued access tokens stop working instantly.

`createRecoveryClient` disables automatic URL handling for this page only; ordinary login retains the normal singleton browser client. Initialization is cached across Strict Mode effect replay so a single-use code is not exchanged twice. A 15-minute sessionStorage marker allows a refreshed form only after a server-verified user matches the recovery context. This marker is UI state, not an authorization boundary.

The page also supports `token_hash` with `type=recovery` and older implicit recovery links. For an optional cross-browser email template, use the exact dashboard reset URL with `?token_hash={{ .TokenHash }}&type=recovery`; review this change in Supabase before saving. Ordinary PKCE links require the originating browser's verifier.

### If email delivery is unavailable

A trusted project owner should first verify the staff member's identity outside the failed login form, confirm their staff role, and repair SMTP. Do not create duplicate users, change profiles.role, disable authentication, expose a service key in the frontend, or send a shared temporary password.

For an urgent recovery after identity verification, an operator-only tool is available:

```
node --env-file=.env.recovery.local scripts/generate-staff-recovery-link.mjs <staff-user-uuid> --identity-verified
```

The ignored `.env.recovery.local` must contain NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY (server/admin only) and DASHBOARD_ORIGIN=https://admin.emeraldislemanpower.com. This is separate from dashboard frontend settings. The tool checks the Auth user and profiles.role before generating a one-use recovery link. It does not send email or change a password. Share the resulting link only through a verified private channel; the recipient sets their own password. Never paste the link into chat, logs, issue trackers or shared documents. Use this only after deploying the recovery page that supports token_hash. Revoke access through the normal administrator process if identity cannot be established.

No real recovery link was generated and no account password was changed during local verification.

### Verification and remaining live checks

Run `node --test dashboard/tests/password-recovery.test.cjs dashboard/tests/auth-policy.test.cjs`, `npm run lint`, and `npm run build:dashboard`.

After the user saves SMTP and the dashboard source is deployed, verify with a dedicated staff account: request once -> actual mailbox receipt -> correct production URL -> valid password screen -> user enters new password -> sign in using it -> old password is rejected -> reused/expired link shows recovery guidance. A successful `/recover` response does not prove mailbox receipt. Provider email configuration and the final real-password test cannot be claimed complete until those checks are performed.
