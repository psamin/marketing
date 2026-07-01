"use client";

import { useState } from "react";
import { FIRM } from "@/lib/config";
import { useLang } from "@/lib/i18n";

type Data = {
  type: string;
  when: string;
  injury: string;
  treating: string;
  firstName: string;
  phone: string;
  email: string;
};

const EMPTY: Data = {
  type: "", when: "", injury: "", treating: "",
  firstName: "", phone: "", email: "",
};

export default function IntakeWidget() {
  const { t } = useLang();
  const w = t.intakeWidget;
  const TOTAL = 3;

  const [step, setStep] = useState(1);
  const [data, setData] = useState<Data>(EMPTY);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [consent, setConsent] = useState(false);

  const set = (k: keyof Data, v: string) => setData((d) => ({ ...d, [k]: v }));

  function next() {
    if (step === 1 && !data.type) return setError(w.errorRequired);
    if (step === 3 && (!data.firstName.trim() || !data.phone.trim()))
      return setError(w.errorRequired);
    setError("");
    if (step < TOTAL) setStep((s) => s + 1);
    else submit();
  }
  function back() {
    setError("");
    setStep((s) => Math.max(1, s - 1));
  }

  async function submit() {
    setStatus("sending");
    try {
      await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch {
      /* fire-and-forget; still confirm to the user */
    }
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="iw" role="status" aria-live="polite">
        <div className="iw__done">
          <div className="iw__check" aria-hidden="true">✓</div>
          <h2>{w.doneTitle}</h2>
          <p>{w.doneBody}</p>
          <a className="btn btn--primary" href={FIRM.phoneHref}>
            {FIRM.phone}
          </a>
        </div>
      </div>
    );
  }

  const pct = Math.round(((step - 1) / TOTAL) * 100);

  return (
    <div className="iw">
      <div className="iw__head">
        <span className="iw__step">
          {w.stepLabel} {step} {w.of} {TOTAL}
        </span>
        <span className="iw__note">{w.privacyNote}</span>
      </div>
      <div className="iw__track" aria-hidden="true">
        <span style={{ width: `${pct + 100 / TOTAL}%` }} />
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <fieldset className="iw__step-body">
          <legend className="iw__q">{w.q1Title}</legend>
          <div className="iw__choices">
            {w.q1Types.map((label) => (
              <button
                type="button"
                key={label}
                className={`iw__choice${data.type === label ? " is-on" : ""}`}
                aria-pressed={data.type === label}
                onClick={() => { set("type", label); setError(""); }}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="iw__field">
            <span>{w.dateLabel}</span>
            <input
              type="date"
              value={data.when}
              onChange={(e) => set("when", e.target.value)}
            />
          </label>
        </fieldset>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <fieldset className="iw__step-body">
          <legend className="iw__q">{w.q2Title}</legend>
          <label className="iw__field">
            <span>{w.injuryLabel}</span>
            <textarea
              rows={5}
              value={data.injury}
              placeholder={w.injuryPlaceholder}
              onChange={(e) => set("injury", e.target.value)}
            />
          </label>
          <div className="iw__field">
            <span>{w.treatingLabel}</span>
            <div className="iw__choices iw__choices--row">
              {w.opts.map((o) => (
                <button
                  type="button"
                  key={o}
                  className={`iw__choice${data.treating === o ? " is-on" : ""}`}
                  aria-pressed={data.treating === o}
                  onClick={() => set("treating", o)}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        </fieldset>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <fieldset className="iw__step-body">
          <legend className="iw__q">{w.q3Title}</legend>
          <label className="iw__field">
            <span>{w.firstNameLabel}</span>
            <input
              type="text"
              autoComplete="given-name"
              value={data.firstName}
              onChange={(e) => set("firstName", e.target.value)}
            />
          </label>
          <label className="iw__field">
            <span>{w.phoneLabel}</span>
            <input
              type="tel"
              autoComplete="tel"
              value={data.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </label>
          <label className="iw__field">
            <span>{w.emailLabel}</span>
            <input
              type="email"
              autoComplete="email"
              value={data.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </label>
          <label className="iw__consent">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => { setConsent(e.target.checked); setError(""); }}
            />
            <span>
              {t.intake.consentLead}
              {FIRM.longName}
              {t.intake.consentMid}
              <strong>{t.intake.consentNot}</strong>
              {t.intake.consentTail}
            </span>
          </label>
        </fieldset>
      )}

      {error && (
        <p className="iw__error" role="alert">
          {error}
        </p>
      )}

      <div className="iw__actions">
        {step > 1 ? (
          <button type="button" className="btn btn--ghost" onClick={back}>
            {w.back}
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          className="btn btn--primary"
          onClick={next}
          disabled={status === "sending" || (step === TOTAL && !consent)}
        >
          {step < TOTAL ? w.next : status === "sending" ? w.submitting : w.submit}
        </button>
      </div>
    </div>
  );
}
