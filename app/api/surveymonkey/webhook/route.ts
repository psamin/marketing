import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";
import { normalizeLead } from "@/lib/leads";
import {
  SMWebhookEvent,
  buildRawIntake,
  fetchResponseDetails,
  flattenResponse,
  verifyWebhookSignature,
} from "@/lib/surveymonkey";
import { forwardToWayco } from "@/lib/wayco";
import { persistLead, readLeads } from "@/lib/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * SurveyMonkey webhook receiver.
 *
 * Live path:  verify HMAC signature -> read event IDs -> fetch response detail
 *             from the SurveyMonkey API -> normalize -> score -> forward to Wayco.
 * Test path:  (non-production only) accept inline `details` + `map` in the body
 *             so the whole pipeline runs with no SurveyMonkey/Wayco credentials.
 *
 * Always returns 200 on a well-formed request so SurveyMonkey does not enter a
 * retry storm; integration failures are reported in the body, not via status.
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  let event: SMWebhookEvent;
  try {
    event = JSON.parse(rawBody) as SMWebhookEvent;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const hasInlineDetails = !!event.details;
  const isTest = hasInlineDetails && config.allowTestPayloads;
  const mode: "live" | "test" = isTest ? "test" : "live";

  // --- signature verification (live only) ---
  if (!isTest) {
    const sig =
      req.headers.get("sm-signature") ||
      req.headers.get("x-sm-signature") ||
      req.headers.get("x-signature");
    const verified = verifyWebhookSignature(rawBody, sig);
    if (verified === false) {
      return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 401 });
    }
    if (verified === null) {
      // No secret configured — allowed but loud, so it never silently ships to prod.
      console.warn(
        "[webhook] SURVEYMONKEY_WEBHOOK_SECRET not set — accepting unverified event"
      );
    }
  }

  // Only act on completed responses (ignore other event types gracefully).
  if (event.event_type && event.event_type !== "response_completed") {
    return NextResponse.json({ ok: true, ignored: event.event_type });
  }

  const responseId = event.object_id || event.details?.id;
  const surveyId = event.resources?.survey_id || event.details?.survey_id;
  const collectorId = event.resources?.collector_id || event.details?.collector_id;

  // --- obtain response details ---
  let details = event.details;
  if (!details) {
    if (!surveyId || !responseId) {
      return NextResponse.json(
        { ok: false, error: "Missing survey_id / response_id and no inline details" },
        { status: 400 }
      );
    }
    try {
      details = await fetchResponseDetails(surveyId, responseId);
    } catch (err) {
      // Do not lose the event: log loudly and 200 so SM doesn't hammer us.
      console.error("[webhook] failed to fetch response details:", (err as Error).message);
      return NextResponse.json({
        ok: false,
        error: "Could not fetch response details",
        detail: (err as Error).message,
        responseId,
      });
    }
  }

  // --- normalize + score ---
  const flat = flattenResponse(details);
  const { raw, unmapped, mappingComplete } = buildRawIntake(flat, event.map);

  const lead = normalizeLead(raw, {
    surveyId,
    responseId,
    collectorId,
    mode,
    userAgent: req.headers.get("user-agent") ?? undefined,
    ip: (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || undefined,
    unmappedAnswers: unmapped,
  });
  if (!mappingComplete) lead.qualification.flags.push("mapping_incomplete");

  // --- deliver + persist (never throw) ---
  const wayco = await forwardToWayco(lead);
  const persisted = await persistLead(lead);

  return NextResponse.json({
    ok: true,
    mode,
    leadId: lead.leadId,
    qualification: lead.qualification,
    persisted,
    integrations: { wayco },
  });
}

/** Health check + recent processed-lead summary (dev convenience). */
export async function GET() {
  const leads = await readLeads(20);
  return NextResponse.json({
    ok: true,
    service: "wayco-surveymonkey-webhook",
    testPayloadsAllowed: config.allowTestPayloads,
    recentLeads: leads.map((l) => ({
      leadId: l.leadId,
      submittedAt: l.submittedAt,
      name: l.claimant.fullName,
      incident: l.incident.typeLabel,
      tier: l.qualification.tier,
      score: l.qualification.score,
    })),
  });
}
