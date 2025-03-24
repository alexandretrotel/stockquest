import { getSearchQuotes } from "@/actions/stock.action";
import { z } from "zod";

const ParamsSchema = z.object({
  query: z.string().nonempty(),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ query: string }> },
) {
  try {
    const unvalidatedParams = await params;
    const { query } = ParamsSchema.parse(unvalidatedParams);
    const result = await getSearchQuotes(query);

    return Response.json(result, { status: 200 });
  } catch (error) {
    return Response.json(error, { status: 500 });
  }
}
