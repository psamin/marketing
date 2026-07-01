# wayco-intake — Attorney-Advertising Compliance Review

**Prepared for:** Wayco counsel + CEO review
**Site:** wayco-intake.vercel.app (`~/Desktop/marketing/`) — the public PI ad funnel
**Status:** ⚠️ **NOT LEGAL ADVICE.** Citation-to-rule flags for counsel to confirm. Nothing here has been deployed. Primary jurisdictions: **NY** (HQ NYC; 516 number) and **GA** (targeting Atlanta).

---

## TL;DR
The exposure is **structural, not cosmetic.** The site holds out **"Wayco Injury Law"** as a **nationwide law firm with "real attorneys,"** but Wayco is a **non-lawyer MSO/tech company** and the page names **no admitted attorney, no bar number, and no law-office address** (contact is a placeholder, `intake@wayco.example`). Adding disclaimers does not cure a non-lawyer entity advertising as a law firm. Two fixes, in order:

1. **Structural (counsel + entity):** the advertiser must *be* — and *name* — a licensed attorney-owned PC, admitted in each advertised state, with a real office address. Wayco (non-lawyer MSO) must not be the advertiser or the paid lead-router. Scope "nationwide" to actual coverage.
2. **Copy (fixable in `lib/i18n.tsx`, draft-only until sign-off):** remove results promises, fix "not a call center," give the results + contingency disclaimers equal prominence, soften "confidential," add deadline/no-ACR caveats near CTAs.

Already present (necessary, not sufficient): the **"Attorney Advertising"** label and a **draft cost-disclosure** sentence (EN + ES) in the footer.

---

## PART 1 — Structural / identity (the "not compliant at all" core)

| # | Issue | Why it matters | Rule to confirm |
|---|---|---|---|
| S1 | **Non-lawyer entity holding out as a law firm.** "Wayco Injury Law," "real attorneys," "we handle serious injury claims" — but Wayco is a non-lawyer MSO. | Advertising legal services / "holding out" is itself UPL, before any legal work. A lawyer also may not assist a non-lawyer entity that screens/routes leads. | UPL ("holding out"); NY RPC 5.4/5.5; ABA/state UPL opinions on lead-screening |
| S2 | **Missing required identifying info.** No named responsible attorney, no bar admission, no principal law-office address; placeholder email. | NY 7.1(h) requires firm identification incl. **principal law office address** + phone; 7.5 bars misleading identity / implying a non-lawyer is a firm. | NY RPC 7.1(h), 7.5 |
| S3 | **"Nationwide" framing.** Footer tagline + ES tagline claim nationwide service. | Implies multi-state licensure that doesn't exist → misleading, and UPL in every state where no one is admitted. | NY 7.1; per-state UPL |
| S4 | **MSO structure conflict (Wayco's own thesis, dossier §7–8).** Clean-MSO requires the **attorney-owned PC** to be the advertiser and lawyer; Wayco provides services for a fixed FMV fee and **never holds itself out as the firm.** | As written, Wayco-the-tech-co is the advertiser → the exact thing the structure forbids; also implicates fee-split / provider-matching (AKS) if Wayco routes leads for a cut. | Clean-MSO line; AKS / fee-split; NY 5.4 |

**Structural fix (counsel-led):** name a real admitted attorney/PC as advertiser + office address; limit advertised states to actual admissions; ensure Wayco is not the advertiser and any lead flow is fixed-FMV, not per-lead/per-case.

---

## PART 2 — Copy claims (draftable in `i18n.tsx` now; deploy only after sign-off)

Each row: **exact current string** → why flagged → suggested rewrite.

| # | Current copy (verbatim) | Flag | Suggested rewrite |
|---|---|---|---|
| C1 | Hero title: *"Find out **what your case is worth**"* · FAQ: *"What is my case worth?"* · finalCta: *"You may have a case."* | Creates **unjustified expectations** about outcome/value; must be factually supportable, with results disclaimer adjacent. | "See if you may have a claim" / "Understand your legal options." Drop "worth." |
| C2 | why-card: *"**Real attorneys.** Your case is handled by experienced injury lawyers, **not a call center.**"* | Comparative/quality claim **and likely literally false** if intake is AI/non-lawyer → deceptive + aiding-UPL. | Remove entirely, or (post-structural-fix) name the actual attorney/PC: "Your case is handled by [Attorney Name], licensed in [state]." |
| C3 | *"No fee unless we win"* ×6 (eyebrow, badges, why-card, FAQ, hero body, footer) | Contingency ad → NY needs cost-responsibility disclosure (drafted ✅); **GA requires a specific conspicuous disclaimer** that it refers to attorney fees only, costs/expenses may be owed regardless, and contingency isn't available in all case types. | Keep phrase **once**, adjacent to the full disclaimer; add the GA-specific conspicuous disclaimer if advertising in GA. |
| C4 | badges: *"100% free & confidential"* · intake: *"your information is kept confidential"* | Consent text itself says **no attorney-client relationship is formed** → pre-engagement info generally isn't privileged; "confidential" overstates protection. | "Private — we use your information only to evaluate your claim." Drop "100%"/"confidential" as a legal-protection claim. |
| C5 | why-card: *"Fast response… we follow up quickly to **protect your claim and your deadlines**"* · FAQ: *"start your review today so we can **protect your deadline**"* | Implies the firm is safeguarding your statute-of-limitations **before any engagement** → creates harmful reliance. | "Deadlines (statutes of limitation) can be short — we encourage you to seek counsel promptly." Remove "we protect your deadline." |
| C6 | badges/header: *"Available 24/7," "Free consultation 24/7"* | Implies attorney availability that may not exist (AI/intake answering). | "Submit your details any time — a team member follows up." |
| C7 | steps: *"we **pursue every dollar you're owed**"* · how: *"the **full compensation you deserve**"* | Unjustified-expectation / guarantee-flavored language. | "we pursue the compensation available under your claim." |
| C8 | intake consent: *"you agree to be contacted… by phone, text, and email"* | **TCPA** consent specificity; and under MSO, non-lawyer collecting/routing leads = provider-matching/fee-split landmine. | Tighten to TCPA-compliant express-consent language; confirm who receives the lead and on what fee basis. |

**Already in place (keep):** "Attorney Advertising" label ✅; footer draft cost-disclosure (EN + ES) ✅; "Prior results do not guarantee a similar outcome" ✅ — but move the results disclaimer to **equal prominence** next to the results claims (C1/C7), not buried in the footer.

---

## Recommended sequence
1. **Counsel decides the structural questions (Part 1)** — who is the named advertiser/PC, which states, what address. This determines much of the copy.
2. **Copy rewrite pass (Part 2)** in `i18n.tsx` as a draft → counsel redlines → deploy.
3. Do **not** run paid traffic to the funnel until Part 1 is resolved — every impression is the holding-out risk.

*All flags citation-to-rule, not legal advice. Confirm NY (primary) and GA specifics with licensed counsel before any change goes live.*
