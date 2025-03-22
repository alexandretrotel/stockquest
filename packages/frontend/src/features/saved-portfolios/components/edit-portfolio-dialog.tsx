import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { usePortfolio } from "@/features/portfolio/hooks/use-portfolio";

interface EditPortfolioDialogProps {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  portfolioId: string;
  setCurrentPortfolioName: React.Dispatch<React.SetStateAction<string>>;
  currentPortfolioName: string;
}

const RenamePortfolioSchema = z.object({
  name: z.string().min(1, "Name must be at least 1 character"),
});

type RenamePortfolio = z.infer<typeof RenamePortfolioSchema>;

export default function EditPortfolioDialog({
  open,
  onOpenChange,
  portfolioId,
  setCurrentPortfolioName,
  currentPortfolioName,
}: EditPortfolioDialogProps) {
  const { renamePortfolio } = usePortfolio();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RenamePortfolio>({
    resolver: zodResolver(RenamePortfolioSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: RenamePortfolio) => {
    try {
      await renamePortfolio(portfolioId, data.name);
      onOpenChange(false);
      setCurrentPortfolioName(data.name);
    } catch {
      setCurrentPortfolioName(currentPortfolioName);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Portfolio</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-8 py-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium"
              >
                Portfolio Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder={currentPortfolioName}
                {...register("name")}
                required
              />
              {errors.name && (
                <p className="text-game-accent text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="bg-muted/30 rounded-md border p-3">
              <div className="text-muted-foreground mb-1 flex items-center gap-2 text-sm">
                <span className="font-medium">Stock Weights</span>
                <span className="bg-muted rounded px-2 py-0.5 text-xs">
                  Coming Soon
                </span>
              </div>
              <p className="text-muted-foreground text-xs">
                You&apos;ll be able to adjust the weight of each stock in your
                portfolio.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
