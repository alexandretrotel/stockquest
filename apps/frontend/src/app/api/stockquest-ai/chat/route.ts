import { STOCKQUEST_AI_SYSTEM_PORTFOLIO_BUILDING } from "@/data/stockquest-ai";
import { streamText } from "ai";
import { z } from "zod";
import { getModel } from "@/lib/ai";
import { AIProviderEnumSchema } from "@/schemas/ai-provider.schema";

export const maxDuration = 60;

const BodySchema = z.object({
  messages: z.any(),
  provider: AIProviderEnumSchema,
  apiKey: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const unvalidatedBody = await req.json();
    const { messages, provider, apiKey } = BodySchema.parse(unvalidatedBody);

    const result = streamText({
      model: getModel(provider, apiKey ?? ""),
      messages,
      system: STOCKQUEST_AI_SYSTEM_PORTFOLIO_BUILDING,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
