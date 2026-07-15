"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface Props {
  targetDate: string | Date;
  className?: string;
}

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function getTimeLeft(target: Date): TimeLeft {
  const now = new Date().getTime();
  const diff = target.getTime() - now;
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, expired: true };
  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    expired: false,
  };
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function CountdownTimer({ targetDate, className = "" }: Props) {
  const target = typeof targetDate === "string" ? new Date(targetDate) : targetDate;
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(target));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(target));
    }, 1000);
    return () => clearInterval(interval);
  }, [target]);

  if (timeLeft.expired) {
    return (
      <div className={`flex items-center gap-1 text-xs ${className}`}>
        <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
        <span className="font-semibold text-error">LIVE</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <Clock size={12} className="text-base-content/50" />
      <div className="flex gap-0.5 font-mono text-xs font-bold">
        <span className="bg-base-200 px-1 py-0.5 rounded text-[10px]">
          {pad(timeLeft.hours)}
        </span>
        <span className="text-base-content/30">:</span>
        <span className="bg-base-200 px-1 py-0.5 rounded text-[10px]">
          {pad(timeLeft.minutes)}
        </span>
        <span className="text-base-content/30">:</span>
        <span className="bg-base-200 px-1 py-0.5 rounded text-[10px]">
          {pad(timeLeft.seconds)}
        </span>
      </div>
    </div>
  );
}
