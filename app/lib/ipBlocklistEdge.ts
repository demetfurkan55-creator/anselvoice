import { parseBlockedIpsFromEnv } from "../../lib/ipBlockEnv";
import { isWhitelistedIp } from "./demoCallRateLimit";

/** Edge middleware — dosya sistemi yok; yalnızca env + beyaz liste. */
export function isIpBlockedEdge(ip: string): boolean {
  if (!ip || ip === "unknown") return false;
  if (isWhitelistedIp(ip)) return false;
  return parseBlockedIpsFromEnv().has(ip);
}
