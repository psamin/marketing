# Wayco Injury Law — Marketing Site + Intake Pipeline

Next.js app for **Wayco**, a personal injury practice. It converts injured visitors into
qualified, callable leads:

1. **Landing page** (`/`) — marketing page that builds trust and drives visitors to the intake.
2. **Intake form** (`/intake`) — embeds the **SurveyMonkey** intake survey (the collection
   system-of-record).
3. **Intake API** (`POST /api/surveymonkey/webhook`) — a thin webhook receiver: SurveyMonkey
   fires on response completion → we normalize the response into a canonical **lead JSON**,
   score/tier it for the call team, and forward it to the **Wayco intake platform**.
4. **Lead queue** (`/leads`) — token-gated internal view of leads, sorted hot → warm → cold.

Architecture decisions and the gstack review trail live in [PLAN.md](PLAN.md); deferred work is
in [TODOS.md](TODOS.md).

## Data flow

```
visitor ─▶ /intake (embedded SurveyMonkey survey) ─▶ SurveyMonkey collects response
                                                          │ webhook: response_completed
                                                          ▼
   POST /api/surveymonkey/webhook ─ verify sig ─ fetch response details (SM API)
        └─ flatten pages→questions→answers ─ map(question_id→field) ─ normalize
             └─ score/tier lead ─▶ forward JSON to Wayco  +  persist locally
                                                          │
                                              /leads (call team works the queue)
```

Everything degrades to **mock/test mode** so the full pipeline runs with zero external
credentials.

## Quick start

```bash
npm install
cp .env.example .env.local   # optional — all keys can stay blank for local dev
npm run dev                  # http://localhost:3000
```

- `/` landing page
- `/intake` shows a setup placeholder until `NEXT_PUBLIC_SM_SURVEY_URL` is set
- `/leads` lead queue (open in dev; token-gated in prod)

### Try the full pipeline with no SurveyMonkey account

POST the bundled sample (inline `details` + `map`, honored only outside production):

```bash
curl -s -X POST http://localhost:3000/api/surveymonkey/webhook \
  -H 'Content-Type: application/json' \
  --data @samples/surveymonkey-webhook.json | jq
```

You'll get back a scored lead (the sample is a "hot" lead). Then open
`http://localhost:3000/leads` to see it in the queue, or `GET /api/surveymonkey/webhook`
for a recent-leads summary.

## Going live

1. **Build the SurveyMonkey survey** with the PI intake fields (see PLAN.md) including TCPA
   consent and a "no attorney-client relationship" acknowledgement.
2. Set `NEXT_PUBLIC_SM_SURVEY_URL` to the survey's web-link URL so `/intake` embeds it.
3. Create a SurveyMonkey **API access token** → `SURVEYMONKEY_ACCESS_TOKEN`.
4. Add a **webhook** for `response_completed` pointing at your deployed
   `/api/surveymonkey/webhook`; set `SURVEYMONKEY_WEBHOOK_SECRET` to match.
5. Provide `SURVEYMONKEY_QUESTION_MAP` (JSON: canonical field → question id).
6. Point `WAYCO_INTAKE_URL` (+ `WAYCO_API_KEY`) at the Wayco intake platform.
7. Set `LEADS_ACCESS_TOKEN` to gate `/leads`.

See [.env.example](.env.example) for every variable.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run typecheck` | `tsc --noEmit` |

## Compliance

Attorney advertising and "no attorney-client relationship" disclaimers appear in the footer and
on the intake page; TCPA consent is captured in the survey and recorded on the lead. The
statute-of-limitations flag is triage signal, not legal advice. Local `data/leads.jsonl` holds
PII and is gitignored — use a real datastore in production (see TODOS.md).
