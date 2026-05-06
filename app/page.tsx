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
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BrainCircuit,
  Check,
  ChevronDown,
  Clock,
  HeartPulse,
  Globe,
  House,
  Mail,
  Menu,
  Mic,
  Phone,
  ShoppingCart,
  ShieldCheck,
  TrendingUp,
  X,
} from "lucide-react";
import { AnselLogoMark } from "./components/AnselLogoMark";
import { AuroraPlasmaCanvas } from "./components/AuroraPlasmaCanvas";
import { AudioWaveform } from "./components/AudioWaveform";

import type { PostCallWizardLabels } from "./components/PostCallLeadWizard";
import { PostCallLeadWizard } from "./components/PostCallLeadWizard";

const CONTACT_EMAIL = "hello@anselvoice.com";
const WEBSITE_URL = "www.anselvoice.com";

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

type Locale = "tr" | "en" | "de";
type DemoSector = "ecommerce" | "realestate" | "health";

const translations = {
  tr: {
    nav: {
      demoCta: "Demo Başlat",
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
      cta: "Asistanlara Hazır Mısınız?",
    },
    trustStrip: "Modern Altyapı ve Kesintisiz Entegrasyon",
    advantagesSection: {
      eyebrow: "Kurumsal avantajlar",
      title: "Ses operasyonunuzu bir üst lig taşıyın",
    },
    advantages: [
      {
        title: "7/24 Kesintisiz Operasyon",
        body: "Mesai saatleri dışında bile tüm çağrıları yanıtlayıp sıfır bekleme süresiyle otomatik randevu oluşturun.",
      },
      {
        title: "Duygu Analizi ve Doğallık",
        body: "Müşterilerinizin ses tonunu analiz ederek empati kuran, insan doğallığında bir yapay zeka.",
      },
      {
        title: "Sınırsız Ölçeklenebilirlik",
        body: "Aynı anda ister 10, ister 10.000 çağrıyı santral kilitlenmeden anında karşılayın.",
      },
      {
        title: "Maliyet Tasarrufu",
        body: "Geleneksel çağrı merkezi maliyetlerinizi kaliteden ödün vermeden %80 oranında düşürün.",
      },
    ],
    footer: {
      copyright: "Copyright © 2026 Ansel AI",
      socialAria: "Ansel AI sosyal baglantilar",
    },
    modal: {
      closeBackdrop: "Pencereyi kapat",
      close: "Kapat",
      eyebrow: "Premium demo · Sesli asistan",
      title: "Üç adımda canlı test",
      description:
        "Rol sablonu secin, karakterinizi yazin; ardindan uluslararasi formatta telefonunuzu girerek Ansel AI'nin sizi aramasini saglayin.",
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
      quickTemplates: "Şık şablonlar",
      labelPrompt: "Asistanınızın karakteri",
      labelPhone: "Telefon numarası",
      placeholderPrompt:
        "Örn: Sen bir İngilizce öğretmenisin, benimle pratik yap...",
      placeholderPhone: "+905551234567",
      submit: "Aramayı Başlat",
      submitting: "Aranıyor...",
      presetApplying: "Yapay zeka kişiliği güncelleniyor...",
    },
    alerts: {
      callFailed: "Arama başlatılamadı, lütfen bilgilerinizi kontrol edin",
      callStarted: "Arama başlatıldı, lütfen telefonunuzu kontrol edin",
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
        "Lütfen Yapay Zeka Asistan/Otomasyon Talebinizi Anlatınız",
      projectPlaceholder: "Projenizi kısaca açıklayınız",
      contactTitlePrefix: "Son bir adım kaldı, ",
      contactTitleSuffix: " Bey!",
      phonePlaceholder: "Telefon Numaranız",
      callbackPlaceholder: "Sizi ne zaman arayalım?",
      callbackMorning: "Öğleden önce",
      callbackAfternoon: "Öğleden sonra",
      consentContact:
        "Telefon numaram uzerinden Ansel AI ekibinin benimle iletisime gecmesine izin veriyorum.",
      consentKvkk:
        "KVKK Aydınlatma Metni ve Gizlilik Politikası'nı okudum, verilerimin bu kapsamda işlenmesini kabul ediyorum.",
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
      "Arayüz dili Türkçe seçildi. Bu telefon görüşmesinin tamamında YALNIZCA Türkçe konuş.",
      "Başka dil kullanma; kullanıcı açıkça başka dil istemedikçe asla dil değiştirme.",
      "Doğal, akıcı, ana dil konuşuru gibi konuş; çeviri kokusu verme.",
      "",
      "SES VE SUNUM",
      "Kadın sesiyle, sıcak, net ve güven veren bir kurumsal temsilci tonu kullan.",
      "Cümleleri tam bitir, gereksiz acele etme; profesyonel çağrı merkezi kalitesinde konuş.",
      "",
      "KALİTE",
      "Kibar, empatik ve çözüm odaklı ol; kısa filler kullan ama robotik olma.",
      "Dinlediğini göster, gerektiğinde net şekilde özetle ve doğrula.",
    ].join("\n"),
    presets: [
      {
        id: "language",
        label: "💬 Dil öğrenme partneri",
        prompt:
          "Sen bir İngilizce pratik partnerisin, benimle dostane bir şekilde sohbet et ve hatalarımı düzelt.",
      },
      {
        id: "ecom",
        label: "🛒 E‑ticaret destek",
        prompt:
          "Sen profesyonel bir destek temsilcisisin. İade ve kargo süreçlerinde yardımcı ol.",
      },
      {
        id: "clinic",
        label: "🩺 Klinik sekreteri",
        prompt:
          "Sen bir diş kliniği asistanısın. Nazikçe randevu taleplerini al.",
      },
    ],
  },
  en: {
    nav: {
      demoCta: "Start demo",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      mobileMenuHint: "Change language from the menu in the top bar.",
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
        "Transform your operations with intelligent voice agents that hold natural dialogues with your customers.",
      cta: "Ready for your assistants?",
    },
    trustStrip: "Modern infrastructure · Seamless integration",
    advantagesSection: {
      eyebrow: "Enterprise advantages",
      title: "Elevate your voice operations",
    },
    advantages: [
      {
        title: "Always‑on operations",
        body: "Answer every call—even after hours—with zero queue time and automated scheduling.",
      },
      {
        title: "Sentiment intelligence & natural tone",
        body: "Interpret vocal cues to respond with empathy while maintaining a consistently human cadence.",
      },
      {
        title: "Elastic scalability",
        body: "Handle 10 or 10,000 concurrent calls without PBX bottlenecks or provisioning delays.",
      },
      {
        title: "Cost optimization",
        body: "Reduce traditional contact‑center spend by up to 80% without sacrificing quality.",
      },
    ],
    footer: {
      copyright: "Copyright © 2026 Ansel AI",
      socialAria: "Ansel AI social links",
    },
    modal: {
      closeBackdrop: "Close dialog",
      close: "Close",
      eyebrow: "Premium demo · Voice assistant",
      title: "Live test in three steps",
      description:
        "Pick a role template, refine your persona, then enter your phone in international format for Ansel AI to call you.",
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
      quickTemplates: "Curated templates",
      labelPrompt: "Your assistant persona",
      labelPhone: "Phone number",
      placeholderPrompt:
        "e.g., You are an English tutor—practice conversation with me…",
      placeholderPhone: "+14155552671",
      submit: "Start call",
      submitting: "Calling…",
      presetApplying: "Updating AI persona…",
    },
    alerts: {
      callFailed: "Could not start the call—please verify your details",
      callStarted: "Call initiated—please check your phone",
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
        "I have read the privacy notice and privacy policy and agree to the processing of my data accordingly.",
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
      "The UI language is English. Speak ONLY English for this entire phone call.",
      "Do not switch languages unless the caller explicitly asks for another language.",
      "Sound natural and fluent, like a native professional—not translated or stiff.",
      "",
      "VOICE AND DELIVERY",
      "Use a warm, clear female professional voice—premium brand representative quality.",
      "Complete sentences at an easy pace; sound polished, not rushed or robotic.",
      "",
      "QUALITY",
      "Be courteous, empathetic, and solution-oriented; acknowledge and clarify when needed.",
    ].join("\n"),
    presets: [
      {
        id: "language",
        label: "💬 Language learning partner",
        prompt:
          "You are an English practice partner. Chat with me in a friendly way and gently correct my mistakes.",
      },
      {
        id: "ecom",
        label: "🛒 E‑commerce support",
        prompt:
          "You are a professional support representative. Help with returns and shipping processes.",
      },
      {
        id: "clinic",
        label: "🩺 Clinic secretary",
        prompt:
          "You are a dental clinic assistant. Politely handle appointment requests.",
      },
    ],
  },
  de: {
    nav: {
      demoCta: "Demo starten",
      openMenu: "Menü öffnen",
      closeMenu: "Menü schließen",
      mobileMenuHint:
        "Sprache wählen Sie über das Menü in der oberen Leiste.",
    },
    lang: {
      switcherAria: "Sprache wählen",
      tr: "TR",
      en: "EN",
      de: "DE",
    },
    hero: {
      title: "Entdecken Sie mit Ansel AI die Kraft von Voice-KI.",
      subtitle:
        "Transformieren Sie Ihre Prozesse mit intelligenten Voice‑Agents, die natürliche Dialoge mit Ihren Kunden führen.",
      cta: "Bereit für Ihre Assistenten?",
    },
    trustStrip: "Moderne Infrastruktur · Nahtlose Integration",
    advantagesSection: {
      eyebrow: "Enterprise‑Vorteile",
      title: "Heben Sie Ihre Voice‑Operations auf das nächste Level",
    },
    advantages: [
      {
        title: "Ununterbrochener 24/7‑Betrieb",
        body: "Beantworten Sie jeden Anruf — auch außerhalb der Bürozeiten — ohne Wartezeit und mit automatisierter Terminierung.",
      },
      {
        title: "Sentiment‑Analyse & Natürlichkeit",
        body: "Werten Sie die Stimmlage aus und antworten Sie empathisch — mit menschlich wirkender Gesprächsführung.",
      },
      {
        title: "Unbegrenzte Skalierbarkeit",
        body: "Verarbeiten Sie parallel 10 oder 10.000 Anrufe — ohne Zentralen‑Engpässe oder Wartezeiten.",
      },
      {
        title: "Kostenoptimierung",
        body: "Senken Sie klassische Contact‑Center‑Kosten bei gleichbleibender Qualität um bis zu 80 %.",
      },
    ],
    footer: {
      copyright: "Copyright © 2026 Ansel AI",
      socialAria: "Ansel AI in sozialen Netzwerken",
    },
    modal: {
      closeBackdrop: "Dialog schließen",
      close: "Schließen",
      eyebrow: "Premium‑Demo · Sprachassistent",
      title: "Live‑Test in drei Schritten",
      description:
        "Wahlen Sie eine Rolle, verfeinern Sie die Personlichkeit, geben Sie Ihre Nummer im internationalen Format ein - Ansel AI ruft Sie an.",
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
      quickTemplates: "Vorlagen",
      labelPrompt: "Persönlichkeit des Assistenten",
      labelPhone: "Telefonnummer",
      placeholderPrompt:
        "z. B.: Du bist ein Englischlehrer — übe mit mir Gespräche…",
      placeholderPhone: "+493012345678",
      submit: "Anruf starten",
      submitting: "Wird verbunden…",
      presetApplying: "KI‑Persönlichkeit wird aktualisiert…",
    },
    alerts: {
      callFailed:
        "Anruf konnte nicht gestartet werden — bitte Daten prüfen",
      callStarted: "Anruf gestartet — bitte Telefon prüfen",
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
        "Bitte beschreiben Sie Ihr KI-Assistenten- / Automatisierungsanliegen",
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
        "Ich habe die Datenschutzhinweise gelesen und stimme der Verarbeitung meiner Daten zu.",
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
      "Die Oberfläche ist auf Deutsch. Sprich in diesem gesamten Telefonat AUSSCHLIESSLICH Deutsch.",
      "Wechsle nicht die Sprache, es sei denn, der Anrufer fordert es ausdrücklich.",
      "Natürlich und flüssig wie eine deutschsprachige Muttersprachlerin—nicht übersetzt oder steif.",
      "",
      "STIMME UND AUFTITTEN",
      "Weibliche, warme, klare Stimme—wie eine professionelle Markenvertreterin Premium‑Niveau.",
      "Sätze ruhig zu Ende führen; professionell, nicht gehetzt und nicht roboterhaft.",
      "",
      "QUALITÄT",
      "Höflich, einfühlsam und lösungsorientiert; aktiv zuhören und bei Bedarf zusammenfassen.",
    ].join("\n"),
    presets: [
      {
        id: "language",
        label: "💬 Sprachlern‑Partner",
        prompt:
          "Du bist ein Englisch‑Übungspartner. Unterhalte dich freundlich mit mir und korrigiere meine Fehler.",
      },
      {
        id: "ecom",
        label: "🛒 E‑Commerce‑Support",
        prompt:
          "Du bist ein professioneller Support‑Mitarbeiter. Hilf bei Retouren und Versandabläufen.",
      },
      {
        id: "clinic",
        label: "🩺 Praxissekretariat",
        prompt:
          "Du bist eine Assistenz in einer Zahnarztpraxis. Nimm Terminwünsche freundlich entgegen.",
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

/** Mobil: alt sayfa (bottom sheet) */
const bottomSheetVariants = {
  hidden: {
    opacity: 0,
    y: "100%",
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 34,
      stiffness: 400,
      mass: 0.62,
    },
  },
  exit: {
    opacity: 0.98,
    y: "100%",
    transition: { duration: 0.26, ease: [0.4, 0, 1, 1] as const },
  },
};

const bottomSheetVariantsLite = {
  hidden: { opacity: 0, y: "100%" },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    y: "100%",
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] as const },
  },
};

