"use client";

import { AI_PROVIDERS } from "@/data/ai";
import { AIProvider } from "@/schemas/ai-provider.schema";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AIProviderStore {
  aiProvider: AIProvider;
  apiKeys: Record<AIProvider, string>;

  setAIProvider: (provider: AIProvider) => void;
  setApiKey: (provider: AIProvider, apiKey: string) => void;
  getProviderName: (provider: AIProvider) => string;
  needsApiKey: (provider: AIProvider) => boolean;
}

export const useAIProviderStore = create<AIProviderStore>()(
  persist(
    (set) => ({
      aiProvider: "stockquestai",
      apiKeys: {
        stockquestai: "",
        openai: "",
        mistral: "",
      },

      setAIProvider: (provider) => set({ aiProvider: provider }),
      setApiKey: (provider, apiKey) => {
        set((state) => ({
          apiKeys: {
            ...state.apiKeys,
            [provider]: apiKey,
          },
        }));
      },
      getProviderName: (provider) => {
        const aiProvider = AI_PROVIDERS.find((p) => p.provider === provider);
        return aiProvider?.name ?? "Select AI Provider";
      },
      needsApiKey: (provider) => {
        const aiProvider = AI_PROVIDERS.find((p) => p.provider === provider);
        return aiProvider?.needsApiKey ?? false;
      },
    }),
    {
      name: "ai-provider-store",
    },
  ),
);
