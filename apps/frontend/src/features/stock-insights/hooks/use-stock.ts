"use client";

import { YahooStockQuotes } from "@/actions/stock.action";
import { fetcher } from "@/lib/swr";
import useSWR from "swr";

export const useStock = (symbol: string) => {
  const {
    data: stock,
    error,
    isLoading,
  } = useSWR<YahooStockQuotes>(`/api/stock/${symbol}`, fetcher);

  return {
    stock,
    isLoading,
    error,
  };
};
