import type { CallLocale } from "../../lib/callLocale";

export type AbuseScanResult =
  | { ok: true }
  | {
      ok: false;
      reason: "profanity" | "fraud" | "manipulation";
    };

const MANIPULATION_PATTERNS: RegExp[] = [
  /\bignore\s+(all\s+)?(previous|prior)\s+instructions?\b/i,
  /\bdisregard\s+(the\s+)?(system|above)\b/i,
  /\byou\s+are\s+now\b/i,
  /\bnew\s+instructions?\s*:/i,
  /\bsystem\s+prompt\b/i,
  /\bjailbreak\b/i,
  /\bDAN\b/i,
  /\boverride\s+(the\s+)?rules?\b/i,
  /\bpretend\s+(you\s+are|to\s+be)\b/i,
  /\bdeveloper\s+mode\b/i,
  /\bunfiltered\s+mode\b/i,
  /\bshow\s+(me\s+)?(the\s+)?(hidden|secret)\s+prompt\b/i,
  /önceki\s+talimatları\s+yoksay/i,
  /sistem\s+promptu(?:nu)?\s+göster/i,
  /gizli\s+talimat/i,
  /kuralları\s+iptal/i,
  /rol\s+değiştir/i,
  /yeni\s+kimlik/i,
  /vorherige\s+anweisungen\s+ignorieren/i,
  /system\s*\-?prompt\s+anzeigen/i,
  /regeln\s+außer\s+kraft/i,
  /tue\s+so\s+als\s+ob\s+du\b/i,
];

const FRAUD_PATTERNS: RegExp[] = [
  /\bwestern\s+union\b/i,
  /\bmoneygram\b/i,
  /\bgift\s*card\b/i,
  /\bwire\s+transfer\b/i,
  /\bcrypto\s+wallet\b/i,
  /\bverify\s+your\s+(card|account|identity)\b/i,
  /\bone\s*time\s+password\b/i,
  /\bOTP\b/i,
  /\bPIN\b.*\bcode\b/i,
  /\bIBAN\b.*\b(verify|confirm|send)\b/i,
  /\bphish/i,
  /\bspear\s*phish/i,
  /\bbank\s+login\b/i,
  /\bcredential\s+harvest/i,
  /\bkart\s+şifrenizi\b/i,
  /\biban(?:ınız)?\s+(?:gönder|paylaş|yaz)/i,
  /\bkripto\s+cüzdan/i,
  /\bhavale\s+ile\s+gönder/i,
  /\bdolandır/i,
  /\bidentitätsdiebstahl/i,
  /\bBankpin\b/i,
  /\bKarten(?:nummer|pin)\b/i,
  /\bÜberweisung\s+an\s+fremde\b/i,
];

const PROFANITY_PATTERNS: RegExp[] = [
  /\b(fuck|shit|bitch|cunt|nigg[ae]|retard|whore)\b/i,
  /\b(scheiße|scheiss|fick|hurensohn|wichser)\b/i,
  /\b(arschloch|nutte)\b/i,
  /\b(amk|aq|orospu|piç|siktir|yarrak|göt)\b/i,
  /\b(ibne|kahpe)\b/i,
];

function matchesAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((re) => re.test(text));
}

export function scanPromptForAbuse(text: string): AbuseScanResult {
  const normalized = text.trim();
  if (!normalized) return { ok: true };

  if (matchesAny(normalized, MANIPULATION_PATTERNS)) {
    return { ok: false, reason: "manipulation" };
  }
  if (matchesAny(normalized, FRAUD_PATTERNS)) {
    return { ok: false, reason: "fraud" };
  }
  if (matchesAny(normalized, PROFANITY_PATTERNS)) {
    return { ok: false, reason: "profanity" };
  }

  return { ok: true };
}

const MESSAGES: Record<
  CallLocale,
  Record<"profanity" | "fraud" | "manipulation", string>
> = {
  tr: {
    profanity:
      "İçerik güvenlik kurallarına uymuyor. Bu oturum sonlandırıldı ve erişiminiz engellendi.",
    fraud:
      "Dolandırıcılık veya hassas veri toplamaya yönelik içerik algılandı. Erişiminiz kalıcı olarak engellendi.",
    manipulation:
      "Sistem talimatlarını aşmaya yönelik içerik algılandı. Erişiminiz engellendi.",
  },
  en: {
    profanity:
      "Your content violates our safety rules. Access has been permanently blocked.",
    fraud:
      "Content suggesting fraud or credential harvesting was detected. Access has been permanently blocked.",
    manipulation:
      "Attempted instruction override was detected. Access has been permanently blocked.",
  },
  de: {
    profanity:
      "Inhalt verstößt gegen Sicherheitsregeln. Der Zugriff wurde dauerhaft gesperrt.",
    fraud:
      "Inhalte mit Betrugs- oder Phishing-Charakter wurden erkannt. Der Zugriff wurde dauerhaft gesperrt.",
    manipulation:
      "Versuch, Systemvorgaben zu umgehen, wurde erkannt. Der Zugriff wurde gesperrt.",
  },
};

export function abuseMessageForLocale(
  result: Extract<AbuseScanResult, { ok: false }>,
  locale: CallLocale,
): string {
  return MESSAGES[locale][result.reason];
}
