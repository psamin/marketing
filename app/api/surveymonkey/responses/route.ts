import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";
import { authorizeInternal, tokenFromRequest } from "@/lib/auth";
import { buildRawIntake, fetchAllResponses, flattenResponse } from "@/lib/surveymonkey";
import { Lead, normalizeLead } from "@/lib/leads";
import { forwardToWayco } from "@/lib/wayco";
import { notifyNewLead } from "@/lib/notify";
import { persistLead } from "@/lib/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Pull all responses for a survey from the SurveyMonkey API and return them as
 * normalized, scored lead JSON (the organized extraction the call team needs).
 *  - GET /api/surveymonkey/responses[?surveyId=]        -> extract + return leads
 *  - GET /api/surveymonkey/responses?deliver=1          -> also forward to Wayco,
 *                                                          persist, and notify
 *
 * Requires SURVEYMONKEY_ACCESS_TOKEN; gated by LEADS_ACCESS_TOKEN.
 */
export async function GET(req: NextRequest) {
  const denied = authorizeInternal(tokenFromRequest(req));
  if (denied) return NextResponse.json({ ok: false, error: denied }, { status: 401 });

  if (!config.surveymonkey.accessToken) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "SURVEYMONKEY_ACCESS_TOKEN not set. The public /r/ weblink exposes no data — extracting responses requires a SurveyMonkey API token.",
      },
      { status: 501 }
    );
  }

  const url = new URL(req.url);
  const surveyId = url.searchParams.get("surveyId") || config.surveymonkey.surveyId;
  if (!surveyId) {
    return NextResponse.json(
      { ok: false, error: "No survey id. Pass ?surveyId= or set SURVEYMONKEY_SURVEY_ID." },
      { status: 400 }
    );
  }
  const deliver = url.searchParams.get("deliver") === "1";

  try {
    const responses = await fetchAllResponses(surveyId);
    const leads: Lead[] = [];
    for (const details of responses) {
      const flat = flattenResponse(details);
      const { raw, unmapped, mappingComplete } = buildRawIntake(flat);
      const lead = normalizeLead(raw, {
        surveyId,
        responseId: details.id,
        collectorId: details.collector_id,
        mode: "live",
        unmappedAnswers: unmapped,
      });
      if (!mappingComplete) lead.qualification.flags.push("mapping_incomplete");
      if (deliver) {
        await forwardToWayco(lead);
        await persistLead(lead);
        await notifyNewLead(lead);
      }
      leads.push(lead);
    }
    return NextResponse.json({ ok: true, surveyId, count: leads.length, delivered: deliver, leads });
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 502 });
  }
}
