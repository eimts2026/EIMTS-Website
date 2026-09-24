# EIMTS production security audit

**Date:** 2026-09-24  
**Scope:** `src/`, `dashboard/`, `packages/database/`, `supabase/migrations/`, deployment/configuration files, dependency lockfile, and the connected Supabase project `rndvuryaqhkmasyymuer`.

## Executive assessment

The application is not production-clear. The highest-priority action is to upgrade Next.js and Sharp, then close the anonymous CV/application abuse paths and the public execution of privileged database functions. Dashboard route tests passed, and no committed secret-pattern matches were found, but those results do not offset the confirmed dependency and data-integrity risks.

## Findings

### CRITICAL — vulnerable Next.js/Sharp image-processing chain

Evidence: `package.json` declares Next `^16.3.2` and Sharp `0.35.3`; `package-lock.json` resolves Next `16.3.2` and Sharp `0.35.3`. `next.config.ts` enables AVIF output. `npm audit --json --ignore-scripts` reports Next.js GHSA-p293-qw3h-jr36 (CVSS 9.0, affected `<16.3.3`) and GHSA-2xp9-vwfh-vxw4 (CVSS 9.5, affected `<16.3.3`), plus Sharp/libheif GHSA-rgj7-g3m4-5g8c affecting `<0.35.4`. The advisories describe unauthenticated RCE through Windows-hosted Next servers and AVIF optimization.

Attack scenario: a remote attacker sends crafted requests to the public Next image optimizer. Impact depends on the deployed runtime and whether AVIF processing is reached; a vulnerable Windows host can become code-execution, while a vulnerable image-processing path can compromise the server or cause denial of service.

Fix: upgrade Next to `>=16.3.3` and Sharp to `>=0.35.4` (or the currently supported patched releases), regenerate and review the lockfile, deploy, and exercise image optimization. If an upgrade cannot be immediate, disable AVIF optimization and isolate the runtime, but treat that only as temporary containment. Do not run production on Windows with the affected Next version.

### HIGH — public SECURITY DEFINER RPC surface

Live Supabase security advisors observed four `public` SECURITY DEFINER functions executable by both `anon` and `authenticated`: `handle_new_user`, `is_admin`, `is_staff`, and `rls_auto_enable`. The migration defines `is_staff` and `is_admin` as SECURITY DEFINER in `supabase/migrations/202607310001_initial_content_system.sql:101` and `:116`; the advisor confirms the live grants and REST RPC exposure.

Attack scenario: an unauthenticated caller invokes `/rest/v1/rpc/<function>`. Even if current function bodies do not immediately expose data, public execution of privileged functions creates a database-level attack surface and can become privilege escalation after a future body change. `rls_auto_enable` is especially dangerous if callable with a meaningful argument or side effect.

Fix: revoke EXECUTE from `PUBLIC`, `anon`, and `authenticated` for administrative/trigger-only functions; move internal helpers to a non-exposed schema; use SECURITY INVOKER where possible; keep a narrowly scoped SECURITY DEFINER body with fixed `search_path` and explicit `auth.uid()` checks where unavoidable. Re-run Supabase security advisors and test RPC denial.

### HIGH — anonymous CV/application upload and email abuse

Evidence: `src/app/api/applications/route.ts:15-48,53-94` accepts unauthenticated multipart requests, permits 5 MB per request, checks only the browser-provided MIME type, uploads to `candidate-cvs`, inserts an application, and sends SMTP mail with the attachment. The migration grants `anon, authenticated` application INSERT at `supabase/migrations/202607310001_initial_content_system.sql:181-192` and CV INSERT at `:222-234`; the policy checks only a published job folder. There is no application-level rate limit, quota, CAPTCHA/challenge, content sniffing, malware scan, or request-body cap before parsing.

Attack scenario: a bot submits repeated valid-looking requests against one published job, filling storage/database and generating recruitment email traffic. A crafted file can be named `.pdf` or sent as a permitted MIME while containing arbitrary bytes. This is an availability, cost, and malware-delivery risk; it is not proven remote code execution in this codebase.

Fix: enforce edge/WAF rate limits keyed by IP and job, add a server-side body limit and queue-based email delivery, verify magic bytes and parse PDF/DOC/DOCX safely, malware-scan/quarantine uploads, use random opaque paths, add abuse telemetry and quotas, and clean up the uploaded object if the database insert fails. Keep the database policy as defense in depth and constrain storage MIME/size at the bucket and policy levels.

### HIGH — candidate application fields can be forged through the Data API

Evidence: the anonymous INSERT policy validates only `job_id` points to a currently published job (`supabase/migrations/202607310001_initial_content_system.sql:181-192`). The same table allows client-supplied `status`, `created_at`, `updated_at`, and `cv_path` (`:39-52`) without column privileges, defaults/trigger protections, or a restrictive insert policy on those fields.

Attack scenario: a caller bypasses the website route and inserts an application directly with `status='hired'`, forged timestamps, or an arbitrary existing-looking CV path. This does not grant staff SELECT, but it corrupts workflow data and can create references to another candidate’s file if a path is guessed.

