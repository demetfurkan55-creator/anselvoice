import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { blockedSiteMessage } from "@/lib/blockedMessages";
import { getClientIpFromHeaders } from "./lib/demoCallRateLimit";
import { isIpBlocked } from "./lib/ipBlocklist";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ansel Voice",
  description:
    "Enterprise-ready voice AI agents—natural conversations, disciplined automation, observable operations.",
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const h = await headers();
  const locale = h.get("x-ansel-locale");
  const htmlLang =
    locale === "tr" || locale === "en" || locale === "de" ? locale : "en";

  const ip = getClientIpFromHeaders(h);
  if (await isIpBlocked(ip)) {
    const msg = blockedSiteMessage(locale);
    return (
      <html
        lang={htmlLang}
        className={`${geistSans.variable} ${geistMono.variable} h-full w-full max-w-full overflow-x-hidden antialiased`}
      >
        <body className="flex min-h-[100dvh] w-full max-w-full flex-col items-center justify-center overflow-x-hidden px-6 py-16">
          <p className="max-w-md text-center text-lg text-neutral-800 dark:text-neutral-200">
            {msg}
          </p>
        </body>
      </html>
    );
  }

  return (
    <html
      lang={htmlLang}
      className={`${geistSans.variable} ${geistMono.variable} h-full w-full max-w-full overflow-x-hidden antialiased`}
    >
      <body className="flex min-h-[100dvh] w-full max-w-full flex-col overflow-x-hidden overflow-y-auto">
        {children}
      </body>
    </html>
  );
}
