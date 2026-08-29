import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const phone = (searchParams.get("phone") ?? "").replace(/\D/g, "");
  const token = searchParams.get("token") ?? "";

  if (phone.length < 10 || !token) {
    return NextResponse.redirect(`${origin}/login?invalidLink=1`);
  }

  // Legacy helper: account creation is POST /api/auth/register → create/user.
  // Keep redirect for old SMS-style links that still point here.
  return NextResponse.redirect(
    `${origin}/login?registered=1&phone=${encodeURIComponent(phone)}`
  );
}
