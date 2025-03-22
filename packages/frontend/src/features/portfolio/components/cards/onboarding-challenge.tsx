import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface OnboardingItemProps {
  completed: boolean;
  label: string;
}

export default function OnboardingChallenge({
  completed,
  label,
}: OnboardingItemProps) {
  return (
    <div className="text-muted-foreground flex items-center gap-2 text-xs">
      {completed ? (
        <div className="from-game-primary flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-b to-[#388E3C]">
          <Check className="h-3 w-3 text-white" />
        </div>
      ) : (
        <div className="h-4 w-4 rounded-full border"></div>
      )}

      <span
        className={cn(completed ? "text-foreground" : "text-muted-foreground")}
      >
        {label}
      </span>
    </div>
  );
}
