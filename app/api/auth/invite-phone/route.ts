import { NextResponse } from "next/server";
import { normalizeNigerianPhone } from "@/lib/phone";

/**
 * Invite / registration phone lookup.
 * Frontend: /signup?invite=<token>&phone=<optional>
 *
 * When the backend invite API is ready, replace the local resolution below
 * with a call that returns { phone } for the invite token.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const invite = (searchParams.get("invite") ?? "").trim();
  const phoneParam = searchParams.get("phone") ?? "";

  if (!invite) {
    return NextResponse.json(
      { ok: false, error: "Invite token is required." },
      { status: 400 }
    );
  }

  const phone = phoneParam ? normalizeNigerianPhone(phoneParam) : "";

  if (phone && !/^234\d{10}$/.test(phone)) {
    return NextResponse.json(
      { ok: false, error: "Invalid phone number on invite link." },
      { status: 400 }
    );
  }

  // Placeholder until the dedicated invite API is wired:
  // return the phone carried on the invite URL so registration can lock it.
  if (!phone) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invite link is missing a phone number. Ask for a new invite link.",
        code: "PHONE_REQUIRED",
      },
      { status: 422 }
    );
  }

  return NextResponse.json({
    ok: true,
    phone,
    locked: true,
    invite,
  });
}
