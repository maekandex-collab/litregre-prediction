import { NextResponse } from "next/server";
import {
  createSportyBetBookingCode,
  MAX_SLIP_LEGS,
  type SlipLegInput,
} from "@/lib/sportybet";

const rateMap = new Map<string, number>();

function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local"
  );
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  const now = Date.now();
  const last = rateMap.get(ip) || 0;
  if (now - last < 10_000) {
    return NextResponse.json(
      { error: "Please wait a few seconds before generating another code." },
      { status: 429 }
    );
  }
  rateMap.set(ip, now);

  let body: { legs?: SlipLegInput[] };
  try {
    body = (await req.json()) as { legs?: SlipLegInput[] };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const legs = Array.isArray(body.legs) ? body.legs : [];
  if (!legs.length) {
    return NextResponse.json(
      { error: "Add at least one tip to the slip." },
      { status: 400 }
    );
  }
  if (legs.length > MAX_SLIP_LEGS) {
    return NextResponse.json(
      { error: `Maximum ${MAX_SLIP_LEGS} selections per SportyBet code.` },
      { status: 400 }
    );
  }

  const sanitized: SlipLegInput[] = legs.map((l) => ({
    home: String(l.home || "").trim(),
    away: String(l.away || "").trim(),
    tip: String(l.tip || "").trim(),
    marketHint: l.marketHint ? String(l.marketHint) : null,
    id: l.id ? String(l.id) : undefined,
  }));

  if (sanitized.some((l) => !l.home || !l.away || !l.tip)) {
    return NextResponse.json(
      { error: "Each leg needs home, away, and tip." },
      { status: 400 }
    );
  }

  try {
    const result = await createSportyBetBookingCode(sanitized);
    return NextResponse.json(result);
  } catch (e) {
    console.error("[sportybet booking]", e);
    return NextResponse.json(
      { error: "Failed to create SportyBet booking code." },
      { status: 502 }
    );
  }
}
