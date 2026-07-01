// Login-gate path logic, extracted from middleware so it can be unit-tested
// without the edge runtime.

export const PUBLIC_FUNNEL = ["/intake", "/thank-you"];

// A path is "under" a prefix if it equals it or is a child segment of it.
// (Segment-aware so "/legalize" does NOT match the "/legal" prefix.)
function underPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(prefix + "/");
}

// TEMPORARY pre-launch gate: the ENTIRE site (marketing funnel included) sits
// behind the login while the firm-identity placeholders in lib/config.ts and
// counsel sign-off are unresolved — so nothing publicly holds out as a law firm.
// Only the login flow and the public APIs are open.
//
// To re-open the public funnel once counsel clears it, restore the public
// exemptions: `pathname === "/"`, PUBLIC_FUNNEL, "/support", "/privacy", "/legal".
export function isPublicPath(pathname: string): boolean {
  void PUBLIC_FUNNEL;
  return (
    underPrefix(pathname, "/login") ||
    underPrefix(pathname, "/api/auth") ||
    underPrefix(pathname, "/api/intake") ||
    underPrefix(pathname, "/api/surveymonkey/webhook")
  );
}
