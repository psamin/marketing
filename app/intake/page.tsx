import type { Metadata } from "next";
import IntakeContent from "@/components/IntakeContent";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: "Start Your Free Case Review — Wayco",
  description:
    "Tell us what happened. Complete Wayco's confidential intake form to start your free, no-obligation case review.",
  robots: { index: false, follow: true },
};

export default function IntakePage() {
  return <IntakeContent surveyUrl={config.surveyUrl} embedSrc={config.surveyEmbedSrc} />;
}
