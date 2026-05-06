export type AppLocale = "tr" | "en" | "de";

/** Almanya ve Almanca odaklı pazarlar (Geo-IP). */
const GERMAN_MARKET_COUNTRIES = new Set([
  "DE",
  "AT",
  "CH",
  "LI",
]);

export function isAppLocale(s: string | null | undefined): s is AppLocale {
  return s === "tr" || s === "en" || s === "de";
}

function parseAcceptLanguage(header: string | null): string[] {
  if (!header?.trim()) return [];
  return header
    .split(",")
    .map((part) => {
      const [tag] = part.trim().split(";");
      return tag.trim().toLowerCase();
    })
    .filter(Boolean);
}

function primaryLang(tag: string): string {
  return (tag.split("-")[0] ?? tag).toLowerCase();
}

/**
 * Çerez yokken: tr veya Türkiye → TR; de veya Almanca odaklı pazar → DE; aksi halde EN.
 */
export function detectLocaleFromSignals(input: {
  acceptLanguage: string | null;
  country: string | null;
}): AppLocale {
  const country = (input.country ?? "").trim().toUpperCase();
  const tags = parseAcceptLanguage(input.acceptLanguage);

  for (const tag of tags) {
    if (primaryLang(tag) === "tr") return "tr";
  }
  if (country === "TR") return "tr";

  for (const tag of tags) {
    if (primaryLang(tag) === "de") return "de";
  }
  if (GERMAN_MARKET_COUNTRIES.has(country)) return "de";

  return "en";
}

export function resolveLocaleFromRequest(input: {
  cookieLocale: string | null | undefined;
  acceptLanguage: string | null;
  country: string | null;
}): AppLocale {
  if (isAppLocale(input.cookieLocale)) return input.cookieLocale;
  return detectLocaleFromSignals(input);
}

export function readGeoCountry(
  headers: Headers | Pick<Headers, "get">,
): string | null {
  const h = headers.get.bind(headers);
  return (
    h("cf-ipcountry") ??
    h("x-vercel-ip-country") ??
    h("cloudfront-viewer-country") ??
    null
  );
}

export function persistLocaleClientCookie(locale: AppLocale): void {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `ansel-locale=${locale}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}
