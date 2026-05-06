import { NextResponse } from "next/server";

/** Demo / iletişim talebi — üretimde CRM veya e-posta ile bağlanır. */
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

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Geçersiz gövde." }, { status: 400 });
  }

  const o = body as Record<string, unknown>;

  const phone = typeof o.phone === "string" ? o.phone.trim() : "";
  const consentContact = o.consentContact === true;
  const consentKvkk = o.consentKvkk === true;

  if (!phone) {
    return NextResponse.json(
      { error: "Telefon numarası gereklidir." },
      { status: 400 },
    );
  }
  if (!consentContact || !consentKvkk) {
    return NextResponse.json(
      { error: "Açık rıza onayları gereklidir." },
      { status: 400 },
    );
  }

  if (process.env.NODE_ENV === "development") {
    console.info("[lead]", JSON.stringify(body));
  }

  return NextResponse.json({ ok: true });
}
