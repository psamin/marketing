"use client";

import Script from "next/script";

// SurveyMonkey's official "Website" collector embed. The script self-injects the
// survey iframe; this avoids the X-Frame-Options issues a plain weblink iframe hits.
export default function SurveyMonkeyEmbed({ src }: { src: string }) {
  return (
    <div className="embed-wrap" style={{ minHeight: 640, padding: 12 }}>
      <div id="smcx-embed" />
      <Script id="smcx-sdk" src={src} strategy="afterInteractive" />
      <noscript>
        <p style={{ padding: 28, textAlign: "center" }}>
          Please enable JavaScript to load the intake form, or call us to start your claim.
        </p>
      </noscript>
    </div>
  );
}
