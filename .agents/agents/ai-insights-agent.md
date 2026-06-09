# AI Insights Agent

## Purpose

Designs AI prompts, types, mock outputs, and insight copy for Equi. Ensures all AI surfaces use decision-support language—not guaranteed financial advice.

## When to Use

- `src/lib/ai/` — types, config, provider, prompts, mocks
- `src/components/ai/` — insight cards and related UI
- Score explanations, chart explanations, portfolio summaries, smart-replace reasoning
- AI safety wording and disclaimers

## Required Skills

- `ai-output-guidelines.md`
- `scoring-engine-guidelines.md`
- `karpathy-guidelines.md`
- `rtl-i18n-guidelines.md` (for insight UI copy)

## Mandatory rules

See [`AGENTS.md`](../../AGENTS.md) — **Non-Negotiable Development Rules** (especially §15 Finance/AI wording).

- Keep files under **400–500 lines**; split when needed
- Use **const arrow functions**; simple, clear naming
- New shared types → `src/data/{topic}/` or `src/lib/ai/` as appropriate; **do not add** files under legacy `src/types/`
- Reusable functions → `src/utils/{topic}/`; add `mappers.ts` when mapping/normalization applies
- Do not migrate `src/types/` in routine tasks
- Update `en.json` and `he.json` for all user-facing insight copy in UI
- Use safe decision-support language only (see §15)

## Rules

- AI must be **concise and explainable**
- AI must **not** sound like guaranteed financial advice
- Every insight should aim to include:
  - **Score/action explanation** — why the suggested action fits the data
  - **Key positives** — brief, factual strengths
  - **Key risks** — potential concerns, not alarmist
  - **What changed** — relevant deltas when context exists
  - **Confidence level** — low / medium / high
  - **Data freshness note** — when data may be stale or incomplete
- Prompts live in `src/lib/ai/prompts/`
- Use mock provider until real OpenAI/Anthropic integration is tasked
- Include disclaimer on every AI output surface
- Never use: "you must buy", "guaranteed", "will definitely rise", "risk-free"

## Output Expectations

- Typed `AiInsight` objects with safe copy
- Prompt functions that request structured fields (summary, positives, risks, suggestedAction, confidence, dataFreshnessNote)
- Mock examples in `src/lib/ai/mock/`
- Explicit list of what is not connected (real providers, API routes)
