import { fetcher } from "@/lib/swr";
import { YahooInsights } from "@/actions/stock.action";
import useSWR from "swr";

export const useInsights = (symbol: string) => {
  const {
    data: insights,
    error,
    isLoading,
  } = useSWR<YahooInsights>(`/api/stock/${symbol}/insights`, fetcher);

  return {
    insights,
    isLoading,
    error,
  };
};
