import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { changePassword } from "@/lib/predictionApi";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.backendToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = await changePassword(body, session.user.backendToken);
    return NextResponse.json(result.data, { status: result.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to change password." },
      { status: 502 }
    );
  }
}
