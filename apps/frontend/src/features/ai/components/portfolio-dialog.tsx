import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Allocations } from "@/schemas/portfolio.schema";
import { useAIProviderStore } from "@/stores/ai.store";
import { useCompletion } from "@ai-sdk/react";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

interface AIInsightsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allocations: Allocations;
}

export default function AIPortfolioDialog({
  open,
  onOpenChange,
  allocations,
}: AIInsightsDialogProps) {
  const { aiProvider, apiKeys } = useAIProviderStore();

  const { completion, isLoading, complete } = useCompletion({
    body: { allocations, provider: aiProvider, apiKey: apiKeys[aiProvider] },
    api: "/api/stockquest-ai/completion/portfolio",
  });

  useEffect(() => {
    if (open) {
      if (aiProvider !== "stockquestai" && !apiKeys[aiProvider]) {
        toast.error("Please provide an API key for the selected provider.");
        onOpenChange(false);
        return;
      }

      complete("");
    }
  }, [aiProvider, apiKeys, complete, onOpenChange, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="inline-flex items-center gap-2">
            Portfolio Insights
            {isLoading && (
              <Loader2
                size={20}
                className="text-muted-foreground animate-spin"
              />
            )}
          </DialogTitle>
        </DialogHeader>

        <div>
          <div
            className="text-foreground text-sm"
            dangerouslySetInnerHTML={{ __html: completion }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
