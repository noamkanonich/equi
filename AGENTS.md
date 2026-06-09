# Equi — Agent Guidelines

## Project Overview

Equi is a personal AI portfolio copilot built with Next.js App Router, TypeScript, and styled-components. It helps users track investments, analyze stocks, calculate explainable scores, understand what changed, surface risks, and receive simple suggested actions.

## Product Goal

Equi is a personal AI portfolio copilot. It does **not** trade for the user and does **not** provide guaranteed financial advice. It helps the user make better decisions by:

- Organizing portfolio data
- Calculating explainable scores
- Highlighting changes
- Surfacing risks
- Suggesting actions in decision-support language

### Suggested Action Labels

- **Buy More**
- **Hold**
- **Watch**
- **Reduce**
- **Avoid**

## Tech Stack

- Next.js App Router (TypeScript)
- styled-components (only styling solution)
- Framer Motion, Recharts, TanStack Table
- next-intl (English + Hebrew, RTL/LTR)
- date-fns, axios, zod, zustand, lucide-react
- Supabase — planned, not yet integrated
- Financial APIs — planned, use mock data first
- AI providers (OpenAI/Anthropic) — planned, use mock data first

# Non-Negotiable Development Rules

These rules are mandatory for every future task.

See [`CLAUDE.md`](./CLAUDE.md) for the required **Before Coding** and **After Coding** checklists.

## 1. Multi-language, LTR and RTL support

Equi must support multiple languages from the beginning.

**Mandatory:**

- Support English and Hebrew from the start.
- Support both LTR and RTL layouts from the start.
- Every new UI must be checked in both LTR and RTL.
- Every user-facing text must use the translation system.
- Never hardcode user-facing strings inside components.
- Every new feature must update all translation files without exception.
- Avoid hardcoded left/right styling.
- Prefer logical CSS properties:
  - `margin-inline-start`
  - `margin-inline-end`
  - `padding-inline-start`
  - `padding-inline-end`
  - `inset-inline-start`
  - `inset-inline-end`
  - `border-inline-start`
  - `border-inline-end`
- Use start/end naming where relevant instead of left/right.
- Icons, arrows, cards, sidebars, tables, dropdowns, modals, tabs, and charts must be RTL-aware.

## 2. File size and component splitting

**Mandatory:**

- Every file/component should stay simple and readable.
- If a file or component grows beyond **400–500 lines**, split it.
- Split large UI into a parent component and child components.
- Child components should live under the same feature folder unless they are reusable globally.
- Do not keep huge files.
- Do not solve complexity with unclear abstractions.
- Prefer small, focused components with clear names.

**Example:** If `PortfolioDashboard.tsx` becomes too large, split into:

```
src/components/portfolio/
  PortfolioDashboard.tsx
  PortfolioHeader.tsx
  PortfolioMetrics.tsx
  PortfolioHoldingsTable.tsx
  PortfolioInsightsPanel.tsx
```

## 3. Reusable component thinking

Before creating any new UI, Claude must internally ask:

> "Will this be reused somewhere else?"

**If yes:**

- Build it as a reusable generic component.
- Put it under `src/components/ui` or another relevant shared components folder.
- Keep it generic.
- Use clean typed props.
- Do not couple it to a single feature.
- Do not put business logic inside reusable components.

**Examples of reusable components:** Button, Card, Badge, ScoreBadge, Tabs, Modal, EmptyState, LoadingState, SectionHeader, MetricCard, DataTable, SearchInput, FilterChip, TrendIndicator, ChartCard, AiInsightCard.

**If the component is feature-specific:** Put it under the relevant feature folder.

## 4. Animation thinking

Every new feature must consider animation.

**Mandatory:**

- For every new UI/feature, Claude must think whether animation improves the experience.
- If animation is useful, add a subtle, appropriate animation.
- If animation is not useful, do not add it.
- Animations should clarify changes, guide attention, or make the app feel polished.
- Do not add noisy animations.
- Do not over-animate financial dashboards.
- Prefer subtle transitions, hover states, entrance animations, loading states, score changes, tab transitions, and chart animations.
- Use Framer Motion where appropriate.
- Respect performance on desktop, tablet, and mobile.

