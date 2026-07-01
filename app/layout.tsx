import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import LoginGate from "./_LoginGate";

// PRE-LAUNCH GATE (server-side, Node runtime — intentionally NOT edge middleware,
// which crashes on Next 15.5 with a __dirname ReferenceError). The whole site
// sits behind the login while firm-identity placeholders + counsel sign-off are
// unresolved. API routes don't use this layout, so /api/auth/login etc. stay
// reachable. To open the public funnel later, gate by pathname instead of all.
const AUTH_COOKIE = "wayco_auth";
const AUTH_TOKEN = process.env.AUTH_TOKEN ?? "wc_ok_2026";

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const authed = (await cookies()).get(AUTH_COOKIE)?.value === AUTH_TOKEN;
  return (
    <html lang="en">
      <body>
        {authed ? <LanguageProvider>{children}</LanguageProvider> : <LoginGate />}
      </body>
    </html>
  );
}
