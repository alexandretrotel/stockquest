import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useInsights } from "@/features/stock-insights/hooks/use-insights";
import { useStock } from "@/features/stock-insights/hooks/use-stock";
import { useAIProviderStore } from "@/stores/ai.store";
import { useCompletion } from "@ai-sdk/react";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

interface AIInsightsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  symbol: string;
}

export default function AIInsightsDialog({
  open,
  onOpenChange,
  symbol,
}: AIInsightsDialogProps) {
  const { stock } = useStock(symbol);
  const { insights } = useInsights(symbol);
  const { aiProvider, apiKeys } = useAIProviderStore();

  const object = {
    stock,
    insights,
  };

  const { completion, isLoading, complete } = useCompletion({
    body: { object, provider: aiProvider, apiKey: apiKeys[aiProvider] },
    api: "/api/stockquest-ai/completion/stock",
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
            {stock ? stock.shortName : "N/A"}{" "}
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
