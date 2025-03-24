import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { PortfolioPerformance } from "@/schemas/portfolio.schema";
import { usePortfolio } from "@/features/portfolio/hooks/use-portfolio";

interface SavePortfolioDialogProps {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  performance?: PortfolioPerformance;
}

const SavePortfolioSchema = z.object({
  portfolioName: z.string().nonempty("Portfolio name is required"),
});

type SavePortfolio = z.infer<typeof SavePortfolioSchema>;

export default function SavePortfolioDialog({
  open,
  onOpenChange,
  performance,
}: SavePortfolioDialogProps) {
  const { savePortfolio, savePortfolioWithResult } = usePortfolio();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SavePortfolio>({
    resolver: zodResolver(SavePortfolioSchema),
    defaultValues: {
      portfolioName: "",
    },
  });

  const onSubmit = async (data: SavePortfolio) => {
    const { portfolioName } = data;
    if (!portfolioName.trim()) return;

    try {
      if (performance) {
        await savePortfolioWithResult(portfolioName, performance);
      } else {
        await savePortfolio(portfolioName);
      }
      onOpenChange(false);
    } catch {
      toast.error("Failed to save portfolio");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Portfolio</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 py-4">
            <Label htmlFor="portfolio-name">Portfolio Name</Label>
            <Input
              {...register("portfolioName")}
              placeholder="Enter portfolio name"
              type="text"
            />
            {errors.portfolioName && (
              <p className="text-game-accent text-sm">
                {errors.portfolioName.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={isSubmitting}
              className="game-button-primary"
              type="submit"
            >
              <Check className="h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Portfolio"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
