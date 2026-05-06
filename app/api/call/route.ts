import { NextResponse } from "next/server";
import type { CallLocale } from "@/lib/callLocale";
import { blockedSiteMessage } from "@/lib/blockedMessages";
import {
  consumeRateGrant,
  getClientIpFromHeaders,
} from "../../lib/demoCallRateLimit";
import { ANSEL_CALL_SYSTEM_BOUNDARY } from "../../lib/anselCallPromptBoundary";
import { blockIpPersist, isIpBlocked } from "../../lib/ipBlocklist";
import {
  abuseMessageForLocale,
  scanPromptForAbuse,
} from "../../lib/promptAbuseGuard";
import {
  appendSecurityToSystemPrompt,
  endCallMessageForLocale,
  MAX_CALL_DURATION_SECONDS,
  VAPI_END_CALL_PHRASES,
} from "../../lib/voiceCallSecurity";
import { augmentCustomScenarioDraft } from "../../lib/voiceDemoPrompts";

/** Vapi Create Call — birleşik endpoint (outbound PSTN). */
const VAPI_CREATE_CALL_URL = "https://api.vapi.ai/call";
const VAPI_GET_ASSISTANT_URL = (id: string) =>
  `https://api.vapi.ai/assistant/${encodeURIComponent(id)}`;

type CallSector = "language" | "ecom" | "clinic";

/** İstemciden gelen locale + sunucu tarafı dil kilidi (UI ile uyum). */
const SERVER_LOCALE_LOCK: Record<CallLocale, string> = {
  tr:
    "[SUNUCU — DİL KİLİDİ] Varsayılan: akıcı kurumsal Türkçe. İstisna: sistem promptundaki özel senaryo açıkça yabancı dilde öğretim/pratik (ör. İngilizce ders) gerektiriyorsa o içeriği hedef dilde yürüt; ‘yalnızca Türkçe’ deme.",
  en:
    "[SERVER — LANGUAGE LOCK] Default: idiomatic English. Exception: if the scenario text explicitly requires Turkish or another language for tutoring/practice, use that language for the instructional segments—never refuse with ‘English only’.",
  de:
    "[SERVER — SPRACHSPERRE] Standard: Hochdeutsch. Ausnahme: wenn die Szenario-Beschreibung ausdrücklich Fremdsprachenunterricht (z. B. Englisch) verlangt, Unterricht in der Zielsprache führen — nicht mit ‘nur Deutsch’ blockieren.",
};

/** Vapi genelde E.164 bekler (+ülke kodu). Türkiye için 05xx / 5xx / 90xx yaygın girişleri düzeltir. */
const MAX_CUSTOM_FIRST_MESSAGE = 420;

