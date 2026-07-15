import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiFetch";
import type { GeneralPrediction } from "@/components/predictions/GeneralPredictionCard";
import type { VIPPrediction } from "@/components/predictions/VIPPredictionCard";
import type { BetOfDay } from "@/components/home/PredictionOfTheDay";
import type { SpecialPrediction } from "@/components/predictions/SpecialPredictionCard";

interface PaginatedResponse<T> {
  items: T[];
  count: number;
}

interface SpecialPaginatedResponse {
  count: number;
  pages: number;
  page: number;
  page_size: number;
  results?: SpecialPrediction[];
  result?: SpecialPrediction[];
}

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await apiFetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export function useTodayPredictions(
  page: number,
  search: string,
  enabled: boolean
) {
  return useQuery({
    queryKey: ["predictions", "today", page, search],
    queryFn: () => {
      const qs = new URLSearchParams({
        page: String(page),
        page_size: "10",
      });
      if (search) qs.set("search", search);
      return fetchJSON<PaginatedResponse<GeneralPrediction>>(
        `/api/predictions/today?${qs}`
      );
    },
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 3 * 60 * 1000,
  });
}

export function useVIPPredictions(
  page: number,
  search: string,
  enabled: boolean
) {
  return useQuery({
    queryKey: ["predictions", "vip", page, search],
    queryFn: () => {
      const qs = new URLSearchParams({
        page: String(page),
        page_size: "10",
      });
      if (search) qs.set("search", search);
      return fetchJSON<PaginatedResponse<VIPPrediction>>(
        `/api/predictions/vip?${qs}`
      );
    },
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 3 * 60 * 1000,
  });
}

export function useGeneralPredictions(page: number, pageSize: number, enabled: boolean) {
  return useQuery({
    queryKey: ["predictions", "general", page, pageSize],
    queryFn: () =>
      fetchJSON<PaginatedResponse<GeneralPrediction>>(
        `/api/predictions/general?page=${page}&page_size=${pageSize}`
      ),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useBetOfDay() {
  return useQuery({
    queryKey: ["predictions", "bet-of-day"],
    queryFn: async () => {
      const res = await fetch("/api/predictions/bet-of-day");
      if (!res.ok) throw new Error("Failed to load bet of day");
      const data = await res.json();
      let first: BetOfDay | null = null;
      if (Array.isArray(data)) {
        first = data[0] ?? null;
      } else if (data && typeof data === "object" && "data" in data && Array.isArray(data.data)) {
        first = data.data[0] ?? null;
      } else if (data && typeof data === "object" && "home_team" in data) {
        first = data as BetOfDay;
      }
      return first;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useSpecialPredictions(
  endpoint: string,
  params: Record<string, string>,
  page: number,
  search: string,
  enabled: boolean
) {
  return useQuery({
    queryKey: ["predictions", "special", endpoint, params, page, search],
    queryFn: async () => {
      const qs = new URLSearchParams({
        ...params,
        page: String(page),
        page_size: "10",
      });
      if (search.trim()) qs.set("search", search.trim());
      const res = await apiFetch(`${endpoint}?${qs}`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data: SpecialPaginatedResponse = await res.json();
      const items = data.result ?? data.results ?? [];
      return { items, count: data.count ?? 0, pages: data.pages ?? 1 };
    },
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 3 * 60 * 1000,
  });
}
