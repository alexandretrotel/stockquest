import { z } from "zod";

export const AIPortfolioSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  riskTolerance: z.enum(["low", "medium", "high"]),
  allocations: z
    .array(
      z.object({
        company: z.string().nonempty(),
        symbol: z.string().nonempty(),
        weight: z.number().min(0).max(1).nonnegative(),
      }),
    )
    .refine(
      (allocations) => {
        const totalWeight = allocations.reduce(
          (sum, allocation) => sum + allocation.weight,
          0,
        );
        return totalWeight === 1;
      },
      {
        message: "The total weight of all allocations must be equal to 100%",
      },
    ),
});

export type AIPortfolio = z.infer<typeof AIPortfolioSchema>;
