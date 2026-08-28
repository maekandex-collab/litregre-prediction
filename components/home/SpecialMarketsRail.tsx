"use client";

import Link from "next/link";
import { ChevronRight, Zap } from "lucide-react";

const MARKETS = [
  { label: "1X2", hint: "Match result", tab: "1x2" },
  { label: "BTTS", hint: "Both score", tab: "btts" },
  { label: "Over 1.5", hint: "Goals", tab: "over_15" },
  { label: "Over 2.5", hint: "Goals", tab: "over_25" },
  { label: "Halftime", hint: "1st half", tab: "halftime" },
  { label: "Basketball", hint: "Winner", tab: "basketball" },
  { label: "BB O/U", hint: "Total pts", tab: "basketball_over" },
  { label: "Tennis", hint: "Other", tab: "tennis" },
] as const;

/** Surface Daily Special markets on the Today landing page. */
export default function SpecialMarketsRail() {
  return (
    <section className="mb-5 rounded-2xl border border-base-300 bg-base-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-base-300 bg-gradient-to-r from-[#0f2744]/[8%] via-transparent to-secondary/10">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-8 h-8 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center flex-shrink-0">
            <Zap size={16} />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-sm sm:text-base font-bold tracking-wide text-base-content leading-none">
              DAILY SPECIAL MARKETS
            </h2>
            <p className="text-[11px] text-base-content/50 mt-0.5 truncate">
              Over 1.5, Over 2.5, BTTS and more — open any market
            </p>
          </div>
        </div>
        <Link
          href="/predictions/special"
          className="hidden sm:inline-flex items-center gap-0.5 text-xs font-bold text-primary hover:underline flex-shrink-0"
        >
          View all
          <ChevronRight size={14} />
        </Link>
      </div>

      <div className="p-3 sm:p-3.5">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none sm:grid sm:grid-cols-4 lg:grid-cols-7 sm:overflow-visible sm:pb-0">
          {MARKETS.map((m) => (
            <Link
              key={m.tab}
              href={`/predictions/special?tab=${m.tab}`}
              className="group flex-shrink-0 w-[7.25rem] sm:w-auto rounded-xl border border-base-300 bg-base-200/40 px-3 py-2.5 hover:border-secondary hover:bg-secondary/10 hover:shadow-sm transition-all"
            >
              <span className="block text-sm font-black tracking-tight text-base-content group-hover:text-secondary">
                {m.label}
              </span>
              <span className="block text-[10px] text-base-content/45 mt-0.5">
                {m.hint}
              </span>
            </Link>
          ))}
        </div>
        <Link
          href="/predictions/special"
          className="sm:hidden mt-3 inline-flex items-center gap-0.5 text-xs font-bold text-primary"
        >
          View all Daily Special
          <ChevronRight size={14} />
        </Link>
      </div>
    </section>
  );
}
