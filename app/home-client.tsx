"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type PointerEvent,
  type SVGProps,
} from "react";
import {
  isAppLocale,
  persistLocaleClientCookie,
  type AppLocale,
} from "@/lib/localeResolve";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  BrainCircuit,
  Check,
  ChevronDown,
  Clock,
  Globe,
  Mail,
  Menu,
  Mic,
  Phone,
  ShieldCheck,
  TrendingUp,
  X,
} from "lucide-react";
import { AnselLogoMark } from "./components/AnselLogoMark";
import { AuroraPlasmaCanvas } from "./components/AuroraPlasmaCanvas";
import { AudioWaveform } from "./components/AudioWaveform";

import type { PostCallWizardLabels } from "./components/PostCallLeadWizard";
import { PostCallLeadWizard } from "./components/PostCallLeadWizard";
import { ANSEL_CALL_SYSTEM_BOUNDARY } from "./lib/anselCallPromptBoundary";
import {
  APPOINTMENT_PROMPT_DE,
  APPOINTMENT_PROMPT_EN,
  APPOINTMENT_PROMPT_TR,
  DENTAL_PROMPT_DE,
  DENTAL_PROMPT_EN,
  DENTAL_PROMPT_TR,
} from "./lib/voiceDemoPrompts";

const CONTACT_EMAIL = "hello@anselvoice.com";

