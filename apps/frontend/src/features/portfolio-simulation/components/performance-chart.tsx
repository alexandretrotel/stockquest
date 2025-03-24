"use client";

import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { usePerformanceResultStore } from "@/stores/performance-result.store";
import { PORTFOLIO_STARTING_VALUE } from "@/data/settings";

const chartConfig = {
  portfolio: {
    label: "Your Portfolio",
    color: "hsl(var(--chart-2))",
  },
  benchmark: {
    label: "S&P 500",
    color: "hsl(var(--foreground))",
  },
} satisfies ChartConfig;

export default function PerformanceChart() {
  const { result } = usePerformanceResultStore();

  if (!result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="text-game-primary h-4 w-4" />
            Portfolio Performance
          </CardTitle>

          <CardDescription>
            Performance of your portfolio over time compared to S&P 500
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="text-muted-foreground flex max-h-[400px] w-full items-center justify-center">
            No performance data available
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-2 text-sm">
          <div className="text-muted-foreground leading-none">
            Showing portfolio value over the last 12 months
          </div>
        </CardFooter>
      </Card>
    );
  }

  const portfolioValues = result.portfolio.values;
  const benchmarkValues = result.benchmark.values;
  const data = portfolioValues.map((portfolio, index) => ({
    date: portfolio.date,
    portfolio: portfolio.value * PORTFOLIO_STARTING_VALUE,
    benchmark: benchmarkValues[index].value * PORTFOLIO_STARTING_VALUE,
  }));

  const yAxisDomain = (() => {
    if (!data || data.length === 0) return [0, 100];

    const portfolioValues = data.map((d) => d.portfolio);
    const benchmarkValues = data.map((d) => d.benchmark);
    const allValues = [...portfolioValues, ...benchmarkValues];

    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);

    const domainMin = minValue * 0.9;
    const domainMax = maxValue * 1.1;

    const step = maxValue - minValue < 10 ? 0.1 : 10;
    return [
      Math.floor(domainMin / step) * step,
      Math.ceil(domainMax / step) * step,
    ];
  })();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="text-game-primary h-4 w-4" />
          Portfolio Performance
        </CardTitle>

        <CardDescription>
          Performance of your portfolio over time compared to S&P 500
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[400px] w-full">
          <LineChart data={data} margin={{ top: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                new Date(value)?.toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                }) ?? "N/A"
              }
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
              tickMargin={8}
              domain={yAxisDomain}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => {
                    return (
                      new Date(label)?.toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      }) ?? "N/A"
                    );
                  }}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              type="monotone"
              dataKey="portfolio"
              stroke={chartConfig.portfolio.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
              animationDuration={300}
              animationEasing="ease-in-out"
            />
            <Line
              type="monotone"
              dataKey="benchmark"
              stroke={chartConfig.benchmark.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
              animationDuration={600}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Showing portfolio value over the last 12 months
        </div>
      </CardFooter>
    </Card>
  );
}
