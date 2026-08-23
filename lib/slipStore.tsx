"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { BookableMarket } from "@/lib/tipNormalize";
import { MAX_SLIP_LEGS } from "@/lib/slipLimits";

export type SlipItem = {
  id: string;
  home: string;
  away: string;
  tip: string;
  market: BookableMarket;
  label: string;
  marketHint?: string | null;
  kickoff?: string | null;
  source?: string;
};

type SlipContextValue = {
  items: SlipItem[];
  addItem: (item: Omit<SlipItem, "id"> & { id?: string }) => boolean;
  removeItem: (id: string) => void;
  clear: () => void;
  hasItem: (home: string, away: string, market: BookableMarket) => boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const SlipContext = createContext<SlipContextValue | null>(null);
const STORAGE_KEY = "eagle_sporty_slip_v1";

/** Avoid hammering warmup on every re-render / rapid adds */
let lastWarmupAt = 0;
const WARMUP_CLIENT_COOLDOWN_MS = 90_000;

function warmSportyBetIndex() {
  const now = Date.now();
  if (now - lastWarmupAt < WARMUP_CLIENT_COOLDOWN_MS) return;
  lastWarmupAt = now;
  const run = () => {
    void fetch("/api/booking/sportybet/warmup", { method: "GET" }).catch(
      () => undefined
    );
  };
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    window.requestIdleCallback(() => run(), { timeout: 2500 });
  } else {
    window.setTimeout(run, 400);
  }
}

function makeId(home: string, away: string, market: string): string {
  return `${home}|${away}|${market}`.toLowerCase();
}

export function SlipProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<SlipItem[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SlipItem[];
        if (Array.isArray(parsed)) setItems(parsed.slice(0, MAX_SLIP_LEGS));
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    warmSportyBetIndex();
  }, [hydrated]);

  const hasItem = useCallback(
    (home: string, away: string, market: BookableMarket) => {
      const id = makeId(home, away, market);
      return items.some((i) => i.id === id);
    },
    [items]
  );

  const addItem = useCallback(
    (item: Omit<SlipItem, "id"> & { id?: string }) => {
      const id = item.id || makeId(item.home, item.away, item.market);
      let added = false;
      setItems((prev) => {
        if (prev.some((p) => p.id === id)) return prev;
        if (prev.length >= MAX_SLIP_LEGS) return prev;
        added = true;
        return [...prev, { ...item, id }];
      });
      setOpen(true);
      return added;
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, addItem, removeItem, clear, hasItem, open, setOpen }),
    [items, addItem, removeItem, clear, hasItem, open]
  );

  return <SlipContext.Provider value={value}>{children}</SlipContext.Provider>;
}

export function useSlip(): SlipContextValue {
  const ctx = useContext(SlipContext);
  if (!ctx) {
    throw new Error("useSlip must be used within SlipProvider");
  }
  return ctx;
}
