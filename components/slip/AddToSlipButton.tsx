"use client";

import { Plus, Check } from "lucide-react";
import { normalizeTip } from "@/lib/tipNormalize";
import { useSlip } from "@/lib/slipStore";

type Props = {
  home: string;
  away: string;
  tip: string;
  marketHint?: string | null;
  kickoff?: string | null;
  source?: string;
  compact?: boolean;
  bright?: boolean;
};

export default function AddToSlipButton({
  home,
  away,
  tip,
  marketHint,
  kickoff,
  source,
  compact,
  bright,
}: Props) {
  const { addItem, hasItem } = useSlip();
  const normalized = normalizeTip(tip, marketHint, { home, away });

  if (!normalized) {
    return null;
  }

  const already = hasItem(home, away, normalized.market);

  function onAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (already || !normalized) return;
    const ok = addItem({
      home,
      away,
      tip,
      market: normalized.market,
      label: normalized.label,
      marketHint: marketHint ?? normalized.market,
      kickoff,
      source,
    });
    if (!ok) {
      // silently full — drawer already shows max
    }
  }

  const tone = already
    ? "btn-success"
    : bright
      ? "bg-[#7CFF30] hover:bg-[#22D366] text-[#0A1433] border-0"
      : "btn-primary";

  if (compact) {
    return (
      <button
        type="button"
        onClick={onAdd}
        disabled={already}
        title={already ? "Already on slip" : "Add to SportyBet slip"}
        className={`btn btn-xs gap-1 rounded-full px-2.5 ${tone}`}
      >
        {already ? <Check size={10} /> : <Plus size={10} />}
        {already ? "Added" : "Slip"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onAdd}
      disabled={already}
      className={`btn btn-sm gap-1 flex-1 ${tone}`}
    >
      {already ? <Check size={12} /> : <Plus size={12} />}
      {already ? "On slip" : "Add to slip"}
    </button>
  );
}
