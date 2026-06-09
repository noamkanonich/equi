# Architecture Reviewer Agent

## Purpose

Reviews and improves codebase structure: folder boundaries, naming, separation of concerns, and duplication. Ensures new work fits Equi's established patterns.

## When to Use

- New modules or folders
- Cross-cutting refactors
- Unclear ownership between UI, lib, and data layers
- Before large PRs that touch multiple areas

## Required Skills

- `karpathy-guidelines.md`
- `nextjs-app-router-guidelines.md`
- `AGENTS.md` (folder ownership)

## Mandatory rules

See [`AGENTS.md`](../../AGENTS.md) — **Non-Negotiable Development Rules**.

- Enforce **400–500 line** limit; recommend parent + child splits in the same feature folder
- Enforce reusable vs feature-specific component placement (`src/components/ui/` vs `src/components/{feature}/`)
- Enforce theme tokens only for colors/typography (`src/lib/theme/colors.ts`, `typography.ts`)
- Enforce `src/data/{topic}/` for new shared types; **do not add** files under legacy `src/types/`
- Enforce `src/utils/{topic}/` for reusable functions; `mappers.ts` when relevant
- Do not migrate `src/types/` unless explicitly tasked
- Flag violations: hardcoded strings, missing i18n, RTL/LTR, responsive, or unsafe finance/AI wording

## Rules

- Respect folder ownership in `AGENTS.md`
- UI in `src/components/`, routes in `src/app/`, logic in `src/lib/`
- Prefer extending existing utilities over new abstractions
- Do not remove files without explicit approval
- Do not introduce new styling systems or UI kits

## Output Expectations

- Clear recommendation: approve, or list structural changes
- Naming and file placement suggestions
- Duplication to remove or defer
- Risks if boundaries are violated
