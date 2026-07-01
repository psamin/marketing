# Eve → wayco-intake: what we borrowed, what we built, what's still gated

Companion to `COMPLIANCE-REVIEW.md`. Records how Eve (eve.legal / Butler Labs, Inc.) informed the local fixes to the wayco-intake site, and the AI-native product boundaries that follow from Iqbol's direction (state MSO via acquihired PI firm; AI intake / AI case management / AI negotiator). **Not legal advice — `[NEEDS COUNSEL]`.**

---

## The core lesson from Eve
Eve stays clean by being a **pure software vendor that never owns the firm, the client, or the fee**, with a hard disclaimer pushing all legal responsibility onto licensed professionals (MSA §9.4), flat non-outcome-linked fees (§4.1), and "Customer owns Customer Data" (§5.1).

Wayco is the **inverse**: it *owns* the PI firm via an MSO. So we can't copy Eve's "we're just software" posture — but we copy its **discipline**: crisp entity separation + Eve-§9.4-style disclaimers, applied to a site that fronts the law firm.

## Eve mechanic → wayco-intake change

| Eve mechanic | Applied to wayco-intake |
|---|---|
| MSA defines a clean party split; "not a law firm / not legal advice / human oversight" (§9.4) | Footer **entity-separation disclosure**: the site advertises the **attorney-owned PC**; **Wayco Inc.** is disclosed as a tech/admin company — not a law firm, no legal services/advice, doesn't direct legal decisions, doesn't select/refer clients, fixed FMV fees. |
| Flat fees, zero outcome-linkage (§4.1) — the AKS/fee-split defense | Public statement that Wayco's services are for **fixed, fair-market-value fees**; the PC (not Wayco) owns representation and any contingency fee. |
| Customer owns data; company-controller vs matter-processor split | `/privacy` scaffold built on the **two-regime split**: the Firm (PC) is controller of intake/matter data; Wayco processes only to serve the Firm. |
| Fees not tied to referrals; no client-matching/routing | Removed steering/《matching》framing; the site is the Firm's own funnel, not a lead marketplace. |

## Copy fixes made (both EN + ES)
- "what your case is worth" → "if you may have a claim"; removed "every dollar" / "full compensation you deserve" → "compensation available under the law"
- **"Real attorneys, not a call center"** → "Licensed attorneys; intake may be AI-assisted; legal decisions are made by lawyers" (honest re: AI intake — the old line was likely literally false)
- "100% free & confidential" → "Free case review / Private"; softened "confidential" (no privilege pre-engagement)
- removed "nationwide"; removed "protect your deadline" promise; "What is my case worth?" → "How is compensation determined? … no one can promise an amount"
- **TCPA** express-consent on the intake form (automated/AI-voice/text disclosure, "consent is not a condition," STOP to opt out)
- Attorney-advertising label + prior-results + contingency "attorney fees only; case costs may apply" caveat — kept/added at prominence

## How Iqbol's direction resolves the blocker
> "Run a state MSO via acquihiring a PI firm; make it AI-native — AI intake, AI case management, AI negotiator; make claim processing fast + cheap for daily consumers."

- **The acquihired PI firm IS the real licensed PC** — this fills the `LEGAL` placeholders in `lib/config.ts` (`firmEntity`, `responsibleAttorney`, `officeAddress`, `admittedStates`) and clears the #0 "does a real advertiser exist?" gate.
- **State (single-state) MSO** = why dropping "nationwide" and scoping to `admittedStates` is correct.
- **AI intake** = why the "AI-assisted intake" honesty fix is right.

## AI-native product boundaries `[NEEDS COUNSEL]`
Each AI stage must sit inside the UPL/CPOM firewall:
- **AI intake** — fine as assistance; disclose it's automated (done). Don't let it give legal advice or quote case value.
- **AI case management** — administrative coordination is fine; clinical decisions stay with the physician-owned PC (CPOM), legal decisions with the attorney PC.
- **AI negotiator** — ⚠️ **the sharp one.** Negotiating a legal claim is practicing law. Frame/operate as **attorney-supervised** (AI drafts/assists; a licensed attorney is the negotiator of record and approves positions). A non-lawyer/AI negotiating directly = UPL and breaks the MSO firewall. Build the supervision boundary in from the start.

## Still gated (unchanged)
Nothing is published. Before any deploy: fill the real acquihired-firm identity into `lib/config.ts`, have NY (+GA) counsel review copy + structure + the AI-negotiator supervision model, and confirm the MSO fee is fixed FMV with no fee-split.