const PRESET_EMOJI = {
  language: "💬",
  ecom: "🛒",
  clinic: "🩺",
} as const;

type PresetId = keyof typeof PRESET_EMOJI;

const LOCALE_STORAGE_KEY = "ansel-locale";
const DEMO_CALL_COUNT_KEY = "ansel-demo-call-count";
const DEMO_CALL_MAX = 2;
const CLIENT_WHITELISTED_TEST_PHONES = new Set(["905365575190"]);
const LIMIT_TOAST_MESSAGE =
  "Güvenlik Önlemi: Demo arama limitinize (2/2) ulaştınız. Daha fazlası için lütfen satış ekibimizle görüşün.";

/** Tarayıcı dilini otomatik uygulama — çoğu kullanıcıda OS İngilizce olduğu için yanlışlıkla EN araması tetikleniyordu. */

const advantageIcons = [Clock, BrainCircuit, TrendingUp, ShieldCheck] as const;
const DEMO_SECTOR_PROMPTS: Record<DemoSector, string> = {
  ecommerce:
    "Sen bir e-ticaret uzmanısın. Stok takibi, sipariş durumu ve kampanya yönetimi konularında uzmanlaşmış bir asistansın.",
  realestate:
    "Sen bir emlak uzmanısın. Potansiyel alıcıları filtreleme ve ev gösterimi için randevu oluşturma konusunda uzmansın.",
  health:
    "Sen bir klinik asistanısın. Hasta gizliliğine önem veren, randevu takvimi yöneten ve nezaketle soruları yanıtlayan birisin.",
};

