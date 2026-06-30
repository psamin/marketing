import { config } from "./config";
import { Lead } from "./leads";

const TIER_EMOJI: Record<string, string> = {
  hot: "🔥",
  warm: "🌤️",
  cold: "❄️",
  disqualified: "⛔",
};

export interface NotifyResult {
  ok: boolean;
  mode: "live" | "mock";
  detail?: string;
}

/**
 * Send a custom-formatted notification for a new lead to ALERT_WEBHOOK_URL
 * (Slack, Discord, or any generic JSON webhook). Mock-logs when unset.
 * Never throws — the caller reports status.
 */
export async function notifyNewLead(lead: Lead): Promise<NotifyResult> {
  const q = lead.qualification;
  const header = `${TIER_EMOJI[q.tier] ?? "•"}  New ${q.tier.toUpperCase()} lead — ${lead.incident.typeLabel} (score ${q.score})`;
  const lines = [
    header,
    `${lead.claimant.fullName}`,
    lead.claimant.phone ? `📞 ${lead.claimant.phone}` : "",
    lead.claimant.email ? `✉️ ${lead.claimant.email}` : "",
    lead.incident.state ? `📍 ${lead.incident.state}` : "",
    `➡️ ${q.recommendedAction}`,
    q.flags.length ? `⚑ ${q.flags.join(", ")}` : "",
  ].filter(Boolean);
  const text = lines.join("\n");

  const url = config.alertWebhookUrl;
  if (!url) {
    console.log("[notify] (mock) " + text.replace(/\n/g, "  |  "));
    return { ok: true, mode: "mock" };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // `text` works for Slack + generic webhooks; `content` for Discord.
      body: JSON.stringify({
        text,
        content: text,
        lead: {
          id: lead.leadId,
          tier: q.tier,
          score: q.score,
          name: lead.claimant.fullName,
          phone: lead.claimant.phone,
          incident: lead.incident.typeLabel,
        },
      }),
    });
    if (!res.ok) return { ok: false, mode: "live", detail: `HTTP ${res.status}` };
    return { ok: true, mode: "live" };
  } catch (err) {
    return { ok: false, mode: "live", detail: (err as Error).message };
  }
}
