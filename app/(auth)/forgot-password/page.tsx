"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trophy,
  Phone,
  Lock,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";
import { normalizeNigerianPhone } from "@/lib/phone";

type Step = "request" | "verify";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("request");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const normalizedPreview = normalizeNigerianPhone(phone);
  const showNormalizedHint =
    phone.length > 0 &&
    normalizedPreview !== phone.replace(/\D/g, "") &&
    normalizedPreview.startsWith("234");

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const normalizedPhone = normalizeNigerianPhone(phone);
    if (!/^234\d{10}$/.test(normalizedPhone)) {
      setError(
        "Please enter a valid Nigerian phone number, e.g. 08012345678."
      );
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizedPhone }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !data.ok) {
        setError(data.error ?? "Could not start the reset. Please try again.");
        return;
      }

      toast.success("Reset code sent. Check your SMS.");
      setStep("verify");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const normalizedPhone = normalizeNigerianPhone(phone);
    if (!/^\d{4,6}$/.test(pin)) {
      setError("Enter the 4 to 6 digit code sent to your phone.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizedPhone, pin }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !data.ok) {
        setError(data.error ?? "Could not reset your PIN. Please try again.");
        return;
      }

      toast.success("PIN reset successfully! Sign in to continue.");
      router.push(
        `/login?phone=${encodeURIComponent(normalizedPhone)}`
      );
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-base-100 border border-base-300 rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-3">
            <Trophy size={24} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl">
            {step === "request" ? "Forgot your PIN?" : "Enter reset code"}
          </h1>
          <p className="text-base-content/60 text-sm mt-1">
            {step === "request"
              ? "Enter your phone number and we'll text you a reset code."
              : "We sent a code to your phone. Enter it below to set access again."}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span
            className={`h-1.5 w-8 rounded-full ${
              step === "request" ? "bg-primary" : "bg-success"
            }`}
          />
          <span
            className={`h-1.5 w-8 rounded-full ${
              step === "verify" ? "bg-primary" : "bg-base-300"
            }`}
          />
        </div>

        {error && (
          <div className="alert alert-error mb-4 py-2 text-sm">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        {step === "request" ? (
          <form onSubmit={handleRequest} className="space-y-4">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-sm font-medium">
                  Phone number
                </span>
              </label>
              <div className="relative">
                <Phone
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
                />
                <input
                  type="tel"
                  placeholder="08012345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="input input-bordered w-full pl-9 text-sm"
                  autoComplete="tel"
                />
              </div>
              {showNormalizedHint && (
                <p className="mt-1 text-[11px] text-base-content/60">
                  We&apos;ll text{" "}
                  <span className="font-semibold text-primary">
                    {normalizedPreview}
                  </span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-2"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Send reset code"
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="rounded-lg border border-base-300 bg-base-200/60 px-3 py-2 text-xs text-base-content/70 flex items-center gap-2">
              <ShieldCheck size={14} className="text-success flex-shrink-0" />
              <span>
                Code sent to{" "}
                <span className="font-semibold text-base-content">
                  {normalizedPreview}
                </span>
              </span>
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-sm font-medium">
                  Reset code
                </span>
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
                />
                <input
                  type={showPin ? "text" : "password"}
                  inputMode="numeric"
                  placeholder="Enter the code from SMS"
                  value={pin}
                  onChange={(e) =>
                    setPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  required
                  minLength={4}
                  className="input input-bordered w-full pl-9 pr-10 text-sm tracking-widest"
                  autoComplete="one-time-code"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                >
                  {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-2"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Reset PIN"
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("request");
                setPin("");
                setError("");
              }}
              disabled={loading}
              className="btn btn-ghost btn-sm w-full"
            >
              Use a different number
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-base-content/60 hover:text-primary"
          >
            <ArrowLeft size={14} />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
