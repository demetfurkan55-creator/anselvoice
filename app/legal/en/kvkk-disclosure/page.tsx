import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KVKK disclosure (Turkey) | Ansel AI",
  description:
    "Information notice under the Turkish Personal Data Protection Law (KVKK) for website forms and contact.",
};

export default function KvkkDisclosureEnPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-zinc-100 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          KVKK disclosure notice (Republic of Turkey)
        </h1>
        <p className="mt-3 text-sm text-zinc-400">Last updated: 6 May 2026</p>
        <p className="mt-4 text-sm leading-relaxed text-zinc-400">
          This notice is provided in English for international readers. It describes
          processing of personal data collected through this website in line with Law
          No. 6698 on the Protection of Personal Data (KVKK).
        </p>

        <section className="mt-8 space-y-7 text-sm leading-7 text-zinc-300">
          <div>
            <h2 className="text-lg font-medium text-zinc-100">1. Data controller</h2>
            <p className="mt-2">Controller: Furkan Demet</p>
            <p>
              Address: Örnektepe Mahallesi Haliç Sokak No:8 Daire 23, Beyoğlu, Istanbul,
              Türkiye
            </p>
            <p>
              Contact:{" "}
              <a
                href="mailto:hello@anselvoice.com"
                className="text-sky-300 underline-offset-2 hover:underline"
              >
                hello@anselvoice.com
              </a>
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">2. Scope</h2>
            <p className="mt-2">
              This notice applies to personal data you submit via application and contact
              forms on this website.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">
              3. Categories of personal data
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Identity: name, company name, job title</li>
              <li>Contact: email address, telephone number</li>
              <li>
                Device / technical: IP address, user agent, submission timestamp, form logs
              </li>
              <li>Message content: free-text fields in the form</li>
              <li>Other: company size (e.g. headcount), where provided</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">4. Purposes of processing</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>To review your request and call you back by telephone</li>
              <li>
                To carry out pre-contractual steps (proposals and demonstration planning)
              </li>
              <li>
                To maintain system security, prevent abuse, and retain evidence-grade logs
              </li>
              <li>
                Where you give explicit consent, to send future marketing communications
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">
              5. Legal bases (KVKK Art. 5)
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Necessity for concluding or performing a contract (Art. 5(2)(c))</li>
              <li>Compliance with legal obligations (Art. 5(2)(ç))</li>
              <li>
                Legitimate interests (Art. 5(2)(f)) — security, fraud prevention, record
                keeping
              </li>
              <li>
                Explicit consent (Art. 5(1)) — marketing communications and, where required,
                international transfers
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">6. Collection methods</h2>
            <p className="mt-2">
              Personal data are collected automatically through online forms and backend
              system logs.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">
              7. Recipients and categories of recipients
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Hosting, communications, and maintenance / support providers</li>
              <li>Operational tools and CRM systems that process form data</li>
              <li>Analytics and measurement services (via cookies or scripts)</li>
              <li>
                Advisers and competent authorities where required by law or commercial
                obligations
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">
              8. International transfers
            </h2>
            <p className="mt-2">
              Data may be processed or transferred inside or outside Türkiye through
              service providers and partners. Where a transfer abroad is required, appropriate
              safeguards under KVKK Art. 9 are applied and, where necessary, explicit
              consent is obtained.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">9. Retention</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Application / lead records: 24 months</li>
              <li>Log records: 2 years</li>
              <li>Marketing consent evidence (if any): at least 3 years</li>
            </ul>
            <p className="mt-2">
              After the retention period, data are deleted or anonymised in accordance with
              applicable law.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">10. Security measures</h2>
            <p className="mt-2">
              We apply access control, TLS encryption in transit, network security,
              vulnerability and patch management, logging and monitoring, data minimisation,
              and data-processing agreements (DPAs) with vendors.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">
              11. Your rights and how to exercise them (KVKK Art. 11)
            </h2>
            <p className="mt-2">
              To exercise rights of access, rectification, erasure, objection, and
              restriction, email{" "}
              <a
                href="mailto:hello@anselvoice.com?subject=KVKK%20request"
                className="text-sky-300 underline-offset-2 hover:underline"
              >
                hello@anselvoice.com
              </a>{" "}
              with the subject line &quot;KVKK request&quot;. We respond within 30 days.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">12. Updates</h2>
            <p className="mt-2">
              This notice may be updated from time to time. The current version is always
              published on this website.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
