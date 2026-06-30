import { randomUUID } from "crypto";

// ---------------------------------------------------------------------------
// Canonical lead model + qualification. Pure functions, unit-testable.
// ---------------------------------------------------------------------------

export type IncidentType =
  | "auto_accident"
  | "truck_accident"
  | "motorcycle_accident"
  | "slip_and_fall"
  | "medical_malpractice"
  | "workplace_injury"
  | "product_liability"
  | "dog_bite"
  | "wrongful_death"
  | "other";

export type AtFault = "other_party" | "shared" | "me" | "unsure";
export type PreferredContact = "phone" | "text" | "email" | "any";
export type Tier = "hot" | "warm" | "cold" | "disqualified";

export const INCIDENT_LABELS: Record<IncidentType, string> = {
  auto_accident: "Car accident",
  truck_accident: "Truck accident",
  motorcycle_accident: "Motorcycle accident",
  slip_and_fall: "Slip and fall",
  medical_malpractice: "Medical malpractice",
  workplace_injury: "Workplace injury",
  product_liability: "Defective product",
  dog_bite: "Dog bite",
  wrongful_death: "Wrongful death",
  other: "Other injury",
};

export interface RawIntake {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredContact: PreferredContact;
  bestTimeToCall: string;
  incidentType: IncidentType;
  incidentDate: string;
  incidentState: string;
  incidentLocation: string;
  atFault: AtFault;
  policeReport: boolean;
  description: string;
  injured: boolean;
  injuryDescription: string;
  medicalTreatment: boolean;
  treatmentProvider: string;
  ongoingTreatment: boolean;
  currentlyRepresented: boolean;
  insuranceInvolved: boolean;
  consentTcpa: boolean;
  consentDisclaimer: boolean;
}

export interface Qualification {
  score: number;
  tier: Tier;
  flags: string[];
  recommendedAction: string;
}

export interface Lead {
  leadId: string;
  source: string;
  submittedAt: string;
  status: "new";
  claimant: {
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phone: string;
    preferredContact: PreferredContact;
    bestTimeToCall: string;
  };
  incident: {
    type: IncidentType;
    typeLabel: string;
    date: string;
    state: string;
    location: string;
    atFault: AtFault;
    policeReportFiled: boolean;
    description: string;
  };
  injuries: {
    sustained: boolean;
    description: string;
    medicalTreatment: boolean;
    treatmentProvider: string;
    ongoingTreatment: boolean;
  };
  legal: {
    currentlyRepresented: boolean;
    insuranceInvolved: boolean;
  };
  consents: {
    tcpa: boolean;
    noAttorneyClientRelationship: boolean;
  };
  qualification: Qualification;
  raw: {
    surveyId?: string;
    responseId?: string;
    collectorId?: string;
    mode: "live" | "test";
    unmappedAnswers?: Record<string, string[]>;
  };
  meta: {
    userAgent?: string;
    ip?: string;
  };
}

// ---- coercion helpers --------------------------------------------------------

export function yesish(v: string | boolean | undefined | null): boolean {
  if (typeof v === "boolean") return v;
  if (!v) return false;
  return /^(y|yes|true|1|yep|yeah|correct|i (do|agree|consent)|agree)/i.test(
    String(v).trim()
  );
}

export function parseIncidentType(v: string | undefined): IncidentType {
  const s = (v || "").toLowerCase();
  if (!s) return "other";
  if (/truck|semi|18.?wheeler/.test(s)) return "truck_accident";
  if (/motorcycle|motorbike|bike/.test(s)) return "motorcycle_accident";
  if (/car|auto|vehicle|crash|collision|rear.?end/.test(s)) return "auto_accident";
  if (/slip|trip|fall|premises/.test(s)) return "slip_and_fall";
  if (/malpractice|medical|hospital|doctor|surger/.test(s)) return "medical_malpractice";
  if (/work|job|construction|osha|workers/.test(s)) return "workplace_injury";
  if (/product|defect|recall/.test(s)) return "product_liability";
  if (/dog|animal|bite/.test(s)) return "dog_bite";
  if (/death|wrongful|died|deceased|fatal/.test(s)) return "wrongful_death";
  return "other";
}

export function parseAtFault(v: string | undefined): AtFault {
  const s = (v || "").toLowerCase();
  if (/other|they|someone else|the other/.test(s)) return "other_party";
  if (/both|shared|partly|partial/.test(s)) return "shared";
  if (/\bme\b|myself|my fault|i was|i am/.test(s)) return "me";
  return "unsure";
}

export function parsePreferredContact(v: string | undefined): PreferredContact {
  const s = (v || "").toLowerCase();
  if (/text|sms/.test(s)) return "text";
  if (/email|e-mail/.test(s)) return "email";
  if (/phone|call/.test(s)) return "phone";
  return "any";
}

