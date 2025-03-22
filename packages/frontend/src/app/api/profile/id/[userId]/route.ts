import { getProfileUserDataFromUserId } from "@/actions/profile.action";
import { z } from "zod";

const ParamsSchema = z.object({
  userId: z.string().nonempty(),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const unvalidatedParams = await params;
    const { userId } = ParamsSchema.parse(unvalidatedParams);
    const profileData = await getProfileUserDataFromUserId(userId);

    return Response.json(profileData, { status: 200 });
  } catch (error) {
    return Response.json(error, { status: 500 });
  }
}
