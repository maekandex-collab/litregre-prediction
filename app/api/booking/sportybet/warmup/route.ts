import { NextResponse } from "next/server";
import { fetchSportyEventIndex } from "@/lib/sportybet";

/**
 * Warm SportyBet fixture index in the background so Generate is fast.
 * Safe to call often — index is cached ~3 minutes server-side.
 */
export async function GET() {
  try {
    const started = Date.now();
    const events = await fetchSportyEventIndex();
    return NextResponse.json({
      ok: true,
      events: events.length,
      ms: Date.now() - started,
    });
  } catch (e) {
    console.error("[sportybet warmup]", e);
    return NextResponse.json(
      { ok: false, error: "Warmup failed" },
      { status: 502 }
    );
  }
}
