import { ACHIEVEMENTS } from "@/data/achievements";
import { Lock } from "lucide-react";
import Badge from "@/components/ui/game-badge";
import { cn } from "@/lib/utils";
import { useAchievementsStore } from "@/stores/achievements.store";

interface AchievementProps {
  achievement: (typeof ACHIEVEMENTS)[number];
}

export default function Achievement({ achievement }: AchievementProps) {
  const { completed, progress } = useAchievementsStore();

  return (
    <div
      key={achievement.slug}
      className={`game-card p-5 ${achievement.locked ? "opacity-70" : ""}`}
    >
      <div className="mb-4 flex justify-between">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full",
            completed[achievement.slug]
              ? "bg-game-primary/10 text-game-primary"
              : achievement.locked
                ? "bg-gray-200 text-gray-400"
                : "bg-game-blue/10 text-game-blue",
          )}
        >
          {achievement.locked ? (
            <Lock className="h-6 w-6" />
          ) : (
            <achievement.icon size={24} />
          )}
        </div>

        <div className="flex flex-col items-end">
          <Badge
            label={
              completed[achievement.slug]
                ? "Completed"
                : achievement.locked
                  ? "Locked"
                  : "In Progress"
            }
            color={
              completed[achievement.slug]
                ? "primary"
                : achievement.locked
                  ? "gray"
                  : "blue"
            }
          />
          <div className="text-game-secondary mt-1 text-sm font-semibold">
            +{achievement.xpReward} XP
          </div>
        </div>
      </div>

      <h3 className="text-foreground mb-1 text-lg font-bold">
        {achievement.title}
      </h3>
      <p className="text-muted-foreground mb-3 text-sm">
        {achievement.description}
      </p>

      {!completed[achievement.slug] && !achievement.locked && (
        <div className="mt-2">
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {progress[achievement.slug]}/{achievement.maxProgress}
            </span>
          </div>

          <div className="game-progress-bar">
            <div
              className="game-progress-fill bg-game-blue"
              style={{
                width: `${(progress[achievement.slug] / achievement.maxProgress) * 100}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
