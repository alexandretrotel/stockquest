import { Button } from "@/components/ui/button";
import { AIPortfolio } from "@/schemas/stockquest-ai.schema";
import { usePortfolioStore } from "@/stores/portfolio.store";
import { DeepPartial } from "ai";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface StockQuestAiPortfolioBuilderProps {
  object: DeepPartial<AIPortfolio> | undefined;
}

const TICKER_COLORS = [
  "#4CAF50",
  "#2196F3",
  "#FFC107",
  "#9C27B0",
  "#F44336",
  "#3F51B5",
  "#009688",
  "#FF5722",
  "#607D8B",
  "#8BC34A",
];
const MAX_ALLOCATION = 3;

export default function StockQuestAiPortfolioBuilder({
  object,
}: StockQuestAiPortfolioBuilderProps) {
  const [showDetails, setShowDetails] = useState(false);

  const { setAllocations } = usePortfolioStore();
  const router = useRouter();

  if (!object) {
    return;
  }

  const portfolioObject = {
    name: object.name,
    description: object.description,
    riskTolerance: object.riskTolerance,
    allocations: object.allocations,
  };

  const { name, description } = portfolioObject;
  const allocations = portfolioObject.allocations ?? [];

  const filteredAllocations = !showDetails
    ? allocations?.slice(0, MAX_ALLOCATION)
    : allocations;

  const handleImportPortfolio = () => {
    if (!allocations) {
      return;
    }

    const validAllocations = allocations.filter(
      (allocation): allocation is { symbol: string; weight: number } =>
        allocation !== undefined &&
        typeof allocation.symbol === "string" &&
        typeof allocation.weight === "number",
    );

    setAllocations(validAllocations);
    router.push("/portfolio");
  };

  return (
    <div className="game-card flex max-w-[80%]] flex-col gap-8 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold">{name}</h2>
          </div>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Allocations</h3>

              {allocations.length - MAX_ALLOCATION > 0 && (
                <Button
                  onClick={() => setShowDetails(!showDetails)}
                  variant="ghost"
                >
                  {showDetails ? "Hide" : "Show"} Details
                </Button>
              )}
            </div>

            {filteredAllocations?.map((allocation, index) => {
              return (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-2 w-2 items-center justify-center rounded-full"
                      style={{
                        backgroundColor:
                          TICKER_COLORS[
                            Math.floor(Math.random() * TICKER_COLORS?.length)
                          ],
                      }}
                    />
                    <span className="text-foreground font-semibold">
                      {allocation?.symbol ?? "N/A"}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {allocation?.company ?? "N/A"}
                    </span>
                  </div>
                  <span className="text-foreground">
                    {(allocation?.weight ?? 0) * 100}%
                  </span>
                </div>
              );
            })}
          </div>

          {!showDetails && allocations.length - MAX_ALLOCATION > 0 && (
            <p className="text-muted-foreground text-sm">
              {allocations.length - MAX_ALLOCATION} more allocations
            </p>
          )}
        </div>
      </div>

      <Button onClick={handleImportPortfolio}>
        <PlusCircle className="h-4 w-4" />
        Import
      </Button>
    </div>
  );
}
