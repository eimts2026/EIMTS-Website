export function canAccessRoute(path: string, role: string | undefined): boolean {
  if (!role || !["admin", "editor", "viewer"].includes(role)) return false;
  if (/^\/projects\/.+/.test(path)) return role === "admin";
  if (/^\/(jobs|hero|popups)\/.+/.test(path) || path === "/applications") {
    return role === "admin" || role === "editor";
  }
  return true;
}

export function safeNext(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || /[\\\x00-\x20]/.test(value)) return "/";
  const url = new URL(value, "https://dashboard.invalid");
  if (url.pathname.startsWith("//")) return "/";
  if (["/login", "/reset-password", "/access-denied"].includes(url.pathname) || url.pathname.startsWith("/auth/")) return "/";
  return url.pathname + url.search;
}
