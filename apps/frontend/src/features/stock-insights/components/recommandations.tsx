import { useRecommandations } from "@/features/stock-insights/hooks/use-recommandations";
import StockCard from "@/features/stock-insights/components/stock-card";
import { StockCardSkeleton } from "./skeleton/stock-card-skeleton";

interface RecommandationsProps {
  symbol: string;
}

export default function Recommandations({ symbol }: RecommandationsProps) {
  const { recommandations, isLoading } = useRecommandations(symbol);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Recommended Stocks</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <StockCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (!recommandations || !recommandations.recommendedSymbols) {
    return null;
  }

  const recommendedSymbols = recommandations.recommendedSymbols.map(
    (symbol) => symbol.symbol,
  );

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Recommended Stocks</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {recommendedSymbols.map((symbol) => (
          <StockCard key={symbol} symbol={symbol} />
        ))}
      </div>
    </div>
  );
}
