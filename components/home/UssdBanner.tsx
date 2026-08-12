"use client";

import { Phone } from "lucide-react";

export default function UssdBanner() {
  return (
    <div className="mb-5 rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/10 via-base-100 to-amber-400/10 px-4 py-3.5 sm:px-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
            <Phone size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary/80 mb-0.5">
              Dial on any phone
            </p>
            <p className="text-sm text-base-content/70">
              Get LitreGre Prediction tips instantly via USSD — no app required.
            </p>
          </div>
        </div>
        <div className="sm:text-right">
          <p className="font-display font-bold text-2xl sm:text-3xl tracking-wide text-primary">
            *7098#
          </p>
          <p className="text-[11px] text-base-content/50 mt-0.5">USSD access code</p>
        </div>
      </div>
    </div>
  );
}
