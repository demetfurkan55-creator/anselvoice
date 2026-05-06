"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PlayCircle } from "lucide-react";

type Stats = {
  reached: number;
  voicemail: number;
  sales: number;
};

const targetStats: Stats = {
  reached: 450,
  voicemail: 120,
  sales: 85,
};

export default function CampaignsPage() {
  const [step, setStep] = useState(1);
  const [scenario, setScenario] = useState("");
  const [csvName, setCsvName] = useState("");
  const [running, setRunning] = useState(false);
  const [stats, setStats] = useState<Stats>({ reached: 0, voicemail: 0, sales: 0 });

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setStats((prev) => ({
        reached: Math.min(targetStats.reached, prev.reached + 28),
        voicemail: Math.min(targetStats.voicemail, prev.voicemail + 8),
        sales: Math.min(targetStats.sales, prev.sales + 5),
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, [running]);

  const progressPercent = useMemo(() => (step / 3) * 100, [step]);

  return (
    <section>
      <div className="rounded-2xl border border-white/10 bg-black/45 p-5 backdrop-blur-xl sm:p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/85">Bulk Outbound Dialer</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100">Kampanya Olusturma Sihirbazi</h1>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-[#090909]/95 p-4">
        <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Adim {step}/3</p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/40">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-violet-500"
            animate={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.28 }}
          className="mt-5 rounded-2xl border border-white/10 bg-[#090909]/95 p-5"
        >
          {step === 1 ? (
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">Adim 1: Musteri Listesi Yukleme</h2>
              <p className="mt-2 text-sm text-zinc-500">CSV dosyasi ile 1.000+ musteri numarasi yukleyin.</p>
              <label className="mt-4 inline-flex cursor-pointer items-center rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm text-zinc-200 hover:bg-white/[0.08]">
                CSV Upload
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => setCsvName(e.target.files?.[0]?.name ?? "")}
                />
              </label>
              {csvName ? <p className="mt-2 text-sm text-cyan-300">{csvName}</p> : null}
              <button
                type="button"
                onClick={() => setStep(2)}
                className="mt-5 block rounded-xl border border-violet-400/35 bg-gradient-to-r from-violet-600/90 to-blue-600/90 px-4 py-2 text-sm font-medium text-white"
              >
                Devam Et
              </button>
            </div>
          ) : null}

          {step === 2 ? (
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">Adim 2: Kampanya Senaryosu</h2>
              <textarea
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                placeholder="Orn: Musterilere %20 indirim kodunu sun ve satin alip almayacaklarini sor."
                className="mt-4 min-h-40 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-cyan-400/60"
              />
              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2 text-sm text-zinc-200"
                >
                  Geri
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="rounded-xl border border-violet-400/35 bg-gradient-to-r from-violet-600/90 to-blue-600/90 px-4 py-2 text-sm font-medium text-white"
                >
                  Istatisiklere Gec
                </button>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">Adim 3: Canli Istatistik</h2>
              <p className="mt-2 text-sm text-zinc-500">1.000 kisilik toplu arama simule edilir.</p>
              <button
                type="button"
                onClick={() => {
                  setStats({ reached: 0, voicemail: 0, sales: 0 });
                  setRunning(true);
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-violet-400/35 bg-gradient-to-r from-rose-600/90 to-violet-600/90 px-4 py-2 text-sm font-semibold text-white"
              >
                <PlayCircle className="h-4 w-4" />
                Aramayi Baslat
              </button>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <StatCard label="Ulasilan" value={stats.reached} />
                <StatCard label="Sesli Mesaj" value={stats.voicemail} />
                <StatCard label="Basarili Satis" value={stats.sales} />
              </div>
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-white/10 bg-black/45 p-4"
    >
      <p className="text-xs uppercase tracking-[0.12em] text-zinc-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-zinc-100">{value}</p>
    </motion.div>
  );
}
