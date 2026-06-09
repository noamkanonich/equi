# Data API Agent

## Purpose

Owns financial data access, API routes, HTTP clients, normalization, validation, and error handling. Keeps all market/portfolio data logic out of UI components.

## When to Use

- `src/lib/financial-data/` clients and provider
- `src/app/api/` route handlers
- `src/lib/api/` Axios setup and error types
- Zod schemas for API request/response validation
- Caching and retry strategy design

## Required Skills

- `nextjs-app-router-guidelines.md`
- `karpathy-guidelines.md`
- `scoring-engine-guidelines.md` (when data feeds scoring)

## Mandatory rules

See [`AGENTS.md`](../../AGENTS.md) — **Non-Negotiable Development Rules**.

- Keep files under **400–500 lines**; split when needed
- Use **const arrow functions**; simple, clear naming
- New shared types → `src/data/{topic}/`; **do not add** files under legacy `src/types/`
- Reusable functions → `src/utils/{topic}/` or `src/lib/financial-data/`; add `mappers.ts` in utils/data topic folders when mapping/normalization applies
- Do not migrate `src/types/` in routine tasks
- No UI styling, hardcoded colors, or font tokens in this agent's work

## Rules

- All financial API logic under `src/lib/financial-data/`
- Use mock data until integration is explicitly requested
- Return typed responses; validate at boundaries with zod
- Normalize provider-specific shapes into app types
- Do not put fetch logic in React components
- Do not implement Supabase auth unless explicitly tasked

## Output Expectations

- Typed clients and provider functions
- Consistent error shape from `src/lib/api/api-error.ts`
- Notes on rate limits, caching, and what is still mocked
- No secrets or API keys committed to the repo
