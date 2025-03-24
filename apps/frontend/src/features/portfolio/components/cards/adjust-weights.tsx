import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePortfolio } from "@/features/portfolio/hooks/use-portfolio";
import { usePortfolioStore } from "@/stores/portfolio.store";
import { Loader2, Trash2 } from "lucide-react";
import { useEffect } from "react";

export default function AdjustWeights() {
  const {
    allocations,
    handleWeightChange,
    removeFromPortfolio,
    weights,
    removeAllFromPortfolio,
    isOptimizing,
    symbols,
    setIsOptimizing,
  } = usePortfolioStore();
  const { optimizeWeights } = usePortfolio();

  useEffect(() => {
    setIsOptimizing(false);
  }, [setIsOptimizing]);

  return (
    <div className="game-card space-y-8 p-4">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
        <div>
          <h3 className="text-foreground flex items-center gap-2 font-semibold">
            Adjust Weights
          </h3>
          <p className="text-muted-foreground text-sm">
            Adjust the weights of each stock.
          </p>
        </div>

        <div className="grid w-full grid-cols-2 gap-2 md:flex md:w-fit md:items-center">
          <Button
            onClick={() => removeAllFromPortfolio()}
            className="game-button-destructive"
          >
            Remove All
          </Button>

          <Button
            onClick={() => optimizeWeights(symbols)}
            disabled={isOptimizing || symbols.length < 2}
          >
            {isOptimizing && (
              <Loader2
                className="text-primary-foreground animate-spin"
                size={20}
              />
            )}
            {isOptimizing ? "Optimizing..." : "Optimize Weights"}
          </Button>
        </div>
      </div>

      {allocations && (
        <div className="space-y-4">
          {allocations.map((stock) => (
            <div
              key={stock.symbol}
              className="flex w-full items-center justify-between gap-4"
            >
              <div className="min-w-[120px]">
                <div className="text-foreground font-semibold">
                  {stock.symbol}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    className="w-16"
                    value={
                      weights()[stock.symbol] !== undefined &&
                      weights()[stock.symbol] !== null
                        ? weights()?.[stock.symbol] * 100
                        : ""
                    }
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const parsedValue =
                        inputValue === "" || isNaN(parseFloat(inputValue))
                          ? undefined
                          : parseFloat(inputValue) / 100;
                      handleWeightChange(stock.symbol, parsedValue);
                    }}
                    placeholder="N/A"
                  />
                  <span>%</span>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromPortfolio(stock.symbol)}
                >
                  <Trash2 className="text-muted-foreground h-4 w-4 hover:text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
