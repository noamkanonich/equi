# Financial Dashboard Design

Visual direction for Equi UI.

See [`AGENTS.md`](../../AGENTS.md) — **Non-Negotiable Development Rules** (especially §10, §13).

## Theme as single source of truth

The app visual identity must be driven by:

- `src/lib/theme/colors.ts` — all colors
- `src/lib/theme/typography.ts` — all font families, sizes, weights, line heights, presets
- Composed in `src/lib/theme/theme.ts` for styled-components

**Do not** use ad-hoc hex values or font sizes in screen or component files.

## Color tokens

- **Charts:** use `colors.chart.*` tokens (blue, green, red, amber, purple)
- **Score badges and status:** use `colors.status.*` semantic tokens (positive, negative, warning and soft variants)
- **Surfaces:** `colors.background.app`, `colors.background.card`
- **Text:** `colors.text.primary`, `colors.text.secondary`, `colors.text.muted`
- **Brand actions:** `colors.brand.primary`, `colors.brand.primarySoft`

## Typography

- Text hierarchy must use **`typography.preset.*`** (pageTitle, sectionTitle, cardTitle, body, caption, tableText)
- Font families: `typography.fontFamily.primary` (LTR), `typography.fontFamily.hebrew` (RTL when needed)
- Supplementary reference only: `src/assets/brand/typography.md`

## Aesthetic

- **Light-mode first** — clean, premium SaaS feel
- **White / soft cards** on a light app background
- **Subtle borders** and **gentle shadows** — not heavy elevation
- **Blue primary accent** — actions, links, active nav (from brand tokens)
- **Green** — positive values, gains (status.positive, not neon)
- **Red** — negative values, losses (status.negative)
- **Amber** — warning, watch, caution states (status.warning)
- **Modern readable charts** — minimal grid, clear labels

## Layout

- Sidebar navigation + top bar (AppShell pattern)
- Card-based metric displays with clear hierarchy
- Data tables: readable density, monospace optional for numeric columns
- Charts with sufficient padding and legible axis labels
- AI insight cards near related data (score, chart, holding)
- **Responsive:** desktop, tablet, mobile — see AGENTS.md §13

## Avoid

- Generic admin-panel look (dense gray tables, harsh borders everywhere)
- Noisy dashboards with too many colors competing for attention
- Decorative use of green/red outside financial meaning
- Crypto/trading-terminal aesthetic
- Overloaded sidebars and duplicate metrics
- Hardcoded colors or typography in components

## Reference

- Theme files: `src/lib/theme/`
- Design brief: `src/assets/prompts/design-brief.md`
- Brand assets: `src/assets/brand/`
- Styling rules: `styled-components-guidelines.md`
