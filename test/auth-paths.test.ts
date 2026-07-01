import { describe, it, expect } from "vitest";
import { isPublicPath } from "@/lib/auth-paths";

// PRE-LAUNCH GATE: the whole site sits behind the login (funnel included) while
// firm-identity placeholders + counsel sign-off are unresolved. Only the login
// flow and public APIs are open. When the funnel re-opens, move the marketing
// paths back to PUBLIC here and restore the exemptions in lib/auth-paths.ts.
describe("login-gate path logic (regression)", () => {
  const PUBLIC = [
    "/login",
    "/login?next=/leads",
    "/api/auth/login",
    "/api/auth/logout",
    "/api/intake", // public form submit endpoint
    "/api/surveymonkey/webhook", // external integration
  ];

  const GATED = [
    "/", // marketing funnel — gated pre-launch
    "/intake",
    "/intake/step-2",
    "/thank-you",
    "/support",
    "/privacy",
    "/legal",
    "/leads", // internal dashboard
    "/leads/123",
    "/api/surveymonkey/responses",
    "/api/surveymonkey/survey",
    "/admin",
    "/legalize",
    "/intaker",
  ];

  it.each(PUBLIC)("keeps %s reachable without login", (path) => {
    // middleware passes only pathname (no querystring) to isPublicPath
    expect(isPublicPath(path.split("?")[0])).toBe(true);
  });

  it.each(GATED)("gates %s behind the login", (path) => {
    expect(isPublicPath(path)).toBe(false);
  });
});
