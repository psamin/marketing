import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "wayco_auth";
const AUTH_TOKEN = process.env.AUTH_TOKEN ?? "wc_ok_2026";

// Public marketing funnel — ad traffic lands here and must NOT hit the gate.
// The landing page ("/"), the intake form, and the post-submit thank-you.
// The internal "/leads" dashboard and the SurveyMonkey data APIs stay gated.
const PUBLIC_FUNNEL = ["/intake", "/thank-you"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Pass the path to the root layout so its server-side gate can also exempt
  // the public funnel (the layout gate exists to catch edge-cached pages that
  // skip middleware — it must not re-gate the funnel).
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);
  const pass = () => NextResponse.next({ request: { headers: requestHeaders } });

  // Public funnel (ad traffic) stays open; the internal /leads dashboard and
  // everything else sit behind the login gate.
  if (
    pathname === "/" ||
    PUBLIC_FUNNEL.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/legal") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/intake") ||
    pathname.startsWith("/api/surveymonkey/webhook")
  ) {
    return pass();
  }

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
