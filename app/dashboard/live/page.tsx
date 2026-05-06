"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Ear, PhoneCall, PhoneForwarded } from "lucide-react";

type LiveCall = {
  id: string;
  phone: string;
  seconds: number;
};

const initialCalls: LiveCall[] = [
  { id: "c1", phone: "+90 532 111 20 34", seconds: 98 },
  { id: "c2", phone: "+49 151 222 54 89", seconds: 213 },
  { id: "c3", phone: "+44 7400 555 781", seconds: 47 },
];

function formatDuration(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

function MiniWave() {
  return (
    <div className="flex items-end gap-1">
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.span
          key={i}
          className="inline-block w-1 rounded-full bg-gradient-to-t from-cyan-400 to-violet-500"
          animate={{ height: [6, 12 + (i % 4) * 6, 8] }}
          transition={{ duration: 0.75 + (i % 5) * 0.08, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

export default function LiveCallsPage() {
  const [calls, setCalls] = useState(initialCalls);
  const [handoffCall, setHandoffCall] = useState<LiveCall | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCalls((prev) => prev.map((c) => ({ ...c, seconds: c.seconds + 1 })));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeCount = useMemo(() => calls.length, [calls.length]);

  return (
    <section>
      <div className="rounded-2xl border border-white/10 bg-black/45 p-5 backdrop-blur-xl sm:p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/85">Human-in-the-Loop</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100">Canli Arama Yonetimi</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Devam eden cagri: <span className="font-semibold text-zinc-200">{activeCount}</span>
        </p>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-[#090909]/95">
        <div className="grid grid-cols-12 border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.14em] text-zinc-500">
          <p className="col-span-4">Musteri Numarasi</p>
          <p className="col-span-2">Sure</p>
          <p className="col-span-3">Canli Waveform</p>
          <p className="col-span-3">Aksiyon</p>
        </div>
        <ul>
          {calls.map((call) => (
            <motion.li
              key={call.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-12 items-center gap-2 border-b border-white/5 px-4 py-3.5 last:border-0"
            >
              <p className="col-span-4 text-sm text-zinc-200">{call.phone}</p>
              <p className="col-span-2 text-sm text-zinc-300">{formatDuration(call.seconds)}</p>
              <div className="col-span-3"><MiniWave /></div>
              <div className="col-span-3 flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-white/[0.08]"
                >
                  <Ear className="h-3.5 w-3.5" />
                  Sessiz Dinle
                </button>
                <button
                  type="button"
                  onClick={() => setHandoffCall(call)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-fuchsia-400/35 bg-gradient-to-r from-rose-600/85 to-violet-600/85 px-3 py-2 text-xs font-semibold text-white shadow-[0_0_20px_-10px_rgba(244,63,94,0.9)] hover:brightness-110"
                >
                  <PhoneForwarded className="h-3.5 w-3.5" />
                  Aramayi Devral
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {handoffCall ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[130] flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.97, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl border border-violet-400/40 bg-[#0b0b0b] p-6 text-center shadow-[0_0_0_1px_rgba(59,130,246,0.25),0_0_38px_-10px_rgba(124,58,237,0.8)]"
            >
              <PhoneCall className="mx-auto h-8 w-8 text-rose-300" />
              <h2 className="mt-4 text-xl font-semibold text-zinc-100">Yapay Zeka susturuldu, mikrofon sizde!</h2>
              <p className="mt-2 text-sm text-zinc-400">Aktif cagri: {handoffCall.phone}</p>
              <button
                type="button"
                onClick={() => setHandoffCall(null)}
                className="mt-6 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2 text-sm text-zinc-200 hover:bg-white/[0.08]"
              >
                Devam Et
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
