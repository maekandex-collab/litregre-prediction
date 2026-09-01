import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { predictionAuthHeaders } from "@/lib/predictionApi";

const BASE_URL =
  process.env.PREDICTION_API_BASE_URL ?? "https://mtn.lenhub.net";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.backendToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const marketType = searchParams.get("market_type");
  const page = searchParams.get("page");
  const pageSize = searchParams.get("page_size");
  const search = searchParams.get("search");

  const pageQs = new URLSearchParams();
  if (page) pageQs.set("page", page);
  if (pageSize) pageQs.set("page_size", pageSize);
  if (search) pageQs.set("search", search);

  try {
    // Path-based special markets (not ?market_type=...)
    let upstream: string;
    const q = pageQs.toString();
    if (marketType === "over_15") {
      upstream = `${BASE_URL}/api/special/prediction/over_15${q ? `?${q}` : ""}`;
    } else if (marketType === "basketball_over") {
      upstream = `${BASE_URL}/api/special/prediction/basketball_over${q ? `?${q}` : ""}`;
    } else if (marketType === "handicap") {
      upstream = `${BASE_URL}/api/special/prediction/handicap${q ? `?${q}` : ""}`;
    } else {
      if (marketType) pageQs.set("market_type", marketType);
      upstream = `${BASE_URL}/api/special/prediction/?${pageQs.toString()}`;
    }

    const res = await fetch(upstream, {
      headers: predictionAuthHeaders(session.user.backendToken),
      cache: "no-store",
    });
    const raw = await res.text();
    try {
      const data = JSON.parse(raw) as Record<string, unknown>;
      return NextResponse.json(data, { status: res.status });
    } catch {
      return NextResponse.json(
        {
          error: "Upstream returned a non-JSON response.",
          message:
            res.status === 404
              ? "This market endpoint is not available on the API yet."
              : "Failed to fetch special predictions.",
        },
        { status: res.status === 404 ? 404 : 502 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch special predictions." },
      { status: 502 }
    );
  }
}