Fix: revoke anonymous INSERT on the table and insert through a server endpoint using a server-only key or a tightly scoped RPC; alternatively expose only safe insert columns and enforce `status='new'`, server timestamps, and a path prefix tied to the inserted row. Add RLS tests for every column/state transition.

### MEDIUM — no proven backend login abuse controls; leaked-password protection disabled

Live advisor evidence reports Supabase Auth leaked-password protection disabled. The dashboard test suite passes role and return-path policy tests, but `dashboard/docs` explicitly says login cooldown is only a UI feature and provider rate limits/password requirements remain configuration. MFA and reauthentication are also not evidenced in the repository.

Attack scenario: credential stuffing against the dashboard login, followed by access to staff content if a password is reused or compromised. This is configuration-dependent and not a demonstrated bypass of route authorization.

Fix: enable Have I Been Pwned/leaked-password protection, provider-side rate limits and strong password policy, MFA for admin/editor accounts, session revocation on role changes, and alerting for failed logins. Verify with dedicated staff accounts.

### MEDIUM — stored XSS risk in JobPosting JSON-LD

Evidence: `src/app/foreign-job-vacancies/[slug]/page.tsx:100-141` serializes database-controlled `job.title` and `job.description` into `dangerouslySetInnerHTML` without escaping `<`, `>`, or U+2028/U+2029. A content editor can therefore place a `</script><script>...` payload into a published job. React escaping elsewhere does not protect this raw script context.

Attack scenario: an editor account or compromised content-management path publishes a malicious job; any visitor to that job receives script execution in the site origin.

Fix: serialize JSON-LD with a context-safe serializer that replaces `<` with `\\u003c`, `>` with `\\u003e`, `&` with `\\u0026`, and U+2028/U+2029, or emit structured data through a trusted library. Add a regression test with `</script>` in title/description and deploy a CSP with nonces where compatible.

### LOW/MEDIUM — dependency and deployment reproducibility risk

`dashboard/package.json` uses `latest` for Next, `@supabase/ssr`, and `@supabase/supabase-js`. Although the committed lockfile currently fixes resolved versions for installs using `npm ci`, a package-manager update or lockfile regeneration can silently change the dashboard dependency graph.

Fix: pin exact compatible versions in workspace manifests, enforce `npm ci` in CI, run `npm audit`/Dependabot, and require lockfile review.

## Positive controls and non-findings

- Dashboard auth-policy tests passed all four tests. Protected pages check identity and profile roles; server actions perform role checks. This is evidence of intended control flow, not live-account proof.
- The project migration restricts server-side legacy image fetches to the configured site origin and a constrained WebP path; no SSRF was confirmed there.
- The committed-source secret-pattern scan found no private-key, provider-token, or Supabase secret-pattern matches. Local `.env.local` files exist and were not included in Git; verify Vercel/Supabase secret rotation separately.
- No SQL string concatenation or `eval` in application code was found. `new Function` appears only in the dashboard policy test harness.
- Live migration history includes the final “preserve applications on job delete” migration; the earlier cascade behavior should not be treated as current behavior.

## Production release gates

1. Patch Next/Sharp and redeploy both Vercel projects; verify exact resolved versions.
2. Revoke public execution of SECURITY DEFINER functions and rerun Supabase security advisors.
3. Move application submission behind rate limiting, server-side file validation/scanning, and controlled insertion.
4. Add RLS/storage tests for anonymous insert columns, CV object paths, and every staff role.
5. Enable leaked-password protection, MFA, provider rate limits, session revocation, and audit alerts.
6. Add CSP/security headers to the public site, safe JSON-LD serialization tests, dependency pinning, and CI gates for `npm audit`, typecheck, builds, and RLS tests.

## Coverage and limitations

The repository source, dashboard source, migrations, package manifests/lockfile, tests, and live Supabase security advisors/migration list were inspected read-only. No production mutation, exploit execution, credential testing, or candidate-row/content disclosure was performed. Vercel deployment settings, live HTTP behavior, Supabase storage policies beyond advisor output, Auth rate limits, MFA, and environment secret values require separate authenticated operational verification.

## Remediation update — 2026-09-24

The Next.js/Sharp finding was patched in the working tree: root and dashboard Next.js are pinned to `16.3.3`, Sharp is pinned to `0.35.4`, and `package-lock.json` was regenerated. The public production build passed under Next.js 16.3.3 and TypeScript checks passed. Dashboard build reached Next.js 16.3.3 but could not complete because the environment could not fetch Google Fonts; this is an external build-environment failure, not a code failure. A follow-up `npm audit` reports zero critical findings; remaining high findings are unrelated PostCSS/nanoid and Nodemailer advisories.

Repository fixes for JSON-LD script-context escaping, multipart body/magic-byte validation, orphan cleanup, and application insert hardening were added. The new migration `supabase/migrations/20260924120000_security_hardening.sql` must be applied to the live Supabase project; the connected migration tool rejected the operation because the approval service hit its usage limit, so live RPC grants and trigger enforcement are not yet verified.
