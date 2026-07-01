"use client";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useLang } from "@/lib/i18n";

export default function FaqPage() {
  const { t } = useLang();
  return (
    <>
      <SiteHeader />
      <section className="section" id="faq">
        <div className="container" style={{ maxWidth: 760 }}>
          <h1 className="faq-title">{t.faq.title}</h1>
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
      <SiteFooter />
    </>
  );
}
