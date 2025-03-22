import { z } from "zod";
import { DateSchema } from "./date.schema";

export const WeightSchema = z.union([
  z.number().min(0).max(1).nonnegative(),
  z.undefined().transform(() => 0),
]);
export const WeightsSchema = z.record(WeightSchema);

export const AllocationSchema = z.object({
  symbol: z.string(),
  weight: WeightSchema,
});
export const AllocationsSchema = z.array(AllocationSchema);

export const PortfolioPerformanceSchema = z.object({
  date: DateSchema,
  totalReturn: z.number(),
  sharpeRatio: z.number().min(0),
  maxDrawdown: z.number(),
  startDate: DateSchema,
  endDate: DateSchema,
  beatsSP500: z.boolean(),
});
export const SavedPortfolioSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  allocations: AllocationsSchema,
  performance: z.array(PortfolioPerformanceSchema).nullable(),
  createdAt: DateSchema,
  updatedAt: DateSchema,
});
export const SavedPortfoliosSchema = z.array(SavedPortfolioSchema);

export type PortfolioPerformance = z.infer<typeof PortfolioPerformanceSchema>;
export type SavedPortfolio = z.infer<typeof SavedPortfolioSchema>;
export type SavedPortfolios = z.infer<typeof SavedPortfoliosSchema>;
export type Allocation = z.infer<typeof AllocationSchema>;
export type Allocations = z.infer<typeof AllocationsSchema>;
export type Weights = z.infer<typeof WeightsSchema>;
