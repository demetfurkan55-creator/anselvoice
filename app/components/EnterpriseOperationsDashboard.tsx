"use client";

import { motion } from "framer-motion";

const lineData = [28, 31, 29, 36, 40, 42, 47, 51, 56, 61, 66, 72, 75, 82];

function buildPath(values: number[]) {
  const w = 460;
  const h = 180;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = Math.max(1, max - min);
  return values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / span) * h;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

export function EnterpriseOperationsDashboard() {
  const linePath = buildPath(lineData);
  const donut = 70;
  const neutral = 25;
  const angry = 5;
  const circumference = 2 * Math.PI * 52;
  const happyLen = (donut / 100) * circumference;
  const neutralLen = (neutral / 100) * circumference;
  const angryLen = (angry / 100) * circumference;

  return (
    <motion.section
      initial={{ opacity: 0, y: 64 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ type: "spring", damping: 24, stiffness: 135 }}
      className="mt-12 w-full rounded-3xl border border-white/10 bg-black/55 p-5 backdrop-blur-xl sm:p-7"
    >
      <motion.h3
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="text-xl font-semibold tracking-tight text-zinc-100 sm:text-2xl"
      >
        Enterprise Operations Dashboard
      </motion.h3>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {[
          ["Toplam Arama Dakikasi", "128,420 dk"],
          ["Basarili Randevu Orani", "%68"],
          ["Yapay Zeka Yanit Hizi", "<500ms"],
        ].map(([k, v]) => (
          <motion.div
            key={k}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.38 }}
            className="rounded-2xl border border-[#7c3aed]/35 bg-[#0a0a0a] p-4 shadow-[0_0_0_1px_rgba(59,130,246,0.22),0_0_28px_-14px_rgba(124,58,237,0.65)]"
          >
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">{k}</p>
            <p className="mt-2 text-2xl font-semibold text-zinc-100">{v}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4"
        >
          <p className="text-sm font-medium text-zinc-300">Son 30 Gunluk Maliyet Tasarrufu</p>
          <p className="mt-1 text-xs text-emerald-300">%82 artış</p>
          <svg viewBox="0 0 460 190" className="mt-3 w-full">
            <defs>
              <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            <path d={linePath} fill="none" stroke="url(#line-grad)" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4"
        >
          <p className="text-sm font-medium text-zinc-300">Sentiment Analysis</p>
          <div className="mt-3 flex items-center justify-center">
            <svg viewBox="0 0 140 140" className="h-36 w-36 -rotate-90">
              <circle cx="70" cy="70" r="52" stroke="#1f1f1f" strokeWidth="16" fill="none" />
              <circle cx="70" cy="70" r="52" stroke="#22c55e" strokeWidth="16" fill="none" strokeDasharray={`${happyLen} ${circumference}`} strokeLinecap="round" />
              <circle cx="70" cy="70" r="52" stroke="#60a5fa" strokeWidth="16" fill="none" strokeDasharray={`${neutralLen} ${circumference}`} strokeDashoffset={-happyLen} strokeLinecap="round" />
              <circle cx="70" cy="70" r="52" stroke="#f43f5e" strokeWidth="16" fill="none" strokeDasharray={`${angryLen} ${circumference}`} strokeDashoffset={-(happyLen + neutralLen)} strokeLinecap="round" />
            </svg>
          </div>
          <div className="mt-2 space-y-1 text-xs text-zinc-400">
            <p>Mutlu %70</p>
            <p>Notr %25</p>
            <p>Ofkeli %5</p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
