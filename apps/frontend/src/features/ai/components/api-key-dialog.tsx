"use client";

import { useAIProviderStore } from "@/stores/ai.store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AIProvider, AIProviderEnumSchema } from "@/schemas/ai-provider.schema";
import { AI_PROVIDERS } from "@/data/ai";

interface AIProviderDialogProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

const AIProviderSchema = z.object({
  provider: AIProviderEnumSchema,
  apiKey: z.string().nonempty("Please enter your API key"),
});

type AIProviderFormData = z.infer<typeof AIProviderSchema>;

export default function APIKeyDialog({
  onOpenChange,
  open,
}: AIProviderDialogProps) {
  const { aiProvider, apiKeys, setApiKey, getProviderName, needsApiKey } =
    useAIProviderStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<AIProviderFormData>({
    resolver: zodResolver(AIProviderSchema),
    defaultValues: {
      apiKey: apiKeys[aiProvider],
      provider: aiProvider,
    },
  });

  const onSubmit = (data: AIProviderFormData) => {
    const { provider, apiKey } = data;
    setApiKey(provider, apiKey);
    onOpenChange(false);
  };

  const selectedProvider = watch("provider") ?? aiProvider;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configure AI Provider</DialogTitle>
          <DialogDescription>
            Set your API key for the selected AI provider.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="provider" className="text-right">
                Provider
              </Label>
              <Select
                value={selectedProvider}
                onValueChange={(value) =>
                  setValue("provider", value as AIProvider)
                }
                defaultValue={aiProvider}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>

                <SelectContent>
                  {AI_PROVIDERS.map((provider) => {
                    if (!provider.needsApiKey) return null;

                    return (
                      <SelectItem
                        key={provider.provider}
                        value={provider.provider}
                      >
                        {getProviderName(provider.provider)}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.provider && (
                <p className="text-sm text-red-500">
                  {errors.provider.message}
                </p>
              )}
            </div>

            {needsApiKey(aiProvider) && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="api-key" className="text-right">
                  API Key
                </Label>
                <Input
                  id="api-key"
                  type="password"
                  {...register("apiKey")}
                  placeholder="Enter your API key"
                />
                {errors.apiKey && (
                  <p className="text-sm text-red-500">
                    {errors.apiKey.message}
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
