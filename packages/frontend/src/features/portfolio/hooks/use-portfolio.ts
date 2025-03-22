"use client";

import ky from "ky";
import useSWRMutation from "swr/mutation";
import { toast } from "sonner";
import { usePortfolioStore } from "@/stores/portfolio.store";
import { useConfettiStore } from "@/stores/confetti.store";
import { useAchievementsStore } from "@/stores/achievements.store";
import { usePerformanceResultStore } from "@/stores/performance-result.store";
import { Allocations, PortfolioPerformance } from "@/schemas/portfolio.schema";
import { PerformanceResult } from "@/schemas/performance.schema";

interface SavePortfolioResponse {
  portfolioId: string;
}

interface RenamePortfolioResponse {
  success: boolean;
}

type OptimizeWeightsResponse = Record<string, number>;

interface ApiError {
  message: string;
}

export function usePortfolio() {
  const store = usePortfolioStore();

  const { trigger: savePortfolioTrigger, isMutating: isSaving } =
    useSWRMutation<
      SavePortfolioResponse,
      ApiError,
      string,
      {
        name: string;
        allocations: Allocations;
        performance?: PortfolioPerformance;
      }
    >(
      "/api/user/portfolio/save",
      (url, { arg }) =>
        ky
          .post(url, {
            json: arg,
          })
          .json(),
      {
        onSuccess: (data) => {
          usePortfolioStore.setState({
            portfolioId: data.portfolioId,
            isSaved: true,
          });

          useAchievementsStore.getState().updateProgress("first-steps", 1);
          useConfettiStore.getState().triggerConfetti();
          toast.success("Portfolio saved successfully!");
        },
        onError: () => {
          usePortfolioStore.setState({ isSaved: false });
          toast.error(`Failed to save portfolio.`);
        },
      },
    );

  const { trigger: unsavePortfolioTrigger, isMutating: isUnsaving } =
    useSWRMutation<void, ApiError, string, { portfolioId: string }>(
      "/api/user/portfolio/unsave",
      (url, { arg }) =>
        ky
          .post(url, {
            json: arg,
          })
          .then(() => undefined),
      {
        onSuccess: () => {
          usePortfolioStore.setState({
            isSaved: false,
            portfolioId: undefined,
          });
          toast.success("Portfolio unsaved successfully!");
        },
        onError: () => {
          toast.error(`Failed to unsave portfolio.`);
        },
      },
    );

  const { trigger: renamePortfolioTrigger, isMutating: isRenaming } =
    useSWRMutation<
      RenamePortfolioResponse,
      ApiError,
      string,
      { portfolioId: string; name: string }
    >(
      "/api/user/portfolio/rename",
      (url, { arg }) =>
        ky
          .post(url, {
            json: arg,
          })
          .json(),
      {
        onSuccess: () => {
          toast.success("Portfolio renamed successfully!");
        },
        onError: () => {
          toast.error(`Failed to rename portfolio.`);
        },
      },
    );

  const { trigger: optimizeWeightsTrigger, isMutating: isOptimizing } =
    useSWRMutation<
      OptimizeWeightsResponse,
      ApiError,
      string,
      { symbols: string[] }
    >(
      "/api/optimize-weights",
      (url, { arg }) =>
        ky
          .post(url, {
            json: arg,
          })
          .json(),
      {
        onSuccess: (data) => {
          usePortfolioStore.setState((state) => {
            if (!state.allocations) {
              return state;
            }

            return {
              allocations: state.allocations.map((stock) => ({
                ...stock,
                weight: data[stock.symbol],
              })),
            };
          });
          toast.success("Weights optimized successfully!");
        },
        onError: () => {
          toast.error(`Failed to optimize weights.`);
        },
      },
    );

  const { trigger: runPerformanceTrigger, isMutating: isRunningPerformance } =
    useSWRMutation<
      PerformanceResult,
      ApiError,
      string,
      { allocations: Allocations }
    >(
      "/api/simulate-portfolio",
      (url, { arg }) =>
        ky
          .post(url, {
            json: arg,
          })
          .json(),
      {
        onSuccess: async (result) => {
          usePerformanceResultStore.getState().setResult(result);
          if (result.beatsBenchmark) {
            useAchievementsStore.getState().updateProgress("market-beater", 1);
          }
        },
        onError: (error) => {
          usePerformanceResultStore.getState().setError(error.message);
          toast.error(`Failed to run simulation.`);
        },
      },
    );

  const savePortfolio = async (portfolioName: string) => {
    const { allocations } = store;
    if (!allocations) return;

    await savePortfolioTrigger({ name: portfolioName, allocations });
  };

  const savePortfolioWithResult = async (
    portfolioName: string,
    performance: PortfolioPerformance,
  ) => {
    const { allocations } = store;
    if (!allocations) return;

    await savePortfolioTrigger({
      name: portfolioName,
      allocations,
      performance,
    });
  };

  const unsavePortfolio = async (portfolioId: string) => {
    await unsavePortfolioTrigger({ portfolioId });
  };

  const renamePortfolio = async (
    portfolioId: string,
    portfolioName: string,
  ) => {
    await renamePortfolioTrigger({ portfolioId, name: portfolioName });
  };

  const optimizeWeights = async (symbols: string[]) => {
    usePortfolioStore.setState({ isOptimizing: true });
    try {
      await optimizeWeightsTrigger({ symbols });
    } finally {
      usePortfolioStore.setState({ isOptimizing: false });
    }
  };

  const runSimulation = async (allocations: Allocations) => {
    usePerformanceResultStore.getState().setIsLoading(true);
    usePerformanceResultStore.getState().setError(null);
    usePerformanceResultStore.getState().setResult(null);
    try {
      await runPerformanceTrigger({ allocations });
    } finally {
      usePerformanceResultStore.getState().setIsLoading(false);
    }
  };

  return {
    savePortfolio,
    savePortfolioWithResult,
    unsavePortfolio,
    renamePortfolio,
    optimizeWeights,
    runSimulation,

    isSaving,
    isUnsaving,
    isRenaming,
    isOptimizing,
    isRunningPerformance,
  };
}
