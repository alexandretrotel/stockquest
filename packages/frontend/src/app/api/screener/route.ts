import { getScreeners } from "@/actions/stock.action";

export async function GET() {
  try {
    const result = await getScreeners();
    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
