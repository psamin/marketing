import { IncidentType, RawIntake } from "./leads";

// Maps the landing-page IntakeWidget submission into the canonical RawIntake so
// widget leads flow through the same normalize/score pipeline as SurveyMonkey.
// The widget submits STABLE KEYS (not localized labels) so this is language-proof.

export interface WidgetSubmission {
  type?: string; // canonical key: auto_truck | slip_fall | med_mal | workplace | product | other
  when?: string; // date
  injury?: string; // free text
  treating?: string; // canonical key: yes | not_yet | no
  firstName?: string;
  phone?: string;
  email?: string;
  consent?: boolean;
  lang?: string;
}

const TYPE_TO_INCIDENT: Record<string, IncidentType> = {
  auto_truck: "auto_accident",
  slip_fall: "slip_and_fall",
  med_mal: "medical_malpractice",
  workplace: "workplace_injury",
  product: "product_liability",
  other: "other",
};

export function widgetIncidentType(key: string | undefined): IncidentType {
  return TYPE_TO_INCIDENT[(key || "").trim()] ?? "other";
}

export function widgetToRawIntake(w: WidgetSubmission): RawIntake {
  const treating = (w.treating || "").trim();
  const injury = (w.injury || "").trim();
  const treatingNow = treating === "yes";
  return {
    firstName: (w.firstName || "").trim(),
    lastName: "",
    email: (w.email || "").trim(),
    phone: (w.phone || "").trim(),
    preferredContact: "phone",
    bestTimeToCall: "",
    incidentType: widgetIncidentType(w.type),
    incidentDate: (w.when || "").trim(),
    incidentState: "",
    incidentLocation: "",
    atFault: "unsure",
    policeReport: false,
    description: injury,
    injured: true,
    injuryDescription: injury,
    medicalTreatment: treatingNow,
    treatmentProvider: "",
    ongoingTreatment: treatingNow,
    currentlyRepresented: false,
    insuranceInvolved: false,
    consentTcpa: !!w.consent,
    consentDisclaimer: !!w.consent,
  };
}
