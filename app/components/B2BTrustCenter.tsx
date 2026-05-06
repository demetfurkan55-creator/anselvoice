"use client";

import { motion } from "framer-motion";
import { Lock, ShieldCheck, Database } from "lucide-react";

const badges = [
  {
    title: "GDPR Uyumlu",
    description: "AB veri yönetişimi, denetime hazır sözleşme kontrolleri ve Avrupa veri bölgeleri.",
    Icon: ShieldCheck,
  },
  {
    title: "KVKK Uyumlu",
    description: "Türkiye regülasyonlarına uygun açık rıza ve saklama politikaları.",
    Icon: Lock,
  },
  {
    title: "Enterprise Security AES-256",
    description: "Aktarımda ve depolamada veriler kurumsal seviye AES-256 şifreleme ile korunur.",
    Icon: Database,
  },
] as const;

export function B2BTrustCenter({ compact = false }: { compact?: boolean }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-black/45 p-4 backdrop-blur-xl sm:p-5">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35 }}
        className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/85"
      >
        Global Trust Center
      </motion.p>
      <p className="mt-2 text-sm text-zinc-400">
        Global ölçekte güven, şeffaf veri yönetişimi, sürekli güvenlik denetimi ve Avrupa sunucularında veri barındırma.
      </p>
      <div
        className={`mt-4 grid gap-3 ${compact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}
      >
        {badges.map(({ title, description, Icon }) => (
          <motion.article
            key={title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.36 }}
            className="rounded-xl border border-[#7c3aed]/35 bg-[#0b0b0b] p-3.5 shadow-[0_0_0_1px_rgba(59,130,246,0.2),0_0_26px_-14px_rgba(124,58,237,0.65)]"
          >
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-sky-300">
                <Icon className="h-4 w-4" />
              </span>
              <p className="text-sm font-semibold text-zinc-100">{title}</p>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500">{description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
