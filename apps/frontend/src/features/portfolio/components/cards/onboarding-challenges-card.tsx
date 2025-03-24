import { ONBOARDING_CHALLENGES } from "@/data/onboarding";
import OnboardingItem from "./onboarding-challenge";
import { useOnboardingChallengesStore } from "@/stores/onboarding-challenges.store";

export default function OnboardingChallengesCard() {
  const { completed, totalCompleted } = useOnboardingChallengesStore();

  return (
    <div className="game-card flex flex-col p-4 md:flex-1">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-foreground font-semibold">Onboarding</h3>
        <span className="text-game-purple font-semibold">
          {totalCompleted}/{ONBOARDING_CHALLENGES.length}
        </span>
      </div>

      <div className="mt-2 space-y-2">
        {ONBOARDING_CHALLENGES.map((onboarding) => {
          return (
            <OnboardingItem
              key={onboarding.label}
              completed={completed[onboarding.slug]}
              label={onboarding.label}
            />
          );
        })}
      </div>
    </div>
  );
}
