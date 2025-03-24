"use client";

import { Button } from "@/components/ui/button";
import { usePerformanceResultStore } from "@/stores/performance-result.store";
import { ArrowLeft, BookmarkX, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import SavePortfolioDialog from "@/features/portfolio/components/save-portfolio-dialog";
import { useEffect, useState } from "react";
import { PortfolioPerformance } from "@/schemas/portfolio.schema";
import { usePortfolioStore } from "@/stores/portfolio.store";
import { usePortfolio } from "@/features/portfolio/hooks/use-portfolio";
import PerformanceChart from "@/features/portfolio-simulation/components/performance-chart";
import MetricsCard from "@/features/portfolio-simulation/components/metrics-card";
import PerformanceTable from "@/features/portfolio-simulation/components/performance-table";
import { useSavedPortfoliosStore } from "@/stores/saved-portfolios.store";

export default function PerformanceResults() {
  const [savePortfolioDialogOpen, setSavePortfolioDialogOpen] = useState(false);

  const { result, isLoading } = usePerformanceResultStore();
  const {
    isValidPortfolio,
    isSaving,
    isSaved,
    portfolioId,
    syncPortfolio,
    allocations,
  } = usePortfolioStore();
  const { unsavePortfolio } = usePortfolio();
  const { savedPortfolios } = useSavedPortfoliosStore();

  useEffect(() => {
    if (savedPortfolios && allocations) {
      syncPortfolio(allocations, savedPortfolios);
    } else if (savedPortfolios) {
      syncPortfolio([], savedPortfolios);
    }
  }, [allocations, savedPortfolios, syncPortfolio]);

  if (isLoading || !result) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="mr-2 animate-spin" size={20} />
        This is taking longer than expected...
      </div>
    );
  }

  const sharpeRatio = result.portfolio.sharpeRatio;
  const benchmarkSharpeRatio = result.benchmark.sharpeRatio;

  const totalReturn = result.portfolio.totalReturn * 100;
  const benchmarkTotalReturn = result.benchmark.totalReturn * 100;

  const maxDrawdown = result.portfolio.maxDrawdown * 100;
  const benchmarkMaxDrawdown = result.benchmark.maxDrawdown * 100;

  const performance: PortfolioPerformance = {
    date: new Date(),
    totalReturn,
    sharpeRatio,
    maxDrawdown,
    startDate: result.startingDate,
    endDate: result.endingDate,
    beatsSP500: result.beatsBenchmark,
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Results</h1>
        </div>

        {isSaved ? (
          <Button
            onClick={async () => {
              if (portfolioId) {
                await unsavePortfolio(portfolioId);
              }
            }}
            disabled={!portfolioId}
            variant="outline"
          >
            <BookmarkX size={20} />
            Unsave
          </Button>
        ) : (
          <Button
            onClick={() => setSavePortfolioDialogOpen(true)}
            disabled={isSaving || !isValidPortfolio()}
            variant="outline"
          >
            {isSaving ? (
              <span className="animate-pulse">Saving...</span>
            ) : (
              <>
                <Check size={20} />
                Save Portfolio
              </>
            )}
          </Button>
        )}
      </div>

      <div className="grid gap-8">
        <PerformanceChart />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <MetricsCard
            title="Total Return"
            value={totalReturn}
            benchmarkValue={benchmarkTotalReturn}
            color={totalReturn >= 0 ? "green" : "red"}
            indicatorDescription="Total return is the total amount of profit or loss made on an investment over a period of time, expressed as a percentage of the initial investment cost."
          />
          <MetricsCard
            title="Sharpe Ratio"
            isSharpeRatio
            value={sharpeRatio}
            benchmarkValue={benchmarkSharpeRatio}
            indicatorDescription="A higher Sharpe ratio indicates better risk-adjusted returns."
          />
          <MetricsCard
            title="Max Drawdown"
            value={maxDrawdown}
            benchmarkValue={benchmarkMaxDrawdown}
            color={maxDrawdown >= 0 ? "green" : "red"}
            indicatorDescription="A drawdown is a peak-to-trough decline during a specific period for an investment, trading account, or fund. A drawdown is usually quoted as the percentage between the peak and the subsequent trough."
          />
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Monthly Returns</h2>
          <div className="game-card overflow-x-auto">
            <PerformanceTable />
          </div>
        </div>
      </div>

      <SavePortfolioDialog
        open={savePortfolioDialogOpen}
        onOpenChange={setSavePortfolioDialogOpen}
        performance={performance}
      />
    </>
  );
}
