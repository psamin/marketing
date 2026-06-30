// Centralized environment access. Server-only values are read lazily so they
// never leak into the client bundle (only NEXT_PUBLIC_* is client-visible).

export const config = {
  // Client-visible (inlined at build): the embedded survey weblink (iframe).
  surveyUrl: process.env.NEXT_PUBLIC_SM_SURVEY_URL || "",
  // Client-visible: SurveyMonkey "Website" JS embed script URL, e.g.
  // https://widget.surveymonkey.com/collect/website/js/XXXXX.js
  // Use this when a plain weblink refuses to be iframed (X-Frame-Options).
  surveyEmbedSrc: process.env.NEXT_PUBLIC_SM_EMBED_SRC || "",

  surveymonkey: {
    accessToken: process.env.SURVEYMONKEY_ACCESS_TOKEN || "",
    webhookSecret: process.env.SURVEYMONKEY_WEBHOOK_SECRET || "",
    apiBase: process.env.SURVEYMONKEY_API_BASE || "https://api.surveymonkey.com/v3",
    questionMap: process.env.SURVEYMONKEY_QUESTION_MAP || "",
    // Numeric SurveyMonkey survey id (NOT the /r/ weblink slug). Needed for the
    // pull/extract endpoints. Find it via GET /api/surveymonkey/survey?list=1.
    surveyId: process.env.SURVEYMONKEY_SURVEY_ID || "",
  },

  wayco: {
    url: process.env.WAYCO_INTAKE_URL || "",
    apiKey: process.env.WAYCO_API_KEY || "",
  },

  leadsToken: process.env.LEADS_ACCESS_TOKEN || "",

  // Optional webhook for new-lead notifications (Slack / Discord / generic JSON).
  alertWebhookUrl: process.env.ALERT_WEBHOOK_URL || "",

  isProd: process.env.NODE_ENV === "production",
  // Inline test payloads to the webhook are only ever honored outside production.
  allowTestPayloads:
    process.env.NODE_ENV !== "production" &&
    process.env.SM_ALLOW_TEST_PAYLOADS !== "false",
} as const;

export const FIRM = {
  name: "Wayco",
  longName: "Wayco Injury Law",
  phone: "(516) 412-7361",
  phoneHref: "tel:+15164127361",
  email: "intake@wayco.example",
  tagline: "Injured? You may be owed compensation.",
} as const;
