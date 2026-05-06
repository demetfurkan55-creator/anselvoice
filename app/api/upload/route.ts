import { NextResponse } from "next/server";

/**
 * TODO: Upload endpoint taslagi
 * - Multipart parser ile PDF/DOCX/TXT dosyalarini alin
 * - Dosyalari object storage'a (S3/R2/GCS) kaydedin
 * - Queue uzerinden embedding + chunk islemi tetikleyin
 * - Durum bilgisini "training_jobs" tablosunda tutun
 */
export async function POST() {
  return NextResponse.json({
    ok: true,
    message: "Upload API taslagi hazir. Entegrasyon bekleniyor.",
  });
}
