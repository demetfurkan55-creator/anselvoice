import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası | Ansel AI",
  description: "Veri güvenliği ve gizlilik yaklaşımımız hakkında bilgiler.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-zinc-100 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Gizlilik Politikası
        </h1>
        <p className="mt-3 text-sm text-zinc-400">Son güncelleme: 06.05.2026</p>
        <p className="mt-3 text-sm text-zinc-400">
          Veri güvenliği ve gizlilik yaklaşımımız hakkında bilgiler
        </p>

        <section className="mt-8 space-y-7 text-sm leading-7 text-zinc-300">
          <div>
            <h2 className="text-lg font-medium text-zinc-100">Kişisel Verilerin Korunması</h2>
            <p>
              Ansel AI olarak 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK)
              ve ilgili mevzuata uygun şekilde hareket ederiz. İhtiyaçlara göre veri
              sorumlusu veya veri işleyen sıfatıyla süreçleri yürütür, gerekli teknik
              ve idari tedbirleri uygularız.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">Elektronik İletişimler</h2>
            <p className="mt-2">
              Bizimle dijital kanallardan iletişime geçtiğinizde izinleriniz kapsamında
              size bilgilendirme veya duyurular gönderebiliriz. Bu iletileri almak
              istemezseniz bize yazılı olarak ulaşarak tercihlerinizi güncelleyebilirsiniz.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">
              Veri Logları, Çerezler ve Web İşaretleri
            </h2>
            <p className="mt-2">
              Sitemizi ziyaretinizde log kayıtları tutulabilir. Çerezler ve benzeri
              teknolojiler hakkında bilgi için Çerez Politikası belgesini inceleyebilirsiniz.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">Veri Kullanım Amaçları</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Sizinle iletişime geçmek ve taleplerinize yanıt vermek</li>
              <li>İletişim faaliyetlerini yürütmek ve siteyi yönetmek</li>
              <li>Hizmet kalitesini artırmak ve kullanıcı deneyimini geliştirmek</li>
              <li>Açık rızanız varsa tanıtım/pazarlama iletişimleri göndermek</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">Veri Güvenliği</h2>
            <p className="mt-2">
              Kişisel verilerinize yetkisiz erişimi önlemek için sektör standardı teknik
              ve idari önlemler uygularız. İnternet üzerinden hassas bilgi paylaşırken
              dikkatli davranmanızı tavsiye ederiz.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">Veri Saklama</h2>
            <p className="mt-2">
              Verilerinizi yalnızca ilgili amaçlar ve yasal yükümlülükler için gerekli
              olduğu süre boyunca saklarız. Süresi dolan veriler mevzuata uygun şekilde
              silinir veya anonimleştirilir.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">Veri Transferleri</h2>
            <p className="mt-2">
              Kişisel bilgileriniz; barındırma, e-posta ve alan adı sağlayıcıları gibi
              hizmetlerden yararlanmamız nedeniyle yurt içinde veya yurt dışında işlenebilir
              ya da aktarılabilir. Bu hallerde yürürlükteki mevzuata uygun korumalar uygulanır.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">
              Çocukların Çevrimiçi Faaliyetlerinin Korunması
            </h2>
            <p className="mt-2">
              Bilerek çocuklardan kişisel bilgi talep etmeyiz. 13 yaşın (AB için 16)
              altındaki kişilerden veri alındığını tespit edersek, uygun işlemlerle
              verileri siler ve gerekli bildirim süreçlerini işletiriz.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">
              Gizliliğe Uygun Süreç Tasarımı
            </h2>
            <p className="mt-2">
              Yeni sistem ve süreçler tasarlarken gizliliği varsayılan ve tasarım gereği
              koruyan yaklaşımlar benimseriz; gerekli teknik ve organizasyonel önlemleri
              bu çerçevede uygularız.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-zinc-100">İletişim</h2>
            <p className="mt-2">Furkan Demet</p>
            <p>Örnektepe Mahallesi Haliç Sokak No:8 Daire 23, Beyoğlu / İstanbul</p>
            <p>
              <a href="mailto:hello@anselvoice.com" className="text-sky-300 hover:text-sky-200">
                hello@anselvoice.com
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
