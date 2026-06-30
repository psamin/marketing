# Wayco — Personal Injury Intake: Build Plan (Approach B)

## Goal
A marketing site that converts injured visitors into qualified, callable leads for Wayco (a
personal injury law firm). Three deliverables:

1. **Landing page** (`/`) — marketing page that builds trust and drives visitors to the intake.
2. **Intake form** (`/intake`) — a separate page that **embeds the real SurveyMonkey survey**;
   SurveyMonkey is the intake collection system-of-record.
3. **Intake API** (`POST /api/surveymonkey/webhook`) — a thin webhook receiver: SurveyMonkey
   fires a webhook on response completion → we normalize the response into canonical lead JSON,
   score/tier it, and forward it to the **Wayco intake platform** so the call team works a
   prioritized queue.

## Architecture (Approach B — chosen in /office-hours)
```
visitor ─▶ /intake (embedded SurveyMonkey survey) ─▶ SurveyMonkey collects response
                                                          │ webhook: response_completed
                                                          ▼
   POST /api/surveymonkey/webhook ─ verify sig ─ fetch response details (SM API)
        └─ flatten pages→questions→answers ─ map (question_id→field) ─ normalize
             └─ score/tier lead ─▶ forward JSON to Wayco  +  persist locally (dev)
```
Everything is env-driven and degrades to **mock/test mode** so the full pipeline runs and QAs
with zero external credentials.

## Stack
- **Next.js 15 (App Router) + React 19 + TypeScript**
- **zod** for outgoing lead validation
- Hand-authored design system in `globals.css` (system sans body + serif headings; navy + gold).
- System fonts only (no external font fetch) so it builds/QAs offline.

## Pages & routes
| Route | Type | Purpose |
|-------|------|---------|
| `/` | server | Landing/marketing: hero, trust bar, practice areas, how-it-works, why-us, testimonials, FAQ, final CTA, disclaimers |
| `/intake` | server + client embed | Embeds SurveyMonkey survey via `NEXT_PUBLIC_SM_SURVEY_URL`; styled setup placeholder when unset; TCPA + no-attorney-client disclaimers |
| `/thank-you` | server | Post-submit confirmation + next steps |
| `/leads` | server (token-gated) | Call-team view: persisted leads sorted hot→warm→cold with score, flags, recommended SLA (added in CEO review) |
| `/api/surveymonkey/webhook` | route handler | `POST` verify+parse+fetch+normalize+score+forward; `GET` health + recent leads (dev) |

## Webhook receiver responsibilities
1. **Verify** the SurveyMonkey webhook signature (HMAC, configurable secret; skipped in test mode).
2. **Parse** the event (`response_completed`) → `survey_id`, `collector_id`, `response_id`.
3. **Fetch** full response details from the SM API (`GET /v3/surveys/{id}/responses/{id}/details`)
   using `SURVEYMONKEY_ACCESS_TOKEN`. In test mode, accept inline `details` in the POST body.
4. **Flatten** pages→questions→answers into `{ questionId: answerText[] }` (generic; works on any
   survey).
5. **Map** question IDs → canonical fields via `SURVEYMONKEY_QUESTION_MAP` (env JSON). Falls back
   to heuristic detection (email/phone patterns) + raw passthrough when no map is set.
6. **Normalize** → canonical lead, **score/tier**, **forward** to Wayco, **persist** locally.

## Intake fields captured by the SurveyMonkey survey (PI-specific)
- Incident: type, date, state, location, who was at fault, police report filed, description.
- Injuries: injured?, injury description, received medical treatment?, provider, ongoing?
- Legal: currently represented by an attorney? (conflict check), insurance involved?
- Contact: first/last name, email, phone, preferred contact, best time to call.
- Consents (required): TCPA consent to contact; acknowledgement no attorney-client relationship.

