import type { Metadata } from "next";
import { createHash, timingSafeEqual } from "crypto";
import { config } from "@/lib/config";
import { Lead, Tier } from "@/lib/leads";
import { readLeads } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lead Queue — Wayco Intake (Internal)",
  robots: { index: false, follow: false },
};

// Constant-time token comparison (hash both to fixed length to avoid leaking length).
function tokenMatches(provided: string, expected: string): boolean {
  if (!expected) return false;
  const a = createHash("sha256").update(provided).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

const TIER_RANK: Record<Tier, number> = { hot: 0, warm: 1, cold: 2, disqualified: 3 };

function fmtDate(iso: string): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return iso;
  return new Date(t).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function Gate({ message }: { message: string }) {
  return (
    <main className="container leads-wrap">
      <h1>Lead queue</h1>
      <form className="token-form" method="get" action="/leads">
        <label htmlFor="token">Access token</label>
        <input id="token" name="token" type="password" placeholder="Enter access token" autoFocus />
        <button className="btn btn--primary" type="submit" style={{ width: "100%" }}>
          View leads
        </button>
        {message ? (
          <p style={{ color: "var(--red-600)", marginTop: 14, marginBottom: 0, fontSize: "0.9rem" }}>
            {message}
          </p>
        ) : null}
      </form>
    </main>
  );
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const sp = await searchParams;
  const provided = Array.isArray(sp.token) ? sp.token[0] ?? "" : sp.token ?? "";
  const expected = config.leadsToken;

  // Access control:
  // - token configured  -> require a match
  // - no token + prod    -> disabled (refuse to expose PII)
  // - no token + dev     -> open for local development
  if (expected) {
    if (!provided) return <Gate message="" />;
    if (!tokenMatches(provided, expected)) return <Gate message="Invalid token. Try again." />;
  } else if (config.isProd) {
    return (
      <main className="container leads-wrap">
        <h1>Lead queue</h1>
        <div className="empty-state">
          <p>
            This view is disabled. Set <code>LEADS_ACCESS_TOKEN</code> to enable the call-team lead
            queue in production.
          </p>
        </div>
      </main>
    );
  }

  const leads: Lead[] = await readLeads(200);
  leads.sort((a, b) => {
    const r = TIER_RANK[a.qualification.tier] - TIER_RANK[b.qualification.tier];
    if (r !== 0) return r;
    return b.qualification.score - a.qualification.score;
  });

  const counts = leads.reduce<Record<string, number>>((acc, l) => {
    acc[l.qualification.tier] = (acc[l.qualification.tier] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <main className="container leads-wrap">
      <div className="leads-head">
        <div>
          <h1 style={{ marginBottom: 4 }}>Lead queue</h1>
          <p style={{ color: "var(--muted)", margin: 0 }}>
            {leads.length} lead{leads.length === 1 ? "" : "s"} · sorted by priority. Internal use only.
          </p>
        </div>
        <div className="leads-stats">
          <span className="pill tier tier--hot">Hot {counts.hot ?? 0}</span>
          <span className="pill tier tier--warm">Warm {counts.warm ?? 0}</span>
          <span className="pill tier tier--cold">Cold {counts.cold ?? 0}</span>
          <span className="pill tier tier--disqualified">DQ {counts.disqualified ?? 0}</span>
        </div>
      </div>

      {leads.length === 0 ? (
        <div className="empty-state">
          <p>No leads yet. Completed SurveyMonkey responses will appear here once the webhook fires.</p>
          <p style={{ fontSize: "0.85rem" }}>
            Test it: <code>POST /api/surveymonkey/webhook</code> with the sample in{" "}
            <code>samples/surveymonkey-webhook.json</code>.
          </p>
        </div>
      ) : (
        <div className="table-scroll">
          <table className="leads">
            <thead>
              <tr>
                <th>Priority</th>
                <th>Claimant</th>
                <th>Contact</th>
                <th>Incident</th>
                <th>Recommended action</th>
                <th>Flags</th>
                <th>Received</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.leadId}>
                  <td>
                    <span className={`tier tier--${l.qualification.tier}`}>{l.qualification.tier}</span>
                    <div className="score">{l.qualification.score}</div>
                  </td>
                  <td>
                    <strong>{l.claimant.fullName}</strong>
                    {l.claimant.bestTimeToCall ? (
                      <div style={{ color: "var(--muted)", fontSize: "0.82rem" }}>
                        Best time: {l.claimant.bestTimeToCall}
                      </div>
                    ) : null}
                  </td>
                  <td>
                    {l.claimant.phone ? <div>{l.claimant.phone}</div> : null}
                    {l.claimant.email ? (
                      <div style={{ color: "var(--muted)", fontSize: "0.82rem" }}>{l.claimant.email}</div>
                    ) : null}
                    <div style={{ color: "var(--muted)", fontSize: "0.78rem" }}>
                      prefers {l.claimant.preferredContact}
                    </div>
                  </td>
                  <td>
                    <strong>{l.incident.typeLabel}</strong>
                    <div style={{ color: "var(--muted)", fontSize: "0.82rem" }}>
                      {l.incident.date || "date n/a"}
                      {l.incident.state ? ` · ${l.incident.state}` : ""}
                    </div>
                  </td>
                  <td style={{ maxWidth: 260 }}>{l.qualification.recommendedAction}</td>
                  <td style={{ maxWidth: 200 }}>
                    {l.qualification.flags.length
                      ? l.qualification.flags.map((f) => (
                          <span className="flagchip" key={f}>{f}</span>
                        ))
                      : "—"}
                  </td>
                  <td style={{ whiteSpace: "nowrap", color: "var(--muted)", fontSize: "0.82rem" }}>
                    {fmtDate(l.submittedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
