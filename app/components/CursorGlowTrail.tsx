"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type DotParticle = {
  id: number;
  kind: "dot";
  x: number;
  y: number;
  intensity: number;
  coarse: boolean;
};

type SmokeParticle = {
  id: number;
  kind: "smoke";
  x: number;
  y: number;
  intensity: number;
  size: number;
  rot: number;
  bias: "lime" | "violet" | "split";
};

type TrailParticle = DotParticle | SmokeParticle;

const MAX_ITEMS = 100;
const FADE_SMOKE = 0.22;
const FADE_DOT = 0.14;

export function CursorGlowTrail() {
  const reducedMotion = useReducedMotion();
  const [particles, setParticles] = useState<TrailParticle[]>([]);
  const idRef = useRef(0);
  const lastRef = useRef({ x: -99999, y: -99999, t: 0 });
  const dedupeRef = useRef({ t: 0, x: 0, y: 0 });

  const remove = useCallback((id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const spawnPair = useCallback(
    (clientX: number, clientY: number, source: "fine" | "coarse") => {
      const now = performance.now();
      const { x, y, t } = lastRef.current;

      if (
        now - dedupeRef.current.t < 14 &&
        Math.hypot(clientX - dedupeRef.current.x, clientY - dedupeRef.current.y) <
          6
      ) {
        return;
      }
      dedupeRef.current = { t: now, x: clientX, y: clientY };

      const dist = Math.hypot(clientX - x, clientY - y);
      const dt = now - t;

      const coarse = source === "coarse";
      const minDist = coarse ? 1.5 : 4;
      const minGapMs = coarse ? 5 : 9;
      const slipDist = coarse ? 2.5 : 4;
      const slipMs = coarse ? 28 : 38;

      if (dt < minGapMs && dist < slipDist) return;
      if (dist < minDist && dt < slipMs) return;

      lastRef.current = { x: clientX, y: clientY, t: now };

      const intensity = reducedMotion === true ? 0.52 : 1;
      const idDot = ++idRef.current;
      const idSmoke = ++idRef.current;

      const r = Math.random();
      const bias: SmokeParticle["bias"] =
        r < 0.34 ? "lime" : r < 0.67 ? "violet" : "split";

      const size = coarse ? 96 + Math.random() * 100 : 108 + Math.random() * 104;
      const rot = (Math.random() - 0.5) * 38;

      setParticles((prev) => {
        const next: TrailParticle[] = [
          ...prev,
          {
            id: idDot,
            kind: "dot",
            x: clientX,
            y: clientY,
            intensity,
            coarse,
          },
          {
            id: idSmoke,
            kind: "smoke",
            x: clientX,
            y: clientY,
            intensity,
            size,
            rot,
            bias,
          },
        ];
        return next.length > MAX_ITEMS ? next.slice(-MAX_ITEMS) : next;
      });
    },
    [reducedMotion],
  );

  useEffect(() => {
    const coarseMq =
      typeof window !== "undefined"
        ? window.matchMedia("(pointer: coarse)")
        : null;

    const sourceFromEvent = (e: PointerEvent): "fine" | "coarse" => {
      if (e.pointerType === "touch") return "coarse";
      if (e.pointerType === "pen") return "coarse";
      return coarseMq?.matches ? "coarse" : "fine";
    };

    const onPointerMove = (e: PointerEvent) => {
      spawnPair(e.clientX, e.clientY, sourceFromEvent(e));
    };

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      spawnPair(touch.clientX, touch.clientY, "coarse");
    };

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      spawnPair(touch.clientX, touch.clientY, "coarse");
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, {
      passive: true,
      capture: true,
    });
    window.addEventListener("touchstart", onTouchStart, {
      passive: true,
      capture: true,
    });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchmove", onTouchMove, true);
      window.removeEventListener("touchstart", onTouchStart, true);
    };
  }, [spawnPair]);

  const easeSmoke = [0.22, 1, 0.32, 1] as const;
  const easeDot = [0.33, 1, 0.24, 1] as const;
  const durSmoke =
    reducedMotion === true ? Math.min(FADE_SMOKE, 0.12) : FADE_SMOKE;
  const durDot =
    reducedMotion === true ? Math.min(FADE_DOT, 0.09) : FADE_DOT;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[6] isolate overflow-hidden [touch-action:manipulation]"
      aria-hidden
    >
      <AnimatePresence initial={false}>
        {particles.map((p) =>
          p.kind === "dot" ? (
            <motion.div
              key={p.id}
              initial={{
                opacity: 0.98 * p.intensity,
                scale: 1,
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                opacity: 0,
                scale: 0.35,
                x: "-50%",
                y: "-50%",
              }}
              transition={{ duration: durDot, ease: easeDot }}
              onAnimationComplete={() => remove(p.id)}
              style={{
                position: "fixed",
                left: p.x,
                top: p.y,
                width: p.coarse ? 6 : 5,
                height: p.coarse ? 6 : 5,
                borderRadius: "50%",
                background: `rgba(255,255,255,${0.96 * p.intensity})`,
                boxShadow: `0 0 ${p.coarse ? 8 : 6}px rgba(255,255,255,${0.85 * p.intensity}), 0 0 ${p.coarse ? 14 : 10}px rgba(200,220,255,${0.35 * p.intensity})`,
                willChange: "opacity, transform",
              }}
            />
          ) : (
            <motion.div
              key={p.id}
              initial={{
                opacity: 0.82 * p.intensity,
                scale: 0.32,
                rotate: p.rot * 0.25,
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                opacity: 0,
                scale: 1.22,
                rotate: p.rot * 1.15,
                x: "-50%",
                y: "-50%",
              }}
              transition={{ duration: durSmoke, ease: easeSmoke }}
              onAnimationComplete={() => remove(p.id)}
              style={{
                position: "fixed",
                left: p.x,
                top: p.y,
                width: p.size,
                height: p.size * 0.92,
                borderRadius: "50%",
                background: smokeGradient(p.bias, p.intensity),
                filter: "blur(22px)",
                mixBlendMode: "screen",
                willChange: "opacity, transform",
              }}
            />
          ),
        )}
      </AnimatePresence>
    </div>
  );
}

function smokeGradient(bias: SmokeParticle["bias"], intensity: number): string {
  const a = intensity;
  switch (bias) {
    case "lime":
      return `
        radial-gradient(ellipse 88% 72% at 38% 36%,
          rgba(255,255,255,${0.38 * a}) 0%,
          hsla(88, 100%, 58%, ${0.62 * a}) 8%,
          hsla(72, 96%, 52%, ${0.48 * a}) 26%,
          hsla(95, 85%, 44%, ${0.22 * a}) 48%,
          transparent 72%
        )`;
    case "violet":
      return `
        radial-gradient(ellipse 82% 76% at 42% 44%,
          rgba(255,255,255,${0.32 * a}) 0%,
          hsla(278, 92%, 58%, ${0.58 * a}) 10%,
          hsla(265, 88%, 46%, ${0.5 * a}) 28%,
          hsla(292, 75%, 38%, ${0.28 * a}) 52%,
          transparent 76%
        )`;
    default:
      return `
        radial-gradient(ellipse 90% 74% at 35% 38%,
          rgba(255,255,255,${0.42 * a}) 0%,
          hsla(90, 100%, 60%, ${0.52 * a}) 12%,
          hsla(275, 90%, 52%, ${0.45 * a}) 32%,
          hsla(78, 88%, 48%, ${0.28 * a}) 48%,
          hsla(268, 85%, 42%, ${0.22 * a}) 62%,
          transparent 78%
        )`;
  }
}
