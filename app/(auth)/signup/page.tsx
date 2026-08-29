"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Trophy,
  Eye,
  EyeOff,
  Phone,
  Lock,
  Check,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { normalizeNigerianPhone } from "@/lib/phone";

const BENEFITS = [
  "Phone number comes from your invite link and stays locked",
  "Create a 4–6 digit PIN to secure your account",
  "Agree to terms, then your account is created instantly",
  "Sign in next with phone number + PIN",
];

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasInviteAccess = searchParams.has("invite");
  const phoneFromQuery = searchParams.get("phone") ?? "";

  const [phone, setPhone] = useState("");
  const [phoneLocked, setPhoneLocked] = useState(Boolean(phoneFromQuery.trim()));
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);

  const pinStrength = (() => {
    if (!pin) return 0;
    let score = 0;
    if (pin.length >= 4) score++;
    if (pin.length >= 5) score++;
    if (!/^([0-9])\1+$/.test(pin)) score++;
    if (!/^(0123|1234|1111|0000|4321|2222)$/.test(pin)) score++;
    return score;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][pinStrength];
  const strengthColor = ["", "bg-error", "bg-warning", "bg-info", "bg-success"][pinStrength];

  const normalizedPhonePreview = normalizeNigerianPhone(phone);
  const showPhoneHint =
    phone.length > 0 &&
    normalizedPhonePreview !== phone.replace(/\D/g, "") &&
    normalizedPhonePreview.startsWith("234");

  useEffect(() => {
    if (!hasInviteAccess) {
      router.replace("/login?inviteRequired=1");
    }
  }, [hasInviteAccess, router]);

  useEffect(() => {
    if (phoneFromQuery) {
      setPhone(normalizeNigerianPhone(phoneFromQuery));
      setPhoneLocked(true);
      return;
    }

    const invite = searchParams.get("invite");
    if (!invite) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/auth/invite-phone?invite=${encodeURIComponent(invite)}`
        );
        const data = (await res.json()) as { ok?: boolean; phone?: string };
        if (!cancelled && data.ok && data.phone) {
          setPhone(data.phone);
          setPhoneLocked(true);
        }
      } catch {
        // Invite API optional until backend ships; URL phone still works.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [phoneFromQuery, searchParams]);

  if (!hasInviteAccess) {
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const normalizedPhone = normalizeNigerianPhone(phone);

    if (!/^234\d{10}$/.test(normalizedPhone)) {
      setError(
        "Please enter a valid Nigerian phone number, e.g. 08012345678 or 2348012345678.",
      );
      return;
    }

    if (pin.length < 4) {
      setError("PIN must be at least 4 digits.");
      return;
    }

    if (pin !== confirmPin) {
      setError("PINs do not match.");
      return;
    }

    if (!agreed) {
      setError("Please accept the terms and conditions.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: normalizedPhone,
          pin,
          confirmPin,
          agreed,
        }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !data.ok) {
        setError(data.error ?? "Could not create your account. Please try again.");
        return;
      }

      toast.success("Account created! You can now sign in.");
      router.push(
        `/login?registered=1&phone=${encodeURIComponent(normalizedPhone)}`
      );
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Benefits */}
        <div className="hidden md:flex flex-col justify-center">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4">
            <Trophy size={24} className="text-white" />
          </div>
          <h2 className="font-display font-bold text-3xl mb-2">
            Join LitreGre <span className="text-primary">Prediction</span>
          </h2>
          <p className="text-base-content/60 text-sm mb-6">
            Use your invite link, set a PIN, accept the terms — your account is
            created right away. Then sign in with phone + PIN.
          </p>
          <ul className="space-y-3">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Check size={12} className="text-secondary" />
                </div>
                <span className="text-sm">{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 bg-primary/5 border border-primary/20 rounded-xl p-4">
            <p className="text-xs text-base-content/60">
              &ldquo;I signed up in under a minute with my invite link and a PIN.
              Straight to login after that.&rdquo;
            </p>
            <p className="text-xs font-semibold mt-2">- Chinedu I., Abuja</p>
          </div>
        </div>

        {/* Right: Form */}
        <div className="bg-base-100 border border-base-300 rounded-2xl shadow-xl p-8">
          {/* Mobile logo */}
          <div className="text-center mb-5 md:hidden">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mx-auto mb-2">
              <Trophy size={20} className="text-white" />
            </div>
            <h1 className="font-display font-bold text-xl">Create PIN</h1>
          </div>

          <h2 className="hidden md:block font-bold text-xl mb-1">Create your PIN</h2>
          <p className="hidden md:block text-sm text-base-content/60 mb-5">
            Confirm your phone from the invite link, choose a PIN, and finish signup.
          </p>

          {/* Error */}
          {error && (
            <div className="alert alert-error mb-4 py-2 text-sm">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Phone */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-sm font-medium">Phone number</span>
                {phoneLocked && (
                  <span className="label-text-alt text-[10px] font-semibold text-primary">
                    Locked from invite link
                  </span>
                )}
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type="tel"
                  placeholder="08012345678"
                  value={phone}
                  onChange={(e) => {
                    if (!phoneLocked) setPhone(e.target.value);
                  }}
                  required
                  readOnly={phoneLocked}
                  className={`input input-bordered w-full pl-9 text-sm ${
                    phoneLocked ? "bg-base-200 cursor-not-allowed opacity-90" : ""
                  }`}
                  autoComplete="tel"
                />
              </div>
              {phoneLocked ? (
                <p className="mt-1 text-[11px] text-base-content/60">
                  This number came from your registration link and cannot be changed.
                </p>
              ) : showPhoneHint ? (
                <p className="mt-1 text-[11px] text-base-content/60">
                  We&apos;ll register you as{" "}
                  <span className="font-semibold text-primary">
                    {normalizedPhonePreview}
                  </span>
                </p>
              ) : null}
            </div>

            {/* PIN */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-sm font-medium">Create PIN</span>
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type={showPin ? "text" : "password"}
                  placeholder="Minimum 4 digits"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  minLength={4}
                  className="input input-bordered w-full pl-9 pr-10 text-sm"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                >
                  {showPin ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {pin && (
                <div className="mt-1.5 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i <= pinStrength ? strengthColor : "bg-base-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-base-content/60">
                    PIN strength: <span className="font-semibold">{strengthLabel}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirm PIN */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-sm font-medium">Confirm PIN</span>
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type={showPin ? "text" : "password"}
                  placeholder="Repeat your PIN"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  className={`input input-bordered w-full pl-9 text-sm ${
                    confirmPin && confirmPin !== pin ? "input-error" : ""
                  }`}
                  autoComplete="new-password"
                />
                {confirmPin && confirmPin === pin && (
                  <Check size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-success" />
                )}
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2.5 cursor-pointer mt-1">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="checkbox checkbox-primary checkbox-sm mt-0.5 flex-shrink-0"
              />
              <span className="text-xs text-base-content/70 leading-relaxed">
                I agree to the{" "}
                <Link href="/terms-of-service" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                . I confirm I am 18+ years old.
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !agreed}
              className="btn btn-primary w-full mt-1"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <div className="divider text-xs text-base-content/40 my-4">
            Already have an account?
          </div>

          <Link href="/login" className="btn btn-outline btn-primary w-full">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="hidden md:block rounded-2xl bg-base-200/60 animate-pulse min-h-[520px]" />
            <div className="rounded-2xl bg-base-100 border border-base-300 shadow-xl p-8 animate-pulse min-h-[520px]" />
          </div>
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}
