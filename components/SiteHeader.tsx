import Link from "next/link";
import { FIRM } from "@/lib/config";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header__row">
        <Link href="/" className="brand" aria-label={`${FIRM.name} home`}>
          <span className="brand__mark">{FIRM.name}</span>
          <span className="brand__sub">Injury Law</span>
        </Link>

        <nav className="nav" aria-label="Primary">
          <Link href="/#practice-areas">Practice areas</Link>
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/#why-wayco">Why Wayco</Link>
          <Link href="/#faq">FAQ</Link>
        </nav>

        <div className="header-cta">
          <a className="header-phone" href={FIRM.phoneHref}>
            {FIRM.phone}
            <span>Free consultation 24/7</span>
          </a>
          <Link className="btn btn--primary" href="/intake">
            Free case review
          </Link>
        </div>
      </div>
    </header>
  );
}
