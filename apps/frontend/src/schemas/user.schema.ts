import { z } from "zod";
import { DateSchema } from "./date.schema";

export const UserDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  username: z.string().nullable(),
  displayUsername: z.string().nullable(),
  role: z.string(),
  banned: z.boolean(),
  banReason: z.string().nullable(),
  banExpires: DateSchema.nullable(),
  isAnonymous: z.boolean().nullable(),
  createdAt: DateSchema,
  updatedAt: DateSchema,
});

export type UserData = z.infer<typeof UserDataSchema>;
