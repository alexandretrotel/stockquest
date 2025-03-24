import { renamePortfolio } from "@/actions/portfolio.action";
import { ExtendedSession } from "@/lib/types";
import { z } from "zod";

const RenamePortfolioSchema = z.object({
  name: z.string().min(1, "Name must be at least 1 character"),
  portfolioId: z.string().uuid().nonempty(),
});

export async function POST(req: Request) {
  const session: ExtendedSession = JSON.parse(
    req.headers.get("x-user-session") || "{}",
  ) as ExtendedSession;

  try {
    const unvalidatedBody = await req.json();
    const { name, portfolioId } = RenamePortfolioSchema.parse(unvalidatedBody);
    await renamePortfolio(name, portfolioId, session.user.id);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
