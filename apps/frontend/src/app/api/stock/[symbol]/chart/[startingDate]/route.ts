import { getStockChartQuotes } from "@/actions/stock.action";
import { z } from "zod";

const ParamsSchema = z.object({
  symbol: z.string().nonempty(),
  startingDate: z.string().nonempty(),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ symbol: string; startingDate: string }> },
) {
  try {
    const unvalidatedParams = await params;
    const { symbol, startingDate } = ParamsSchema.parse(unvalidatedParams);
    const result = await getStockChartQuotes(symbol, new Date(startingDate));

    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
