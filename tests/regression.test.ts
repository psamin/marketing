import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { flattenResponse, buildRawIntake, type SMWebhookEvent } from "@/lib/surveymonkey";
import { normalizeLead } from "@/lib/leads";

// Locks the exact end-to-end behavior of the SurveyMonkey read pipeline against
// the committed sample fixtures. If scoring or mapping drifts, these fail.
const NOW = new Date("2026-06-30T12:00:00Z");

function runPipeline(file: string) {
  const evt = JSON.parse(
    readFileSync(join(process.cwd(), "samples", file), "utf8")
  ) as SMWebhookEvent;
  const flat = flattenResponse(evt.details!);
  const { raw, mappingComplete } = buildRawIntake(flat, evt.map);
  const lead = normalizeLead(raw, {
    mode: "test",
    surveyId: evt.resources?.survey_id,
    responseId: evt.object_id,
    now: NOW,
  });
  return { lead, mappingComplete };
}

describe("regression: SurveyMonkey sample fixtures", () => {
  it("surveymonkey-webhook.json => hot lead, score 100", () => {
    const { lead, mappingComplete } = runPipeline("surveymonkey-webhook.json");
    expect(mappingComplete).toBe(true);
    expect(lead.claimant.fullName).toBe("Jordan Rivera");
    expect(lead.incident.type).toBe("auto_accident");
    expect(lead.qualification.tier).toBe("hot");
    expect(lead.qualification.score).toBe(100);
    expect(lead.qualification.flags).toEqual([]);
  });

  it("surveymonkey-webhook-no-treatment.json => hot, no treatment, score 88", () => {
    const { lead } = runPipeline("surveymonkey-webhook-no-treatment.json");
    expect(lead.claimant.fullName).toBe("Casey Nguyen");
    expect(lead.incident.type).toBe("slip_and_fall");
    expect(lead.injuries.medicalTreatment).toBe(false);
    expect(lead.qualification.tier).toBe("hot");
    expect(lead.qualification.score).toBe(88);
  });
});
