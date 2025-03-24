"use client";

import { usePortfolioStore } from "@/stores/portfolio.store";
import { Button } from "@/components/ui/button";
import { Check, BookmarkX, FlaskConical } from "lucide-react";
import { useEffect, useState } from "react";
import StocksTable from "./cards/stocks-table";
import DiversityScore from "./cards/diversity-score";
import PortfolioWeight from "./cards/portfolio-weight";
import PortfolioChartCard from "./cards/portfolio-chart";
import AdjustWeights from "./cards/adjust-weights";
import SavePortfolioDialog from "./save-portfolio-dialog";
import Link from "next/link";
import { useSavedPortfolios } from "@/features/user/hooks/use-saved-portfolios";
import Onboarding from "./cards/onboarding-challenges-card";
import { toast } from "sonner";
import { usePortfolio } from "@/features/portfolio/hooks/use-portfolio";
import PerformanceDialog from "./simulation-dialog";

export default function PortfolioSection() {
  const { savedPortfolios } = useSavedPortfolios();
  const {
    allocations,
    isSaved,
    totalWeight,
    totalStocks,
    isSaving,
    isValidPortfolio,
    diversityScore,
    portfolioId,
    syncPortfolio,
  } = usePortfolioStore();
  const { unsavePortfolio, runSimulation } = usePortfolio();

  const safeAllocations = allocations ?? [];

  const [backtestOpen, setPerformanceOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);

  useEffect(() => {
    if (savedPortfolios && allocations) {
      syncPortfolio(allocations, savedPortfolios);
    } else if (savedPortfolios) {
      syncPortfolio([], savedPortfolios);
    }
  }, [allocations, savedPortfolios, syncPortfolio]);

  const handlePerformance = () => {
    if (!allocations) {
      toast.error("Portfolio is empty");
      return;
    }

    runSimulation(allocations);
    setPerformanceOpen(true);
  };

  return (
    <div className="overflow-hidden py-2">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Portfolio</h1>
        </div>

        <div className="hidden gap-2 md:flex">
          {isSaved ? (
            <Button
              onClick={async () => {
                if (portfolioId) {
                  await unsavePortfolio(portfolioId);
                }
              }}
              disabled={!portfolioId}
              className="game-button-gray"
            >
              <BookmarkX className="h-4 w-4" />
              Unsave
            </Button>
          ) : (
            <Button
              onClick={() => setSaveOpen(true)}
              disabled={isSaving || !isValidPortfolio()}
              className="game-button-primary"
            >
              {isSaving ? (
                <span className="animate-pulse">Saving...</span>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Save Portfolio
                </>
              )}
            </Button>
          )}

          <Button
            onClick={handlePerformance}
            disabled={!isValidPortfolio()}
            className="game-button-secondary"
          >
            <FlaskConical className="h-4 w-4" />
            Simulate
          </Button>
        </div>
      </div>

      {totalStocks() === 0 ? (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-foreground text-lg font-semibold">
            Your portfolio is empty
          </p>
          <p className="text-muted-foreground max-w-md">
            Add stocks from the discovery section below to start building your
            portfolio or use{" "}
            <Link
              href="/stockquest-ai"
              className="text-game-blue hover:underline"
            >
              StockQuest AI
            </Link>{" "}
            to get personalized recommendations.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 grid gap-4">
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              <PortfolioWeight totalWeight={totalWeight()} />
              <DiversityScore diversityScore={diversityScore()} />
              <Onboarding />
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <PortfolioChartCard allocations={safeAllocations} />
            <AdjustWeights />
          </div>

          <div className="game-card overflow-hidden">
            <StocksTable
              allocations={safeAllocations}
              totalWeight={totalWeight()}
            />
          </div>
        </>
      )}

      <div className="mt-6 grid w-full grid-cols-2 gap-4 md:hidden">
        {isSaved ? (
          <Button
            onClick={async () => {
              if (portfolioId) {
                await unsavePortfolio(portfolioId);
              }
            }}
            disabled={!portfolioId}
            className="game-button-gray"
          >
            <BookmarkX className="h-4 w-4" />
            Unsave
          </Button>
        ) : (
          <Button
            onClick={() => setSaveOpen(true)}
            disabled={isSaving || !isValidPortfolio()}
            className="game-button-primary"
          >
            {isSaving ? (
              <span className="animate-pulse">Saving...</span>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Save Portfolio
              </>
            )}
          </Button>
        )}

        <Button
          onClick={handlePerformance}
          disabled={!isValidPortfolio()}
          className="game-button-secondary"
        >
          <FlaskConical className="h-4 w-4" />
          Simulate
        </Button>
      </div>

      <PerformanceDialog
        open={backtestOpen}
        onOpenChange={setPerformanceOpen}
      />
      <SavePortfolioDialog open={saveOpen} onOpenChange={setSaveOpen} />
    </div>
  );
}
