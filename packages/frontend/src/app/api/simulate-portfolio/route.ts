import { STOCKQUEST_API_BEARER_TOKEN, STOCKQUEST_API_URL } from "@/data/env";
import { BACKTEST_YEARS } from "@/data/settings";
import { PerformanceResultSchema } from "@/schemas/performance.schema";
import { z } from "zod";
import { AllocationsSchema } from "@/schemas/portfolio.schema";
import {
  getStockChartQuotes,
  getStocksChartQuotes,
} from "@/actions/stock.action";
import ky from "ky";

const BodySchema = z.object({
  allocations: AllocationsSchema,
});

const ResponseSchema = PerformanceResultSchema;

const initialStartingDate = new Date();
initialStartingDate.setFullYear(
  initialStartingDate.getFullYear() - BACKTEST_YEARS,
);

export async function POST(req: Request) {
  try {
    const unvalidatedBody = await req.json();
    const { allocations } = BodySchema.parse(unvalidatedBody);

    const symbols = allocations.map((stock) => stock.symbol);
    const weights = Object.fromEntries(
      allocations.map((stock) => [stock.symbol, stock.weight]),
    );

    const [quotes, benchmark] = await Promise.all([
      await getStocksChartQuotes(symbols, initialStartingDate, true),
      await getStockChartQuotes("SPY", initialStartingDate, true),
    ]);

    const unvalidatedPerformanceResults = await ky
      .post(`${STOCKQUEST_API_URL}/simulate-portfolio`, {
        json: { quotes, weights, benchmark },
        headers: {
          Authorization: `Bearer ${STOCKQUEST_API_BEARER_TOKEN}`,
        },
      })
      .json();
    const backtestResults = ResponseSchema.parse(unvalidatedPerformanceResults);

    return Response.json(backtestResults, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
