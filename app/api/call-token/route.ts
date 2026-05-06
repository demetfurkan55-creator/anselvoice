import { NextResponse } from "next/server";
import {
  getClientIpFromHeaders,
  issueRateGrant,
} from "../../lib/demoCallRateLimit";

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

