"use client";

import Link from "next/link";
import { FIRM, LEGAL } from "@/lib/config";
import { useLang } from "@/lib/i18n";

export default function LegalPage() {
  const { t } = useLang();
  const year = 2026;
  const entity = t.footer.entityDisclosure
    .replace(/\{firm\}/g, LEGAL.firmEntity)
    .replace("{attorney}", LEGAL.responsibleAttorney)
    .replace("{states}", LEGAL.admittedStates)
    .replace("{office}", LEGAL.officeAddress)
    .replace("{tech}", LEGAL.techEntity);

  return (
    <main className="container legal-page">
      <p className="footer__adlabel">{t.footer.attorneyAdvertising}</p>
      <h1>{t.footer.legalTitle}</h1>
      <p>
        {t.footer.disclaimerLead}
        {FIRM.longName}
        {t.footer.disclaimerTail}
      </p>
      <p>{entity}</p>
      <p className="legal-meta">
        © {year} {FIRM.longName}. {t.footer.rights}
      </p>
      <p className="legal-links">
        <Link href="/">← Home</Link>
        <Link href="/privacy">{t.footer.privacyLabel}</Link>
      </p>
    </main>
  );
}
