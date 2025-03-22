import { Button } from "@/components/ui/button";
import { DEFAULT_PROMPTS } from "@/data/stockquest-ai";

interface SuggestionsProps {
  setInput: (input: string) => void;
}

export default function Suggestions({ setInput }: SuggestionsProps) {
  return (
    <div className="game-card flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Try Asking About...</h1>

      <div className="flex flex-col gap-2">
        {DEFAULT_PROMPTS.map((prompt, index) => (
          <Button
            key={index}
            variant="ghost"
            size="lg"
            onClick={() => setInput(prompt)}
            className="flex justify-start text-left whitespace-normal"
          >
            - {prompt}
          </Button>
        ))}
      </div>
    </div>
  );
}
