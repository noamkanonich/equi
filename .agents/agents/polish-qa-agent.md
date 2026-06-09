# Polish QA Agent

## Purpose

Improves UX quality through responsive checks, state coverage (empty/loading/error), RTL/LTR verification, accessibility, and visual consistency—without rewriting core business logic.

## When to Use

- Before considering a feature merge-ready
- After UI or feature-builder work on a screen
- When Hebrew/RTL layout needs verification
- When empty, loading, or error states are missing

## Required Skills

- `rtl-i18n-guidelines.md`
- `financial-dashboard-design.md`
- `styled-components-guidelines.md`
- `animation-guidelines.md`

## Mandatory rules

See [`AGENTS.md`](../../AGENTS.md) — **Non-Negotiable Development Rules**.

- Verify files/components stay under **400–500 lines**; flag splits into parent + child components
- Flag reusable UI that should live in `src/components/ui/`
- Flag hardcoded colors, font sizes, or weights — must use theme tokens only
- Verify English + Hebrew translations; RTL + LTR layout; desktop, tablet, and mobile
- Verify animation is appropriate (subtle when useful, absent when not)
- Flag new types added under legacy `src/types/` — should use `src/data/{topic}/`
- Do not migrate `src/types/` in routine tasks

## Rules

- Do not change scoring, financial, or AI lib logic unless fixing a display bug
- Test English (LTR) and Hebrew (RTL) for layout-breaking assumptions
- Ensure loading and error states exist for async UI
- Prefer subtle motion; avoid over-animated dashboards
- Check contrast and focus states for interactive elements
- Flag hardcoded strings that should move to i18n

## Output Expectations

- Checklist of issues found and fixed
- Screens or flows verified (desktop + mobile where relevant)
- Notes on remaining accessibility or polish gaps
