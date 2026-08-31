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
  const params = new URLSearchParams();

  const page = searchParams.get("page");
  const pageSize = searchParams.get("page_size");
  const search = searchParams.get("search");

  if (page) params.set("page", page);
  if (pageSize) params.set("page_size", pageSize);
  if (search) params.set("search", search);

  try {
    const res = await fetch(
      `${BASE_URL}/api/prediction/general/today/?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`,
        },
        cache: "no-store",
      }
    );
    const text = await res.text();
    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      return NextResponse.json(
        {
          error: "Upstream returned non-JSON for today's predictions.",
          status: res.status,
          body: text.slice(0, 300),
        },
        { status: 502 }
      );
    }
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[predictions/today]", err);
    return NextResponse.json(
      {
        error: "Failed to fetch today's predictions.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 }
    );
  }
}
