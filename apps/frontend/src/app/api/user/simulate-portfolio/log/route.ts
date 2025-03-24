import { postSimulationLogs } from "@/actions/user-logs.action";
import { ExtendedSession } from "@/lib/types";

export async function POST(req: Request) {
  const session: ExtendedSession = JSON.parse(
    req.headers.get("x-user-session") || "{}",
  ) as ExtendedSession;

  try {
    await postSimulationLogs(session.user.id);
    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