## 5. Simplicity and code quality

**Mandatory:**

- Code must always be simple, clean, readable, and efficient.
- Prefer direct readable solutions over clever code.
- Avoid over-engineering.
- Avoid unnecessary abstractions.
- Avoid unnecessary dependencies.
- Keep data flow obvious.
- Keep business logic outside UI components.
- Avoid duplicated logic.
- Use TypeScript properly.
- Keep props clear and typed.
- Keep components focused.
- Make the smallest clean implementation that solves the task.

## 6. Naming rules

Naming must be clear, simple, and natural.

**Mandatory:**

- Use everyday language.
- Names should not be too short and not too long.
- **Avoid vague names:** `data`, `item`, `temp`, `stuff`, `helper`, `thing`.
- **Prefer clear names:** `portfolioHoldings`, `selectedStock`, `calculatedScore`, `suggestedAction`, `formattedPrice`, `stockMetrics`, `chartData`.
- **Components:** `PortfolioSummary`, `HoldingsTable`, `StockScoreCard`, `SmartReplaceCard`, `ChartInsightCard`.

## 7. Function style

Always use const arrow functions.

**Mandatory:**

- Use `const` arrow functions for functions and components.
- Do not use function declarations unless there is a very strong technical reason.

**Preferred:**

```ts
const calculateStockScore = () => { ... };
const PortfolioSummary = () => { ... };
```

**Avoid:**

```ts
function calculateStockScore() { ... }
function PortfolioSummary() { ... }
```

## 8. Utils structure

Whenever Claude creates important reusable functions, they must live under the utils structure when appropriate.

**Mandatory:**

- Important reusable functions should be placed under `src/utils`.
- `src/utils` should be organized by topic.
- If the topic folder does not exist, create it.
- Every utils topic folder should include a `mappers.ts` file when mapping/normalization is relevant.
- Before creating a new util, check if an existing one can be reused.
- Keep utility functions small and typed.
- Do not hide business logic inside UI components.
- Do not duplicate utilities.

**Recommended structure:**

```
src/utils/
  formatting/
    formatCurrency.ts
    formatPercent.ts
    mappers.ts
  dates/
    formatDate.ts
    getRelativeDate.ts
    mappers.ts
  stocks/
    normalizeStock.ts
    normalizeHolding.ts
    mappers.ts
  scoring/
    calculateStockScore.ts
    getSuggestedAction.ts
    mappers.ts
  charts/
    buildChartData.ts
    mappers.ts
  api/
    apiClient.ts
    handleApiError.ts
    mappers.ts
```

## 9. Types and interfaces structure

Whenever Claude creates a new interface or type, it must be placed under `src/data`.

**Mandatory:**

- Do not define important shared types inside components.
- Shared types/interfaces belong under `src/data`.
- Organize types by topic.
- If the topic folder does not exist, create it.
- Use `type` by default unless `interface` is clearly better.
- Keep type names clear.
- Reuse existing types before creating new ones.
- Avoid duplicate types across folders.
- Feature-specific types may stay near the feature only if they are truly local and not reused.
- **Legacy:** `src/types/` exists for older code — do **not** add new files there; use `src/data/{topic}/` for all new shared types.

**Recommended structure:**

```
src/data/
  portfolio/
    portfolio.types.ts
    portfolio.mock.ts
    mappers.ts
  stocks/
    stock.types.ts
    stock.mock.ts
    mappers.ts
  scoring/
    scoring.types.ts
    scoring.mock.ts
    mappers.ts
  ai/
    ai.types.ts
    ai.mock.ts
    mappers.ts
  charts/
    chart.types.ts
    chart.mock.ts
    mappers.ts
```

## 10. Theme structure: colors and typography

The theme folder is mandatory and must be the single source of truth for app colors and typography.

