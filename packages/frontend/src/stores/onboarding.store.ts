"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TUTORIAL_SLIDES } from "@/data/tutorial";

interface OnboardingStore {
  tutorialCompleted: boolean;
  currentTutorialStep: number;
  totalTutorialSteps: number;
  direction: number;

  updateTutorial: (
    action: "next" | "prev" | "skip" | "reset" | "complete",
  ) => void;
  setDirection: (direction: number) => void;
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      tutorialCompleted: false,
      currentTutorialStep: 0,
      totalTutorialSteps: TUTORIAL_SLIDES.length,
      direction: 0,

      updateTutorial: (action) =>
        set((state) => {
          switch (action) {
            case "next":
              return {
                currentTutorialStep: Math.min(
                  state.currentTutorialStep + 1,
                  state.totalTutorialSteps - 1,
                ),
              };
            case "prev":
              return {
                currentTutorialStep: Math.max(state.currentTutorialStep - 1, 0),
              };
            case "skip":
              return {
                tutorialCompleted: true,
                currentTutorialStep: 0,
              };
            case "complete":
              return {
                tutorialCompleted: true,
                currentTutorialStep: 0,
              };
            case "reset":
              return {
                tutorialCompleted: false,
                currentTutorialStep: 0,
              };
            default:
              return state;
          }
        }),

      setDirection: (direction) => set({ direction }),
    }),
    {
      name: "onboarding",
    },
  ),
);