/** İstemciden gelen ilk cümleyi güvenli biçimde kısıtla (ör. Caller name ile kişiselleştirilmiş giden arama). */
function sanitizeOutboundFirstMessage(raw: string): string | null {
  const s = raw.trim();
  if (!s || s.length > MAX_CUSTOM_FIRST_MESSAGE) return null;
  if (!/^[\p{L}\p{N}\s.,;:!?'’`\-–—()[\]/?]+$/u.test(s)) {
    return null;
  }
  return s;
}

function normalizePhoneE164(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let s = trimmed.replace(/[\s\-().]/g, "");
  if (s.startsWith("00")) s = `+${s.slice(2)}`;

  if (s.startsWith("+")) {
    const digits = s.slice(1).replace(/\D/g, "");
    if (digits.length >= 8 && digits.length <= 15) return `+${digits}`;
    return null;
  }

  const digitsOnly = s.replace(/\D/g, "");

  if (/^90\d{10}$/.test(digitsOnly)) return `+${digitsOnly}`;
  if (/^0?5\d{9}$/.test(digitsOnly)) {
    const withoutLeading = digitsOnly.startsWith("0")
      ? digitsOnly.slice(1)
      : digitsOnly;
    if (withoutLeading.length === 10 && withoutLeading.startsWith("5")) {
      return `+90${withoutLeading}`;
    }
  }

  if (digitsOnly.length >= 10 && digitsOnly.length <= 15) {
    return `+${digitsOnly}`;
  }

  return null;
}

/**
 * DE/EN arayüzünde Almanya (+49) numaraları için bazı santraller + yerine 00 ile uluslararası biçimi bekler.
 * Örn. +49 151 2345678 → 00491512345678 (E.164’daki + ve ülke kodu korunarak 00 öneklenir).
 */
function formatGermanDialForCarrier(e164: string, locale: CallLocale): string {
  if (locale !== "de" && locale !== "en") return e164;
  const digits = e164.replace(/^\+/, "").replace(/\D/g, "");
  if (
    !digits.startsWith("49") ||
    digits.length < 11 ||
    digits.length > 15
  ) {
    return e164;
  }
  return `00${digits}`;
}

function parseCallLocale(body: unknown): CallLocale {
  if (
    body &&
    typeof body === "object" &&
    "locale" in body &&
    typeof (body as { locale?: unknown }).locale === "string"
  ) {
    const raw = (body as { locale: string }).locale.trim().toLowerCase();
    if (raw === "tr" || raw === "en" || raw === "de") return raw;
  }
  return "en";
}

function resolveCallLocale(body: unknown): CallLocale {
  return parseCallLocale(body);
}

function parsePresetId(body: unknown): string | null {
  if (body && typeof body === "object") {
    const o = body as { presetId?: unknown; isCustomScenario?: unknown };
    if (typeof o.presetId === "string") {
      const id = o.presetId.trim().toLowerCase();
      if (id) return id;
    }
    if (o.isCustomScenario === true) {
      return "custom";
    }
  }
  return null;
}

function parseCallSector(body: unknown): CallSector | null {
  if (
    body &&
    typeof body === "object" &&
    "sector" in body &&
    typeof (body as { sector?: unknown }).sector === "string"
  ) {
    const raw = (body as { sector: string }).sector.trim().toLowerCase();
    if (raw === "language" || raw === "ecom" || raw === "clinic") return raw;
    if (raw === "ecommerce") return "ecom";
    if (raw === "health") return "clinic";
  }
  return null;
}

/** Dashboard’daki asistanın `model` ve `voice` blokları (override birleşimi için). */
async function fetchAssistantPayload(
  assistantId: string,
  privateKey: string,
): Promise<{
  model: Record<string, unknown> | null;
  voice: Record<string, unknown> | null;
  transcriber: Record<string, unknown> | null;
}> {
  let res: Response;
  try {
    res = await fetch(VAPI_GET_ASSISTANT_URL(assistantId), {
      method: "GET",
      headers: { Authorization: `Bearer ${privateKey}` },
    });
  } catch {
    return { model: null, voice: null, transcriber: null };
  }
  if (!res.ok) return { model: null, voice: null, transcriber: null };
  let data: unknown;
  try {
    data = await res.json();
  } catch {
    return { model: null, voice: null, transcriber: null };
  }
  if (!data || typeof data !== "object") {
    return { model: null, voice: null, transcriber: null };
  }
  const o = data as Record<string, unknown>;
  const model =
    o.model && typeof o.model === "object" && !Array.isArray(o.model)
      ? { ...(o.model as Record<string, unknown>) }
      : null;
  const voice =
    o.voice && typeof o.voice === "object" && !Array.isArray(o.voice)
      ? { ...(o.voice as Record<string, unknown>) }
      : null;
  const transcriber =
    o.transcriber &&
    typeof o.transcriber === "object" &&
    !Array.isArray(o.transcriber)
      ? { ...(o.transcriber as Record<string, unknown>) }
      : null;
  return { model, voice, transcriber };
}

/** Konuşmayı doğru dilde algılaması için (STT). Yalnızca dil alanını destekleyen transcriber’larda güncellenir. */
function buildTranscriberOverride(
  base: Record<string, unknown> | null,
  locale: CallLocale,
): Record<string, unknown> | undefined {
  if (!base) return undefined;
  const lang =
    locale === "tr" ? "tr" : locale === "de" ? "de" : "en";
  const provider =
    typeof base.provider === "string"
      ? base.provider.toLowerCase()
      : "";
  const supportsLanguage =
    provider === "deepgram" ||
    provider === "assembly-ai" ||
    Object.prototype.hasOwnProperty.call(base, "language");
  if (!supportsLanguage) {
    return { ...base };
  }
  return {
    ...base,
    language: lang,
  };
}

/**
 * ElevenLabs — Sarah (premium); `eleven_turbo_v2_5` çok dilli düşük gecikme.
 * TR/EN/DE prompt/firstMessage dilini takip eder; voice için ayrı language kodu gönderilmez.
 * Vapi’de ElevenLabs sağlayıcı kimliği `11labs` (docs.vapi.ai/providers/voice/elevenlabs).
 * İsteğe bağlı: `VAPI_VOICE_VOICE_ID`, `VAPI_VOICE_MODEL` ile geçici override.
 */
const ELEVENLABS_VOICE_ID_SARAH = "EXAVITQu4vr4xnSDxMaL";
const ELEVENLABS_VOICE_MODEL_DEFAULT = "eleven_turbo_v2_5";

function buildVoiceOverride(resolvedVoiceId: string): Record<string, unknown> {
  const voiceId =
    resolvedVoiceId.trim() || ELEVENLABS_VOICE_ID_SARAH;
  const model =
    process.env.VAPI_VOICE_MODEL?.trim() || ELEVENLABS_VOICE_MODEL_DEFAULT;
  return {
    provider: "11labs",
    voiceId,
    model,
  };
}

function buildLanguagePrompts(locale: CallLocale): {
  firstMessage: string;
  systemPrompt: string;
} {
  switch (locale) {
    case "de":
      return {
        firstMessage:
          "Guten Tag, hier ist Ansel AI — die konversationelle KI für Ihre geschäftskritischen Telefonprozesse. Womit darf ich Ihnen konkret weiterhelfen?",
        systemPrompt:
          "Du bist Ansel AI, eine höfliche, entscheidungsfähige Enterprise-Sprachassistentin. Sprich ausnahmslos Hochdeutsch. Führe das Gespräch wie eine erfahrene Beraterin am Telefon: warm, präzise, souverän; normales bis leicht zügiges Tempo — niemals langsam gezogen, nicht nuscheln, keine künstlichen Füllwörter. Artikuliere jedes Wort klar (Konsonanten und Umlaute deutlich); keine Stockungen oder neuen Anläufe. Kurze, belastbare Sätze; keine unnötig verschachtelten Nebensätze. Tonfall ruhig und stabil — nicht wie eine monotone Mailbox.",
      };
    case "en":
      return {
        firstMessage:
          "Hi, this is Ansel AI—a voice assistant built for disciplined enterprise workflows. Where should we focus this session?",
        systemPrompt:
          "You are Ansel AI: a senior enterprise voice collaborator. Speak only polished, conversational English tailored to global B2B buyers. Pace is confident and conversational—never sluggish, drawling, or robotic. Articulate clearly for voice: crisp consonants, full vowels, no mumbling or swallowed endings; no verbal fillers or hesitation glitches. Prefer short, high-signal sentences; avoid filler jargon. Stay courteous, factual, calm, and adaptable while steering toward the outcome the user chose.",
      };
    default:
      return {
        firstMessage:
          "Merhaba, Ansel AI sesli iş asistanınız olarak hattayım — hangi süreci önceliklendirelim?",
        systemPrompt:
          "Sen Ansel AI, kurumsal bir ses yapay zekâsısın. YALNIZCA Türkçe konuş. Profesyonel bir müşteri temsilcisinin netliğinde ol: doğal, güven veren, çözüm odaklı; tempo orta–hafif hızlı, gevelemeden. Her kelimeyi eksiksiz telaffuz et; takılma, kekeleme ve gereksiz dolgu yok. Kısa ve anlaşılır cümleler kur; robotik monotonluktan kaçın. Karşı tarafı dinle, gerektiğinde tek cümlede özetle ve nazikçe doğrula.",
      };
  }
}

function buildSectorPrompts(locale: CallLocale, sector: CallSector): {
  firstMessage: string;
  systemPrompt: string;
} {
  if (locale === "en") {
    switch (sector) {
      case "language":
        return {
          firstMessage:
            "Hello, I am your Ansel language partner. Which language would you like to practice today?",
          systemPrompt:
            "You are a language learning partner. Practice with the user and correct mistakes kindly.",
        };
      case "ecom":
        return {
          firstMessage:
            "Welcome to Ansel Support, how can I assist you with your order?",
          systemPrompt:
            "You are an e-commerce support agent. Help customers with orders.",
        };
      case "clinic":
        return {
          firstMessage:
            "Hello, Ansel Dental Practice, how can I help you today?",
          systemPrompt:
            "You are an assistant in a dental practice. Handle appointment requests friendly.",
        };
      default:
        return {
          firstMessage:
            "Welcome to Ansel Support, how can I assist you with your order?",
          systemPrompt:
            "You are an e-commerce support agent. Help customers with orders.",
        };
    }
  }

  if (locale === "de") {
    switch (sector) {
      case "language":
        return {
          firstMessage:
            "Hallo, ich bin Ihr Ansel Sprachlern-Partner. Welche Sprache möchten Sie heute üben?",
          systemPrompt:
            "Du bist ein Sprachlern-Partner. Übe mit dem Nutzer und korrigiere Fehler freundlich.",
        };
      case "ecom":
        return {
          firstMessage:
            "Willkommen beim Ansel Support. Wie kann ich Ihnen bei Ihrer Bestellung helfen?",
          systemPrompt:
            "Du bist ein E-Commerce-Support-Agent. Hilf Kunden bei Bestellungen.",
        };
      case "clinic":
        return {
          firstMessage:
            "Hallo, Praxis Dr. Ansel, wie kann ich Ihnen helfen?",
          systemPrompt:
            "Du bist eine Assistenz in einer Zahnarztpraxis. Nimm Terminwünsche freundlich entgegen.",
        };
      default:
        return {
          firstMessage:
            "Willkommen beim Ansel Support. Wie kann ich Ihnen bei Ihrer Bestellung helfen?",
          systemPrompt:
            "Du bist ein E-Commerce-Support-Agent. Hilf Kunden bei Bestellungen.",
        };
    }
  }

  switch (sector) {
    case "language":
      return {
        firstMessage:
          "Merhaba, ben Ansel dil öğrenme partneriniz. Hangi dilde pratik yapmak istersiniz?",
        systemPrompt:
          "Sen bir dil öğrenme partnerisin. Kullanıcıyla hedef dilde pratik yap ve hataları nazikçe düzelt.",
      };
    case "ecom":
      return {
        firstMessage:
          "Ansel Destek hattına hoş geldiniz, siparişinizle ilgili nasıl yardımcı olabilirim?",
        systemPrompt:
          "Sen bir e-ticaret destek asistanısın. Müşterilere yardımcı ol.",
      };
    case "clinic":
      return {
        firstMessage:
          "Merhaba, Ansel Diş Kliniği, size nasıl yardımcı olabilirim?",
        systemPrompt:
          "Sen bir diş kliniği asistanısın. Randevu taleplerini kibarca karşıla.",
      };
    default:
      return {
        firstMessage:
          "Ansel Destek hattına hoş geldiniz, siparişinizle ilgili nasıl yardımcı olabilirim?",
        systemPrompt:
          "Sen bir e-ticaret destek asistanısın. Müşterilere yardımcı ol.",
      };
  }
}

/**
 * Dashboard’dan gelen modele takılı eski `messages` bizim sistemi ezebiliyor.
 * `messages` alanını çıkarıp tek güçlü system içeriği gönder.
 */
function buildAssistantModelOverride(
  base: Record<string, unknown> | null,
  systemPrompt: string,
): Record<string, unknown> {
  const messages = [
    {
      role: "system" as const,
      content: systemPrompt,
    },
  ];

  if (base) {
    const rest = { ...base };
    delete (rest as { messages?: unknown }).messages;
    return {
      ...rest,
      messages,
    };
  }

  const provider =
    process.env.VAPI_OVERRIDE_MODEL_PROVIDER?.trim() || "openai";
  const modelName =
    process.env.VAPI_OVERRIDE_MODEL_NAME?.trim() || "gpt-4o-mini";

  return {
    provider,
    model: modelName,
    messages,
  };
}

/** Kısa kullanıcı promptunu sesli arama için güçlendirir (harici LLM çağrısı yok). */
function enhancePromptForVoiceCall(
  clientPromptBundle: string,
  locale: CallLocale,
): string {
  const blocks: Record<CallLocale, [string, string]> = {
    tr: [
      [
        "### ÖNCELİK (mutlak)",
        "Bu bir CANLI TELEFON görüşmesidir.",
        "Aşağıdaki «KULLANICI TANIMI» bloğu görevini, kişiliğini ve konuşma tarzını belirler — dashboard varsayılanından ÜSTÜNDÜR.",
        "Genel «yapay zeka asistanı» şablonuna kayma; kullanıcı rolünü somut uygula.",
        "Senaryo seni arayan taraf olarak tanımlamıyorsa, giden arama gibi davran: karşı taraf uzun süre konuşsun diye bekleme — dolu bir açılış yap veya tek net soruyla ilerlet.",
        "Kullanıcı tanımı çok kısa olsa bile anlamı çıkarıp profesyonel bir çağrı akışına genişlet; somut uydurma veri üretme.",
        "İlk ne söylersen söyle, sonra da bu role uy; sessiz kalma — gerektiğinde kısa bir soruyla konuşmayı sürdür.",
      ].join("\n"),
      [
        "### SESLİ ÇAĞRI STİLİ",
        "Telefonu arayan sıradan insan gibi: tempolu ve net konuş; yavaş, ağır, tembel veya uyku veren ton kesinlikle yok.",
        "Takılma, ıı-şey dolgusu, cümleyi yarıda kesip yeniden başlama yok; akıcı ve kararlı akış.",
        "Hece uzatmadan konuş; kelimeleri ağızda gevelemeden bitir.",
        "Ses çıktısı için ana dil konuşuru kalitesinde artikülasyon: ünlü ve ünsüzleri net ver; dinleyici hiçbir heceyi kaçırmamalı.",
        "Kısa net cümleler; dolambaç, liste okurmuş gibi okuma yok.",
        "Ritim canlı ve stabil — robot gibi düz ezber değil.",
        "Dil: varsayılan Türkçe; kullanıcı metni açıkça yabancı dilde öğretim/pratik istiyorsa o hedef dilde devam et.",
      ].join("\n"),
    ],
    en: [
      [
        "### PRIORITY (absolute)",
        "This is a LIVE PHONE call.",
        "The «USER PERSONA & TASK» block below defines task, personality, and tone — it OVERRIDES generic dashboard instructions.",
        "Do not use a bland generic-assistant script; fully embody the described role.",
        "Unless the scenario explicitly casts you as inbound support only, behave outbound: do not wait for the callee to carry the opening—deliver a full first turn (or one crisp question) without awkward silence.",
        "If the user’s scenario text is very short, infer intent and expand into a strong phone flow—never invent specific facts (names, dates, amounts).",
        "Never go silent indefinitely—if the user is quiet, move the conversation forward with one focused question.",
      ].join("\n"),
      [
        "### VOICE CALL STYLE",
        "Sound like an everyday fluent speaker on a normal call—never slow, lazy, drawling, or stammering.",
        "No filler clutter, no stuck restarts mid-sentence; keep momentum.",
        "Crisp articulation, short clauses; no rambling paragraphs.",
        "Broadcast-grade clarity for TTS: finish each word cleanly—no blurred consonants, no swallowed word endings.",
        "Steady, slightly upbeat pace; brief pauses only where natural.",
        "One focused question at a time.",
        "Language: default English; if the persona text explicitly requires another language for tutoring/practice, use that for the lesson segments.",
      ].join("\n"),
    ],
    de: [
      [
        "### PRIORITÄT (absolut)",
        "Live‑Telefonat.",
        "Der Block «NUTZERROLLE UND AUFGABE» unten hat Vorrang vor generischen Dashboard‑Texten.",
        "Rolle konkret ausfüllen, nicht nur höflich grüßen.",
        "Wenn das Szenario dich nicht ausdrücklich nur als eingehende Support‑Leitung beschreibt, verhalte dich wie bei einem Ausgangs­anruf: nicht nach einem bloßen Gruß in Peinlich‑Stille verharren — liefere eine vollständige Eröffnung oder eine klare Erstfrage.",
        "Ist der Nutzertext sehr kurz, Intention erkennen und zu einem starken Telefonablauf ausbauen — keine erfundenen konkreten Fakten.",
        "Bei Stille das Gespräch mit einer klaren Nachfrage weiterführen.",
      ].join("\n"),
      [
        "### TELEFON-STIL",
        "Sprich wie in einem gewohnten Geschäftstelefonat: klares Hochdeutsch, normal bis etwas flotter — nicht träge, nicht stockend, nicht eintönig schleppend.",
        "Keine Fülllaute, kein Stocken mitten im Satz; durchgehend flüssig.",
        "Silben nicht unnötig ziehen; nicht monoton dröhnen und nicht nuscheln.",
        "Telefon/Sprachausgabe: jedes Wort artikuliert; Umlaute und auslautende Konsonanten klar — höchste Verständlichkeit für den Anrufer.",
        "Kurze, prägnante Sätze; keine langen geschachtelten Formulierungen.",
        "Ruhiges, stabiles aber lebendiges Tempo; keine monotonen Roboter­phrasen.",
        "Maximal eine fokussierte Frage pro Aussage.",
        "Sprache: Standard Deutsch; wenn die Rollenbeschreibung ausdrücklich Fremdsprachenunterricht verlangt, Unterrichtsteil in der Zielsprache.",
      ].join("\n"),
    ],
  };

  const [head, tail] = blocks[locale];

  const userScenarioHeading: Record<CallLocale, string> = {
    tr: "### KULLANICI TANIMI (ekrandan gelen tam metin)",
    en: "### USER PERSONA & TASK (full scenario text from this session)",
    de: "### NUTZERROLLE UND AUFGABE (vollständiger Szenariotext dieser Sitzung)",
  };

  return [
    head,
    "",
    userScenarioHeading[locale],
    clientPromptBundle.trim(),
    "",
    tail,
  ].join("\n");
}

/** Özel senaryo: istemci ham kullanıcı metni gönderir; kurumsal augment yalnızca burada uygulanır (TR/EN/DE tutarlı). */
function splitCallerPersonaAndSystemTail(fullPrompt: string): {
  callerLine: string;
  personaRaw: string;
  tail: string;
} | null {
  const boundaryToken = `\n${ANSEL_CALL_SYSTEM_BOUNDARY}\n`;
  let head: string;
  let tail: string;

  const b = fullPrompt.indexOf(boundaryToken);
  if (b !== -1) {
    head = fullPrompt.slice(0, b).trimEnd();
    tail = fullPrompt.slice(b + boundaryToken.length);
  } else {
    const marker = "══════════════════════════════════════";
    const idx = fullPrompt.indexOf(marker);
    if (idx === -1) return null;
    head = fullPrompt.slice(0, idx).trimEnd();
    tail = fullPrompt.slice(idx);
  }

  const lines = head.split("\n");
  if (
    lines.length < 2 ||
    !/^Caller name:\s*/i.test(lines[0] ?? "")
  ) {
    return null;
  }
  const callerMatch = lines[0]?.match(/^Caller name:\s*(.+)$/i);
  if (!callerMatch) return null;
  const callerName = callerMatch[1].trim();
  const personaRaw = lines.slice(1).join("\n").trim();
  return {
    callerLine: `Caller name: ${callerName}`,
    personaRaw,
    tail,
  };
}

function applyCustomScenarioServerAugment(
  fullPrompt: string,
  locale: CallLocale,
  presetId: string | null,
): string {
  if (presetId !== "custom") return fullPrompt;

  const parsed = splitCallerPersonaAndSystemTail(fullPrompt);
  if (!parsed) return fullPrompt;

  const { callerLine, personaRaw, tail } = parsed;
  if (!personaRaw) return fullPrompt;

  if (
    personaRaw.includes("CUSTOM SCENARIO — ENTERPRISE") ||
    personaRaw.includes("ÖZEL SENARYO — KURUMSAL") ||
    personaRaw.includes("EIGENES SZENARIO — PROFESSIONELLE")
  ) {
    return fullPrompt;
  }

  const augmented = augmentCustomScenarioDraft(personaRaw, locale);
  return `${callerLine}\n${augmented}\n\n${ANSEL_CALL_SYSTEM_BOUNDARY}\n${tail}`;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Geçersiz JSON gövdesi." },
      { status: 400 },
    );
  }

  const phoneNumberRaw =
    body &&
    typeof body === "object" &&
    "phoneNumber" in body &&
    typeof (body as { phoneNumber?: unknown }).phoneNumber === "string"
      ? (body as { phoneNumber: string }).phoneNumber.trim()
      : "";

  const systemPromptRaw =
    body &&
    typeof body === "object" &&
    "systemPrompt" in body &&
    typeof (body as { systemPrompt?: unknown }).systemPrompt === "string"
      ? (body as { systemPrompt: string }).systemPrompt.trim()
      : "";
  const firstMessageFromBody =
    body &&
    typeof body === "object" &&
    "firstMessage" in body &&
    typeof (body as { firstMessage?: unknown }).firstMessage === "string"
      ? sanitizeOutboundFirstMessage(
          (body as { firstMessage: string }).firstMessage,
        )
      : null;
  const voiceIdFromBody =
    body &&
    typeof body === "object" &&
    "voiceId" in body &&
    typeof (body as { voiceId?: unknown }).voiceId === "string"
      ? (body as { voiceId: string }).voiceId.trim()
      : "";
  const voiceId =
    process.env.VAPI_VOICE_VOICE_ID?.trim() ||
    voiceIdFromBody ||
    ELEVENLABS_VOICE_ID_SARAH;

  if (!phoneNumberRaw) {
    return NextResponse.json(
      { error: "Telefon numarası gereklidir." },
      { status: 400 },
    );
  }

  const phoneE164 = normalizePhoneE164(phoneNumberRaw);
  if (!phoneE164) {
    return NextResponse.json(
      {
        error:
          "Geçerli bir telefon numarası girin (uluslararası format, örn. +905551234567 veya 05551234567).",
      },
      { status: 400 },
    );
  }

  const locale = resolveCallLocale(body);
  const sector = parseCallSector(body);
  const presetId = parsePresetId(body);
  const ip = getClientIpFromHeaders(new Headers(request.headers));

  if (await isIpBlocked(ip)) {
    return NextResponse.json(
      { error: blockedSiteMessage(locale) },
      { status: 403 },
    );
  }

  if (!systemPromptRaw) {
    return NextResponse.json(
      { error: "Sistem promptu gereklidir." },
      { status: 400 },
    );
  }

  const abuseScan = scanPromptForAbuse(systemPromptRaw);
  if (!abuseScan.ok) {
    await blockIpPersist(ip);
    return NextResponse.json(
      { error: abuseMessageForLocale(abuseScan, locale) },
      { status: 403 },
    );
  }

  const systemPromptAugmented = applyCustomScenarioServerAugment(
    systemPromptRaw,
    locale,
    presetId,
  );

  const rateGrant =
    body &&
    typeof body === "object" &&
    "rateGrant" in body &&
    typeof (body as { rateGrant?: unknown }).rateGrant === "string"
      ? (body as { rateGrant: string }).rateGrant.trim()
      : "";

  const rateLimitResult = consumeRateGrant({
    grantId: rateGrant,
    ip,
    phone: phoneE164,
  });
  if (!rateLimitResult.ok) {
    return NextResponse.json(
      {
        error:
          rateLimitResult.reason ??
          "Güvenlik Önlemi: Demo arama limitinize (2/2) ulaştınız. Daha fazlası için lütfen satış ekibimizle görüşün.",
      },
      { status: 429 },
    );
  }

  const { firstMessage: localeFirstMessage, systemPrompt: localeSystemPrompt } =
    buildLanguagePrompts(locale);
  const sectorPrompts = sector ? buildSectorPrompts(locale, sector) : null;
  const MAX_PROMPT_CHARS = 22_000;
  const enhancedPrompt = enhancePromptForVoiceCall(systemPromptAugmented, locale);
  /** Senaryo ve kullanıcı talimatı önce — genel Ansel kimliği sonra (özel senaryonun ezilmesini önler). */
  const lockedPromptCore = `${enhancedPrompt}\n\n────────────────────────────────────────\n\n${localeSystemPrompt}${sectorPrompts ? `\n\n${sectorPrompts.systemPrompt}` : ""}\n\n${SERVER_LOCALE_LOCK[locale]}`;
  const lockedPrompt = appendSecurityToSystemPrompt(lockedPromptCore, locale);
  if (lockedPrompt.length > MAX_PROMPT_CHARS) {
    return NextResponse.json(
      { error: "Sistem promptu çok uzun." },
      { status: 400 },
    );
  }

  const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
  const phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID;
  const privateKey = process.env.VAPI_PRIVATE_KEY;

  if (!assistantId || !phoneNumberId || !privateKey) {
    return NextResponse.json(
      { error: "Sunucu yapılandırması eksik." },
      { status: 500 },
    );
  }

  const { model: baseModel, transcriber: baseTranscriber } =
    await fetchAssistantPayload(assistantId, privateKey);

  const modelOverride = buildAssistantModelOverride(baseModel, lockedPrompt);
  const voiceOverride = buildVoiceOverride(voiceId);
  const transcriberOverride = buildTranscriberOverride(
    baseTranscriber,
    locale,
  );

  const assistantOverrides: Record<string, unknown> = {
    model: modelOverride,
    firstMessage:
      firstMessageFromBody ??
      sectorPrompts?.firstMessage ??
      localeFirstMessage,
    /** PSTN varsayılanı «office» ortam sesi — kapatılır. */
    backgroundSound: "off",
    voice: voiceOverride,
    maxDurationSeconds: MAX_CALL_DURATION_SECONDS,
    endCallPhrases: VAPI_END_CALL_PHRASES,
    endCallMessage: endCallMessageForLocale(locale),
  };
  if (transcriberOverride) {
    assistantOverrides.transcriber = transcriberOverride;
  }

  type VapiCallResult = {
    response: Response;
    rawText: string;
    parsed: unknown;
  };

  const customerDialNumber = formatGermanDialForCarrier(phoneE164, locale);

  const createCall = async (
    overrides: Record<string, unknown>,
  ): Promise<VapiCallResult> => {
    const response = await fetch(VAPI_CREATE_CALL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${privateKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assistantId,
        phoneNumberId,
        customer: { number: customerDialNumber },
        assistantOverrides: overrides,
      }),
    });
    const rawText = await response.text();
    let parsed: unknown = null;
    if (rawText) {
      try {
        parsed = JSON.parse(rawText) as unknown;
      } catch {
        parsed = null;
      }
    }
    return { response, rawText, parsed };
  };

  let callResult: VapiCallResult;
  try {
    callResult = await createCall(assistantOverrides);
  } catch {
    return NextResponse.json(
      { error: "Vapi ile bağlantı kurulamadı." },
      { status: 502 },
    );
  }

  // Voice override başarısızsa varsayılan asistana düşmeyiz; aksi halde ses/dil
  // profilinin erkek/İngilizceye kayması mümkün olur.

  if (!callResult.response.ok) {
    const message = extractVapiErrorMessage(
      callResult.parsed,
      callResult.rawText,
      callResult.response.status,
    );
    const status =
      callResult.response.status >= 400 && callResult.response.status < 600
        ? callResult.response.status
        : 502;
    return NextResponse.json({ error: message }, { status });
  }

  return NextResponse.json(callResult.parsed ?? {});
}

