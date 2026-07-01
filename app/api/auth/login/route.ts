import { NextResponse } from "next/server";

const EMAIL = (process.env.AUTH_EMAIL ?? "").trim().toLowerCase();
const PASSWORD = process.env.AUTH_PASSWORD ?? "";
const AUTH_COOKIE = "wayco_auth";
const AUTH_TOKEN = process.env.AUTH_TOKEN ?? "wc_ok_2026";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  // Credentials live in env vars, not source. If unset, refuse all logins.
  if (EMAIL && PASSWORD && email === EMAIL && password === PASSWORD) {
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

  return NextResponse.json(
    { ok: false, error: "Invalid email or password." },
    { status: 401 },
  );
}
