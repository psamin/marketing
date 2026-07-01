import Link from "next/link";
import type { Metadata } from "next";
import { FIRM, LEGAL } from "@/lib/config";

export const metadata: Metadata = {
  title: `Privacy Policy — ${FIRM.longName}`,
  robots: { index: true, follow: true },
};

// ⚠️ [NEEDS COUNSEL / TO BE DRAFTED BY COUNSEL] This is a SCAFFOLD only.
// Do not publish until reviewed by counsel and the LEGAL placeholders are real.
// Structure follows the Eve two-regime split: the law firm PC is the controller
// of client-intake/matter data; Wayco Inc. (tech/admin vendor) processes data
// only to provide services to the firm, for fixed FMV fees.
export default function PrivacyPage() {
  return (
    <main className="container" style={{ maxWidth: "72ch", padding: "48px 20px 80px" }}>
      <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: ".08em", color: "#888" }}>
        Attorney Advertising
      </p>
      <h1>Privacy Policy</h1>
      <p style={{ color: "#a33" }}>
        <strong>DRAFT — pending counsel review. Not yet in effect.</strong>
      </p>

      <h2>Who we are</h2>
      <p>
        This site advertises <strong>{LEGAL.firmEntity}</strong> (the “Firm”), an
        independent law firm operating under the trade name {FIRM.longName}.{" "}
        {LEGAL.techEntity} is a technology and administrative-services company that
        provides services to the Firm for fixed, fair-market-value fees; it is not a
        law firm and does not provide legal services or direct legal decisions. As to
        client-intake and matter information, the <strong>Firm is the controller</strong>;{" "}
        {LEGAL.techEntity} acts only as a service provider/processor on the Firm’s behalf.
      </p>

      <h2>Information we collect</h2>
      <p>[TO BE DRAFTED BY COUNSEL] Contact details you submit (name, phone, email),
        information about your potential claim, and standard technical/analytics data
        (IP address, device, pages viewed).</p>

      <h2>How we use it & phone/text/email contact (TCPA)</h2>
      <p>To evaluate your potential claim and contact you about it. By submitting the
        intake form you consent to be contacted at the number/email provided, including
        by automated dialing, prerecorded/AI voice, and text message. Consent is not a
        condition of any legal service; message/data rates may apply; reply STOP to opt
        out of texts. [Confirm express-written-consent wording with counsel.]</p>

      <h2>Sharing & service providers</h2>
      <p>[TO BE DRAFTED BY COUNSEL] Named subprocessors, and confirmation that data is
        not sold. If any AI is used for intake, state the data-handling and
        no-model-training posture here.</p>

      <h2>Data retention, your rights, and contact</h2>
      <p>[TO BE DRAFTED BY COUNSEL] Retention periods; access/deletion/opt-out rights
        (CCPA and other applicable law). Questions: <a href={`mailto:${FIRM.email}`}>{FIRM.email}</a>,{" "}
        <a href={FIRM.phoneHref}>{FIRM.phone}</a>.</p>

      <p style={{ marginTop: 40 }}>
        <Link href="/">← Back to home</Link>
      </p>
    </main>
  );
}
