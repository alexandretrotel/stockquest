import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { usePerformanceResultStore } from "@/stores/performance-result.store";

interface ValueData {
  date: Date;
  value: number;
}

type ValuesData = ValueData[];

interface AnnualReturn {
  year: number;
  date: Date;
  start: number;
  end: number;
  return: number;
}

type AnnualReturns = AnnualReturn[];

interface AnnualData {
  year: number;
  date: Date;
  portfolioReturn: number;
  benchmarkReturn: number;
}

type FullAnnualData = AnnualData[];

export default function PerformanceTable() {
  const { result } = usePerformanceResultStore();

  if (!result) {
    return (
      <Table className="w-full">
        <TableHeader>
          <TableRow className="border-b">
            <TableHead className="p-2 text-left font-medium">Year</TableHead>
            <TableHead className="p-2 text-right font-medium">
              Portfolio
            </TableHead>
            <TableHead className="p-2 text-right font-medium">
              S&P 500
            </TableHead>
            <TableHead className="p-2 text-right font-medium">
              Difference
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow>
            <TableCell
              colSpan={4}
              className="text-muted-foreground p-2 text-center"
            >
              No performance data available
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  const portfolioValues: ValuesData = result.portfolio.values;
  const benchmarkValues: ValuesData = result.benchmark.values;

  const getAnnualReturns = (values: ValuesData): AnnualReturn[] => {
    const annualData: {
      [year: string]: { start: number; end: number; date: Date };
    } = {};

    values.forEach(({ date, value }) => {
      const year = new Date(date).getFullYear().toString();

      if (!annualData[year]) {
        annualData[year] = { start: value, end: value, date };
      } else {
        annualData[year].end = value;
      }
    });

    return Object.entries(annualData).map(([year, data]) => ({
      year: parseInt(year),
      date: data.date,
      start: data.start,
      end: data.end,
      return: ((data.end - data.start) / data.start) * 100,
    }));
  };

  const portfolioAnnual: AnnualReturns = getAnnualReturns(portfolioValues);
  const benchmarkAnnual: AnnualReturns = getAnnualReturns(benchmarkValues);

  const annualData: FullAnnualData = portfolioAnnual.map(
    (portfolio, index) => ({
      year: portfolio.year,
      date: portfolio.date,
      portfolioReturn: portfolio.return,
      benchmarkReturn: benchmarkAnnual[index].return || 0,
    }),
  );

  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow className="border-b">
          <TableHead className="p-2 text-left font-medium">Year</TableHead>
          <TableHead className="p-2 text-right font-medium">
            Portfolio
          </TableHead>
          <TableHead className="p-2 text-right font-medium">S&P 500</TableHead>
          <TableHead className="p-2 text-right font-medium">
            Difference
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {annualData.map((data) => {
          const difference: number =
            data.portfolioReturn - data.benchmarkReturn;

          return (
            <TableRow key={data.year} className="border-b">
              <TableCell className="p-2">{data.year}</TableCell>
              <TableCell
                className={`p-2 text-right ${
                  data.portfolioReturn >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {data.portfolioReturn >= 0 ? "+" : ""}
                {data.portfolioReturn.toFixed(2)}%
              </TableCell>
              <TableCell
                className={`p-2 text-right ${
                  data.benchmarkReturn >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {data.benchmarkReturn >= 0 ? "+" : ""}
                {data.benchmarkReturn.toFixed(2)}%
              </TableCell>
              <TableCell
                className={`p-2 text-right ${
                  difference >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {difference >= 0 ? "+" : ""}
                {difference.toFixed(2)}%
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
