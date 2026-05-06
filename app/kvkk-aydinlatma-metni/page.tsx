import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni | Ansel AI",
  description: "Ansel AI Kişisel Verilerin Korunması Kanunu aydınlatma metni.",
};

export default function KvkkPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-zinc-100 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          KVKK Aydınlatma Metni
        </h1>
        <p className="mt-3 text-sm text-zinc-400">Son güncelleme: 06.05.2026</p>

        <section className="mt-8 space-y-7 text-sm leading-7 text-zinc-300">
          <div>
            <h2 className="text-lg font-medium text-zinc-100">1. Veri Sorumlusu</h2>
            <p className="mt-2">Veri Sorumlusu: Furkan Demet</p>
            <p>
              Adres: Örnektepe Mahallesi Haliç Sokak No:8 Daire 23, Beyoğlu / İstanbul
            </p>
            <p>
              İletişim:{" "}
              <a href="mailto:hello@anselvoice.com" className="text-sky-300 hover:text-sky-200">
                hello@anselvoice.com
              </a>
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">2. Kapsam</h2>
            <p className="mt-2">
              Bu metin, web sitesi üzerindeki başvuru ve iletişim formu aracılığıyla
              ilettiğiniz kişisel verilerin işlenmesine ilişkindir.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">3. İşlenen Kişisel Veriler</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Kimlik: ad-soyad, şirket/kurum adı, unvan/pozisyon</li>
              <li>İletişim: e-posta, telefon</li>
              <li>Cihaz / Teknik: IP adresi, user agent (UA), gönderim tarih-saat, form logları</li>
              <li>Mesaj içeriği: formda paylaştığınız serbest metin</li>
              <li>Diğer: şirket büyüklüğü (çalışan sayısı vb.)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">4. İşleme Amaçları</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Talebinizin değerlendirilmesi ve size telefonla geri dönüş yapılması</li>
              <li>Ön sözleşmesel süreçlerin yürütülmesi (teklif ve demonstrasyon planlaması)</li>
              <li>Sistem güvenliğinin sağlanması, kötüye kullanımın önlenmesi ve kayıtların ispatı</li>
              <li>Açık rızanız varsa gelecekte tanıtım / pazarlama iletişimlerinin iletilmesi</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">5. Hukuki Sebepler (KVKK md. 5)</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Sözleşmenin kurulması veya ifası için zorunluluk (md. 5/2-c)</li>
              <li>Hukuki yükümlülüklerin yerine getirilmesi (md. 5/2-ç)</li>
              <li>Meşru menfaat (md. 5/2-f) – güvenlik, dolandırıcılık önleme, kayıtların ispatı</li>
              <li>Açık rıza (md. 5/1) – yalnızca pazarlama iletişimleri ve gerekli görülen yurt dışı aktarım</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">6. Toplama Yöntemleri</h2>
            <p className="mt-2">
              Kişisel verileriniz çevrimiçi formlar ve arka uç sistem logları aracılığıyla
              otomatik yollarla elde edilir.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">7. Alıcı / Alıcı Grupları</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Barındırma, iletişim ve bakım / destek hizmet sağlayıcıları</li>
              <li>Form verilerinin yönetildiği iş süreç araçları ve CRM sistemleri</li>
              <li>Analitik ve ölçüm hizmetleri (çerezler veya betikler üzerinden)</li>
              <li>Danışmanlar ve hukuki / ticari yükümlülükler kapsamında yetkili kurumlar</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">8. Yurt Dışına Aktarım</h2>
            <p className="mt-2">
              Kişisel veriler, hizmet sağlayıcılar ve iş ortakları vasıtasıyla yurt içinde
              veya dışında işlenebilir ya da aktarılabilir. Yurt dışına aktarım gereken
              hallerde KVKK md. 9 çerçevesinde uygun güvenceler sağlanır ve gerekiyorsa
              açık rızanız alınır.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">9. Saklama Süreleri</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Başvuru / lead kayıtları: 24 ay</li>
              <li>Log kayıtları: 2 yıl</li>
              <li>Pazarlama rıza kayıtları (varsa): en az 3 yıl (ispat yükümlülüğü)</li>
            </ul>
            <p className="mt-2">
              Sürelerin sonunda veriler mevzuata uygun şekilde silinir veya anonimleştirilir.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">10. Güvenlik Önlemleri</h2>
            <p className="mt-2">
              Erişim yetkilendirmesi, TLS ile şifreli aktarım, ağ güvenliği, zafiyet ve yama
              yönetimi, loglama ve izleme, veri minimizasyonu ve tedarikçi sözleşmeleri (DPA)
              uygulanmaktadır.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">11. Haklarınız ve Başvuru (KVKK md. 11)</h2>
            <p className="mt-2">
              Erişim, düzeltme, silme / unutulma, itiraz ve kısıtlama haklarınızı kullanmak
              için{" "}
              <a href="mailto:hello@anselvoice.com" className="text-sky-300 hover:text-sky-200">
                hello@anselvoice.com
              </a>{" "}
              adresine “KVKK Başvuru” konusu ile başvurabilirsiniz. Başvurular 30 gün içinde
              yanıtlanır.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">12. Güncellemeler</h2>
            <p className="mt-2">
              Bu metin gerektiğinde güncellenebilir; en güncel sürüm web sitesi üzerinde
              yayımlanır.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
