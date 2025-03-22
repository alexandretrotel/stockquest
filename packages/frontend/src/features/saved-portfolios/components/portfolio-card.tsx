import { Button } from "@/components/ui/button";
import { PlusCircle, Stars } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePortfolioStore } from "@/stores/portfolio.store";
import { useState } from "react";
import EditPortfolioDialog from "./edit-portfolio-dialog";
import AllocationsSection from "@/features/portfolio/components/allocations";
import AIPortfolioDialog from "@/features/ai/components/portfolio-dialog";
import { Allocations } from "@/schemas/portfolio.schema";

interface PortfolioCardProps {
  name: string;
  updatedAt: Date;
  allocations: Allocations;
  id: string;
}

export default function PortfolioCard({
  id,
  name,
  allocations,
  updatedAt,
}: PortfolioCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [currentPortfolioName, setCurrentPortfolioName] = useState(name);

  const router = useRouter();
  const { setAllocations } = usePortfolioStore();

  const handleViewPortfolio = () => {
    setAllocations(allocations);
    router.push("/portfolio");
  };

  return (
    <>
      <div className="game-card flex flex-col justify-between gap-4 p-4">
        <div>
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-foreground font-semibold">
              {currentPortfolioName}
            </h3>

            <Button
              variant="ghost"
              className="text-game-blue"
              onClick={() => setIsDialogOpen(true)}
            >
              Edit
            </Button>
          </div>
          <p className="text-muted-foreground text-xs">
            Last updated: {new Date(updatedAt).toLocaleDateString("en-US")}
          </p>
        </div>

        <AllocationsSection allocations={allocations} />

        <div className="grid grid-cols-2 gap-4">
          <Button
            className="game-button-primary w-full"
            onClick={handleViewPortfolio}
          >
            <PlusCircle className="h-4 w-4" />
            Import
          </Button>

          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setIsAIDialogOpen(true)}
          >
            <Stars className="h-4 w-4" />
            StockQuest AI
          </Button>
        </div>
      </div>

      <AIPortfolioDialog
        open={isAIDialogOpen}
        onOpenChange={setIsAIDialogOpen}
        allocations={allocations}
      />
      <EditPortfolioDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        portfolioId={id}
        currentPortfolioName={currentPortfolioName}
        setCurrentPortfolioName={setCurrentPortfolioName}
      />
    </>
  );
}
