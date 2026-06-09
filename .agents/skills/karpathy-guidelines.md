# Karpathy Guidelines

Code clarity principles for Equi — inspired by simple, direct engineering.

See [`AGENTS.md`](../../AGENTS.md) — **Non-Negotiable Development Rules** (especially §5–§9).

## Principles

- **Keep code simple** — prefer the straightforward solution over clever abstractions
- **Readability first** — code should explain itself; comments only for non-obvious business logic
- **Build small working increments** — ship a thin slice, then extend
- **Refactor only when useful** — don't refactor speculatively
- **Make state and data flow obvious** — trace inputs to outputs without hidden magic
- **Use clear names** — `calculateStockScore` not `calc`; `portfolioHoldings` not `data`
- **Types at boundaries** — validate external data with zod; trust internal types
- **Minimal abstraction** — don't create helpers for one or two uses

## Function style

- Use **`const` arrow functions** for functions and components
- Do not use `function` declarations unless there is a very strong technical reason

```ts
// Preferred
const calculateStockScore = () => { ... };
const PortfolioSummary = () => { ... };

// Avoid
function calculateStockScore() { ... }
function PortfolioSummary() { ... }
```

## Naming

- Use everyday language; not too short, not too long
- **Avoid:** `data`, `item`, `temp`, `stuff`, `helper`, `thing`
- **Prefer:** `portfolioHoldings`, `selectedStock`, `calculatedScore`, `suggestedAction`, `formattedPrice`, `stockMetrics`, `chartData`
- **Components:** `PortfolioSummary`, `HoldingsTable`, `StockScoreCard`, `SmartReplaceCard`, `ChartInsightCard`

## File size and splitting

- If a file or component grows beyond **400–500 lines**, split it
- Split into a parent + child components under the same feature folder
- Do not solve complexity with unclear abstractions

## Utils (`src/utils/`)

- Important reusable functions belong under `src/utils/{topic}/`
- Include `mappers.ts` when mapping/normalization is relevant
- Check for existing utils before creating new ones
- Keep functions small, typed; no business logic hidden in UI

## Types (`src/data/`)

- Shared types belong under `src/data/{topic}/*.types.ts`
- Do not define important shared types inside components
- Use `type` by default unless `interface` is clearly better
- **Legacy:** `src/types/` exists — do not add new files there

## Avoid

- Premature generalization
- Deep inheritance hierarchies
- Magic numbers without config reference
- Over-engineered error handling for impossible cases
- Clever one-liners that sacrifice clarity
- Duplicated logic across components or utils

## When in Doubt

Choose the change that is easier to read, easier to test, and easier to delete later.