function IconLinkedIn(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconInstagram(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function IconYoutube(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

type Locale = AppLocale;

function firstNameFromCaller(callerName: string): string {
  const t = callerName.trim().replace(/\s+/g, " ");
  if (!t) return "";
  return t.split(" ")[0]!.slice(0, 32);
}

/** Türkçe diş senaryosu firstMessage — yaygın kadın adlarında Hanım, aksi halde Bey. */
function turkishDentalHonorific(first: string): "Bey" | "Hanım" {
  const f = first.trim().toLowerCase();
  if (!f) return "Bey";
  const female = new Set([
    "ayşe",
    "fatma",
    "zeynep",
    "elif",
    "merve",
    "esra",
    "seda",
    "derya",
    "gizem",
    "burcu",
    "pınar",
    "özge",
    "ceren",
    "ece",
    "melis",
    "büşra",
    "tuğba",
    "hande",
    "sibel",
    "nur",
    "şeyma",
    "yasemin",
    "emine",
    "hatice",
    "meryem",
  ]);
  return female.has(f) ? "Hanım" : "Bey";
}

/** Vapi sabit firstMessage kullanır (LLM sistem promptundan önce). İsmi burada seslendir ki diş/randevu giden çağrılar “size nasıl yardımcı olabilirim” ile açılmasın. */
function outboundVapiFirstMessage(
  locale: Locale,
  presetId: string | null,
  callerName: string,
): string | undefined {
  const name = callerName.trim().replace(/\s+/g, " ").slice(0, 48);
  if (!presetId) return undefined;

  if (presetId === "custom") {
    const safe = name.replace(/\s+/g, " ").slice(0, 56);
    switch (locale) {
      case "tr":
        return safe
          ? `Merhaba Sayın ${safe}, müsait olduğunuz için teşekkürler — görüşmeyi az sonra yazdığınız özel senaryoya göre, net ve tempolu şekilde sürdüreceğim.`
          : "Merhaba, teşekkürler — tanımladığınız özel senaryoya göre devam ediyorum.";
      case "de":
        return safe
          ? `Guten Tag, ${safe}, danke fürs Annehmen — ich führe das Gespräch genau nach Ihrem Szenariotext, klar und zügig.`
          : "Guten Tag — ich setze Ihr Szenario wie beschrieben um.";
      default:
        return safe
          ? `Hi ${safe}, thanks for picking up — I’ll run this call exactly per your custom scenario, crisp and professional.`
          : "Hi — continuing exactly as defined in your custom scenario.";
    }
  }

  if (!name) return undefined;

  if (presetId === "dental") {
    const first = firstNameFromCaller(name);
    switch (locale) {
      case "tr": {
        const h = turkishDentalHonorific(first);
        return `Merhaba ${first} ${h}, iyi günler! Ansel Diş Kliniği randevu hattından arıyorum; diş sağlığınız veya randevunuz için kısaca görüşmek istedim. Şu an müsait miydiniz?`;
      }
      case "de":
        return `Guten Tag${first ? `, Herr ${first}` : ""}, hier ist die Terminassistenz der Ansel Zahnarztpraxis — freundlich und zügig, damit wir Ihre Zeit schonen. Hätten Sie jetzt einen kurzen Moment für uns?`;
      default:
        return `Hi ${first || name}, thanks for picking up—this is Ansel Dental scheduling with a quick, upbeat call. Do you have two minutes now to touch base on your visit or any questions?`;
    }
  }

  if (presetId === "clinic") {
    switch (locale) {
      case "tr":
        return `Merhaba, Sayın ${name}, Ansel AI randevu hattından arıyorum; tercih ettiğiniz için teşekkür ederiz. Randevu ve bilgilerinizi telefonda netleştireceğiz; konuşma dilim Türkçe olacak. Şu an müsait misiniz?`;
      case "de":
        return `Guten Tag, ${name}, hier ist die Terminassistenz von Ansel AI. Vielen Dank für Ihr Vertrauen — ich stimme Ihren Termin kurz telefonisch mit Ihnen ab und bleibe durchgängig auf Deutsch. Passt es gerade?`;
      default:
        return `Hello ${name}, this is Ansel AI scheduling. Thank you for choosing us—I’ll stay in English for this call and need just a moment to confirm your appointment details. Is now still a good time?`;
    }
  }

  return undefined;
}

const translations = {
  tr: {
    nav: {
      openMenu: "Menüyü aç",
      closeMenu: "Menüyü kapat",
      mobileMenuHint:
        "Dil seçimi için üst bardaki menüyü kullanın.",
    },
    lang: {
      switcherAria: "Dil seçin",
      tr: "TR",
      en: "EN",
      de: "DE",
    },
    hero: {
      title: "Ansel AI ile sesli yapay zekanın gücünü keşfedin.",
      subtitle:
        "Müşterilerinizle doğal diyaloglar kuran akıllı voice agent çözümleriyle iş süreçlerinizi dönüştürün.",
      cta: "Ansel AI’yi denemek için tıklayın",
    },
    trustStrip: "Kurumsal altyapı · Sorunsuz entegrasyon · Denetlenebilir operasyon",
    advantagesSection: {
      eyebrow: "KURUMSAL AVANTAJLAR",
      title: "Sesli operasyonu olgun bir B2B seviyesine taşıyın",
    },
    advantages: [
      {
        title: "Kesintisiz 7/24 operasyon",
        body: "Yoğun dönemlerde bile tüm sesli temasları yanıtlayın; bekleme süresini sıfıra yaklaştırın, randevu ve triyajı otomatikleştirin.",
      },
      {
        title: "Duygu sinyalleri ile kurumsal beden dili",
        body: "Ses akışından niyeti ve gerilimi okuyun; empatik, tutarlı ve kayıtlı uyumlu yanıtlar üretin.",
      },
      {
        title: "Elastik ölçek",
        body: "10 veya 10.000 eşzamanlı çağrı — santral tıkanıklığı veya uzun ön lisans beklemeden kapasiteyi artırın.",
      },
      {
        title: "Maliyet verimliliği",
        body: "Klasik çağrı merkezi maliyetini, hizmet kalitesini koruyarak önemli ölçüde düşürün; maliyet kalemlerini ölçülebilir kılın.",
      },
    ],
    footer: {
      copyright: "Copyright © 2026 Ansel AI",
      socialAria: "Ansel AI sosyal bağlantıları",
      tagline: "Sesli yapay zekâ ajanları ve kurumsal otomasyon",
      kvkkLink: "KVKK Aydınlatma Metni",
      privacyLink: "Gizlilik Politikası",
      cookiesLink: "Çerez Politikası",
      kvkkHref: "/kvkk-aydinlatma-metni",
      privacyHref: "/gizlilik-politikasi",
      cookiesHref: "/cerez-politikasi",
    },
    modal: {
      closeBackdrop: "Pencereyi kapat",
      close: "Kapat",
      goBack: "Geri",
      eyebrow: "Premium demo · Sesli yapay zekâ asistan",
      title: "Canlı görüşme testi — üç net adım",
      description:
        "Rol seçin; senaryoya göre özelleştirin; doğrulanmış numaranızı bırakın — Ansel AI sizi arasın.",
      step1: "Adım 1",
      step2: "Adım 2",
      step3: "Adım 3",
      stepRole: "Rol şablonu",
      stepPrompt: "Karakter",
      stepCall: "Arama",
      stepperLine1: "1. ROL ŞABLONU",
      stepperLine2: "2. KARAKTER",
      stepperLine3: "3. ARAMA",
      stepperAria: "Canlı test adımları",
      quickTemplates: "ŞABLONLAR",
      labelPrompt: "ASİSTAN KİŞİLİĞİ",
      labelPhone: "TELEFON NUMARASI",
      placeholderPrompt:
        "Örn. sen bir İngilizce öğretmenisin; benimle konuşma pratiği yap…",
      placeholderPhone: "+905551234567",
      submit: "Beni ara",
      limitReached: "Deneme hakkı bitti. Satış ile görüşün.",
      submitting: "Aranıyor…",
      presetApplying: "Yapay zeka kişiliği güncelleniyor...",
      scenarioTitle: "Senaryonuzu Seçin",
    },
    alerts: {
      callFailed: "Arama başlatılamadı, lütfen bilgilerinizi kontrol edin",
      callStarted: "Arama kuyruğa alındı — hattınızı açık tutun.",
      validationHint:
        "Yukarıdaki zorunlu alanları doldurun: asistan metni ve telefon numarası.",
    },
    validation: {
      prompt:
        "Asistanınızın rolünü ve davranışını tanımlayan bir metin girin.",
      phone: "Uluslararası formatta geçerli bir telefon numarası girin.",
    },
    postCall: {
      introTitle: "Harika!",
      introSubtitle:
        "Aramanız başlatıldı; birkaç saniye içinde telefonunuz çalabilir. Deneyiminizi birlikte değerlendirelim.",
      introCta: "Devam",
      satisfactionQuestion: "Memnun kaldınız mı?",
      yes: "Evet",
      no: "Hayır",
      declinedThanks: "Geri bildiriminiz için teşekkür ederiz.",
      declinedClose: "Kapat",
      accountTypeQuestion: "Talebiniz bireysel mi, kurumsal mı?",
      individual: "Bireysel",
      corporate: "Kurumsal",
      nameQuestion: "Adınız Soyadınız Nedir?",
      firstNamePlaceholder: "Adınız",
      lastNamePlaceholder: "Soyadınız",
      next: "İleri",
      emailQuestion: "E-Posta Adresiniz Nedir?",
      emailPlaceholder: "İş E-Postanız",
      projectQuestion:
        "Lütfen yapay zeka asistanı veya otomasyon talebinizi kısaca açıklayın",
      projectPlaceholder: "Projenizi kısaca açıklayınız",
      contactTitlePrefix: "Son bir adım kaldı, ",
      contactTitleSuffix: " Bey!",
      phonePlaceholder: "Telefon Numaranız",
      callbackPlaceholder: "Sizi ne zaman arayalım?",
      callbackMorning: "Öğleden önce",
      callbackAfternoon: "Öğleden sonra",
      consentContact:
        "Telefon numaram üzerinden Ansel AI ekibinin benimle iletişime geçmesine izin veriyorum.",
      consentKvkk:
        "KVKK Aydınlatma Metni ile Gizlilik Politikası’nı okudum; kişisel verilerimin bu kapsamda işlenmesini kabul ediyorum.",
      send: "Gönder",
      doneTitle: "Teşekkürler!",
      doneSubtitle:
        "Talebiniz alındı. En kısa sürede sizinle iletişime geçeceğiz.",
      close: "Kapat",
      validationRequired: "Lütfen bu alanı doldurun.",
      validationChecks: "Devam etmek için onay kutularını işaretleyin.",
    },
    /** Çağrı sırasında dil, ses tonu ve profesyonellik — arayüz TR iken zorunlu Türkçe. */
    callSystemAugment: [
      "══════════════════════════════════════",
      "DİL (ZORUNLU — BU ÇAĞRI İÇİN)",
      "══════════════════════════════════════",
      "Arayüz dili Türkçe: varsayılan olarak mümkün olduğunca Türkçe konuş; doğal, akıcı, ana dil konuşuru gibi ol.",
      "ÖZEL SENARYO İSTİSNASI (ÜSTTEKİ METİN ÖNCELİKLİ): Kullanıcı tanımı açıkça İngilizce öğretmeni, English tutor, ESL/EFL, yabancı dilde konuşma pratiği veya hedef dilde ders gerektiriyorsa, öğretim ve pratiği TAMAMEN O HEDEF DİLDE yürüt. ‘Sadece Türkçe konuşabiliyorum’, ‘arayüz Türkçe olduğu için mümkün değil’ gibi ifadeler KESİNLİKLE YASAK.",
      "Bu istisna dışında: kullanıcı açıkça başka dil istemedikçe Türkçede kal.",
      "",
      "İLK TUR — PROAKTİF KONUŞ (demoda zorunlu): Hat açılır açılmaz veya karşı taraf kısa karşıladıktan sonra konuş; müşteri uzun süre önce konuşsun diye sessiz bekleme. Yalnızca selamlayıp sustukça cevap beklemek yasak — kim olduğun, arama amacın ve ilk net adım/soru tek akışta.",
      "",
      "TEMPO VE KONUŞMA (çok önemli)",
      "Günlük telefonda tanıdığınız net ve canlı bir insan gibi konuş: tempo orta-hafif hızlı; ağır, yavaş veya monoton olma.",
      "Kelimeleri gereksiz uzatma, geveleme veya hece hece sürükleyerek söyleme; boğuk ya da ağızda top gibi gezdirme yok.",
      "Uzun paragraflar ve dolambaçlı cümleler kurma; kısa net cümleler, mesajı hemen söyle sonra gerekirse bir soru ile devam et.",
      "Stabil ve güven veren ton; robot gibi tek düze ritim değil, hafif doğal vurgu.",
      "",
      "ARTİKÜLASYON VE NETLİK (ses çıktısı)",
      "Her kelimeyi eksiksiz ve anlaşılır söyle: ünlüleri yutma; sessiz harfleri (özellikle s, ş, k, p, t) net çıkar.",
      "Yabancı kökenli kelimelerde doğru Türkçe telaffuza yakın, kararlı heceleme; kekeleme, duraksama, anlam boşluğu yaratacak ‘eee/şey’ dolgusu yok.",
      "Telefon sesinde profesyonel yayın kalitesi: dinleyici hiçbir heceyi kaçırmamalı; cümleyi yarıda kesip yeniden başlama.",
      "",
      "SES VE SUNUM",
      "Kadın sesiyle sıcak, net, kurumsal temsilci tonu; profesyonel çağrı hattı kalitesinde ama ‘yavaş ve ağır’ değil.",
      "",
      "KALİTE",
      "Kibar, empatik ve çözüm odaklı ol; anlamlı kısa geçişler kullan ama gereksiz dolgu ve tekrardan kaçın.",
      "Dinlediğini göster, gerektiğinde iki cümlede özetle ve doğrula.",
      "",
      "KİŞİSELLEŞTİRİLMİŞ HİTAP (ZORUNLU)",
      "Prompt içindeki 'Caller name:' satırındaki adı kullanarak konuşmayı başlat.",
      "Türkçe hitapta isim erkekse '<Ad> Bey', kadınsa '<Ad> Hanım' kullan.",
      "Kesin emin değilsen nazikçe sadece ad-soyad ile hitap et ve ilk cümlede kendini tanıt.",
    ].join("\n"),
    presets: [
      {
        id: "dental",
        label: "Diş Kliniği",
        prompt: DENTAL_PROMPT_TR,
      },
      {
        id: "custom",
        label: "Özel Senaryo",
        prompt: "",
      },
      {
        id: "clinic",
        label: "Randevu Oluşturma",
        prompt: APPOINTMENT_PROMPT_TR,
      },
    ],
  },
  en: {
    nav: {
      openMenu: "Open menu",
      closeMenu: "Close menu",
      mobileMenuHint: "Select your language from the menu in the top bar.",
    },
    lang: {
      switcherAria: "Select language",
      tr: "TR",
      en: "EN",
      de: "DE",
    },
    hero: {
      title: "Discover the power of voice AI with Ansel AI.",
      subtitle:
        "Transform your business processes with intelligent voice agents that engage your customers in natural conversations.",
      cta: "Click to Try Ansel AI",
    },
    trustStrip:
      "Enterprise infrastructure · Seamless integration · Governable operations",
    advantagesSection: {
      eyebrow: "ENTERPRISE ADVANTAGES",
      title: "Elevate your voice operations to a mature enterprise tier",
    },
    advantages: [
      {
        title: "Always-on 24/7 operations",
        body:
          "Answer every voice touchpoint—even during peak periods—with minimal wait times, while automating scheduling and triage.",
      },
      {
        title: "Emotional cues, consistent presence",
        body:
          "Infer intent and tone from callers’ voices; respond with empathy, consistency, and phrasing suited to QA and auditing.",
      },
      {
        title: "Elastic scale",
        body:
          "Handle 10 or 10,000 concurrent calls—grow capacity without switchboard choke points or lengthy licensing ramps.",
      },
      {
        title: "Cost efficiency",
        body:
          "Reduce traditional contact‑center expenditure while safeguarding quality—with cost drivers that stay measurable.",
      },
    ],
    footer: {
      copyright: "Copyright © 2026 Ansel AI",
      socialAria: "Ansel AI social profiles",
      tagline: "Voice AI agents and enterprise automation",
      kvkkLink: "Turkish PDP disclosure (KVKK)",
      privacyLink: "Privacy policy",
      cookiesLink: "Cookie policy",
      kvkkHref: "/legal/en/kvkk-disclosure",
      privacyHref: "/legal/en/privacy-policy",
      cookiesHref: "/legal/en/cookie-policy",
    },
    modal: {
      closeBackdrop: "Close dialog",
      close: "Close",
      goBack: "Back",
      eyebrow: "Premium demo · Conversational assistant",
      title: "Guided rehearsal in three disciplined steps",
      description:
        "Pick a playbook, tighten the persona, leave a validated number—we’ll originate the PSTN demo automatically.",
      step1: "Step 1",
      step2: "Step 2",
      step3: "Step 3",
      stepRole: "Role template",
      stepPrompt: "Persona",
      stepCall: "Call",
      stepperLine1: "1. ROLE TEMPLATE",
      stepperLine2: "2. PERSONA",
      stepperLine3: "3. CALL",
      stepperAria: "Live test steps",
      quickTemplates: "TEMPLATES",
      labelPrompt: "ASSISTANT PERSONALITY",
      labelPhone: "PHONE NUMBER",
      placeholderPrompt:
        "E.g. you are an English tutor—practice conversation with me…",
      placeholderPhone: "+14155552671",
      submit: "Call me now",
      limitReached: "Trial limit reached. Contact sales.",
      submitting: "Placing carrier call…",
      presetApplying: "Updating AI persona…",
      scenarioTitle: "Choose your scenario",
    },
    alerts: {
      callFailed: "Could not start the call—please verify your details",
      callStarted: "Call queued — keep your line open.",
      validationHint:
        "Fill in the required fields above: persona text and phone number.",
    },
    validation: {
      prompt: "Enter text that defines your assistant’s role and behavior.",
      phone: "Enter a valid phone number in international format.",
    },
    postCall: {
      introTitle: "You're all set!",
      introSubtitle:
        "Your call is starting—in a few moments your phone may ring. We'd love your quick feedback.",
      introCta: "Continue",
      satisfactionQuestion: "Were you satisfied?",
      yes: "Yes",
      no: "No",
      declinedThanks: "Thanks for your feedback.",
      declinedClose: "Close",
      accountTypeQuestion: "Is your request individual or corporate?",
      individual: "Individual",
      corporate: "Corporate",
      nameQuestion: "What is your name?",
      firstNamePlaceholder: "First name",
      lastNamePlaceholder: "Last name",
      next: "Next",
      emailQuestion: "What is your email address?",
      emailPlaceholder: "Work email",
      projectQuestion:
        "Please describe your AI assistant / automation request",
      projectPlaceholder: "Briefly describe your project",
      contactTitlePrefix: "One last step, ",
      contactTitleSuffix: "!",
      phonePlaceholder: "Your phone number",
      callbackPlaceholder: "When should we call you?",
      callbackMorning: "Before noon",
      callbackAfternoon: "After noon",
      consentContact:
        "I allow the Ansel AI team to contact me using my phone number.",
      consentKvkk:
        "I reviewed the PDP disclosure plus privacy artifacts and authorize processing strictly within that scope.",
      send: "Submit",
      doneTitle: "Thank you!",
      doneSubtitle:
        "We received your request and will get back to you shortly.",
      close: "Close",
      validationRequired: "Please fill in this field.",
      validationChecks: "Please accept the required checkboxes to continue.",
    },
    callSystemAugment: [
      "══════════════════════════════════════",
      "LANGUAGE (MANDATORY FOR THIS CALL)",
      "══════════════════════════════════════",
      "The UI language is English: default to English for this call—natural, fluent, native-professional.",
      "CUSTOM-SCENARIO OVERRIDE: If the persona/scenario text above explicitly requires Turkish, German, or another language for tutoring, role-play, or conversational practice, conduct that instructional content in the target language. Never refuse with ‘I can only speak English’ when the scenario clearly demands another language for pedagogy.",
      "Outside that exception, do not switch languages unless the caller explicitly asks.",
      "",
      "FIRST TURN — SPEAK PROACTIVELY (mandatory in this demo): Start talking as soon as the line is live or right after a brief hello; do not wait in silence for the callee to speak first. A bare greeting with a long pause is forbidden—identity, purpose, and one clear next step or question in one flow.",
      "",
      "PACE AND DELIVERY (critical)",
      "Speak like on a normal business phone call: upbeat–neutral pace—clear and slightly brisk; do NOT speak slowly or drawl.",
      "Do not drag syllables or mumble; avoid long-winded wording and filler rambling.",
      "Use short, direct sentences—state the point, then one focused question when needed.",
      "Sound steady and confident—not flat robotic monotone.",
      "",
      "ARTICULATION & CLARITY (voice output)",
      "Enunciate every word cleanly for phone/TTS: crisp consonants, full vowels, no swallowed endings or blurred syllables.",
      "No hesitation markers (‘um’, ‘uh’, false starts); speak in smooth phrases—never sound like you are tripping over words.",
      "Professional broadcast-level clarity: the listener must catch every word without strain.",
      "",
      "VOICE AND DELIVERY",
      "Warm, clear female professional tone—polished hotline quality without sounding heavy or lethargic.",
      "",
      "QUALITY",
      "Courteous, empathetic, solution-oriented; concise acknowledgements—avoid unnecessary repetition.",
      "Show active listening; briefly paraphrase and confirm when useful.",
      "",
      "PERSONALIZED GREETING (MANDATORY)",
      "Use the caller's name from the 'Caller name:' line in the prompt when opening the conversation.",
      "Use a respectful title (Mr./Ms.) when you can infer it naturally; if unsure, use the full name politely.",
    ].join("\n"),
    presets: [
      {
        id: "dental",
        label: "Dental Clinic",
        prompt: DENTAL_PROMPT_EN,
      },
      {
        id: "custom",
        label: "Custom Scenario",
        prompt: "",
      },
      {
        id: "clinic",
        label: "Appointment Scheduling",
        prompt: APPOINTMENT_PROMPT_EN,
      },
    ],
  },
  de: {
    nav: {
      openMenu: "Menü öffnen",
      closeMenu: "Menü schließen",
      mobileMenuHint:
        "Wählen Sie Ihre Sprache über das Menü in der oberen Leiste.",
    },
    lang: {
      switcherAria: "Sprache wählen",
      tr: "TR",
      en: "EN",
      de: "DE",
    },
    hero: {
      title:
        "Entdecken Sie mit Ansel AI die Kraft der sprachgestützten künstlichen Intelligenz.",
      subtitle:
        "Modernisieren Sie Ihre Geschäftsprozesse mit intelligenten Voice-Agent-Lösungen, die mit Ihren Kunden auf natürliche Weise Gespräche führen.",
      cta: "Hier klicken und Ansel AI testen",
    },
    trustStrip:
      "Unternehmensinfrastruktur · Nahtlose Integration · Steuerbare Prozesse",
    advantagesSection: {
      eyebrow: "UNTERNEHMENSVORTEILE",
      title:
        "Bringen Sie Ihre Voice-Operationen auf ein ausgereiftes Enterprise-Niveau",
    },
    advantages: [
      {
        title: "Ununterbrochener 24/7-Betrieb",
        body:
          "Bearbeiten Sie alle sprachlichen Kontakte—auch in Spitzenzeiten—mit nahezu keiner Warteschlange und automatisierter Terminierung sowie Triage.",
      },
      {
        title: "Stimmungssignale, konsistenter Auftritt",
        body:
          "Lesen Sie Absicht und Spannung aus der Stimme; antworten Sie einfühlsam, einheitlich und in Formulierungen, die sich für Qualitätssicherung und revisionssichere Nachweise eignen.",
      },
      {
        title: "Elastische Skalierung",
        body:
          "Ob 10 oder 10.000 parallele Anrufe—skalieren Sie ohne typische TK-Engpässe und ohne lange Lizenz-Vorläufe.",
      },
      {
        title: "Kosteneffizienz",
        body:
          "Senken Sie klassische Contact-Center-Kosten bei gleichbleibender Servicequalität—mit messbaren Kostenhebeln.",
      },
    ],
    footer: {
      copyright: "Copyright © 2026 Ansel AI",
      socialAria: "Ansel AI in sozialen Netzwerken",
      tagline: "Sprach-KI-Agenten und Enterprise-Automatisierung",
      kvkkLink: "Informationspflicht nach türkischem KVKK",
      privacyLink: "Datenschutzerklärung",
      cookiesLink: "Cookie-Richtlinie",
      kvkkHref: "/legal/de/kvkk-hinweis",
      privacyHref: "/legal/de/datenschutz",
      cookiesHref: "/legal/de/cookie-richtlinie",
    },
    modal: {
      closeBackdrop: "Dialog schließen",
      close: "Schließen",
      goBack: "Zurück",
      eyebrow: "Premium-Demo · Sprachassistent",
      title: "Live-Test in drei klaren Schritten",
      description:
        "Wählen Sie eine Rolle, schärfen Sie die Persönlichkeit und hinterlassen Sie eine geprüfte Rufnummer — Ansel AI ruft Sie anschließend an.",
      step1: "Schritt 1",
      step2: "Schritt 2",
      step3: "Schritt 3",
      stepRole: "Rollen‑Vorlage",
      stepPrompt: "Charakter",
      stepCall: "Anruf",
      stepperLine1: "1. ROLLEN‑VORLAGE",
      stepperLine2: "2. CHARAKTER",
      stepperLine3: "3. ANRUF",
      stepperAria: "Schritte des Live‑Tests",
      quickTemplates: "VORLAGEN",
      labelPrompt: "ASSISTENTENPERSÖNLICHKEIT",
      labelPhone: "TELEFONNUMMER",
      placeholderPrompt:
        "z. B. du bist ein Englischlehrer — führe mit mir Konversationsübungen durch …",
      placeholderPhone: "+493012345678",
      submit: "Rückruf anfordern",
      limitReached: "Demo-Limit erreicht. Vertrieb kontaktieren.",
      submitting: "Anruf wird aufgebaut…",
      presetApplying: "KI‑Persönlichkeit wird aktualisiert…",
      scenarioTitle: "Szenario auswählen",
    },
    alerts: {
      callFailed:
        "Anruf konnte nicht gestartet werden — bitte Daten prüfen",
      callStarted: "Anruf eingereiht — halten Sie die Leitung frei.",
      validationHint:
        "Bitte die Pflichtfelder oben ausfüllen: Assistenten‑Text und Telefonnummer.",
    },
    validation: {
      prompt:
        "Geben Sie einen Text ein, der Rolle und Verhalten des Assistenten definiert.",
      phone: "Geben Sie eine gültige Telefonnummer im internationalen Format ein.",
    },
    postCall: {
      introTitle: "Perfekt!",
      introSubtitle:
        "Ihr Anruf wurde gestartet; gleich kann es klingeln. Kurz Ihre Rückmeldung?",
      introCta: "Weiter",
      satisfactionQuestion: "Waren Sie zufrieden?",
      yes: "Ja",
      no: "Nein",
      declinedThanks: "Vielen Dank für Ihr Feedback.",
      declinedClose: "Schließen",
      accountTypeQuestion: "Ist Ihr Anliegen privat oder geschäftlich?",
      individual: "Privat",
      corporate: "Geschäftlich",
      nameQuestion: "Wie lautet Ihr Vor- und Nachname?",
      firstNamePlaceholder: "Vorname",
      lastNamePlaceholder: "Nachname",
      next: "Weiter",
      emailQuestion: "Wie lautet Ihre E-Mail-Adresse?",
      emailPlaceholder: "Geschäftliche E-Mail",
      projectQuestion:
        "Bitte beschreiben Sie Ihr Anliegen zu KI-Assistenten oder Automatisierung",
      projectPlaceholder: "Kurz Ihr Projekt beschreiben",
      contactTitlePrefix: "Noch ein Schritt, ",
      contactTitleSuffix: "!",
      phonePlaceholder: "Ihre Telefonnummer",
      callbackPlaceholder: "Wann dürfen wir Sie anrufen?",
      callbackMorning: "Vormittags",
      callbackAfternoon: "Nachmittags",
      consentContact:
        "Ich erlaube dem Ansel AI-Team, mich unter meiner Telefonnummer zu kontaktieren.",
      consentKvkk:
        "Ich habe die Aufklärungstexte und die Datenschutzerklärung zur Kenntnis genommen und willige in die beschriebene Verarbeitung ein.",
      send: "Senden",
      doneTitle: "Vielen Dank!",
      doneSubtitle:
        "Wir haben Ihre Anfrage erhalten und melden uns bald bei Ihnen.",
      close: "Schließen",
      validationRequired: "Bitte füllen Sie dieses Feld aus.",
      validationChecks:
        "Bitte aktivieren Sie die erforderlichen Kontrollkästchen.",
    },
    callSystemAugment: [
      "══════════════════════════════════════",
      "SPRACHE (VERBINDLICH — FÜR DIESEN ANRUF)",
      "══════════════════════════════════════",
      "Die Oberfläche ist auf Deutsch: sprich standardmäßig durchgehend Hochdeutsch — natürlich, flüssig, professionell.",
      "AUSNAHME EIGENES SZENARIO: Wenn die Rollenbeschreibung oben ausdrücklich Englischunterricht, ESL-Konversation oder Unterricht in einer anderen Zielsprache verlangt, führe den Unterrichts- und Übungsteil in dieser Zielsprache. Sage niemals, du dürftest nur Deutsch sprechen, wenn das Szenario fachlich eine andere Unterrichtssprache erfordert.",
      "Außerhalb dieser Ausnahme: wechsle die Sprache nicht, es sei denn, der Anrufer fordert es ausdrücklich.",
      "",
      "ERSTER TURN — PROAKTIV SPRECHEN (in dieser Demo verbindlich): Sprich sobald die Verbindung steht oder direkt nach einem kurzen Gruß; nicht schweigend darauf warten, dass die andere Seite zuerst redet. Nur grüßen und dann peinliche Stille ist verboten — Wer du bist, Anlass und nächster klare Schritt oder eine Erstfrage in einem Zug.",
      "",
      "TEMPO UND SPRECHWEISE (besonders wichtig)",
      "Wie bei einem gewohnten Telefonat: klar und zügig, aber verständlich—nicht langsam, nicht schleppend, keine gezogenen Silben.",
      "Kein Schlurfen oder Nuscheln; keine überlangen Sätze und kein Ausschweifen.",
      "Kurze, prägnante Äußerungen; Punkt auf den Punkt, dann höchstens eine konkrete Rückfrage.",
      "Ruhige, stabile Intonation—freundlich, aber nicht roboterhaft monoton.",
      "",
      "ARTIKULATION UND KLARHEIT (Sprachausgabe)",
      "Jedes Wort sauber aussprechen: Konsonanten (ch, sch, z, k, p, t) und Vokale deutlich; Umlaute (ä, ö, ü) und ß nicht verschlucken.",
      "Keine Füllwörter, kein Stocken, keine neuen Anläufe mitten im Satz—gleichmäßig flüssig wie eine erfahrene Telefon-Mitarbeiterin.",
      "Ziel: makellos verständliches Hochdeutsch am Telefon; der Anrufer soll ohne Mühe jedes Wort erfassen.",
      "",
      "STIMME UND AUFTRETEN",
      "Weibliche, warme, klare Stimme—professionell wie eine erfahrene Service-Mitarbeiterin, ohne träge oder ermüdend langsam zu klingen.",
      "",
      "QUALITÄT",
      "Höflich, einfühlsam, lösungsorientiert; knapp hören und wenn nötig in einem Satz spiegeln.",
      "",
      "PERSONALISIERTE ANREDE (VERBINDLICH)",
      "Nutze den Namen aus der Zeile 'Caller name:' im Prompt direkt zu Gesprächsbeginn.",
      "Wenn eindeutig, verwende eine höfliche Anrede (Herr/Frau + Name); sonst den vollständigen Namen neutral und freundlich.",
    ].join("\n"),
    presets: [
      {
        id: "dental",
        label: "Zahnarztpraxis",
        prompt: DENTAL_PROMPT_DE,
      },
      {
        id: "custom",
        label: "Eigenes Szenario",
        prompt: "",
      },
      {
        id: "clinic",
        label: "Terminvereinbarung",
        prompt: APPOINTMENT_PROMPT_DE,
      },
    ],
  },
} as const satisfies Record<
  Locale,
  Record<string, unknown> & {
    presets: readonly { id: string; label: string; prompt: string }[];
    advantages: readonly { title: string; body: string }[];
    postCall: PostCallWizardLabels;
  }
>;

const chipsContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

const chipItem = {
  hidden: { opacity: 0, y: 10, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, damping: 22, stiffness: 320 },
  },
};

const heroContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.05,
    },
  },
};

