/**
 * Smoke: book from live EaglePredict tips that exist on SportyBet NG.
 */
import {
  createSportyBetBookingCode,
  fetchSportyEventIndex,
} from "../lib/sportybet.ts";
import { loginUser, extractToken } from "../lib/predictionApi.ts";
import { normalizeTip } from "../lib/tipNormalize.ts";

async function main() {
  const idx = await fetchSportyEventIndex();
  console.log("sporty fixtures", idx.length);

  const login = await loginUser({ number: "2348069916376", pin: "1234" });
  const token = extractToken(login.data);
  if (!token) throw new Error("login failed");

  const base = "https://mtn.lenhub.net";
  const headers = { Authorization: `Bearer ${token}` };

  const sources: [string, string, string | null][] = [
    ["today", "/api/prediction/general/today/?page_size=100", "1x2"],
    ["vip", "/api/prediction/general/vip/?page_size=100", null],
    ["over_25", "/api/special/prediction/?market_type=over_25", "over_25"],
    ["btts", "/api/special/prediction/?market_type=btts", "btts"],
  ];

  const legs: {
    home: string;
    away: string;
    tip: string;
    marketHint: string | null;
    source: string;
  }[] = [];

  for (const [label, path, hint] of sources) {
    const r = await fetch(`${base}${path}`, { headers });
    const j = await r.json();
    const arr = (j.items || j.results || j.result || j.data || []) as Record<
      string,
      unknown
    >[];
    for (const i of arr) {
      const home = String(i.home_team || i.home_name || i.home || "");
      const away = String(i.away_team || i.away_name || i.away || "");
      let tip = String(i.prediction || i.label || i.tip || "");
      if (!tip && hint === "over_25") tip = "Over";
      if (!tip && hint === "btts") tip = "BTTS Yes";
      if (!home || !away || !normalizeTip(tip, hint)) continue;
      legs.push({ home, away, tip, marketHint: hint, source: label });
    }
  }

  console.log("candidate tips", legs.length);
  // Try booking in small batches until we get a code
  let booked = 0;
  let code: string | null = null;
  let url: string | null = null;
  for (let i = 0; i < legs.length; i += 5) {
    const batch = legs.slice(i, i + 5);
    const result = await createSportyBetBookingCode(batch);
    console.log(
      "batch",
      i,
      "booked",
      result.booked.length,
      "failed",
      result.failed.length,
      "code",
      result.code
    );
    if (result.booked.length) {
      booked += result.booked.length;
      console.log(
        "ok legs",
        result.booked.map((b) => `${b.home} vs ${b.away} (${b.label})`)
      );
    }
    if (result.code) {
      code = result.code;
      url = result.url;
      break;
    }
  }

  if (!code) {
    console.error("FAIL: no live tip produced a SportyBet code");
    process.exit(1);
  }

  const loaded = await fetch(
    `https://www.sportybet.com/api/ng/orders/share/${code}`,
    {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
        Clientid: "web",
        Platform: "web",
        Origin: "https://www.sportybet.com",
        Referer: "https://www.sportybet.com/ng/",
      },
    }
  ).then((r) => r.json());

  if (loaded.bizCode !== 10000 || !loaded.data?.ticket?.selections?.length) {
    console.error("FAIL: code not loadable", loaded);
    process.exit(1);
  }

  console.log("SMOKE OK", { code, url, booked, selections: loaded.data.ticket.selections.length });
  void idx;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
