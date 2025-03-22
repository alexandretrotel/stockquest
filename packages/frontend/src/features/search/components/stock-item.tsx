import { Button } from "@/components/ui/button";
import { CommandItem } from "@/components/ui/command";
import { YahooSearch } from "@/actions/stock.action";
import { usePortfolioStore } from "@/stores/portfolio.store";
import { useRouter } from "next/navigation";

interface StockItemProps {
  quote: YahooSearch[number];
  setOpenCommand: (open: boolean) => void;
}

export default function StockItem({ quote, setOpenCommand }: StockItemProps) {
  const router = useRouter();
  const { isInPortfolio, handleAddOrRemove } = usePortfolioStore();

  if (!quote.isYahooFinance) return null;

  const symbol = quote.symbol;
  const shortname = quote.shortname ?? "N/A";
  const exchDisp = quote.exchDisp ?? "N/A";

  return (
    <CommandItem
      title={quote.index}
      value={JSON.stringify(quote)}
      onSelect={() => {
        setOpenCommand(false);
        router.push(`/stock/${symbol}`);
      }}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-semibold">{symbol}</span>
          <span className="text-muted-foreground">{shortname}</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-game-blue font-semibold">{exchDisp}</span>

          <Button
            size="sm"
            variant={isInPortfolio(symbol) ? "default" : "secondary"}
            className={isInPortfolio(symbol) ? "game-button-gray" : ""}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpenCommand(false);
              handleAddOrRemove(symbol);
            }}
          >
            {isInPortfolio(symbol) ? "Remove" : "Add"}
          </Button>
        </div>
      </div>
    </CommandItem>
  );
}
