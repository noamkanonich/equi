# Equi

AI portfolio copilot — track holdings, analyze stocks, view automatic scores, and get simple suggested actions.

## Tech Stack

Next.js App Router · TypeScript · styled-components · Framer Motion · Recharts · TanStack Table · next-intl · zustand · zod

## Getting Started

```bash
cd equi
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — routes are locale-prefixed (`/en`, `/he`).

## Project Structure

```
src/
├── app/[locale]/     # Pages (dashboard, portfolio, watchlist, etc.)
├── app/api/          # API route placeholders
├── components/       # UI by feature
├── config/           # App, navigation, scoring config
├── data/             # Mock data
├── i18n/             # Locales (en, he)
├── lib/              # financial-data, scoring, ai, theme
├── store/            # Zustand stores
└── types/            # Shared TypeScript types
```

## Agent Documentation

- [`AGENTS.md`](./AGENTS.md) — coding rules and folder ownership
- [`CLAUDE.md`](./CLAUDE.md) — Claude-specific instructions
- [`.agents/`](./.agents/) — specialized agent and skill docs

## Market Data

Core UI uses mock data. **Stock data** can be enriched via FMP when `FMP_API_KEY` is set in `.env.local` (see `.env.local.example`); without a key, normalized mock fallbacks are returned from `GET /api/stocks/[symbol]`. Currency rates use Frankfurter with mock fallback. Auth and Supabase are not integrated yet.

### Israeli Assets via TASE Data Hub

TASE Data Hub Basic products are used for Israeli asset metadata only:

- Securities - Basic
- Indices - Basic
- Funds - Basic

Required server-only env variables:

```bash
TASE_API_KEY=
TASE_API_KEY_HEADER_NAME=apikey
TASE_ACCEPT_LANGUAGE=en-US
TASE_SECURITIES_BASIC_URL=https://datawise.tase.co.il/v1/basic-securities/companies-list
TASE_INDICES_BASIC_URL=https://datawise.tase.co.il/api/v2/basic-indices/indices-list
TASE_FUNDS_BASIC_URL=https://datawise.tase.co.il/v1/fund/fund-list
```

Search uses the unified asset registry and local server cache, so TASE is not called on every keystroke. Israeli assets use `asset.id` such as `IL:TASE:<providerSymbol>` as the unique key because dual-listed symbols can overlap with US assets.

TASE EoD and online prices are not implemented yet. Israeli prices must not be faked; UI should show price unavailable until the approved price products are added.

## Status

Auth and Supabase are not integrated yet.
