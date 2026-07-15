"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  User,
  Bell,
  Shield,
  LogOut,
  Trophy,
  Star,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login?callbackUrl=/profile");
    },
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);

    if (newPin !== confirmPin) {
      setPwMsg({ type: "error", text: "New PIN and confirmation don't match." });
      return;
    }
    if (newPin.length < 4) {
      setPwMsg({ type: "error", text: "New PIN must be at least 4 digits." });
      return;
    }

    setChangingPw(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ old_pin: oldPin, new_pin: newPin }),
      });
      const data = await res.json();
      if (res.ok) {
        setPwMsg({ type: "success", text: data.message || "Password changed successfully!" });
        setOldPin("");
        setNewPin("");
        setConfirmPin("");
      } else {
        setPwMsg({
          type: "error",
          text: data.message || data.error || data.detail || "Failed to change password.",
        });
      }
    } catch {
      setPwMsg({ type: "error", text: "Network error. Please try again." });
    } finally {
      setChangingPw(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="skeleton h-48 w-full rounded-2xl mb-4" />
        <div className="skeleton h-32 w-full rounded-xl" />
      </div>
    );
  }

  const user = session?.user;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      {/* Profile card */}
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 mb-5 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white transform translate-x-12 -translate-y-12" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white transform -translate-x-8 translate-y-8" />
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold border-2 border-white/40">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User size={28} />}
          </div>
          <div>
            <h1 className="font-display font-bold text-xl">{user?.name ?? "Member"}</h1>
            <p className="text-white/80 text-sm">{user?.email}</p>
            <span className="badge badge-sm bg-white/20 text-white border-0 mt-1">Free Plan</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { icon: <Trophy size={16} />, val: "0", label: "Tips Saved" },
          { icon: <Star size={16} />, val: "0", label: "Favourites" },
          { icon: <Bell size={16} />, val: "0", label: "Alerts" },
        ].map((s) => (
          <div key={s.label} className="bg-base-100 border border-base-300 rounded-xl p-3 text-center hover:shadow-md transition-shadow">
            <div className="flex justify-center text-primary mb-1">{s.icon}</div>
            <p className="font-bold text-lg">{s.val}</p>
            <p className="text-[10px] text-base-content/60">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div className="bg-base-100 border border-base-300 rounded-xl divide-y divide-base-300 mb-4">
        <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-base-200/50 transition-colors">
          <span className="text-primary"><User size={15} /></span>
          <span className="text-sm font-medium">Edit Profile</span>
          <span className="ml-auto text-base-content/30">›</span>
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-base-200/50 transition-colors">
          <span className="text-primary"><Bell size={15} /></span>
          <span className="text-sm font-medium">Notifications</span>
          <span className="ml-auto text-base-content/30">›</span>
        </a>
        <button
          onClick={() => setShowPasswordForm(!showPasswordForm)}
          className="flex items-center gap-3 px-4 py-3 hover:bg-base-200/50 transition-colors w-full text-left"
        >
          <span className="text-primary"><Shield size={15} /></span>
          <span className="text-sm font-medium">Change Password</span>
          <span className="ml-auto text-base-content/30">{showPasswordForm ? "▾" : "›"}</span>
        </button>
      </div>

      {/* Change Password Form */}
      {showPasswordForm && (
        <div className="bg-base-100 border border-base-300 rounded-xl p-5 mb-4 card-animate">
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
            <Shield size={14} className="text-primary" />
            Change PIN
          </h3>

          <form onSubmit={handleChangePassword} className="space-y-3">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs">Current PIN</span>
              </label>
              <div className="relative">
                <input
                  type={showOld ? "text" : "password"}
                  className="input input-bordered input-sm w-full pr-10"
                  value={oldPin}
                  onChange={(e) => setOldPin(e.target.value)}
                  placeholder="Enter current PIN"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40"
                >
                  {showOld ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs">New PIN</span>
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  className="input input-bordered input-sm w-full pr-10"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="Enter new PIN"
                  required
                  minLength={4}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40"
                >
                  {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs">Confirm New PIN</span>
              </label>
              <input
                type="password"
                className="input input-bordered input-sm w-full"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="Confirm new PIN"
                required
                minLength={4}
              />
            </div>

            {pwMsg && (
              <div className={`flex items-center gap-2 text-xs ${pwMsg.type === "success" ? "text-success" : "text-error"}`}>
                {pwMsg.type === "success" ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                {pwMsg.text}
              </div>
            )}

            <button
              type="submit"
              disabled={changingPw}
              className="btn btn-primary btn-sm w-full"
            >
              {changingPw ? <span className="loading loading-spinner loading-xs" /> : "Update PIN"}
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="btn btn-error btn-outline btn-sm gap-2"
      >
        <LogOut size={14} /> Sign Out
      </button>
    </div>
  );
}
