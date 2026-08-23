"use client";

import type { ReactNode } from "react";
import { SlipProvider } from "@/lib/slipStore";
import BetSlipDrawer, { SlipFloatingBar } from "@/components/slip/BetSlipDrawer";

export default function SlipShell({ children }: { children: ReactNode }) {
  return (
    <SlipProvider>
      {children}
      <SlipFloatingBar />
      <BetSlipDrawer />
    </SlipProvider>
  );
}
