import { getSimulationLogs } from "@/actions/user-logs.action";
import { ExtendedSession } from "@/lib/types";

export async function GET(req: Request) {
  const session: ExtendedSession = JSON.parse(
    req.headers.get("x-user-session") || "{}",
  ) as ExtendedSession;

  try {
    const backtestLogs = await getSimulationLogs(session.user.id);
    return Response.json(backtestLogs, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
