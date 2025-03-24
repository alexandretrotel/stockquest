import { streamObject } from "ai";
import { STOCKQUEST_AI_SYSTEM_PORTFOLIO_BUILDING } from "@/data/stockquest-ai";
import { z } from "zod";
import { getModel } from "@/lib/ai";
import { AIPortfolioSchema } from "@/schemas/stockquest-ai.schema";

export const maxDuration = 60;

const BodySchema = z.string();

export async function POST(req: Request) {
  try {
    const unvalidatedBody = await req.json();
    const context = BodySchema.parse(unvalidatedBody);

    const result = streamObject({
      model: getModel("stockquestai", ""),
      schema: AIPortfolioSchema,
      system: STOCKQUEST_AI_SYSTEM_PORTFOLIO_BUILDING,
      prompt: `Create a portfolio according to the following contex: ${context}`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
