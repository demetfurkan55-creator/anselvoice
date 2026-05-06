import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { parseBlockedIpsFromEnv } from "../../lib/ipBlockEnv";
import { isWhitelistedIp } from "./demoCallRateLimit";

const BLOCK_FILE = path.join(process.cwd(), "data", "blocked-ips.json");

const memoryBlocked = new Set<string>();

async function readBlockedFile(): Promise<Set<string>> {
  try {
    if (!existsSync(BLOCK_FILE)) return new Set();
    const text = await readFile(BLOCK_FILE, "utf8");
    const data = JSON.parse(text) as unknown;
    if (!Array.isArray(data)) return new Set();
    return new Set(data.filter((x): x is string => typeof x === "string"));
  } catch {
    return new Set();
  }
}

/** Node.js path / grant dosyası + env + bu süreçte eklenenler. */
export async function isIpBlocked(ip: string): Promise<boolean> {
  if (!ip || ip === "unknown") return false;
  if (isWhitelistedIp(ip)) return false;
  if (memoryBlocked.has(ip)) return true;
  if (parseBlockedIpsFromEnv().has(ip)) return true;
  const fromFile = await readBlockedFile();
  for (const x of fromFile) memoryBlocked.add(x);
  return memoryBlocked.has(ip);
}

export async function blockIpPersist(ip: string): Promise<void> {
  if (!ip || ip === "unknown") return;
  if (isWhitelistedIp(ip)) return;
  memoryBlocked.add(ip);
  const dir = path.dirname(BLOCK_FILE);
  await mkdir(dir, { recursive: true });
  const merged = await readBlockedFile();
  merged.add(ip);
  await writeFile(
    BLOCK_FILE,
    JSON.stringify([...merged].sort(), null, 2),
    "utf8",
  );
}
