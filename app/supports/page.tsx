"use client";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useLang } from "@/lib/i18n";

export default function SupportsPage() {
  const { t } = useLang();
  return (
    <>
      <SiteHeader />
      <section className="section" id="supports">
        <div className="container" style={{ maxWidth: 720 }}>
          <h1 className="faq-title">{t.faq.title}</h1>
          <ul className="support-list">
            {t.faq.items.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
