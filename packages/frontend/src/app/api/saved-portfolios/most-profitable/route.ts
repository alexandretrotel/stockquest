import { getMostProfitablePortfolios } from "@/actions/saved-portfolios.action";

export async function GET() {
  try {
    const mostProfitablePortfolios = await getMostProfitablePortfolios();
    return Response.json(mostProfitablePortfolios);
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
