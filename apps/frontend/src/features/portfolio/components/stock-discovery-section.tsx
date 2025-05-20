"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Sparkles, TrendingDown } from "lucide-react";
import StockCard from "../../stock-insights/components/stock-card";
import { useScreener } from "@/features/screener/hooks/use-screener";
import { DISCOVER_SECTIONS, POPULAR_STOCKS } from "@/data/screener";
import { StockCardSkeleton } from "@/features/stock-insights/components/skeleton/stock-card-skeleton";

export default function StockDiscoverySection() {
  const { screener, isLoading } = useScreener();

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-foreground text-2xl font-bold">Discover</h2>
        </div>

        <Tabs defaultValue={DISCOVER_SECTIONS[0].category}>
          <div className="hide-scrollbar overflow-x-auto">
            <TabsList className="mb-6 inline-flex h-10 gap-2">
              {DISCOVER_SECTIONS.map((section) => (
                <TabsTrigger
                  key={section.category}
                  value={section.category}
                  className="h-full font-semibold"
                  disabled={section.disabled}
                >
                  {section.category === "popular" && (
                    <Sparkles className="mr-1.5 h-4 w-4" />
                  )}
                  {section.category === "gainers" && (
                    <TrendingUp className="mr-1.5 h-4 w-4" />
                  )}
                  {section.category === "losers" && (
                    <TrendingDown className="mr-1.5 h-4 w-4" />
                  )}
                  {section.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <StockCardSkeleton key={index} />
            ))}
          </div>
        </Tabs>
      </div>
    );
  }

  if (!screener) {
    return (
      <div className="mb-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-foreground text-2xl font-bold">Discover</h2>
        </div>

        <div className="text-muted-foreground flex h-42 items-center justify-center text-center">
          No screener data available
        </div>
      </div>
    );
  }

  const dailyGainersSymbols = screener.day_gainers.map((quote) => quote.symbol);
  const dailyLosersSymbols = screener.day_losers.map((quote) => quote.symbol);

  return (
    <div className="mb-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-foreground text-2xl font-bold">Discover</h2>
      </div>

      <Tabs defaultValue={DISCOVER_SECTIONS[0].category}>
        <div className="hide-scrollbar overflow-x-auto">
          <TabsList className="mb-6 inline-flex h-10 gap-2">
            {DISCOVER_SECTIONS.map((section) => (
              <TabsTrigger
                key={section.category}
                value={section.category}
                className="h-full font-semibold"
                disabled={section.disabled}
              >
                {section.category === "popular" && (
                  <Sparkles className="mr-1.5 h-4 w-4" />
                )}
                {section.category === "gainers" && (
                  <TrendingUp className="mr-1.5 h-4 w-4" />
                )}
                {section.category === "losers" && (
                  <TrendingDown className="mr-1.5 h-4 w-4" />
                )}
                {section.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {DISCOVER_SECTIONS.map((section) => (
          <TabsContent
            key={section.category}
            value={section.category}
            className="mt-0"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {section.category === "popular" &&
                POPULAR_STOCKS.map((stock) => (
                  <StockCard key={stock.symbol} symbol={stock.symbol} />
                ))}
              {section.category === "gainers" &&
                dailyGainersSymbols.map((symbol) => (
                  <StockCard key={symbol} symbol={symbol} />
                ))}
              {section.category === "losers" &&
                dailyLosersSymbols.map((symbol) => (
                  <StockCard key={symbol} symbol={symbol} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
