import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SurveyMonkeyEmbed from "@/components/SurveyMonkeyEmbed";
import { FIRM, config } from "@/lib/config";

export const metadata: Metadata = {
  title: "Start Your Free Case Review — Wayco Injury Law",
  description:
    "Tell us what happened. Complete Wayco Injury Law's confidential intake form to start your free, no-obligation case review.",
  robots: { index: false, follow: true },
};

function Shield() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 5 6v5c0 4 3 7 7 8 4-1 7-4 7-8V6l-7-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
function Info() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function IntakePage() {
  const surveyUrl = config.surveyUrl;
  const embedSrc = config.surveyEmbedSrc;

  return (
    <>
      <SiteHeader />

      <section className="page-head">
        <div className="container">
          <p className="eyebrow" style={{ color: "var(--gold-500)" }}>Free &amp; confidential</p>
          <h1>Start your free case review</h1>
          <p>
            Answer a few questions about your accident and injuries. There&apos;s no cost and no
            obligation, and your information is kept confidential. Prefer to talk? Call{" "}
            <a href={FIRM.phoneHref} style={{ color: "#fff", fontWeight: 700 }}>{FIRM.phone}</a>.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 880 }}>
          <div className="notice" role="note">
            <Shield />
            <span>
              By submitting this form you agree to be contacted by {FIRM.longName} about your
              potential claim, including by phone, text, and email. Submitting this form does{" "}
              <strong>not</strong> create an attorney-client relationship and is not legal advice.
            </span>
          </div>

          {embedSrc ? (
            <SurveyMonkeyEmbed src={embedSrc} />
          ) : surveyUrl ? (
            <div className="embed-wrap">
              <iframe
                className="embed-frame"
                src={surveyUrl}
                title="Wayco Injury Law intake form"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : (
            <div className="embed-wrap">
              <div className="placeholder">
                <div className="ico" aria-hidden="true"><Info /></div>
                <h2>Intake form not connected yet</h2>
                <p className="lead" style={{ margin: "0 auto 18px" }}>
                  The SurveyMonkey intake survey hasn&apos;t been linked. Set either{" "}
                  <code>NEXT_PUBLIC_SM_EMBED_SRC</code> (the SurveyMonkey &ldquo;Website&rdquo;
                  embed script URL — recommended) or <code>NEXT_PUBLIC_SM_SURVEY_URL</code> (the
                  survey weblink), and the live form appears here.
                </p>
                <p style={{ color: "var(--muted)" }}>
                  Responses flow to <code>/api/surveymonkey/webhook</code>, which scores each
                  lead and forwards it to the Wayco intake platform.
                </p>
                <div style={{ marginTop: 22 }}>
                  <a className="btn btn--primary" href={FIRM.phoneHref}>
                    Or call us now: {FIRM.phone}
                  </a>
                </div>
              </div>
            </div>
          )}

          <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: 18 }}>
            Need help or facing a deadline? <Link href="/">Return home</Link> or call{" "}
            <a href={FIRM.phoneHref}>{FIRM.phone}</a> — we&apos;re available 24/7.
          </p>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
