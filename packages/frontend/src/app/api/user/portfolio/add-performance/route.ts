import { ExtendedSession } from "@/lib/types";
import { PerformanceResultSchema } from "@/schemas/performance.schema";
import { setBeatsSP500 } from "@/actions/portfolio.action";
import { z } from "zod";

const BodySchema = z.object({
  backtestResult: PerformanceResultSchema,
  id: z.string().nonempty(),
});

export async function POST(req: Request) {
  const session: ExtendedSession = JSON.parse(
    req.headers.get("x-user-session") || "{}",
  ) as ExtendedSession;

  try {
    const unvalidatedBody = await req.json();
    const { backtestResult, id: portfolioId } =
      BodySchema.parse(unvalidatedBody);

    const userId = session.user.id;
    await setBeatsSP500(portfolioId, userId, backtestResult);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
