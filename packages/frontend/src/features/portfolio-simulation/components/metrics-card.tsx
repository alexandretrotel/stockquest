import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { InfoPopup } from "@/components/ui/info-popup";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

interface MetricsCardProps {
  title: string;
  value: number;
  benchmarkValue?: number;
  isSharpeRatio?: boolean;
  color?: "green" | "yellow" | "default" | "red";
  indicatorDescription?: string;
}

export default function MetricsCard({
  title,
  value,
  benchmarkValue,
  isSharpeRatio = false,
  color = "default",
  indicatorDescription,
}: MetricsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>

        {indicatorDescription && (
          <InfoPopup
            trigger={<Info className="text-muted-foreground" size={16} />}
            content={indicatorDescription}
          />
        )}
      </CardHeader>

      <CardContent>
        <p
          className={cn(
            "text-3xl font-bold",
            color === "yellow" && "text-game-secondary",
            color === "default" && "text-foreground",
            color === "green" && "text-game-primary",
            color === "red" && "text-game-accent",
          )}
        >
          {value.toFixed(2)}
          {isSharpeRatio ? "" : "%"}
        </p>

        {benchmarkValue && (
          <p className="text-muted-foreground text-sm">
            vs. {benchmarkValue.toFixed(2)}
            {isSharpeRatio ? "" : "%"} S&P 500
          </p>
        )}
      </CardContent>
    </Card>
  );
}
