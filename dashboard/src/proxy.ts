import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { canAccessRoute } from "./lib/auth-policy";

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const supabaseOrigin = url ? new URL(url).origin : "";
  const supabaseWebsocketOrigin = supabaseOrigin.replace(/^http/, "ws");
  const policy = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    `connect-src 'self' ${supabaseOrigin} ${supabaseWebsocketOrigin}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(process.env.NODE_ENV === "production" ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", policy);

  function secureResponse(response: NextResponse) {
    response.headers.set("Content-Security-Policy", policy);
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("Vercel-CDN-Cache-Control", "no-store");
    return response;
  }

  if (!url || !key) return secureResponse(NextResponse.next({ request: { headers: requestHeaders } }));

  let response = secureResponse(NextResponse.next({ request: { headers: requestHeaders } }));
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        requestHeaders.set("cookie", request.headers.get("cookie") || "");
        response = secureResponse(NextResponse.next({ request: { headers: requestHeaders } }));
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
        Object.entries(headers).forEach(([name, value]) => response.headers.set(name, value));
        secureResponse(response);
      },
    },
  });

  const { data: { user }, error } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  if (["/login", "/reset-password", "/access-denied"].includes(path)) return response;

  function redirectTo(pathname: string) {
    const target = request.nextUrl.clone();
    target.pathname = pathname;
    target.search = "";
    if (pathname === "/login") target.searchParams.set("next", path + request.nextUrl.search);
    const redirect = NextResponse.redirect(target);
    response.cookies.getAll().forEach(cookie => redirect.cookies.set(cookie));
    return secureResponse(redirect);
  }

  if (error || !user || user.is_anonymous) return redirectTo("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!canAccessRoute(path, profile?.role)) return redirectTo("/access-denied");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
