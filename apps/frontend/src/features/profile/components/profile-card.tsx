import Badge from "@/components/ui/game-badge";

interface ProfileCardProps {
  displayUsername: string;
  username: string;
  xp: number;
  numberOfSavedPortfolios: number;
  numberOfStocks: number;
  signUpDate: Date;
}

export default function ProfileCard({
  displayUsername,
  username,
  xp,
  numberOfSavedPortfolios,
  numberOfStocks,
  signUpDate,
}: ProfileCardProps) {
  return (
    <div className="game-card flex flex-col gap-8 p-6">
      <div className="flex flex-col">
        <div className="text-center text-lg font-bold">{displayUsername}</div>
        <div className="text-muted-foreground text-center text-sm">
          @{username}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Badge label={`${xp} XP`} color="blue" />
        <Badge
          label={`${numberOfSavedPortfolios} Portfolio${numberOfSavedPortfolios > 1 ? "s" : ""}`}
          color="primary"
        />
        <Badge
          label={`${numberOfStocks} Stock${numberOfStocks > 1 ? "s" : ""}
        `}
          color="accent"
        />
      </div>

      <div className="text-muted-foreground text-center text-xs">
        Member since{" "}
        {new Date(signUpDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
    </div>
  );
}
