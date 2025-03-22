import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCompany } from "@/features/stock-insights/hooks/use-company";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface StockInsightsProps {
  symbol: string;
}

export default function StockInsights({ symbol }: StockInsightsProps) {
  const [openFullDescription, setOpenFullDescription] = useState(false);

  const { company } = useCompany(symbol);

  if (!company || !company.assetProfile) {
    return (
      <div className="game-card flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-foreground text-2xl font-bold">Company</h2>
        </div>
        <div className="bg-muted h-full rounded-md p-4">
          <p className="text-muted-foreground text-sm">
            No company data available for {symbol}
          </p>
        </div>
      </div>
    );
  }

  const companyWebsite = company.assetProfile.website;
  const longBusinessSummary = company.assetProfile.longBusinessSummary;
  const industry = company.assetProfile.industry;
  const sector = company.assetProfile.sector;

  return (
    <>
      <div className="game-card flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-foreground text-2xl font-bold">Company</h2>
            {industry && (
              <span className="text-muted-foreground text-sm">
                ({sector ?? "N/A"})
              </span>
            )}
          </div>

          {companyWebsite && (
            <Button variant="outline" size="sm" asChild>
              <Link href={companyWebsite} target="_blank">
                Website <ArrowUpRight />
              </Link>
            </Button>
          )}
        </div>

        <div className="bg-muted h-full rounded-md p-4">
          <p className="text-foreground text-sm">
            {longBusinessSummary?.slice(0, 300) ?? "No description available"}
            {(longBusinessSummary?.length ?? 0) > 300 && "..."}
            {(longBusinessSummary?.length ?? 0) > 300 && (
              <button
                onClick={() => setOpenFullDescription(true)}
                className="text-game-blue hover:underline"
              >
                Read more
              </button>
            )}
          </p>
        </div>
      </div>

      <Dialog open={openFullDescription} onOpenChange={setOpenFullDescription}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Full Description</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-foreground text-sm">
              {longBusinessSummary ?? "No description available"}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
