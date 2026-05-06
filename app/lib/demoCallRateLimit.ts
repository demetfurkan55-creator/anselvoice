const MAX_DEMO_CALLS = 2;
const GRANT_TTL_MS = 2 * 60 * 1000;
const WHITELISTED_TEST_PHONES = new Set<string>([
  "905365575190",
]);

/** Bu IP’ler için demo arama sayacı / kota uygulanmaz (kurulum ve VIP erişim). */
const WHITELISTED_IPS = new Set<string>(["188.119.40.45"]);

export function isWhitelistedIp(ip: string): boolean {
  const trimmed = ip.trim();
  return trimmed.length > 0 && WHITELISTED_IPS.has(trimmed);
}

type RateStore = {
  counters: Map<string, number>;
  grants: Map<string, { ip: string; phone: string; expiresAt: number }>;
};

function getStore(): RateStore {
  const g = globalThis as typeof globalThis & { __anselDemoRateStore?: RateStore };
  if (!g.__anselDemoRateStore) {
    g.__anselDemoRateStore = {
      counters: new Map(),
      grants: new Map(),
    };
  }
  return g.__anselDemoRateStore;
}

export function getClientIpFromHeaders(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = headers.get("x-real-ip")?.trim();
  return forwarded || realIp || "unknown";
}

function normalizePhone(phone?: string): string {
  if (!phone) return "";
  return phone.replace(/\D/g, "").trim();
}

function isWhitelistedPhone(phone?: string): boolean {
  const normalized = normalizePhone(phone);
  return normalized.length > 0 && WHITELISTED_TEST_PHONES.has(normalized);
}

function keyIp(ip: string): string {
  return `ip:${ip}`;
}

function keyPhone(phone: string): string {
  return `phone:${phone}`;
}

function getCount(key: string): number {
  return getStore().counters.get(key) ?? 0;
}

function cleanupGrants(now = Date.now()) {
  const store = getStore();
  for (const [grantId, grant] of store.grants.entries()) {
    if (grant.expiresAt <= now) {
      store.grants.delete(grantId);
    }
  }
}

export function issueRateGrant(input: { ip: string; phone?: string }): {
  ok: boolean;
  grantId?: string;
  remaining?: number;
  reason?: string;
} {
  if (isWhitelistedPhone(input.phone)) {
    return {
      ok: true,
      grantId: `grant_whitelist_${Date.now()}`,
      remaining: MAX_DEMO_CALLS,
    };
  }

  const ip = input.ip || "unknown";
  if (isWhitelistedIp(ip)) {
    return {
      ok: true,
      grantId: `grant_whitelist_ip_${Date.now()}`,
      remaining: MAX_DEMO_CALLS,
    };
  }

  const phone = normalizePhone(input.phone);
  const ipCount = getCount(keyIp(ip));
  const phoneCount = phone ? getCount(keyPhone(phone)) : 0;
  const currentMax = Math.max(ipCount, phoneCount);

  if (currentMax >= MAX_DEMO_CALLS) {
    return {
      ok: false,
      reason:
        "Güvenlik Önlemi: Demo arama limitinize (2/2) ulaştınız. Daha fazlası için lütfen satış ekibimizle görüşün.",
      remaining: 0,
    };
  }

  cleanupGrants();
  const grantId = `grant_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  getStore().grants.set(grantId, {
    ip,
    phone,
    expiresAt: Date.now() + GRANT_TTL_MS,
  });

  return {
    ok: true,
    grantId,
    remaining: Math.max(0, MAX_DEMO_CALLS - currentMax),
  };
}

export function consumeRateGrant(input: {
  grantId?: string;
  ip: string;
  phone?: string;
}): { ok: boolean; reason?: string; remaining?: number } {
  if (isWhitelistedPhone(input.phone)) {
    return { ok: true, remaining: MAX_DEMO_CALLS };
  }

  const ip = input.ip || "unknown";
  if (isWhitelistedIp(ip)) {
    return { ok: true, remaining: MAX_DEMO_CALLS };
  }

  const phone = normalizePhone(input.phone);
  cleanupGrants();

  const store = getStore();
  const ipKey = keyIp(ip);
  const phoneKey = phone ? keyPhone(phone) : "";
  const ipCount = getCount(ipKey);
  const phoneCount = phone ? getCount(phoneKey) : 0;
  const currentMax = Math.max(ipCount, phoneCount);

  if (currentMax >= MAX_DEMO_CALLS) {
    return {
      ok: false,
      reason:
        "Güvenlik Önlemi: Demo arama limitinize (2/2) ulaştınız. Daha fazlası için lütfen satış ekibimizle görüşün.",
      remaining: 0,
    };
  }

  const grantId = input.grantId?.trim();
  if (grantId) {
    const grant = store.grants.get(grantId);
    if (!grant) {
      return { ok: false, reason: "Geçersiz veya süresi dolmuş çağrı yetkisi." };
    }
    if (grant.ip !== ip || grant.phone !== phone) {
      return { ok: false, reason: "Çağrı yetkisi bu istek ile eşleşmiyor." };
    }
    store.grants.delete(grantId);
  }

  store.counters.set(ipKey, ipCount + 1);
  if (phone) {
    store.counters.set(phoneKey, phoneCount + 1);
  }

  const nextMax = Math.max(ipCount + 1, phone ? phoneCount + 1 : ipCount + 1);
  return { ok: true, remaining: Math.max(0, MAX_DEMO_CALLS - nextMax) };
}

