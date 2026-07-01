// Login-gate path logic, extracted from middleware so it can be unit-tested
// without the edge runtime. The public marketing funnel + policy pages + login
// flow + public APIs stay open; everything else (e.g. /leads) is gated.

export const PUBLIC_FUNNEL = ["/intake", "/thank-you"];

// A path is "under" a prefix if it equals it or is a child segment of it.
// (Segment-aware so "/legalize" does NOT match the "/legal" prefix.)
function underPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(prefix + "/");
}

export function isPublicPath(pathname: string): boolean {
  return (
    pathname === "/" ||
    PUBLIC_FUNNEL.some((p) => underPrefix(pathname, p)) ||
    underPrefix(pathname, "/support") ||
    underPrefix(pathname, "/privacy") ||
    underPrefix(pathname, "/legal") ||
    underPrefix(pathname, "/login") ||
    underPrefix(pathname, "/api/auth") ||
    underPrefix(pathname, "/api/intake") ||
    underPrefix(pathname, "/api/surveymonkey/webhook")
  );
}