**Mandatory files (implemented):**

- `src/lib/theme/colors.ts` — single source of truth for all app colors
- `src/lib/theme/typography.ts` — single source of truth for fonts, sizes, weights, line heights, presets
- `src/lib/theme/theme.ts` — composes `colors` + `typography`; exports `AppTheme`
- `src/lib/theme/GlobalStyles.ts` — global resets using theme tokens only
- `src/lib/theme/styled.d.ts` — `DefaultTheme` extends `AppTheme` for styled-components typing

**Mandatory rules:**

- All app colors must come from `colors.ts`.
- All font families, font sizes, font weights, line heights, and typography presets must come from `typography.ts`.
- Do not hardcode colors inside components.
- Do not hardcode font sizes or font weights inside components unless there is a rare, justified reason.
- Do not use random hex values directly in UI files.
- Do not define one-off typography styles inside components when a shared typography token should exist.
- If a new color is needed, add it to `colors.ts` with a clear semantic name.
- If a new typography style is needed, add it to `typography.ts` with a clear semantic name.
- Components must import colors/typography through the theme system, not redefine them locally.
- Keep color names semantic, not visual-only when possible.

**Good semantic color names:** `appBackground`, `cardBackground`, `primary`, `primarySoft`, `textPrimary`, `textSecondary`, `border`, `positive`, `positiveSoft`, `negative`, `negativeSoft`, `warning`, `warningSoft`.

**Avoid unclear names:** `blue1`, `blue2`, `randomGray`, `niceGreen`, `tempColor`.

**Token usage in components:** import via `ThemeProvider` — `${({ theme }) => theme.colors.text.primary}`, `${({ theme }) => theme.typography.preset.body}`. Add new tokens in `colors.ts` or `typography.ts` first; do not hardcode in components.

## 11. Translation updates

Every new feature that includes text must update translations.

**Mandatory:**

- Every user-facing text must be added to all translation files.
- Do not hardcode text in components.
- Update English and Hebrew translations every time.
- Translation keys should be clear and grouped by feature.

**Example (`src/i18n/messages/en.json`):**

```json
{
  "portfolio": {
    "title": "Portfolio",
    "subtitle": "Track your holdings and suggested actions",
    "metrics": {
      "totalValue": "Total Value",
      "dailyChange": "Daily Change"
    }
  }
}
```

Hebrew translation must also be updated in `src/i18n/messages/he.json` at the same time.

## 12. RTL/LTR verification

Every new feature must be verified for both directions.

**Mandatory:**

- Check layout in LTR.
- Check layout in RTL.
- Avoid breaking table alignment.
- Avoid left/right assumptions.
- Ensure icons and arrows make sense in RTL.
- Ensure spacing works in both directions.
- Ensure modals, drawers, sidebar, tabs, dropdowns, charts, and tables behave correctly.

## 13. Responsive design

Every new feature must support desktop, tablet, and mobile.

**Mandatory:**

- No desktop-only UI unless explicitly requested.
- Every new screen/component must include responsive behavior.
- Tables must handle smaller screens gracefully.
- Cards should stack properly.
- Sidebars should collapse or adapt.
- Charts should remain readable.
- Modals should fit mobile screens.
- Avoid fixed widths that break mobile.
- Use flexible layout, grid, wrapping, and responsive breakpoints.

## 14. Polish and self-review

After every new feature, Claude must review what it created.

**Mandatory final checklist after implementation:**

- Is the code simple and readable?
- Is the component under 400–500 lines?
- Should anything be split?
- Is anything reusable and should be moved to shared components?
- Are all texts translated?
- Does it support RTL and LTR?
- Does it support desktop, tablet, and mobile?
- Are animations appropriate and not excessive?
- Are all colors imported from the theme system?
- Are all typography values imported from the theme system?
- Are types placed under `src/data`?
- Are utilities placed under `src/utils`?
- Is business logic outside UI?
- Are names clear?
- Are there loading/empty/error states if relevant?
- Is the UI polished enough?
- Are there obvious bugs or inconsistencies?