// Days between an incident date string and now. null when unparseable.
export function daysSince(dateStr: string, now: Date = new Date()): number | null {
  if (!dateStr) return null;
  const t = Date.parse(dateStr);
  if (Number.isNaN(t)) return null;
  const ms = now.getTime() - t;
  return Math.floor(ms / 86_400_000);
}

// ---- qualification -----------------------------------------------------------

export function qualify(raw: RawIntake, now: Date = new Date()): Qualification {
  const flags: string[] = [];

  // Hard disqualifier: already represented is a conflict — do not solicit.
  if (raw.currentlyRepresented) {
    flags.push("currently_represented");
    return {
      score: 0,
      tier: "disqualified",
      flags,
      recommendedAction:
        "Do not solicit — claimant reports existing representation. Route to conflicts review.",
    };
  }

  let score = 50;

  // Injuries + treatment are the strongest value signal.
  if (raw.injured && raw.medicalTreatment) score += 25;
  else if (raw.injured) score += 8;
  else {
    score -= 15;
    flags.push("no_injury_reported");
  }
  if (raw.ongoingTreatment) score += 5;

  // Liability.
  switch (raw.atFault) {
    case "other_party":
      score += 15;
      break;
    case "shared":
      score += 5;
      break;
    case "me":
      score -= 20;
      flags.push("claimant_at_fault");
      break;
    default:
      break;
  }
  if (raw.policeReport) score += 5;
  if (raw.insuranceInvolved) score += 5;

  // Recency / statute-of-limitations triage (heuristic, not legal advice).
  const days = daysSince(raw.incidentDate, now);
  if (days === null) {
    flags.push("incident_date_unparsed");
  } else if (days < 0) {
    flags.push("incident_date_in_future");
  } else if (days <= 30) score += 15;
  else if (days <= 180) score += 10;
  else if (days <= 730) score += 3;
  else {
    score -= 10;
    flags.push("aging_claim_check_sol");
  }

  // Data quality / compliance flags.
  if (!raw.consentTcpa) flags.push("missing_tcpa_consent");
  if (!raw.email && !raw.phone) flags.push("missing_contact");

  score = Math.max(0, Math.min(100, Math.round(score)));

  let tier: Tier;
  if (score >= 70) tier = "hot";
  else if (score >= 45) tier = "warm";
  else tier = "cold";

  const recommendedAction =
    tier === "hot"
      ? "Call within 15 minutes — high-intent, strong-liability lead."
      : tier === "warm"
        ? "Call within 1 hour — qualify further on the phone."
        : "Add to nurture queue — call within 1 business day.";

  return { score, tier, flags, recommendedAction };
}

// ---- normalization -----------------------------------------------------------

export interface NormalizeOptions {
  surveyId?: string;
  responseId?: string;
  collectorId?: string;
  mode: "live" | "test";
  userAgent?: string;
  ip?: string;
  unmappedAnswers?: Record<string, string[]>;
  now?: Date;
}

export function normalizeLead(raw: RawIntake, opts: NormalizeOptions): Lead {
  const now = opts.now ?? new Date();
  const qualification = qualify(raw, now);
  const fullName = [raw.firstName, raw.lastName].filter(Boolean).join(" ").trim();

  return {
    leadId: randomUUID(),
    source: "wayco-web-intake/surveymonkey",
    submittedAt: now.toISOString(),
    status: "new",
    claimant: {
      firstName: raw.firstName,
      lastName: raw.lastName,
      fullName: fullName || "Unknown claimant",
      email: raw.email,
      phone: raw.phone,
      preferredContact: raw.preferredContact,
      bestTimeToCall: raw.bestTimeToCall,
    },
    incident: {
      type: raw.incidentType,
      typeLabel: INCIDENT_LABELS[raw.incidentType],
      date: raw.incidentDate,
      state: raw.incidentState,
      location: raw.incidentLocation,
      atFault: raw.atFault,
      policeReportFiled: raw.policeReport,
      description: raw.description,
    },
    injuries: {
      sustained: raw.injured,
      description: raw.injuryDescription,
      medicalTreatment: raw.medicalTreatment,
      treatmentProvider: raw.treatmentProvider,
      ongoingTreatment: raw.ongoingTreatment,
    },
    legal: {
      currentlyRepresented: raw.currentlyRepresented,
      insuranceInvolved: raw.insuranceInvolved,
    },
    consents: {
      tcpa: raw.consentTcpa,
      noAttorneyClientRelationship: raw.consentDisclaimer,
    },
    qualification,
    raw: {
      surveyId: opts.surveyId,
      responseId: opts.responseId,
      collectorId: opts.collectorId,
      mode: opts.mode,
      unmappedAnswers: opts.unmappedAnswers,
    },
    meta: {
      userAgent: opts.userAgent,
      ip: opts.ip,
    },
  };
}
