import { describe, it, expect } from "vitest";
import { notifyNewLead } from "@/lib/notify";
import { normalizeLead } from "@/lib/leads";
import { widgetToRawIntake } from "@/lib/intake";

const NOW = new Date("2026-06-30T12:00:00Z");

describe("notifyNewLead (mock mode)", () => {
  it("returns a mock result when ALERT_WEBHOOK_URL is unset", async () => {
    const lead = normalizeLead(
      widgetToRawIntake({ type: "slip_fall", firstName: "B", phone: "2", consent: true }),
      { mode: "live", now: NOW }
    );
    const r = await notifyNewLead(lead);
    expect(r.ok).toBe(true);
    expect(r.mode).toBe("mock");
  });
});

describe("recordResponse (mock mode)", () => {
  it("mock-logs when SurveyMonkey write creds are unset", async () => {
    const { recordResponse } = await import("@/lib/surveymonkey");
    const r = await recordResponse({ firstName: "B", phone: "2" });
    expect(r.ok).toBe(true);
    expect(r.mode).toBe("mock");
  });
});
