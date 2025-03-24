import { z } from "zod";
import { SavedPortfoliosSchema } from "./portfolio.schema";
import { DateSchema } from "./date.schema";

export const ProfileUserDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().nullable(),
  username: z.string().nullable(),
  displayUsername: z.string().nullable(),
  role: z.string(),
  banned: z.boolean(),
  banReason: z.string().nullable(),
  banExpires: DateSchema.nullable(),
  createdAt: DateSchema,
  updatedAt: DateSchema,
});

export const ProfileDataSchema = z.object({
  profile: ProfileUserDataSchema,
  savedPortfolios: SavedPortfoliosSchema,
  numberOfSavedPortfolios: z.number(),
  numberOfStocks: z.number(),
  xp: z.number(),
});

export type ProfileUserData = z.infer<typeof ProfileUserDataSchema>;
export type ProfileData = z.infer<typeof ProfileDataSchema>;
