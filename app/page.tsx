"use client";

import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { FIRM } from "@/lib/config";
import { useLang } from "@/lib/i18n";

function Check() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HomePage() {
  const { t } = useLang();

  return (
    <>
      <SiteHeader />

      {/* HERO */}
      <section className="hero">
        <div className="container hero__grid">
          <div>
            <p className="eyebrow">{t.hero.eyebrow}</p>
            <h1>
              {t.hero.titleLead}
              <span className="accent-text">{t.hero.titleAccent}</span>
              {t.hero.titleTail}
            </h1>
            <p>{t.hero.body}</p>
            <div className="hero__cta">
              <Link className="btn btn--primary btn--lg" href="/intake">
                {t.hero.ctaPrimary}
              </Link>
              <a className="btn btn--ghost btn--lg" href={FIRM.phoneHref}>
                {t.hero.call} {FIRM.phone}
              </a>
            </div>
            <div className="hero__badges">
              {t.hero.badges.map((b) => (
                <span className="hero__badge" key={b}>
                  <Check /> {b}
                </span>
              ))}
            </div>
          </div>

          <div className="hero__card" aria-label={t.hero.cardTitle}>
            <h3>{t.hero.cardTitle}</h3>
            <ol className="hero__steps">
              {t.hero.steps.map(([strong, rest]) => (
                <li key={strong}>
                  <strong>{strong}</strong>
                  {rest}
                </li>
              ))}
            </ol>
            <Link className="btn btn--navy" href="/intake" style={{ width: "100%", marginTop: 18 }}>
              {t.hero.begin}
            </Link>
          </div>
        </div>
      </section>

      {/* PRACTICE AREAS */}
      <section className="section" id="practice-areas">
        <div className="container">
          <div className="center" style={{ marginBottom: 40 }}>
            <p className="eyebrow">{t.practice.eyebrow}</p>
            <h2>{t.practice.title}</h2>
            <p className="lead">{t.practice.lead}</p>
          </div>
          <div className="grid grid--3">
            {t.practice.items.map((p) => (
              <div className="card practice" key={p.t}>
                <div className="ico" aria-hidden="true"><Check /></div>
                <h3>{p.t}</h3>
                <p>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section section--soft" id="how-it-works">
        <div className="container">
          <div className="center" style={{ marginBottom: 40 }}>
            <p className="eyebrow">{t.how.eyebrow}</p>
            <h2>{t.how.title}</h2>
          </div>
          <div className="grid grid--3">
            {t.how.steps.map((s, i) => (
              <div className="card step" key={s.h}>
                <div className="n">{String(i + 1).padStart(2, "0")}</div>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY WAYCO */}
      <section className="section" id="why-wayco">
        <div className="container">
          <div className="center" style={{ marginBottom: 40 }}>
            <p className="eyebrow">{t.why.eyebrow}</p>
            <h2>{t.why.title}</h2>
          </div>
          <div className="grid grid--4">
            {t.why.cards.map((c) => (
              <div className="card" key={c.h}>
                <h3>{c.h}</h3>
                <p>{c.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq">
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="center" style={{ marginBottom: 24 }}>
            <p className="eyebrow">{t.faq.eyebrow}</p>
            <h2>{t.faq.title}</h2>
          </div>
          <div className="faq">
            {t.faq.items.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-band">
            <h2>{t.finalCta.title}</h2>
            <p>{t.finalCta.bodyLead}{FIRM.phone}.</p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link className="btn btn--primary btn--lg" href="/intake">{t.finalCta.ctaPrimary}</Link>
              <a className="btn btn--ghost btn--lg" href={FIRM.phoneHref}>{t.finalCta.call} {FIRM.phone}</a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