/** Yukarıdan aşağıya süzülme (spring) */
const heroItem = {
  hidden: { opacity: 0, y: -42 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 26,
      stiffness: 190,
      mass: 0.88,
    },
  },
};

const bentoContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.06,
    },
  },
};

const bentoCardVariants = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.62,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

/** Mobil / reduced-motion için daha hafif varyantlar */
const heroItemLite = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const bentoCardVariantsLite = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const chipItemLite = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const chipsContainerLite = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.02, delayChildren: 0 },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35 } },
  exit: { opacity: 0, transition: { duration: 0.28 } },
};

const modalPanelVariants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
    rotateX: 11,
    y: 28,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotateX: 0,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 26,
      stiffness: 280,
      mass: 0.85,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    rotateX: 7,
    y: 12,
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] as const },
  },
};

const modalPanelVariantsLite = {
  hidden: {
    opacity: 0,
    scale: 0.98,
    y: 16,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 10,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] as const },
  },
};

const mobilePhoneVariants = {
  hidden: { opacity: 0, y: 36, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      damping: 25,
      stiffness: 240,
      mass: 0.84,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.96,
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] as const },
  },
};


const PRESET_EMOJI = {
  dental: "🦷",
  custom: "✨",
  clinic: "📅",
} as const;

type PresetId = keyof typeof PRESET_EMOJI;

