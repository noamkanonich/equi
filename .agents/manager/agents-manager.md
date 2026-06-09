# Agents Manager

Orchestrates specialized agents for Equi development. Read `AGENTS.md` and this file before every task.

## Pre-Flight Checklist

1. Read `AGENTS.md` — especially **Non-Negotiable Development Rules**
2. Read [`CLAUDE.md`](../../CLAUDE.md) — complete **Before Coding** checklist
3. Read this file
4. Identify the task type and pick the **leading agent**
5. Read the agent's required skills under `.agents/skills/`
6. For UI tasks, confirm `src/assets/` has been reviewed
7. Verify changes stay within folder ownership boundaries

## Leading Agents by Task Type

### UI Implementation Agent

**Leads:** screens, components, layout, responsive design, styled-components, visual polish.

Use when building or restyling UI. Does not own API or scoring logic.

### Feature Builder Agent

**Leads:** user flows, local state, feature logic, mock data wiring, page composition.

Use when connecting pages, stores, and components with mock data. Does not own raw API clients.

### Data API Agent

**Leads:** financial APIs, API routes, Axios clients, data normalization, error handling, caching strategy.

Use when integrating or stubbing financial data. Does not put fetch logic inside UI components.

### AI Insights Agent

**Leads:** prompt design, AI summaries, score explanations, chart explanations, smart-replace reasoning, AI safety wording.

Use when working in `src/lib/ai/` or AI insight UI. Does not connect real providers unless explicitly tasked.

### Polish QA Agent

**Leads:** responsive checks, empty/loading/error states, RTL/LTR checks, UX polish, accessibility checks.

Use after feature work or before merge-ready polish. Consults other agents' output, does not rewrite business logic.

### Architecture Reviewer Agent

**Leads:** folder structure, refactors, naming, separation of concerns, reducing duplication.

Use for cross-cutting changes, new modules, or when boundaries are unclear.

## Agent Routing Table

| Task Type | Leading Agent |
|-----------|---------------|
| UI components, layout, styling | `ui-implementation-agent` |
| Feature wiring, stores, pages | `feature-builder-agent` |
| API routes, financial data clients | `data-api-agent` |
| AI insights, prompts, disclaimers | `ai-insights-agent` |
| RTL/i18n, accessibility, polish | `polish-qa-agent` |
| Architecture review, boundaries | `architecture-reviewer-agent` |

## Default Workflow

1. **Understand the task** — scope, affected folders, constraints from `AGENTS.md`
2. **Pick the leading agent** — one primary owner; consult others as needed
3. **Read relevant skills** — see each agent file for required skill list
4. **Inspect related files** — existing patterns, types, mocks
5. **Implement the smallest clean step** — mock-first, no over-engineering
6. **Self-review** — use `AGENTS.md` §14 and [`CLAUDE.md`](../../CLAUDE.md) **After Coding** checklist:
   - Simple, readable code; files under 400–500 lines
   - Reusable UI in `src/components/ui/` when appropriate
   - Types in `src/data/`; utils in `src/utils/`
   - All translations updated (en + he); RTL + LTR verified
   - Desktop, tablet, mobile responsive
   - Theme colors/typography only; animation appropriate
   - Business logic outside UI; finance/AI safe wording
7. **Summarize** — what changed, risks, assumptions, next step

## Skills Reference

All agents may consult `.agents/skills/`:

| Skill | Use for | Non-negotiable rules |
|-------|---------|----------------------|
| `karpathy-guidelines.md` | Code clarity, simplicity, naming, utils/types | §5–§9 |
| `styled-components-guidelines.md` | Styling, theme tokens, logical props | §10 |
| `nextjs-app-router-guidelines.md` | Routing, RSC | — |
| `financial-dashboard-design.md` | Visual design, chart/status tokens | §10, §13 |
| `scoring-engine-guidelines.md` | Scoring logic | — |
| `ai-output-guidelines.md` | AI copy and safety | §15 |
| `rtl-i18n-guidelines.md` | Locales, RTL, translations | §1, §11, §12 |
| `animation-guidelines.md` | Motion and charts | §4 |

## Global Rules

- Read **Non-Negotiable Development Rules** in `AGENTS.md` for every task
- Complete **Before Coding** and **After Coding** checklists in `CLAUDE.md`
- Do not implement real financial or AI APIs unless explicitly tasked
- Do not add authentication unless explicitly tasked
- Keep components under **400–500 lines**
- Use **const arrow functions** for components and functions
- Use mock data until integration phase
- All new UI: i18n (English + Hebrew), RTL/LTR, responsive (desktop/tablet/mobile)
- Colors and typography only from `src/lib/theme/` — no random hex in components
- New shared types in `src/data/` — do not add files to legacy `src/types/`
- Never remove existing files without explicit approval
