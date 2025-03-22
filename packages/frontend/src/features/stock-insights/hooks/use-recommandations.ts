"use client";

import { fetcher } from "@/lib/swr";
import { YahooRecommendations } from "@/actions/stock.action";
import useSWR from "swr";

export const useRecommandations = (symbol: string) => {
  const {
    data: recommandations,
    error,
    isLoading,
  } = useSWR<YahooRecommendations>(
    `/api/stock/${symbol}/recommandations`,
    fetcher,
  );

  return {
    recommandations,
    error,
    isLoading,
  };
};
