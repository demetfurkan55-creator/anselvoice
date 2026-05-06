import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie policy | Ansel AI",
  description: "How Ansel AI uses cookies and similar technologies on anselvoice.com.",
};

export default function CookiePolicyEnPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-zinc-100 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Cookie policy
        </h1>
        <p className="mt-3 text-sm text-zinc-400">Last updated: 6 May 2026</p>

        <section className="mt-8 space-y-7 text-sm leading-7 text-zinc-300">
          <div>
            <h2 className="text-lg font-medium text-zinc-100">What are cookies?</h2>
            <p className="mt-2">
              Cookies are small text files placed in your browser. They may be used for
              session management, security, remembering preferences, and analytics.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">How we classify cookies</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>By purpose: strictly necessary, preferences, analytics</li>
              <li>
                By duration: session cookies (removed when you close the browser) and
                persistent cookies (stored for a defined period)
              </li>
              <li>
                By source: first-party (anselvoice.com) and third-party (integrations /
                analytics providers)
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">Types we may use</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Strictly necessary: security, load balancing, and form operation</li>
              <li>Preference cookies: language or UI choices, where applicable</li>
              <li>Analytics cookies: aggregated visit and interaction statistics</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">Managing cookies</h2>
            <p className="mt-2">
              Except for strictly necessary cookies, you may adjust preferences through a
              cookie banner or management tool where available, or clear cookies in your
              browser settings. Disabling analytics cookies should not materially degrade
              core site functionality.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">Indicative retention</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Session cookies: until the browser session ends</li>
              <li>Persistent cookies: typically 13–24 months</li>
              <li>Analytics cookies: often up to 13 months</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">
              Third parties and security
            </h2>
            <p className="mt-2">
              In connection with analytics and similar services, data may be processed
              inside or outside Türkiye. Where required, appropriate safeguards under KVKK
              Art. 9 are applied and explicit consent mechanisms may be used.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">Contact</h2>
            <p className="mt-2">Furkan Demet</p>
            <p>Örnektepe Mahallesi Haliç Sokak No:8 Daire 23, Beyoğlu, Istanbul, Türkiye</p>
            <p>
              For questions about this cookie policy:{" "}
              <a
                href="mailto:hello@anselvoice.com"
                className="text-sky-300 underline-offset-2 hover:underline"
              >
                hello@anselvoice.com
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
