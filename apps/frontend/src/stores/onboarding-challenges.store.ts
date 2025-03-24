"use client";

import { ONBOARDING_CHALLENGES } from "@/data/onboarding";
import { OnboardingChallengesSlug } from "@/schemas/onboarding.schema";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { usePortfolioStore } from "./portfolio.store";

interface OnboardingChallengesStore {
  completed: Record<OnboardingChallengesSlug, boolean>;
  totalCompleted: number;
  totalChallenges: number;
  overallProgress: number;

  updateCompletion: (id: OnboardingChallengesSlug) => void;
  syncWithPortfolio: () => void;
}

export const useOnboardingChallengesStore = create<OnboardingChallengesStore>()(
  persist(
    (set, get) => ({
      completed: {
        "add-5-stocks": false,
        "balance-to-100": false,
        "run-simulation": false,
      },
      totalCompleted: 0,
      totalChallenges: ONBOARDING_CHALLENGES.length,
      overallProgress: 0,

      updateCompletion: (id) =>
        set((state) => {
          if (state.completed[id]) return state;

          const completed = { ...state.completed, [id]: true };
          const totalCompleted =
            Object.values(completed).filter(Boolean).length;
          const overallProgress = Math.round(
            (totalCompleted / ONBOARDING_CHALLENGES.length) * 100,
          );

          return { completed, totalCompleted, overallProgress };
        }),

      syncWithPortfolio: () => {
        const { totalStocks, totalWeight } = usePortfolioStore.getState();
        const { updateCompletion } = get();

        if (totalStocks() >= 5) updateCompletion("add-5-stocks");
        if (totalWeight() === 1) updateCompletion("balance-to-100");
      },
    }),
    {
      name: "onboarding-challenges",
    },
  ),
);
