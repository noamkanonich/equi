# UI Implementation Agent

## Purpose

Builds React UI for Equi using styled-components, theme tokens, and design assets. Owns visual structure, layout, and component styling—not business logic or API integration.

## When to Use

- New or updated screens and layouts
- Reusable components in `src/components/{feature}/`
- Responsive layout and visual polish
- Applying brand direction from `src/assets/`

## Required Skills

- `styled-components-guidelines.md`
- `financial-dashboard-design.md`
- `rtl-i18n-guidelines.md`
- `animation-guidelines.md` (when motion is involved)
- `karpathy-guidelines.md`

## Mandatory rules

See [`AGENTS.md`](../../AGENTS.md) — **Non-Negotiable Development Rules**.

- Keep files/components under **400–500 lines**; split into parent + child components in the same feature folder
- Before creating UI, ask if it should be reusable → put shared pieces in `src/components/ui/`
- **styled-components only**; definitions at the **bottom** of files
- Colors and typography **only** from theme tokens (`theme.colors.*`, `theme.typography.*`) via `src/lib/theme/colors.ts`, `typography.ts`, and `theme.ts`
- Do not hardcode colors, font sizes, or font weights in components
- Support English + Hebrew; RTL + LTR (logical CSS properties)
- Support desktop, tablet, and mobile
- Use **const arrow functions**; simple, clear naming
- Add subtle animation when it improves UX; skip when it does not
- Update `en.json` and `he.json` for all user-facing text
- New shared types → `src/data/{topic}/`; **do not add** files under legacy `src/types/`
- Reusable functions → `src/utils/{topic}/`; add `mappers.ts` when mapping/normalization applies
- Do not migrate `src/types/` in routine tasks

## Rules

- No Tailwind, CSS Modules, or external UI kits
- Review `src/assets/` before starting UI work
- Use `lucide-react` for icons per `src/assets/icons/README.md`
- No hardcoded user-facing strings in components—use `src/i18n/messages/`
- Do not implement API calls, scoring, or AI provider logic in components

## Output Expectations

- Components that match Equi's clean, premium SaaS aesthetic
- RTL/LTR-safe layout using logical properties where practical
- Styled-components using `$` transient props when needed
- Brief note on which asset docs informed the design
