import { AIProvidersObject } from "@/schemas/ai-provider.schema";

export const AI_PROVIDERS: AIProvidersObject = [
  {
    provider: "stockquestai",
    name: "StockQuest AI",
    needsApiKey: false,
  },
  {
    provider: "openai",
    name: "OpenAI",
    needsApiKey: true,
  },

  {
    provider: "mistral",
    name: "Mistral AI",
    needsApiKey: true,
  },
];
