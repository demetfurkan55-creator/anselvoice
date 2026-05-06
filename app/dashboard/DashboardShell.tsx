"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, BookOpenText, Megaphone, Sparkles } from "lucide-react";
import { AnselLogoMark } from "../components/AnselLogoMark";

const navItems = [
  { href: "/dashboard/live", label: "Canli Arama", Icon: Activity },
  { href: "/dashboard/knowledge", label: "AI Egitim Merkezi", Icon: BookOpenText },
  { href: "/dashboard/campaigns", label: "Toplu Kampanyalar", Icon: Megaphone },
] as const;

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-[100dvh] bg-[#040405] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_50%_45%_at_50%_0%,rgba(139,92,246,0.14),transparent_60%),radial-gradient(ellipse_35%_40%_at_100%_30%,rgba(59,130,246,0.12),transparent_65%)]" />
      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[1600px]">
        <aside className="sticky top-0 hidden h-[100dvh] w-72 shrink-0 border-r border-white/10 bg-black/55 p-5 backdrop-blur-xl lg:block">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3">
            <AnselLogoMark size="sm" />
            <div>
              <p className="text-sm font-semibold text-zinc-100">Ansel AI</p>
              <p className="text-xs text-zinc-500">SaaS Voice AI Platform</p>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {navItems.map(({ href, label, Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-all ${
                    active
                      ? "border-violet-400/55 bg-violet-500/10 text-white shadow-[0_0_0_1px_rgba(59,130,246,0.26),0_0_24px_-10px_rgba(124,58,237,0.75)]"
                      : "border-white/10 bg-white/[0.02] text-zinc-400 hover:border-white/20 hover:bg-white/[0.06] hover:text-zinc-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/35 p-3">
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-cyan-300/85">
              <Sparkles className="h-3.5 w-3.5" />
              Aurora Core
            </p>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500">
              Real-time call orchestration and AI coaching stream is active.
            </p>
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
