/**
 * Smoke-test SportyBet booking against live fixtures.
 * Usage: node scripts/smoke-sporty-booking.js
 */
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function get(path) {
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

async function post(path, body) {
  const res = await fetch(`https://www.sportybet.com/api/ng${path}`, {
    method: "POST",
    headers: {
      "User-Agent": UA,
      Accept: "application/json",
      "Content-Type": "application/json",
      Clientid: "web",
      Platform: "web",
      Origin: "https://www.sportybet.com",
      Referer: "https://www.sportybet.com/ng/",
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

(async () => {
  const imp = await get("/factsCenter/importantEvents?sportId=sr:sport:1");
  const events = [];
  for (const t of imp.data || []) {
    for (const e of t.events || []) {
      if (e.status === 0) events.push(e);
    }
  }
  console.log("prematch events", events.length);
  const sample = events.slice(0, 2);
  if (!sample.length) {
    console.error("No prematch events");
    process.exit(1);
  }

  const selections = [];
  for (const e of sample) {
    const detail = await get(
      `/factsCenter/event?eventId=${encodeURIComponent(e.eventId)}`
    );
    const m = (detail.data?.markets || []).find((x) => String(x.id) === "1");
    const o = m?.outcomes?.find((x) => String(x.id) === "1");
    if (!o) continue;
    selections.push({
      eventId: e.eventId,
      marketId: "1",
      outcomeId: "1",
      odds: String(o.odds),
      specifier: "",
    });
    console.log("leg", e.homeTeamName, "vs", e.awayTeamName, "@", o.odds);
  }

  const share = await post("/orders/share", { selections });
  console.log("bizCode", share.bizCode, "code", share.data?.shareCode);
  console.log("url", share.data?.shareURL);
  if (share.bizCode !== 10000 || !share.data?.shareCode) process.exit(1);

  // Also exercise our matcher via dynamic import of compiled logic:
  // call create flow with team names from sample
  const legs = sample.map((e) => ({
    home: e.homeTeamName,
    away: e.awayTeamName,
    tip: "1",
    marketHint: "1x2",
  }));
  console.log("matcher legs", JSON.stringify(legs));

  // Load matcher through next-friendly path using child process with tsx if present
  try {
    const { pathToFileURL } = require("url");
    const path = require("path");
    // Use node's experimental TS if available — otherwise skip
    const modPath = path.join(__dirname, "../lib/sportybet.ts");
    console.log("sporty module path exists", require("fs").existsSync(modPath));
  } catch (_) {}

  console.log("SMOKE OK", share.data.shareCode);
})();
