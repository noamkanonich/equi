# Design Assets

This folder stores **design references** for Claude, Cursor, and human contributors working on Equi UI.

## Before UI Work

Review this folder (especially `brand/` and `prompts/design-brief.md`) before implementing or changing screens and components.

## Purpose

- Keep visual and voice **consistent** across the app
- Provide inspiration and constraints without prescribing pixel-perfect copies
- Document icon, chart, and illustration standards

## Important

- Images in `inspiration/` are **reference only** — do not copy layouts or branding from third-party products literally
- `screenshots/` holds Equi's own app captures during development for regression and polish
- Hex values in `brand/colors.md` inform theme tokens in `src/lib/theme/theme.ts` — use tokens in code, not raw hex in components

## Subfolders

| Folder | Purpose |
|--------|---------|
| `brand/` | Colors, typography, logo direction, product voice |
| `inspiration/` | External reference screenshots and mood boards |
| `screenshots/` | Equi app screenshots during development |
| `icons/` | Icon usage guidelines |
| `illustrations/` | Illustration style (minimal use) |
| `charts/` | Chart visual standards |
| `prompts/` | Design briefs for AI-assisted UI work |
