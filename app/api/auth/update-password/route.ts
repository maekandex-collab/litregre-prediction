import { NextResponse } from "next/server";

const BASE_URL =
  process.env.PREDICTION_API_BASE_URL ?? "https://mtn.lenhub.net";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(`${BASE_URL}/api/prediction/update/password/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to update password." },
      { status: 502 }
    );
  }
}
