import { cn } from "@/lib/utils";
import { Check, AlertCircle } from "lucide-react";

interface PortfolioWeightProps {
  totalWeight: number;
}

export default function PortfolioWeight({ totalWeight }: PortfolioWeightProps) {
  return (
    <div className="game-card flex flex-col p-4 md:flex-1">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-foreground font-semibold">Portfolio Weight</h3>
        <span
          className={`font-semibold ${Math.abs(totalWeight - 1) < 0.01 ? "text-game-primary" : "text-game-accent"}`}
        >
          {isNaN(totalWeight) ? 0 : (totalWeight * 100).toFixed(0)}%
        </span>
      </div>

      <div className="game-progress-bar">
        <div
          className={cn("game-progress-fill", {
            "bg-game-primary": Math.abs(totalWeight - 1) < 0.01,
            "bg-game-accent": Math.abs(totalWeight - 1) >= 0.01,
          })}
          style={{
            width: `${Math.min(totalWeight * 100, 100)}%`,
          }}
        />
      </div>

      {!isNaN(totalWeight) && (
        <>
          {Math.abs(totalWeight - 1) < 0.01 ? (
            <div className="text-game-primary mt-2 flex items-center gap-1 text-xs">
              <Check className="h-3 w-3" />
              Perfect balance!
            </div>
          ) : (
            <div className="text-game-accent mt-2 flex items-center gap-1 text-xs">
              <AlertCircle className="h-3 w-3" />
              {totalWeight < 1
                ? `Add ${((1 - totalWeight) * 100).toFixed(0)}% more`
                : `Remove ${((totalWeight - 1) * 100).toFixed(0)}%`}
            </div>
          )}
        </>
      )}
    </div>
  );
}
