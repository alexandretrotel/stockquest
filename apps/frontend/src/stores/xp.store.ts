"use client";

import { create } from "zustand";
import { XP_ANIMATION_DURATION } from "@/data/settings";
import { persist } from "zustand/middleware";

interface XPStore {
  xp: number;
  earnedXP: number;
  showXpAnimation: boolean;
  xpKey: number;
  animationEnabled: boolean;

  setXP: (xp: number) => void;
  setXpEarned: (xpEarned: number) => void;
  setShowXpAnimation: (showXpAnimation: boolean) => void;
  awardXP: (amount: number) => void;
}

export const useXPStore = create<XPStore>()(
  persist(
    (set) => {
      return {
        xp: 0,
        earnedXP: 0,
        showXpAnimation: false,
        animationEnabled: true,
        xpKey: 0,

        setXP: (xp) => set({ xp }),
        setXpEarned: (earnedXP) => set({ earnedXP }),
        setShowXpAnimation: (showXpAnimation) => set({ showXpAnimation }),

        awardXP: (amount) =>
          set((state) => {
            if (!state.animationEnabled) return state;

            const newKey = state.xpKey + 1;
            setTimeout(
              () => set({ showXpAnimation: false }),
              XP_ANIMATION_DURATION,
            );
            return {
              xpEarned: amount,
              xpKey: newKey,
              showXpAnimation: true,
            };
          }),
      };
    },
    { name: "xp-store" },
  ),
);

export const awardXP = (amount: number) => {
  const { awardXP } = useXPStore.getState();
  awardXP(amount);
};
