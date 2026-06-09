# Equi Design Brief

## Product Personality

Equi is a personal AI portfolio copilot: calm, smart, practical, trustworthy. It helps users understand their portfolio and stock scores—it does not trade for them or promise returns.

## Main Screens (future)

1. **Dashboard** — portfolio snapshot, top movers, AI portfolio insight
2. **Portfolio** — holdings table, allocation, performance
3. **Watchlist** — tracked symbols with scores and suggested actions
4. **Stock analysis** — score breakdown, fundamentals, AI stock insight
5. **Smart replace** — compare holding vs alternative with trade-off reasoning
6. **Settings** — locale, preferences (later: accounts)

## Visual Language

- Light-mode first, app background `#f8fafc`, cards white with subtle border `#e2e8f0`
- Primary blue `#2563eb` for actions; green/red/amber for financial semantics only
- Generous whitespace; avoid cluttered trading-terminal layouts
- Typography hierarchy per `brand/typography.md`

## Dashboard Layout Principles

- App shell: sidebar + top bar
- Hero metric: total portfolio value with period change
- Row of summary cards (allocation, top gainer/loser, suggested actions count)
- Holdings preview table + link to full portfolio
- AI insight card: summary, positives, risks, disclaimer

## Card Design

- White background, 8–12px radius, 1px border, soft shadow on hover optional
- Card title semibold; metrics large but not shouty
- Suggested action as a pill/badge: Buy More (green tint), Hold (neutral), Watch (amber), Reduce/Avoid (red tint muted)

## Table Design

- TanStack Table with clear column headers
- Zebra or hover row optional; keep density readable
- Sticky header on long lists
- Score and suggested action columns aligned for scanning

## Chart Design

- See `charts/README.md` — minimal grid, clear axes, 1–2 series default
- Place chart explanation or AI insight adjacent, not buried below fold

## AI Insight Design

- Distinct card with subtle accent (blue border-left or icon)
- Sections: summary → positives → risks → suggested action → confidence
- Always show disclaimer footer
- "What changed" as bullet list when relevant

## Mobile Responsiveness

- Sidebar collapses to drawer or bottom nav on small screens
- Cards stack vertically; tables scroll horizontally or simplify columns
- Touch targets minimum 44px
- Test Hebrew RTL on mobile widths

## References

- `src/assets/brand/` — colors, type, voice, logo
- `.agents/skills/financial-dashboard-design.md` — engineering design rules
