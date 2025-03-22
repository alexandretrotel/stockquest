import { z } from "zod";

export const CategoryIdSchema = z.enum(["beginner", "trading"]);

export const CategorySchema = z.object({
  id: CategoryIdSchema,
  name: z.string(),
  icon: z.any(),
});
export const CategoriesSchema = z.array(CategorySchema);

export const AchievementSlugSChema = z.enum([
  "first-steps",
  "stock-collector",
  "first-simulation",
  "market-beater",
]);

export const AchievementSchema = z.object({
  slug: AchievementSlugSChema,
  category: CategoryIdSchema,
  title: z.string(),
  description: z.string(),
  icon: z.any(),
  maxProgress: z.number().int().positive(),
  xpReward: z.number().int().positive(),
  locked: z.boolean().optional(),
  condition: z.function().args(z.any()).returns(z.boolean()),
});

export type CategoryId = z.infer<typeof CategoryIdSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Categories = Category[];
export type AchievementSlug = z.infer<typeof AchievementSlugSChema>;
export type Achievement = z.infer<typeof AchievementSchema>;
export type Achievements = Achievement[];
