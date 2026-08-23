/**
 * End-to-end: sample EaglePredict-style tips → SportyBet code → verify loadable.
 * Uses live SportyBet fixtures as "tips" (same as API tips would after team name match).
 */
import { createSportyBetBookingCode } from "../lib/sportybet.ts";
import { normalizeTip } from "../lib/tipNormalize.ts";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function sportyGet(path: string) {
  const res = await fetch(`https://www.sportybet.com/api/ng${path}`, {
    headers: {
      "User-Agent": UA,
      Accept: "application/json",
      Clientid: "web",
      Platform: "web",
      Origin: "https://www.sportybet.com",
      Referer: "https://www.sportybet.com/ng/",
    },
  });
  return res.json();
}

async function main() {
  // Tip normalize unit checks (Today / VIP / Special labels)
  const cases: [string, string | null][] = [
    ["1", "1x2"],
    ["X", "1x2"],
    ["2", null],
    ["Home Win", null],
    ["Over 2.5", "over_25"],
    ["GG", "btts"],
    ["BTTS Yes", null],
  ];
  for (const [tip, hint] of cases) {
    const n = normalizeTip(tip, hint);
    if (!n) throw new Error(`normalize failed for ${tip}`);
    console.log("normalize OK", tip, "→", n.market, n.pick);
  }

  const imp = await sportyGet("/factsCenter/importantEvents?sportId=sr:sport:1");
  const events: { homeTeamName: string; awayTeamName: string }[] = [];
  for (const t of imp.data || []) {
    for (const e of t.events || []) {
      if (e.status === 0) events.push(e);
    }
  }
  if (events.length < 3) throw new Error("need ≥3 prematch events");

  // Simulate Today + Special tips mixed slip
  const legs = [
    {
      home: events[0].homeTeamName,
      away: events[0].awayTeamName,
      tip: "1",
      marketHint: "1x2",
    },
    {
      home: events[1].homeTeamName,
      away: events[1].awayTeamName,
      tip: "Over 2.5",
      marketHint: "over_25",
    },
    {
      home: events[2].homeTeamName,
      away: events[2].awayTeamName,
      tip: "GG",
      marketHint: "btts",
    },
  ];

  console.log("booking legs…");
  const result = await createSportyBetBookingCode(legs);
  console.log(JSON.stringify(result, null, 2));

  if (!result.code) {
    console.error("FAIL: no code");
    process.exit(1);
  }
  if (result.failed.length) {
    console.warn("partial failures", result.failed);
  }

  const loaded = await sportyGet(`/orders/share/${result.code}`);
  if (loaded.bizCode !== 10000 || !loaded.data?.ticket?.selections?.length) {
    console.error("FAIL: code not loadable", loaded);
    process.exit(1);
  }
  console.log(
    "LOAD OK selections",
    loaded.data.ticket.selections.length,
    "code",
    result.code,
    "url",
    result.url
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