const LOCALE_STORAGE_KEY = "ansel-locale";
const DEMO_CALL_COUNT_KEY = "ansel-demo-call-count";
const DEMO_CALL_MAX = 2;

/** Tarayıcı dilini otomatik uygulama — çoğu kullanıcıda OS İngilizce olduğu için yanlışlıkla EN araması tetikleniyordu. */

const advantageIcons = [Clock, BrainCircuit, TrendingUp, ShieldCheck] as const;

const advantageLayoutClasses = [
  "min-h-[220px] md:min-h-[240px] xl:min-h-[260px]",
  "min-h-[220px] md:min-h-[240px] xl:min-h-[260px]",
  "min-h-[220px] md:min-h-[240px] xl:min-h-[260px]",
  "min-h-[220px] md:min-h-[240px] xl:min-h-[260px]",
] as const;

const advantageAccentClasses = [
  "bg-violet-500/10 text-violet-300 ring-violet-400/35 md:group-hover:bg-violet-500/16 md:group-hover:text-violet-200 md:group-hover:ring-violet-400/50",
  "bg-blue-500/10 text-blue-300 ring-blue-400/35 md:group-hover:bg-blue-500/16 md:group-hover:text-blue-200 md:group-hover:ring-blue-400/50",
  "bg-fuchsia-500/10 text-fuchsia-300 ring-fuchsia-400/35 md:group-hover:bg-fuchsia-500/16 md:group-hover:text-fuchsia-200 md:group-hover:ring-fuchsia-400/50",
  "bg-cyan-500/10 text-cyan-300 ring-cyan-400/35 md:group-hover:bg-cyan-500/16 md:group-hover:text-cyan-200 md:group-hover:ring-cyan-400/50",
] as const;

function useIsMobile(breakpointPx = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [breakpointPx]);

  return isMobile;
}

