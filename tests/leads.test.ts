import { describe, it, expect } from "vitest";
import {
  yesish,
  parseIncidentType,
  parseAtFault,
  parsePreferredContact,
  daysSince,
  qualify,
  normalizeLead,
  INCIDENT_LABELS,
  type RawIntake,
} from "@/lib/leads";

const NOW = new Date("2026-06-30T12:00:00Z");

function base(overrides: Partial<RawIntake> = {}): RawIntake {
  return {
    firstName: "Jordan",
    lastName: "Rivera",
    email: "j@example.com",
    phone: "3125550142",
    preferredContact: "phone",
    bestTimeToCall: "",
    incidentType: "auto_accident",
    incidentDate: "2026-06-20",
    incidentState: "IL",
    incidentLocation: "",
    atFault: "other_party",
    policeReport: true,
    description: "rear-ended",
    injured: true,
    injuryDescription: "whiplash",
    medicalTreatment: true,
    treatmentProvider: "ER",
    ongoingTreatment: true,
    currentlyRepresented: false,
    insuranceInvolved: true,
    consentTcpa: true,
    consentDisclaimer: true,
    ...overrides,
  };
}

describe("yesish", () => {
  it("recognizes affirmatives", () => {
    for (const v of [true, "yes", "Yes", "YES", "true", "1", "I agree"]) {
      expect(yesish(v)).toBe(true);
    }
  });
  it("rejects negatives / empty", () => {
    for (const v of [false, "no", "No", "", "nope", undefined, null]) {
      expect(yesish(v as string | boolean | undefined)).toBe(false);
    }
  });
});

describe("parseIncidentType", () => {
  it("classifies common phrasings", () => {
    expect(parseIncidentType("Car accident")).toBe("auto_accident");
    expect(parseIncidentType("18-wheeler truck")).toBe("truck_accident");
    expect(parseIncidentType("motorcycle crash")).toBe("motorcycle_accident");
    expect(parseIncidentType("slip and fall")).toBe("slip_and_fall");
    expect(parseIncidentType("medical malpractice")).toBe("medical_malpractice");
    expect(parseIncidentType("workplace injury")).toBe("workplace_injury");
    expect(parseIncidentType("defective product")).toBe("product_liability");
    expect(parseIncidentType("dog bite")).toBe("dog_bite");
    expect(parseIncidentType("wrongful death")).toBe("wrongful_death");
    expect(parseIncidentType("something odd")).toBe("other");
    expect(parseIncidentType("")).toBe("other");
  });
});

describe("parseAtFault / parsePreferredContact", () => {
  it("classifies fault", () => {
    expect(parseAtFault("The other driver")).toBe("other_party");
    expect(parseAtFault("both of us, shared")).toBe("shared");
    expect(parseAtFault("it was my fault")).toBe("me");
    expect(parseAtFault("not sure")).toBe("unsure");
  });
  it("classifies preferred contact", () => {
    expect(parsePreferredContact("Text me")).toBe("text");
    expect(parsePreferredContact("email please")).toBe("email");
    expect(parsePreferredContact("phone call")).toBe("phone");
    expect(parsePreferredContact("whatever")).toBe("any");
  });
});

describe("daysSince", () => {
  it("computes whole days and handles bad input", () => {
    expect(daysSince("2026-06-20", NOW)).toBe(10);
    expect(daysSince("", NOW)).toBeNull();
    expect(daysSince("not-a-date", NOW)).toBeNull();
  });
});

describe("qualify", () => {
  it("disqualifies a represented claimant (conflict)", () => {
    const q = qualify(base({ currentlyRepresented: true }), NOW);
    expect(q.tier).toBe("disqualified");
    expect(q.score).toBe(0);
    expect(q.flags).toContain("currently_represented");
  });
  it("scores a recent, treated, clear-liability lead hot", () => {
    const q = qualify(base(), NOW);
    expect(q.tier).toBe("hot");
    expect(q.score).toBe(100);
    expect(q.flags).toEqual([]);
  });
  it("flags no injury reported", () => {
    const q = qualify(base({ injured: false, medicalTreatment: false }), NOW);
    expect(q.flags).toContain("no_injury_reported");
  });
  it("penalizes and flags claimant-at-fault", () => {
    const q = qualify(base({ atFault: "me" }), NOW);
    expect(q.flags).toContain("claimant_at_fault");
  });
  it("flags an aging claim for statute-of-limitations review", () => {
    const q = qualify(base({ incidentDate: "2022-01-01" }), NOW);
    expect(q.flags).toContain("aging_claim_check_sol");
  });
  it("flags missing consent and missing contact", () => {
    const q = qualify(base({ consentTcpa: false, email: "", phone: "" }), NOW);
    expect(q.flags).toContain("missing_tcpa_consent");
    expect(q.flags).toContain("missing_contact");
  });
  it("clamps score to 0..100", () => {
    const q = qualify(base(), NOW);
    expect(q.score).toBeGreaterThanOrEqual(0);
    expect(q.score).toBeLessThanOrEqual(100);
  });
});

describe("normalizeLead", () => {
  it("builds a canonical lead", () => {
    const lead = normalizeLead(base(), { mode: "test", now: NOW });
    expect(lead.claimant.fullName).toBe("Jordan Rivera");
    expect(lead.incident.typeLabel).toBe(INCIDENT_LABELS.auto_accident);
    expect(lead.consents.tcpa).toBe(true);
    expect(lead.status).toBe("new");
    expect(lead.raw.mode).toBe("test");
    expect(lead.submittedAt).toBe(NOW.toISOString());
    expect(lead.leadId).toMatch(/^[0-9a-f-]{36}$/);
    expect(lead.qualification.tier).toBe("hot");
  });
  it("honors a custom source", () => {
    const lead = normalizeLead(base(), { mode: "live", source: "wayco-intake-widget", now: NOW });
    expect(lead.source).toBe("wayco-intake-widget");
  });
});
