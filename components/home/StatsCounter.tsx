"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, Target, Crown, Zap } from "lucide-react";

interface FeatureItem {
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
  href: string;
}

function FeatureCard({ icon, label, description, color, href, delay }: FeatureItem & { delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      onClick={() => router.push(href)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") router.push(href); }}
      className={`group relative flex flex-col items-center gap-1.5 p-3 sm:p-4 rounded-xl bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-0.5 cursor-pointer select-none ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className={`absolute top-0 left-3 right-3 h-[2px] rounded-full ${color} opacity-60 group-hover:opacity-100 transition-opacity`} />

      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}/10`}>
        <span className={color.replace("bg-", "text-")}>{icon}</span>
      </div>
      <span className="text-xs sm:text-sm font-bold text-base-content text-center leading-tight group-hover:text-primary transition-colors">{label}</span>
      <span className="text-[9px] sm:text-[10px] text-base-content/50 text-center leading-tight">{description}</span>
    </div>
  );
}

export default function StatsCounter() {
  const features: FeatureItem[] = [
    { icon: <TrendingUp size={18} />, label: "Expert Analysis", description: "Data-driven picks", color: "bg-success", href: "/predictions/all" },
    { icon: <Target size={18} />, label: "Daily Tips", description: "Updated every day", color: "bg-primary", href: "/predictions/today" },
    { icon: <Crown size={18} />, label: "VIP Picks", description: "Premium selections", color: "bg-amber-500", href: "/predictions/vip" },
    { icon: <Zap size={18} />, label: "Daily Special", description: "Multi-sport coverage", color: "bg-emerald-500", href: "/predictions/special" },
  ];

  return (
    <div className="mb-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {features.map((feature, i) => (
          <FeatureCard key={feature.label} {...feature} delay={i * 120} />
        ))}
      </div>
    </div>
  );
}
