import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Wayco Injury Law — Free Case Review for Accident & Injury Victims",
  description:
    "Injured in an accident? Get a free, confidential case review from Wayco Injury Law. No fee unless we win. Start your claim online in minutes.",
  openGraph: {
    title: "Wayco Injury Law — Free Case Review",
    description:
      "Injured in an accident? Free, confidential case review. No fee unless we win.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
