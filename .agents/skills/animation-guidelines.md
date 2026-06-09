# Animation Guidelines

See [`AGENTS.md`](../../AGENTS.md) — **Non-Negotiable Development Rules** (especially §4, §14).

## Animation thinking (mandatory)

For **every new UI/feature**, decide whether animation improves the experience:

- **If yes** — add subtle, appropriate animation
- **If no** — do not add animation

Animations should clarify changes, guide attention, or make the app feel polished. Do not add motion for decoration alone.

## Purpose

Use animation to **clarify** state changes and hierarchy—not to decorate or distract.

## What to animate (when useful)

- Subtle transitions and hover states
- Entrance animations for panels, modals, lists
- Loading states (skeleton or pulse)
- Score changes and insight reveal
- Tab transitions
- Chart load animations (short, readable)

## Framer Motion

- Use Framer Motion for meaningful UI transitions: panel open/close, list enter, modal, tab switch
- Prefer **subtle** duration (150–300ms) and ease-out curves
- Avoid animating every card on a dense dashboard
- Respect performance on desktop, tablet, and mobile

## Charts (Recharts)

- Keep chart animations **smooth and readable**
- Short animation duration on load; avoid repeated re-animation on every re-render
- Do not animate in ways that obscure the data (excessive bounce, long delays)
- Use chart color tokens from `src/lib/theme/colors.ts` — see `financial-dashboard-design.md`

## Performance

- Animate `transform` and `opacity` when possible
- Respect `prefers-reduced-motion` for accessibility when adding motion
- Do not block interaction with long entrance sequences

## Dashboard-specific

- Over-animated portfolios feel untrustworthy and slow
- Reserve motion for: insight reveal, score update highlight, sidebar collapse
- Loading states: simple skeleton or pulse, not elaborate sequences
- **Do not over-animate financial dashboards**

## Reference

- Visual tone: `financial-dashboard-design.md` — calm, premium, not flashy
- Post-implementation: [`CLAUDE.md`](../../CLAUDE.md) **After Coding** checklist items 11–12
