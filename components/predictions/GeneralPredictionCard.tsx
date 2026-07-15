import dayjs from "dayjs";

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

function ConfidenceBadge({ probability }: { probability: number }) {
  const pct = probability > 1 ? Math.round(probability) : Math.round(probability * 100);
  const norm = probability > 1 ? probability / 100 : probability;
  const cls =
    norm >= 0.7 ? "text-success" : norm >= 0.5 ? "text-warning" : "text-error";
  return (
    <span className={`text-xs font-bold ${cls}`}>{pct}%</span>
  );
}

function StatusBadge({ prediction }: { prediction: GeneralPrediction }) {
  if (!prediction.is_finished) {
    return (
      <span className="flex items-center gap-1 text-[10px] font-semibold text-base-content/50">
        <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
        Upcoming
      </span>
    );
  }
  if (prediction.is_prediction_correct === true) {
    return (
      <span className="flex items-center gap-1 text-[10px] font-bold text-success">
        <span className="w-1.5 h-1.5 rounded-full bg-success" />
        Won
      </span>
    );
  }
  if (prediction.is_prediction_correct === false) {
    return (
      <span className="flex items-center gap-1 text-[10px] font-bold text-error">
        <span className="w-1.5 h-1.5 rounded-full bg-error" />
        Lost
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-[10px] font-semibold text-base-content/40">
      <span className="w-1.5 h-1.5 rounded-full bg-base-300" />
      FT
    </span>
  );
}

interface Props {
  prediction: GeneralPrediction;
}

export default function GeneralPredictionCard({ prediction }: Props) {
  const kickoff = dayjs(prediction.date);
  const timeStr = kickoff.isValid() ? kickoff.format("HH:mm") : "--:--";
  const dateStr = kickoff.isValid() ? kickoff.format("ddd, MMM D") : "";

  const isHighConfidence =
    (prediction.prediction_probability > 1
      ? prediction.prediction_probability / 100
      : prediction.prediction_probability) >= 0.7;

  return (
    <div className="card-animate border-b border-base-300 last:border-0 hover:bg-gradient-to-r hover:from-primary/[0.02] hover:to-transparent transition-all duration-300 group">
      <div className="px-4 py-3.5 sm:px-5">
        {/* Top: date + status */}
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px] font-medium text-base-content/40 uppercase tracking-wider">
            {dateStr} • {timeStr}
          </span>
          <StatusBadge prediction={prediction} />
        </div>

        {/* Match: Home vs Away */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-base-200 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                <span className="text-[9px] font-black text-base-content/40 group-hover:text-primary transition-colors">
                  {prediction.home_team.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                {prediction.home_team}
              </span>
            </div>
          </div>

          <div className="flex-shrink-0 w-8 text-center">
            {prediction.result_score ? (
              <span className="text-xs font-bold text-primary bg-primary/10 rounded px-1.5 py-0.5">
                {prediction.result_score}
              </span>
            ) : (
              <span className="text-[10px] font-bold text-base-content/25">VS</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 justify-end">
              <span className="text-sm font-semibold truncate text-right group-hover:text-primary transition-colors">
                {prediction.away_team}
              </span>
              <div className="w-7 h-7 rounded-full bg-base-200 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                <span className="text-[9px] font-black text-base-content/40 group-hover:text-primary transition-colors">
                  {prediction.away_team.slice(0, 2).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Prediction info bar */}
        <div className="flex items-center gap-3 bg-base-200/50 rounded-lg px-3 py-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-base-content/40 uppercase font-medium">Tip</span>
            <span className="bg-primary text-primary-content text-[11px] font-bold px-2 py-0.5 rounded-md">
              {prediction.prediction}
            </span>
          </div>

          <div className="w-px h-4 bg-base-300" />

          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-base-content/40 uppercase font-medium">Conf</span>
            <ConfidenceBadge probability={prediction.prediction_probability} />
            {isHighConfidence && (
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" title="High confidence" />
            )}
          </div>

          {prediction.result_score && (
            <>
              <div className="w-px h-4 bg-base-300" />
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-base-content/40 uppercase font-medium">Score</span>
                <span className="text-xs font-bold text-primary">{prediction.result_score}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
