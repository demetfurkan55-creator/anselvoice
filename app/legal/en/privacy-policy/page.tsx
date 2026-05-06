import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy | Ansel AI",
  description: "How Ansel AI handles personal data, security, and international transfers.",
};

export default function PrivacyPolicyEnPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-zinc-100 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Privacy policy
        </h1>
        <p className="mt-3 text-sm text-zinc-400">Last updated: 6 May 2026</p>
        <p className="mt-3 text-sm text-zinc-400">
          This policy explains how we approach data protection, security, and privacy for
          visitors and business contacts.
        </p>

        <section className="mt-8 space-y-7 text-sm leading-7 text-zinc-300">
          <div>
            <h2 className="text-lg font-medium text-zinc-100">
              Protection of personal data
            </h2>
            <p>
              Ansel AI processes personal data in compliance with the Turkish Personal Data
              Protection Law (KVKK) and related regulations where they apply, and adopts
              appropriate technical and organisational measures. Depending on the
              scenario, we may act as data controller or data processor.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">Electronic communications</h2>
            <p className="mt-2">
              When you contact us through digital channels, we may send informational
              updates within the scope of your permissions. You may withdraw or adjust
              your preferences at any time by writing to us.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">
              Logs, cookies, and similar technologies
            </h2>
            <p className="mt-2">
              We may keep server logs when you visit the site. For details on cookies and
              similar technologies, please see our cookie policy.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">Purposes of use</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>To respond to enquiries and manage our relationship with you</li>
              <li>To operate communications workflows and administer the website</li>
              <li>To improve service quality and user experience</li>
              <li>Where you give explicit consent, to send promotional communications</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">Data security</h2>
            <p className="mt-2">
              We implement industry-standard technical and organisational safeguards against
              unauthorised access. Please exercise care when sharing sensitive information
              over the internet.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">Retention</h2>
            <p className="mt-2">
              We retain personal data only for as long as necessary for the purposes
              described above and to meet legal obligations. When retention periods expire,
              data are deleted or anonymised in line with applicable law.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">International transfers</h2>
            <p className="mt-2">
              Personal data may be processed or transferred within Türkiye or abroad—for
              example when we use hosting, email, or domain services. In those cases we
              apply safeguards required by applicable law, including KVKK where relevant.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">Children</h2>
            <p className="mt-2">
              We do not knowingly collect personal information from children. If we learn
              that we have received data from a person under 13 (or under 16 in the EU
              context), we will delete it and follow any required notification steps.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">Privacy by design</h2>
            <p className="mt-2">
              When designing new systems and processes, we aim to embed privacy by design
              and by default, and we implement technical and organisational measures
              accordingly.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">Contact</h2>
            <p className="mt-2">Furkan Demet</p>
            <p>Örnektepe Mahallesi Haliç Sokak No:8 Daire 23, Beyoğlu, Istanbul, Türkiye</p>
            <p>
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
