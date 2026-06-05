import { NextResponse } from "next/server";
import { resetPassword, extractError } from "@/lib/predictionApi";
import { normalizeNigerianPhone } from "@/lib/phone";

interface ResetBody {
  phone?: string;
  pin?: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ResetBody;
    const number = normalizeNigerianPhone(body.phone ?? "");
    const pin = (body.pin ?? "").trim();

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

    if (!/^\d{4,6}$/.test(pin)) {
      return NextResponse.json(
        { ok: false, error: "Enter the 4 to 6 digit code sent to your phone." },
        { status: 400 }
      );
    }

    const result = await resetPassword({ phone_number: number, pin });

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: extractError(result.data) },
        { status: result.status }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Your PIN has been reset. You can now sign in.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Network error. Please try again." },
      { status: 500 }
    );
  }
}
