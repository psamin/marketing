import { createHash, timingSafeEqual } from "crypto";
import { config } from "./config";

// Constant-time token comparison (hash both to fixed length to avoid leaking length).
export function tokenMatches(provided: string, expected: string): boolean {
  if (!expected || !provided) return false;
  const a = createHash("sha256").update(provided).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

/** Pull a token from ?token=, Authorization: Bearer, or x-api-key. */
export function tokenFromRequest(req: Request): string {
  const q = new URL(req.url).searchParams.get("token");
  if (q) return q;
  const auth = req.headers.get("authorization");
  if (auth && auth.toLowerCase().startsWith("bearer ")) return auth.slice(7).trim();
  return req.headers.get("x-api-key") ?? "";
}

/**
 * Authorize an internal (PII-exposing) endpoint. Returns null when allowed, or
 * an error string when denied. Mirrors the /leads gate:
 *  - token configured -> require a match
 *  - no token + prod   -> disabled (refuse to expose PII)
 *  - no token + dev    -> open for local development
 */
export function authorizeInternal(provided: string): string | null {
  const expected = config.leadsToken;
  if (!expected) {
    return config.isProd
      ? "Disabled: set LEADS_ACCESS_TOKEN to enable internal endpoints in production."
      : null;
  }
  return tokenMatches(provided, expected) ? null : "Unauthorized: invalid or missing token.";
}
