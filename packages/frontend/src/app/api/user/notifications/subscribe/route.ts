import { ExtendedSession } from "@/lib/types";
import { subscribe } from "@/actions/push-notification.action";
import webpush from "web-push";
import { z } from "zod";

const BodySchema = z.object({
  subscription: z.custom<webpush.PushSubscription>((value) => {
    if (
      typeof value.endpoint === "string" &&
      typeof value.keys.auth === "string" &&
      typeof value.keys.p256dh === "string"
    ) {
      return value;
    }
    throw new Error("Invalid subscription object");
  }),
});

export async function POST(req: Request) {
  const session: ExtendedSession = JSON.parse(
    req.headers.get("x-user-session") || "{}",
  ) as ExtendedSession;

  try {
    const unvalidatedBody = await req.json();
    const body = BodySchema.parse(unvalidatedBody);

    const sub = body.subscription;
    const userId = session.user.id;

    await subscribe(userId, sub);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
