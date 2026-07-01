import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Read the copy source directly so this guards the exact strings regardless of
// how the dictionary is exported. This is a compliance regression fence: it
// fails the build if a misleading claim comes back or a required disclosure
// disappears — the exact issues counsel flagged.
const i18n = readFileSync(resolve(process.cwd(), "lib/i18n.tsx"), "utf8");

describe("compliance copy — banned claims must stay OUT", () => {
  const BANNED = [
    // EN — misleading / unjustified-expectation / false-comparison claims
    "what your case is worth",
    "not a call center",
    "nationwide",
    "100% free",
    "every dollar you’re owed",
    "protect your claim and your deadlines",
    "full compensation you deserve",
    // ES equivalents
    "cuánto vale su caso",
    "centro de llamadas",
    "en todo el país",
    "100% gratis",
    "cada dólar",
  ];

  it.each(BANNED)("does not contain %s", (phrase) => {
    expect(i18n).not.toContain(phrase);
  });
});

describe("compliance copy — required disclosures must stay IN", () => {
  const REQUIRED = [
    // Attorney advertising + core disclaimers (EN)
    "Attorney Advertising",
    "Prior results do not guarantee a similar outcome",
    "is not legal advice",
    "signed written agreement",
    // Entity separation (LegalZoom-modeled)
    "is not a law firm",
    "affiliated law firm",
    "fair-market-value fees",
    // Contingency cost caveat
    "case costs and expenses",
    // TCPA consent
    "reply STOP",
    "Consent is not a condition",
    // ES required
    "Publicidad de Abogados",
    "no es una firma de abogados",
    "resultados anteriores no garantizan",
  ];

  it.each(REQUIRED)("contains %s", (phrase) => {
    expect(i18n).toContain(phrase);
  });
});
