"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "es";

// Full page copy in both languages. Keep the shape identical across languages so
// components can index the active dictionary with the same keys.
const DICT = {
  en: {
    lang: { en: "English", es: "Spanish", toggleAria: "Switch language" },
    header: {
      injuryLaw: "Injury Law",
      nav: {
        practiceAreas: "Practice areas",
        howItWorks: "How it works",
        whyWayco: "Why Wayco",
        faq: "FAQ",
      },
      freeConsult: "Free consultation 24/7",
      freeReview: "Free case review",
    },
    hero: {
      eyebrow: "Free case review · No fee unless we win",
      titleLead: "Injured in an accident? Find out ",
      titleAccent: "what your case is worth",
      titleTail: ".",
      body:
        "If you were hurt because of someone else’s negligence, you may be entitled to compensation for medical bills, lost wages, and pain and suffering. Wayco Injury Law reviews your case for free — and you pay nothing unless we win.",
      ctaPrimary: "Start your free case review",
      call: "Call",
      badges: ["No fee unless we win", "100% free & confidential", "Available 24/7"],
      cardTitle: "Your free review in 3 steps",
      steps: [
        ["Tell us what happened.", " A few quick questions about your accident and injuries."],
        ["We review it free.", " Our team evaluates your claim — no cost, no obligation."],
        ["We fight for you.", " If we take your case, we pursue every dollar you’re owed."],
      ],
      begin: "Begin now",
    },
    practice: {
      eyebrow: "Practice areas",
      title: "We handle serious injury claims",
      lead: "If you’ve been hurt in one of these situations, we can help you understand your options.",
      items: [
        { t: "Car & truck accidents", d: "Rear-end collisions, drunk drivers, uninsured motorists, and serious truck crashes." },
        { t: "Slip & fall / premises", d: "Injuries on unsafe property — wet floors, broken stairs, poor lighting, negligent security." },
        { t: "Medical malpractice", d: "Misdiagnosis, surgical errors, medication mistakes, and birth injuries." },
        { t: "Workplace injuries", d: "On-the-job accidents, construction injuries, and third-party liability claims." },
        { t: "Defective products", d: "Dangerous drugs, faulty auto parts, and consumer products that cause harm." },
        { t: "Wrongful death", d: "Compassionate, determined representation for families who have lost a loved one." },
      ],
    },
    how: {
      eyebrow: "How it works",
      title: "Getting started is simple and free",
      steps: [
        { h: "Share your story", p: "Answer a few questions about your accident, your injuries, and what you remember. It takes just a few minutes." },
        { h: "Get a free review", p: "Our intake team reviews your information and a member of the firm follows up to discuss your claim — at no cost." },
        { h: "We pursue your claim", p: "If we take your case, we handle the insurance companies and fight for the full compensation you deserve." },
      ],
    },
    why: {
      eyebrow: "Why Wayco",
      title: "On your side from the first call",
      cards: [
        { h: "No fee unless we win", p: "You owe us nothing unless we recover compensation for you. The review is always free." },
        { h: "Fast response", p: "Time matters in injury cases. We follow up quickly to protect your claim and your deadlines." },
        { h: "Real attorneys", p: "Your case is handled by experienced injury lawyers, not a call center." },
        { h: "Confidential", p: "Your information is private and used only to evaluate and pursue your claim." },
      ],
    },
    faq: {
      eyebrow: "Questions",
      title: "Frequently asked",
      items: [
        { q: "How much does it cost to hire Wayco?", a: "Nothing up front. We work on contingency — there is no fee unless we recover compensation for you. The case review is always free." },
        { q: "How do I know if I have a case?", a: "If someone else’s negligence caused your injury, you may have a claim. The fastest way to find out is the free case review — it takes a few minutes and there’s no obligation." },
        { q: "How long do I have to file a claim?", a: "Every state has a statute of limitations, and it can be shorter than you think. Don’t wait — start your review today so we can protect your deadline." },
        { q: "What is my case worth?", a: "It depends on your injuries, treatment, lost income, and who was at fault. After your review, an attorney can give you a realistic picture of your options." },
        { q: "Will I have to go to court?", a: "Most injury claims settle without a trial. If a fair settlement isn’t offered, we are prepared to take your case to court." },
      ],
    },
    finalCta: {
      title: "You may have a case. Find out for free.",
      bodyLead: "There’s no cost and no obligation. Start your confidential case review now, or call us any time at ",
      ctaPrimary: "Start your free case review",
      call: "Call",
    },
    footer: {
      injuryLaw: "Injury Law",
      tagline:
        "Injured? You may be owed compensation. Free, confidential case reviews for accident and injury victims nationwide. No fee unless we win.",
      practiceHead: "Practice areas",
      practiceLinks: ["Car accidents", "Slip & fall", "Medical malpractice", "Workplace injury", "Wrongful death"],
      startHead: "Get started",
      startLinks: ["Start your case review", "How it works", "FAQ", "Call us"],
      disclaimerLead:
        "Attorney Advertising. The information on this website is for general informational purposes only and is not legal advice. No attorney-client relationship is created by using this site or by submitting an intake form; an attorney-client relationship is formed only by a signed written agreement. Prior results do not guarantee a similar outcome. Contacting ",
      disclaimerTail:
        " does not obligate you to retain the firm, and the firm does not guarantee acceptance of any case. If you are facing a deadline (statute of limitations), do not delay seeking counsel.",
      rights: "All rights reserved.",
    },
    intake: {
      eyebrow: "Free & confidential",
      title: "Start your free case review",
      introLead:
        "Answer a few questions about your accident and injuries. There’s no cost and no obligation, and your information is kept confidential. Prefer to talk? Call ",
      introTail: ".",
      iframeTitle: "Wayco Injury Law intake form",
      consentLead: "By submitting this form you agree to be contacted by ",
      consentMid:
        " about your potential claim, including by phone, text, and email. Submitting this form does ",
      consentNot: "not",
      consentTail: " create an attorney-client relationship and is not legal advice.",
      notConnectedTitle: "Intake form not connected yet",
      helpLead: "Need help or facing a deadline? ",
      helpHome: "Return home",
      helpMid: " or call ",
      helpTail: " — we’re available 24/7.",
    },
  },
  es: {
    lang: { en: "English", es: "Español", toggleAria: "Cambiar idioma" },
    header: {
      injuryLaw: "Derecho de Lesiones",
      nav: {
        practiceAreas: "Áreas de práctica",
        howItWorks: "Cómo funciona",
        whyWayco: "Por qué Wayco",
        faq: "Preguntas",
      },
      freeConsult: "Consulta gratis 24/7",
      freeReview: "Evaluación gratuita",
    },
    hero: {
      eyebrow: "Evaluación gratuita del caso · Sin honorarios a menos que ganemos",
      titleLead: "¿Lesionado en un accidente? Descubra ",
      titleAccent: "cuánto vale su caso",
      titleTail: ".",
      body:
        "Si resultó lesionado por la negligencia de otra persona, es posible que tenga derecho a una compensación por gastos médicos, salarios perdidos, y dolor y sufrimiento. Wayco Injury Law evalúa su caso gratis — y usted no paga nada a menos que ganemos.",
      ctaPrimary: "Comience su evaluación gratuita",
      call: "Llame al",
      badges: ["Sin honorarios a menos que ganemos", "100% gratis y confidencial", "Disponible 24/7"],
      cardTitle: "Su evaluación gratuita en 3 pasos",
      steps: [
        ["Cuéntenos qué pasó.", " Unas pocas preguntas rápidas sobre su accidente y sus lesiones."],
        ["La evaluamos gratis.", " Nuestro equipo evalúa su reclamo — sin costo, sin compromiso."],
        ["Luchamos por usted.", " Si aceptamos su caso, buscamos cada dólar que se le debe."],
      ],
      begin: "Comenzar ahora",
    },
    practice: {
      eyebrow: "Áreas de práctica",
      title: "Atendemos reclamos por lesiones graves",
      lead: "Si resultó lesionado en una de estas situaciones, podemos ayudarle a entender sus opciones.",
      items: [
        { t: "Accidentes de auto y camión", d: "Colisiones por alcance, conductores ebrios, automovilistas sin seguro y accidentes graves de camión." },
        { t: "Resbalones y caídas / propiedad", d: "Lesiones en propiedades inseguras — pisos mojados, escaleras rotas, mala iluminación, seguridad negligente." },
        { t: "Negligencia médica", d: "Diagnósticos erróneos, errores quirúrgicos, errores de medicación y lesiones de parto." },
        { t: "Lesiones laborales", d: "Accidentes en el trabajo, lesiones de construcción y reclamos de responsabilidad de terceros." },
        { t: "Productos defectuosos", d: "Medicamentos peligrosos, piezas de auto defectuosas y productos de consumo que causan daño." },
        { t: "Muerte por negligencia", d: "Representación compasiva y decidida para familias que han perdido a un ser querido." },
      ],
    },
    how: {
      eyebrow: "Cómo funciona",
      title: "Comenzar es sencillo y gratis",
      steps: [
        { h: "Cuéntenos su historia", p: "Responda unas preguntas sobre su accidente, sus lesiones y lo que recuerda. Solo toma unos minutos." },
        { h: "Reciba una evaluación gratis", p: "Nuestro equipo de admisión revisa su información y un miembro de la firma le contacta para hablar de su reclamo — sin costo." },
        { h: "Perseguimos su reclamo", p: "Si aceptamos su caso, nos encargamos de las compañías de seguros y luchamos por la compensación completa que merece." },
      ],
    },
    why: {
      eyebrow: "Por qué Wayco",
      title: "De su lado desde la primera llamada",
      cards: [
        { h: "Sin honorarios a menos que ganemos", p: "No nos debe nada a menos que recuperemos una compensación para usted. La evaluación siempre es gratis." },
        { h: "Respuesta rápida", p: "El tiempo importa en los casos de lesiones. Damos seguimiento rápido para proteger su reclamo y sus plazos." },
        { h: "Abogados de verdad", p: "Su caso lo manejan abogados de lesiones con experiencia, no un centro de llamadas." },
        { h: "Confidencial", p: "Su información es privada y se usa solo para evaluar y perseguir su reclamo." },
      ],
    },
    faq: {
      eyebrow: "Preguntas",
      title: "Preguntas frecuentes",
      items: [
        { q: "¿Cuánto cuesta contratar a Wayco?", a: "Nada por adelantado. Trabajamos por honorarios de contingencia — no hay cargo a menos que recuperemos una compensación para usted. La evaluación del caso siempre es gratis." },
        { q: "¿Cómo sé si tengo un caso?", a: "Si la negligencia de otra persona causó su lesión, es posible que tenga un reclamo. La forma más rápida de saberlo es la evaluación gratuita — toma unos minutos y no hay ningún compromiso." },
        { q: "¿Cuánto tiempo tengo para presentar un reclamo?", a: "Cada estado tiene un plazo de prescripción, y puede ser más corto de lo que piensa. No espere — comience su evaluación hoy para que podamos proteger su plazo." },
        { q: "¿Cuánto vale mi caso?", a: "Depende de sus lesiones, tratamiento, ingresos perdidos y de quién tuvo la culpa. Después de su evaluación, un abogado puede darle un panorama realista de sus opciones." },
        { q: "¿Tendré que ir a la corte?", a: "La mayoría de los reclamos por lesiones se resuelven sin juicio. Si no se ofrece un acuerdo justo, estamos preparados para llevar su caso a la corte." },
      ],
    },
    finalCta: {
      title: "Es posible que tenga un caso. Descubra gratis.",
      bodyLead: "No hay costo ni compromiso. Comience su evaluación confidencial ahora, o llámenos en cualquier momento al ",
      ctaPrimary: "Comience su evaluación gratuita",
      call: "Llame al",
    },
    footer: {
      injuryLaw: "Derecho de Lesiones",
      tagline:
        "¿Lesionado? Es posible que se le deba una compensación. Evaluaciones de casos gratuitas y confidenciales para víctimas de accidentes y lesiones en todo el país. Sin honorarios a menos que ganemos.",
      practiceHead: "Áreas de práctica",
      practiceLinks: ["Accidentes de auto", "Resbalones y caídas", "Negligencia médica", "Lesiones laborales", "Muerte por negligencia"],
      startHead: "Comenzar",
      startLinks: ["Comience su evaluación", "Cómo funciona", "Preguntas", "Llámenos"],
      disclaimerLead:
        "Publicidad de Abogados. La información en este sitio web es solo para fines informativos generales y no constituye asesoramiento legal. No se crea ninguna relación abogado-cliente por usar este sitio ni por enviar un formulario de admisión; una relación abogado-cliente se forma únicamente mediante un acuerdo escrito firmado. Los resultados anteriores no garantizan un resultado similar. Contactar a ",
      disclaimerTail:
        " no le obliga a contratar a la firma, y la firma no garantiza la aceptación de ningún caso. Si enfrenta un plazo (prescripción), no demore en buscar asesoría legal.",
      rights: "Todos los derechos reservados.",
    },
    intake: {
      eyebrow: "Gratis y confidencial",
      title: "Comience su evaluación gratuita",
      introLead:
        "Responda unas preguntas sobre su accidente y sus lesiones. No hay costo ni compromiso, y su información se mantiene confidencial. ¿Prefiere hablar? Llame al ",
      introTail: ".",
      iframeTitle: "Formulario de admisión de Wayco Injury Law",
      consentLead: "Al enviar este formulario, usted acepta que ",
      consentMid:
        " lo contacte sobre su posible reclamo, incluso por teléfono, mensaje de texto y correo electrónico. Enviar este formulario ",
      consentNot: "no",
      consentTail: " crea una relación abogado-cliente y no constituye asesoramiento legal.",
      notConnectedTitle: "El formulario de admisión aún no está conectado",
      helpLead: "¿Necesita ayuda o enfrenta un plazo? ",
      helpHome: "Volver al inicio",
      helpMid: " o llame al ",
      helpTail: " — estamos disponibles 24/7.",
    },
  },
} as const;

export type Dict = (typeof DICT)["en"];

const LanguageContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Dict } | null>(null);

const STORAGE_KEY = "wayco.lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Restore the saved preference on mount (client-only, avoids hydration mismatch).
  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (saved === "es" || saved === "en") setLangState(saved);
  }, []);

  // Keep <html lang> and storage in sync with the active language.
  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: DICT[lang] as Dict }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}

/** Segmented English / Spanish toggle. The active side is black-filled, the other white. */
export function LanguageToggle() {
  const { lang, setLang, t } = useLang();
  return (
    <div className="lang-toggle" role="group" aria-label={t.lang.toggleAria}>
      <button
        type="button"
        className={`lang-toggle__btn${lang === "en" ? " is-active" : ""}`}
        aria-pressed={lang === "en"}
        onClick={() => setLang("en")}
      >
        {t.lang.en}
      </button>
      <button
        type="button"
        className={`lang-toggle__btn${lang === "es" ? " is-active" : ""}`}
        aria-pressed={lang === "es"}
        onClick={() => setLang("es")}
      >
        {t.lang.es}
      </button>
    </div>
  );
}
