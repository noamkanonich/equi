# Claude Instructions for Equi

Read this file at the start of every task on this project.

Full rule details: [`AGENTS.md`](./AGENTS.md) — **Non-Negotiable Development Rules**.

## Before Coding

Before writing or changing any code, always check:

1. Did I read [`AGENTS.md`](./AGENTS.md)?
2. Did I read the relevant agent file under [`.agents/agents/`](./.agents/agents/)?
3. Did I read the relevant skill files under [`.agents/skills/`](./.agents/skills/)?
4. Is this UI reusable? (If yes → `src/components/ui/`)
5. Does this need animation?
6. Where should types live? (`src/data/{topic}/`)
7. Where should utilities live? (`src/utils/{topic}/`)
8. Which translation keys are needed? (update `en.json` and `he.json`)
9. How will this work in RTL and LTR?
10. How will this work on desktop, tablet, and mobile?
11. Which colors are needed from `src/lib/theme/colors.ts`?
12. Which typography presets are needed from `src/lib/theme/typography.ts`?

Also read [`.agents/manager/agents-manager.md`](./.agents/manager/agents-manager.md) for the leading agent and workflow.

For **UI-related tasks**, review [`src/assets/`](./src/assets/) — especially `brand/` and `prompts/design-brief.md`.

## After Coding

After implementation, always check:

1. Did I keep files under 400–500 lines?
2. Did I split large components?
3. Did I use simple, clear naming?
4. Did I use const arrow functions?
5. Did I move reusable UI to `src/components/ui/` (or shared folders)?
6. Did I move important functions to `src/utils/`?
7. Did I move shared types to `src/data/`?
8. Did I update all translations (`en.json` and `he.json`)?
9. Did I support RTL and LTR?
10. Did I support desktop, tablet, and mobile?
11. Did I add animation where useful?
12. Did I avoid unnecessary animation where not useful?
13. Did I use colors only from `src/lib/theme/colors.ts` (via theme)?
14. Did I use typography only from `src/lib/theme/typography.ts` (via theme)?
15. Did I polish the UI?
16. Did I avoid hardcoded text?
17. Did I avoid business logic inside UI?

See [`AGENTS.md`](./AGENTS.md) §14 for the full polish and self-review checklist.

## Implementation Constraints

- **styled-components only** — no Tailwind, CSS Modules, or external UI kits
- Place styled-components at the **bottom** of component files
- Keep components under **400–500 lines**
- Use **const arrow functions** for components and functions
- Use **mock data** before real financial or AI APIs
- Business logic stays out of UI components
- Scoring lives in `src/lib/scoring/`
- Financial data lives in `src/lib/financial-data/` — FMP calls are **server-side only** (`FMP_API_KEY` in `.env.local`, never `NEXT_PUBLIC_`); set `FINANCIAL_DATA_PROVIDER=fmp`; without a key, `GET /api/stocks/[symbol]` returns normalized mock fallbacks (expected)
- AI logic lives in `src/lib/ai/`
- Shared types live in `src/data/{topic}/` — do not add new files to legacy `src/types/`
- Utilities live in `src/utils/{topic}/`
- Translations live in `src/i18n/messages/` — support English and Hebrew with RTL/LTR
- Colors and typography from implemented `src/lib/theme/colors.ts` and `typography.ts` (composed in `theme.ts`; `AppTheme` typed via `styled.d.ts`)
- Do not remove existing files
- Do not change app routes unless the task requires it

## UI Tasks — Extra Steps

- Review `src/assets/brand/colors.md`, `typography.md`, `logo-directions.md`, and `product-voice.md`
- Follow `.agents/skills/financial-dashboard-design.md` and `styled-components-guidelines.md`
- For motion, follow `.agents/skills/animation-guidelines.md`
- For locales and RTL, follow `.agents/skills/rtl-i18n-guidelines.md`

## After Every Task

Provide a short summary that includes:

1. **What changed** — files added or updated
2. **Risks** — anything that could break or needs careful review
3. **Assumptions** — decisions made when the spec was ambiguous
4. **Not implemented** — what was intentionally left out (e.g. real APIs, auth, full UI)

Keep summaries concise and actionable.
