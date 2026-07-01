"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "es";

// Full page copy in both languages. Keep the shape identical across languages so
// components can index the active dictionary with the same keys.
const DICT = {
  en: {
    lang: { en: "English", es: "Español", toggleAria: "Switch language" },
    header: {
      injuryLaw: "Wayco",
      nav: {
        practiceAreas: "Practice areas",
        howItWorks: "How it works",
        whyWayco: "Why Wayco",
        faq: "FAQ",
      },
      freeConsult: "Reach us any time",
      freeReview: "Free case review",
      faqs: "Support",
    },
    hero: {
      eyebrow: "Free case review · No fee unless we win",
      titleLead: "Injured in an accident? Find out ",
      titleAccent: "if you may have a claim",
      titleTail: ".",
      body:
        "If you were hurt because of someone else’s negligence, you may be entitled to compensation for medical bills, lost wages, and pain and suffering. Wayco reviews your case for free — and you pay nothing unless we win.",
      ctaPrimary: "Start your free case review",
      call: "Call",
      badges: ["No fee unless we win*", "Free case review", "Fast response"],
      cardTitle: "Your free review in 3 steps",
      steps: [
        ["Tell us what happened.", " A few quick questions about your accident and injuries."],
        ["We review it free.", " Our team evaluates your claim — no cost, no obligation."],
        ["We pursue your claim.", " If we take your case, we pursue the compensation available under the law."],
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
        { h: "We pursue your claim", p: "If we take your case, we handle the insurance companies and pursue the compensation available under the law." },
      ],
    },
    why: {
      eyebrow: "Why Wayco",
      title: "On your side from the first call",
      cards: [
        { h: "No fee unless we win", p: "You owe us nothing unless we recover compensation for you. The review is always free." },
        { h: "Fast response", p: "Time matters in injury cases. We follow up quickly." },
        { h: "Licensed attorneys", p: "Your case is handled by licensed attorneys. Intake may be AI-assisted; legal decisions are made by lawyers." },
        { h: "Private", p: "Your information is used only to evaluate your potential claim." },
      ],
    },
    faq: {
      eyebrow: "Support",
      title: "Support",
      items: [
        "It’s free to find out if you have a claim — a few quick questions, no obligation.",
        "You pay nothing up front. A fee applies only if Wayco wins your case, out of what’s recovered for you.",
        "You can reach us any time, day or night, and a Wayco attorney follows up as quickly as possible.",
        "Deadlines to file are set by your state and are often shorter than people expect.",
        "No one can promise an amount. What you may recover depends on your injuries, treatment, lost income, and who was at fault.",
        "95% of personal injury cases are settled pre-litigation.",
      ],
    },
    finalCta: {
      title: "You may have a case. Find out for free.",
      bodyLead: "There’s no cost and no obligation. Start your confidential case review now, or call us any time at ",
      ctaPrimary: "Start your free case review",
      call: "Call",
    },
    footer: {
      injuryLaw: "Wayco",
      tagline:
        "Injured? You may be owed compensation. Free case reviews for accident and injury victims. No fee unless we win (attorney fees only; case costs may apply).",
      practiceHead: "Practice areas",
      practiceLinks: ["Car accidents", "Slip & fall", "Medical malpractice", "Workplace injury", "Wrongful death"],
      startHead: "Get started",
      startLinks: ["Start your case review", "How it works", "Support", "Call us"],
      disclaimerLead:
        "In accordance with New York and other state ethics rules governing law firm websites, the contents of this site may be considered Attorney Advertising. The information here is for general informational purposes only and is not legal advice, and you should not act on it without consulting counsel. No attorney-client relationship is created by using this site or by submitting an intake form; a relationship is formed only by a signed written agreement. Prior results do not guarantee a similar outcome. Contacting ",
      disclaimerTail:
        " does not obligate you to retain the firm, and the firm does not guarantee acceptance of any case. Even in a contingency (“no fee unless we win”) matter, you may still be responsible for case costs and expenses regardless of the outcome. The firm does not practice law in any jurisdiction except those in which its attorneys are licensed. If you are facing a deadline (statute of limitations), do not delay seeking counsel.",
      // Entity-separation disclosure — modeled on LegalZoom's affiliated-law-firm
      // line + Zuckerman's responsible-attorney/office/jurisdiction disclosures.
      entityDisclosure:
        "{firm} is an independent law firm and is responsible for this advertisement; {attorney} is the attorney responsible for its content, and {firm}'s attorneys are admitted to practice in {states} (principal law office: {office}). {tech} is not a law firm and does not provide legal advice or legal services, except as provided through its affiliated law firm, {firm}. {tech} is a technology and administrative-services company that provides services to the firm for fixed, fair-market-value fees; it does not direct legal decisions and does not select or refer clients.",
      rights: "All rights reserved.",
      attorneyAdvertising: "Attorney Advertising",
      legalNotices: "Legal Notices",
      privacyLabel: "Privacy",
      legalTitle: "Legal Notices & Disclaimers",
    },
    intake: {
      eyebrow: "Free & confidential",
      title: "Start your free case review",
      introLead:
        "Answer a few questions about your accident and injuries. There’s no cost and no obligation, and your information is used only to evaluate your potential claim. Prefer to talk? Call ",
      introTail: ".",
      iframeTitle: "Wayco intake form",
      consentLead: "By submitting this form you agree to be contacted by ",
      consentMid:
        " about your potential claim at the phone number and email provided, including by automated dialing, prerecorded/AI voice, and text message. Consent is not a condition of any legal service; message and data rates may apply; reply STOP to opt out of texts. Submitting this form does ",
      consentNot: "not",
      consentTail: " create an attorney-client relationship and is not legal advice. See our Privacy Policy for how your information is used.",
      notConnectedTitle: "Intake form not connected yet",
      helpLead: "Need help or facing a deadline? ",
      helpHome: "Return home",
      helpMid: " or call ",
      helpTail: " — we’re available 24/7.",
    },
    intakeWidget: {
      stepLabel: "Step",
      of: "of",
      q1Title: "What happened?",
      q1Types: [
        "Car or truck accident",
        "Slip & fall",
        "Medical malpractice",
        "Workplace injury",
        "Defective product",
        "Something else",
      ],
      dateLabel: "Roughly when?",
      q2Title: "Were you hurt?",
      injuryLabel: "Describe what happened — take as much space as you need",
      injuryPlaceholder: "e.g. Rear-ended at a light — neck and back pain, saw a doctor two days later…",
      treatingLabel: "Seeing a doctor for it?",
      opts: ["Yes", "Not yet", "No"],
      q3Title: "Where can we reach you?",
      firstNameLabel: "First name",
      phoneLabel: "Phone",
      emailLabel: "Email (optional)",
      back: "Back",
      next: "Continue",
      submit: "Get my free review",
      submitting: "Sending…",
      doneTitle: "Got it — thank you.",
      doneBody: "A member of the firm will reach out shortly.",
      errorRequired: "Please complete this to continue.",
      privacyNote: "Free & confidential · No obligation",
    },
  },
  es: {
    lang: { en: "English", es: "Español", toggleAria: "Cambiar idioma" },
    header: {
      injuryLaw: "Wayco",
      nav: {
        practiceAreas: "Áreas de práctica",
        howItWorks: "Cómo funciona",
        whyWayco: "Por qué Wayco",
        faq: "Preguntas",
      },
      freeConsult: "Comuníquese en cualquier momento",
      freeReview: "Evaluación gratuita",
      faqs: "Soporte",
    },
    hero: {
      eyebrow: "Evaluación gratuita del caso · Sin honorarios a menos que ganemos",
      titleLead: "¿Lesionado en un accidente? Descubra ",
      titleAccent: "si podría tener un reclamo",
      titleTail: ".",
      body:
        "Si resultó lesionado por la negligencia de otra persona, es posible que tenga derecho a una compensación por gastos médicos, salarios perdidos, y dolor y sufrimiento. Wayco evalúa su caso gratis — y usted no paga nada a menos que ganemos.",
      ctaPrimary: "Comience su evaluación gratuita",
      call: "Llame al",
      badges: ["Sin honorarios a menos que ganemos*", "Evaluación gratuita", "Respuesta rápida"],
      cardTitle: "Su evaluación gratuita en 3 pasos",
      steps: [
        ["Cuéntenos qué pasó.", " Unas pocas preguntas rápidas sobre su accidente y sus lesiones."],
        ["La evaluamos gratis.", " Nuestro equipo evalúa su reclamo — sin costo, sin compromiso."],
        ["Perseguimos su reclamo.", " Si aceptamos su caso, buscamos la compensación disponible bajo la ley."],
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
        { h: "Perseguimos su reclamo", p: "Si aceptamos su caso, nos encargamos de las compañías de seguros y buscamos la compensación disponible bajo la ley." },
      ],
    },
    why: {
      eyebrow: "Por qué Wayco",
      title: "De su lado desde la primera llamada",
      cards: [
        { h: "Sin honorarios a menos que ganemos", p: "No nos debe nada a menos que recuperemos una compensación para usted. La evaluación siempre es gratis." },
        { h: "Respuesta rápida", p: "El tiempo importa en los casos de lesiones. Damos seguimiento rápido." },
        { h: "Abogados con licencia", p: "Su caso lo manejan abogados con licencia. La admisión puede ser asistida por IA; las decisiones legales las toman los abogados." },
        { h: "Privado", p: "Su información se usa solo para evaluar su posible reclamo." },
      ],
    },
    faq: {
      eyebrow: "Soporte",
      title: "Soporte",
      items: [
        "Averiguar si tiene un reclamo es gratis — unas preguntas rápidas, sin compromiso.",
        "No paga nada por adelantado. Solo hay honorarios si Wayco gana su caso, y salen de lo que se recupere para usted.",
        "Puede comunicarse con nosotros a cualquier hora, de día o de noche, y un abogado de Wayco le responde lo antes posible.",
        "Los plazos para presentar los fija su estado y suelen ser más cortos de lo que la gente cree.",
        "Nadie puede prometer una cantidad. Lo que podría recuperar depende de sus lesiones, tratamiento, ingresos perdidos y de quién tuvo la culpa.",
        "El 95% de los casos de lesiones personales se resuelven antes de litigar.",
      ],
    },
    finalCta: {
      title: "Es posible que tenga un caso. Descubra gratis.",
      bodyLead: "No hay costo ni compromiso. Comience su evaluación confidencial ahora, o llámenos en cualquier momento al ",
      ctaPrimary: "Comience su evaluación gratuita",
      call: "Llame al",
    },
    footer: {
      injuryLaw: "Wayco",
      tagline:
        "¿Lesionado? Es posible que se le deba una compensación. Evaluaciones de casos gratuitas para víctimas de accidentes y lesiones. Sin honorarios a menos que ganemos (solo honorarios de abogado; pueden aplicarse costos del caso).",
      practiceHead: "Áreas de práctica",
      practiceLinks: ["Accidentes de auto", "Resbalones y caídas", "Negligencia médica", "Lesiones laborales", "Muerte por negligencia"],
      startHead: "Comenzar",
      startLinks: ["Comience su evaluación", "Cómo funciona", "Soporte", "Llámenos"],
      disclaimerLead:
        "De acuerdo con las reglas de ética de Nueva York y otros estados sobre los sitios web de firmas de abogados, el contenido de este sitio puede considerarse Publicidad de Abogados. La información aquí es solo para fines informativos generales y no constituye asesoramiento legal, y no debe actuar en base a ella sin consultar a un abogado. No se crea ninguna relación abogado-cliente por usar este sitio ni por enviar un formulario de admisión; la relación se forma únicamente mediante un acuerdo escrito firmado. Los resultados anteriores no garantizan un resultado similar. Contactar a ",
      disclaimerTail:
        " no le obliga a contratar a la firma, y la firma no garantiza la aceptación de ningún caso. Incluso en un caso por contingencia (“sin honorarios a menos que ganemos”), usted podría ser responsable de los costos y gastos del caso, independientemente del resultado. La firma no ejerce la abogacía en ninguna jurisdicción salvo aquellas en las que sus abogados están autorizados. Si enfrenta un plazo (prescripción), no demore en buscar asesoría legal.",
      entityDisclosure:
        "{firm} es una firma de abogados independiente y es responsable de esta publicidad; {attorney} es el abogado responsable de su contenido, y los abogados de {firm} están autorizados para ejercer en {states} (oficina legal principal: {office}). {tech} no es una firma de abogados y no brinda asesoría ni servicios legales, salvo los prestados a través de su firma de abogados afiliada, {firm}. {tech} es una empresa de tecnología y servicios administrativos que presta servicios a la firma por honorarios fijos a valor justo de mercado; no dirige decisiones legales ni selecciona o refiere clientes.",
      rights: "Todos los derechos reservados.",
      attorneyAdvertising: "Publicidad de Abogados",
      legalNotices: "Avisos Legales",
      privacyLabel: "Privacidad",
      legalTitle: "Avisos Legales y Descargos",
    },
    intake: {
      eyebrow: "Gratis y confidencial",
      title: "Comience su evaluación gratuita",
      introLead:
        "Responda unas preguntas sobre su accidente y sus lesiones. No hay costo ni compromiso, y su información se usa solo para evaluar su posible reclamo. ¿Prefiere hablar? Llame al ",
      introTail: ".",
      iframeTitle: "Formulario de admisión de Wayco",
      consentLead: "Al enviar este formulario, usted acepta que ",
      consentMid:
        " lo contacte sobre su posible reclamo al teléfono y correo proporcionados, incluso mediante marcación automática, voz pregrabada/IA y mensajes de texto. El consentimiento no es una condición para ningún servicio legal; pueden aplicarse tarifas de mensajes y datos; responda STOP para dejar de recibir textos. Enviar este formulario ",
      consentNot: "no",
      consentTail: " crea una relación abogado-cliente y no constituye asesoramiento legal. Consulte nuestra Política de Privacidad sobre cómo se usa su información.",
      notConnectedTitle: "El formulario de admisión aún no está conectado",
      helpLead: "¿Necesita ayuda o enfrenta un plazo? ",
      helpHome: "Volver al inicio",
      helpMid: " o llame al ",
      helpTail: " — estamos disponibles 24/7.",
    },
    intakeWidget: {
      stepLabel: "Paso",
      of: "de",
      q1Title: "¿Qué pasó?",
      q1Types: [
        "Accidente de auto o camión",
        "Resbalón y caída",
        "Negligencia médica",
        "Lesión laboral",
        "Producto defectuoso",
        "Algo más",
      ],
      dateLabel: "¿Aproximadamente cuándo?",
      q2Title: "¿Resultó lesionado?",
      injuryLabel: "Describa qué pasó — use todo el espacio que necesite",
      injuryPlaceholder: "ej. Me chocaron por detrás — dolor de cuello y espalda, vi a un médico dos días después…",
      treatingLabel: "¿Está viendo a un médico?",
      opts: ["Sí", "Aún no", "No"],
      q3Title: "¿Cómo lo contactamos?",
      firstNameLabel: "Nombre",
      phoneLabel: "Teléfono",
      emailLabel: "Correo (opcional)",
      back: "Atrás",
      next: "Continuar",
      submit: "Obtener mi evaluación gratis",
      submitting: "Enviando…",
      doneTitle: "Listo — gracias.",
      doneBody: "Un miembro de la firma se comunicará pronto.",
      errorRequired: "Complete esto para continuar.",
      privacyNote: "Gratis y confidencial · Sin compromiso",
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
