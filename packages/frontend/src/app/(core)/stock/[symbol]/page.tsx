"use client";

import StockChart from "@/features/stock-insights/components/stock-chart";
import StockInsights from "@/features/stock-insights/components/company";
import StockMainCard from "@/features/stock-insights/components/stock-main-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import Recommandations from "@/features/stock-insights/components/recommandations";

export default function StockPage() {
  const params: { symbol?: string } = useParams();
  const rawSymbol = params.symbol;
  const symbol = rawSymbol ? decodeURIComponent(rawSymbol) : undefined;

  if (!symbol) {
    return notFound();
  }

  return (
    <div className="relative">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Details</h1>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <StockMainCard symbol={symbol} />
          <StockInsights symbol={symbol} />
        </div>

        <StockChart symbol={symbol} />

        <Recommandations symbol={symbol} />
      </div>
    </div>
  );
}
