import { describe, it, expect } from "vitest";
import { widgetToRawIntake, widgetIncidentType } from "@/lib/intake";
import { normalizeLead } from "@/lib/leads";

const NOW = new Date("2026-06-30T12:00:00Z");

describe("widgetIncidentType", () => {
  it("maps stable keys to incident types (language-proof)", () => {
    expect(widgetIncidentType("auto_truck")).toBe("auto_accident");
    expect(widgetIncidentType("slip_fall")).toBe("slip_and_fall");
    expect(widgetIncidentType("med_mal")).toBe("medical_malpractice");
    expect(widgetIncidentType("workplace")).toBe("workplace_injury");
    expect(widgetIncidentType("product")).toBe("product_liability");
    expect(widgetIncidentType("other")).toBe("other");
    expect(widgetIncidentType("garbage")).toBe("other");
    expect(widgetIncidentType(undefined)).toBe("other");
  });
});

describe("widgetToRawIntake", () => {
  it("maps a treating=yes submission to treatment + ongoing", () => {
    const raw = widgetToRawIntake({
      type: "auto_truck",
      treating: "yes",
      injury: "neck pain",
      firstName: "Sam",
      phone: "5551234",
      email: "s@e.com",
      when: "2026-06-20",
      consent: true,
    });
    expect(raw.incidentType).toBe("auto_accident");
    expect(raw.medicalTreatment).toBe(true);
    expect(raw.ongoingTreatment).toBe(true);
    expect(raw.description).toBe("neck pain");
    expect(raw.injuryDescription).toBe("neck pain");
    expect(raw.incidentDate).toBe("2026-06-20");
    expect(raw.injured).toBe(true);
    expect(raw.consentTcpa).toBe(true);
    expect(raw.consentDisclaimer).toBe(true);
  });

  it("treating not_yet/no => no treatment; missing consent => false", () => {
    expect(widgetToRawIntake({ treating: "not_yet" }).medicalTreatment).toBe(false);
    expect(widgetToRawIntake({ treating: "no" }).ongoingTreatment).toBe(false);
    expect(widgetToRawIntake({}).consentTcpa).toBe(false);
  });

  it("normalizes + scores a widget lead (hot)", () => {
    const lead = normalizeLead(
      widgetToRawIntake({
        type: "auto_truck",
        treating: "yes",
        when: "2026-06-20",
        firstName: "Sam",
        phone: "5551234",
        consent: true,
      }),
      { mode: "live", source: "wayco-intake-widget", now: NOW }
    );
    // base 50 + treated 25 + ongoing 5 + recency 15 (10 days) = 95 -> hot
    expect(lead.qualification.tier).toBe("hot");
    expect(lead.source).toBe("wayco-intake-widget");
  });
});
