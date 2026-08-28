"use client";

import Link from "next/link";
import Image from "next/image";
import { Flame, Play, Trophy, ArrowRight } from "lucide-react";
import dayjs from "dayjs";
import ConfidenceRing from "@/components/ui/ConfidenceRing";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { useBetOfDay } from "@/hooks/usePredictions";
import { buildSimulationHref } from "@/lib/simulation";
import AddToSlipButton from "@/components/slip/AddToSlipButton";

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

function formatOdds(o: string | number | undefined | null): string {
  if (o == null || o === "") return "—";
  const n = typeof o === "number" ? o : parseFloat(o);
  if (Number.isNaN(n)) return String(o);
  return n.toFixed(2);
}

function TeamFace({
  team,
  large,
}: {
  team: TeamObj;
  large?: boolean;
}) {
  const box = large ? "w-16 h-16 sm:w-20 sm:h-20" : "w-14 h-14";
  return (
    <div className="flex flex-col items-center text-center min-w-0 flex-1">
      <div
        className={`${box} rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-2 overflow-hidden border border-white/15 shadow-lg`}
      >
        {team.logo ? (
          <Image
            src={team.logo}
            alt={team.name}
            width={large ? 72 : 44}
            height={large ? 72 : 44}
            className="object-contain p-1.5"
            unoptimized
          />
        ) : (
          <span className="text-xl font-display font-bold text-[#7CFF30]">
            {team.name.slice(0, 1)}
          </span>
        )}
      </div>
      <p
        className={`font-display font-bold leading-tight line-clamp-2 break-words ${
          large ? "text-sm sm:text-base text-white" : "text-xs"
        }`}
      >
        {team.name}
      </p>
    </div>
  );
}

type Props = { variant?: "sidebar" | "hero" };

