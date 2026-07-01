"use client";

import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SurveyMonkeyEmbed from "@/components/SurveyMonkeyEmbed";
import { FIRM } from "@/lib/config";
import { useLang } from "@/lib/i18n";

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

export default function IntakeContent({ surveyUrl, embedSrc }: { surveyUrl: string; embedSrc: string }) {
  const { t } = useLang();
  const ix = t.intake;

  return (
    <>
      <SiteHeader />

      <section className="page-head">
        <div className="container">
          <p className="eyebrow">{ix.eyebrow}</p>
          <h1>{ix.title}</h1>
          <p>
            {ix.introLead}
            <a href={FIRM.phoneHref} style={{ color: "var(--accent)", fontWeight: 700 }}>{FIRM.phone}</a>
            {ix.introTail}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 880 }}>
          <div className="notice" role="note">
            <Shield />
            <span>
              {ix.consentLead}
              {FIRM.longName}
              {ix.consentMid}
              <strong>{ix.consentNot}</strong>
              {ix.consentTail}
            </span>
          </div>

          {embedSrc ? (
            <SurveyMonkeyEmbed src={embedSrc} />
          ) : surveyUrl ? (
            <div className="embed-wrap">
              <iframe
                className="embed-frame"
                src={surveyUrl}
                title={ix.iframeTitle}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : (
            <div className="embed-wrap">
              <div className="placeholder">
                <div className="ico" aria-hidden="true"><Info /></div>
                <h2>{ix.notConnectedTitle}</h2>
                <p style={{ color: "var(--muted)" }}>
                  Set <code>NEXT_PUBLIC_SM_SURVEY_URL</code> or <code>NEXT_PUBLIC_SM_EMBED_SRC</code>,
                  and the live form appears here.
                </p>
                <div style={{ marginTop: 22 }}>
                  <a className="btn btn--primary" href={FIRM.phoneHref}>
                    {ix.helpMid.trim()} {FIRM.phone}
                  </a>
                </div>
              </div>
            </div>
          )}

          <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: 18 }}>
            {ix.helpLead}
            <Link href="/">{ix.helpHome}</Link>
            {ix.helpMid}
            <a href={FIRM.phoneHref}>{FIRM.phone}</a>
            {ix.helpTail}
          </p>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
