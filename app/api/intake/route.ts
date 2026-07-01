import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Public intake submission from the hero widget. Forwards the lead to the
// alert webhook if configured, otherwise logs it. Kept intentionally minimal.
export async function POST(req: Request) {
  const lead = await req.json().catch(() => ({}));
  const payload = {
    source: "wayco-intake-widget",
    receivedAt: new Date().toISOString(),
    lead,
  };

  const webhook = process.env.ALERT_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      /* don't fail the user's submission on a webhook hiccup */
    }
  } else {
    console.log("[intake]", JSON.stringify(payload));
  }

  return NextResponse.json({ ok: true });
}