function LanguageDropdown({
  locale,
  onSelect,
  ariaLabel,
}: {
  locale: Locale;
  onSelect: (code: Locale) => void;
  ariaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleMouseDown);
      return () => document.removeEventListener("mousedown", handleMouseDown);
    }
  }, [open]);

  const codes = ["tr", "en", "de"] as const;
  const labels: Record<Locale, string> = {
    tr: "TR",
    en: "EN",
    de: "DE",
  };

  return (
    <div className="relative" ref={containerRef}>
      <motion.button
        type="button"
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className="flex min-h-11 touch-manipulation items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-xl transition-colors active:bg-white/[0.1] md:hover:bg-white/[0.09]"
      >
        <Globe className="h-3.5 w-3.5 shrink-0 text-sky-400" aria-hidden />
        <span>{labels[locale]}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </motion.button>
      <AnimatePresence>
        {open ? (
          <motion.ul
            role="listbox"
            aria-label={ariaLabel}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 z-[80] mt-2 min-w-[168px] overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a]/95 py-1 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl"
          >
            {codes.map((code) => (
              <li key={code} role="option" aria-selected={locale === code}>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onSelect(code);
                    setOpen(false);
                  }}
                  className={`flex min-h-11 touch-manipulation w-full items-center justify-between px-4 py-3 text-left text-xs font-medium uppercase tracking-wide transition-colors ${locale === code ? "bg-white/[0.08] text-white" : "text-zinc-400 active:bg-white/[0.06] md:hover:bg-white/[0.05] md:hover:text-zinc-100"}`}
                >
                  <span>{labels[code]}</span>
                  {locale === code ? (
                    <Check className="h-4 w-4 shrink-0 text-sky-400" aria-hidden />
                  ) : (
                    <span className="inline-block w-4 shrink-0" aria-hidden />
                  )}
                </motion.button>
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function renderBrandStyledTitle(title: string) {
  const brand = "Ansel AI";
  const idx = title.indexOf(brand);
  if (idx === -1) return title;

  const before = title.slice(0, idx);
  const after = title.slice(idx + brand.length);

  return (
    <>
      {before}
      <span className="inline-flex items-baseline">
        <span className="bg-gradient-to-r from-[#e2e8f0] via-[#bfdbfe] to-[#c4b5fd] bg-clip-text text-transparent [text-shadow:0_0_22px_rgba(96,165,250,0.22)]">
          Ansel
        </span>
        <span className="ml-1.5 bg-gradient-to-r from-[#60a5fa] via-[#818cf8] to-[#c084fc] bg-clip-text font-bold tracking-[0.02em] text-transparent [text-shadow:0_0_24px_rgba(168,85,247,0.28)]">
          AI
        </span>
      </span>
      {after}
    </>
  );
}

export default function HomeClient({
  initialLocale,
}: {
  initialLocale: AppLocale;
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const t = translations[locale];

  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  const liteMotion = isMobile || !!reducedMotion;
  const touchSafeHoverClass = isMobile ? "" : "md:hover:scale-[1.02]";

  const heroItemActive = liteMotion ? heroItemLite : heroItem;
  const heroContainerActive = liteMotion
    ? {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.06,
            delayChildren: 0.02,
          },
        },
      }
    : heroContainer;
  const bentoContainerActive = liteMotion
    ? {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.04,
            delayChildren: 0.03,
          },
        },
      }
    : bentoContainer;
  const bentoCardActive = liteMotion ? bentoCardVariantsLite : bentoCardVariants;
  const chipItemActive = liteMotion ? chipItemLite : chipItem;
  const chipsContainerActive = liteMotion ? chipsContainerLite : chipsContainer;
  const modalPanelActive =
    liteMotion && !isMobile ? modalPanelVariantsLite : modalPanelVariants;
  const [uiFadeIn, setUiFadeIn] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [keyboardInset, setKeyboardInset] = useState(0);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const modalScrollRef = useRef<HTMLDivElement>(null);
  const [phone, setPhone] = useState("");
  const [callerName, setCallerName] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    prompt?: string;
    phone?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [callBanner, setCallBanner] = useState<{
    variant: "success" | "error" | "limit";
    message: string;
  } | null>(null);

  const [watermarkEmoji, setWatermarkEmoji] = useState<string | null>(null);
  const [focusPrompt, setFocusPrompt] = useState(false);
  const [focusPhone, setFocusPhone] = useState(false);
  const [submitRipples, setSubmitRipples] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const [postCallWizardOpen, setPostCallWizardOpen] = useState(false);
  const [postCallWizardPhone, setPostCallWizardPhone] = useState("");
  const [demoCallCount, setDemoCallCount] = useState(0);
  const [bentoPointer, setBentoPointer] = useState({ x: 50, y: 50 });

  const activeModalStep = useMemo<1 | 2 | 3>(() => {
    const digits = phone.replace(/\D/g, "");
    if (focusPhone || digits.length >= 8) return 3;
    if (
      focusPrompt ||
      systemPrompt.trim().length > 0 ||
      selectedPresetId !== null
    ) {
      return 2;
    }
    return 1;
  }, [
    focusPhone,
    focusPrompt,
    phone,
    selectedPresetId,
    systemPrompt,
  ]);
  const activePreset = useMemo(
    () => t.presets.find((p) => p.id === selectedPresetId) ?? null,
    [t.presets, selectedPresetId],
  );

  const watermarkClearRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (isAppLocale(saved) && saved !== initialLocale) {
        setLocale(saved);
        persistLocaleClientCookie(saved);
      }
    } catch {
      /* ignore */
    }
    const id = window.requestAnimationFrame(() => setUiFadeIn(true));
    try {
      const raw = localStorage.getItem(DEMO_CALL_COUNT_KEY);
      const parsed = Number.parseInt(raw ?? "0", 10);
      if (Number.isFinite(parsed) && parsed > 0) {
        setDemoCallCount(Math.min(DEMO_CALL_MAX, parsed));
      }
    } catch {
      /* ignore */
    }
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(
    () => () => {
      if (watermarkClearRef.current) {
        clearTimeout(watermarkClearRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (modalOpen) {
      setFieldErrors({});
      setCallBanner(null);
    }
  }, [modalOpen]);

  useEffect(() => {
    setFieldErrors({});
  }, [locale]);

  useEffect(() => {
    if (!selectedPresetId || selectedPresetId === "custom") return;
    const preset = translations[locale].presets.find(
      (p) => p.id === selectedPresetId,
    );
    if (preset) setSystemPrompt(preset.prompt);
  }, [locale, selectedPresetId]);

  async function handleCallSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCallBanner(null);
    const trimmedName = callerName.trim();
    const trimmedPhone = phone.trim();
    const trimmedPrompt = systemPrompt.trim();

    const nextErrors: { name?: string; prompt?: string; phone?: string } = {};
    if (!trimmedName) {
      nextErrors.name = t.postCall.validationRequired;
    }
    if (!trimmedPrompt) {
      nextErrors.prompt = t.validation.prompt;
    }
    if (!trimmedPhone) {
      nextErrors.phone = t.validation.phone;
    }
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setCallBanner({
        variant: "error",
        message: t.alerts.validationHint,
      });
      requestAnimationFrame(() => {
        const el = nextErrors.name
          ? nameInputRef.current
          : nextErrors.prompt
          ? promptInputRef.current
          : nextErrors.phone
            ? phoneInputRef.current
            : null;
        el?.scrollIntoView({ block: "center", behavior: "smooth" });
      });
      return;
    }

    // UI'de hangi dil seçiliyse çağrı da o dilde başlamalı.
    const callLocale = locale;
    /* Ham kullanıcı metni + sınır jetonu + callSystemAugment; sunucu jetondan bölüp augment uygular (dekoratif çizgi kullanıcıda geçerse patlamaz). */
    const fullSystemPrompt = `Caller name: ${trimmedName}\n${trimmedPrompt}\n\n${ANSEL_CALL_SYSTEM_BOUNDARY}\n${translations[callLocale].callSystemAugment}`;

    setFieldErrors({});
    setIsLoading(true);
    const presetAtSubmit = selectedPresetId;
    try {
      const tokenRes = await fetch("/api/call-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: trimmedPhone }),
      });

      if (!tokenRes.ok) {
        let msg: string = t.modal.limitReached;
        try {
          const data = (await tokenRes.json()) as { error?: unknown };
          if (typeof data?.error === "string" && data.error.trim()) {
            msg = data.error.trim();
          }
        } catch {
          /* ignore */
        }
        if (tokenRes.status === 429) {
          setCallBanner({ variant: "limit", message: msg });
          return;
        }
        setCallBanner({ variant: "error", message: msg });
        return;
      }

      const tokenPayload = (await tokenRes.json()) as {
        grantId?: string;
      };
      const rateGrant =
        typeof tokenPayload.grantId === "string" ? tokenPayload.grantId : "";

      const vapiOpening = outboundVapiFirstMessage(
        callLocale,
        presetAtSubmit,
        trimmedName,
      );

      const res = await fetch("/api/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: trimmedPhone,
          systemPrompt: fullSystemPrompt,
          locale: callLocale,
          presetId: presetAtSubmit ?? undefined,
          /** Sunucu yedek: bazı ortamlarda presetId düşerse özel senaryo yine tanınsın */
          isCustomScenario: presetAtSubmit === "custom",
          /** Diş için sector clinic vermeyin — sunucu yanlış “size nasıl yardımcı olabilirim” firstMessage gönderirdi. */
          sector: undefined,
          ...(vapiOpening ? { firstMessage: vapiOpening } : {}),
          rateGrant,
        }),
      });

      if (!res.ok) {
        let msg: string = t.alerts.callFailed;
        try {
          const data = (await res.json()) as { error?: unknown };
          if (typeof data?.error === "string" && data.error.trim()) {
            msg = data.error.trim();
          }
        } catch {
          /* ignore */
        }
        setCallBanner({
          variant: res.status === 429 ? "limit" : "error",
          message: msg,
        });
        return;
      }

      const nextCount = Math.min(DEMO_CALL_MAX, demoCallCount + 1);
      setDemoCallCount(nextCount);
      try {
        localStorage.setItem(DEMO_CALL_COUNT_KEY, String(nextCount));
      } catch {
        /* ignore */
      }
      setCallBanner({
        variant: "success",
        message: t.alerts.callStarted,
      });
      window.setTimeout(() => {
        if (presetAtSubmit !== "clinic") {
          setModalOpen(true);
          setPostCallWizardPhone(trimmedPhone);
          setPostCallWizardOpen(true);
        } else {
          setModalOpen(false);
          setPostCallWizardOpen(false);
        }
        setCallerName("");
        setPhone("");
        setSystemPrompt("");
        setSelectedPresetId(null);
        setCallBanner(null);
      }, 1200);
    } catch {
      setCallBanner({ variant: "error", message: t.alerts.callFailed });
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmitRipple(e: PointerEvent<HTMLButtonElement>) {
    if (isLoading) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now() + Math.random();
    setSubmitRipples((prev) => [...prev, { id, x, y }]);
    window.setTimeout(() => {
      setSubmitRipples((prev) => prev.filter((r) => r.id !== id));
    }, 700);
  }

  useEffect(() => {
    if (!modalOpen) {
      setWatermarkEmoji(null);
    }
  }, [modalOpen]);

  useEffect(() => {
    if (!modalOpen || !isMobile) return;
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => {
      const obscured = Math.max(
        0,
        window.innerHeight - vv.height - Math.max(0, vv.offsetTop),
      );
      setKeyboardInset(obscured);
    };
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    update();
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
      setKeyboardInset(0);
    };
  }, [modalOpen, isMobile]);

  const scrollFieldIntoView = useCallback(
    (el: HTMLElement | null) => {
      if (!el || !isMobile) return;
      requestAnimationFrame(() => {
        el.scrollIntoView({ block: "center", behavior: "smooth" });
      });
    },
    [isMobile],
  );

  const openCallModal = useCallback(() => {
    setMobileNavOpen(false);
    setCallBanner(null);
    setFieldErrors({});
    setSelectedPresetId(null);
    setModalOpen(true);
  }, []);

  const handleLocaleChange = useCallback((code: Locale) => {
    setMobileNavOpen(false);
    setLocale(code);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, code);
      persistLocaleClientCookie(code);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <motion.div
      className="relative min-h-[100dvh] w-full max-w-full overflow-x-hidden bg-black text-zinc-100 pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: uiFadeIn ? 1 : 0 }}
      transition={{
        duration: liteMotion ? 0.45 : 0.75,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <AuroraPlasmaCanvas className="h-screen w-screen" />

      {/* Glass navbar — premium */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex h-[68px] w-full max-w-7xl items-center justify-between gap-2 px-4 sm:h-[72px] sm:gap-3 sm:px-8">
          <motion.a
            href="#"
            className="flex select-none items-center gap-2.5 sm:gap-3"
            whileTap={{ scale: 0.98 }}
          >
            <AnselLogoMark muted={liteMotion} size="sm" />
            <span className="relative inline-flex items-baseline text-lg font-semibold tracking-tight sm:text-xl">
              <span className="bg-gradient-to-r from-[#e2e8f0] via-[#bfdbfe] to-[#c4b5fd] bg-clip-text text-transparent [text-shadow:0_0_22px_rgba(96,165,250,0.22)]">
                Ansel
              </span>
              <span className="ml-1.5 bg-gradient-to-r from-[#60a5fa] via-[#818cf8] to-[#c084fc] bg-clip-text font-bold tracking-[0.02em] text-transparent [text-shadow:0_0_24px_rgba(168,85,247,0.28)]">
                AI
              </span>
            </span>
          </motion.a>

          <div className="hidden min-w-0 flex-1 items-center justify-end gap-3 md:flex md:gap-4">
            <LanguageDropdown
              locale={locale}
              onSelect={handleLocaleChange}
              ariaLabel={t.lang.switcherAria}
            />
          </div>

          <div className="flex shrink-0 items-center gap-2 md:hidden">
            <LanguageDropdown
              locale={locale}
              onSelect={handleLocaleChange}
              ariaLabel={t.lang.switcherAria}
            />
            <motion.button
              type="button"
              onClick={() => setMobileNavOpen((o) => !o)}
              whileTap={{ scale: 0.95 }}
              className="flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] p-2 text-zinc-200 backdrop-blur-xl active:bg-white/[0.09]"
              aria-expanded={mobileNavOpen}
              aria-label={mobileNavOpen ? t.nav.closeMenu : t.nav.openMenu}
            >
              {mobileNavOpen ? (
                <X className="h-5 w-5" strokeWidth={2} aria-hidden />
              ) : (
                <Menu className="h-5 w-5" strokeWidth={2} aria-hidden />
              )}
            </motion.button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileNavOpen ? (
          <>
            <motion.button
              key="mobile-nav-backdrop"
              type="button"
              aria-label={t.modal.closeBackdrop}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.div
              key="mobile-nav-panel"
              role="dialog"
              aria-modal="true"
              aria-label={t.nav.openMenu}
              className="fixed right-3 top-[calc(4.25rem+env(safe-area-inset-top))] z-[60] w-[min(92vw,320px)] overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0a0a0a]/95 p-4 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.85)] backdrop-blur-xl md:hidden"
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
            >
              <p className="mt-4 text-xs leading-relaxed text-zinc-500">
                {t.nav.mobileMenuHint}
              </p>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <main className="relative z-10 w-full max-w-full overflow-x-hidden">
        {/* Hero */}
        <section className="relative flex min-h-[calc(100dvh-72px)] flex-col items-center justify-center px-6 pb-16 pt-14 sm:px-10 sm:pt-18 md:pb-14">
          <motion.div
            className="relative z-[3] mx-auto flex w-full max-w-4xl flex-col items-center text-center"
            variants={heroContainerActive}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={heroItemActive}
              className="mb-8 flex justify-center md:mb-10"
              aria-hidden
            >
              <AnselLogoMark muted={liteMotion} size="lg" />
            </motion.div>
            <motion.h1
              variants={heroItemActive}
              className="max-w-4xl break-words text-balance bg-gradient-to-b from-white via-zinc-100 to-zinc-500 bg-clip-text text-2xl font-semibold leading-[1.16] tracking-tight text-transparent sm:text-4xl md:text-5xl md:leading-[1.08] lg:text-6xl lg:leading-[1.06]"
            >
              {renderBrandStyledTitle(t.hero.title)}
            </motion.h1>

            <motion.p
              variants={heroItemActive}
              className="mt-5 max-w-2xl break-words text-pretty text-sm leading-relaxed text-zinc-500 sm:mt-7 sm:text-base md:text-lg"
            >
              {t.hero.subtitle}
            </motion.p>

            <motion.div
              variants={heroItemActive}
              className="mt-10 hidden w-full justify-center sm:mt-12 md:mt-14 md:flex"
            >
              <div className="relative">
                <motion.div
                  className="pointer-events-none absolute inset-[-14px] rounded-[1.35rem] bg-gradient-to-r from-[#2563eb]/45 via-[#9333ea]/35 to-[#2563eb]/45 blur-2xl max-md:opacity-70 max-md:blur-xl"
                  animate={{ opacity: 0.56, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  aria-hidden
                />
                <motion.div
                  className="pointer-events-none absolute inset-[-6px] rounded-3xl border border-[#9333ea]/25 max-md:opacity-80"
                  animate={{ opacity: 0.42, boxShadow: "0 0 0 0 rgba(37,99,235,0)" }}
                  transition={{ duration: 0.2 }}
                  aria-hidden
                />
                <motion.button
                  type="button"
                  onClick={openCallModal}
                  whileTap={{ scale: 0.95 }}
                  className={`group relative inline-flex min-h-[52px] min-w-[min(100%,280px)] items-center justify-center gap-3 rounded-2xl px-8 py-4 text-base font-semibold text-white ${touchSafeHoverClass}`}
                >
                  <span
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#7c3aed]/95 via-[#3b82f6]/90 to-[#22d3ee]/90 opacity-95 blur-xl transition-opacity duration-300 md:group-hover:opacity-100"
                    aria-hidden
                  />
                  <span
                    className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-zinc-900/95 to-[#050505]"
                    aria-hidden
                  />
                  <span
                    className="absolute inset-0 rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.16),0_0_46px_-10px_rgba(59,130,246,0.62),0_0_78px_-18px_rgba(124,58,237,0.58)]"
                    aria-hidden
                  />
                  <Mic
                    className="relative z-10 h-6 w-6 shrink-0 text-sky-300 sm:h-7 sm:w-7"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <span className="relative z-10 tracking-tight">{t.hero.cta}</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Mobil: başparmak erişimi — sabit alt CTA */}
        <div
          className={`pointer-events-none fixed inset-x-0 bottom-0 z-30 transition-opacity duration-200 md:hidden ${modalOpen ? "opacity-0" : "opacity-100"}`}
          aria-hidden={modalOpen}
        >
          <div
            className={`pointer-events-auto mx-auto max-w-lg px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-2 ${modalOpen ? "pointer-events-none" : ""}`}
          >
            <motion.div
              className="relative mx-auto w-full max-w-md"
              initial={false}
              animate={{ y: mobileNavOpen || modalOpen ? 120 : 0 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            >
              <motion.div
                className="pointer-events-none absolute inset-[-10px] rounded-[1.25rem] bg-gradient-to-r from-[#2563eb]/35 via-[#9333ea]/28 to-[#2563eb]/35 blur-xl opacity-80"
                aria-hidden
              />
              <motion.button
                type="button"
                onClick={openCallModal}
                whileTap={{ scale: 0.95 }}
                className="relative flex min-h-[52px] w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#2563eb] via-[#6366f1] to-[#9333ea] px-6 py-4 text-base font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_0_48px_-6px_rgba(147,51,234,0.45),0_12px_40px_-12px_rgba(37,99,235,0.35)]"
              >
                <Mic className="h-5 w-5 shrink-0 text-white/95" strokeWidth={2} aria-hidden />
                {t.hero.cta}
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Güven şeridi */}
        <div className="relative border-y border-white/10 bg-white/[0.03] py-4 backdrop-blur-xl">
          <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 sm:text-sm sm:tracking-[0.24em]">
            {t.trustStrip}
          </p>
        </div>

        {/* Bento avantajlar */}
        <section
          id="avantajlar"
          className="px-6 py-20 sm:px-10 sm:py-28"
        >
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={
                liteMotion
                  ? { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
                  : { type: "spring", damping: 34, stiffness: 200 }
              }
              className="mx-auto max-w-2xl text-center"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2563eb]/90">
                {t.advantagesSection.eyebrow}
              </p>
              <h2 className="mt-3 break-words text-2xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
                {t.advantagesSection.title}
              </h2>
            </motion.div>

            <div
              className="relative mt-14 md:mt-16"
              onPointerMove={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                const x = ((event.clientX - rect.left) / rect.width) * 100;
                const y = ((event.clientY - rect.top) / rect.height) * 100;
                setBentoPointer({
                  x: Math.max(0, Math.min(100, x)),
                  y: Math.max(0, Math.min(100, y)),
                });
              }}
            >
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -inset-16 z-0 overflow-hidden blur-3xl"
              >
                <motion.div
                  className="absolute h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.26)_0%,rgba(59,130,246,0.14)_35%,transparent_72%)]"
                  animate={{
                    left: `${bentoPointer.x}%`,
                    top: `${bentoPointer.y}%`,
                    x: "-50%",
                    y: "-50%",
                  }}
                  transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.div
                  className="absolute h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.2)_0%,rgba(14,165,233,0.14)_42%,transparent_72%)]"
                  animate={{
                    left: `${100 - bentoPointer.x * 0.82}%`,
                    top: `${100 - bentoPointer.y * 0.78}%`,
                    x: "-50%",
                    y: "-50%",
                  }}
                  transition={{ duration: 1.7, ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.div>

              <motion.ul
                className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8"
                variants={bentoContainerActive}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
              >
                {advantageIcons.map((Icon, index) => {
                  const { title, body } = t.advantages[index];
                  const className = advantageLayoutClasses[index];
                  const iconClass = advantageAccentClasses[index];
                  return (
                    <motion.li
                      key={`adv-${index}`}
                      variants={bentoCardActive}
                      whileTap={{ scale: 0.98 }}
                      className={`group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-6 backdrop-blur-lg transition-all duration-300 ease-out sm:p-8 lg:p-12 md:hover:-translate-y-1 md:hover:border-transparent [@media(hover:hover)]:md:hover:shadow-[0_0_0_1px_rgba(167,139,250,0.26),0_0_34px_-10px_rgba(147,51,234,0.45),0_0_44px_-18px_rgba(59,130,246,0.42)] ${className}`}
                    >
                      <div
                        className="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-[radial-gradient(120%_95%_at_15%_8%,rgba(139,92,246,0.16),transparent_52%),radial-gradient(120%_110%_at_88%_100%,rgba(59,130,246,0.15),transparent_64%)] opacity-85 transition-opacity duration-300 [@media(hover:hover)]:md:group-hover:opacity-100"
                        aria-hidden
                      />
                      <div
                        className="pointer-events-none absolute inset-0 rounded-[1.75rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                        aria-hidden
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] opacity-0 transition-opacity duration-300 [@media(hover:hover)]:md:group-hover:opacity-100">
                        <div className="absolute inset-0 rounded-[1.75rem] border border-violet-400/40" />
                      </div>

                      <div className="relative flex h-full flex-col">
                        <div
                          className={`mb-8 flex h-14 w-14 items-center justify-center rounded-full ring-1 transition-colors duration-300 ${iconClass}`}
                        >
                          <Icon className="h-6 w-6" strokeWidth={2} aria-hidden />
                        </div>
                        <h3 className="break-words text-xl font-semibold tracking-tight text-white/90 md:text-2xl">
                          {title}
                        </h3>
                        <p className="mt-4 max-w-[38ch] break-words text-base leading-relaxed text-zinc-400 md:mt-5 md:text-lg">
                          {body}
                        </p>
                      </div>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-[#050505]/95">
        <div className="mx-auto max-w-7xl px-6 py-8 sm:px-10">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex min-w-0 flex-wrap items-center gap-2.5 text-sm text-zinc-300">
              <AnselLogoMark muted size="sm" />
              <span className="font-medium text-zinc-200">Ansel AI</span>
              <span className="break-words text-zinc-500">{t.footer.tagline}</span>
            </div>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="touch-manipulation text-sm text-zinc-400 transition-colors active:text-zinc-100 [@media(hover:hover)]:md:hover:text-zinc-200"
            >
              {CONTACT_EMAIL}
            </a>
            <nav className="flex items-center gap-2.5" aria-label={t.footer.socialAria}>
              {(
                [
                  {
                    href: "https://www.linkedin.com/company/anselvoice",
                    label: "LinkedIn",
                    Icon: IconLinkedIn,
                  },
                  {
                    href: "https://www.instagram.com/anselvoice",
                    label: "Instagram",
                    Icon: IconInstagram,
                  },
                  {
                    href: "https://www.youtube.com/@anselvoice",
                    label: "YouTube",
                    Icon: IconYoutube,
                  },
                ] as const
              ).map(({ href, label, Icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={{ scale: 0.95 }}
                  aria-label={label}
                  className="flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-md text-zinc-500 transition-colors active:text-zinc-200 [@media(hover:hover)]:md:hover:text-zinc-200"
                >
                  <Icon className="h-4.5 w-4.5" />
                </motion.a>
              ))}
            </nav>
          </div>
          <div className="mt-5 flex flex-col items-start justify-between gap-2 border-t border-white/10 pt-4 text-xs text-zinc-500 md:flex-row md:items-center">
            <div className="flex flex-wrap items-center gap-3">
              <a href={t.footer.kvkkHref} target="_blank" rel="noopener noreferrer" className="touch-manipulation py-2 transition-colors active:text-zinc-200 [@media(hover:hover)]:md:hover:text-zinc-300">{t.footer.kvkkLink}</a>
              <a href={t.footer.privacyHref} target="_blank" rel="noopener noreferrer" className="touch-manipulation py-2 transition-colors active:text-zinc-200 [@media(hover:hover)]:md:hover:text-zinc-300">{t.footer.privacyLink}</a>
              <a href={t.footer.cookiesHref} target="_blank" rel="noopener noreferrer" className="touch-manipulation py-2 transition-colors active:text-zinc-200 [@media(hover:hover)]:md:hover:text-zinc-300">{t.footer.cookiesLink}</a>
            </div>
            <p>{t.footer.copyright}</p>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            key="iphone-mockup-modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]"
            onClick={() => setModalOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
          >
            <div className="pointer-events-none flex w-full max-w-full flex-col items-center justify-center overflow-x-hidden px-1">
              <div className="relative w-full max-w-[min(100vw-1.5rem,300px)] shrink-0 origin-top [transform:translateZ(0)] max-[480px]:scale-[min(1,calc((100vw-2.5rem)/318))]">
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="call-modal-title"
                  lang={locale}
                  onClick={(e) => e.stopPropagation()}
                  initial={{ opacity: 0, y: 20, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="pointer-events-auto relative mx-auto flex h-[min(638px,90vh)] w-full max-h-[90vh] min-h-0 flex-col overflow-visible rounded-[3.15rem] border-2 border-[#f97316] bg-[linear-gradient(155deg,#fdba74_0%,#fb923c_22%,#f97316_48%,#ea580c_74%,#c2410c_100%)] p-px shadow-[0_12px_38px_-16px_rgba(249,115,22,0.55)] before:pointer-events-none before:absolute before:inset-y-10 before:left-px before:w-px before:rounded-full before:bg-gradient-to-b before:from-transparent before:via-[#ffedd5] before:to-transparent before:content-[''] after:pointer-events-none after:absolute after:inset-y-10 after:right-px after:w-px after:rounded-full after:bg-gradient-to-b after:from-transparent after:via-[#ffedd5] after:to-transparent after:content-['']"
                >
              <div
                className="absolute z-50 -left-[5px] top-[164px] h-[28px] w-[3.5px] rounded-l-[2px] rounded-r-[1px] bg-[linear-gradient(180deg,#fed7aa_0%,#fb923c_35%,#ea580c_72%,#9a3412_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_1px_rgba(127,29,29,0.45),2px_2px_5px_rgba(234,88,12,0.35)]"
                aria-hidden
              />
              <div
                className="absolute z-50 -left-[5px] top-[218px] h-[40px] w-[3.5px] rounded-l-[2px] rounded-r-[1px] bg-[linear-gradient(180deg,#fed7aa_0%,#fb923c_35%,#ea580c_72%,#9a3412_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_1px_rgba(127,29,29,0.45),2px_2px_5px_rgba(234,88,12,0.35)]"
                aria-hidden
              />
              <div
                className="absolute z-50 -left-[5px] top-[268px] h-[40px] w-[3.5px] rounded-l-[2px] rounded-r-[1px] bg-[linear-gradient(180deg,#fed7aa_0%,#fb923c_35%,#ea580c_72%,#9a3412_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_1px_rgba(127,29,29,0.45),2px_2px_5px_rgba(234,88,12,0.35)]"
                aria-hidden
              />
              <div
                className="absolute z-50 -right-[5px] top-[218px] h-[60px] w-[3.5px] rounded-l-[1px] rounded-r-[2px] bg-[linear-gradient(180deg,#fed7aa_0%,#fb923c_35%,#ea580c_72%,#9a3412_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_1px_rgba(127,29,29,0.45),-2px_2px_5px_rgba(234,88,12,0.35)]"
                aria-hidden
              />

              <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-[calc(3.15rem-3px)] bg-[radial-gradient(100%_74%_at_50%_14%,rgba(18,31,50,0.75)_0%,rgba(4,8,14,0.96)_52%,rgba(0,0,0,1)_100%)] shadow-[inset_0_0_0_1px_rgba(17,24,35,0.92),inset_0_0_28px_rgba(0,0,0,0.55)]">
                <div className="pointer-events-none absolute inset-0 rounded-[calc(3.15rem-3px)] bg-[radial-gradient(75%_52%_at_18%_6%,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_55%)]" />
                <div className="absolute top-2.5 left-1/2 z-20 h-7 w-24 -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,#080808_0%,#111111_52%,#050505_100%)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),inset_0_-1px_1px_rgba(0,0,0,0.75)]">
                  <div className="absolute left-1/2 top-1/2 h-[4px] w-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/70" />
                  <div className="absolute right-[13px] top-1/2 h-[6px] w-[6px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(119,160,235,0.7)_0%,rgba(37,63,112,0.5)_38%,rgba(5,9,18,0.92)_72%)] shadow-[inset_0_0_0_0.5px_rgba(115,145,210,0.35)]">
                    <div className="absolute left-[2px] top-[1px] h-[1.5px] w-[1.5px] rounded-full bg-white/60" />
                  </div>
                </div>
                {postCallWizardOpen ? (
                  <PostCallLeadWizard
                    open={postCallWizardOpen}
                    onClose={() => {
                      setPostCallWizardOpen(false);
                      setModalOpen(false);
                      setPostCallWizardPhone("");
                    }}
                    initialPhone={postCallWizardPhone}
                    labels={t.postCall}
                    locale={locale}
                    liteMotion={liteMotion}
                    isMobile={isMobile}
                    inPhone
                  />
                ) : selectedPresetId ? (
                  <div className="relative z-30 flex min-h-0 w-full min-w-0 flex-1 flex-col">
                    <div
                      className="grid shrink-0 grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center gap-x-1.5 gap-y-1 px-2 pb-3"
                      style={{
                        /* Dynamic Island (~38px) + nefes payı; taşmayı önler */
                        paddingTop:
                          "max(4rem, calc(2.625rem + env(safe-area-inset-top, 0px)))",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPresetId(null);
                          setSystemPrompt("");
                          setFieldErrors({});
                          setCallBanner(null);
                        }}
                        className="flex size-10 shrink-0 touch-manipulation items-center justify-center self-center rounded-full border border-white/25 bg-black/45 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_22px_-12px_rgba(0,0,0,0.85)] backdrop-blur-sm transition-colors active:bg-black/55 [@media(hover:hover)]:md:hover:bg-black/60"
                        aria-label={t.modal.goBack}
                      >
                        <ArrowLeft className="h-5 w-5" aria-hidden />
                      </button>
                      <h2
                        id="call-modal-title"
                        className="min-w-0 max-w-full hyphens-auto px-0.5 text-center font-serif text-[0.92rem] font-medium leading-snug text-white sm:text-[1.05rem]"
                      >
                        <span className="block break-words [overflow-wrap:anywhere]">
                          {activePreset?.label}
                        </span>
                      </h2>
                      <p className="flex shrink-0 items-center justify-end self-center font-serif text-sm font-medium tabular-nums leading-none text-white/90 sm:text-base">
                        2/2
                      </p>
                    </div>
                    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 pb-28 pt-2 scrollbar-hide sm:px-5">
                      <div className="flex min-h-full w-full flex-col justify-center">
                        <form
                          onSubmit={handleCallSubmit}
                          className="mx-auto flex w-full max-w-[280px] flex-col gap-2.5 sm:max-w-[min(100%,300px)]"
                        >
                        {selectedPresetId === "custom" ? (
                          <>
                            <label className="sr-only" htmlFor="modal-assistant-prompt">
                              {t.modal.labelPrompt}
                            </label>
                            <textarea
                              ref={promptInputRef}
                              id="modal-assistant-prompt"
                              value={systemPrompt}
                              onChange={(e) => setSystemPrompt(e.target.value)}
                              placeholder={t.modal.placeholderPrompt}
                              rows={5}
                              className="scrollbar-hide max-h-[min(220px,38vh)] min-h-[100px] w-full resize-y rounded-lg border border-white/10 bg-[#101826] px-3.5 py-2.5 text-base leading-relaxed text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-white/25"
                            />
                            {fieldErrors.prompt ? (
                              <p className="text-center text-sm text-red-300">
                                {fieldErrors.prompt}
                              </p>
                            ) : null}
                          </>
                        ) : null}
                        <input
                          ref={nameInputRef}
                          type="text"
                          value={callerName}
                          onChange={(e) => setCallerName(e.target.value)}
                          placeholder={t.postCall.firstNamePlaceholder}
                          className="w-full rounded-lg border border-white/10 bg-[#101826] px-3.5 py-2.5 text-base text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-white/25"
                          autoComplete="name"
                        />
                        {fieldErrors.name ? (
                          <p className="text-center text-sm text-red-300">
                            {fieldErrors.name}
                          </p>
                        ) : null}
                        <input
                          ref={phoneInputRef}
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder={t.modal.placeholderPhone}
                          className="w-full rounded-lg border border-white/10 bg-[#101826] px-3.5 py-2.5 text-base text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-white/25"
                          autoComplete="tel"
                        />
                        {fieldErrors.phone ? (
                          <p className="text-center text-sm text-red-300">
                            {fieldErrors.phone}
                          </p>
                        ) : null}
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="mt-1 flex min-h-11 touch-manipulation w-full items-center justify-center rounded-lg bg-white py-2.5 text-lg font-semibold text-black transition-colors active:bg-zinc-300 [@media(hover:hover)]:md:hover:bg-zinc-200 disabled:opacity-70"
                        >
                          {isLoading ? t.modal.submitting : t.modal.submit}
                        </button>
                        {callBanner ? (
                          <div
                            role="status"
                            aria-live="polite"
                            className={
                              callBanner.variant === "success"
                                ? "mt-2 rounded-xl border border-emerald-400/25 bg-gradient-to-b from-emerald-950/45 to-black/35 px-3 py-2.5 text-center text-[13px] leading-snug text-emerald-50/95 shadow-[inset_0_1px_0_rgba(52,211,153,0.12),0_8px_28px_-12px_rgba(6,78,59,0.45)]"
                                : callBanner.variant === "limit"
                                  ? "mt-2 rounded-xl border border-amber-400/45 bg-gradient-to-b from-amber-950/55 via-black/40 to-black/55 px-3 py-2.5 text-center text-[13px] font-medium leading-snug tracking-[0.01em] text-amber-50/95 shadow-[inset_0_1px_0_rgba(251,191,36,0.18),0_10px_36px_-14px_rgba(180,83,9,0.55)] ring-1 ring-amber-500/15"
                                  : "mt-2 rounded-xl border border-red-400/30 bg-red-950/35 px-3 py-2.5 text-center text-[13px] leading-snug text-red-200/95"
                            }
                          >
                            {callBanner.message}
                          </div>
                        ) : null}
                        </form>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative z-30 flex min-h-0 w-full min-w-0 flex-1 flex-col">
                    <div
                      className="flex shrink-0 justify-end px-4 pb-2"
                      style={{
                        paddingTop:
                          "max(4rem, calc(2.625rem + env(safe-area-inset-top, 0px)))",
                      }}
                    >
                      <p className="font-serif text-lg font-medium tabular-nums text-white/90">
                        1/2
                      </p>
                    </div>
                    <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto overscroll-contain px-4 pb-28 pt-1 scrollbar-hide sm:px-5">
                      <h2
                        id="call-modal-title"
                        className="mb-5 max-w-[min(100%,280px)] hyphens-auto px-1 text-center font-serif text-[clamp(1.25rem,4.8vw+0.6rem,1.75rem)] leading-snug text-white sm:mb-7 sm:text-3xl"
                      >
                        {t.modal.scenarioTitle}
                      </h2>

                      <div className="flex w-full max-w-[280px] flex-col gap-3 sm:max-w-[min(100%,300px)]">
                        {t.presets.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setSystemPrompt(p.prompt);
                              setSelectedPresetId(p.id);
                              setCallBanner(null);
                              setFieldErrors({});
                            }}
                            className="flex min-h-11 touch-manipulation w-full items-center justify-center whitespace-normal rounded-xl bg-white px-2.5 py-2.5 text-center text-[0.88rem] font-semibold leading-snug text-black shadow-md transition-colors duration-300 active:bg-zinc-300 sm:text-[0.95rem] [@media(hover:hover)]:md:hover:bg-zinc-200"
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex flex-col items-center justify-end bg-gradient-to-t from-black/65 via-black/25 to-transparent pb-3 pt-8"
                  aria-hidden
                >
                  <div className="h-[4px] w-[min(38%,120px)] rounded-full bg-white/45 shadow-[0_1px_0_rgba(255,255,255,0.22),0_4px_12px_rgba(0,0,0,0.55)] ring-1 ring-white/15" />
                </div>
              </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
