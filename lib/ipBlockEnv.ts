/** Ortak: BLOCKED_IPS ortam değişkeni (Edge + Node). */
export function parseBlockedIpsFromEnv(): Set<string> {
  const raw = process.env.BLOCKED_IPS?.trim();
  if (!raw) return new Set();
  return new Set(
    raw
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter(Boolean),
  );
}
