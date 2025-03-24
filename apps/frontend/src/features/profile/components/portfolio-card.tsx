import Allocations from "@/features/portfolio/components/allocations";
import { Button } from "@/components/ui/button";
import { usePortfolioStore } from "@/stores/portfolio.store";
import { PlusCircle, Stars } from "lucide-react";
import { useRouter } from "next/navigation";
import AIPortfolioDialog from "@/features/ai/components/portfolio-dialog";
import { useState } from "react";
import Badge from "@/components/ui/game-badge";
import { SavedPortfolios } from "@/schemas/portfolio.schema";
import Link from "next/link";
import { useProfileUserDataFromUserId } from "@/features/saved-portfolios/hooks/use-profile-user-data-from-user-id";

interface PortfolioCardProps {
  portfolio: SavedPortfolios[number];
  showCreator?: boolean;
}

export default function PortfolioCard({
  portfolio,
  showCreator,
}: PortfolioCardProps) {
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);

  const { data: profileUserData } = useProfileUserDataFromUserId(
    portfolio.userId,
  );

  const { allocations } = portfolio;
  const portfolioPerformances = portfolio.performance?.length ?? 0;

  const { setAllocations } = usePortfolioStore();
  const router = useRouter();

  return (
    <>
      <div className="game-card flex flex-col justify-between gap-4 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-foreground text-lg font-semibold">
                {portfolio.name}
              </h3>

              {portfolio.performance && portfolioPerformances > 0 && (
                <Badge
                  color="primary"
                  size="sm"
                  label={`${portfolio.performance[portfolioPerformances - 1].totalReturn.toFixed(2)}%`}
                />
              )}
            </div>

            {showCreator && profileUserData ? (
              <p className="text-muted-foreground text-xs">
                Created by{" "}
                <Link
                  href={`/profile/${profileUserData.username}`}
                  className="text-game-blue hover:underline"
                >
                  @{profileUserData.username}
                </Link>
              </p>
            ) : (
              <p className="text-muted-foreground text-xs">
                Created on {new Date(portfolio.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>

          <Allocations allocations={allocations} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => {
              setAllocations(allocations);
              router.push("/portfolio");
            }}
            className="w-full"
            color="primary"
          >
            <PlusCircle size={16} />
            Import
          </Button>
          <Button
            variant="secondary"
            onClick={() => setIsAIDialogOpen(true)}
            className="w-full"
          >
            <Stars size={16} />
            StockQuest AI
          </Button>
        </div>
      </div>

      <AIPortfolioDialog
        open={isAIDialogOpen}
        onOpenChange={setIsAIDialogOpen}
        allocations={allocations}
      />
    </>
  );
}
