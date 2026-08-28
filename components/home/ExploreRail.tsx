"use client";

import Link from "next/link";
import { Crown, Zap, Layers, ChevronRight } from "lucide-react";

const LINKS = [
  {
    label: "VIP Picks",
    blurb: "Higher-confidence tips with odds",
    href: "/predictions/vip",
    icon: Crown,
    accent: "border-amber-400/50 bg-amber-50 hover:border-amber-500",
    iconCls: "text-amber-700 bg-amber-200/60",
  },
  {
    label: "Daily Special",
    blurb: "BTTS, Over 2.5, cards & more",
    href: "/predictions/special",
    icon: Zap,
    accent: "border-[#22D366]/40 bg-[#22D366]/10 hover:border-[#22D366]",
    iconCls: "text-[#0A1433] bg-[#22D366]/25",
  },
  {
    label: "Accumulators",
    blurb: "Multi-leg tickets & boosted odds",
    href: "/predictions/accumulator-tips",
    icon: Layers,
    accent: "border-sky-400/40 bg-sky-50/80 hover:border-sky-600",
    iconCls: "text-sky-800 bg-sky-200/50",
  },
];

/** Light promo row — not another teal hero. */
export default function ExploreRail() {
  return (
    <section className="mt-8 mb-2">
      <div className="flex items-end justify-between gap-3 mb-3 px-0.5">
        <div>
          <h2 className="font-display text-lg font-bold tracking-wide text-base-content">
            EXPLORE MORE
          </h2>
          <p className="text-xs text-base-content/50">
            Other boards — kept separate from today&apos;s list
          </p>
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        {LINKS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-start gap-3 rounded-xl border px-4 py-3.5 transition-colors ${item.accent}`}
            >
              <span
                className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${item.iconCls}`}
              >
                <Icon size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1 font-semibold text-sm text-base-content">
                  {item.label}
                  <ChevronRight
                    size={14}
                    className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                  />
                </span>
                <span className="block text-xs text-base-content/55 mt-0.5">
                  {item.blurb}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
