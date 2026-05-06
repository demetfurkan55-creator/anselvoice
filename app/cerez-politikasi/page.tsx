import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Çerez Politikası | Ansel AI",
  description: "Çerez kullanımı, sınıflandırması ve yönetimine ilişkin bilgiler.",
};

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-zinc-100 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Çerez Politikası
        </h1>
        <p className="mt-3 text-sm text-zinc-400">Son güncelleme: 06.05.2026</p>
        <section className="mt-8 space-y-7 text-sm leading-7 text-zinc-300">
          <div>
            <h2 className="text-lg font-medium text-zinc-100">Çerez Nedir?</h2>
            <p className="mt-2">
              Çerezler, tarayıcınıza yerleştirilen küçük metin dosyalarıdır. Oturum
              yönetimi, güvenlik, tercihlerin hatırlanması ve analitik amaçlarla kullanılır.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">Çerezlerin Sınıflandırılması</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Kullanım amacına göre: zorunlu, tercih, analitik</li>
              <li>
                Sürelerine göre: oturum (tarayıcı kapanınca silinir), kalıcı (belirli süre
                boyunca saklanır)
              </li>
              <li>
                Kaynağına göre: birinci taraf (anselvoice.com), üçüncü taraf (entegrasyon /
                analitik sağlayıcıları)
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">Kullandığımız Çerez Türleri</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Zorunlu çerezler: güvenlik, yük dengeleme ve form işleyişi</li>
              <li>Tercih çerezleri: dil veya kullanıcı tercihi hatırlama (varsa)</li>
              <li>Analitik çerezler: ziyaret ve etkileşim istatistikleri (toplu ölçüm)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">Çerez Yönetimi</h2>
            <p className="mt-2">
              Zorunlu çerezler hariç diğer çerez tercihlerini Çerez Yönetim Paneli üzerinden
              (varsa) güncelleyebilir veya tarayıcı ayarlarından çerezleri silebilirsiniz.
              Analitik çerezleri devre dışı bırakmanız site deneyiminizi anlamlı ölçüde
              etkilemez.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">Saklama Süreleri (Örnek)</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Oturum çerezleri: tarayıcı kapanana kadar</li>
              <li>Kalıcı çerezler: 13-24 ay</li>
              <li>Analitik çerezler: 13 ay</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">
              Üçüncü Taraflara Aktarım ve Güvenlik
            </h2>
            <p className="mt-2">
              Analitik ve benzeri hizmetler kapsamında verileriniz yurt içinde veya yurt
              dışında işlenebilir. Bu durumda KVKK md. 9 uyarınca uygun güvenceler sağlanır
              ve gerekiyorsa açık rıza mekanizması işletilir.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">İletişim</h2>
            <p className="mt-2">Furkan Demet</p>
            <p>Örnektepe Mahallesi Haliç Sokak No:8 Daire 23, Beyoğlu / İstanbul</p>
            <p>
              Çerez politikası ile ilgili sorularınız için{" "}
              <a href="mailto:hello@anselvoice.com" className="text-sky-300 hover:text-sky-200">
                hello@anselvoice.com
              </a>{" "}
              adresine ulaşabilirsiniz.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
