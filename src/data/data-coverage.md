# Equi Data Coverage Map

Internal reference for app-wide real/fallback data migration. Screens consume **normalized** data via `useAppData()` / `AppDataProvider` (Zustand). Only server/provider layers call FMP/Finnhub.

## Data ownership categories

| Category | Description | Storage (current) |
|----------|-------------|-------------------|
| **user-owned** | Holdings, shares, cost basis, dates, notes, watchlist rules, alert rules, settings | `app-data.store` + `localStorage:equi-app-user-data`; settings/scoring/AI in separate `localStorage` keys; Supabase secondary when auth exists |
| **provider-owned** | Quote, profile, logo, fundamentals, news, earnings, analyst targets | `stockDataBySymbol` bundles via `/api/stocks` |
| **calculated** | Market value, gain/loss, weight, portfolio summary, allocation, report metrics | Utils from enriched holdings |
| **scoring** | Category scores, overall score, suggested action, confidence | Scoring engine + mock overlays |
| **ai** | Summaries, explanations, risks, next steps | Mock until AI provider connected |
| **mock-only** | Placeholders with no provider mapping yet | Feature mocks |

Provider field names map to bundle sections: `quote`, `profile`, `keyMetrics`, `incomeStatements`, `cashFlowStatements`, `priceHistory`, `news`, `earnings`, `analystTarget`.

---

## Dashboard

| Field | Ownership | API section |
|-------|-----------|-------------|
| Holdings table (symbol, shares, avg cost) | user-owned | — |
| currentPrice, dayChange | provider-owned | quote |
| companyName, logo | provider-owned | profile |
| marketValue, gainLoss, weight | calculated | — |
| score, suggestedAction | scoring | — |
| Total value, daily change, return | calculated | — |
| Performance chart | mock-only | history (future) |
| AI portfolio insight | ai | — |
| Recent activity, upcoming earnings | mock-only | earnings (future) |
| Metric sparklines | mock-only | history |
| Sector exposure, allocation | calculated | — |

- **AppDataProvider:** yes — `useLivePortfolioData` → `enrichedPortfolioHoldings`, `portfolioSummary`
- **Fetch scope:** `sections=quote,profile` only

---

## Portfolio

| Field | Ownership | API section |
|-------|-----------|-------------|
| shares, averageCost, purchaseDate, notes | user-owned | — |
| currentPrice, logo, companyName | provider-owned | quote, profile |
| marketValue, totalGainLoss, weightPercent | calculated | — |
| score, suggestedAction | scoring | — |
| Performance chart, recent activity, earnings | mock-only | history, earnings |
| AI insight | ai | — |

- **AppDataProvider:** yes — same as Dashboard (must match totals)
- **Fetch scope:** `sections=quote,profile`

---

## Watchlist

| Field | Ownership | API section |
|-------|-----------|-------------|
| symbol, buyZone, favorite, status | user-owned | — |
| currentPrice, companyName, logo | provider-owned | quote, profile |
| distanceToBuyZone | calculated | — |
| qualityScore, opportunityScore, triggers | mock-only / scoring | — |
| Sidebar AI, best opportunities | ai / mock-only | — |

- **AppDataProvider:** yes — `watchlistItems`, `enrichedWatchlistItems`
- **Fetch scope:** `sections=quote,profile`

---

## Stock Analysis (`/stocks/[symbol]`)

| Field | Ownership | API section |
|-------|-----------|-------------|
| quote, profile, fundamentals, news, earnings, analyst | provider-owned | full bundle |
| Price chart (week/month/year/max) | provider-owned | priceHistory |
| Price chart (day / default tab) | provider-owned | intraday (5m bars); quote-derived fallback |
| Analyst target (avg/high/low/upside) | provider-owned | analystTarget + price-target-consensus |
| Analyst distribution bar | provider-owned | analystTarget.distribution (grades-consensus) |
| Score breakdown, suggested action | scoring | — |
| AI insight tab | ai | — |
| Thesis notes | user-owned | — (`stockThesisBySymbol`) |
| User position card | user-owned + calculated | from portfolio holdings |

- **AppDataProvider:** yes — SSR hydrate + `getStockData`, thesis
- **Fetch scope:** `scope=full` (all sections)

---

## News

| Field | Ownership | API section |
|-------|-----------|-------------|
| Article list (portfolio/watchlist symbols) | provider-owned | news |
| Market pulse, upcoming events | mock-only | — |
| Featured / filter UI | calculated + mock | — |

- **AppDataProvider:** yes — merge provider `news` from bundles
- **Fetch scope:** `sections=quote,profile,news` (single batch; merge into store)

---

## Reports

| Field | Ownership | API section |
|-------|-----------|-------------|
| Portfolio value, G/L, allocation, top contributors | calculated | — (from AppDataProvider) |
| Performance vs benchmark | mock-only | history |
| Downloadable reports | mock-only | — |

- **AppDataProvider:** yes — `portfolioSummary`, `enrichedPortfolioHoldings` only
- **Fetch scope:** none (reuse portfolio cache)

---

## Smart Replace

| Field | Ownership | API section |
|-------|-----------|-------------|
| Weak positions, candidates, signals | mock-only | — |
| Symbol logos, names, live prices | provider-owned | quote, profile |

- **AppDataProvider:** yes — enrich mock rows from `stockDataBySymbol`
- **Fetch scope:** `sections=quote,profile`

---

## Alerts Center

| Field | Ownership | API section |
|-------|-----------|-------------|
| Alert rules (user-created) | user-owned | — |
| Seed alerts, summary metrics | mock-only | — |
| Symbol context (logo, price) | provider-owned | quote, profile |

- **AppDataProvider:** yes — `userCreatedAlerts` + bundle enrichment
- **Fetch scope:** `sections=quote,profile`

---

## Next Moves

| Field | Ownership | API section |
|-------|-----------|-------------|
| Move cards, health, risks | mock-only / ai | — |
| Symbol logos, names | provider-owned | quote, profile |

- **AppDataProvider:** yes — enrich from bundles
- **Fetch scope:** `sections=quote,profile`

---

## Add Stock

| Field | Ownership | API section |
|-------|-----------|-------------|
| Search results | provider-owned | search |
| Result row quote/profile | provider-owned | quote, profile |
| Popular searches | mock-only (until curated) | — |
| Add to portfolio/watchlist | user-owned write | — |

- **AppDataProvider:** yes — CRUD + `ensureStockDataForSymbols` on select
- **Fetch scope:** `GET /api/stocks/search`; then `quote,profile` for visible results

---

## Settings

| Field | Ownership | API section |
|-------|-----------|-------------|
| Locale, currency, scoring weights, alerts, AI prefs | user-owned | — |
| Option catalogs | mock-only | — |

- **AppDataProvider:** no financial bundles
- **Fetch scope:** none

---

## API route reference

| Route | Purpose |
|-------|---------|
| `GET /api/stocks?symbols=&sections=` | Batch normalized bundles (max 30) |
| `GET /api/stocks/[symbol]?scope=full` | Single full bundle |
| `GET /api/stocks/search?query=` | Symbol search (FMP → Finnhub → mock) |

Fallback chain: **FMP primary → Finnhub per-section → mock per-section**.