export default function PredictionOfTheDay({ variant = "sidebar" }: Props) {
  const { data: bet, isLoading: loading, isError: error } = useBetOfDay();

  const kickoff = bet?.kickoff ? dayjs(bet.kickoff) : null;
  const oddsDisplay = formatOdds(bet?.odds);
  const pickLabel = bet?.prediction ?? "—";
  const competitionName = bet?.competition?.name ?? "Football";
  const confidenceTier = bet?.confidence?.toLowerCase();
  const probability = bet?.probability ?? 0;
  const pctValue =
    probability > 1 ? Math.round(probability) : Math.round(probability * 100);

  const statusRaw = bet?.status?.toLowerCase();
  const isLive = statusRaw === "live";
  const isUpcoming =
    !statusRaw || statusRaw === "upcoming" || statusRaw === "ns";

  if (variant === "hero") {
    return (
      <section className="relative mb-6 overflow-hidden rounded-3xl border border-base-300/60 shadow-xl potd-hero">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(163,230,53,0.18),transparent_55%),radial-gradient(ellipse_at_90%_10%,rgba(34,211,102,0.28),transparent_50%),linear-gradient(145deg,#0A1433_0%,#0f2a1f_48%,#122040_100%)]" />
        <div className="absolute inset-0 opacity-[0.07] potd-grid" />
        <div className="relative z-10 p-5 sm:p-7 lg:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#22D366]/15 border border-[#7CFF30]/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#7CFF30]">
              <Flame size={12} className="animate-pulse" />
              Prediction of the Day
            </span>
            {isLive && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 border border-red-400/40 px-2.5 py-1 text-[10px] font-bold text-red-200">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                LIVE
              </span>
            )}
            {isUpcoming && kickoff?.isValid() && (
              <span className="ml-auto">
                <CountdownTimer targetDate={kickoff.toISOString()} />
              </span>
            )}
          </div>

          {loading && (
            <div className="animate-pulse grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
              <div className="h-40 bg-white/10 rounded-2xl" />
              <div className="h-40 bg-white/10 rounded-2xl" />
            </div>
          )}

          {!loading && (error || !bet) && (
            <div className="text-center py-10 text-white/70">
              <Trophy size={32} className="mx-auto mb-2 opacity-40" />
              <p className="font-display font-bold text-white">No tip for today yet</p>
              <p className="text-sm mt-1">Check back soon — our best pick lands here.</p>
            </div>
          )}

          {!loading && bet && (
            <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6 lg:gap-8 items-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7CFF30]/80 mb-3">
                  {competitionName}
                  {kickoff?.isValid()
                    ? ` · ${kickoff.format("ddd D MMM · HH:mm")}`
                    : ""}
                </p>
                <div className="flex items-center justify-between gap-3 sm:gap-6 mb-1">
                  {bet.home_team && <TeamFace team={bet.home_team} large />}
                  <div className="flex-shrink-0 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-black tracking-widest text-white/35">
                      VS
                    </span>
                    <div className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center">
                      <span className="font-display text-lg font-bold text-[#7CFF30]">
                        ×
                      </span>
                    </div>
                  </div>
                  {bet.away_team && <TeamFace team={bet.away_team} large />}
                </div>
              </div>

              <div className="rounded-2xl bg-white/8 border border-white/12 backdrop-blur-md p-5 sm:p-6 shadow-2xl">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-white/60 mb-1">
                      Our pick
                    </p>
                    <p className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight mb-3">
                      {pickLabel}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <p className="text-[10px] text-white/45 uppercase">Odds</p>
                        <p className="font-mono font-bold text-[#7CFF30] text-lg">
                          {oddsDisplay}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/45 uppercase">Level</p>
                        <p
                          className={`font-bold capitalize ${
                            confidenceTier === "high"
                              ? "text-[#7CFF30]"
                              : confidenceTier === "medium"
                                ? "text-amber-300"
                                : "text-white"
                          }`}
                        >
                          {bet.confidence || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <ConfidenceRing percentage={pctValue} size={72} strokeWidth={6} light />
                </div>

                <div className="mt-5 flex flex-col sm:flex-row gap-2">
                  {bet.home_team && bet.away_team && (
                    <>
                      <AddToSlipButton
                        home={bet.home_team.name}
                        away={bet.away_team.name}
                        tip={String(bet.prediction)}
                        marketHint="1x2"
                        kickoff={bet.kickoff}
                        source="bet-of-day"
                        bright
                      />
                      <Link
                        href={buildSimulationHref({
                          home: bet.home_team.name,
                          away: bet.away_team.name,
                          homeLogo: bet.home_team.logo,
                          awayLogo: bet.away_team.logo,
                        })}
                        className="btn btn-sm flex-1 gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Play size={14} /> Simulate
                      </Link>
                    </>
                  )}
                  <Link
                    href="/predictions/bet-of-the-day"
                    className="btn btn-sm btn-ghost text-[#7CFF30] gap-1 hover:bg-white/10"
                  >
                    Full card <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  /* ── compact sidebar variant ── */
  return (
    <div className="bg-base-100 border border-base-300 rounded-2xl overflow-hidden shadow-sm card-animate group">
      <div className="bg-gradient-to-r from-[#0A1433] to-[#14532d] text-white px-4 py-3 flex items-center gap-2">
        <Flame size={16} className="text-[#7CFF30]" />
        <span className="font-display font-bold text-sm">Prediction of the Day</span>
        {isLive && (
          <span className="ml-auto flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="text-[10px] font-bold">LIVE</span>
          </span>
        )}
      </div>

      {loading && (
        <div className="p-4 animate-pulse space-y-3">
          <div className="h-3 bg-base-300 rounded w-2/3" />
          <div className="flex justify-between gap-4">
            <div className="flex-1 h-16 bg-base-300 rounded" />
            <div className="flex-1 h-16 bg-base-300 rounded" />
          </div>
        </div>
      )}

      {!loading && (error || !bet) && (
        <div className="p-5 text-center">
          <Trophy size={28} className="text-base-content/20 mx-auto mb-2" />
          <p className="text-sm font-semibold">No tip for today yet</p>
        </div>
      )}

      {!loading && bet && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-3 gap-2">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wide truncate">
              {competitionName}
            </span>
            {isUpcoming && kickoff?.isValid() && (
              <CountdownTimer targetDate={kickoff.toISOString()} />
            )}
          </div>

          <div className="flex items-center justify-between gap-2 mb-4">
            {bet.home_team && (
              <div className="flex-1 flex flex-col items-center text-center min-w-0">
                <div className="w-12 h-12 rounded-xl bg-base-200 flex items-center justify-center mb-1.5 overflow-hidden border border-base-300">
                  {bet.home_team.logo ? (
                    <Image
                      src={bet.home_team.logo}
                      alt={bet.home_team.name}
                      width={40}
                      height={40}
                      className="object-contain"
                      unoptimized
                    />
                  ) : (
                    <span className="font-bold text-primary">
                      {bet.home_team.name.slice(0, 1)}
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold line-clamp-2">{bet.home_team.name}</p>
              </div>
            )}
            <span className="text-[10px] font-black text-base-content/30">VS</span>
            {bet.away_team && (
              <div className="flex-1 flex flex-col items-center text-center min-w-0">
                <div className="w-12 h-12 rounded-xl bg-base-200 flex items-center justify-center mb-1.5 overflow-hidden border border-base-300">
                  {bet.away_team.logo ? (
                    <Image
                      src={bet.away_team.logo}
                      alt={bet.away_team.name}
                      width={40}
                      height={40}
                      className="object-contain"
                      unoptimized
                    />
                  ) : (
                    <span className="font-bold text-primary">
                      {bet.away_team.name.slice(0, 1)}
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold line-clamp-2">{bet.away_team.name}</p>
              </div>
            )}
          </div>

          <div className="bg-base-200/70 rounded-xl p-3 mb-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-base-content/50 uppercase mb-0.5">Our pick</p>
              <p className="font-display font-bold text-primary truncate">{pickLabel}</p>
              <p className="text-xs mt-1">
                Odds <span className="font-mono font-bold">{oddsDisplay}</span>
              </p>
            </div>
            <ConfidenceRing percentage={pctValue} size={56} strokeWidth={5} />
          </div>

          <Link
            href="/predictions/bet-of-the-day"
            className="btn btn-primary btn-sm w-full gap-2"
          >
            View Bet of the Day
          </Link>
        </div>
      )}
    </div>
  );
}
