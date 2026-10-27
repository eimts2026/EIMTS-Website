// The existing 32+ figure is the value from 1 July 2026, in Sri Lanka time.
const SRI_LANKA_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export function complianceYears(now = new Date()) {
  const local = new Date(now.getTime() + SRI_LANKA_OFFSET_MS);
  return local.getUTCFullYear() - 1995 + (local.getUTCMonth() >= 6 ? 1 : 0);
}

export function untilSriLankaMidnight(now = new Date()) {
  const local = new Date(now.getTime() + SRI_LANKA_OFFSET_MS);
  return Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate() + 1) - SRI_LANKA_OFFSET_MS - now.getTime();
}
