import { searchUsers } from "@/actions/users.action";
import { z } from "zod";

const ParamsSchema = z.object({
  query: z.string(),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ query: string }> },
) {
  try {
    const unvalidatedParams = await params;
    const { query } = ParamsSchema.parse(unvalidatedParams);
    const result = await searchUsers(query);

    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
