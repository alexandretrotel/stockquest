"use client";

import { fetcher } from "@/lib/swr";
import { YahooSearch } from "@/actions/stock.action";
import useSWR from "swr";

export const useSearchStocks = (searchQuery: string) => {
  const {
    data: results,
    error,
    isLoading,
  } = useSWR<YahooSearch>(
    searchQuery ? `/api/search-stocks/${searchQuery}` : null,
    fetcher,
    {
      dedupingInterval: 500,
    },
  );

  return {
    searchQuery,
    results,
    error,
    isLoading,
  };
};
