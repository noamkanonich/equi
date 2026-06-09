# Brand Colors

Suggested palette for Equi. Implement via `src/lib/theme/theme.ts` — avoid hardcoded hex in components when a token exists.

## Primary & Accents

| Token role | Hex | Usage |
|------------|-----|--------|
| Primary blue | `#2563eb` | Primary actions, links, active nav |
| Primary hover | `#1d4ed8` | Button/link hover |
| Accent green | `#16a34a` | Positive gains, constructive signals |
| Danger red | `#dc2626` | Losses, reduce signals, errors |
| Warning amber | `#d97706` | Watch, caution, stale data warnings |

## Neutrals

| Token role | Hex | Usage |
|------------|-----|--------|
| Neutral text | `#0f172a` | Primary body text |
| Muted text | `#64748b` | Secondary labels, captions |
| Card background | `#ffffff` | Cards, panels |
| App background | `#f8fafc` | Page background |
| Border color | `#e2e8f0` | Card borders, dividers |

## Usage Rules

- Green and red are for **financial meaning** (up/down, positive/negative) — not decoration
- Amber for **Watch** states and non-critical warnings
- Blue for **primary** interactive elements only
- Prefer soft shadows over heavy borders for depth
