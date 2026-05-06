"use client";

import { useMemo, useState, type DragEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Globe, UploadCloud } from "lucide-react";

type Resource = {
  id: string;
  name: string;
  status: "Egitiliyor" | "Egitildi";
};

export default function KnowledgePage() {
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [url, setUrl] = useState("");
  const [resources, setResources] = useState<Resource[]>([
    { id: "r1", name: "Iade_Politikasi.pdf", status: "Egitildi" },
    { id: "r2", name: "Musteri_Senaryolari.txt", status: "Egitildi" },
  ]);

  const accepted = useMemo(() => ".pdf,.docx,.txt", []);

  const simulateTrain = (names: string[]) => {
    const staged: Resource[] = names.map((name, i) => ({
      id: `${Date.now()}-${i}`,
      name,
      status: "Egitiliyor",
    }));
    setResources((prev) => [...staged, ...prev]);
    setProgress(0);

    let current = 0;
    const timer = setInterval(() => {
      current += 10;
      setProgress(Math.min(100, current));
      if (current >= 100) {
        clearInterval(timer);
        setResources((prev) =>
          prev.map((r) =>
            staged.some((s) => s.id === r.id) ? { ...r, status: "Egitildi" } : r,
          ),
        );
        setTimeout(() => setProgress(null), 800);
      }
    }, 180);
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length > 0) {
      simulateTrain(files.map((f) => f.name));
    }
  };

  return (
    <section>
      <div className="rounded-2xl border border-white/10 bg-black/45 p-5 backdrop-blur-xl sm:p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/85">Custom Knowledge Base / RAG</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100">Yapay Zeka Egitim Merkezi</h1>
      </div>

      <label
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`mt-5 block cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
          dragging
            ? "border-violet-400 bg-violet-500/10 shadow-[0_0_0_1px_rgba(59,130,246,0.25),0_0_38px_-12px_rgba(124,58,237,0.95)]"
            : "border-white/20 bg-[#090909]/95 hover:border-cyan-400/70 hover:shadow-[0_0_0_1px_rgba(56,189,248,0.2),0_0_30px_-14px_rgba(56,189,248,0.8)]"
        }`}
      >
        <input
          type="file"
          multiple
          accept={accepted}
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            if (files.length > 0) {
              simulateTrain(files.map((f) => f.name));
            }
          }}
        />
        <UploadCloud className="mx-auto h-10 w-10 text-violet-300" />
        <p className="mt-3 text-sm text-zinc-200">Dosyalari surukleyip birakin veya secmek icin tiklayin</p>
        <p className="mt-1 text-xs text-zinc-500">PDF, DOCX, TXT desteklenir</p>
      </label>

      <div className="mt-4 rounded-2xl border border-white/10 bg-[#090909]/95 p-4">
        <label className="text-xs uppercase tracking-[0.14em] text-zinc-500">Web Kaynagi</label>
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3">
          <Globe className="h-4 w-4 text-cyan-300" />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Web Sitenizin URL'sini Girin (Orn: www.sirketiniz.com/sss)"
            className="h-11 w-full bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-600"
          />
        </div>
      </div>

      <AnimatePresence>
        {progress !== null ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-4 rounded-2xl border border-violet-400/30 bg-violet-500/10 p-4"
          >
            <p className="text-sm font-medium text-zinc-100">Yapay Zeka Egitiliyor...</p>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-black/50">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
                animate={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mt-5 rounded-2xl border border-white/10 bg-[#090909]/95 p-4">
        <h2 className="text-sm font-semibold text-zinc-200">Aktif Kaynaklar</h2>
        <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="flex items-center justify-between border-b border-white/10 px-3 py-2.5 text-sm last:border-0"
            >
              <p className="flex items-center gap-2 text-zinc-300">
                <FileText className="h-4 w-4 text-cyan-300" />
                {resource.name}
              </p>
              <p className="text-xs text-zinc-400">
                Durum: {resource.status === "Egitildi" ? "Egitildi ✅" : "Egitiliyor..."}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
