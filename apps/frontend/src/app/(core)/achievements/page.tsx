"use client";

import { ACHIEVEMENTS, CATEGORIES } from "@/data/achievements";
import ProgressCard from "@/features/achievements/components/progress-card";
import Category from "@/features/achievements/components/category";
import Achievement from "@/features/achievements/components/achievement";

export default function AchievementsPage() {
  return (
    <>
      <div className="flex flex-col gap-4">
        <h1 className="text-foreground text-2xl font-bold">Achievements</h1>
        <ProgressCard />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {CATEGORIES.map((category) => {
          return <Category key={category.id} category={category} />;
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ACHIEVEMENTS.map((achievement) => (
          <Achievement key={achievement.slug} achievement={achievement} />
        ))}
      </div>
    </>
  );
}
