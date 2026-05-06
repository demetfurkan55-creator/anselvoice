import { headers } from "next/headers";
import HomeClient from "./home-client";
import type { AppLocale } from "@/lib/localeResolve";
import { isAppLocale } from "@/lib/localeResolve";

export default async function HomePage() {
  const h = await headers();
  const raw = h.get("x-ansel-locale");
  const initialLocale: AppLocale = isAppLocale(raw) ? raw : "en";

  return <HomeClient initialLocale={initialLocale} />;
}
