import { NextResponse } from "next/server";
import {
  consumeRateGrant,
  getClientIpFromHeaders,
} from "../../lib/demoCallRateLimit";

/** Vapi Create Call — birleşik endpoint (outbound PSTN). */
const VAPI_CREATE_CALL_URL = "https://api.vapi.ai/call";
const VAPI_GET_ASSISTANT_URL = (id: string) =>
  `https://api.vapi.ai/assistant/${encodeURIComponent(id)}`;

type CallLocale = "tr" | "en" | "de";
type CallSector = "ecommerce" | "realestate" | "health";

/** İstemciden gelen locale + sunucu tarafı dil kilidi (UI ile uyum). */
const SERVER_LOCALE_LOCK: Record<CallLocale, string> = {
  tr:
    "[SUNUCU — DİL KİLİT] Bu oturum için arayüz dili Türkçe. Tüm yanıtlar yalnızca Türkçe olmalıdır.",
  en:
    "[SERVER — LANGUAGE LOCK] UI locale is English for this session. Every reply must be in English only.",
  de:
    "[SERVER — SPRACHSPERRE] UI auf Deutsch. Alle Antworten ausschließlich auf Deutsch.",
};

/** Vapi genelde E.164 bekler (+ülke kodu). Türkiye için 05xx / 5xx / 90xx yaygın girişleri düzeltir. */
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
  return "tr";
}

function resolveCallLocale(body: unknown): CallLocale {
  return parseCallLocale(body);
}

function parseCallSector(body: unknown): CallSector | null {
  if (
    body &&
    typeof body === "object" &&
    "sector" in body &&
    typeof (body as { sector?: unknown }).sector === "string"
  ) {
    const raw = (body as { sector: string }).sector.trim().toLowerCase();
    if (
      raw === "ecommerce" ||
      raw === "realestate" ||
      raw === "health"
    ) {
      return raw;
    }
  }
  return null;
}