const DEMO_SECTOR_OPTIONS: ReadonlyArray<{
  id: DemoSector;
  label: string;
  Icon: typeof ShoppingCart;
}> = [
  { id: "ecommerce", label: "E-Ticaret", Icon: ShoppingCart },
  { id: "realestate", label: "Gayrimenkul", Icon: House },
  { id: "health", label: "Sağlık", Icon: HeartPulse },
] as const;

const advantageLayoutClasses = [
  "min-h-[220px] md:min-h-[240px] xl:min-h-[260px]",
  "min-h-[220px] md:min-h-[240px] xl:min-h-[260px]",
  "min-h-[220px] md:min-h-[240px] xl:min-h-[260px]",
  "min-h-[220px] md:min-h-[240px] xl:min-h-[260px]",
] as const;

const advantageAccentClasses = [
  "bg-violet-500/10 text-violet-300 ring-violet-400/35 group-hover:bg-violet-500/16 group-hover:text-violet-200 group-hover:ring-violet-400/50",
  "bg-blue-500/10 text-blue-300 ring-blue-400/35 group-hover:bg-blue-500/16 group-hover:text-blue-200 group-hover:ring-blue-400/50",
  "bg-fuchsia-500/10 text-fuchsia-300 ring-fuchsia-400/35 group-hover:bg-fuchsia-500/16 group-hover:text-fuchsia-200 group-hover:ring-fuchsia-400/50",
  "bg-cyan-500/10 text-cyan-300 ring-cyan-400/35 group-hover:bg-cyan-500/16 group-hover:text-cyan-200 group-hover:ring-cyan-400/50",
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
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-xl transition-colors hover:bg-white/[0.09]"
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
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide transition-colors ${locale === code ? "bg-white/[0.08] text-white" : "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-100"}`}
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

export default function Home() {
  const [locale, setLocale] = useState<Locale>("tr");
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
  const bottomSheetActive =
    liteMotion ? bottomSheetVariantsLite : bottomSheetVariants;

  const [uiFadeIn, setUiFadeIn] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [keyboardInset, setKeyboardInset] = useState(0);

  const promptInputRef = useRef<HTMLTextAreaElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const modalScrollRef = useRef<HTMLDivElement>(null);
  const [phone, setPhone] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [demoSector, setDemoSector] = useState<DemoSector | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(
    null,
  );
  const [fieldErrors, setFieldErrors] = useState<{
    prompt?: string;
    phone?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [callBanner, setCallBanner] = useState<{
    variant: "success" | "error";
    message: string;
  } | null>(null);

  const [watermarkEmoji, setWatermarkEmoji] = useState<string | null>(null);
  const [presetApplyingVisible, setPresetApplyingVisible] = useState(false);
  const [focusPrompt, setFocusPrompt] = useState(false);
  const [focusPhone, setFocusPhone] = useState(false);
  const [submitRipples, setSubmitRipples] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const [postCallWizardOpen, setPostCallWizardOpen] = useState(false);
  const [postCallWizardPhone, setPostCallWizardPhone] = useState("");
  const [demoCallCount, setDemoCallCount] = useState(0);
  const [limitToast, setLimitToast] = useState<string | null>(null);
  const normalizedPhoneForLimit = phone.replace(/\D/g, "");
  const isWhitelistedPhone = CLIENT_WHITELISTED_TEST_PHONES.has(
    normalizedPhoneForLimit,
  );
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

  const watermarkClearRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const presetToastClearRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (saved === "tr" || saved === "en" || saved === "de") {
        setLocale(saved);
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

  useEffect(() => {
    if (!limitToast) return;
    const tId = window.setTimeout(() => setLimitToast(null), 4200);
    return () => window.clearTimeout(tId);
  }, [limitToast]);

  useEffect(
    () => () => {
      if (watermarkClearRef.current) {
        clearTimeout(watermarkClearRef.current);
      }
      if (presetToastClearRef.current) {
        clearTimeout(presetToastClearRef.current);
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
    if (!demoSector) return;
    setSystemPrompt(DEMO_SECTOR_PROMPTS[demoSector]);
    setSelectedPresetId(null);
    setFieldErrors((err) => ({ ...err, prompt: undefined }));
  }, [demoSector]);

  useEffect(() => {
    if (!selectedPresetId) return;
    const preset = translations[locale].presets.find(
      (p) => p.id === selectedPresetId,
    );
    if (preset) setSystemPrompt(preset.prompt);
  }, [locale, selectedPresetId]);

  async function handleCallSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCallBanner(null);
    if (!isWhitelistedPhone && demoCallCount >= DEMO_CALL_MAX) {
      setLimitToast(LIMIT_TOAST_MESSAGE);
      return;
    }
    const trimmedPhone = phone.trim();
    const trimmedPrompt = systemPrompt.trim();

    const nextErrors: { prompt?: string; phone?: string } = {};
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
        const el = nextErrors.prompt
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
    const fullSystemPrompt = `${trimmedPrompt}\n\n${translations[callLocale].callSystemAugment}`;

    setFieldErrors({});
    setIsLoading(true);
    try {
      const tokenRes = await fetch("/api/call-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: trimmedPhone }),
      });

      if (!tokenRes.ok) {
        let msg = LIMIT_TOAST_MESSAGE;
        try {
          const data = (await tokenRes.json()) as { error?: unknown };
          if (typeof data?.error === "string" && data.error.trim()) {
            msg = data.error.trim();
          }
        } catch {
          /* ignore */
        }
        if (tokenRes.status === 429) {
          setLimitToast(msg);
          setCallBanner({ variant: "error", message: msg });
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

      const res = await fetch("/api/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: trimmedPhone,
          systemPrompt: fullSystemPrompt,
          locale: callLocale,
          sector: demoSector ?? undefined,
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
        if (res.status === 429) {
          setLimitToast(msg);
        }
        setCallBanner({ variant: "error", message: msg });
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
        setModalOpen(false);
        setPostCallWizardPhone(trimmedPhone);
        setPostCallWizardOpen(true);
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
      setPresetApplyingVisible(false);
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
    setModalOpen(true);
  }, []);

  const handleLocaleChange = useCallback((code: Locale) => {
    setMobileNavOpen(false);
    setLocale(code);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, code);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <motion.div
      className="relative min-h-[100dvh] overflow-x-hidden bg-black text-zinc-100 pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)]"
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
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="hidden truncate text-sm text-zinc-400 transition-colors hover:text-zinc-200 lg:inline lg:max-w-[240px]"
            >
              {CONTACT_EMAIL}
            </a>
            <LanguageDropdown
              locale={locale}
              onSelect={handleLocaleChange}
              ariaLabel={t.lang.switcherAria}
            />
            <motion.button
              type="button"
              onClick={openCallModal}
              whileTap={{ scale: 0.95 }}
              className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition-[background-color,box-shadow] md:hover:bg-white/[0.1] md:hover:shadow-[0_0_24px_-8px_rgba(147,51,234,0.4)]"
            >
              {t.nav.demoCta}
            </motion.button>
          </div>

          <div className="flex shrink-0 items-center gap-2 md:hidden">
            <LanguageDropdown
              locale={locale}
              onSelect={handleLocaleChange}
              ariaLabel={t.lang.switcherAria}
            />
            <motion.button
              type="button"
              onClick={openCallModal}
              whileTap={{ scale: 0.95 }}
              className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-100 backdrop-blur-xl"
            >
              {t.nav.demoCta}
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setMobileNavOpen((o) => !o)}
              whileTap={{ scale: 0.95 }}
              className="rounded-xl border border-white/10 bg-white/[0.06] p-2 text-zinc-200 backdrop-blur-xl"
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
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5 text-sm text-zinc-200 backdrop-blur-xl active:bg-white/[0.08]"
                onClick={() => setMobileNavOpen(false)}
              >
                <Mail className="h-4 w-4 shrink-0 text-[#60a5fa]" aria-hidden />
                <span className="truncate">{CONTACT_EMAIL}</span>
              </a>
              <p className="mt-4 text-xs leading-relaxed text-zinc-500">
                {t.nav.mobileMenuHint}
              </p>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <main className="relative z-10">
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
                      className={`group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-6 backdrop-blur-lg transition-all duration-300 ease-out sm:p-8 lg:p-12 md:hover:-translate-y-1 md:hover:border-transparent md:hover:shadow-[0_0_0_1px_rgba(167,139,250,0.26),0_0_34px_-10px_rgba(147,51,234,0.45),0_0_44px_-18px_rgba(59,130,246,0.42)] ${className}`}
                    >
                      <div
                        className="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-[radial-gradient(120%_95%_at_15%_8%,rgba(139,92,246,0.16),transparent_52%),radial-gradient(120%_110%_at_88%_100%,rgba(59,130,246,0.15),transparent_64%)] opacity-85 transition-opacity duration-300 md:group-hover:opacity-100"
                        aria-hidden
                      />
                      <div
                        className="pointer-events-none absolute inset-0 rounded-[1.75rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                        aria-hidden
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] opacity-0 transition-opacity duration-300 md:group-hover:opacity-100">
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

      <footer className="relative z-10 border-t border-white/10 bg-[#050505]/90 shadow-[0_-1px_0_0_rgba(147,51,234,0.12)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-12 sm:px-10">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-zinc-400">{t.footer.copyright}</p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-2 inline-flex items-center gap-2 text-sm text-sky-400/95 transition-colors hover:text-sky-300"
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden />
                {CONTACT_EMAIL}
              </a>
              <a
                href={`https://${WEBSITE_URL}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-sm text-zinc-500 md:hover:text-zinc-300"
              >
                {WEBSITE_URL}
              </a>
            </div>
            <nav
              className="flex items-center gap-3"
              aria-label={t.footer.socialAria}
            >
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
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-zinc-300 backdrop-blur-xl transition-colors md:hover:border-white/20 md:hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </nav>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              key="modal-backdrop-stack"
              className="fixed inset-0 z-[90]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
            >
              <motion.div
                className="absolute inset-0 bg-black/68 backdrop-blur-xl backdrop-saturate-150"
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              />
              <div
                className="pointer-events-none absolute inset-0 overflow-hidden"
                aria-hidden
              >
                {!isMobile ? (
                  <>
                    <motion.div
                      className="absolute -left-[20%] top-[8%] h-[85vmin] w-[85vmin] rounded-full bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.35),transparent_62%)] blur-3xl"
                      animate={{ x: 0, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                    <motion.div
                      className="absolute -right-[18%] bottom-[5%] h-[78vmin] w-[78vmin] rounded-full bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.32),transparent_60%)] blur-3xl"
                      animate={{ x: 0, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                    <motion.div
                      className="absolute left-[22%] bottom-[-12%] h-[62vmin] w-[62vmin] rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12),transparent_58%)] blur-3xl"
                      animate={{ x: 0, y: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_45%_at_50%_0%,rgba(37,99,235,0.12),transparent_60%)] opacity-90" />
                )}
              </div>
              <button
                type="button"
                aria-label={t.modal.closeBackdrop}
                className="absolute inset-0 z-10 cursor-default bg-transparent"
                onClick={() => setModalOpen(false)}
              />
            </motion.div>

            <div
              className={`pointer-events-none fixed inset-0 z-[100] flex w-full justify-center ${isMobile ? "items-end p-0" : "items-center p-4 sm:p-6"}`}
              style={isMobile ? undefined : { perspective: "1180px" }}
            >
              <div
                className={`pointer-events-auto flex w-full max-w-xl justify-center ${isMobile ? "" : "[transform-style:preserve-3d]"}`}
              >
                <motion.div
                  key="modal-panel"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="call-modal-title"
                  aria-describedby="call-modal-desc"
                  className={`relative w-full ${isMobile ? "max-h-[min(92dvh,920px)] rounded-none [transform-style:flat]" : "max-h-[min(90vh,840px)] [transform-style:preserve-3d]"}`}
                  variants={isMobile ? bottomSheetActive : modalPanelActive}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div
                    className={`relative overflow-hidden rounded-[inherit] p-[2px] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_42px_-6px_rgba(147,51,234,0.35),0_24px_80px_-24px_rgba(37,99,235,0.2),0_40px_100px_-32px_rgba(0,0,0,0.92)] ${isMobile ? "rounded-t-[1.35rem] rounded-b-none" : "rounded-[1.35rem]"}`}
                  >
                    <motion.div
                      className="pointer-events-none absolute left-1/2 top-1/2 h-[240%] w-[240%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(56,189,248,0.85)_52deg,transparent_120deg,rgba(147,51,234,0.8)_200deg,transparent_300deg)] opacity-80 max-md:opacity-50"
                      animate={{ rotate: 0 }}
                      transition={{ duration: 0.2 }}
                      aria-hidden
                    />
                    <motion.div
                      className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_30px_rgba(37,99,235,0.12)]"
                      animate={{ opacity: 0.4 }}
                      transition={{ duration: 0.2 }}
                      aria-hidden
                    />
                    <div
                      ref={modalScrollRef}
                      style={{
                        paddingBottom: isMobile
                          ? `calc(${keyboardInset}px + env(safe-area-inset-bottom, 0px))`
                          : undefined,
                      }}
                      className={`scrollbar-hide relative max-h-[min(88dvh,800px)] overflow-y-auto overflow-x-hidden overscroll-contain border border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl sm:max-h-[min(86vh,780px)] ${isMobile ? "rounded-t-[1.32rem] px-5 pb-6 pt-2" : "rounded-[1.32rem] p-8 sm:p-9"}`}
                    >
                      {isMobile ? (
                        <div className="flex justify-center pb-2" aria-hidden>
                          <div className="h-1 w-11 rounded-full bg-white/22" />
                        </div>
                      ) : null}
                      <AnimatePresence>
                        {watermarkEmoji ? (
                          <motion.div
                            key={watermarkEmoji}
                            initial={{ opacity: 0, scale: 0.82 }}
                            animate={{ opacity: 0.065, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.06 }}
                            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                            className="pointer-events-none absolute inset-0 z-0 flex select-none items-center justify-center text-[min(42vw,13rem)] leading-none sm:text-[13rem]"
                            aria-hidden
                          >
                            {watermarkEmoji}
                          </motion.div>
                        ) : null}
                      </AnimatePresence>

                      <div className="relative z-[1]">
                        <div
                          className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#2563eb] via-sky-400 to-[#9333ea]"
                          aria-hidden
                        />
                        <div
                          className="pointer-events-none absolute -top-32 left-1/2 h-56 w-[140%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.18),transparent_65%)] blur-3xl"
                          aria-hidden
                        />

                        <motion.button
                          type="button"
                          onClick={() => setModalOpen(false)}
                          whileTap={{ scale: 0.95 }}
                          className="absolute right-3 top-3 z-20 rounded-xl p-2 text-zinc-400 transition-colors md:hover:bg-white/[0.06] md:hover:text-white"
                          aria-label={t.modal.close}
                        >
                          <X className="h-5 w-5" strokeWidth={2} />
                        </motion.button>

                        <nav
                          aria-label={t.modal.stepperAria}
                          className="relative z-[2] mx-auto mb-5 mt-1 flex max-w-full flex-col gap-2 pr-14 pt-2 sm:flex-row sm:gap-2 sm:pr-12"
                        >
                          {(
                            [
                              {
                                step: 1 as const,
                                label: t.modal.stepperLine1,
                              },
                              {
                                step: 2 as const,
                                label: t.modal.stepperLine2,
                              },
                              {
                                step: 3 as const,
                                label: t.modal.stepperLine3,
                              },
                            ] as const
                          ).map(({ step, label }) => (
                            <motion.div
                              key={step}
                              layout
                              className={`flex min-h-[48px] flex-1 items-center justify-center rounded-xl px-2 py-2.5 text-center transition-all duration-500 sm:min-h-[52px] sm:px-3 ${
                                activeModalStep === step
                                  ? "border-2 border-sky-400/95 bg-gradient-to-b from-white/[0.14] to-white/[0.06] text-white shadow-[0_0_40px_-4px_rgba(56,189,248,0.5),0_0_28px_-6px_rgba(147,51,234,0.45),inset_0_1px_0_rgba(255,255,255,0.18)]"
                                  : "border border-white/10 bg-white/[0.03] text-zinc-500"
                              }`}
                            >
                              <span className="text-[10px] font-bold uppercase leading-tight tracking-[0.06em] sm:text-[11px] sm:tracking-[0.1em]">
                                {label}
                              </span>
                            </motion.div>
                          ))}
                        </nav>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={
                            liteMotion
                              ? { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
                              : {
                                  type: "spring",
                                  damping: 26,
                                  stiffness: 260,
                                  delay: 0.05,
                                }
                          }
                        >
                          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#60a5fa]/90">
                            {t.modal.eyebrow}
                          </p>
                          <h2
                            id="call-modal-title"
                            className="mt-2 pr-10 text-2xl font-semibold tracking-tight text-white sm:text-[1.65rem]"
                          >
                            {t.modal.title}
                          </h2>
                          <p
                            id="call-modal-desc"
                            className="mt-2 text-sm leading-relaxed text-zinc-500"
                          >
                            {t.modal.description}
                          </p>
                          <AudioWaveform />
                        </motion.div>

                        <section className="relative z-[1] mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl sm:p-5">
                          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                              {t.modal.quickTemplates}
                            </span>
                            <AnimatePresence mode="wait">
                              {presetApplyingVisible ? (
                                <motion.span
                                  key="preset-toast"
                                  initial={{ opacity: 0, x: -6 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 4 }}
                                  transition={{ duration: 0.28 }}
                                  className="inline-flex items-center rounded-full border border-[#2563eb]/30 bg-[#2563eb]/12 px-3 py-1 text-[11px] font-medium text-sky-200/95 shadow-[0_0_24px_-12px_rgba(37,99,235,0.55)]"
                                >
                                  {t.modal.presetApplying}
                                </motion.span>
                              ) : null}
                            </AnimatePresence>
                          </div>
                          <p className="mb-3 text-xs leading-relaxed text-zinc-500">
                            Isterseniz bir sektor secin, isterseniz asagidaki{" "}
                            <span className="text-zinc-300">karakter alanina</span>{" "}
                            kendi promptunuzu yazin.
                          </p>
                          <motion.div
                            className="mb-2 flex flex-wrap gap-2"
                            variants={chipsContainerActive}
                            initial="hidden"
                            animate="visible"
                          >
                            {DEMO_SECTOR_OPTIONS.map((sector) => {
                              const active = demoSector === sector.id;
                              return (
                                <motion.button
                                  key={sector.id}
                                  type="button"
                                  variants={chipItemActive}
                                  whileTap={{ scale: 0.96 }}
                                  onClick={() => {
                                    setDemoSector(sector.id);
                                    setSelectedPresetId(null);
                                  }}
                                  aria-pressed={active}
                                  className={
                                    active
                                      ? "min-h-[38px] rounded-full border border-[#7c3aed]/45 bg-gradient-to-r from-[#7c3aed]/85 via-[#3b82f6]/75 to-[#22d3ee]/70 px-3.5 py-1.5 text-xs font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_0_24px_-10px_rgba(147,51,234,0.75)]"
                                      : "min-h-[38px] rounded-full border border-white/12 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-zinc-300 transition-colors md:hover:border-white/25 md:hover:bg-white/[0.07] md:hover:text-zinc-100"
                                  }
                                >
                                  <sector.Icon
                                    className="mr-1.5 inline-block h-3.5 w-3.5 align-[-2px]"
                                    strokeWidth={2}
                                    aria-hidden
                                  />
                                  {sector.label}
                                </motion.button>
                              );
                            })}
                          </motion.div>
                          <motion.div
                            className="flex flex-wrap gap-2"
                            variants={chipsContainerActive}
                            initial="hidden"
                            animate="visible"
                          >
                            {t.presets.map((p) => (
                              <motion.button
                                key={p.id}
                                type="button"
                                variants={chipItemActive}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  setSystemPrompt(p.prompt);
                                  setDemoSector(null);
                                  setSelectedPresetId(p.id);
                                  setFieldErrors((err) => ({
                                    ...err,
                                    prompt: undefined,
                                  }));
                                  const emoji =
                                    PRESET_EMOJI[p.id as PresetId];
                                  setWatermarkEmoji(emoji);
                                  setPresetApplyingVisible(true);
                                  if (watermarkClearRef.current) {
                                    clearTimeout(watermarkClearRef.current);
                                  }
                                  watermarkClearRef.current = setTimeout(
                                    () => setWatermarkEmoji(null),
                                    1150,
                                  );
                                  if (presetToastClearRef.current) {
                                    clearTimeout(presetToastClearRef.current);
                                  }
                                  presetToastClearRef.current = setTimeout(
                                    () => setPresetApplyingVisible(false),
                                    1500,
                                  );
                                }}
                                className={
                                  selectedPresetId === p.id
                                    ? "min-h-[44px] rounded-full border border-[#9333ea]/55 bg-[#9333ea]/15 px-3.5 py-2 text-sm font-medium text-white shadow-[0_0_28px_-8px_rgba(147,51,234,0.55)] ring-1 ring-[#9333ea]/35 transition-transform md:hover:scale-[1.02]"
                                    : "min-h-[44px] rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 text-sm font-medium text-zinc-300 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition-[transform,background-color,border-color,box-shadow] md:hover:scale-[1.02] md:hover:border-[#2563eb]/40 md:hover:bg-white/[0.09] md:hover:shadow-[0_0_24px_-10px_rgba(37,99,235,0.35)]"
                                }
                              >
                                {p.label}
                              </motion.button>
                            ))}
                          </motion.div>
                        </section>

                        <form
                          onSubmit={handleCallSubmit}
                          className="relative z-[1] mt-6 space-y-6"
                        >
                          {callBanner ? (
                            <div
                              role="alert"
                              className={`rounded-xl border px-4 py-3 text-sm leading-snug ${
                                callBanner.variant === "success"
                                  ? "border-emerald-500/45 bg-emerald-500/10 text-emerald-100"
                                  : "border-red-500/45 bg-red-500/10 text-red-100"
                              }`}
                            >
                              {callBanner.message}
                            </div>
                          ) : null}
                          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 pb-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl sm:p-5">
                          <div className="text-left">
                            <label
                              htmlFor="system-prompt"
                              className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400"
                            >
                              {t.modal.labelPrompt}
                            </label>
                            <div className="relative rounded-2xl">
                              <motion.div
                                className="pointer-events-none absolute -inset-[1px] rounded-2xl"
                                aria-hidden
                                animate={{
                                  opacity: focusPrompt ? 1 : 0,
                                  boxShadow: focusPrompt
                                    ? "0 0 0 1px rgba(37,99,235,0.45), 0 0 28px rgba(147,51,234,0.35), 0 0 56px rgba(37,99,235,0.18)"
                                    : "0 0 0 0 rgba(0,0,0,0)",
                                }}
                                transition={{ duration: 0.28 }}
                              />
                              <motion.div
                                className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-[#2563eb]/0 via-[#2563eb]/25 to-[#9333ea]/0 opacity-0 blur-md"
                                animate={{ opacity: focusPrompt ? 0.85 : 0 }}
                                transition={{ duration: 0.35 }}
                                aria-hidden
                              />
                              <motion.textarea
                                ref={promptInputRef}
                                id="system-prompt"
                                name="systemPrompt"
                                rows={5}
                                disabled={isLoading}
                                placeholder={t.modal.placeholderPrompt}
                                value={systemPrompt}
                                onFocus={() => {
                                  setFocusPrompt(true);
                                  scrollFieldIntoView(promptInputRef.current);
                                }}
                                onBlur={() => setFocusPrompt(false)}
                                onChange={(e) => {
                                  setSystemPrompt(e.target.value);
                                  setSelectedPresetId(null);
                                  setFieldErrors((err) => ({
                                    ...err,
                                    prompt: undefined,
                                  }));
                                }}
                                initial={{ opacity: 0.92 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.35 }}
                                className={`relative z-[1] min-h-[140px] w-full resize-y rounded-2xl border bg-[#050505]/95 px-4 py-3.5 text-base leading-relaxed text-zinc-100 outline-none ring-[#2563eb]/25 transition-[border-color,box-shadow] placeholder:text-zinc-600 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                                  fieldErrors.prompt
                                    ? "border-red-500/45 focus:border-red-500/55 focus:ring-red-500/25"
                                    : "border-white/10 focus:border-[#2563eb]/55 focus:ring-[#2563eb]/30"
                                }`}
                              />
                            </div>
                            {fieldErrors.prompt ? (
                              <p className="mt-2 text-xs text-red-400/95">
                                {fieldErrors.prompt}
                              </p>
                            ) : null}
                          </div>
                          </section>

                          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 pb-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl sm:p-5">
                          <div className="text-left">
                            <label
                              htmlFor="phone-number"
                              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400"
                            >
                              {t.modal.labelPhone}
                            </label>
                            <div className="relative rounded-2xl">
                              <motion.div
                                className="pointer-events-none absolute -inset-[1px] rounded-2xl"
                                aria-hidden
                                animate={{
                                  opacity: focusPhone ? 1 : 0,
                                  boxShadow: focusPhone
                                    ? "0 0 0 1px rgba(147,51,234,0.42), 0 0 26px rgba(37,99,235,0.28), 0 0 52px rgba(147,51,234,0.14)"
                                    : "0 0 0 0 rgba(0,0,0,0)",
                                }}
                                transition={{ duration: 0.28 }}
                              />
                              <motion.div
                                className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-[#9333ea]/0 via-[#2563eb]/22 to-[#9333ea]/0 opacity-0 blur-md"
                                animate={{ opacity: focusPhone ? 0.8 : 0 }}
                                transition={{ duration: 0.35 }}
                                aria-hidden
                              />
                              <div className="pointer-events-none absolute inset-y-0 left-3 z-[2] flex items-center">
                                <span className="inline-flex items-center gap-1 rounded-full border border-white/12 bg-white/[0.06] px-2.5 py-1 text-[11px] font-semibold text-zinc-300">
                                  <Phone className="h-3.5 w-3.5 text-sky-300/90" aria-hidden />
                                  TEL
                                </span>
                              </div>
                              <input
                                ref={phoneInputRef}
                                id="phone-number"
                                type="tel"
                                name="phoneNumber"
                                inputMode="tel"
                                autoComplete="tel"
                                placeholder={t.modal.placeholderPhone}
                                value={phone}
                                disabled={isLoading}
                                onFocus={() => {
                                  setFocusPhone(true);
                                  scrollFieldIntoView(phoneInputRef.current);
                                }}
                                onBlur={() => setFocusPhone(false)}
                                onChange={(e) => {
                                  const normalized = e.target.value.replace(
                                    /[^\d+]/g,
                                    "",
                                  );
                                  setPhone(normalized);
                                  setFieldErrors((err) => ({
                                    ...err,
                                    phone: undefined,
                                  }));
                                }}
                                className={`relative z-[1] w-full rounded-2xl border bg-[#050505]/95 py-3.5 pl-[4.8rem] pr-4 text-base text-white outline-none transition-[border-color,box-shadow] placeholder:text-zinc-600 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                                  fieldErrors.phone
                                    ? "border-red-500/45 focus:border-red-500/55 focus:ring-red-500/25"
                                    : "border-white/10 focus:border-[#2563eb]/55 focus:ring-[#2563eb]/30"
                                }`}
                              />
                            </div>
                            {fieldErrors.phone ? (
                              <p className="mt-2 text-xs text-red-400/95">
                                {fieldErrors.phone}
                              </p>
                            ) : null}
                          </div>

                          <motion.button
                            type="submit"
                            disabled={
                              isLoading ||
                              (!isWhitelistedPhone && demoCallCount >= DEMO_CALL_MAX)
                            }
                            onPointerDown={handleSubmitRipple}
                            whileHover={{
                              scale:
                                isLoading || isMobile ? 1 : liteMotion ? 1 : 1.01,
                            }}
                            whileTap={{ scale: isLoading ? 1 : 0.95 }}
                            className="relative mt-5 min-h-[52px] w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#2563eb] via-[#6366f1] to-[#9333ea] py-3.5 text-base font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_0_48px_-6px_rgba(147,51,234,0.55),0_0_72px_-12px_rgba(37,99,235,0.4)] transition-[filter,box-shadow] md:hover:brightness-110 md:hover:shadow-[0_0_56px_-4px_rgba(147,51,234,0.65),0_0_88px_-10px_rgba(37,99,235,0.35)] disabled:pointer-events-none disabled:brightness-75 disabled:opacity-70"
                          >
                            <motion.span
                              className="pointer-events-none absolute inset-y-0 left-0 w-[38%] bg-gradient-to-r from-transparent via-white/45 to-transparent opacity-55 blur-[2px]"
                              aria-hidden
                              initial={{ x: "-120%" }}
                              animate={{ x: "-120%" }}
                              transition={{ duration: 0.2 }}
                            />
                            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.1),transparent)] opacity-35" />
                            {submitRipples.map((r) => (
                              <motion.span
                                key={r.id}
                                className="pointer-events-none absolute rounded-full bg-white/40 mix-blend-overlay"
                                style={{
                                  left: r.x,
                                  top: r.y,
                                  width: 14,
                                  height: 14,
                                  marginLeft: -7,
                                  marginTop: -7,
                                }}
                                initial={{ scale: 0.15, opacity: 0.5 }}
                                animate={{ scale: 14, opacity: 0 }}
                                transition={{
                                  duration: 0.68,
                                  ease: [0.22, 1, 0.36, 1],
                                }}
                              />
                            ))}
                            <span className="relative z-[1]">
                              {!isWhitelistedPhone && demoCallCount >= DEMO_CALL_MAX
                                ? "Limit Doldu / Contact Sales"
                                : isLoading
                                  ? t.modal.submitting
                                  : t.modal.submit}
                            </span>
                          </motion.button>
                          </section>
                        </form>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>

      <PostCallLeadWizard
        open={postCallWizardOpen}
        onClose={() => {
          setPostCallWizardOpen(false);
          setPostCallWizardPhone("");
        }}
        initialPhone={postCallWizardPhone}
        labels={t.postCall}
        locale={locale}
        liteMotion={liteMotion}
        isMobile={isMobile}
      />
      <AnimatePresence>
        {limitToast ? (
          <motion.div
            key="limit-toast"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-5 right-5 z-[150] w-[min(92vw,460px)] rounded-2xl border border-amber-400/35 bg-[#111111]/95 px-4 py-3 text-sm text-zinc-100 shadow-[0_0_0_1px_rgba(245,158,11,0.15),0_14px_40px_-18px_rgba(0,0,0,0.9)] backdrop-blur-xl"
            role="status"
            aria-live="polite"
          >
            {limitToast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
