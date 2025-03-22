import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useStockChart } from "@/features/stock-insights/hooks/use-stock-chart";
import { BACKTEST_YEARS } from "@/data/settings";

interface StockChartProps {
  symbol: string;
}

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const initialStartingDate = new Date();
initialStartingDate.setFullYear(
  initialStartingDate.getFullYear() - BACKTEST_YEARS,
);

type ChartPeriod = "1M" | "6M" | "1Y" | "5Y";

export default function StockChart({ symbol }: StockChartProps) {
  const [activeTab, setActiveTab] = useState<ChartPeriod>("5Y");
  const [startingDate, setStartingDate] = useState<Date>(initialStartingDate);
  const { chart } = useStockChart(symbol, startingDate);

  useEffect(() => {
    const today = new Date();

    switch (activeTab) {
      case "1M":
        setStartingDate(new Date(today.setMonth(today.getMonth() - 1)));
        break;
      case "6M":
        setStartingDate(new Date(today.setMonth(today.getMonth() - 6)));
        break;
      case "1Y":
        setStartingDate(new Date(today.setFullYear(today.getFullYear() - 1)));
        break;
      case "5Y":
        setStartingDate(new Date(today.setFullYear(today.getFullYear() - 5)));
        break;
    }
  }, [activeTab]);

  if (!chart || chart.length === 0) {
    return (
      <div className="game-card w-full p-6">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-foreground text-2xl font-bold">Chart</h2>
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as ChartPeriod)}
            >
              <TabsList>
                {["1M", "6M", "1Y", "5Y"].map((period) => (
                  <TabsTrigger key={period} value={period}>
                    {period}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <div className="text-foreground flex h-96 items-center justify-center text-lg">
            No chart data available for {symbol}
          </div>
        </div>
      </div>
    );
  }

  const chartData = chart.map((data) => ({
    date: new Date(data.date),
    price: data.adjclose,
  }));

  const [minPrice, maxPrice] = (() => {
    const prices = chartData.map((data) => data.price ?? 0);

    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min;

    return [min - range * 0.1, max + range * 0.1];
  })();

  const xDomain = (() => {
    const today = new Date();
    return [startingDate.getTime(), today.getTime()];
  })();

  return (
    <div className="game-card w-full p-6">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-foreground text-2xl font-bold">Chart</h2>

          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as ChartPeriod)}
          >
            <TabsList>
              {["1M", "6M", "1Y", "5Y"].map((period) => (
                <TabsTrigger key={period} value={period}>
                  {period}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <ChartContainer config={chartConfig} className="h-96">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={xDomain}
              type="number"
              tickFormatter={(value) =>
                new Date(value)?.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }) ?? "N/A"
              }
            />
            <YAxis
              dataKey="price"
              tickLine={false}
              axisLine={false}
              domain={[minPrice, maxPrice]}
              tickFormatter={(value) =>
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                }).format(value)
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="price"
              type="linear"
              fill="var(--color-price)"
              fillOpacity={0.4}
              stroke="var(--color-price)"
              animationDuration={500}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}
