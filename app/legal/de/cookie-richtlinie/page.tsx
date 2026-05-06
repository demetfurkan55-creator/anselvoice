import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie-Richtlinie | Ansel AI",
  description:
    "Informationen zu Cookies und ähnlichen Technologien auf anselvoice.com.",
};

export default function CookieRichtlinieDePage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-zinc-100 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Cookie-Richtlinie
        </h1>
        <p className="mt-3 text-sm text-zinc-400">Stand: 6. Mai 2026</p>

        <section className="mt-8 space-y-7 text-sm leading-7 text-zinc-300">
          <div>
            <h2 className="text-lg font-medium text-zinc-100">Was sind Cookies?</h2>
            <p className="mt-2">
              Cookies sind kleine Textdateien, die im Browser gespeichert werden. Sie können
              für Sitzungsmanagement, Sicherheit, die Speicherung von Einstellungen sowie
              für Analysezwecke eingesetzt werden.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">Einteilung der Cookies</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                Nach Zweck: unbedingt erforderliche Cookies, Präferenz-Cookies,
                Analyse-Cookies
              </li>
              <li>
                Nach Laufzeit: Sitzungs-Cookies (werden beim Schließen des Browsers
                entfernt) und persistente Cookies (für eine festgelegte Dauer gespeichert)
              </li>
              <li>
                Nach Herkunft: First-Party (anselvoice.com) und Drittanbieter-Cookies
                (Integrationen / Analysedienstleister)
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">
              Von uns eingesetzte Cookie-Typen
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                Unbedingt erforderliche Cookies: Sicherheit, Lastverteilung, technischer
                Formularbetrieb
              </li>
              <li>Präferenz-Cookies: z. B. Sprache oder Darstellungspräferenzen</li>
              <li>Analyse-Cookies: aggregierte Besuchs- und Nutzungsstatistiken</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">Steuerung und Widerruf</h2>
            <p className="mt-2">
              Mit Ausnahme unbedingt erforderlicher Cookies können Sie Einstellungen über
              ein Cookie-Banner oder ein Präferenzcenter vornehmen, sofern verfügbar, oder
              Cookies in Ihren Browser-Einstellungen löschen. Das Deaktivieren von
              Analyse-Cookies sollte die Kernfunktionen der Website in der Regel nicht
              wesentlich beeinträchtigen.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">
              Orientierungswerte zur Speicherdauer
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Sitzungs-Cookies: bis zum Ende der Browsersitzung</li>
              <li>Persistente Cookies: typischerweise 13 bis 24 Monate</li>
              <li>Analyse-Cookies: häufig bis zu 13 Monate</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">
              Drittanbieter und Sicherheit
            </h2>
            <p className="mt-2">
              Im Rahmen von Analysen und vergleichbaren Diensten können Daten in der Türkei
              oder im Ausland verarbeitet werden. Gegebenenfalls werden die Vorgaben des
              KVKK (Art. 9) eingehalten und ausdrückliche Einwilligungsmechanismen eingesetzt.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">Kontakt</h2>
            <p className="mt-2">Furkan Demet</p>
            <p>Örnektepe Mahallesi Haliç Sokak No:8 Daire 23, Beyoğlu, Istanbul, Türkei</p>
            <p>
              Fragen zu dieser Cookie-Richtlinie richten Sie bitte an{" "}
              <a
                href="mailto:hello@anselvoice.com"
                className="text-sky-300 underline-offset-2 hover:underline"
              >
                hello@anselvoice.com
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