## Lead qualification ("organize into leads to call up")
- **disqualified** — already represented (conflict) → route to conflicts review, do not solicit.
- **hot** (≥70) — call within 15 min. **warm** (45–69) — call within 1 hour.
- **cold** (<45) — nurture, call within 1 business day.
Signals: injury + treatment, liability (other party at fault), recency (statute-of-limitations
flag on aging claims), police report, insurance involved, ongoing treatment.

## Integrations (env-driven, graceful mock fallback)
- `lib/surveymonkey.ts` — `verifyWebhook`, `fetchResponseDetails`, `flattenResponse`. Live when
  `SURVEYMONKEY_ACCESS_TOKEN` set; else uses inline test details / mock.
- `lib/wayco.ts` — `forwardToWayco(lead)`: live POST when `WAYCO_INTAKE_URL` set (bearer/x-api-key);
  else mock.
- `lib/store.ts` — best-effort local `data/leads.jsonl` append for dev/demo.
- Downstream failures never drop the webhook ack; per-call catch; status reported in response.

## Canonical lead JSON (forwarded to Wayco)
`{ leadId, source, submittedAt, status, claimant{}, incident{}, injuries{}, legal{}, consents{},
qualification{ score, tier, flags[], recommendedAction }, raw{ surveyId, responseId }, meta{} }`

## Compliance / trust
- Footer + intake disclaimers: Attorney Advertising; informational only; no attorney-client
  relationship formed by submitting; prior results don't guarantee outcome; privacy.
- TCPA consent captured explicitly (in the SurveyMonkey survey) and stored on the lead.

## Testability (no external creds needed)
- Webhook accepts a test payload with inline `details` → exercises flatten/map/normalize/score/
  forward end-to-end in mock mode. A sample payload ships in `samples/` for `/qa`.

## gstack workflow (requested order)
office-hours ✅ → plan-ceo-review ✅ → plan-eng-review → plan-design-review → **build** → qa → review → push.

## Scope Decisions (plan-ceo-review, SELECTIVE EXPANSION)
| # | Proposal | Effort | Decision | Reasoning |
|---|----------|--------|----------|-----------|
| 1 | Call-team `/leads` view (token-gated) | S | **ACCEPTED** | Turns persisted leads into a prioritized callable queue — the literal "organize into leads to call up" ask |
| 2 | Webhook idempotency + dead-letter | S | DEFERRED → TODOS | Reliability backbone; not blocking for v1 demo |
| 3 | Hot-lead instant alert (email/Slack) | M | DEFERRED → TODOS | Needs alert webhook; serves 15-min SLA later |
| 4 | Conversion analytics (UTM + funnel) | S | DEFERRED → TODOS | Marketing attribution; additive |

## GSTACK REVIEW REPORT
| Run | Status | Findings |
|-----|--------|----------|
| plan-ceo-review (SELECTIVE EXPANSION) | DONE | 6 risk findings below; 1 expansion accepted, 3 deferred |

**Key risk findings (carried into the build):**
1. **Test-mode auth bypass** — webhook signature verification is skipped in test mode; test mode must be gated behind `NODE_ENV !== 'production'` + an explicit flag so prod can never accept unsigned events.
2. **SurveyMonkey sends IDs, not answers** — webhook must fetch response details via the SM API; on missing/expired token, log loudly and (in test mode) use inline details. Never silently drop the event.
3. **Mapping fragility** — when `SURVEYMONKEY_QUESTION_MAP` is unset, flatten everything into `raw[]` and heuristically detect email/phone; flag `mapping_incomplete` so no answer is lost.
4. **Consent capture** — TCPA + no-attorney-client consent must come from the survey; normalizer flags `missing_tcpa_consent` if absent.
5. **PII at rest** — leads carry sensitive injury/contact PII; `data/leads.jsonl` is gitignored and dev-only; `/leads` must be token-gated (constant-time compare) and disabled in prod when no token is set.
6. **SOL flag is heuristic** — statute-of-limitations varies by state/claim; the `aging_claim_check_sol` flag is triage signal, not legal advice — labeled as such for the call team.

VERDICT: APPROVED — proceed to eng + design review, then build.

NO UNRESOLVED DECISIONS
