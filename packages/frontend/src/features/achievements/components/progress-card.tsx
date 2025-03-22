"use client";

import { useAchievementsStore } from "@/stores/achievements.store";
import { Trophy } from "lucide-react";
import ProgressItem from "./progress-item";

export default function ProgressCard() {
  const { overallProgress, completedAchievements, earnedXP, potentialXP } =
    useAchievementsStore();

  return (
    <div className="game-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-game-primary/10 hidden h-12 w-12 items-center justify-center rounded-full md:flex">
            <Trophy className="text-game-primary h-6 w-6" />
          </div>

          <div>
            <h2 className="text-foreground text-xl font-bold">Progress</h2>
            <p className="text-muted-foreground text-sm">
              Keep going to unlock all achievements!
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-game-primary text-2xl font-bold">
            {overallProgress}%
          </div>
          <div className="text-muted-foreground text-sm">Complete</div>
        </div>
      </div>

      <div className="game-progress-bar mb-4">
        <div
          className="game-progress-fill bg-game-primary"
          style={{ width: `${overallProgress}%` }}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <ProgressItem
          color="green"
          label="Achievements Completed"
          number={completedAchievements}
        />
        <ProgressItem color="blue" label="XP Earned" number={earnedXP} />
        <ProgressItem
          color="yellow"
          label="XP Available"
          number={potentialXP}
          prefix="+"
        />
      </div>
    </div>
  );
}
