import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | Ansel AI",
  description:
    "Informationen zum Umgang mit personenbezogenen Daten, Sicherheit und Übermittlungen.",
};

export default function DatenschutzDePage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-zinc-100 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Datenschutzerklärung
        </h1>
        <p className="mt-3 text-sm text-zinc-400">Stand: 6. Mai 2026</p>
        <p className="mt-3 text-sm text-zinc-400">
          Diese Erklärung beschreibt unseren Ansatz zum Schutz personenbezogener Daten,
          zur Informationssicherheit und zum Datenschutz für Besucher und
          Geschäftskontakte.
        </p>

        <section className="mt-8 space-y-7 text-sm leading-7 text-zinc-300">
          <div>
            <h2 className="text-lg font-medium text-zinc-100">
              Schutz personenbezogener Daten
            </h2>
            <p>
              Ansel AI verarbeitet personenbezogene Daten im Einklang mit dem türkischen
              Gesetz zum Schutz personenbezogener Daten (KVKK) und den einschlägigen
              Vorschriften und trifft angemessene technische und organisatorische Maßnahmen.
              Je nach Sachverhalt können wir als Verantwortlicher oder als Auftragsverarbeiter
              auftreten.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">Elektronische Kommunikation</h2>
            <p className="mt-2">
              Wenn Sie uns über digitale Kanäle kontaktieren, können wir Ihnen im Rahmen
              Ihrer Einwilligungen oder gesetzlicher Grundlagen Informations- und
              Hinweisnachrichten senden. Sie können Ihre Präferenzen jederzeit schriftlich
              anpassen oder widerrufen.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">
              Protokolle, Cookies und ähnliche Technologien
            </h2>
            <p className="mt-2">
              Beim Besuch der Website können Serverprotokolle geführt werden. Einzelheiten
              zu Cookies und vergleichbaren Technologien finden Sie in unserer
              Cookie-Richtlinie.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">Zwecke der Datenverwendung</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Kontaktaufnahme und Bearbeitung Ihrer Anfragen</li>
              <li>Abwicklung der Kommunikation und Betrieb der Website</li>
              <li>Verbesserung der Servicequalität und der Nutzererfahrung</li>
              <li>
                Bei ausdrücklicher Einwilligung: Zusendung werblicher Informationen
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">Datensicherheit</h2>
            <p className="mt-2">
              Wir setzen branchenübliche technische und organisatorische Maßnahmen ein, um
              unbefugten Zugriff zu verhindern. Bitte beachten Sie, dass die Übertragung
              sensibler Informationen über das Internet stets ein Restrisiko birgt.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">Speicherfristen</h2>
            <p className="mt-2">
              Wir speichern personenbezogene Daten nur so lange, wie es für die genannten
              Zwecke und zur Erfüllung gesetzlicher Aufbewahrungspflichten erforderlich ist.
              Nach Ablauf werden Daten gelöscht oder anonymisiert, sofern dem nichts
              entgegensteht.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">
              Datenübermittlungen und Drittlandübermittlungen
            </h2>
            <p className="mt-2">
              Personenbezogene Daten können in der Türkei oder im Ausland verarbeitet oder
              übermittelt werden — etwa bei Hosting-, E-Mail- oder Domain-Dienstleistern. In
              diesen Fällen wenden wir die nach anwendbarem Recht — einschließlich KVKK,
              soweit einschlägig — erforderlichen Schutzmaßnahmen an.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">Kinder und Jugendliche</h2>
            <p className="mt-2">
              Wir erheben wissentlich keine Daten von Kindern. Sollten wir Kenntnis davon
              erhalten, dass Daten einer Person unter 13 Jahren (bzw. unter 16 Jahren im
              unionsrechtlichen Kontext) verarbeitet wurden, löschen wir diese und veranlassen
              gegebenenfalls erforderliche Meldungen.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">
              Datenschutz durch Technikgestaltung und datenschutzfreundliche
              Voreinstellungen
            </h2>
            <p className="mt-2">
              Bei der Konzeption neuer Systeme und Prozesse berücksichtigen wir den Grundsatz
              „Datenschutz durch Technikgestaltung und datenschutzfreundliche
              Voreinstellungen“ und setzen die erforderlichen Maßnahmen entsprechend um.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">Kontakt</h2>
            <p className="mt-2">Furkan Demet</p>
            <p>Örnektepe Mahallesi Haliç Sokak No:8 Daire 23, Beyoğlu, Istanbul, Türkei</p>
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
