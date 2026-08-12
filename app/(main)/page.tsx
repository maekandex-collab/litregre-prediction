"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Trophy, Lock, Crown } from "lucide-react";
import PredictionOfTheDay from "@/components/home/PredictionOfTheDay";
import PastPredictionsList from "@/components/home/PastPredictionsList";
import HeroSwiper from "@/components/home/HeroSwiper";
import StatsCounter from "@/components/home/StatsCounter";
import UssdBanner from "@/components/home/UssdBanner";
import HomeDisclaimer from "@/components/home/HomeDisclaimer";
import HomeFaq from "@/components/home/HomeFaq";
import GeneralPredictionCard from "@/components/predictions/GeneralPredictionCard";
import VIPPredictionCard from "@/components/predictions/VIPPredictionCard";
import Pagination from "@/components/ui/Pagination";
import SearchBar from "@/components/ui/SearchBar";
import { useTodayPredictions, useVIPPredictions } from "@/hooks/usePredictions";

type Tab = "general" | "vip";

const PAGE_SIZE = 10;

function SkeletonRows({ count = 6 }: { count?: number }) {
  return (
    <div className="divide-y divide-base-300">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-3 animate-pulse">
          <div className="w-10 h-3 bg-base-300 rounded" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 bg-base-300 rounded w-2/3" />
            <div className="h-3 bg-base-300 rounded w-1/2" />
          </div>
          <div className="w-12 h-5 bg-base-300 rounded-full" />
          <div className="w-14 h-5 bg-base-300 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function AuthLockScreen({ title, message, callbackUrl }: { title: string; message: string; callbackUrl?: string }) {
  const loginHref = callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login";
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Lock size={28} className="text-primary" />
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-base-content/60 max-w-sm mb-6">
        {message}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href={loginHref} className="btn btn-primary">
          Sign In
        </Link>
        <Link href="/signup?invite=1" className="btn btn-outline btn-primary">
          Create Account
        </Link>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { data: session, status: authStatus } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [todayPage, setTodayPage] = useState(1);
  const [todaySearch, setTodaySearch] = useState("");
  const [vipPage, setVipPage] = useState(1);
  const [vipSearch, setVipSearch] = useState("");

  const isLoggedIn = authStatus === "authenticated" && !!session?.user;

  const {
    data: todayData,
    isLoading: todayLoading,
    isError: todayIsError,
    refetch: refetchToday,
  } = useTodayPredictions(todayPage, todaySearch, isLoggedIn && activeTab === "general");

  const {
    data: vipData,
    isLoading: vipLoading,
    isError: vipIsError,
    refetch: refetchVip,
  } = useVIPPredictions(vipPage, vipSearch, isLoggedIn && activeTab === "vip");

  const todayItems = todayData?.items ?? [];
  const todayCount = todayData?.count ?? 0;
  const todayTotalPages = Math.ceil(todayCount / PAGE_SIZE) || 1;

  const vipItems = vipData?.items ?? [];
  const vipCount = vipData?.count ?? 0;
  const vipTotalPages = Math.ceil(vipCount / PAGE_SIZE) || 1;

  function handleTodaySearch(q: string) {
    setTodaySearch(q);
    setTodayPage(1);
  }

  function handleVipSearch(q: string) {
    setVipSearch(q);
    setVipPage(1);
  }

  function handleTodayPageChange(page: number) {
    setTodayPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleVIPPageChange(page: number) {
    setVipPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4">
      {/* Hero Carousel + USSD + Stats */}
      <HeroSwiper />
      <UssdBanner />
      <HomeDisclaimer />
      <StatsCounter />

      <div className="flex flex-col lg:flex-row gap-4">

        {/* ── Main Feed ── */}
        <div className="flex-1 min-w-0 order-2 lg:order-1">

          {/* Tab bar */}
          <div className="flex gap-1 mb-4 bg-base-100 border border-base-300 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setActiveTab("general")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold transition-all duration-300 ${
                activeTab === "general"
                  ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-md"
                  : "text-base-content/60 hover:text-base-content hover:bg-base-200"
              }`}
            >
              <Trophy size={15} />
              Today&apos;s Tips
              {!isLoggedIn && <Lock size={12} className="opacity-60" />}
              {isLoggedIn && todayCount > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeTab === "general"
                      ? "bg-white/20 text-white"
                      : "bg-base-300 text-base-content/60"
                  }`}
                >
                  {todayCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("vip")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold transition-all duration-300 ${
                activeTab === "vip"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                  : "text-base-content/60 hover:text-base-content hover:bg-base-200"
              }`}
            >
              <Crown size={15} />
              VIP
              {!isLoggedIn && <Lock size={12} className="opacity-60" />}
              {isLoggedIn && vipCount > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeTab === "vip"
                      ? "bg-white/20 text-white"
                      : "bg-base-300 text-base-content/60"
                  }`}
                >
                  {vipCount}
                </span>
              )}
            </button>
          </div>

          {/* ── General Tab (today's tips — login required) ── */}
          {activeTab === "general" && (
            <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden shadow-sm">
              <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-primary via-blue-600 to-blue-700 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/20 blur-lg" />
                </div>
                <Trophy size={16} className="relative z-10" />
                <span className="font-bold text-sm relative z-10">Today&apos;s Tips</span>
                {isLoggedIn && todayCount > 0 && (
                  <span className="ml-auto relative z-10 bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {todayCount} matches
                  </span>
                )}
              </div>

              {!isLoggedIn && authStatus !== "loading" && (
                <AuthLockScreen
                  title="Sign in to see today's tips"
                  message="Today's predictions are available to registered users. Past results are still visible in the Past Predictions panel."
                  callbackUrl="/"
                />
              )}

              {authStatus === "loading" && <SkeletonRows count={6} />}

              {isLoggedIn && (
                <>
                  <div className="p-3 border-b border-base-300 bg-base-200/40">
                    <SearchBar
                      placeholder="Search today's tips by team or competition…"
                      onSearch={handleTodaySearch}
                    />
                  </div>

                  {todayLoading && <SkeletonRows count={6} />}

                  {todayIsError && (
                    <div className="p-6 text-center">
                      <p className="text-sm text-error mb-3">Could not load today&apos;s tips.</p>
                      <button
                        onClick={() => refetchToday()}
                        className="btn btn-sm btn-outline btn-primary"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {!todayLoading && !todayIsError && todayItems.length === 0 && (
                    <div className="py-12 text-center">
                      <p className="text-3xl mb-2">{todaySearch ? "🔍" : "⚽"}</p>
                      <p className="font-semibold text-sm">
                        {todaySearch
                          ? `No matches for "${todaySearch}"`
                          : "No tips for today yet"}
                      </p>
                      <p className="text-xs text-base-content/50 mt-1">
                        {todaySearch ? "Try a different team or league name" : "Check back later"}
                      </p>
                    </div>
                  )}

                  {!todayLoading &&
                    todayItems.map((p) => (
                      <GeneralPredictionCard key={p.game_id} prediction={p} />
                    ))}

                  {!todayIsError && todayItems.length > 0 && (
                    <div className="border-t border-base-300">
                      <Pagination
                        currentPage={todayPage}
                        totalPages={todayTotalPages}
                        onPageChange={handleTodayPageChange}
                        loading={todayLoading}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ── VIP Tab ── */}
          {activeTab === "vip" && (
            <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden shadow-sm">
              <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-500 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/20 blur-lg" />
                </div>
                <Crown size={16} className="relative z-10" />
                <span className="font-bold text-sm relative z-10">VIP Predictions</span>
                {isLoggedIn && vipCount > 0 && (
                  <span className="ml-auto relative z-10 bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {vipCount} picks
                  </span>
                )}
              </div>

              {!isLoggedIn && authStatus !== "loading" && (
                <AuthLockScreen
                  title="VIP Predictions"
                  message="VIP predictions include team logos, competition details, accurate odds and higher-confidence tips. Sign in to unlock access."
                  callbackUrl="/"
                />
              )}

              {authStatus === "loading" && <SkeletonRows count={4} />}

              {isLoggedIn && (
                <>
                  <div className="p-3 border-b border-base-300 bg-base-200/40">
                    <SearchBar
                      placeholder="Search VIP picks by team or league…"
                      onSearch={handleVipSearch}
                    />
                  </div>

                  {vipLoading && <SkeletonRows count={4} />}

                  {vipIsError && (
                    <div className="p-6 text-center">
                      <p className="text-sm text-error mb-3">Could not load VIP predictions.</p>
                      <button
                        onClick={() => refetchVip()}
                        className="btn btn-sm btn-outline btn-primary"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {!vipLoading && !vipIsError && vipItems.length === 0 && (
                    <div className="py-12 text-center">
                      <p className="text-3xl mb-2">{vipSearch ? "🔍" : "👑"}</p>
                      <p className="font-semibold text-sm">
                        {vipSearch ? `No matches for "${vipSearch}"` : "No VIP predictions yet"}
                      </p>
                      <p className="text-xs text-base-content/50 mt-1">
                        {vipSearch ? "Try a different team or league name" : "Check back later"}
                      </p>
                    </div>
                  )}

                  <div className="p-3">
                    {!vipLoading && vipItems.map((p) => (
                      <VIPPredictionCard key={p.match_id} prediction={p} />
                    ))}
                  </div>

                  {!vipIsError && vipItems.length > 0 && (
                    <div className="border-t border-base-300">
                      <Pagination
                        currentPage={vipPage}
                        totalPages={vipTotalPages}
                        onPageChange={handleVIPPageChange}
                        loading={vipLoading}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 order-1 lg:order-2 space-y-4">
          <PredictionOfTheDay />
          <PastPredictionsList limit={6} />
        </aside>
      </div>

      <HomeFaq />
    </div>
  );
}
