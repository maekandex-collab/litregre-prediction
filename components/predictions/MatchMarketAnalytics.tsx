"use client";

import {
  type MatchMarketAnalytics,
  formatFairOdds,
  formatProbabilityPct,
  winningMarginLabel,
} from "@/lib/matchAnalytics";

interface Props {
  analytics: MatchMarketAnalytics;
  homeTeam?: string;
  awayTeam?: string;
}

function OddsCell({ probability, fair_odds, odds_capped }: {
  probability?: number;
  fair_odds?: number;
  odds_capped?: boolean;
}) {
  return (
    <div className="text-right tabular-nums">
      <div className="text-xs font-bold text-base-content">
        {formatProbabilityPct(probability)}
      </div>
      <div className="text-[10px] text-base-content/50">
        {formatFairOdds(fair_odds, odds_capped)}
      </div>
    </div>
  );
}

export default function MatchMarketAnalyticsPanel({
  analytics,
  homeTeam = "Home",
  awayTeam = "Away",
}: Props) {
  const { correctScores, cleanSheet, winningMargin, teamGoals } = analytics;
  const topScores = correctScores.slice(0, 8);
  const marginEntries = Object.entries(winningMargin).sort(
    (a, b) => (b[1].probability ?? 0) - (a[1].probability ?? 0)
  );

  return (
    <div className="border-t border-base-300 bg-base-200/30">
      <div className="px-5 py-3 border-b border-base-300/80">
        <h2 className="text-xs font-bold uppercase tracking-wider text-base-content/60">
          Expanded markets
        </h2>
        <p className="text-[11px] text-base-content/45 mt-0.5">
          Model probabilities and fair odds from today&apos;s featured match
        </p>
      </div>

      {topScores.length > 0 && (
        <section className="px-5 py-4 border-b border-base-300/60">
          <h3 className="text-[11px] font-bold uppercase tracking-wide text-primary mb-3">
            Correct score
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {topScores.map((row) => (
              <div
                key={row.score}
                className="rounded-lg border border-base-300 bg-base-100 px-2.5 py-2 flex items-center justify-between gap-2"
              >
                <span className="text-sm font-black text-base-content">{row.score}</span>
                <OddsCell {...row} />
              </div>
            ))}
          </div>
        </section>
      )}

      {(cleanSheet.home || cleanSheet.away) && (
        <section className="px-5 py-4 border-b border-base-300/60">
          <h3 className="text-[11px] font-bold uppercase tracking-wide text-primary mb-3">
            Clean sheet
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {cleanSheet.home && (
              <div className="rounded-lg border border-base-300 bg-base-100 px-3 py-2.5">
                <p className="text-[10px] text-base-content/50 mb-1 truncate">{homeTeam}</p>
                <OddsCell {...cleanSheet.home} />
              </div>
            )}
            {cleanSheet.away && (
              <div className="rounded-lg border border-base-300 bg-base-100 px-3 py-2.5">
                <p className="text-[10px] text-base-content/50 mb-1 truncate">{awayTeam}</p>
                <OddsCell {...cleanSheet.away} />
              </div>
            )}
          </div>
        </section>
      )}

      {marginEntries.length > 0 && (
        <section className="px-5 py-4 border-b border-base-300/60">
          <h3 className="text-[11px] font-bold uppercase tracking-wide text-primary mb-3">
            Winning margin
          </h3>
          <div className="space-y-1.5">
            {marginEntries.map(([key, row]) => (
              <div
                key={key}
                className="flex items-center justify-between gap-3 rounded-lg border border-base-300 bg-base-100 px-3 py-2"
              >
                <span className="text-xs font-semibold text-base-content/80">
                  {winningMarginLabel(key)}
                </span>
                <OddsCell {...row} />
              </div>
            ))}
          </div>
        </section>
      )}

      {(teamGoals.home || teamGoals.away) && (
        <section className="px-5 py-4">
          <h3 className="text-[11px] font-bold uppercase tracking-wide text-primary mb-3">
            Team goals
          </h3>
          <div className="space-y-4">
            {(
              [
                ["home", homeTeam, teamGoals.home],
                ["away", awayTeam, teamGoals.away],
              ] as const
            ).map(([side, team, lines]) => {
              if (!lines) return null;
              const sortedLines = Object.entries(lines).sort(
                (a, b) => parseFloat(a[0]) - parseFloat(b[0])
              );
              return (
                <div key={side}>
                  <p className="text-[10px] font-bold uppercase text-base-content/50 mb-2">
                    {team}
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[280px]">
                      <thead>
                        <tr className="text-[9px] uppercase text-base-content/45">
                          <th className="pb-1.5 font-semibold">Line</th>
                          <th className="pb-1.5 font-semibold text-right">Over</th>
                          <th className="pb-1.5 font-semibold text-right">Under</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedLines.map(([line, row]) => (
                          <tr key={line} className="border-t border-base-300/50">
                            <td className="py-2 text-xs font-bold">{line}</td>
                            <td className="py-2">
                              {row.over ? <OddsCell {...row.over} /> : "—"}
                            </td>
                            <td className="py-2">
                              {row.under ? <OddsCell {...row.under} /> : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[9px] text-base-content/40 mt-3">* Fair odds capped at 50.00</p>
        </section>
      )}
    </div>
  );
}
