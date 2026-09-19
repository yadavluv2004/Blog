import type { Metadata } from "next";
import Script from "next/script";
import { site, siteTitle } from "@/site.config";
import "./globals.css";
import "./prose.css";

const title = siteTitle || "Personal Blog";
const description = site.description || "Writing on software, design and everything between.";

export const metadata: Metadata = {
  metadataBase: site.url ? new URL(site.url) : undefined,
  title: {
    default: title,
    template: `%s — ${title}`,
  },
  description,
  openGraph: {
    title,
    description,
    siteName: title,
    type: "website",
    locale: site.locale === "en" ? "en_US" : site.locale,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

// Runs before first paint so the theme is correct on the very first frame —
// there is no flash of the wrong theme, and no client/server markup
// mismatch for React to reconcile.
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`;

/**
 * True root layout: only the document shell (theme script, metadata) that
 * every route needs — including /admin, which deliberately does NOT get
 * the public Navbar/Footer. Those live in app/(site)/layout.tsx instead.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={site.locale || "en"} suppressHydrationWarning>
      <head>
        {/*
          next/script + beforeInteractive is the sanctioned way to run a
          script before hydration (only valid in the root layout). A raw
          <script> tag here works identically but trips React 19's
          "script tag in a component" dev warning — this doesn't.
        */}
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
