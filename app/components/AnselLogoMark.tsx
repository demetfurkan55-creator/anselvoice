"use client";

import { useId } from "react";

export function AnselLogoMark({
  size = "sm",
}: {
  muted?: boolean;
  size?: "sm" | "lg";
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const gradId = `anselvoice-mark-grad-${uid}`;
  const blurId = `anselvoice-mark-blur-${uid}`;
  const viewW = 220;
  const viewH = 96;
  const renderW = size === "lg" ? 252 : 64;
  const renderH = size === "lg" ? 112 : 28;
  const glow =
    size === "lg"
      ? "[filter:drop-shadow(0_0_12px_rgba(96,165,250,0.42))_drop-shadow(0_0_28px_rgba(168,85,247,0.34))]"
      : "[filter:drop-shadow(0_0_8px_rgba(96,165,250,0.34))_drop-shadow(0_0_16px_rgba(168,85,247,0.3))]";

  return (
    <svg
      width={renderW}
      height={renderH}
      viewBox={`0 0 ${viewW} ${viewH}`}
      className={`shrink-0 overflow-visible ${glow}`}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="38%" stopColor="#60a5fa" />
          <stop offset="72%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
        <filter id={blurId} x="-20%" y="-60%" width="140%" height="220%">
          <feGaussianBlur stdDeviation="6.8" />
        </filter>
      </defs>
      <path
        d="M 18 50 C 26 50, 24 42, 32 42 C 40 42, 39 64, 49 64 C 58 64, 58 26, 68 26 C 78 26, 77 84, 91 84 C 106 84, 105 10, 124 10 C 142 10, 141 92, 160 92 C 167 92, 176 62, 186 50"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={size === "lg" ? "5.2" : "4.2"}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.22"
        filter={`url(#${blurId})`}
      />
      <path
        d="M 18 50 C 26 50, 24 42, 32 42 C 40 42, 39 64, 49 64 C 58 64, 58 26, 68 26 C 78 26, 77 84, 91 84 C 106 84, 105 10, 124 10 C 142 10, 141 92, 160 92 C 167 92, 176 62, 186 50"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={size === "lg" ? "4.2" : "3.4"}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.99"
      />
      <path
        d="M 108 50 C 126 48, 142 52, 158 56 C 173 60, 187 60, 202 55"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={size === "lg" ? "5.2" : "4.2"}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.2"
        filter={`url(#${blurId})`}
      />
      <path
        d="M 108 50 C 126 48, 142 52, 158 56 C 173 60, 187 60, 202 55"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={size === "lg" ? "4.2" : "3.4"}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.99"
      />
    </svg>
  );
}
