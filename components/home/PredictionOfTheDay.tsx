"use client";

import Link from "next/link";
import Image from "next/image";
import { Trophy, Flame } from "lucide-react";
import dayjs from "dayjs";
import ConfidenceRing from "@/components/ui/ConfidenceRing";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { useBetOfDay } from "@/hooks/usePredictions";

interface TeamObj {
  id: number;
  logo: string | null;
  name: string;
  slug: string;
}

interface Competition {
  id: number;
  name: string;
  slug: string;
  country: string;
  country_code: string;
}

export interface BetOfDay {
  home_team: TeamObj;
  away_team: TeamObj;
  prediction: string;
  odds: string | number;
  confidence: string;
  probability: number;
  competition?: Competition;
  kickoff?: string | null;
  status?: string;
}

function TeamBlock({ team }: { team: TeamObj }) {
  return (
    <div className="flex-1 flex flex-col items-center text-center min-w-0">
      <div className="w-14 h-14 rounded-full bg-base-200 flex items-center justify-center mb-2 overflow-hidden border-2 border-base-300 group-hover:border-primary/30 transition-colors">
        {team.logo ? (
          <Image
            src={team.logo}
            alt={team.name}
            width={44}
            height={44}
            className="object-contain"
            unoptimized
          />
        ) : (
          <span className="text-lg font-black text-primary">
            {team.name.slice(0, 1)}
          </span>
        )}
      </div>
      <p className="text-xs font-bold leading-tight line-clamp-2 break-words">
        {team.name}
      </p>
    </div>
  );
}

function formatOdds(o: string | number | undefined | null): string {
  if (o == null || o === "") return "—";
  const n = typeof o === "number" ? o : parseFloat(o);
  if (Number.isNaN(n)) return String(o);
  return n.toFixed(2);
}

export default function PredictionOfTheDay() {
  const { data: bet, isLoading: loading, isError: error } = useBetOfDay();

  const kickoff = bet?.kickoff ? dayjs(bet.kickoff) : null;
  const oddsDisplay = formatOdds(bet?.odds);
  const pickLabel = bet?.prediction ?? "—";
  const competitionName = bet?.competition?.name ?? "Football";
  const confidenceTier = bet?.confidence?.toLowerCase();
  const probability = bet?.probability ?? 0;
  const pctValue = probability > 1 ? Math.round(probability) : Math.round(probability * 100);

  const statusRaw = bet?.status?.toLowerCase();
  const isLive = statusRaw === "live";
  const isUpcoming = !statusRaw || statusRaw === "upcoming" || statusRaw === "ns";

  return (
    <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden shadow-sm card-animate hover:shadow-md transition-shadow group">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-700 text-primary-content px-4 py-3 flex items-center gap-2 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/20 blur-xl" />
        </div>
        <Flame size={16} className="relative z-10" />
        <span className="font-bold text-sm relative z-10">Prediction of the Day</span>
        {isLive && (
          <span className="ml-auto flex items-center gap-1 relative z-10">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="text-[10px] font-bold">LIVE</span>
          </span>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="p-4 animate-pulse space-y-3">
          <div className="h-3 bg-base-300 rounded w-2/3" />
          <div className="flex justify-between gap-4">
            <div className="flex-1 h-16 bg-base-300 rounded" />
            <div className="flex-1 h-16 bg-base-300 rounded" />
          </div>
          <div className="h-12 bg-base-300 rounded" />
        </div>
      )}

      {/* Error / empty */}
      {!loading && (error || !bet) && (
        <div className="p-5 text-center">
          <Trophy size={28} className="text-base-content/20 mx-auto mb-2" />
          <p className="text-sm font-semibold">No tip for today yet</p>
          <p className="text-xs text-base-content/50 mt-1">Check back later</p>
        </div>
      )}

      {/* Bet content */}
      {!loading && bet && (
        <div className="p-4">
          {/* Competition + countdown */}
          <div className="flex items-center justify-between mb-3 gap-2">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wide truncate">
              {competitionName}
            </span>
            {isUpcoming && kickoff?.isValid() && (
              <CountdownTimer targetDate={kickoff.toISOString()} />
            )}
            {!isUpcoming && kickoff?.isValid() && (
              <span className="text-[10px] text-base-content/50 flex-shrink-0">
                {kickoff.format("MMM D • HH:mm")}
              </span>
            )}
          </div>

          {/* Teams */}
          <div className="flex items-center justify-between gap-2 mb-4">
            {bet.home_team && <TeamBlock team={bet.home_team} />}
            <div className="flex-shrink-0 px-2">
              <div className="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center">
                <span className="text-[9px] font-bold text-base-content/40">VS</span>
              </div>
            </div>
            {bet.away_team && <TeamBlock team={bet.away_team} />}
          </div>

          {/* Pick section with confidence ring */}
          <div className="bg-base-200/60 rounded-xl p-4 mb-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-primary/5 -translate-y-1/2 translate-x-1/2 blur-xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-[10px] text-base-content/50 uppercase tracking-wide mb-1">
                    Our Pick
                  </p>
                  <p className="font-bold text-base text-primary mb-2">{pickLabel}</p>

                  <div className="flex gap-4">
                    <div>
                      <p className="text-[10px] text-base-content/50">Odds</p>
                      <p className="font-bold text-sm">{oddsDisplay}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-base-content/50">Level</p>
                      <p
                        className={`font-bold text-xs capitalize ${
                          confidenceTier === "high"
                            ? "text-success"
                            : confidenceTier === "medium"
                              ? "text-warning"
                              : "text-base-content"
                        }`}
                      >
                        {bet.confidence || "—"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Confidence ring */}
                <ConfidenceRing percentage={pctValue} size={60} strokeWidth={5} />
              </div>
            </div>
          </div>

          <Link
            href="/predictions/bet-of-the-day"
            className="btn btn-primary btn-sm w-full gap-2 group-hover:shadow-md transition-shadow"
          >
            <Trophy size={14} />
            View Bet of the Day
          </Link>
        </div>
      )}
    </div>
  );
}
