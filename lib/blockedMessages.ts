import type { CallLocale } from "./callLocale";

const SITE_BLOCKED: Record<CallLocale, string> = {
  tr: "Erişiminiz güvenlik nedeniyle engellenmiştir.",
  en: "Your access has been blocked for security reasons.",
  de: "Ihr Zugriff wurde aus Sicherheitsgründen gesperrt.",
};

export function blockedSiteMessage(
  locale: CallLocale | string | null | undefined,
): string {
  if (locale === "tr" || locale === "en" || locale === "de") {
    return SITE_BLOCKED[locale];
  }
  return SITE_BLOCKED.en;
}
