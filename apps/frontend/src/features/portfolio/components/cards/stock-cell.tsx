import { TableRow, TableCell } from "@/components/ui/table";
import { useStock } from "@/features/stock-insights/hooks/use-stock";

interface StockCellProps {
  symbol: string;
  weight: number;
  allocation: number;
}

export default function StockCell({
  symbol,
  weight,
  allocation,
}: StockCellProps) {
  const { stock } = useStock(symbol);

  if (!stock) {
    return (
      <TableRow key={symbol} className="hover:bg-muted">
        <TableCell colSpan={5} className="text-muted-foreground text-center">
          Stock not found for {symbol}
        </TableCell>
      </TableRow>
    );
  }

  const shortName = stock.shortName ?? "N.A";
  const regularMarketPrice = stock.regularMarketPrice ?? 0;

  return (
    <TableRow key={symbol} className="hover:bg-muted">
      <TableCell className="font-medium">{shortName}</TableCell>
      <TableCell className="text-game-blue font-semibold">{symbol}</TableCell>
      <TableCell>${regularMarketPrice.toFixed(2)}</TableCell>
      <TableCell>
        <span className="font-semibold">{(weight * 100).toFixed(1)}%</span>
      </TableCell>
      <TableCell>
        <span className="text-game-primary font-semibold">
          ${allocation.toFixed(2)}
        </span>
      </TableCell>
    </TableRow>
  );
}
