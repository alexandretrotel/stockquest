"use client";

import { create } from "zustand";
import { ACHIEVEMENTS } from "@/data/achievements";
import { useSavedPortfoliosStore } from "./saved-portfolios.store";
import { useEffect } from "react";
import { awardXP } from "./xp.store";
import { useSimulationLogs } from "@/features/simulation/hooks/use-simulation-logs";
import { AchievementSlug, Category } from "@/schemas/achievements.schema";

interface AchievementsStore {
  totalAchievements: number;
  completedAchievements: number;
  overallProgress: number;
  earnedXP: number;
  potentialXP: number;
  completed: Record<AchievementSlug, boolean>;
  progress: Record<AchievementSlug, number>;

  getCategoryStats: (category: Category) => {
    achievements: typeof ACHIEVEMENTS;
    completedCount: number;
    progress: number;
  };
  getProgress: (slug: AchievementSlug) => number;
  getXP: (slug: AchievementSlug) => number;
  updateProgress: (
    slug: AchievementSlug,
    value: number,
    completeThreshold?: number,
  ) => void;
}

export const useAchievementsStore = create<AchievementsStore>((set, get) => {
  const initialProgress = ACHIEVEMENTS.reduce(
    (acc, a) => ({ ...acc, [a.slug]: 0 }),
    {} as Record<AchievementSlug, number>,
  );

  return {
    totalAchievements: ACHIEVEMENTS.length,
    completedAchievements: 0,
    overallProgress: 0,
    earnedXP: 0,
    potentialXP: ACHIEVEMENTS.reduce((acc, a) => acc + a.xpReward, 0),
    completed: {} as Record<AchievementSlug, boolean>,
    progress: initialProgress,

    getCategoryStats: (category: Category) => {
      const categoryAchievements = ACHIEVEMENTS.filter(
        (a) => a.category === category.id,
      );
      const completedCount = categoryAchievements.filter(
        (a) => get().completed[a.slug],
      ).length;

      return {
        achievements: categoryAchievements,
        completedCount,
        progress: Math.round(
          (completedCount / categoryAchievements.length) * 100,
        ),
      };
    },

    getProgress: (slug) => get().progress[slug] ?? 0,

    getXP: (slug) => {
      const achievement = ACHIEVEMENTS.find((a) => a.slug === slug);
      return achievement?.xpReward ?? 0;
    },

    updateProgress: (slug, value, completeThreshold) => {
      const currentProgress = Math.min(value, completeThreshold ?? value);
      const isCompleted = completeThreshold
        ? value >= completeThreshold
        : value > 0;

      set((state) => {
        const newProgress = { ...state.progress, [slug]: currentProgress };

        if (!isCompleted || state.completed[slug]) {
          return { progress: newProgress };
        }

        const newCompleted = { ...state.completed, [slug]: true };
        const completedAchievements =
          Object.values(newCompleted).filter(Boolean).length;
        const overallProgress = Math.round(
          (completedAchievements / ACHIEVEMENTS.length) * 100,
        );
        const earnedXP = ACHIEVEMENTS.filter(
          (a) => newCompleted[a.slug],
        ).reduce((acc, a) => acc + a.xpReward, 0);

        awardXP(get().getXP(slug));

        return {
          progress: newProgress,
          completed: newCompleted,
          completedAchievements,
          overallProgress,
          earnedXP,
          potentialXP: state.potentialXP - get().getXP(slug),
        };
      });
    },
  };
});

export const useAchievementsStoreInitializer = () => {
  const { numberOfStocks, numberOfSavedPortfolios, beatsSP500 } =
    useSavedPortfoliosStore();
  const { updateProgress } = useAchievementsStore();
  const { numberOfPerformances } = useSimulationLogs();

  useEffect(() => {
    updateProgress("first-steps", numberOfSavedPortfolios);
    updateProgress("first-simulation", numberOfPerformances);
    updateProgress("market-beater", beatsSP500 ? 1 : 0);
    updateProgress("stock-collector", numberOfStocks, 10);
  }, [
    numberOfSavedPortfolios,
    numberOfPerformances,
    beatsSP500,
    numberOfStocks,
    updateProgress,
  ]);
};
