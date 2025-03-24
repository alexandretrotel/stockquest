import { getProfileData } from "@/actions/profile.action";
import { z } from "zod";

const ParamsSchema = z.object({
  username: z.string().nonempty(),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const unvalidatedParams = await params;
    const { username } = ParamsSchema.parse(unvalidatedParams);
    const profileData = await getProfileData(username);

    return Response.json(profileData, { status: 200 });
  } catch (error) {
    return Response.json(error, { status: 500 });
  }
}
