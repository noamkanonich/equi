# RTL / i18n Guidelines

See [`AGENTS.md`](../../AGENTS.md) — **Non-Negotiable Development Rules** (especially §1, §11, §12).

## Locales

- Support **English** (`en`) and **Hebrew** (`he`) from the start
- Messages live in `src/i18n/messages/en.json` and `src/i18n/messages/he.json`
- Use next-intl: `useTranslations`, `getTranslations`, `useLocale`

## Strings

- **No hardcoded user-facing strings** in any component
- Every new feature must update **both** `en.json` and `he.json` without exception
- Keys should be namespaced by feature: `dashboard.title`, `portfolio.emptyState`
- Keep copy calm and practical — see `src/assets/brand/product-voice.md`

**Example (`en.json`):**

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

Add matching keys to `he.json` at the same time.

## Layout (LTR and RTL)

- Layout must adapt to **RTL (Hebrew)** and **LTR (English)**
- Avoid hardcoded left/right styling
- Prefer **logical CSS properties:**
  - `margin-inline-start` / `margin-inline-end`
  - `padding-inline-start` / `padding-inline-end`
  - `inset-inline-start` / `inset-inline-end`
  - `border-inline-start` / `border-inline-end`
  - `text-align: start` / `end`
- Use `start` / `end` in naming props and variables where direction matters
- Avoid assuming `left` = start or `right` = end in flex/grid positioning

## RTL-aware surfaces

Verify in both directions for:

- Icons and arrows (chevrons, back buttons)
- Cards, sidebars, tables, dropdowns, modals, tabs, charts
- Table alignment and numeric columns
- Spacing and padding in modals, drawers, and navigation

## Verification checklist (every new feature)

- [ ] Layout checked in LTR (English)
- [ ] Layout checked in RTL (Hebrew)
- [ ] No broken table alignment
- [ ] Icons and arrows make sense in RTL
- [ ] Modals, drawers, sidebar, tabs, dropdowns, charts behave correctly
- [ ] All new strings in `en.json` and `he.json`

## Dates & Numbers

- Use `date-fns` with locale when formatting dates
- Currency and percent formatting via `src/utils/` helpers (e.g. `src/utils/formatting/`) with locale awareness where needed
- Numbers and tickers often stay LTR even in Hebrew UI — document exceptions inline when needed

## Testing

- Verify navigation, tables, and forms in both locales
- Check icon direction (chevrons, arrows) where mirroring is expected
