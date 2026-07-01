import { NextResponse } from "next/server";

// Single shared access code for the private preview (no email/password).
const ACCESS_CODE = process.env.ACCESS_CODE ?? process.env.AUTH_PASSWORD ?? "";
const AUTH_COOKIE = "wayco_auth";
const AUTH_TOKEN = process.env.AUTH_TOKEN ?? "wc_ok_2026";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const code = typeof body.code === "string" ? body.code.trim() : "";

  // Code lives in an env var, not source. If unset, refuse all access.
  if (ACCESS_CODE && code === ACCESS_CODE) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(AUTH_COOKIE, AUTH_TOKEN, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  }

  return NextResponse.json({ ok: false, error: "Invalid access code." }, { status: 401 });
}
