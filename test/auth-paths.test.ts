import { describe, it, expect } from "vitest";
import { isPublicPath } from "@/lib/auth-paths";

describe("login-gate path logic (regression)", () => {
  const PUBLIC = [
    "/", // ad-funnel landing
    "/intake",
    "/intake/step-2",
    "/thank-you",
    "/support",
    "/privacy",
    "/legal",
    "/login",
    "/login?next=/leads",
    "/api/auth/login",
    "/api/auth/logout",
    "/api/intake",
    "/api/surveymonkey/webhook",
  ];

  const GATED = [
    "/leads", // internal dashboard — MUST stay gated
    "/leads/123",
    "/api/surveymonkey/responses", // internal lead data
    "/api/surveymonkey/survey",
    "/admin",
    "/dashboard",
    "/legalize", // lookalike must NOT be treated as /legal
    "/intaker", // lookalike must NOT be treated as /intake
  ];

  it.each(PUBLIC)("keeps %s public (no login wall)", (path) => {
    // querystrings never reach isPublicPath (middleware passes pathname only),
    // so strip anything after "?" the way NextRequest.nextUrl.pathname would.
    const pathname = path.split("?")[0];
    expect(isPublicPath(pathname)).toBe(true);
  });

  it.each(GATED)("gates %s behind the login", (path) => {
    expect(isPublicPath(path)).toBe(false);
  });
});
