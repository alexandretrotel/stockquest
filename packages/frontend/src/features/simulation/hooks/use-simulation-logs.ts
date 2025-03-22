import { fetcher } from "@/lib/swr";
import { SimulationLogs } from "@/actions/user-logs.action";
import useSWR from "swr";

export const useSimulationLogs = () => {
  const {
    data: backtestLogs,
    error,
    isLoading,
  } = useSWR<SimulationLogs>("/api/user/logs/simulation", fetcher);

  const numberOfPerformances = backtestLogs?.length ?? 0;

  return { backtestLogs, error, isLoading, numberOfPerformances };
};
