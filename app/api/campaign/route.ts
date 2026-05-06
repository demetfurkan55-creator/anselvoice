import { NextResponse } from "next/server";

/**
 * TODO: Campaign endpoint taslagi
 * - CSV listesini parse edip numara dogrulamasi yapin
 * - Kampanya senaryosunu call script'e donusturun
 * - Dialer worker'a batch job olusturun
 * - Canli istatistikleri websocket/sse ile yayinlayin
 */
export async function POST() {
  return NextResponse.json({
    ok: true,
    message: "Campaign API taslagi hazir. Worker entegrasyonu bekleniyor.",
  });
}
