# Typography

## Font Direction

- **Modern SaaS typography** — clean, readable, professional
- **System stack** for performance: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- **Monospace** for dense numeric tables: `ui-monospace, SFMono-Regular, Menlo, monospace`

## Hebrew / English

- Same font stack for both locales
- Hebrew requires RTL layout testing; line height 1.5+ for readability
- Numbers and tickers may remain LTR inside RTL layouts where standard in finance UIs

## Type Scale

| Role | Size | Weight | Notes |
|------|------|--------|--------|
| Page title | 1.75rem (28px) | 600 | Top of screen |
| Section title | 1.25rem (20px) | 600 | Between card groups |
| Card title | 1rem (16px) | 600 | Inside cards |
| Body | 1rem (16px) | 400 | Default copy |
| Caption | 0.875rem (14px) | 500 | Labels, hints |
| Table text | 0.875rem (14px) | 400 | Dense tables; mono for numbers optional |

## Rules

- Semibold (600) for headings only; body stays 400
- Line height **1.5** for body text
- Avoid more than three sizes on one card
- Metric highlights: slightly larger semibold, not display-sized hype
