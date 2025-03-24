import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { UIMessage } from "ai";
import StockQuestAiPortfolioBuilder from "./stockquest-ai-portfolio-builder";
import { INITIAL_MESSAGE_STOCKQUEST_AI } from "@/data/stockquest-ai";
import { useAIProviderStore } from "@/stores/ai.store";
import { toast } from "sonner";
import { AIPortfolioSchema } from "@/schemas/stockquest-ai.schema";

interface StockQuestAIChatProps {
  input: string;
  setInput: (input: string) => void;
  handleSubmit: () => void;
  messages: UIMessage[];
  setMessages: (messages: UIMessage[]) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  status: "submitted" | "streaming" | "ready" | "error";
  stop: () => void;
}

export default function StockQuestAIChat({
  input,
  setInput,
  handleSubmit,
  messages,
  handleInputChange,
  setMessages,
  status,
  stop,
}: StockQuestAIChatProps) {
  const [isResetting, setIsResetting] = useState(false);

  const { aiProvider, apiKeys } = useAIProviderStore();
  const { object, submit } = useObject({
    api: "/api/stockquest-ai/portfolio-builder",
    schema: AIPortfolioSchema,
  });

  const resetChat = () => {
    setIsResetting(true);
    setInput("");
    setMessages([]);
    stop();

    setTimeout(() => {
      setIsResetting(false);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    if (aiProvider !== "stockquestai" && !apiKeys[aiProvider]) {
      toast.error("Please provide an API key for the selected provider.");
      return;
    }

    submit(input);
    handleSubmit();
    setInput("");
  };

  return (
    <>
      <div className="game-card p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="font-bold">StockQuest AI</h1>
            <p className="text-muted-foreground text-sm">
              Ask me anything about stocks, investments, or the market!
            </p>
          </div>

          <Button variant="outline" onClick={resetChat}>
            <RefreshCcw
              className={cn("h-4 w-4", isResetting && "animate-spin")}
            />
            Clear Chat
          </Button>
        </div>
      </div>

      <div className="game-card flex min-h-[550px] flex-col justify-between p-6">
        <div className="flex flex-col gap-4 overflow-y-auto">
          <div className="flex flex-col gap-2">
            <div className="bg-muted text-foreground w-fit max-w-[80%] rounded-lg p-2 px-3">
              <p className="text-xs">
                StockQuest AI •{" "}
                {new Date().toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </p>
              <p className="text-sm font-semibold">
                {INITIAL_MESSAGE_STOCKQUEST_AI}
              </p>
            </div>
          </div>

          {messages.length > 0 &&
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex flex-col gap-2",
                  message.role === "user" ? "items-end" : "items-start",
                )}
              >
                <div
                  className={cn(
                    "w-fit max-w-[80%] rounded-lg p-2 px-3",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  <p className="text-xs">
                    {message.role === "user" ? "You" : "StockQuest AI"} •{" "}
                    {new Date().toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </p>
                  <p className="text-sm font-semibold">{message.content}</p>
                </div>
              </div>
            ))}

          <StockQuestAiPortfolioBuilder object={object} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="mt-4 flex w-full items-center gap-4"
        >
          <Input
            type="text"
            placeholder="Ask about investment strategies or portfolio recommendations..."
            className="flex-1"
            value={input}
            onChange={handleInputChange}
          />

          {status === "streaming" ? (
            <Button type="button" onClick={stop}>
              Stop
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!input.trim() || status !== "ready"}
            >
              Send
            </Button>
          )}
        </form>
      </div>
    </>
  );
}
