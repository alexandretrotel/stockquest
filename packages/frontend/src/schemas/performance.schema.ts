import { z } from "zod";
import { DateSchema } from "./date.schema";

export const PerformanceResultSchema = z.object({
  portfolio: z.object({
    sharpeRatio: z.number().min(0),
    totalReturn: z.number(),
    maxDrawdown: z.number(),
    values: z.array(
      z.object({
        date: DateSchema,
        value: z.number(),
      }),
    ),
    returns: z.array(
      z.object({
        date: DateSchema,
        value: z.number(),
      }),
    ),
  }),
  benchmark: z.object({
    sharpeRatio: z.number().min(0),
    totalReturn: z.number(),
    maxDrawdown: z.number(),
    values: z.array(
      z.object({
        date: DateSchema,
        value: z.number(),
      }),
    ),
    returns: z.array(
      z.object({
        date: DateSchema,
        value: z.number(),
      }),
    ),
  }),
  returnsDifference: z.array(
    z.object({
      date: DateSchema,
      value: z.number(),
    }),
  ),
  beatsBenchmark: z.boolean(),
  startingDate: DateSchema,
  endingDate: DateSchema,
});

export type PerformanceResult = z.infer<typeof PerformanceResultSchema>;
