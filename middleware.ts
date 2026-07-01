import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isPublicPath } from "./lib/auth-paths";

const AUTH_COOKIE = "wayco_auth";
const AUTH_TOKEN = process.env.AUTH_TOKEN ?? "wc_ok_2026";

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
