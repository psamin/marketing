import Link from "next/link";
import type { Metadata } from "next";
import { FIRM, LEGAL } from "@/lib/config";

export const metadata: Metadata = {
  title: `Privacy Policy — ${FIRM.longName}`,
  robots: { index: true, follow: true },
};

// ⚠️ [NEEDS COUNSEL] Draft modeled on real, comparable policies (LegalZoom's
// "not a law firm" data posture + service-provider sharing + CCPA framing) and
// the two-regime split (the law firm PC is the controller of intake/matter data;
// Wayco Inc. is a service provider/processor). Do NOT publish until counsel
// reviews it and the LEGAL placeholders are real.
export default function PrivacyPage() {
  return (
    <main className="container legal-page">
      <p className="footer__adlabel">Attorney Advertising</p>
      <h1>Privacy Policy</h1>
      <p className="legal-meta" style={{ color: "#b8402c" }}>
        <strong>DRAFT — pending counsel review. Not yet in effect. Effective date: [TO BE SET].</strong>
      </p>

      <h2>1. Who this policy covers</h2>
      <p>
        This site advertises <strong>{LEGAL.firmEntity}</strong> (the “Firm”), an
        independent law firm operating under the trade name {FIRM.longName}.{" "}
        {LEGAL.techEntity} is <strong>not a law firm</strong> and does not provide
        legal advice or legal services, except as provided through its affiliated
        law firm; it is a technology and administrative-services company that
        provides services to the Firm for fixed, fair-market-value fees. As to your
        intake and case information, the <strong>Firm is the controller</strong> of
        that data; {LEGAL.techEntity} acts only as a <strong>service provider</strong>{" "}
        on the Firm’s behalf and does not use it for its own purposes.
      </p>

      <h2>2. Information we collect</h2>
      <ul>
        <li><strong>Information you give us:</strong> your name, phone number, email, and the details you provide about your potential claim (what happened, injuries, dates, whether you are treating).</li>
        <li><strong>Technical information:</strong> IP address, device and browser type, and pages viewed, collected automatically for security and analytics.</li>
      </ul>

      <h2>3. How we use it, and phone/text/email contact (TCPA)</h2>
      <p>
        We use your information to evaluate your potential claim and to contact you
        about it. By submitting the intake form and checking the consent box, you
        agree to be contacted at the number and email you provide, including by
        automated dialing, prerecorded or AI voice, and text message.{" "}
        <strong>Consent is not a condition of any legal service.</strong> Message and
        data rates may apply; reply STOP to opt out of texts at any time.
        [Confirm express-written-consent wording and record-keeping with counsel.]
      </p>

      <h2>4. How we store and share it</h2>
      <p>
        Your information is stored on <strong>Wayco’s own internal systems</strong> (our
        secure case-management dashboard) and used only to evaluate and handle your
        claim. <strong>We are not a lead marketplace — we do not sell or resell your
        information.</strong> We share it with the Firm’s attorneys and staff evaluating
        your claim, and with service providers that help us operate (hosting,
        communications, analytics), who may not use it for any other purpose. Some
        routine online activity (analytics or advertising cookies) may be considered a
        “sale” or “share” under certain state laws; where it is, you may opt out.
        [Insert named subprocessors, cookie disclosures, and data-security measures —
        counsel to confirm.]
      </p>

      <h2>5. AI and your data</h2>
      <p>
        Intake may be AI-assisted. Your intake information is used to evaluate and
        route your claim; it is <strong>not used to train any general-purpose or
        third-party foundation model.</strong> [Confirm the exact no-training covenant
        and any model/vendor terms with counsel.]
      </p>

      <h2>6. Data retention</h2>
      <p>[TO BE DRAFTED BY COUNSEL] How long intake and matter data is retained,
        including any bar-rule advertising/solicitation retention requirements.</p>

      <h2>7. Your rights</h2>
      <p>[TO BE DRAFTED BY COUNSEL] Access, correction, deletion, and opt-out rights
        under CCPA/CPRA and other applicable state laws, and how to exercise them.</p>

      <h2>8. Contact</h2>
      <p>
        Questions about this policy or your information:{" "}
        <a href={`mailto:${FIRM.email}`}>{FIRM.email}</a> ·{" "}
        <a href={FIRM.phoneHref}>{FIRM.phone}</a>.
      </p>

      <p className="legal-links" style={{ marginTop: 32 }}>
        <Link href="/">← Home</Link>
        <Link href="/legal">Legal Notices</Link>
      </p>
    </main>
  );
}
