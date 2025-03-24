"use client";

import { fetcher } from "@/lib/swr";
import { SavedPortfolios } from "@/schemas/portfolio.schema";
import useSWR from "swr";

export const useSavedPortfolios = () => {
  const { isLoading, error, data } = useSWR<SavedPortfolios>(
    `/api/user/saved-portfolios`,
    fetcher,
  );

  return {
    isLoading,
    error,
    savedPortfolios: data,
  };
};
