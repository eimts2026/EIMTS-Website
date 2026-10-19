# Performance review — 19 October 2026

Follow-up implementation and current setup instructions:
[performance-implementation-report.md](performance-implementation-report.md).
The remaining-priority list below records the earlier audit, before that follow-up.

Scope: public rendering, reveal lifecycle, globe animation, certificate assets,
job reads and email submission paths. This is a code-level review and targeted
optimization, not a production capacity certification or exhaustive dashboard audit.

## Implemented

| Finding | Change | Evidence |
| --- | --- | --- |
| Every DOM insertion could trigger full-document reveal queries | Scan only inserted subtrees, coalesce ancestor/descendant work, ignore excluded additions; unobserve detached targets | One initial full scan; subsequent queries scoped to inserted roots. Timers and observers cleaned up on route changes. |
| Small certificate cards used full-resolution documents | Generate local WebP previews bounded to 640 × 800, keep original document links | Nine files: 2,120,348 → 460,250 bytes (78.3% reduction); 20,885,055 → 3,808,960 pixels (81.8% reduction). This is source-pixel reduction, not measured process memory. |
| CSS background hero discovered after stylesheet processing | React image preload at high priority, on the home component only | Same URL as CSS, no duplicate variant; actual LCP improvement requires measurement. |

Preview generation: `node scripts/generate-certificate-previews.mjs`.
Previews remain eager to avoid blank frames during the continuous marquee.
Original documents remain untouched. No runtime image CDN is needed for these previews.

## Remaining scale priorities

1. **Origin reads:** home and vacancies explicitly use `force-dynamic`; each
   request reads published jobs. Preserve immediate dashboard visibility for now.
   For high traffic, implement publication-triggered cache invalidation with an
   agreed expiry/freshness budget and cache-hit monitoring. Avoid caching private
   candidate data. Job-detail metadata and page both call the same loader; inspect
   actual fetch deduplication before adding request-scoped React cache.
2. **Growing catalog:** `getPublishedJobs` has no database limit when called by
   the full vacancies page; browser pagination does not bound the query or payload.
   Implement server-side filters and deterministic cursor pagination together,
   including facet counts. Do not silently truncate results. Profile query plans
   against representative data before choosing indexes.
3. **Submission capacity:** inquiry and application handlers await SMTP in the
   request. Application handling also materializes CV bytes. Use durable queued
   delivery, idempotency keys, bounded worker concurrency, retries and dead-letter
   handling at higher volume. Change UI wording to queued/received until delivery
   is actually confirmed. Distributed rate limiting must work across instances;
   an in-process map does not provide that guarantee. Validate hosting request-size
   limits before supporting the advertised maximum CV size.
4. **Font waterfall:** global Google Fonts CSS import loads four families. Keep
   the approved typography but self-host licensed WOFF2 subsets, preload only
   critical fonts, and compare font metrics to prevent layout shifts. Do not
   preload every family and compete with the hero image.
5. **Map loading:** Leaflet is dynamically split but mounted immediately on the
   contact page. Gate loading near the viewport with reserved dimensions and
   preserve direct map hash links; verify keyboard and mobile behavior.

## Existing protections retained

The globe already stops continuous frames when offscreen/backgrounded, respects
reduced motion, and destroys its WebGL resources. The inquiry parser bounds its
body to 24 KB. These should not be replaced with speculative optimizations.
No heap-profile-confirmed leak was established; detached reveal targets now have
explicit release rather than waiting for the next navigation.

## Validation and release gates

- `npx tsc --noEmit`: passed.
- `git diff --check`: passed (line-ending warnings only).
- Browser About page: all 18 preview instances loaded, 55 reveal targets registered.
- `npm run build:web -- --webpack`: compilation and TypeScript passed; prerender
  blocked by Windows EPERM creating `.next/server/app/_global-error.segments/_global-error`.
- No production load test, before/after Lighthouse run or heap profile was performed.

Before asserting million-user readiness: measure mobile p75 LCP/INP/CLS, p95/p99
TTFB and API latency, origin requests per page view, cache-hit ratio, database
connections/query latency, queue age and delivery errors. Run staged load tests
against an isolated environment using realistic concurrent users and traffic mix,
including spikes and a sustained soak. Set capacity from measured requests per
second and service quotas, not monthly user counts. Run a clean Linux CI build
and browser regressions before deployment.
