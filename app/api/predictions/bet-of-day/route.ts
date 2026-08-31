import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { predictionAuthHeaders } from "@/lib/predictionApi";

const BASE_URL =
  process.env.PREDICTION_API_BASE_URL ?? "https://mtn.lenhub.net";

/** Requires auth upstream — send session cookie + Bearer when logged in. */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.backendToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${BASE_URL}/api/prediction/bet_of_day/`, {
      headers: predictionAuthHeaders(session.user.backendToken),
      next: { revalidate: 300 },
    });
    const text = await res.text();
    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      return NextResponse.json(
        {
          error: "Upstream returned non-JSON for bet of the day.",
          status: res.status,
          body: text.slice(0, 300),
        },
        { status: 502 }
      );
    }
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch bet of the day." },
      { status: 502 }
    );
  }
}
