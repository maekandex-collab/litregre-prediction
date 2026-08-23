/**
 * Match simulation handoff — plain team names + logo URLs only.
 * No match/game IDs or encoded slugs.
 *
 * Default game: /sim/pro-predictor.html (Pro Predictor).
 * Override with NEXT_PUBLIC_SIMULATION_URL if needed.
 */

export type SimulationTeams = {
  home: string;
  away: string;
  homeLogo?: string | null;
  awayLogo?: string | null;
};

export const SIMULATION_QUERY = {
  home: "home",
  away: "away",
  homeLogo: "homeLogo",
  awayLogo: "awayLogo",
} as const;

/** Bundled Pro Predictor game (adapted DeepSeek HTML sim). */
export const DEFAULT_SIMULATION_PATH = "/sim/pro-predictor.html";

function appendTeamParams(params: URLSearchParams, teams: SimulationTeams) {
  const home = teams.home?.trim();
  const away = teams.away?.trim();
  if (home) params.set(SIMULATION_QUERY.home, home);
  if (away) params.set(SIMULATION_QUERY.away, away);
  if (teams.homeLogo?.trim()) {
    params.set(SIMULATION_QUERY.homeLogo, teams.homeLogo.trim());
  }
  if (teams.awayLogo?.trim()) {
    params.set(SIMULATION_QUERY.awayLogo, teams.awayLogo.trim());
  }
}

/** In-app route: /simulate?home=…&away=…&homeLogo=…&awayLogo=… */
export function buildSimulationHref(teams: SimulationTeams): string {
  const params = new URLSearchParams();
  appendTeamParams(params, teams);
  const qs = params.toString();
  return qs ? `/simulate?${qs}` : "/simulate";
}

/** Game URL (relative or absolute) with the same plain-name query params. */
export function buildGameSimulationUrl(
  baseUrl: string,
  teams: SimulationTeams
): string {
  const isAbsolute = /^https?:\/\//i.test(baseUrl);
  if (isAbsolute) {
    const url = new URL(baseUrl);
    appendTeamParams(url.searchParams, teams);
    return url.toString();
  }
  const params = new URLSearchParams();
  appendTeamParams(params, teams);
  const qs = params.toString();
  const path = baseUrl.split("?")[0];
  return qs ? `${path}?${qs}` : path;
}

/** @deprecated use buildGameSimulationUrl */
export function buildExternalSimulationUrl(
  baseUrl: string,
  teams: SimulationTeams
): string {
  return buildGameSimulationUrl(baseUrl, teams);
}

export function getSimulationEmbedBase(): string {
  const raw = process.env.NEXT_PUBLIC_SIMULATION_URL?.trim();
  return raw || DEFAULT_SIMULATION_PATH;
}
