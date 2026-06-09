# AI Output Guidelines

## Language Rules

**Use:**

- "Suggested action"
- "Consider reviewing"
- "Based on current score"
- "Potential concern"
- "Worth monitoring"
- "This may indicate"
- "Insight" / "consideration"

**Avoid:**

- "You must buy" / "You must sell"
- "Guaranteed upside" / "Risk-free"
- "Will definitely rise" / "Definitely sell"
- Definitive market predictions

## Structure

Keep summaries **short and practical**. Aim to include:

- Summary (1–3 sentences)
- Key positives
- Key risks
- Suggested action (decision-support, tied to score when relevant)
- Confidence level (low / medium / high)
- Data freshness note when data may be stale or incomplete
- What changed (when context includes deltas)

## Facts vs Interpretation

- **Facts:** metrics, scores, dates, reported figures
- **Interpretation:** "may indicate", "worth monitoring", "based on current score"
- Never present interpretation as certainty

## Required Elements

- Disclaimer on every AI surface: informational only, not financial advice
- Reasoning or bullet lists where helpful for transparency
- Mention stale/missing data if relevant

## Prompts & Code

- Prompts live in `src/lib/ai/prompts/`
- Outputs must be typed (`AiInsight` in `src/lib/ai/ai.types.ts`)
- Validate provider responses at the boundary when real APIs are added
- Use mock data until integration is explicitly tasked

## UI

- `AiDisclaimer` on AI insight cards
- `AiReasoningList` or equivalent for step-by-step reasoning when shown

## Avoid Hype

No sensational language, no promises of returns, no urgency that pressures trading decisions.
