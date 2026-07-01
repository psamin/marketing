import { createHmac, timingSafeEqual } from "crypto";
import { config } from "./config";
import {
  RawIntake,
  parseAtFault,
  parseIncidentType,
  parsePreferredContact,
  yesish,
} from "./leads";

// ---------------------------------------------------------------------------
// SurveyMonkey adapter: webhook signature verification, response-detail fetch,
// answer flattening, and mapping to the canonical RawIntake.
// ---------------------------------------------------------------------------

// SurveyMonkey "details" response shape (subset we rely on).
export interface SMAnswer {
  text?: string;
  simple_text?: string;
  choice_id?: string;
  row_id?: string;
  other_id?: string;
}
export interface SMQuestion {
  id: string;
  answers?: SMAnswer[];
}
export interface SMPage {
  id?: string;
  questions?: SMQuestion[];
}
export interface SMResponseDetails {
  id?: string;
  survey_id?: string;
  collector_id?: string;
  pages?: SMPage[];
}

// SurveyMonkey webhook event shape (subset).
export interface SMWebhookEvent {
  object_type?: string;
  object_id?: string; // response id
  event_type?: string;
  resources?: {
    survey_id?: string;
    collector_id?: string;
    respondent_id?: string;
  };
  // Test-only: inline details + map so the pipeline runs without SurveyMonkey.
  details?: SMResponseDetails;
  map?: Record<string, string>;
}

/**
 * Verify an incoming webhook with HMAC-SHA256 over the raw body.
 * Returns true/false when a secret is configured, or null when verification is
 * not configured (caller decides whether to allow that).
 */
export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string = config.surveymonkey.webhookSecret
): boolean | null {
  if (!secret) return null;
  if (!signatureHeader) return false;
  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signatureHeader.trim());
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Fetch the full response detail from the SurveyMonkey API. */
export async function fetchResponseDetails(
  surveyId: string,
  responseId: string
): Promise<SMResponseDetails> {
  const token = config.surveymonkey.accessToken;
  if (!token) {
    throw new Error("SURVEYMONKEY_ACCESS_TOKEN is not set — cannot fetch response details");
  }
  const url = `${config.surveymonkey.apiBase}/surveys/${surveyId}/responses/${responseId}/details`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`SurveyMonkey API ${res.status}: ${body.slice(0, 300)}`);
  }
  return (await res.json()) as SMResponseDetails;
}

/** Flatten pages -> questions -> answers into { questionId: string[] } plus all text. */
export function flattenResponse(details: SMResponseDetails): {
  byQuestion: Record<string, string[]>;
  allText: string[];
} {
  const byQuestion: Record<string, string[]> = {};
  const allText: string[] = [];
  for (const page of details.pages ?? []) {
    for (const q of page.questions ?? []) {
      const vals: string[] = [];
      for (const a of q.answers ?? []) {
        const v = a.text ?? a.simple_text ?? a.choice_id ?? a.row_id ?? a.other_id;
        if (v) {
          vals.push(String(v));
          allText.push(String(v));
        }
      }
      if (vals.length) byQuestion[q.id] = vals;
    }
  }
  return { byQuestion, allText };
}

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const PHONE_RE = /(\+?\d[\d\s().-]{6,}\d)/;

/** Resolve the field->questionId map from an inline map or the env JSON. */
function resolveMap(inlineMap?: Record<string, string>): Record<string, string> {
  if (inlineMap && Object.keys(inlineMap).length) return inlineMap;
  const raw = config.surveymonkey.questionMap;
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    console.warn("[surveymonkey] SURVEYMONKEY_QUESTION_MAP is not valid JSON — ignoring");
    return {};
  }
}

/**
 * Map flattened SurveyMonkey answers to the canonical RawIntake.
 * Falls back to heuristic email/phone detection and records every unmapped
 * question so nothing is ever silently lost.
 */
export function buildRawIntake(
  flat: { byQuestion: Record<string, string[]>; allText: string[] },
  inlineMap?: Record<string, string>
): { raw: RawIntake; unmapped: Record<string, string[]>; mappingComplete: boolean } {
  const map = resolveMap(inlineMap);
  const mappedQuestionIds = new Set(Object.values(map));
  const get = (field: string): string => {
    const qid = map[field];
    if (!qid) return "";
    return (flat.byQuestion[qid]?.[0] ?? "").trim();
  };

  let email = get("email");
  let phone = get("phone");
  if (!email) email = flat.allText.find((t) => EMAIL_RE.test(t))?.match(EMAIL_RE)?.[0] ?? "";
  if (!phone) {
    const cand = flat.allText.find((t) => PHONE_RE.test(t) && !EMAIL_RE.test(t));
    phone = cand?.match(PHONE_RE)?.[0]?.trim() ?? "";
  }

  const raw: RawIntake = {
    firstName: get("firstName"),
    lastName: get("lastName"),
    email,
    phone,
    preferredContact: parsePreferredContact(get("preferredContact")),
    bestTimeToCall: get("bestTimeToCall"),
    incidentType: parseIncidentType(get("incidentType")),
    incidentDate: get("incidentDate"),
    incidentState: get("incidentState"),
    incidentLocation: get("incidentLocation"),
    atFault: parseAtFault(get("atFault")),
    policeReport: yesish(get("policeReport")),
    description: get("description"),
    injured: get("injured") ? yesish(get("injured")) : true,
    injuryDescription: get("injuryDescription"),
    medicalTreatment: yesish(get("medicalTreatment")),
    treatmentProvider: get("treatmentProvider"),
    ongoingTreatment: yesish(get("ongoingTreatment")),
    currentlyRepresented: yesish(get("currentlyRepresented")),
    insuranceInvolved: yesish(get("insuranceInvolved")),
    consentTcpa: yesish(get("consentTcpa")),
    consentDisclaimer: yesish(get("consentDisclaimer")),
  };

  // Everything not claimed by the map is preserved for the call team.
  const unmapped: Record<string, string[]> = {};
  for (const [qid, vals] of Object.entries(flat.byQuestion)) {
    if (!mappedQuestionIds.has(qid)) unmapped[qid] = vals;
  }

  const mappingComplete = Object.keys(map).length > 0;
  return { raw, unmapped, mappingComplete };
}

