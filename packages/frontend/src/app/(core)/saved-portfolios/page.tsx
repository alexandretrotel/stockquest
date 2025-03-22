"use client";

import PortfolioCard from "@/features/saved-portfolios/components/portfolio-card";
import { useSavedPortfolios } from "@/features/user/hooks/use-saved-portfolios";

export default function SavedPortfolios() {
  const { savedPortfolios, isLoading } = useSavedPortfolios();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-foreground text-2xl font-bold">Saved Portfolios</h1>
        <p className="text-muted-foreground animate-pulse">
          Loading portfolios...
        </p>
      </div>
    );
  }

  if (!savedPortfolios || savedPortfolios.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-foreground text-2xl font-bold">Saved Portfolios</h1>
        <p className="text-muted-foreground">No saved portfolios found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-foreground text-2xl font-bold">Saved Portfolios</h1>

      <div className="grid gap-4 md:grid-cols-3">
        {savedPortfolios.map((portfolio) => {
          return (
            <PortfolioCard
              key={portfolio.id}
              name={portfolio.name}
              id={portfolio.id}
              updatedAt={portfolio.updatedAt}
              allocations={portfolio.allocations}
            />
          );
        })}
      </div>
    </div>
  );
}
