import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

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
    // Over 1.5 lives at /api/special/prediction/over_15 (path),
    // not ?market_type=over_15 (that returns "Invalid market type").
    let upstream: string;
    if (marketType === "over_15") {
      const q = pageQs.toString();
      upstream = `${BASE_URL}/api/special/prediction/over_15${q ? `?${q}` : ""}`;
    } else {
      if (marketType) pageQs.set("market_type", marketType);
      upstream = `${BASE_URL}/api/special/prediction/?${pageQs.toString()}`;
    }

    const res = await fetch(upstream, {
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
      },
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch special predictions." },
      { status: 502 }
    );
  }
}