// ---------------------------------------------------------------------------
// Pull / extraction API helpers (require SURVEYMONKEY_ACCESS_TOKEN).
// ---------------------------------------------------------------------------

export interface SMSurveyQuestion {
  id: string;
  heading: string;
  family?: string;
  subtype?: string;
  choices?: { id: string; text: string }[];
}

function authHeaders(): HeadersInit {
  const token = config.surveymonkey.accessToken;
  if (!token) throw new Error("SURVEYMONKEY_ACCESS_TOKEN is not set");
  return { Authorization: `Bearer ${token}`, Accept: "application/json" };
}

async function smGet<T>(path: string): Promise<T> {
  const res = await fetch(`${config.surveymonkey.apiBase}${path}`, { headers: authHeaders() });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`SurveyMonkey API ${res.status}: ${body.slice(0, 300)}`);
  }
  return (await res.json()) as T;
}

/** List surveys on the account (to find the numeric survey id). */
export async function listSurveys(): Promise<{ id: string; title: string }[]> {
  const data = await smGet<{ data?: { id: string | number; title?: string }[] }>(
    "/surveys?per_page=100"
  );
  return (data.data ?? []).map((s) => ({ id: String(s.id), title: s.title ?? "" }));
}

/** Fetch a survey's question structure — used to build the field->question map. */
export async function fetchSurveyStructure(
  surveyId: string
): Promise<{ surveyId: string; title: string; questions: SMSurveyQuestion[] }> {
  const data = await smGet<{
    title?: string;
    pages?: {
      questions?: {
        id: string | number;
        family?: string;
        subtype?: string;
        headings?: { heading?: string }[];
        answers?: { choices?: { id: string | number; text?: string }[] };
      }[];
    }[];
  }>(`/surveys/${surveyId}/details`);

  const questions: SMSurveyQuestion[] = [];
  for (const page of data.pages ?? []) {
    for (const q of page.questions ?? []) {
      questions.push({
        id: String(q.id),
        heading: q.headings?.[0]?.heading ?? "",
        family: q.family,
        subtype: q.subtype,
        choices: (q.answers?.choices ?? []).map((c) => ({ id: String(c.id), text: c.text ?? "" })),
      });
    }
  }
  return { surveyId, title: data.title ?? "", questions };
}

/** Pull all responses for a survey (paginated, simple text), newest first. */
export async function fetchAllResponses(surveyId: string, max = 500): Promise<SMResponseDetails[]> {
  const out: SMResponseDetails[] = [];
  let path: string | null = `/surveys/${surveyId}/responses/bulk?per_page=100&simple=true&sort_order=DESC`;
  while (path && out.length < max) {
    const data: { data?: SMResponseDetails[]; links?: { next?: string } } = await smGet(path);
    for (const r of data.data ?? []) out.push(r);
    const next = data.links?.next;
    // links.next is an absolute URL; strip the apiBase so smGet can re-append it.
    path = next ? next.replace(config.surveymonkey.apiBase, "") : null;
  }
  return out.slice(0, max);
}

export interface RecordResult {
  ok: boolean;
  mode: "live" | "mock";
  reference?: string;
  detail?: string;
}

/**
 * Record a response into SurveyMonkey (the custom intake widget feeding SM as
 * system-of-record). `answers` is keyed by canonical field; SURVEYMONKEY_SUBMIT_MAP
 * (field -> question_id) decides which land in the survey. Text answers only —
 * choice questions need choice_ids and should map to open-text fields. Requires
 * token + collector id + submit map; mock-logs otherwise. Never throws.
 */
export async function recordResponse(answers: Record<string, string>): Promise<RecordResult> {
  const token = config.surveymonkey.accessToken;
  const collectorId = config.surveymonkey.collectorId;
  const rawMap = config.surveymonkey.submitMap;

  if (!token || !collectorId || !rawMap) {
    console.log("[surveymonkey] (mock) would record response:", JSON.stringify(answers).slice(0, 300));
    return { ok: true, mode: "mock" };
  }

  let map: Record<string, string>;
  try {
    map = JSON.parse(rawMap);
  } catch {
    return { ok: false, mode: "live", detail: "SURVEYMONKEY_SUBMIT_MAP is not valid JSON" };
  }

  const questions = Object.entries(answers)
    .filter(([field, val]) => map[field] && String(val).trim())
    .map(([field, val]) => ({ id: map[field], answers: [{ text: String(val) }] }));
  if (!questions.length) return { ok: false, mode: "live", detail: "no mapped answers to submit" };

  try {
    const res = await fetch(`${config.surveymonkey.apiBase}/collectors/${collectorId}/responses`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ pages: [{ questions }] }),
    });
    if (!res.ok) {
      const b = await res.text().catch(() => "");
      return { ok: false, mode: "live", detail: `HTTP ${res.status}: ${b.slice(0, 200)}` };
    }
    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { ok: true, mode: "live", reference: data.id };
  } catch (err) {
    return { ok: false, mode: "live", detail: (err as Error).message };
  }
}
