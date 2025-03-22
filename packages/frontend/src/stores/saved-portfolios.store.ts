"use client";

import { create } from "zustand";
import { useSavedPortfolios } from "@/features/user/hooks/use-saved-portfolios";
import { useEffect } from "react";
import {
  atLeastOnePortfolioBeatsSP500,
  getNumberOfStocks,
} from "@/utils/portfolio";
import { SavedPortfolios } from "@/schemas/portfolio.schema";

interface SavedPortfoliosState {
  savedPortfolios: SavedPortfolios | null;
  numberOfSavedPortfolios: number;
  numberOfStocks: number;
  beatsSP500: boolean;
  setSavedPortfolios: (savedPortfolios: SavedPortfolios) => void;
  resetSavedPortfolios: () => void;
}

export const useSavedPortfoliosStore = create<SavedPortfoliosState>((set) => ({
  savedPortfolios: null,
  numberOfSavedPortfolios: 0,
  numberOfStocks: 0,
  beatsSP500: false,

  setSavedPortfolios: (savedPortfolios) => {
    const numberOfSavedPortfolios = savedPortfolios.length;
    const numberOfStocks = getNumberOfStocks(savedPortfolios);
    const beatsSP500 = atLeastOnePortfolioBeatsSP500(savedPortfolios);

    set({
      savedPortfolios,
      numberOfSavedPortfolios,
      numberOfStocks,
      beatsSP500,
    });
  },

  resetSavedPortfolios: () =>
    set({
      savedPortfolios: null,
    }),
}));

export const useSavedPortfolioInitialiser = () => {
  const { savedPortfolios } = useSavedPortfolios();
  const { setSavedPortfolios } = useSavedPortfoliosStore();

  useEffect(() => {
    if (!savedPortfolios) {
      return;
    }

    setSavedPortfolios(savedPortfolios);
  }, [savedPortfolios, setSavedPortfolios]);
};
