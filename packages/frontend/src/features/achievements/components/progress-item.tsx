import { cn } from "@/lib/utils";

interface ProgressItemProps {
  color: "yellow" | "blue" | "green";
  number: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export default function ProgressItem({
  color,
  number,
  prefix,
  suffix,
  label,
}: ProgressItemProps) {
  return (
    <div className="bg-game-light dark:bg-game-dark flex flex-col items-center justify-center rounded-lg p-4">
      <div
        className={cn(
          color === "yellow" && "text-game-secondary",
          color === "green" && "text-game-primary",
          color === "blue" && "text-game-blue",
          "text-3xl font-bold",
        )}
      >
        {prefix ?? ""}
        {number}
        {suffix ?? ""}
      </div>
      <div className="text-muted-foreground text-sm">{label}</div>
    </div>
  );
}
