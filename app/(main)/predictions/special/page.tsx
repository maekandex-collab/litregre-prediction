"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Zap,
  Target,
  Square,
  Dumbbell,
  Lock,
} from "lucide-react";
import SpecialPredictionCard from "@/components/predictions/SpecialPredictionCard";
import Pagination from "@/components/ui/Pagination";
import { useSpecialPredictions } from "@/hooks/usePredictions";

type MainTab = "special" | "goal-scorers" | "cards-corners" | "other-sports";
type SpecialSubTab = "1x2" | "btts" | "over_25";
type CardsSubTab = "card" | "corner";
type OtherSportsSubTab = "basketball" | "tennis" | "mma";

const MAIN_TABS: { id: MainTab; label: string; icon: React.ReactNode }[] = [
  { id: "special", label: "Special Bets", icon: <Zap size={15} /> },
  { id: "goal-scorers", label: "Goal Scorers", icon: <Target size={15} /> },
  { id: "cards-corners", label: "Cards & Corners", icon: <Square size={15} /> },
  { id: "other-sports", label: "Other Sports", icon: <Dumbbell size={15} /> },
];

const SPECIAL_SUB_TABS: { id: SpecialSubTab; label: string }[] = [
  { id: "1x2", label: "1X2" },
  { id: "btts", label: "BTTS" },
  { id: "over_25", label: "Over 2.5" },
];

const CARDS_SUB_TABS: { id: CardsSubTab; label: string }[] = [
  { id: "card", label: "Cards" },
  { id: "corner", label: "Corners" },
];

const OTHER_SPORTS_SUB_TABS: { id: OtherSportsSubTab; label: string }[] = [
  { id: "basketball", label: "Basketball" },
  { id: "tennis", label: "Tennis" },
  { id: "mma", label: "MMA" },
];

function AuthLockScreen() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Lock size={28} className="text-primary" />
      </div>
      <h3 className="font-bold text-lg mb-2">Members Only</h3>
      <p className="text-sm text-base-content/60 max-w-sm mb-6">
        Sign in to access Special Predictions including goal scorers, cards & corners, and more.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/login?callbackUrl=/predictions/special" className="btn btn-primary">
          Sign In
        </Link>
        <Link href="/signup?invite=1" className="btn btn-outline btn-primary">
          Create Account
        </Link>
      </div>
    </div>
  );
}