/** ElevenLabs `language` alanı için ISO 639-1. */
function localeToVoiceLanguage(locale: CallLocale): string {
  switch (locale) {
    case "de":
      return "de";
    case "en":
      return "en";
    default:
      return "tr";
  }
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
 * Ses: mümkünse ElevenLabs ile dile göre `language` (turbo v2.5).
 * İsteğe bağlı: `.env.local` içinde kadın ses — `VAPI_VOICE_PROVIDER=11labs` + `VAPI_VOICE_VOICE_ID=<ElevenLabs ses id>`.
 */
function buildVoiceOverride(
  locale: CallLocale,
  forcedVoiceId: string,
): Record<string, unknown> | undefined {
  const lang = localeToVoiceLanguage(locale);
  const voice: Record<string, unknown> = {
    provider: "11labs",
    voiceId: forcedVoiceId,
    language: lang,
  };
  const modelFromEnv = process.env.VAPI_VOICE_MODEL?.trim();
  if (modelFromEnv) {
    voice.model = modelFromEnv;
  }
  return voice;
}

function buildLanguagePrompts(locale: CallLocale): {
  firstMessage: string;
  systemPrompt: string;
} {
  switch (locale) {
    case "de":
      return {
        firstMessage:
          "Hallo, ich bin Ansel AI. Wie kann ich Ihre Geschäftsprozesse heute optimieren?",
        systemPrompt:
          "Du bist Ansel AI, ein professioneller KI-Assistent für Unternehmen. Sprich NUR auf Deutsch. Sprich natürlich, warm und menschlich — nicht wie ein Bot. Formuliere grammatikalisch korrektes, leicht verständliches Hochdeutsch ohne Dialekt, Slang oder unnötig komplizierte Formulierungen. Nutze klare, kurze Sätze, variiere den Rhythmus leicht und setze kleine natürliche Pausen. Sprich präzise, freundlich und souverän.",
      };
    case "en":
      return {
        firstMessage:
          "Hello, I am Ansel AI. How can I optimize your business processes today?",
        systemPrompt:
          "You are Ansel AI, an enterprise AI assistant. Speak ONLY in English. Sound natural, warm, and human — never robotic. Use clear international business English with correct grammar and straightforward wording. Avoid slang, filler words, and overly complex sentence structures. Keep sentences concise, vary cadence slightly, and include brief natural pauses. Be polite, professional, and precise.",
      };
    default:
      return {
        firstMessage:
          "Merhaba, ben Ansel AI. Bugün iş süreçlerinizi nasıl optimize edebilirim?",
        systemPrompt:
          "Sen Ansel AI, kurumsal bir yapay zeka asistanısın. SADECE Türkçe konuş. Sesin doğal, sıcak ve insan gibi olsun; robotik tondan kaçın. Enerjik ama kontrollü konuş, canlı bir ton kullan, kelimeleri net ve anlaşılır telaffuz et. Çok yavaş veya çok hızlı konuşma; akıcı ve anlaşılır tempoda ilerle. Kibar, profesyonel ve net ol.",
      };
  }
}

function buildSectorPrompts(locale: CallLocale, sector: CallSector): {
  firstMessage: string;
  systemPrompt: string;
} {
  if (locale === "en") {
    switch (sector) {
      case "ecommerce":
        return {
          firstMessage:
            "Hi there! This is Ansel AI's e-commerce specialist. How can we reduce cart abandonment and increase your sales?",
          systemPrompt:
            "You are an e-commerce specialist. You are highly skilled in stock tracking, order status support, and campaign management.",
        };
      case "realestate":
        return {
          firstMessage:
            "Hello, this is your Ansel AI real-estate assistant. How should we automate appointment booking for your listings?",
          systemPrompt:
            "You are a real-estate specialist. You are skilled at qualifying buyers and scheduling home-showing appointments.",
        };
      case "health":
        return {
          firstMessage:
            "Good day, this is Ansel AI's healthcare assistant. How can we speed up patient appointments and clinic information workflows?",
          systemPrompt:
            "You are a clinical assistant. You prioritize patient privacy, manage appointment calendars, and answer questions politely.",
        };
      default:
        return {
          firstMessage:
            "Hi there! This is Ansel AI's e-commerce specialist. How can we reduce cart abandonment and increase your sales?",
          systemPrompt:
            "You are an e-commerce specialist. You are highly skilled in stock tracking, order status support, and campaign management.",
        };
    }
  }

  if (locale === "de") {
    switch (sector) {
      case "ecommerce":
        return {
          firstMessage:
            "Hallo! Hier ist der E-Commerce-Spezialist von Ansel AI. Wie können wir Warenkorbabbrüche senken und Ihren Umsatz steigern?",
          systemPrompt:
            "Du bist ein E-Commerce-Spezialist. Du bist erfahren in Bestandsverwaltung, Bestellstatus und Kampagnenmanagement.",
        };
      case "realestate":
        return {
          firstMessage:
            "Hallo, ich bin Ihr Immobilien-Assistent von Ansel AI. Wie sollen wir die Terminbuchung für Ihre Immobilien automatisieren?",
          systemPrompt:
            "Du bist ein Immobilien-Spezialist. Du qualifizierst Interessenten und koordinierst Besichtigungstermine effizient.",
        };
      case "health":
        return {
          firstMessage:
            "Guten Tag, hier ist der Gesundheitsassistent von Ansel AI. Wie können wir Patienten-Termine und Informationsprozesse in Ihrer Klinik beschleunigen?",
          systemPrompt:
            "Du bist ein klinischer Assistent. Du achtest auf Datenschutz, verwaltest Terminpläne und beantwortest Fragen freundlich.",
        };
      default:
        return {
          firstMessage:
            "Hallo! Hier ist der E-Commerce-Spezialist von Ansel AI. Wie können wir Warenkorbabbrüche senken und Ihren Umsatz steigern?",
          systemPrompt:
            "Du bist ein E-Commerce-Spezialist. Du bist erfahren in Bestandsverwaltung, Bestellstatus und Kampagnenmanagement.",
        };
    }
  }

  switch (sector) {
    case "ecommerce":
      return {
        firstMessage:
          "Selamlar! Ansel AI e-ticaret uzmanı burada. Sepet terk etme oranlarınızı düşürmek ve satışlarınızı artırmak için neler yapabiliriz?",
        systemPrompt:
          "Sen bir e-ticaret uzmanısın. Stok takibi, sipariş durumu ve kampanya yönetimi konularında uzmanlaşmış bir asistansın.",
      };
    case "realestate":
      return {
        firstMessage:
          "Merhaba, Ansel AI emlak asistanı olarak aramanıza sevindim. Portföyünüzdeki ilanlar için randevu alma sürecini nasıl otomatize edelim?",
        systemPrompt:
          "Sen bir emlak uzmanısın. Potansiyel alıcıları filtreleme ve ev gösterimi için randevu oluşturma konusunda uzmansın.",
      };
    case "health":
      return {
        firstMessage:
          "İyi günler, Ansel AI sağlık asistanı ben. Kliniğiniz için hasta randevularını ve genel bilgilendirme süreçlerini nasıl hızlandırabiliriz?",
        systemPrompt:
          "Sen bir klinik asistanısın. Hasta gizliliğine önem veren, randevu takvimi yöneten ve nezaketle soruları yanıtlayan birisin.",
      };
    default:
      return {
        firstMessage:
          "Selamlar! Ansel AI e-ticaret uzmanı burada. Sepet terk etme oranlarınızı düşürmek ve satışlarınızı artırmak için neler yapabiliriz?",
        systemPrompt:
          "Sen bir e-ticaret uzmanısın. Stok takibi, sipariş durumu ve kampanya yönetimi konularında uzmanlaşmış bir asistansın.",
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
        "İlk ne söylersen söyle, sonra da bu role uy; sessiz kalma — gerektiğinde kısa bir soruyla konuşmayı sürdür.",
      ].join("\n"),
      [
        "### SESLI CAGRI STILI",
        "Robotik ve liste okur gibi konusma.",
        "Kisa ve konusma diliyle cumleler kur; akisa gore dogal baglaclar kullan.",
        "Her cumlede ayni ritmi kullanma; tonlamayi yumusat.",
        "Hiz: orta ve canli. Kelimeleri net telaffuz et.",
        "Cumleler arasina kisa, dogal duraklama koy.",
        "Belirlenen dilde kal.",
      ].join("\n"),
    ],
    en: [
      [
        "### PRIORITY (absolute)",
        "This is a LIVE PHONE call.",
        "The «USER PERSONA» block below defines task, personality, and tone — it OVERRIDES generic dashboard instructions.",
        "Do not use a bland generic-assistant script; fully embody the described role.",
        "Never go silent indefinitely—if the user is quiet, move the conversation forward with one focused question.",
      ].join("\n"),
      [
        "### VOICE CALL STYLE",
        "Use clean, easy-to-understand international English.",
        "Prefer short, direct sentences and concrete wording.",
        "Avoid slang, idioms, and long nested sentence structures.",
        "Keep a steady, natural pace with brief pauses.",
        "One focused question at a time when needed.",
        "Follow the agreed interface language.",
      ].join("\n"),
    ],
    de: [
      [
        "### PRIORITÄT",
        "Live‑Telefonat.",
        "Der Block «NUTZERROLLE» unten hat Vorrang vor generischen Dashboard‑Texten.",
        "Rolle konkret ausfüllen, nicht nur höflich grüßen.",
        "Bei Stille das Gespräch mit einer klaren Nachfrage weiterführen.",
      ].join("\n"),
      [
        "### TELEFON-STIL",
        "Sprich klares, gut verständliches Hochdeutsch.",
        "Kurze, präzise Sätze statt langer verschachtelter Formulierungen.",
        "Kein Slang oder umgangssprachliche Ausdrücke.",
        "Ruhiges, natürliches Tempo mit kurzen Pausen.",
        "Maximal eine fokussierte Frage pro Aussage.",
      ].join("\n"),
    ],
  };

  const [head, tail] = blocks[locale];

  return [
    head,
    "",
    "### KULLANICI TANIMI (ekrandan gelen tam metin)",
    clientPromptBundle.trim(),
    "",
    tail,
  ].join("\n");
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
    "Nisa/v3";

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

  if (!systemPromptRaw) {
    return NextResponse.json(
      { error: "Sistem promptu gereklidir." },
      { status: 400 },
    );
  }

  const rateGrant =
    body &&
    typeof body === "object" &&
    "rateGrant" in body &&
    typeof (body as { rateGrant?: unknown }).rateGrant === "string"
      ? (body as { rateGrant: string }).rateGrant.trim()
      : "";

  const ip = getClientIpFromHeaders(new Headers(request.headers));
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
  const enhancedPrompt = enhancePromptForVoiceCall(systemPromptRaw, locale);
  const lockedPrompt = `${localeSystemPrompt}${sectorPrompts ? `\n\n${sectorPrompts.systemPrompt}` : ""}\n\n${enhancedPrompt}\n\n${SERVER_LOCALE_LOCK[locale]}`;
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
  const voiceOverride = buildVoiceOverride(
    locale,
    voiceId || "Nisa/v3",
  );
  const transcriberOverride = buildTranscriberOverride(
    baseTranscriber,
    locale,
  );

  const assistantOverrides: Record<string, unknown> = {
    model: modelOverride,
    firstMessage: sectorPrompts?.firstMessage || localeFirstMessage,
    /** PSTN varsayılanı «office» ortam sesi — kapatılır. */
    backgroundSound: "off",
  };
  if (voiceOverride) {
    assistantOverrides.voice = voiceOverride;
  }
  if (transcriberOverride) {
    assistantOverrides.transcriber = transcriberOverride;
  }

  type VapiCallResult = {
    response: Response;
    rawText: string;
    parsed: unknown;
  };

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
        customer: { number: phoneE164 },
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
