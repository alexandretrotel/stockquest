"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle, Check, TrendingUp, TrendingDown } from "lucide-react";
import { usePortfolioStore } from "@/stores/portfolio.store";
import { useStock } from "@/features/stock-insights/hooks/use-stock";
import Link from "next/link";
import { StockCardSkeleton } from "./skeleton/stock-card-skeleton";

interface StockCardProps {
  symbol: string;
}

export default function StockCard({ symbol }: StockCardProps) {
  const { handleAddOrRemove, isInPortfolio } = usePortfolioStore();
  const { stock, isLoading } = useStock(symbol);

  if (isLoading) {
    return <StockCardSkeleton />;
  }

  const shortName = stock?.shortName ?? "N/A";
  const fullExchangeName = stock?.fullExchangeName ?? "N/A";
  const regularMarketPrice = stock?.regularMarketPrice ?? 0;
  const regularMarketChangePercent = stock?.regularMarketChangePercent ?? 0;

  return (
    <div className="game-card group flex h-full flex-col justify-between overflow-hidden">
      <div className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Link href={`/stock/${symbol}`} className="hover:underline">
                  <h3 className="text-foreground font-semibold">{shortName}</h3>
                </Link>
              </div>
              <p className="text-muted-foreground text-xs">{symbol}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-foreground font-semibold">
              ${regularMarketPrice.toFixed(2)}
            </p>

            <p
              className={`flex items-center justify-end text-xs ${regularMarketChangePercent >= 0 ? "text-game-primary" : "text-game-accent"}`}
            >
              {regularMarketChangePercent >= 0 ? (
                <TrendingUp className="mr-1 h-3 w-3" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3" />
              )}
              {regularMarketChangePercent >= 0 ? "+" : ""}
              {regularMarketChangePercent.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-4 pt-0">
        <div className="text-game-blue mt-3 text-xs">{fullExchangeName}</div>

        <Button
          className={`game-button w-full ${
            isInPortfolio(symbol) ? "game-button-gray" : "game-button-primary"
          }`}
          onClick={() => handleAddOrRemove(symbol)}
        >
          {isInPortfolio(symbol) ? (
            <>
              <Check className="h-4 w-4" />
              Added to Portfolio
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4" />
              Add to Portfolio
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
