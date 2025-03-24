import { ExtendedSession } from "@/lib/types";
import { getSavedPortfolios } from "@/actions/saved-portfolios.action";

export async function GET(req: Request) {
  const session: ExtendedSession = JSON.parse(
    req.headers.get("x-user-session") || "{}",
  ) as ExtendedSession;

  try {
    const savedPortfoliosData = await getSavedPortfolios(session.user.id);
    return Response.json(savedPortfoliosData, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
