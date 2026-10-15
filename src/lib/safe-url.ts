/** Stored CMS links may navigate only to a local path or an HTTP(S) URL. */
export function safeNavigationUrl(value: string | null | undefined): string | null {
  if (!value || value.length > 2048 || /[\u0000-\u0020\u007f\\]/.test(value)) return null;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}
