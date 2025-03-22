import { SavedPortfolios } from "@/schemas/portfolio.schema";
import PortfolioCard from "./portfolio-card";

interface PortfolioShowcaseProps {
  savedPortfolios: SavedPortfolios | null;
}

export default function PortfolioShowcase({
  savedPortfolios,
}: PortfolioShowcaseProps) {
  const numberOfSavedPortfolios = savedPortfolios?.length ?? 0;

  if (!savedPortfolios || numberOfSavedPortfolios === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold">Saved Portfolios</h2>
        <p className="text-muted-foreground">No saved portfolios yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Saved Portfolios</h2>

      {numberOfSavedPortfolios > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {savedPortfolios.map((portfolio) => (
            <PortfolioCard key={portfolio.id} portfolio={portfolio} />
          ))}
        </div>
      )}
    </div>
  );
}
