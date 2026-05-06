import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Informationspflicht KVKK (Türkei) | Ansel AI",
  description:
    "Informationspflicht nach dem türkischen Gesetz zum Schutz personenbezogener Daten (KVKK).",
};

export default function KvkkHinweisDePage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-zinc-100 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Informationspflicht nach dem türkischen KVKK
        </h1>
        <p className="mt-3 text-sm text-zinc-400">Stand: 6. Mai 2026</p>
        <p className="mt-4 text-sm leading-relaxed text-zinc-400">
          Dieser Hinweis ist auf Deutsch verfasst und beschreibt die Verarbeitung
          personenbezogener Daten, die über diese Website erhoben werden, im Einklang mit
          dem Gesetz Nr. 6698 zum Schutz personenbezogener Daten der Republik Türkei
          (KVKK).
        </p>

        <section className="mt-8 space-y-7 text-sm leading-7 text-zinc-300">
          <div>
            <h2 className="text-lg font-medium text-zinc-100">
              1. Verantwortlicher im Sinne des KVKK
            </h2>
            <p className="mt-2">Verantwortlicher: Furkan Demet</p>
            <p>
              Anschrift: Örnektepe Mahallesi Haliç Sokak No:8 Daire 23, Beyoğlu, Istanbul,
              Türkei
            </p>
            <p>
              Kontakt:{" "}
              <a
                href="mailto:hello@anselvoice.com"
                className="text-sky-300 underline-offset-2 hover:underline"
              >
                hello@anselvoice.com
              </a>
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">2. Geltungsbereich</h2>
            <p className="mt-2">
              Dieser Hinweis betrifft personenbezogene Daten, die Sie über Bewerbungs- und
              Kontaktformulare auf dieser Website übermitteln.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">
              3. Verarbeitete Datenkategorien
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                Identifikation: Vor- und Nachname, Firmen- bzw. Organisationsbezeichnung,
                Position
              </li>
              <li>Kontakt: E-Mail-Adresse, Telefonnummer</li>
              <li>
                Geräte- und technische Daten: IP-Adresse, User-Agent, Zeitstempel der
                Übermittlung, Formularprotokolle
              </li>
              <li>Nachrichteninhalt: Freitextangaben im Formular</li>
              <li>Sonstiges: z. B. Unternehmensgröße (Mitarbeiterzahl), sofern angegeben</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">
              4. Zwecke der Verarbeitung
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Prüfung Ihres Anliegens und telefonischer Rückruf</li>
              <li>
                Durchführung vorvertraglicher Maßnahmen (Angebots- und Demonstrationsplanung)
              </li>
              <li>
                Gewährleistung der Systemsicherheit, Missbrauchsprävention und
                nachvollziehbare Protokollierung
              </li>
              <li>
                Sofern Sie ausdrücklich einwilligen: künftige Informations- und
                Marketingkommunikation
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">
              5. Rechtsgrundlagen (KVKK, Art. 5)
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                Erforderlichkeit zur Begründung oder Erfüllung eines Vertrags (Art. 5 Abs. 2
                lit. c)
              </li>
              <li>Erfüllung einer gesetzlichen Verpflichtung (Art. 5 Abs. 2 lit. ç)</li>
              <li>
                Berechtigtes Interesse (Art. 5 Abs. 2 lit. f) — Sicherheit,
                Betrugsprävention, Beweisführung
              </li>
              <li>
                Ausdrückliche Einwilligung (Art. 5 Abs. 1) — insbesondere Marketing sowie,
                soweit erforderlich, Drittlandsübermittlungen
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">6. Erhebungsmethoden</h2>
            <p className="mt-2">
              Personenbezogene Daten werden automatisiert über Online-Formulare und
              Backend-Protokolle des Systems erhoben.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">
              7. Empfänger und Empfängerkategorien
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Anbieter für Hosting, Kommunikation sowie Wartung und Support</li>
              <li>Operative Systeme und CRM-Lösungen zur Verarbeitung der Formulardaten</li>
              <li>Analyse- und Messdienstleister (über Cookies oder Skripte)</li>
              <li>
                Berater sowie zuständige Behörden im Rahmen gesetzlicher oder
                handelsrechtlicher Pflichten
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">
              8. Übermittlung ins Ausland
            </h2>
            <p className="mt-2">
              Daten können über Dienstleister und Partner innerhalb der Türkei oder im
              Ausland verarbeitet oder übermittelt werden. Liegt eine Übermittlung ins
              Ausland vor, werden die Vorgaben des KVKK (Art. 9) eingehalten; gegebenenfalls
              holen wir eine ausdrückliche Einwilligung ein.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">9. Speicherdauer</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Bewerbungs- bzw. Lead-Datensätze: 24 Monate</li>
              <li>Protokolldaten: 2 Jahre</li>
              <li>Nachweis der Marketingeinwilligung (falls vorhanden): mindestens 3 Jahre</li>
            </ul>
            <p className="mt-2">
              Nach Ablauf der Fristen werden die Daten gemäß den anwendbaren Vorschriften
              gelöscht oder anonymisiert.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">10. Sicherheitsmaßnahmen</h2>
            <p className="mt-2">
              Wir setzen u. a. Zugriffskontrollen, TLS-verschlüsselte Übertragung,
              Netzwerksicherheit, Schwachstellen- und Patch-Management, Protokollierung und
              Monitoring, Datenminimierung sowie Auftragsverarbeitungsvereinbarungen mit
              Anbietern ein.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">
              11. Ihre Rechte und deren Geltendmachung (KVKK, Art. 11)
            </h2>
            <p className="mt-2">
              Zur Ausübung Ihrer Rechte auf Auskunft, Berichtigung, Löschung, Widerspruch
              und Einschränkung wenden Sie sich bitte mit dem Betreff „KVKK-Antrag“ an{" "}
              <a
                href="mailto:hello@anselvoice.com?subject=KVKK-Antrag"
                className="text-sky-300 underline-offset-2 hover:underline"
              >
                hello@anselvoice.com
              </a>
              . Wir beantworten Anträge innerhalb von 30 Tagen.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">12. Aktualisierungen</h2>
            <p className="mt-2">
              Dieser Hinweis kann angepasst werden; die jeweils gültige Fassung ist auf
              dieser Website abrufbar.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
