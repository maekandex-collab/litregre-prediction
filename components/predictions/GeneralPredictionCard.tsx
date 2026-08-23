import Link from "next/link";
import { Play } from "lucide-react";
import { buildSimulationHref } from "@/lib/simulation";
import AddToSlipButton from "@/components/slip/AddToSlipButton";
import {
  getKickoffStatus,
  parsePredictionKickoff,
} from "@/lib/predictionKickoff";

export interface GeneralPrediction {
  game_id: string;
  home_team: string;
  away_team: string;
  prediction: string;
  is_finished: boolean;
  date: string;
  date_created: string;
  date_time: string;
  prediction_probability: number;
  is_prediction_correct: boolean | null;
  result_score: string | null;
}

function confPct(probability: number) {
  return probability > 1
    ? Math.round(probability)
    : Math.round(probability * 100);
}

function confTone(probability: number) {
  const norm = probability > 1 ? probability / 100 : probability;
  if (norm >= 0.7) return "text-success";
  if (norm >= 0.5) return "text-warning";
  return "text-error";
}

interface Props {
  prediction: GeneralPrediction;
}

export default function GeneralPredictionCard({ prediction }: Props) {
  const kickoff = parsePredictionKickoff(prediction);
  const timeStr = kickoff?.isValid() ? kickoff.format("HH:mm") : "--:--";
  const dateStr = kickoff?.isValid() ? kickoff.format("ddd D MMM") : "";
  const pct = confPct(prediction.prediction_probability);
  const status = getKickoffStatus({
    kickoff,
    isFinished: prediction.is_finished,
    isPredictionCorrect: prediction.is_prediction_correct,
  });

  const simulateHref = buildSimulationHref({
    home: prediction.home_team,
    away: prediction.away_team,
  });

  return (
    <article className="group border-b border-base-300 last:border-0 hover:bg-base-200/40 transition-colors">
      <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[7.5rem_1fr_auto] gap-x-3 gap-y-2 px-4 py-3.5 items-center">
        {/* Kickoff */}
        <div className="hidden sm:flex flex-col leading-tight">
          <span className="text-[11px] font-semibold text-base-content/45 uppercase tracking-wide">
            {dateStr}
          </span>
          <span className="font-display text-lg font-bold text-base-content tabular-nums">
            {timeStr}
          </span>
        </div>

        {/* Match + meta */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 sm:hidden">
            <span className="text-[11px] text-base-content/45 font-medium">
              {dateStr} · {timeStr}
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${status.tone}`}
            >
              {status.label}
            </span>
          </div>

          <Link
            href={simulateHref}
            className="block font-semibold text-[15px] text-base-content leading-snug hover:text-primary transition-colors"
          >
            <span className="truncate inline-block max-w-full align-bottom">
              {prediction.home_team}
            </span>
            <span className="mx-1.5 text-base-content/30 font-medium text-xs">
              vs
            </span>
            <span className="truncate inline-block max-w-full align-bottom">
              {prediction.away_team}
            </span>
          </Link>

          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-content px-2 py-0.5">
              <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">
                Tip
              </span>
              <span className="font-display text-base font-bold leading-none">
                {prediction.prediction}
              </span>
            </span>
            <span
              className={`text-xs font-bold tabular-nums ${confTone(
                prediction.prediction_probability
              )}`}
            >
              {pct}% conf
            </span>
            {prediction.result_score && (
              <span className="text-xs font-semibold text-base-content/55">
                {prediction.result_score}
              </span>
            )}
            <span
              className={`hidden sm:inline-flex text-[10px] font-bold px-1.5 py-0.5 rounded ${status.tone}`}
            >
              {status.label}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 self-start sm:self-center">
          <AddToSlipButton
            compact
            home={prediction.home_team}
            away={prediction.away_team}
            tip={String(prediction.prediction)}
            marketHint="1x2"
            kickoff={prediction.date}
            source="general"
          />
          <Link
            href={simulateHref}
            className="btn btn-ghost btn-xs gap-1 text-primary"
            title="Simulate this match"
          >
            <Play size={12} />
            <span className="hidden xs:inline sm:inline">Sim</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
