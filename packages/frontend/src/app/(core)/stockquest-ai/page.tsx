"use client";

import Features from "@/features/stockquest-ai/components/features";
import StockQuestAIChat from "@/features/stockquest-ai/components/stockquest-ai-chat";
import Suggestions from "@/features/stockquest-ai/components/suggestions";
import Warning from "@/features/stockquest-ai/components/warning";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/game-badge";
import { useAIProviderStore } from "@/stores/ai.store";
import { useChat } from "@ai-sdk/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function StockQuestAiPage() {
  const { aiProvider, apiKeys } = useAIProviderStore();
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    setInput,
    status,
    stop,
  } = useChat({
    api: "/api/stockquest-ai/chat",
    body: {
      provider: aiProvider,
      apiKey: apiKeys[aiProvider],
    },
  });

  return (
    <>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">StockQuest AI</h1>
          <Badge color="blue" label="Beta" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="flex flex-col gap-4 md:col-span-2">
          <StockQuestAIChat
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            messages={messages}
            setInput={setInput}
            setMessages={setMessages}
            status={status}
            stop={stop}
          />
        </div>

        <div className="col-span-1 flex flex-col gap-4">
          <Suggestions setInput={setInput} />
          <Features />
          <Warning />
        </div>
      </div>
    </>
  );
}
