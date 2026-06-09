# Charts

Visual standards for Recharts (and related) in Equi.

## Principles

- **Modern and clean** — readable at a glance
- **Minimal grid** — light horizontal lines or none
- **Clear axis labels** — readable font size, muted color for ticks
- **Helpful context** — pair charts with AI explanation nearby when insights are shown

## Colors

- Primary series: primary blue
- Positive comparison: accent green
- Negative comparison: danger red
- Secondary series: muted gray or blue tint — limit to 2–3 series per chart

## Avoid

- Default "ugly" chart styling (harsh grid, tiny fonts, rainbow series)
- 3D effects, heavy gradients, decorative chart junk
- Animations that obscure data on every update

## Types

| Chart | Typical use |
|-------|-------------|
| Line | Price history, portfolio value over time |
| Bar | Revenue, comparisons by period |
| Area | Allocation, cumulative metrics (subtle fill) |
| Pie / donut | Allocation only when few segments — prefer bar for many categories |

## AI Pairing

When a chart is shown with AI copy, the explanation should reference **what the chart shows** without predicting future price movement with certainty.
