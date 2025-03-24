"use server";

import { db } from "@/db";
import { simulationLogs } from "@/db/schema";
import { SimulationLogsSchema } from "@/schemas/logs.schema";
import { eq } from "drizzle-orm";

export type SimulationLogs = Awaited<ReturnType<typeof getSimulationLogs>>;

/**
 * Retrieves all simulation logs for a user from the database.
 * Fetches logs recording the user’s past simulation activities.
 *
 * @param userId - The ID of the user whose simulation logs are being retrieved
 * @returns A promise resolving to an array of the user’s simulation logs
 */
export const getSimulationLogs = async (
  userId: string,
): Promise<SimulationLogsSchema> => {
  const backtestLogsData = await db
    .select()
    .from(simulationLogs)
    .where(eq(simulationLogs.userId, userId))
    .execute();

  return backtestLogsData;
};

/**
 * Records a new simulation log entry for a user in the database.
 * Adds a minimal log with the user’s ID to track simulation activity.
 *
 * @param userId - The ID of the user to record a simulation log for
 */
export const postSimulationLogs = async (userId: string) => {
  await db.insert(simulationLogs).values({ userId }).execute();
};
