export interface MarketOddsEntry {
  probability?: number;
  fair_odds?: number;
  odds_capped?: boolean;
}

export interface CorrectScoreEntry extends MarketOddsEntry {
  score: string;
}

export interface TeamGoalsLine {
  over?: MarketOddsEntry;
  under?: MarketOddsEntry;
}

export interface MatchMarketAnalytics {
  correctScores: CorrectScoreEntry[];
  cleanSheet: { home?: MarketOddsEntry; away?: MarketOddsEntry };
  winningMargin: Record<string, MarketOddsEntry>;
  teamGoals: {
    home?: Record<string, TeamGoalsLine>;
    away?: Record<string, TeamGoalsLine>;
  };
}

type RawRecord = Record<string, unknown>;

function isRecord(v: unknown): v is RawRecord {
  return v != null && typeof v === "object" && !Array.isArray(v);
}

function asOddsEntry(v: unknown): MarketOddsEntry | undefined {
  if (!isRecord(v)) return undefined;
  const entry: MarketOddsEntry = {};
  if (typeof v.probability === "number") entry.probability = v.probability;
  if (typeof v.fair_odds === "number") entry.fair_odds = v.fair_odds;
  if (typeof v.odds_capped === "boolean") entry.odds_capped = v.odds_capped;
  return Object.keys(entry).length ? entry : undefined;
}

function unwrapBetRecord(raw: unknown): RawRecord | null {
  if (!raw) return null;
  if (Array.isArray(raw)) {
    const first = raw[0];
    return isRecord(first) ? first : null;
  }
  if (!isRecord(raw)) return null;

  if (Array.isArray(raw.data) && raw.data[0] && isRecord(raw.data[0])) {
    return raw.data[0] as RawRecord;
  }
  if (Array.isArray(raw.items) && raw.items[0] && isRecord(raw.items[0])) {
    return raw.items[0] as RawRecord;
  }
  return raw;
}

function parseCorrectScores(v: unknown): CorrectScoreEntry[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((item) => {
      if (!isRecord(item)) return null;
      const score = typeof item.score === "string" ? item.score : null;
      if (!score) return null;
      const entry = asOddsEntry(item);
      return entry ? { score, ...entry } : null;
    })
    .filter((x): x is CorrectScoreEntry => x != null);
}

function parseWinningMargin(v: unknown): Record<string, MarketOddsEntry> {
  if (!isRecord(v)) return {};
  const out: Record<string, MarketOddsEntry> = {};
  for (const [key, val] of Object.entries(v)) {
    const entry = asOddsEntry(val);
    if (entry) out[key] = entry;
  }
  return out;
}

function parseTeamGoalsSide(v: unknown): Record<string, TeamGoalsLine> | undefined {
  if (!isRecord(v)) return undefined;
  const out: Record<string, TeamGoalsLine> = {};
  for (const [line, val] of Object.entries(v)) {
    if (!isRecord(val)) continue;
    const row: TeamGoalsLine = {};
    const over = asOddsEntry(val.over);
    const under = asOddsEntry(val.under);
    if (over) row.over = over;
    if (under) row.under = under;
    if (Object.keys(row).length) out[line] = row;
  }
  return Object.keys(out).length ? out : undefined;
}

function parseTeamGoals(v: unknown): MatchMarketAnalytics["teamGoals"] {
  if (!isRecord(v)) return {};
  const home = parseTeamGoalsSide(v.home);
  const away = parseTeamGoalsSide(v.away);
  return { home, away };
}

function parseCleanSheet(v: unknown): MatchMarketAnalytics["cleanSheet"] {
  if (!isRecord(v)) return {};
  return {
    home: asOddsEntry(v.home),
    away: asOddsEntry(v.away),
  };
}

/** Pull expanded market analytics from bet-of-day (or similar) API payloads. */
export function extractMatchAnalytics(raw: unknown): MatchMarketAnalytics | null {
  const record = unwrapBetRecord(raw);
  if (!record) return null;

  const correctScores = parseCorrectScores(
    record.correct_score ?? record.correct_scores
  );
  const cleanSheet = parseCleanSheet(record.clean_sheet);
  const winningMargin = parseWinningMargin(
    record.winning_margin ?? record.winning_margine
  );
  const teamGoals = parseTeamGoals(record.team_goals);

  const hasCleanSheet = !!(cleanSheet.home || cleanSheet.away);
  const hasMargin = Object.keys(winningMargin).length > 0;
  const hasTeamGoals = !!(teamGoals.home || teamGoals.away);

  if (!correctScores.length && !hasCleanSheet && !hasMargin && !hasTeamGoals) {
    return null;
  }

  return { correctScores, cleanSheet, winningMargin, teamGoals };
}

export function formatProbabilityPct(probability?: number): string {
  if (probability == null || Number.isNaN(probability)) return "—";
  const pct = probability > 1 ? probability : probability * 100;
  return `${pct.toFixed(1)}%`;
}

export function formatFairOdds(odds?: number, capped?: boolean): string {
  if (odds == null || Number.isNaN(odds)) return "—";
  const label = odds.toFixed(2);
  return capped ? `${label}*` : label;
}

export function winningMarginLabel(key: string): string {
  const labels: Record<string, string> = {
    home_by_1: "Home by 1",
    home_by_2: "Home by 2",
    home_by_3_plus: "Home by 3+",
    draw: "Draw",
    away_by_1: "Away by 1",
    away_by_2: "Away by 2",
    away_by_3_plus: "Away by 3+",
  };
  return labels[key] ?? key.replace(/_/g, " ");
}
