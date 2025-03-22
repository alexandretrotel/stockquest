import { fetcher } from "@/lib/swr";
import { SavedPortfolios } from "@/schemas/portfolio.schema";
import useSWR from "swr";

export const useMostProfitablePortfolios = () => {
  return useSWR<SavedPortfolios>(
    "/api/saved-portfolios/most-profitable",
    fetcher,
  );
};
