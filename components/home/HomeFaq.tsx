"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "What is LitreGre Prediction?",
    a: "LitreGre Prediction provides free and VIP football tips, daily specials, accumulators, and multi-sport markets to help you make informed decisions.",
  },
  {
    q: "How do I get predictions via USSD?",
    a: "Dial *7098# on your phone to access LitreGre Prediction tips without opening the website.",
  },
  {
    q: "Are VIP predictions free?",
    a: "VIP picks are available to registered members. Create an account with your invite link, then open Get VIP Prediction from the top bar.",
  },
  {
    q: "What is Daily Special?",
    a: "Daily Special covers markets like 1X2, BTTS, Over 2.5, Halftime, plus basketball and tennis picks in one place.",
  },
  {
    q: "Is LitreGre affiliated with betting companies?",
    a: "No. LitreGre Prediction has no affiliation with any betting platforms. We provide informational tips only.",
  },
  {
    q: "How do I register?",
    a: "Open your invite or registration link. Your phone number is taken from the link and locked in — you only set a PIN to finish signup.",
  },
];

export default function HomeFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mt-8 mb-4" aria-labelledby="home-faq-heading">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <HelpCircle size={18} className="text-primary" />
        </div>
        <div>
          <h2 id="home-faq-heading" className="font-display font-bold text-lg sm:text-xl">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-base-content/50">Quick answers about LitreGre Prediction</p>
        </div>
      </div>

      <div className="space-y-2">
        {FAQS.map((item, index) => {
          const open = openIndex === index;
          return (
            <div
              key={item.q}
              className="rounded-xl border border-base-300 bg-base-100 overflow-hidden shadow-sm"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : index)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left hover:bg-base-200/50 transition-colors"
                aria-expanded={open}
              >
                <span className="text-sm font-semibold text-base-content">{item.q}</span>
                <ChevronDown
                  size={16}
                  className={`flex-shrink-0 text-base-content/40 transition-transform ${
                    open ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>
              {open && (
                <div className="px-4 pb-4 pt-0">
                  <p className="text-sm text-base-content/65 leading-relaxed border-t border-base-300 pt-3">
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
