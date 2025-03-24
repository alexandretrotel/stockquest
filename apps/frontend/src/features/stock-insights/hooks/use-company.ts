import { fetcher } from "@/lib/swr";
import { YahooStockQuoteSummaryAssetProfile } from "@/actions/stock.action";
import useSWR from "swr";

export const useCompany = (symbol: string) => {
  const {
    data: company,
    error,
    isLoading,
  } = useSWR<YahooStockQuoteSummaryAssetProfile>(
    `/api/stock/${symbol}/company`,
    fetcher,
  );
  return {
    company,
    isLoading,
    error,
  };
};
