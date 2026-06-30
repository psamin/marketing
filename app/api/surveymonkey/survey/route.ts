import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";
import { authorizeInternal, tokenFromRequest } from "@/lib/auth";
import { fetchSurveyStructure, listSurveys } from "@/lib/surveymonkey";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Read a survey's structure from the SurveyMonkey API.
 *  - GET /api/surveymonkey/survey?list=1  -> list surveys (find the numeric id)
 *  - GET /api/surveymonkey/survey[?surveyId=] -> question structure + a map skeleton
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
          "SURVEYMONKEY_ACCESS_TOKEN not set. Create a private-app token in SurveyMonkey (Settings → API) to read survey structure.",
      },
      { status: 501 }
    );
  }

  const url = new URL(req.url);
  try {
    if (url.searchParams.get("list") === "1") {
      return NextResponse.json({ ok: true, surveys: await listSurveys() });
    }

    const surveyId = url.searchParams.get("surveyId") || config.surveymonkey.surveyId;
    if (!surveyId) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "No survey id. Pass ?surveyId= or set SURVEYMONKEY_SURVEY_ID. Use ?list=1 to find it (the /r/ weblink slug is not the id).",
        },
        { status: 400 }
      );
    }

    const structure = await fetchSurveyStructure(surveyId);
    return NextResponse.json({
      ok: true,
      ...structure,
      // Paste into SURVEYMONKEY_QUESTION_MAP after filling in the `field` values.
      mapSkeleton: structure.questions.map((q) => ({
        field: "",
        question_id: q.id,
        heading: q.heading,
      })),
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 502 });
  }
}
