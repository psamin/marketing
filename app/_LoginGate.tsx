"use client";

import { useState } from "react";

export default function LoginGate() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Invalid email or password.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=Inter:wght@400;500;600&display=swap');
        .wc-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;
          background:#fefefc;color:#0a0a0a;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:24px}
        .wc-card{width:100%;max-width:392px;background:#fff;border:1px solid #ece9e1;border-radius:18px;
          padding:38px 34px 32px;box-shadow:0 1px 2px rgba(10,10,10,.03),0 12px 32px rgba(10,10,10,.05)}
        .wc-brand{margin-bottom:26px}
        .wc-h{font-family:'Fraunces',Georgia,serif;font-weight:300;font-size:23px;letter-spacing:-.3px;margin:0 0 5px}
        .wc-sub{color:#989898;font-size:12.5px;margin:0 0 24px}
        .wc-label{display:block;font-size:11.5px;font-weight:500;text-transform:uppercase;letter-spacing:.6px;color:#6b6b6b;margin:0 0 6px}
        .wc-input{width:100%;padding:11px 13px;border:1px solid #ece9e1;border-radius:10px;font-size:14px;
          font-family:inherit;background:#fefefc;color:#0a0a0a;outline:none;margin-bottom:16px;transition:border-color .15s}
        .wc-input:focus{border-color:#0a0a0a}
        .wc-btn{width:100%;padding:12px;border:none;border-radius:10px;background:#0a0a0a;color:#fff;font-family:inherit;
          font-size:14px;font-weight:500;cursor:pointer;transition:opacity .15s;margin-top:4px}
        .wc-btn:hover{opacity:.88}
        .wc-btn:disabled{opacity:.5;cursor:default}
        .wc-err{background:#fbefe9;border:1px solid #e6c3b2;color:#a24f2e;font-size:12.5px;padding:9px 12px;border-radius:9px;margin-bottom:16px}
        .wc-foot{color:#c3c3bd;font-size:11px;text-align:center;margin-top:22px}
      `,
        }}
      />
      <div className="wc-wrap">
        <div className="wc-card">
          <div className="wc-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/wayco-logo.png" alt="Wayco" style={{ height: 34, width: "auto", display: "block" }} />
          </div>
          <h1 className="wc-h">Sign in</h1>
          <p className="wc-sub">This is a private Wayco preview. Please sign in to continue.</p>
          <form onSubmit={onSubmit}>
            {error && <div className="wc-err">{error}</div>}
            <label className="wc-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="wc-input"
              type="email"
              autoComplete="username"
              placeholder="you@wayco.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className="wc-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="wc-input"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="wc-btn" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <div className="wc-foot">Wayco · confidential preview</div>
        </div>
      </div>
    </>
  );
}
