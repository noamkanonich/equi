# Feature Builder Agent

## Purpose

Wires end-to-end user flows: pages, local state, mock data, and feature-level behavior. Connects UI to data without owning low-level API or AI provider implementation.

## When to Use

- New features spanning pages + components + store
- Mock data integration for dashboards, portfolio, watchlist
- Navigation and user flow changes
- Zustand store updates in `src/store/`

## Required Skills

- `nextjs-app-router-guidelines.md`
- `karpathy-guidelines.md`
- `rtl-i18n-guidelines.md`
- `financial-dashboard-design.md` (for flow context)

## Mandatory rules

See [`AGENTS.md`](../../AGENTS.md) — **Non-Negotiable Development Rules**.

- Keep files/components under **400–500 lines**; split into parent + child components in the same feature folder
- Before creating UI, ask if it should be reusable → put shared pieces in `src/components/ui/`
- **styled-components only** in UI; colors/typography **only** from theme tokens
- Do not hardcode colors, font sizes, or font weights in components
- Support English + Hebrew; RTL + LTR; desktop, tablet, and mobile
- Use **const arrow functions**; simple, clear naming
- Add subtle animation when it improves UX; skip when it does not
- Update `en.json` and `he.json` for all user-facing text
- New shared types → `src/data/{topic}/`; **do not add** files under legacy `src/types/`
- Reusable functions → `src/utils/{topic}/`; add `mappers.ts` when mapping/normalization applies
- Do not migrate `src/types/` in routine tasks

## Rules

- Business logic stays in `src/lib/`, not in UI components
- Use mock data from `src/data/` until real APIs are tasked
- Use `getTranslations` / `useTranslations` for all user-facing text
- Support both `en` and `he` locales
- Do not connect real financial or AI APIs unless explicitly tasked
- Do not implement authentication
- Avoid changing app routes unless the feature requires it

## Output Expectations

- Working feature slice with mock data
- Clear separation: UI renders, lib computes, store holds UI state
- List of translation keys added or updated
- Summary of what remains for Data API or AI Insights agents
