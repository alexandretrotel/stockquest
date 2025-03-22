import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createMistral } from "@ai-sdk/mistral";
import { AIProvider } from "@/schemas/ai-provider.schema";

const stockQuestAI = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY!,
});

export const getModel = (provider: AIProvider, apiKey: string) => {
  const openAI = createOpenAI({ apiKey });
  const mistralAI = createMistral({ apiKey });

  let model = null;
  switch (provider) {
    case "openai":
      model = openAI("gpt-4o-mini");
      break;
    case "mistral":
      model = mistralAI("gpt-4o-mini");
      break;
    case "stockquestai":
      model = stockQuestAI("gemini-2.0-flash-001");
      break;
    default:
      throw new Error("Invalid provider");
  }

  return model;
};
