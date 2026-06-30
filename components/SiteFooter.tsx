import Link from "next/link";
import { FIRM } from "@/lib/config";

export default function SiteFooter() {
  const year = 2026;
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="brand">
              <span className="brand__mark">{FIRM.name}</span>
              <span className="brand__sub">Injury Law</span>
            </div>
            <p style={{ marginTop: 14, maxWidth: "38ch" }}>
              {FIRM.tagline} Free, confidential case reviews for accident and injury victims
              nationwide. No fee unless we win.
            </p>
            <p>
              <a href={FIRM.phoneHref}>{FIRM.phone}</a> &nbsp;·&nbsp;{" "}
              <a href={`mailto:${FIRM.email}`}>{FIRM.email}</a>
            </p>
          </div>

          <div className="footer__col">
            <h4>Practice areas</h4>
            <ul>
              <li><Link href="/#practice-areas">Car accidents</Link></li>
              <li><Link href="/#practice-areas">Slip &amp; fall</Link></li>
              <li><Link href="/#practice-areas">Medical malpractice</Link></li>
              <li><Link href="/#practice-areas">Workplace injury</Link></li>
              <li><Link href="/#practice-areas">Wrongful death</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Get started</h4>
            <ul>
              <li><Link href="/intake">Start your case review</Link></li>
              <li><Link href="/#how-it-works">How it works</Link></li>
              <li><Link href="/#faq">FAQ</Link></li>
              <li><a href={FIRM.phoneHref}>Call us</a></li>
            </ul>
          </div>
        </div>

        <p className="disclaimer">
          Attorney Advertising. The information on this website is for general informational
          purposes only and is not legal advice. No attorney-client relationship is created by
          using this site or by submitting an intake form; an attorney-client relationship is
          formed only by a signed written agreement. Prior results do not guarantee a similar
          outcome. Contacting {FIRM.longName} does not obligate you to retain the firm, and the
          firm does not guarantee acceptance of any case. If you are facing a deadline (statute of
          limitations), do not delay seeking counsel. © {year} {FIRM.longName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
