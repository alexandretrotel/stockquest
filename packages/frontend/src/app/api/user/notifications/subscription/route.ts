import { getSubscription } from "@/actions/push-notification.action";
import { ExtendedSession } from "@/lib/types";

export async function GET(req: Request) {
  const session: ExtendedSession = JSON.parse(
    req.headers.get("x-user-session") || "{}",
  ) as ExtendedSession;

  try {
    const subscription = await getSubscription(session.user.id);
    return Response.json({ subscription }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
