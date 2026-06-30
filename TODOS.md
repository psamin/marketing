# TODOS — Wayco Intake

Deferred from `/plan-ceo-review` (2026-06-30, SELECTIVE EXPANSION mode).
Baseline = Approach B. `/leads` call-team view was added to v1; the items below were deferred.

## Deferred expansions (not in v1 scope)
- [ ] **Webhook idempotency + dead-letter** — dedupe forwards on SurveyMonkey `response_id`; write any
      failed Wayco forward to a dead-letter file/queue so no lead is lost on replay or downstream outage.
- [ ] **Hot-lead instant alert** — fire an email/Slack webhook (`ALERT_WEBHOOK_URL`) on hot/disqualified
      leads so the call team can hit the 15-minute SLA.
- [ ] **Conversion analytics** — capture UTM on the landing page, log funnel events
      (page view → CTA click → survey loaded → lead created) for marketing attribution.

## Production hardening (post-v1)
- [ ] Replace local `data/leads.jsonl` with a real datastore. Plaintext PII on disk is dev-only.
- [ ] Real auth on `/leads` (SSO) instead of a shared token.
- [ ] Wayco forward retries with backoff + circuit breaker.

## Wiring needed from client
- [ ] SurveyMonkey survey built with PI fields + TCPA / no-attorney-client consent questions.
- [ ] SurveyMonkey access token, survey embed URL, webhook secret, and question→field map.
- [ ] Wayco intake endpoint URL + auth scheme.
