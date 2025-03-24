import { useStock } from "@/features/stock-insights/hooks/use-stock";
import Badge from "@/components/ui/game-badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import { usePortfolioStore } from "@/stores/portfolio.store";
import { useState } from "react";
import AIInsightsDialog from "../../ai/components/insights-dialog";

interface StockMainCardProps {
  symbol: string;
}

export default function StockMainCard({ symbol }: StockMainCardProps) {
  const [aiDialogOpen, setAiDialogOpen] = useState(false);

  const { stock } = useStock(symbol);
  const { isInPortfolio, handleAddOrRemove } = usePortfolioStore();

  if (!stock) {
    return (
      <div className="game-card p-6">
        <div className="flex h-full flex-col justify-between gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-foreground text-2xl font-bold">N/A</h2>
            </div>

            <p className="text-muted-foreground">Stock not found</p>
          </div>
        </div>
      </div>
    );
  }

  const shortName = stock.shortName ?? "N/A";
  const fullExchangeName = stock.fullExchangeName ?? "N/A";
  const regularMarketPrice = stock.regularMarketPrice ?? 0;
  const regularMarketChangePercent = stock.regularMarketChangePercent ?? 0;

  return (
    <div className="game-card p-6">
      <div className="flex h-full flex-col justify-between gap-4">
        <div className="flex flex-row justify-between gap-4 md:items-center">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-foreground text-2xl font-bold">
                  {shortName ?? "N/A"}
                </h2>
                {symbol && <Badge label={symbol} color="blue" />}
              </div>
              <p className="text-muted-foreground">{fullExchangeName}</p>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="text-foreground text-2xl font-bold">
              ${regularMarketPrice.toFixed(2) ?? 0}
            </div>
            <div
              className={`flex items-center ${regularMarketChangePercent >= 0 ? "text-game-primary" : "text-game-accent"}`}
            >
              {regularMarketChangePercent >= 0 ? (
                <TrendingUp className="mr-1 h-4 w-4" />
              ) : (
                <TrendingDown className="mr-1 h-4 w-4" />
              )}
              <span className="font-medium">
                {regularMarketChangePercent >= 0 ? "+" : ""}
                {regularMarketChangePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <Button
            onClick={() => handleAddOrRemove(symbol)}
            className={` ${isInPortfolio(symbol) ? "game-button-gray" : "game-button-primary"}`}
            disabled={isInPortfolio(symbol)}
          >
            <PlusCircle className="h-4 w-4" />
            {isInPortfolio(symbol) ? "Added to Portfolio" : "Add to Portfolio"}
          </Button>

          <Button
            onClick={() => setAiDialogOpen(true)}
            className="game-button-secondary"
          >
            <Sparkles className="h-4 w-4" />
            StockQuest AI
          </Button>
        </div>
      </div>

      <AIInsightsDialog
        open={aiDialogOpen}
        onOpenChange={setAiDialogOpen}
        symbol={symbol}
      />
    </div>
  );
}
