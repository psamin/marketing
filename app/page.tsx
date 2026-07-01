"use client";

import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import IntakeWidget from "@/components/IntakeWidget";
import { FIRM } from "@/lib/config";
import { useLang } from "@/lib/i18n";

export default function HomePage() {
  const { t } = useLang();

  return (
    <>
      <SiteHeader />

      <section className="landing">
        <div className="container landing__grid">
          <div className="landing__intro">
            <h1>
              {t.hero.titleLead}
              <span className="accent-text">{t.hero.titleAccent}</span>
              {t.hero.titleTail}
            </h1>
            <p className="landing__sub">{t.intakeWidget.privacyNote}</p>
            <a className="landing__phone" href={FIRM.phoneHref}>
              {FIRM.phone}
            </a>
          </div>

          <div className="landing__form">
            <IntakeWidget />
          </div>
        </div>
      </section>

      <div className="home-faq">
        <div className="container">
          <Link className="home-faq__link" href="/supports">
            {t.faq.title} →
          </Link>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
