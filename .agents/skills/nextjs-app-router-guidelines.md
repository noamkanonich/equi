# Next.js App Router Guidelines

## Conventions

- Use App Router under `src/app/`
- Locale-aware routes live under `src/app/[locale]/`
- API routes under `src/app/api/` — keep handlers small; delegate logic to `src/lib/`

## Server vs Client Components

- **Prefer Server Components by default** where interactivity is not required
- Use `"use client"` only when needed: hooks, browser APIs, event handlers, Framer Motion, styled-components in client trees
- Pass serializable props from server to client components

## File Placement

- Route-specific UI that is **not reusable** may live in the route folder
- **Reusable UI** belongs in `src/components/{feature}/`
- Layout shells: `src/app/[locale]/layout.tsx` and shared layout components

## Data Fetching

- Use mock data or lib providers until real APIs are integrated
- Do not fetch financial data directly inside presentational components
- API route handlers should validate input (zod) and return typed JSON

## i18n

- Use next-intl with messages in `src/i18n/messages/`
- Middleware handles locale detection per project setup

## Avoid

- Pages Router patterns (`getServerSideProps`, etc.)
- Large business logic blocks inside `page.tsx` — extract to `src/lib/`