Claude must perform small polish improvements after implementation, not just write the first version.

## 15. Finance/AI wording

Equi is a decision-support product, not a licensed financial advisor.

**Mandatory:**

- Use safe wording.
- Do not write guaranteed financial advice.
- Suggested actions must be explainable.
- AI output must mention risks and confidence where relevant.

**Use:** Suggested action, Consider reviewing, Based on current score, Potential concern, Worth monitoring, This may indicate.

**Avoid:** You must buy, Guaranteed upside, Definitely sell, Risk-free, This stock will definitely rise.

Additional safety rules:

- Always surface disclaimers for AI-generated content.
- Scores and actions are analytical helpers, not buy/sell orders.
- Separate facts from interpretation in AI outputs.
- Mention stale or missing data when relevant.

## Folder Ownership

| Area | Path |
|------|------|
| App routes & API | `src/app/` |
| Feature UI | `src/components/{feature}/` |
| Reusable UI | `src/components/ui/` |
| Financial data | `src/lib/financial-data/` |
| Scoring engine | `src/lib/scoring/` |
| AI logic & prompts | `src/lib/ai/` |
| Theme (SSOT) | `src/lib/theme/` (`colors.ts`, `typography.ts`, `theme.ts`, `GlobalStyles.ts`) |
| Translations | `src/i18n/messages/` (`en.json`, `he.json`) |
| Types, mocks, mappers | `src/data/{topic}/` |
| Utils | `src/utils/{topic}/` |
| Config | `src/config/` |
| State | `src/store/` |
| Design assets | `src/assets/` |
| Agent orchestration | `.agents/` |
| Legacy types (do not add) | `src/types/` |

## Coding Rules (summary)

See **Non-Negotiable Rules** above. In short:

- TypeScript everywhere; `const` arrow functions for components and functions.
- Business logic outside UI components; mock data before real APIs.
- Components stay under **400–500 lines**; split in the feature folder.
- Scoring in `src/lib/scoring/`; financial data in `src/lib/financial-data/`; AI in `src/lib/ai/`.
- Shared types in `src/data/`; utilities in `src/utils/`.
- Use `@/` path alias pointing to `src/`.

## Styling Rules (summary)

See **§10** and `.agents/skills/styled-components-guidelines.md`. In short:

- **styled-components only** — no Tailwind, CSS Modules, or external UI kits.
- Styled-components at the **bottom** of component files.
- Colors and typography from `src/lib/theme/` — no random hex or font sizes in components.
- Transient props with `$` prefix; logical CSS properties for RTL/LTR.
- Review `src/assets/` before UI implementation.

## i18n / RTL Rules (summary)

See **§1, §11, §12** and `.agents/skills/rtl-i18n-guidelines.md`.

## What Claude Must Never Do Without Explicit Instruction

- Add Tailwind, CSS Modules, or external UI kits
- Connect real financial APIs (FMP, Finnhub, etc.)
- Connect OpenAI, Anthropic, or other AI providers
- Add API keys or environment secrets to the codebase
- Implement authentication or Supabase auth flows
- Remove or rename existing files without approval
- Change existing app routes unless necessary for the task
- Build full dashboard UI when only infrastructure is requested
- Use advisory language that sounds like guaranteed financial advice
- Hardcode user-facing strings in components (use i18n)
- Add new shared types under legacy `src/types/`
- Promise returns, certainty, or risk-free outcomes

## Before Starting Any Task

1. Read this file (`AGENTS.md`) — especially **Non-Negotiable Development Rules**
2. Read [`CLAUDE.md`](./CLAUDE.md) — complete the **Before Coding** checklist
3. Read `.agents/manager/agents-manager.md`
4. Read relevant skills under `.agents/skills/`
5. For UI work, review `src/assets/` (especially `brand/` and `prompts/design-brief.md`)
6. Decide: reusable component vs feature-specific; animation need; types/utils/theme/translation keys; RTL/LTR and responsive behavior
