"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SESSION_KEY = "lg-pred-splash-seen";

type BrandSpinnerProps = {
  size?: number;
  className?: string;
  label?: string;
};

/** Compact branded spinner for buttons and page loaders. */
export function BrandSpinner({
  size = 36,
  className = "",
  label = "Loading",
}: BrandSpinnerProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label={label}
    >
      <span
        className="absolute inset-0 rounded-full border-2 border-[#22D366]/25 border-t-[#22D366] animate-spin"
        style={{ animationDuration: "0.85s" }}
      />
      <span
        className="absolute inset-[3px] rounded-full border border-[#7CFF30]/30 border-b-[#7CFF30]/80 animate-spin"
        style={{ animationDuration: "1.35s", animationDirection: "reverse" }}
      />
      <Image
        src="/brand/mark-light.png"
        alt=""
        width={Math.round(size * 0.42)}
        height={Math.round(size * 0.42 * (170 / 414))}
        className="relative z-10 object-contain opacity-95"
        unoptimized
        aria-hidden
      />
    </div>
  );
}

type SplashScreenProps = {
  durationMs?: number;
  tagline?: string;
};

/** Full-viewport branded splash — once per browser session. */
export function SplashScreen({
  durationMs = 1800,
  tagline = "Expert tips. Daily picks.",
}: SplashScreenProps) {
  const [phase, setPhase] = useState<"show" | "out" | "gone">("show");

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") {
        setPhase("gone");
        return;
      }
    } catch {
      // ignore
    }

    const outTimer = window.setTimeout(() => setPhase("out"), durationMs);
    const goneTimer = window.setTimeout(() => {
      setPhase("gone");
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // ignore
      }
    }, durationMs + 480);

    return () => {
      window.clearTimeout(outTimer);
      window.clearTimeout(goneTimer);
    };
  }, [durationMs]);

  if (phase === "gone") return null;

  return (
    <div
      className={`lg-splash ${phase === "out" ? "lg-splash--out" : ""}`}
      aria-hidden={phase !== "show"}
    >
      <div className="lg-splash__glow" />
      <div className="lg-splash__glow lg-splash__glow--blue" />

      <div className="lg-splash__mark-wrap">
        <div className="lg-splash__ring" />
        <div className="lg-splash__ring lg-splash__ring--delay" />
        <Image
          src="/brand/mark-light.png"
          alt=""
          width={72}
          height={30}
          className="lg-splash__mark relative z-10"
          priority
          unoptimized
        />
      </div>

      <div className="lg-splash__wordmark">
        <span className="lg-splash__brand">LitreGre</span>
        <span className="lg-splash__product">PREDICTION</span>
      </div>

      <p className="lg-splash__tagline">{tagline}</p>

      <div className="lg-splash__spinner mt-8">
        <BrandSpinner size={40} />
      </div>
    </div>
  );
}
