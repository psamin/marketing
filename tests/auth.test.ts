import { describe, it, expect } from "vitest";
import { tokenMatches, tokenFromRequest, authorizeInternal } from "@/lib/auth";

describe("tokenMatches", () => {
  it("matches equal tokens and rejects mismatches/empties", () => {
    expect(tokenMatches("abc123", "abc123")).toBe(true);
    expect(tokenMatches("abc123", "abc124")).toBe(false);
    expect(tokenMatches("", "abc123")).toBe(false);
    expect(tokenMatches("abc123", "")).toBe(false);
  });
});

describe("tokenFromRequest", () => {
  it("reads ?token= query param", () => {
    expect(tokenFromRequest(new Request("https://x.dev/api?token=t1"))).toBe("t1");
  });
  it("reads Authorization: Bearer", () => {
    expect(
      tokenFromRequest(new Request("https://x.dev/api", { headers: { authorization: "Bearer t2" } }))
    ).toBe("t2");
  });
  it("reads x-api-key", () => {
    expect(
      tokenFromRequest(new Request("https://x.dev/api", { headers: { "x-api-key": "t3" } }))
    ).toBe("t3");
  });
  it("returns empty string when no token is present", () => {
    expect(tokenFromRequest(new Request("https://x.dev/api"))).toBe("");
  });
});

describe("authorizeInternal", () => {
  it("is open in dev when no LEADS_ACCESS_TOKEN is configured", () => {
    // Vitest runs with NODE_ENV=test (not production), and no token env is set.
    expect(authorizeInternal("")).toBeNull();
  });
});
