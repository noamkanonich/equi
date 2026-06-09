# AI Module

Future home for Equi's AI portfolio insights. **Mock-only today** — no real provider calls or API keys.

## Architecture (planned)

```
src/lib/ai/
├── ai.types.ts       # Insight types and input shapes
├── ai.config.ts      # Provider and model config (no secrets)
├── ai-provider.ts    # generateAiInsight() wrapper
├── prompts/          # Prompt builders (strings only)
└── mock/             # Typed mock insights for development
```

## Flow

1. UI or API calls `generateAiInsight(input)` with a typed `AiGenerateInput`
2. Provider selects prompt via `prompts/*.prompt.ts` (when real AI is enabled)
3. Response is parsed and validated (zod at boundary — future)
4. UI renders `AiInsight` with disclaimer and decision-support copy

## Safety

All financial AI output must use **decision-support language**:

- Suggested actions are labels (Buy More, Hold, Watch, Reduce, Avoid), not orders
- Include disclaimer, confidence, and data freshness when relevant
- See `AGENTS.md` and `.agents/skills/ai-output-guidelines.md`

## Mock-first

Use `mock/mock-ai-insights.ts` and `generateAiInsight()` until OpenAI/Anthropic integration is explicitly tasked. Set `aiConfig.enabled` when wiring real providers.

## Not implemented yet

- OpenAI / Anthropic SDK calls
- API routes for AI
- Streaming responses
- User-specific prompt memory
- zod validation of model JSON output