function SkeletonCards({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border border-base-300 rounded-xl overflow-hidden animate-pulse">
          <div className="bg-base-200/50 px-4 py-2 flex justify-between">
            <div className="h-3 bg-base-300 rounded w-20" />
            <div className="h-3 bg-base-300 rounded w-24" />
          </div>
          <div className="px-4 py-3.5 flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2.5">
              <div className="w-9 h-9 bg-base-300 rounded-full" />
              <div className="h-4 bg-base-300 rounded w-24" />
            </div>
            <div className="w-8 h-8 bg-base-200 rounded-full" />
            <div className="flex-1 flex items-center gap-2.5 justify-end">
              <div className="h-4 bg-base-300 rounded w-24" />
              <div className="w-9 h-9 bg-base-300 rounded-full" />
            </div>
          </div>
          <div className="px-4 pb-3.5">
            <div className="bg-base-200/60 rounded-lg px-3 py-3 flex items-center gap-3">
              <div className="h-5 bg-base-300 rounded w-14" />
              <div className="h-5 bg-base-300 rounded w-10" />
              <div className="h-5 bg-base-300 rounded w-8" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function getEndpointAndParams(
  mainTab: MainTab,
  specialSub: SpecialSubTab,
  cardsSub: CardsSubTab,
  otherSportsSub: OtherSportsSubTab
): { endpoint: string; params: Record<string, string> } {
  switch (mainTab) {
    case "special":
      return { endpoint: "/api/predictions/special", params: { market_type: specialSub } };
    case "goal-scorers":
      return { endpoint: "/api/predictions/goal-scorers", params: {} };
    case "cards-corners":
      return { endpoint: "/api/predictions/cards-corners", params: { market_type: cardsSub } };
    case "other-sports":
      return { endpoint: "/api/predictions/other-sports", params: { market_type: otherSportsSub } };
  }
}

export default function SpecialPredictionsPage() {
  const { data: session, status: authStatus } = useSession();
  const isLoggedIn = authStatus === "authenticated" && !!session?.user;

  const [mainTab, setMainTab] = useState<MainTab>("special");
  const [specialSub, setSpecialSub] = useState<SpecialSubTab>("1x2");
  const [cardsSub, setCardsSub] = useState<CardsSubTab>("card");
  const [otherSportsSub, setOtherSportsSub] = useState<OtherSportsSubTab>("basketball");
  const [page, setPage] = useState(1);

  const { endpoint, params } = getEndpointAndParams(mainTab, specialSub, cardsSub, otherSportsSub);

  const { data, isLoading, isError, refetch } = useSpecialPredictions(
    endpoint,
    params,
    page,
    isLoggedIn
  );

  const items = data?.items ?? [];
  const totalPages = data?.pages ?? 1;

  function changeMainTab(tab: MainTab) {
    setMainTab(tab);
    setPage(1);
  }

  function changeSpecialSub(sub: SpecialSubTab) {
    setSpecialSub(sub);
    setPage(1);
  }

  function changeCardsSub(sub: CardsSubTab) {
    setCardsSub(sub);
    setPage(1);
  }

  function changeOtherSportsSub(sub: OtherSportsSubTab) {
    setOtherSportsSub(sub);
    setPage(1);
  }

  if (authStatus === "loading") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <SkeletonCards count={5} />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <AuthLockScreen />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0f2744] via-[#1a3a6b] to-[#0d4a8a] rounded-2xl p-6 sm:p-8 mb-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-secondary/20 transform translate-x-12 -translate-y-12 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-blue-400/10 transform -translate-x-8 translate-y-8 blur-xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 backdrop-blur-sm flex items-center justify-center border border-secondary/30">
              <Zap size={20} className="text-secondary" />
            </div>
            <div>
              <h1 className="font-bold text-xl sm:text-2xl font-display">Special Predictions</h1>
              <p className="text-white/50 text-xs">Premium market analysis</p>
            </div>
          </div>
          <p className="text-white/70 text-sm max-w-xl leading-relaxed">
            Expert picks across special markets — 1X2, BTTS, Over 2.5 goals, goal scorers, cards & corners, basketball, tennis, and MMA.
          </p>
        </div>
      </div>

      {/* Main tabs */}
      <div className="flex overflow-x-auto gap-1.5 mb-5 pb-1 scrollbar-none bg-base-100 border border-base-300 rounded-xl p-1.5 shadow-sm">
        {MAIN_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => changeMainTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-300 ${
              mainTab === tab.id
                ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-md"
                : "text-base-content/60 hover:bg-base-200 hover:text-base-content"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub tabs */}
      {mainTab === "special" && (
        <div className="flex gap-2 mb-5">
          {SPECIAL_SUB_TABS.map((sub) => (
            <button
              key={sub.id}
              onClick={() => changeSpecialSub(sub.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 border ${
                specialSub === sub.id
                  ? "bg-secondary text-white border-secondary shadow-sm shadow-secondary/20"
                  : "bg-base-100 text-base-content/60 border-base-300 hover:border-secondary/50 hover:text-secondary"
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}

      {mainTab === "cards-corners" && (
        <div className="flex gap-2 mb-5">
          {CARDS_SUB_TABS.map((sub) => (
            <button
              key={sub.id}
              onClick={() => changeCardsSub(sub.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 border ${
                cardsSub === sub.id
                  ? "bg-secondary text-white border-secondary shadow-sm shadow-secondary/20"
                  : "bg-base-100 text-base-content/60 border-base-300 hover:border-secondary/50 hover:text-secondary"
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}

      {mainTab === "other-sports" && (
        <div className="flex gap-2 mb-5">
          {OTHER_SPORTS_SUB_TABS.map((sub) => (
            <button
              key={sub.id}
              onClick={() => changeOtherSportsSub(sub.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 border ${
                otherSportsSub === sub.id
                  ? "bg-secondary text-white border-secondary shadow-sm shadow-secondary/20"
                  : "bg-base-100 text-base-content/60 border-base-300 hover:border-secondary/50 hover:text-secondary"
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {isLoading && <SkeletonCards count={5} />}

      {!isLoading && isError && (
        <div className="text-center py-16 bg-base-100 border border-base-300 rounded-xl">
          <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-3">
            <Zap size={20} className="text-error" />
          </div>
          <p className="text-error font-bold text-sm">Failed to load predictions</p>
          <button onClick={() => refetch()} className="btn btn-primary btn-sm mt-4 rounded-lg">
            Try Again
          </button>
        </div>
      )}

      {!isLoading && !isError && items.length === 0 && (
        <div className="text-center py-16 bg-base-100 border border-base-300 rounded-xl">
          <div className="w-14 h-14 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-4">
            <Zap size={24} className="text-base-content/30" />
          </div>
          <p className="font-bold text-base-content/70 text-sm">No predictions available</p>
          <p className="text-xs text-base-content/40 mt-1.5 max-w-xs mx-auto">
            Check back later for fresh expert picks in this category.
          </p>
        </div>
      )}

      {!isLoading && !isError && items.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="text-xs text-base-content/40 font-medium">
              {items.length} prediction{items.length !== 1 ? "s" : ""} found
            </p>
            {totalPages > 1 && (
              <p className="text-xs text-base-content/40 font-medium">
                Page {page} of {totalPages}
              </p>
            )}
          </div>

          <div className="space-y-0">
            {items.map((item, idx) => (
              <SpecialPredictionCard
                key={item.match_id || item.game_id || idx}
                prediction={item}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
