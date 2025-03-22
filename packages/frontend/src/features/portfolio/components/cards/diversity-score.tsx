interface DiversityScoreProps {
  diversityScore: number;
}

export default function DiversityScore({
  diversityScore,
}: DiversityScoreProps) {
  return (
    <div className="game-card flex flex-col p-4 md:flex-1">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-foreground font-semibold">Diversity Score</h3>
        <span className="text-game-blue font-semibold">
          {diversityScore}/100
        </span>
      </div>

      <div className="game-progress-bar">
        <div
          className="game-progress-fill bg-game-blue"
          style={{
            width: `${diversityScore}%`,
          }}
        />
      </div>

      <div className="text-muted-foreground mt-2 text-xs">
        {diversityScore < 50
          ? "Add more stocks to diversify your portfolio"
          : diversityScore < 80
            ? "Good diversity! Consider adding more variety"
            : "Excellent diversity!"}
      </div>
    </div>
  );
}
