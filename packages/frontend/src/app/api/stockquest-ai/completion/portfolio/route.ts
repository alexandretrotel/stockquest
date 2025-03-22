import { STOCKQUEST_AI_SYSTEM } from "@/data/stockquest-ai";
import { z } from "zod";
import { getModel } from "@/lib/ai";
import { AIProviderEnumSchema } from "@/schemas/ai-provider.schema";
import { AllocationsSchema } from "@/schemas/portfolio.schema";
import { streamText } from "ai";

export const maxDuration = 60;

const BodySchema = z.object({
  allocations: AllocationsSchema,
  provider: AIProviderEnumSchema,
  apiKey: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const unvalidatedBody = await req.json();
    const { allocations, provider, apiKey } = BodySchema.parse(unvalidatedBody);

    const result = streamText({
      model: getModel(provider, apiKey ?? ""),
      system: STOCKQUEST_AI_SYSTEM,
      prompt: `Use the data provided to analyze the following portfolio ${JSON.stringify(allocations)}. Answer in a clear, concise, and structured manner. Format your response as a plain paragraph with no bullet points, lists or even markdown. Finally, max length of the response should be 500 characters. Please, tell me that it's not financial advice. Use simple language and avoid jargon. If using english, use B1 level.`,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
