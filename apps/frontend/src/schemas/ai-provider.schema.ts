import { z } from "zod";

export const AIProviderEnumSchema = z.enum([
  "stockquestai",
  "openai",
  "mistral",
]);

export const AIProviderObjectSchema = z.object({
  provider: AIProviderEnumSchema,
  name: z.string(),
  needsApiKey: z.boolean(),
});

export const AIProvidersObjectSchema = z.array(AIProviderObjectSchema);

export type AIProvidersObject = z.infer<typeof AIProvidersObjectSchema>;
export type AIProviderObject = z.infer<typeof AIProviderObjectSchema>;
export type AIProvider = z.infer<typeof AIProviderEnumSchema>;
