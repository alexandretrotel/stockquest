import { getStockRecommendations } from "@/actions/stock.action";
import { z } from "zod";

const ParamsSchema = z.object({
  symbol: z.string().nonempty(),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ symbol: string }> },
) {
  try {
    const unvalidatedParams = await params;
    const { symbol } = ParamsSchema.parse(unvalidatedParams);
    const results = await getStockRecommendations(symbol);

    return Response.json(results, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
