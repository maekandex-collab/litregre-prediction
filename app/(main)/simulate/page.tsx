"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  buildGameSimulationUrl,
  getSimulationEmbedBase,
  SIMULATION_QUERY,
} from "@/lib/simulation";

function SimulateInner() {
  const searchParams = useSearchParams();
  const home = (searchParams.get(SIMULATION_QUERY.home) ?? "").trim() || "Home";
  const away = (searchParams.get(SIMULATION_QUERY.away) ?? "").trim() || "Away";
  const homeLogo = searchParams.get(SIMULATION_QUERY.homeLogo);
  const awayLogo = searchParams.get(SIMULATION_QUERY.awayLogo);

  const embedSrc = useMemo(
    () =>
      buildGameSimulationUrl(getSimulationEmbedBase(), {
        home,
        away,
        homeLogo,
        awayLogo,
      }),
    [home, away, homeLogo, awayLogo]
  );

  return (
    <div className="max-w-lg mx-auto px-3 sm:px-4 py-4">
      <Link
        href="/predictions"
        className="inline-flex items-center gap-1.5 text-sm text-base-content/60 hover:text-primary mb-3"
      >
        <ArrowLeft size={14} /> Back to predictions
      </Link>
      <div className="mb-3 text-center">
        <h1 className="font-bold text-base sm:text-lg">
          {home} <span className="text-base-content/40">vs</span> {away}
        </h1>
        <p className="text-xs text-base-content/50 mt-0.5">Match simulation</p>
      </div>
      <div className="rounded-2xl overflow-hidden border border-base-300 bg-[#0a0a12] shadow-lg">
        <iframe
          title={`${home} vs ${away} simulation`}
          src={embedSrc}
          className="w-full border-0"
          style={{ height: "min(820px, calc(100vh - 140px))", minHeight: 560 }}
          allow="autoplay"
        />
      </div>
    </div>
  );
}

export default function SimulatePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <span className="loading loading-spinner loading-md text-primary" />
        </div>
      }
    >
      <SimulateInner />
    </Suspense>
  );
}
