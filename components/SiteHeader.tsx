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

        <div className="header-cta">
          <Link className="header-faq" href="/faq">
            {t.header.faqs}
          </Link>
          <a className="header-phone" href={FIRM.phoneHref}>
            {FIRM.phone}
            <span>{t.header.freeConsult}</span>
          </a>
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
