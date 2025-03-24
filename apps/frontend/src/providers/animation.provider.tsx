"use client";

import { useConfettiStore } from "@/stores/confetti.store";
import Confetti from "@/components/ui/confetti";
import { useXPStore } from "@/stores/xp.store";

interface AnimationWrapperProps {
  children: React.ReactNode;
}

export default function Animationrapper({ children }: AnimationWrapperProps) {
  const { showConfetti, confettiKey } = useConfettiStore();
  const { showXpAnimation, earnedXP, xpKey } = useXPStore();

  return (
    <div className="relative h-screen">
      {showConfetti && <Confetti key={confettiKey} />}
      {showXpAnimation && (
        <div
          key={xpKey}
          className="from-game-blue fixed right-4 bottom-4 z-50 animate-bounce rounded-lg border-b-2 border-[#0D47A1] bg-gradient-to-b to-[#1976D2] px-3 py-1 font-semibold text-white shadow-sm"
        >
          +{earnedXP} XP
        </div>
      )}
      {children}
    </div>
  );
}
