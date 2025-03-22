"use client";

import { fetcher } from "@/lib/swr";
import { UserSearchResult } from "@/actions/users.action";
import useSWR from "swr";

export const useSearchUsers = (searchQuery: string) => {
  const {
    data: results,
    error,
    isLoading,
  } = useSWR<UserSearchResult>(
    searchQuery ? `/api/search-users/${searchQuery}` : null,
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
