"use client";

import Link from "next/link";
import Image from "next/image";
import { FIRM } from "@/lib/config";
import { useLang } from "@/lib/i18n";

export default function SiteFooter() {
  const { t } = useLang();
  const year = 2026;
  const practiceHrefs = ["/#practice-areas", "/#practice-areas", "/#practice-areas", "/#practice-areas", "/#practice-areas"];
  const startHrefs = ["/intake", "/#how-it-works", "/#faq", FIRM.phoneHref];

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="brand">
              <Image className="brand__logo" src="/wayco-logo.png" alt={FIRM.name} width={308} height={93} />
              <span className="brand__sub">{t.footer.injuryLaw}</span>
            </div>
            <p style={{ marginTop: 14, maxWidth: "38ch" }}>{t.footer.tagline}</p>
            <p>
              <a href={FIRM.phoneHref}>{FIRM.phone}</a> &nbsp;·&nbsp;{" "}
              <a href={`mailto:${FIRM.email}`}>{FIRM.email}</a>
            </p>
          </div>

          <div className="footer__col">
            <h4>{t.footer.practiceHead}</h4>
            <ul>
              {t.footer.practiceLinks.map((label, i) => (
                <li key={label}>
                  <Link href={practiceHrefs[i]}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h4>{t.footer.startHead}</h4>
            <ul>
              {t.footer.startLinks.map((label, i) => {
                const href = startHrefs[i];
                const isExternal = href.startsWith("tel:") || href.startsWith("mailto:");
                return (
                  <li key={label}>
                    {isExternal ? <a href={href}>{label}</a> : <Link href={href}>{label}</Link>}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <p className="disclaimer">
          {t.footer.disclaimerLead}
          {FIRM.longName}
          {t.footer.disclaimerTail} © {year} {FIRM.longName}. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
