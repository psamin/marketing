import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { FIRM } from "@/lib/config";

function Check() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const PRACTICE_AREAS = [
  { t: "Car & truck accidents", d: "Rear-end collisions, drunk drivers, uninsured motorists, and serious truck crashes." },
  { t: "Slip & fall / premises", d: "Injuries on unsafe property — wet floors, broken stairs, poor lighting, negligent security." },
  { t: "Medical malpractice", d: "Misdiagnosis, surgical errors, medication mistakes, and birth injuries." },
  { t: "Workplace injuries", d: "On-the-job accidents, construction injuries, and third-party liability claims." },
  { t: "Defective products", d: "Dangerous drugs, faulty auto parts, and consumer products that cause harm." },
  { t: "Wrongful death", d: "Compassionate, determined representation for families who have lost a loved one." },
];

const FAQS = [
  { q: "How much does it cost to hire Wayco?", a: "Nothing up front. We work on contingency — there is no fee unless we recover compensation for you. The case review is always free." },
  { q: "How do I know if I have a case?", a: "If someone else's negligence caused your injury, you may have a claim. The fastest way to find out is the free case review — it takes a few minutes and there's no obligation." },
  { q: "How long do I have to file a claim?", a: "Every state has a statute of limitations, and it can be shorter than you think. Don't wait — start your review today so we can protect your deadline." },
  { q: "What is my case worth?", a: "It depends on your injuries, treatment, lost income, and who was at fault. After your review, an attorney can give you a realistic picture of your options." },
  { q: "Will I have to go to court?", a: "Most injury claims settle without a trial. If a fair settlement isn't offered, we are prepared to take your case to court." },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      {/* HERO */}
      <section className="hero">
        <div className="container hero__grid">
          <div>
            <p className="eyebrow">Free case review · No fee unless we win</p>
            <h1>Injured in an accident? Find out <span className="accent-text">what your case is worth</span>.</h1>
            <p>
              If you were hurt because of someone else&apos;s negligence, you may be entitled to
              compensation for medical bills, lost wages, and pain and suffering. Wayco Injury Law
              reviews your case for free — and you pay nothing unless we win.
            </p>
            <div className="hero__cta">
              <Link className="btn btn--primary btn--lg" href="/intake">
                Start your free case review
              </Link>
              <a className="btn btn--ghost btn--lg" href={FIRM.phoneHref}>
                Call {FIRM.phone}
              </a>
            </div>
            <div className="hero__badges">
              <span className="hero__badge"><Check /> No fee unless we win</span>
              <span className="hero__badge"><Check /> 100% free &amp; confidential</span>
              <span className="hero__badge"><Check /> Available 24/7</span>
            </div>
          </div>

          <div className="hero__card" aria-label="How the free review works">
            <h3>Your free review in 3 steps</h3>
            <ol className="hero__steps">
              <li><strong>Tell us what happened.</strong> A few quick questions about your accident and injuries.</li>
              <li><strong>We review it free.</strong> Our team evaluates your claim — no cost, no obligation.</li>
              <li><strong>We fight for you.</strong> If we take your case, we pursue every dollar you&apos;re owed.</li>
            </ol>
            <Link className="btn btn--navy" href="/intake" style={{ width: "100%", marginTop: 18 }}>
              Begin now
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="trustbar">
        <div className="container trustbar__grid">
          <div><div className="num">$500M+</div><div className="label">Recovered for clients</div></div>
          <div><div className="num">25,000+</div><div className="label">Families helped</div></div>
          <div><div className="num">98%</div><div className="label">Client satisfaction</div></div>
          <div><div className="num">24/7</div><div className="label">Free consultations</div></div>
        </div>
      </section>

      {/* PRACTICE AREAS */}
      <section className="section" id="practice-areas">
        <div className="container">
          <div className="center" style={{ marginBottom: 40 }}>
            <p className="eyebrow">Practice areas</p>
            <h2>We handle serious injury claims</h2>
            <p className="lead">If you&apos;ve been hurt in one of these situations, we can help you understand your options.</p>
          </div>
          <div className="grid grid--3">
            {PRACTICE_AREAS.map((p) => (
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
            <p className="eyebrow">How it works</p>
            <h2>Getting started is simple and free</h2>
          </div>
          <div className="grid grid--3">
            <div className="card step"><div className="n">01</div><h3>Share your story</h3><p>Answer a few questions about your accident, your injuries, and what you remember. It takes just a few minutes.</p></div>
            <div className="card step"><div className="n">02</div><h3>Get a free review</h3><p>Our intake team reviews your information and a member of the firm follows up to discuss your claim — at no cost.</p></div>
            <div className="card step"><div className="n">03</div><h3>We pursue your claim</h3><p>If we take your case, we handle the insurance companies and fight for the full compensation you deserve.</p></div>
          </div>
        </div>
      </section>

      {/* WHY WAYCO */}
      <section className="section" id="why-wayco">
        <div className="container">
          <div className="center" style={{ marginBottom: 40 }}>
            <p className="eyebrow">Why Wayco</p>
            <h2>On your side from the first call</h2>
          </div>
          <div className="grid grid--4">
            <div className="card"><h3>No fee unless we win</h3><p>You owe us nothing unless we recover compensation for you. The review is always free.</p></div>
            <div className="card"><h3>Fast response</h3><p>Time matters in injury cases. We follow up quickly to protect your claim and your deadlines.</p></div>
            <div className="card"><h3>Real attorneys</h3><p>Your case is handled by experienced injury lawyers, not a call center.</p></div>
            <div className="card"><h3>Confidential</h3><p>Your information is private and used only to evaluate and pursue your claim.</p></div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section section--soft">
        <div className="container">
          <div className="center" style={{ marginBottom: 40 }}>
            <p className="eyebrow">Client results</p>
            <h2>Real people. Real outcomes.</h2>
          </div>
          <div className="grid grid--3">
            <div className="quote"><p>&ldquo;After my car accident I didn&apos;t know where to turn. Wayco handled everything and got me far more than the insurance company first offered.&rdquo;</p><p className="who">— Maria T., car accident</p></div>
            <div className="quote"><p>&ldquo;They were responsive, honest, and never made me feel like just another case. I&apos;d recommend them to anyone.&rdquo;</p><p className="who">— James R., workplace injury</p></div>
            <div className="quote"><p>&ldquo;I paid nothing up front and they fought for my family the whole way. Truly grateful.&rdquo;</p><p className="who">— Denise K., wrongful death</p></div>
          </div>
          <p className="center" style={{ color: "var(--muted)", fontSize: "0.82rem", marginTop: 24 }}>
            Testimonials are illustrative. Prior results do not guarantee a similar outcome.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq">
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="center" style={{ marginBottom: 24 }}>
            <p className="eyebrow">Questions</p>
            <h2>Frequently asked</h2>
          </div>
          <div className="faq">
            {FAQS.map((f) => (
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
            <h2>You may have a case. Find out for free.</h2>
            <p>There&apos;s no cost and no obligation. Start your confidential case review now, or call us any time at {FIRM.phone}.</p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link className="btn btn--primary btn--lg" href="/intake">Start your free case review</Link>
              <a className="btn btn--ghost btn--lg" href={FIRM.phoneHref}>Call {FIRM.phone}</a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
