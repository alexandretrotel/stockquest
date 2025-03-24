"use client";

import PortfolioCard from "@/features/profile/components/portfolio-card";
import { useMostProfitablePortfolios } from "@/features/saved-portfolios/hooks/use-most-profitable-portfolios";

export default function MostProfitablePortfolios() {
  const { data } = useMostProfitablePortfolios();

  if (!data) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-foreground text-2xl font-bold">
          Most Profitable Portfolios
        </h2>
      </div>

      <div className="mt-0">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {data.map((portfolio) => (
            <PortfolioCard
              key={portfolio.id}
              portfolio={portfolio}
              showCreator
            />
          ))}
        </div>
      </div>
    </div>
  );
}
