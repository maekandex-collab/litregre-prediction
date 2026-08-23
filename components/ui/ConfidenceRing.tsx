"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  light?: boolean;
}

export default function ConfidenceRing({
  percentage,
  size = 64,
  strokeWidth = 5,
  label,
  light,
}: Props) {
  const [offset, setOffset] = useState(0);
  const mounted = useRef(false);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, percentage));

  useEffect(() => {
    mounted.current = true;
    const timer = setTimeout(() => {
      setOffset(circumference - (pct / 100) * circumference);
    }, 100);
    return () => {
      mounted.current = false;
      clearTimeout(timer);
    };
  }, [pct, circumference]);

  const color =
    pct >= 70 ? "stroke-success" : pct >= 50 ? "stroke-warning" : "stroke-error";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={light ? "stroke-white/20" : "stroke-base-300"}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={`${color} confidence-ring`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset === 0 ? circumference : offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-xs font-bold ${light ? "text-white" : ""}`}>
          {pct}%
        </span>
        {label && (
          <span className="text-[8px] text-base-content/50">{label}</span>
        )}
      </div>
    </div>
  );
}
