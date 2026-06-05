import { NextResponse } from "next/server";
import { forgotPassword, extractError } from "@/lib/predictionApi";
import { normalizeNigerianPhone } from "@/lib/phone";

interface ForgotBody {
  phone?: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ForgotBody;
    const number = normalizeNigerianPhone(body.phone ?? "");

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

    const result = await forgotPassword({ phone_number: number });

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: extractError(result.data) },
        { status: result.status }
      );
    }

    return NextResponse.json({
      ok: true,
      message:
        "If an account exists for that number, we've sent a reset code via SMS.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Network error. Please try again." },
      { status: 500 }
    );
  }
}
