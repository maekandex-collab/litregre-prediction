"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  ExternalLink,
  Trash2,
  X,
  Ticket,
  Loader2,
} from "lucide-react";
import { useSlip } from "@/lib/slipStore";
import { MAX_SLIP_LEGS } from "@/lib/slipLimits";

type BookResponse = {
  code: string | null;
  url: string | null;
  booked?: { home: string; away: string; label: string; odds: string }[];
  failed?: { home: string; away: string; tip: string; reason: string }[];
  error?: string;
};

export default function BetSlipDrawer() {
  const { items, removeItem, clear, open, setOpen } = useSlip();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BookResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [loadingHint, setLoadingHint] = useState("");

  async function generate() {
    setLoading(true);
    setError("");
    setResult(null);
    setLoadingHint("Matching fixtures on SportyBet…");
    const hintTimer = window.setTimeout(() => {
      setLoadingHint("Building your booking code…");
    }, 2000);

    const ctrl = new AbortController();
    const clientTimeout = window.setTimeout(() => ctrl.abort(), 22_000);

    try {
      const res = await fetch("/api/booking/sportybet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          legs: items.map((i) => ({
            home: i.home,
            away: i.away,
            tip: i.tip,
            marketHint: i.marketHint ?? i.market,
            id: i.id,
          })),
        }),
        signal: ctrl.signal,
      });
      const data = (await res.json()) as BookResponse;
      if (!res.ok) {
        setError(data.error || "Could not generate code");
        return;
      }
      setResult(data);
      if (!data.code) {
        setError("No booking code created — see failed legs below.");
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") {
        setError(
          "SportyBet took too long. Wait a moment and try again — the fixture list may still be loading."
        );
      } else {
        setError("Network error generating SportyBet code.");
      }
    } finally {
      window.clearTimeout(hintTimer);
      window.clearTimeout(clientTimeout);
      setLoadingHint("");
      setLoading(false);
    }
  }

  async function copyCode() {
    if (!result?.code) return;
    try {
      await navigator.clipboard.writeText(result.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close slip"
        onClick={() => setOpen(false)}
      />
      <aside className="relative w-full max-w-md bg-base-100 h-full shadow-2xl flex flex-col border-l border-base-300 animate-in slide-in-from-right">
        <div className="flex items-center justify-between px-4 py-3 border-b border-base-300 bg-gradient-to-r from-primary to-blue-700 text-primary-content">
          <div className="flex items-center gap-2">
            <Ticket size={18} />
            <div>
              <p className="font-bold text-sm">SportyBet Slip</p>
              <p className="text-[10px] opacity-80">
                {items.length}/{MAX_SLIP_LEGS} selections
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-circle text-primary-content"
            onClick={() => setOpen(false)}
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {items.length === 0 && (
            <p className="text-sm text-base-content/50 text-center py-10">
              Add tips from Today, VIP, or Daily Special (1X2 / Over 1.5 / Over 2.5 / BTTS / double chance).
            </p>
          )}
          {items.map((item) => (
            <div
              key={item.id}
              className="border border-base-300 rounded-xl px-3 py-2.5 flex items-start gap-2"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">
                  {item.home}{" "}
                  <span className="text-base-content/40 font-medium">vs</span>{" "}
                  {item.away}
                </p>
                <p className="text-[10px] text-primary font-semibold mt-0.5">
                  {item.label} · {item.tip}
                </p>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-xs btn-circle"
                onClick={() => removeItem(item.id)}
                title="Remove"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}

          {result?.failed && result.failed.length > 0 && (
            <div className="mt-3 rounded-xl border border-warning/40 bg-warning/10 p-3">
              <p className="text-xs font-bold text-warning mb-1">Could not book</p>
              <ul className="space-y-1">
                {result.failed.map((f, i) => (
                  <li key={i} className="text-[10px] text-base-content/70">
                    {f.home && f.away ? `${f.home} vs ${f.away}: ` : ""}
                    {f.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result?.code && (
            <div className="mt-3 rounded-xl border border-success/40 bg-success/10 p-4 text-center space-y-2">
              <p className="text-[10px] uppercase tracking-wide text-success font-semibold">
                SportyBet booking code
              </p>
              <p className="text-2xl font-black tracking-widest text-base-content">
                {result.code}
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  type="button"
                  className="btn btn-sm btn-primary gap-1"
                  onClick={copyCode}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Copied" : "Copy"}
                </button>
                {result.url && (
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline gap-1"
                  >
                    <ExternalLink size={14} />
                    Open SportyBet
                  </a>
                )}
              </div>
              {result.booked && result.booked.length > 0 && (
                <p className="text-[10px] text-base-content/50">
                  {result.booked.length} leg
                  {result.booked.length === 1 ? "" : "s"} booked
                  {result.booked[0]?.odds
                    ? ` · from @${result.booked.map((b) => b.odds).join(" × ")}`
                    : ""}
                </p>
              )}
            </div>
          )}

          {error && (
            <p className="text-xs text-error text-center mt-2">{error}</p>
          )}
        </div>

        <div className="p-4 border-t border-base-300 space-y-2">
          <button
            type="button"
            className="btn btn-primary w-full gap-2"
            disabled={!items.length || loading}
            onClick={generate}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span className="text-left leading-tight">
                  <span className="block text-sm">Generating…</span>
                  {loadingHint && (
                    <span className="block text-[10px] font-normal opacity-80">
                      {loadingHint}
                    </span>
                  )}
                </span>
              </>
            ) : (
              <>
                <Ticket size={16} /> Generate SportyBet code
              </>
            )}
          </button>
          {items.length > 0 && (
            <button
              type="button"
              className="btn btn-ghost btn-sm w-full"
              onClick={() => {
                clear();
                setResult(null);
                setError("");
              }}
            >
              Clear slip
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}

export function SlipFloatingBar() {
  const { items, setOpen } = useSlip();
  if (!items.length) return null;
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="fixed bottom-20 md:bottom-6 right-4 z-[70] btn btn-primary shadow-lg gap-2 rounded-full px-4"
    >
      <Ticket size={16} />
      Slip
      <span className="badge badge-sm bg-primary-content text-primary border-0">
        {items.length}
      </span>
    </button>
  );
}
