"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ConfettiStore {
  showConfetti: boolean;
  confettiKey: number;
  animationEnabled: boolean;

  handleShowConfetti: (show: boolean) => void;
  triggerConfetti: () => void;
}

export const useConfettiStore = create<ConfettiStore>()(
  persist(
    (set) => ({
      showConfetti: false,
      confettiKey: 0,
      animationEnabled: true,

      handleShowConfetti: (show: boolean) =>
        set((state: { confettiKey: number }) => ({
          showConfetti: show,
          confettiKey: show ? state.confettiKey + 1 : state.confettiKey,
        })),

      triggerConfetti: () => {
        set((state) => {
          if (!state.animationEnabled) return state;

          return {
            showConfetti: true,
            confettiKey: state.confettiKey + 1,
          };
        });
        setTimeout(() => {
          set({ showConfetti: false });
        }, 3000);
      },
    }),
    { name: "confetti-store" },
  ),
);
