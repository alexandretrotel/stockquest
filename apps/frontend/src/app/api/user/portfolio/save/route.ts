import { savePortfolio } from "@/actions/portfolio.action";
import { ExtendedSession } from "@/lib/types";
import { z } from "zod";
import {
  AllocationsSchema,
  PortfolioPerformanceSchema,
} from "@/schemas/portfolio.schema";

const SavePortfolioSchema = z.object({
  name: z.string().nonempty(),
  allocations: AllocationsSchema,
  performance: PortfolioPerformanceSchema.optional(),
});

export async function POST(req: Request) {
  const session: ExtendedSession = JSON.parse(
    req.headers.get("x-user-session") || "{}",
  ) as ExtendedSession;

  try {
    const unvalidatedBody = await req.json();
    const { name, allocations, performance } =
      SavePortfolioSchema.parse(unvalidatedBody);

    const portfolioId = await savePortfolio(
      name,
      allocations,
      session.user.id,
      performance,
    );

    return Response.json(portfolioId, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
