# Scoring Engine Guidelines

## Location

All scoring logic lives in `src/lib/scoring/`. Config weights and thresholds live in `src/config/scoring.config.ts`.

## Explainability

- Scores must be **explainable** — users should see why a score and suggested action exist
- Never hardcode scoring inside page or component files
- Return typed objects with category breakdowns when applicable

## Score Categories

| Category | Default weight |
|----------|----------------|
| Growth | 25% |
| Profitability | 20% |
| Valuation | 20% |
| Financial Health | 15% |
| Momentum | 10% |
| Analyst Sentiment | 10% |

## Suggested Actions (by total score)

| Score range | Suggested action |
|-------------|------------------|
| 85–100 | Buy More |
| 70–84 | Hold |
| 55–69 | Watch |
| 40–54 | Reduce |
| 0–39 | Avoid |

## Missing Data

- Missing data should **reduce confidence**, not automatically destroy the score
- Surface which categories lack data in explanations
- Do not pretend full confidence when inputs are incomplete

## Actions Are Not Orders

Frame outputs as analytical suggestions: "Suggested action: Hold" — not "You must hold."

## Structure

- `calculateStockScore.ts` — main score computation
- `getSuggestedAction.ts` — maps score to action
- `scoring.utils.ts` — helpers
- `scoring.types.ts` — types (may re-export from `src/types/scoring.ts`)
