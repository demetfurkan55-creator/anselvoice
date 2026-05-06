"use client";

import { motion } from "framer-motion";

export function AudioWaveform() {
  const baseHeights = [8, 14, 10, 18, 12, 20, 9, 16, 11, 19, 13, 17, 10, 21, 12, 15, 9, 14];
  return (
    <div className="mt-3 h-[52px] rounded-xl border border-white/10 bg-black/45 px-3">
      <div className="flex h-full items-end justify-center gap-1.5 overflow-hidden pb-2">
        {baseHeights.map((h, i) => (
          <motion.span
            key={i}
            className="inline-block w-1 rounded-full bg-gradient-to-t from-cyan-400 to-violet-500"
            animate={{ height: [h, h + 3 + (i % 3), h + 1, h] }}
            transition={{
              duration: 1.8 + (i % 5) * 0.14,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.05,
            }}
          />
        ))}
      </div>
    </div>
  );
}
