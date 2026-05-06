import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { blockedSiteMessage } from "./lib/blockedMessages";
import { isIpBlockedEdge } from "./app/lib/ipBlocklistEdge";
import {
  readGeoCountry,
  resolveLocaleFromRequest,
  type AppLocale,
} from "./lib/localeResolve";

const LOCALE_HEADER = "x-ansel-locale";
export const LOCALE_COOKIE = "ansel-locale";

function applyLocaleResolution(request: NextRequest): {
  locale: AppLocale;
  response: NextResponse;
} {
  const resolved = resolveLocaleFromRequest({
    cookieLocale: request.cookies.get(LOCALE_COOKIE)?.value,
    acceptLanguage: request.headers.get("accept-language"),
    country: readGeoCountry(request.headers),
  });

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, resolved);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const oneYear = 60 * 60 * 24 * 365;
  response.cookies.set(LOCALE_COOKIE, resolved, {
    maxAge: oneYear,
    path: "/",
    sameSite: "lax",
  });

  return { locale: resolved, response };
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  return forwarded || realIp || "unknown";
}

export function middleware(request: NextRequest) {
  const ip = getClientIp(request);
  if (isIpBlockedEdge(ip)) {
    const locale = resolveLocaleFromRequest({
      cookieLocale: request.cookies.get(LOCALE_COOKIE)?.value,
      acceptLanguage: request.headers.get("accept-language"),
      country: readGeoCountry(request.headers),
    });
    return new NextResponse(blockedSiteMessage(locale), {
      status: 403,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  return applyLocaleResolution(request).response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
