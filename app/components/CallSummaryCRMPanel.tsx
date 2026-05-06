"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, CheckCircle2, FileText } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function CallSummaryCRMPanel({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.aside
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.35 }}
          className="fixed bottom-6 right-6 z-[120] w-[min(92vw,440px)] rounded-2xl border border-[#7c3aed]/45 bg-[#060606]/95 p-5 shadow-[0_0_0_1px_rgba(59,130,246,0.35),0_0_42px_-12px_rgba(124,58,237,0.8)] backdrop-blur-xl"
        >
          <h4 className="text-lg font-semibold text-zinc-100">Arama Ozeti ve CRM Kaydi</h4>
          <div className="mt-4 space-y-3 text-sm text-zinc-300">
            <p className="flex items-start gap-2"><FileText className="mt-0.5 h-4 w-4 text-sky-300" /> Musteri urun demosu ve entegrasyon zaman cizelgesi hakkında bilgi istedi.</p>
            <p className="flex items-start gap-2"><CalendarDays className="mt-0.5 h-4 w-4 text-violet-300" /> Randevu tarihi: 14 Mayis 2026, 10:30 CET.</p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="flex items-start gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-emerald-200"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4" />
              Veriler CRM sisteminize (HubSpot/Salesforce) basariyla islendi.
            </motion.p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-zinc-200 hover:bg-white/[0.08]"
          >
            Kapat
          </button>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
