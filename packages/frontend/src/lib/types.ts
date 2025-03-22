import { auth } from "./auth-server";

export type ExtendedSession = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>;
