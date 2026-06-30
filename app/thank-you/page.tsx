import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { FIRM } from "@/lib/config";

export const metadata: Metadata = {
  title: "Thank You — Your Case Review Is Started | Wayco Injury Law",
  description: "We received your information. A member of the Wayco Injury Law team will be in touch.",
  robots: { index: false, follow: false },
};

function CheckBig() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ThankYouPage() {
  return (
    <>
      <SiteHeader />
      <section className="section">
        <div className="container center" style={{ maxWidth: 720 }}>
          <div className="success-mark"><CheckBig /></div>
          <p className="eyebrow">Received</p>
          <h1>Thank you — your case review has started.</h1>
          <p className="lead">
            We&apos;ve received your information and our intake team is reviewing it now. A member of{" "}
            {FIRM.longName} will reach out using the contact method you selected.
          </p>

          <ol className="next-steps">
            <li><span className="n">1</span><div><strong>We review your claim.</strong> Our team evaluates the details you shared — usually within one business day.</div></li>
            <li><span className="n">2</span><div><strong>We call you.</strong> An attorney or intake specialist follows up to answer your questions, free of charge.</div></li>
            <li><span className="n">3</span><div><strong>We get to work.</strong> If we take your case, we handle the insurers and pursue your compensation.</div></li>
          </ol>

          <div style={{ marginTop: 30, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a className="btn btn--primary btn--lg" href={FIRM.phoneHref}>Need us sooner? Call {FIRM.phone}</a>
            <Link className="btn btn--navy btn--lg" href="/">Back to home</Link>
          </div>

          <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: 26 }}>
            Submitting your information does not create an attorney-client relationship. If you are
            facing a filing deadline, please call us right away.
          </p>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
