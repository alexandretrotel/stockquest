import { getStocksChartQuotes } from "@/actions/stock.action";
import { STOCKQUEST_API_BEARER_TOKEN, STOCKQUEST_API_URL } from "@/data/env";
import { BACKTEST_YEARS } from "@/data/settings";
import { WeightsSchema } from "@/schemas/portfolio.schema";
import { z } from "zod";
import ky from "ky";

const BodySchema = z.object({
  symbols: z.array(z.string()),
});

const ResponseSchema = WeightsSchema;

const initialStartingDate = new Date();
initialStartingDate.setFullYear(
  initialStartingDate.getFullYear() - BACKTEST_YEARS,
);

export async function POST(req: Request) {
  try {
    const unvalidatedBody = await req.json();
    const { symbols } = BodySchema.parse(unvalidatedBody);

    if (symbols.length < 2) {
      const weights = { [symbols[0]]: 1 };
      return Response.json(weights);
    }

    const quotes = await getStocksChartQuotes(
      symbols,
      initialStartingDate,
      true,
    );

    const unvalidatedWeights = await ky
      .post(`${STOCKQUEST_API_URL}/optimize-weights`, {
        json: { quotes },
        headers: {
          Authorization: `Bearer ${STOCKQUEST_API_BEARER_TOKEN}`,
        },
      })
      .json();
    const weights = ResponseSchema.parse(unvalidatedWeights);

    return Response.json(weights);
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
