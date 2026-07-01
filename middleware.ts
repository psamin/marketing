import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "wayco_auth";
const AUTH_TOKEN = process.env.AUTH_TOKEN ?? "wc_ok_2026";

// Inlined (NOT imported) so the Edge middleware bundle stays self-contained —
// importing a sibling module makes Next inject a Node shim that references
// __dirname, which crashes the Edge runtime. Keep this in sync with the
// unit-tested copy in lib/auth-paths.ts (same pre-launch gate: whole site behind
// login; only the login flow + public APIs are open).
function underPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(prefix + "/");
}
function isPublicPath(pathname: string): boolean {
  return (
    underPrefix(pathname, "/login") ||
    underPrefix(pathname, "/api/auth") ||
    underPrefix(pathname, "/api/intake") ||
    underPrefix(pathname, "/api/surveymonkey/webhook")
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Pass the path to the root layout so any server-side gate can also exempt
  // the public funnel (must not re-gate ad-traffic pages).
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);
  const pass = () => NextResponse.next({ request: { headers: requestHeaders } });

  // Public funnel + policy pages + login flow + public APIs stay open;
  // everything else (e.g. /leads) sits behind the login gate.
  if (isPublicPath(pathname)) return pass();

  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (token === AUTH_TOKEN) return pass();

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/",
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|css|js|mp4)$).*)",
  ],
};
