import { ExtendedSession } from "@/lib/types";
import { unsavePortfolio } from "@/actions/portfolio.action";
import { z } from "zod";

const BodySchema = z.object({
  portfolioId: z.string().uuid().nonempty(),
});

export async function POST(req: Request) {
  const session: ExtendedSession = JSON.parse(
    req.headers.get("x-user-session") || "{}",
  ) as ExtendedSession;

  try {
    const unvalidatedBody = await req.json();
    const { portfolioId } = BodySchema.parse(unvalidatedBody);
    await unsavePortfolio(portfolioId, session.user.id);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
