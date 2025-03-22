"use client";

import { YahooChartQuotes } from "@/actions/stock.action";
import { fetcher } from "@/lib/swr";
import useSWR from "swr";

export const useStockChart = (symbol: string, startingDate: Date) => {
  const {
    data: chart,
    error,
    isLoading,
  } = useSWR<YahooChartQuotes>(
    `/api/stock/${symbol}/chart/${new Date(startingDate).toISOString()}`,
    fetcher,
  );

  return {
    chart,
    isLoading,
    error,
  };
};
