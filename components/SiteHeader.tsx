"use client";

import Link from "next/link";
import Image from "next/image";
import { FIRM } from "@/lib/config";
import { LanguageToggle, useLang } from "@/lib/i18n";

export default function SiteHeader() {
  const { t } = useLang();
  return (
    <header className="site-header">
      <div className="container site-header__row">
        <Link href="/" className="brand" aria-label={`${FIRM.name} — ${t.header.injuryLaw}`}>
          <Image className="brand__logo" src="/wayco-logo.png" alt={FIRM.name} width={308} height={93} priority />
        </Link>

        <nav className="nav" aria-label="Primary">
          <Link href="/#practice-areas">{t.header.nav.practiceAreas}</Link>
          <Link href="/#how-it-works">{t.header.nav.howItWorks}</Link>
          <Link href="/#why-wayco">{t.header.nav.whyWayco}</Link>
          <Link href="/#faq">{t.header.nav.faq}</Link>
        </nav>

        <div className="header-cta">
          <a className="header-phone" href={FIRM.phoneHref}>
            {FIRM.phone}
            <span>{t.header.freeConsult}</span>
          </a>
          <Link className="btn btn--primary" href="/intake">
            {t.header.freeReview}
          </Link>
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
