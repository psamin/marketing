// Centralized environment access. Server-only values are read lazily so they
// never leak into the client bundle (only NEXT_PUBLIC_* is client-visible).

export const config = {
  // Client-visible (inlined at build): the embedded survey URL.
  surveyUrl: process.env.NEXT_PUBLIC_SM_SURVEY_URL || "",

  surveymonkey: {
    accessToken: process.env.SURVEYMONKEY_ACCESS_TOKEN || "",
    webhookSecret: process.env.SURVEYMONKEY_WEBHOOK_SECRET || "",
    apiBase: process.env.SURVEYMONKEY_API_BASE || "https://api.surveymonkey.com/v3",
    questionMap: process.env.SURVEYMONKEY_QUESTION_MAP || "",
  },

  wayco: {
    url: process.env.WAYCO_INTAKE_URL || "",
    apiKey: process.env.WAYCO_API_KEY || "",
  },

  leadsToken: process.env.LEADS_ACCESS_TOKEN || "",

  isProd: process.env.NODE_ENV === "production",
  // Inline test payloads to the webhook are only ever honored outside production.
  allowTestPayloads:
    process.env.NODE_ENV !== "production" &&
    process.env.SM_ALLOW_TEST_PAYLOADS !== "false",
} as const;

export const FIRM = {
  name: "Wayco",
  longName: "Wayco Injury Law",
  phone: "(800) 555-0199",
  phoneHref: "tel:+18005550199",
  email: "intake@wayco.example",
  tagline: "Injured? You may be owed compensation.",
} as const;
