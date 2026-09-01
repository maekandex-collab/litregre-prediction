import { NextResponse } from "next/server";
import { loginUser, extractError, friendlyAuthError } from "@/lib/predictionApi";
import { normalizeNigerianPhone } from "@/lib/phone";

/**
 * Probe login against the prediction API so the UI can show the real
 * backend message (e.g. "User does not exist dial *7098# to subscribe…")
 * before NextAuth creates a session.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { phone?: string; pin?: string };
    const number = normalizeNigerianPhone(body.phone ?? "");
    const pin = body.pin ?? "";

    if (!/^234\d{10}$/.test(number)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Invalid phone number. Use a Nigerian number, e.g. 08012345678.",
        },
        { status: 400 }
      );
    }

    if (!pin) {
      return NextResponse.json(
        { ok: false, error: "Enter your PIN." },
        { status: 400 }
      );
    }

    const result = await loginUser({ number, pin });

    if (!result.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: friendlyAuthError(
            extractError(
              result.data as Record<string, unknown>,
              "Invalid phone number or PIN. Please try again."
            )
          ),
        },
        { status: result.status || 400 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Network error. Please try again." },
      { status: 500 }
    );
  }
}
