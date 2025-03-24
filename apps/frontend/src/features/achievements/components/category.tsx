"use client";

import { useAchievementsStore } from "@/stores/achievements.store";
import { CATEGORIES } from "@/data/achievements";

interface CategoryProps {
  category: (typeof CATEGORIES)[number];
}

export default function Category({ category }: CategoryProps) {
  const { getCategoryStats } = useAchievementsStore();

  const { achievements, completedCount, progress } = getCategoryStats(category);

  return (
    <div className="game-card p-4">
      <div className="mb-3 flex items-center gap-3">
        <div className="bg-game-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
          <category.icon size={20} />
        </div>

        <div>
          <h3 className="text-foreground font-bold">{category.name}</h3>
          <div className="text-muted-foreground text-xs">
            {completedCount}/{achievements.length} completed
          </div>
        </div>
      </div>

      <div className="game-progress-bar">
        <div
          className="game-progress-fill bg-game-primary"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
