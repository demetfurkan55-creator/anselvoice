import { NextResponse } from "next/server";
import type { CallLocale } from "@/lib/callLocale";
import { blockedSiteMessage } from "@/lib/blockedMessages";
import {
  getClientIpFromHeaders,
  issueRateGrant,
} from "../../lib/demoCallRateLimit";
import { isIpBlocked } from "../../lib/ipBlocklist";

function parseLocale(body: unknown): CallLocale {
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

export async function POST(request: Request) {
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const phoneNumber =
    body &&
    typeof body === "object" &&
    "phoneNumber" in body &&
    typeof (body as { phoneNumber?: unknown }).phoneNumber === "string"
      ? (body as { phoneNumber: string }).phoneNumber
      : "";

  const ip = getClientIpFromHeaders(new Headers(request.headers));
  const locale = parseLocale(body);

  if (await isIpBlocked(ip)) {
    return NextResponse.json(
      { error: blockedSiteMessage(locale) },
      { status: 403 },
    );
  }

  const grant = issueRateGrant({ ip, phone: phoneNumber });

  if (!grant.ok) {
    return NextResponse.json(
      {
        error:
          grant.reason ??
          "Güvenlik Önlemi: Demo arama limitinize (2/2) ulaştınız. Daha fazlası için lütfen satış ekibimizle görüşün.",
      },
      { status: 429 },
    );
  }

  return NextResponse.json({
    grantId: grant.grantId,
    remaining: grant.remaining ?? 0,
  });
}

