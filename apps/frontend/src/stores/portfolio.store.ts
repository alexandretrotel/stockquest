"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Allocations,
  SavedPortfolios,
  Weights,
} from "@/schemas/portfolio.schema";
import { useOnboardingChallengesStore } from "./onboarding-challenges.store";

interface PortfolioStore {
  allocations: Allocations | null;
  isSaved: boolean;
  isSaving: boolean;
  isRenaming: boolean;
  isOptimizing: boolean;
  portfolioId: string | null;
  symbols: string[];

  setIsOptimizing: (isOptimizing: boolean) => void;
  totalWeight: () => number;
  totalStocks: () => number;
  weights: () => Weights;
  isValidPortfolio: () => boolean;
  diversityScore: () => number;
  setAllocations: (allocations: Allocations) => void;
  resetAllocations: () => void;
  addToPortfolio: (symbol: string) => void;
  removeFromPortfolio: (symbol: string) => void;
  removeAllFromPortfolio: () => void;
  updateWeight: (symbol: string, weight: number | undefined) => void;
  applyEqualAllocation: () => void;
  isInPortfolio: (symbol: string) => boolean;
  handleAddOrRemove: (symbol: string) => void;
  handleWeightChange: (symbol: string, value: number | undefined) => void;
  loadSavedPortfolio: (savedPortfolio: {
    id: string;
    allocations: Allocations;
  }) => void;
  syncPortfolio: (
    allocations: Allocations,
    savedPortfolios: SavedPortfolios,
  ) => void;
}

export const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set, get) => ({
      allocations: null,
      isSaved: false,
      isSaving: false,
      isRenaming: false,
      isOptimizing: false,
      portfolioId: null,
      symbols: [],

      setIsOptimizing: (isOptimizing) => set({ isOptimizing }),

      totalWeight: () =>
        get().allocations?.reduce((acc, stock) => acc + stock.weight, 0) ?? 0,

      totalStocks: () => get().allocations?.length ?? 0,

      weights: () => {
        const portfolio = get().allocations;
        if (!portfolio) return {};

        const weightsObject: Weights = {};
        portfolio.forEach((stock) => {
          weightsObject[stock.symbol] = stock.weight;
        });

        return weightsObject;
      },

      isValidPortfolio: () => {
        const total = get().totalWeight();
        return Math.abs(total - 1) < 0.0001;
      },

      diversityScore: () => {
        const totalStocks = get().totalStocks();
        return totalStocks > 0
          ? Math.min(100, Math.max(0, totalStocks * 10))
          : 0;
      },

      setAllocations: (allocations) => {
        set({ allocations, symbols: allocations.map((stock) => stock.symbol) });
        useOnboardingChallengesStore.getState().syncWithPortfolio();
      },

      resetAllocations: () =>
        set({
          allocations: null,
        }),

      addToPortfolio: (symbol) => {
        const currentAllocations = get().allocations;

        if (
          currentAllocations &&
          currentAllocations.some((item) => item.symbol === symbol)
        )
          return;

        const newStock = {
          symbol,
          weight: 1 / (currentAllocations?.length ?? 1),
        };

        set((state) => {
          const updatedPortfolio = state.allocations
            ? [...state.allocations, newStock]
            : [newStock];
          const equalWeight = 1 / updatedPortfolio.length;

          return {
            allocations: updatedPortfolio.map((stock) => ({
              ...stock,
              weight: equalWeight,
            })),
            isSaved: false,
            symbols: updatedPortfolio.map((stock) => stock.symbol),
          };
        });

        useOnboardingChallengesStore.getState().syncWithPortfolio();
      },

      removeFromPortfolio: (symbol) =>
        set((state) => {
          if (!state.allocations) return state;

          return {
            allocations: state.allocations.filter(
              (stock) => stock.symbol !== symbol,
            ),
            isSaved: false,
            symbols: state.symbols.filter((s) => s !== symbol),
          };
        }),

      removeAllFromPortfolio: () => set({ allocations: null, symbols: [] }),

      updateWeight: (symbol, weight) =>
        set((state) => {
          if (!state.allocations) {
            return state;
          }

          const finalWeight = weight ?? 0;

          return {
            allocations: state.allocations.map((stock) =>
              stock.symbol === symbol
                ? { ...stock, weight: finalWeight }
                : stock,
            ),
            isSaved: false,
          };
        }),

      applyEqualAllocation: () => {
        const allocations = get().allocations;
        if (!allocations) return;

        const equalWeight = 1 / allocations.length;

        set({
          allocations: allocations.map((stock) => ({
            ...stock,
            weight: equalWeight,
          })),
        });
      },

      isInPortfolio: (symbol) => {
        const allocations = get().allocations;
        return allocations
          ? allocations.some((stock) => stock.symbol === symbol)
          : false;
      },

      handleAddOrRemove: (symbol) => {
        const { isInPortfolio, addToPortfolio, removeFromPortfolio } = get();

        if (isInPortfolio(symbol)) {
          removeFromPortfolio(symbol);
        } else {
          addToPortfolio(symbol);
        }
      },

      handleWeightChange: (symbol, value) => {
        get().updateWeight(symbol, value);
      },

      loadSavedPortfolio: (savedPortfolio) => {
        set({
          allocations: savedPortfolio.allocations,
          portfolioId: savedPortfolio.id,
          isSaved: true,
          symbols: savedPortfolio.allocations.map((stock) => stock.symbol),
        });
      },

      syncPortfolio: (allocations, savedPortfolios) => {
        const savedPortfolio = savedPortfolios.find(
          (saved) =>
            saved.allocations.length === allocations.length &&
            saved.allocations.every((savedItem) =>
              allocations.some(
                (item) =>
                  item.symbol === savedItem.symbol &&
                  item.weight === savedItem.weight,
              ),
            ),
        );

        if (savedPortfolio) {
          set({ portfolioId: savedPortfolio.id, isSaved: true });
        } else {
          set({ portfolioId: null, isSaved: false });
        }
      },
    }),
    { name: "portfolio" },
  ),
);
