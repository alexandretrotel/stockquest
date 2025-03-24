import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PORTFOLIO_STARTING_VALUE } from "@/data/settings";
import StockCell from "./stock-cell";
import { Allocations } from "@/schemas/portfolio.schema";

interface StocksTableProps {
  allocations: Allocations;
  totalWeight: number;
}

export default function StocksTable({
  allocations,
  totalWeight,
}: StocksTableProps) {
  const total = (totalWeight * PORTFOLIO_STARTING_VALUE) / 100;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-foreground font-semibold">Stock</TableHead>
          <TableHead className="text-foreground font-semibold">
            Symbol
          </TableHead>
          <TableHead className="text-foreground font-semibold">
            Current Price
          </TableHead>
          <TableHead className="text-foreground font-semibold">
            Weight (%)
          </TableHead>
          <TableHead className="text-foreground font-semibold">
            Allocation ($)
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {allocations.map((stock) => {
          const portfolioValue = PORTFOLIO_STARTING_VALUE;
          const allocation = stock.weight * portfolioValue;

          return (
            <StockCell
              key={stock.symbol}
              symbol={stock.symbol}
              weight={stock.weight}
              allocation={allocation}
            />
          );
        })}

        <TableRow>
          <TableCell
            colSpan={3}
            className="text-foreground text-right font-semibold"
          >
            Total
          </TableCell>
          <TableCell className="font-semibold">
            {(totalWeight * 100).toFixed(1)}%
          </TableCell>
          <TableCell className="font-semibold">${total.toFixed(2)}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
