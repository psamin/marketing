import { NextResponse } from "next/server";
import { normalizeLead } from "@/lib/leads";
import { WidgetSubmission, widgetToRawIntake } from "@/lib/intake";
import { forwardToWayco } from "@/lib/wayco";
import { recordResponse } from "@/lib/surveymonkey";
import { notifyNewLead } from "@/lib/notify";
import { persistLead } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public intake submission from the landing-page widget. Normalizes the widget
// fields into the canonical lead, scores/tiers it, records it to SurveyMonkey
// (when configured), forwards it to Wayco, notifies the team, and persists it so
// it shows up in /leads — the same pipeline the SurveyMonkey webhook uses.
// Never fails the visitor on a downstream hiccup.
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as WidgetSubmission;

  const raw = widgetToRawIntake(body);
  const lead = normalizeLead(raw, {
    mode: "live",
    source: "wayco-intake-widget",
    userAgent: req.headers.get("user-agent") ?? undefined,
    ip: (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || undefined,
  });
  lead.qualification.flags.push("widget_partial_intake");

  const [wayco, surveymonkey] = await Promise.all([
    forwardToWayco(lead).catch((e) => ({
      provider: "wayco",
      ok: false,
      mode: "live" as const,
      detail: (e as Error).message,
    })),
    recordResponse({
      firstName: raw.firstName,
      phone: raw.phone,
      email: raw.email,
      incidentDate: raw.incidentDate,
      description: raw.description,
    }).catch((e) => ({ ok: false, mode: "live" as const, detail: (e as Error).message })),
  ]);
  await persistLead(lead).catch(() => false);
  await notifyNewLead(lead).catch(() => undefined);

  return NextResponse.json({
    ok: true,
    leadId: lead.leadId,
    qualification: lead.qualification,
    integrations: { wayco, surveymonkey },
  });
}
