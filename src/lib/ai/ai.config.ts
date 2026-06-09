/**
 * AI configuration placeholder.
 * No API keys — real provider integration comes later.
 */

export const aiConfig = {
  enabled: false,
  defaultProvider: "mock" as const,
  providers: {
    mock: { enabled: true },
    openai: {
      enabled: false,
      defaultModel: "gpt-4o",
    },
    anthropic: {
      enabled: false,
      defaultModel: "claude-sonnet-4-20250514",
    },
  },
  maxTokens: 1024,
  temperature: 0.3,
} as const;

export type AiConfig = typeof aiConfig;