function extractVapiErrorMessage(
  parsed: unknown,
  fallbackText: string,
  status?: number,
): string {
  if (status === 401) {
    return "Vapi kimlik doğrulama hatası: VAPI_PRIVATE_KEY değeri geçersiz veya yanlış anahtar türü kullanılıyor.";
  }

  if (parsed && typeof parsed === "object") {
    const o = parsed as Record<string, unknown>;
    if (typeof o.message === "string" && o.message.trim()) {
      if (o.message.trim().toLowerCase() === "bad request") {
        return "Vapi isteği reddedildi (Bad Request). Asistan ID, telefon numarası ID veya voice ayarları geçersiz olabilir.";
      }
      return o.message.trim();
    }
    if (typeof o.error === "string" && o.error.trim()) {
      if (o.error.trim().toLowerCase() === "bad request") {
        return "Vapi isteği reddedildi (Bad Request). Asistan ID, telefon numarası ID veya voice ayarları geçersiz olabilir.";
      }
      return o.error.trim();
    }
    if (Array.isArray(o.message) && o.message.length > 0) {
      const parts: string[] = [];
      for (const item of o.message) {
        if (typeof item === "string" && item.trim()) parts.push(item.trim());
        else if (item && typeof item === "object") {
          const row = item as Record<string, unknown>;
          if (typeof row.message === "string" && row.message.trim()) {
            parts.push(row.message.trim());
          } else if (typeof row.msg === "string" && row.msg.trim()) {
            parts.push(row.msg.trim());
          }
        }
      }
      if (parts.length > 0) return parts.join(" · ");
    }
    if (Array.isArray(o.errors) && o.errors.length > 0) {
      const parts: string[] = [];
      for (const item of o.errors) {
        if (typeof item === "string" && item.trim()) parts.push(item.trim());
        else if (item && typeof item === "object") {
          const row = item as Record<string, unknown>;
          const m =
            typeof row.message === "string"
              ? row.message
              : typeof row.msg === "string"
                ? row.msg
                : "";
          if (m.trim()) parts.push(m.trim());
        }
      }
      if (parts.length > 0) return parts.join(" · ");
    }
  }
  if (fallbackText.trim()) {
    if (fallbackText.trim().toLowerCase() === "bad request") {
      return "Vapi isteği reddedildi (Bad Request). Asistan ID, telefon numarası ID veya voice ayarları geçersiz olabilir.";
    }
    return fallbackText.trim().slice(0, 500);
  }
  return "Arama başlatılamadı.";
}
