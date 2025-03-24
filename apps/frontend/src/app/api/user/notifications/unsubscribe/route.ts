import { unsubscribe } from "@/actions/push-notification.action";
import { ExtendedSession } from "@/lib/types";

export async function DELETE(req: Request) {
  const session: ExtendedSession = JSON.parse(
    req.headers.get("x-user-session") || "{}",
  ) as ExtendedSession;

  try {
    const userId = session.user.id;
    await unsubscribe(userId);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
