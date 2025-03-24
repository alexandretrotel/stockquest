"use client";

import { PerformanceResult } from "@/schemas/performance.schema";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PerformanceResultStore {
  result: PerformanceResult | null;
  isLoading: boolean;
  error: string | null;

  setResult: (result: PerformanceResult | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePerformanceResultStore = create<PerformanceResultStore>()(
  persist(
    (set) => ({
      result: null,
      isLoading: false,
      error: null,

      setResult: (result) => set({ result }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "performance",
    },
  ),
);
