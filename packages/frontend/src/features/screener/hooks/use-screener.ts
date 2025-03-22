import { fetcher } from "@/lib/swr";
import { YahooScreener } from "@/actions/stock.action";
import useSWR from "swr";

export const useScreener = () => {
  const {
    data: screener,
    error,
    isLoading,
  } = useSWR<YahooScreener>("/api/screener", fetcher);

  return {
    screener,
    error,
    isLoading,
  };
};
