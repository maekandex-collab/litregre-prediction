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
      const data: SpecialPaginatedResponse & {
        data?: SpecialPrediction[];
        items?: SpecialPrediction[];
        message?: string;
        error?: string;
        market_type?: string[];
      } = await res.json();

      if (!res.ok) {
        const msg =
          (typeof data.message === "string" && data.message.trim()) ||
          (typeof data.error === "string" && data.error.trim()) ||
          `Request failed (${res.status})`;
        throw new Error(msg);
      }

      if (data?.message === "Invalid market type") {
        throw new Error(
          `Invalid market type. Allowed: ${(data.market_type ?? []).join(", ")}`
        );
      }

      const items =
        data.result ??
        data.results ??
        data.data ??
        data.items ??
        (Array.isArray(data) ? data : []);
      const list = Array.isArray(items) ? items : [];
      // Some special endpoints return count:0 / pages:0 even when results[] is populated
      const count =
        typeof data.count === "number" && data.count > 0
          ? data.count
          : list.length;
      const pages =
        typeof data.pages === "number" && data.pages > 0
          ? data.pages
          : Math.max(1, Math.ceil(count / 10) || 1);
      return { items: list, count, pages };
    },
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 3 * 60 * 1000,
  });
}
