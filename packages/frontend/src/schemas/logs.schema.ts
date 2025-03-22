import { z } from "zod";
import { DateSchema } from "./date.schema";

export const SimulationLogSchema = z.object({
  id: z.string(),
  userId: z.string(),
  createdAt: DateSchema,
});
export const SimulationLogsSchema = z.array(SimulationLogSchema);

export type SimulationLog = z.infer<typeof SimulationLogSchema>;
export type SimulationLogsSchema = z.infer<typeof SimulationLogsSchema>;
