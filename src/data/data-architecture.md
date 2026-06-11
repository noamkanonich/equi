# Equi — Data Architecture

Comprehensive reference for the app-wide data layer. For a field-by-field screen mapping see [`data-coverage.md`](./data-coverage.md).

---

## Global Data Layer

All client-side state lives in two layers:

| Layer | Path | Purpose |
|-------|------|---------|
| `useAppDataStore` | `src/store/app-data.store.ts` | Portfolio holdings, watchlist, stock bundles, alerts, thesis |
| `useAppData()` | `src/providers/useAppData.ts` | Derived selectors on top of the store |
| Settings stores | `src/store/` | Locale, currency, scoring weights, AI preferences |

**`AppDataProvider`** (`src/providers/AppDataProvider.tsx`) mounts once at the root and triggers the startup portfolio fetch. All screens consume `useAppData()` — no component-level API calls to financial providers.

---

## Data Ownership Categories

| Category | Description | Storage |
|----------|-------------|---------|
| **user-owned** | Holdings, shares, cost basis, dates, notes, watchlist, alert rules | `app-data.store` in-memory (Supabase planned) |
| **provider-owned** | Quote, profile, logo, fundamentals, news, earnings, analyst targets | `stockDataBySymbol` bundles via `/api/stocks` |
| **calculated** | Market value, gain/loss, weight, portfolio summary, allocation | Utils from enriched holdings |
| **scoring** | Category scores, overall score, suggested action, confidence | `src/lib/scoring/` + mock overlays |
| **ai** | Summaries, explanations, risks, next steps | Mock until AI provider connected |
| **mock-only** | Placeholders with no live provider mapping yet | Feature mocks in `src/data/` |

---

## Startup Fetch Behavior

**`AppDataProvider` (on mount, once):**
1. Reads `portfolioHoldings` from `useAppDataStore.getState()`
2. Collects unique portfolio symbols
3. Calls `ensureStockDataForSymbols(symbols, { sections: ["quote", "profile"] })`
4. Dev log: `[app-data] startup portfolio symbols: AAPL,MSFT,... (N)`

**What is NOT prefetched on startup:**
- Watchlist symbols — fetched lazily when Watchlist screen opens
- News — fetched lazily when News screen opens via `/api/news`
- Fundamentals (keyMetrics, earnings, analyst) — fetched lazily on Stock Analysis screen

---

## Section-Based API

**`GET /api/stocks?symbols=&sections=`** — batch normalized bundles (up to 30 symbols)

Each `sections` value maps to a server-side provider call:

| Section | TTL | Provider order |
|---------|-----|----------------|
| `quote` | 5 min | FMP → Finnhub → mock |
| `profile` | 24 h | FMP → Finnhub → mock |
| `keyMetrics` | 24 h | FMP → mock |
| `incomeStatements` | 24 h | FMP → mock |
| `cashFlowStatements` | 24 h | FMP → mock |
| `priceHistory` | 15 min | FMP → mock |
| `intraday` | 15 min | FMP → mock |
| `news` | 1 h | FMP → Finnhub → mock |
| `earnings` | 6 h | FMP → mock |
| `analystTarget` | 6 h | FMP → mock |
| `analystRatings` | 6 h | FMP → mock |

**`GET /api/news?scope=&symbols=`** — dedicated news endpoint

| Param | Values | Behavior |
|-------|--------|---------|
| `scope` | `portfolio` | Symbol-specific news for portfolio holdings |
| `scope` | `watchlist` | Symbol-specific news for watchlist |
| `scope` | `market` | News for broad-market symbols (SPY, QQQ, AAPL, MSFT, AMZN, GOOGL) |
| `symbols` | comma-separated | Required for portfolio/watchlist scopes |

Returns `{ items: NewsItem[], isFallback: boolean, provider: "fmp" | "finnhub" | "mock" }`.
Server-side in-memory cache: 1 hour TTL per scope+symbols key.

---

## Provider Fallback Chain

```
FMP (primary)
  └─ if unavailable or rate-limited →
     Finnhub (per-section fallback)
       └─ if unavailable →
          mock (normalized mock bundle)
```

- `isFallback: true` on bundle meta when FMP was unavailable
- `fallbackSections` lists which sections used mock while others were live
- Without `FMP_API_KEY` in `.env.local`, all bundles return normalized mock data
- Rate-limit cooldown: 60 s before retrying FMP after a 429

---

## Screen → Data Mapping

### Dashboard

| Field | Ownership | API section |
|-------|-----------|-------------|
| Holdings (symbol, shares, avg cost) | user-owned | — |
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

Fetch scope: `sections=quote,profile` via **`AppDataProvider` startup only**. [`useLivePortfolioData`](src/hooks/useLivePortfolioData.ts) is read-only — it does not trigger fetches.

---

### Portfolio

| Field | Ownership | API section |
|-------|-----------|-------------|
| shares, averageCost, purchaseDate, notes | user-owned | — |
| currentPrice, logo, companyName | provider-owned | quote, profile |
| marketValue, totalGainLoss, weightPercent | calculated | — |
| score, suggestedAction | scoring | — |
| Performance chart, recent activity | mock-only | history, earnings |
| AI insight | ai | — |

Fetch scope: `sections=quote,profile` (same cache as Dashboard via startup — [`useLivePortfolioData`](src/hooks/useLivePortfolioData.ts) is read-only)

---

### Watchlist

| Field | Ownership | API section |
|-------|-----------|-------------|
| symbol, buyZone, favorite, status | user-owned | — |
| currentPrice, companyName, logo | provider-owned | quote, profile |
| distanceToBuyZone | calculated | — |
| qualityScore, opportunityScore, triggers | mock-only / scoring | — |
| Sidebar AI, best opportunities | ai / mock-only | — |

Fetch scope: `sections=quote,profile` (lazy — only when Watchlist screen opens)

---

### Stock Analysis (`/stocks/[symbol]`)

| Field | Ownership | API section |
|-------|-----------|-------------|
| quote, profile, fundamentals, news, earnings, analyst | provider-owned | full bundle |
| Price chart (week/month/year/max) | provider-owned | priceHistory |
| Price chart (day) | provider-owned | intraday; quote-derived fallback |
| Analyst target (avg/high/low/upside) | provider-owned | analystTarget |
| Analyst distribution bar | provider-owned | analystTarget.distribution |
| Score breakdown, suggested action | scoring | — |
| AI insight tab | ai | — |
| Thesis notes | user-owned | stockThesisBySymbol |
| User position card | user-owned + calculated | from portfolio holdings |

Fetch scope: `scope=full` (all sections)

---

### News

| Field | Ownership | API section |
|-------|-----------|-------------|
| Article list | provider-owned | `/api/news` (separate endpoint) |
| Logo, price context | provider-owned | quote, profile |
| Market pulse, upcoming events | mock-only | — |
| Featured / filter UI | calculated + mock | — |

Fetch behavior: Portfolio quote/profile comes from **`AppDataProvider` startup cache** (no `/api/stocks` on News open). A `useEffect` calls `GET /api/news?scope=portfolio&symbols=...` when the News screen opens. Watchlist symbol logos use mock data until Watchlist is opened. News is screen-local state — not stored in the global `app-data.store`.

---

### Reports

| Field | Ownership | API section |
|-------|-----------|-------------|
| Portfolio value, G/L, allocation, top contributors | calculated | — |
| Performance vs benchmark | mock-only | history |
| Downloadable reports | mock-only | — |

Fetch scope: none (reuses portfolio cache from startup via read-only [`useLivePortfolioData`](src/hooks/useLivePortfolioData.ts))

---

### Smart Replace

| Field | Ownership | API section |
|-------|-----------|-------------|
| Weak positions, candidates, signals | mock-only | — |
| Symbol logos, names, live prices | provider-owned | quote, profile |

Fetch scope: `sections=quote,profile`

---

### Alerts Center

| Field | Ownership | API section |
|-------|-----------|-------------|
| Alert rules (user-created) | user-owned | `userCreatedAlerts` in store |
| Seed alerts, summary metrics | mock-only | — |
| Symbol context (logo, price) | provider-owned | quote, profile |

CRUD: `addUserAlert`, `updateAlert`, `removeAlert` in `app-data.store.ts`

---

### Next Moves

| Field | Ownership | API section |
|-------|-----------|-------------|
| Move cards, health, risks | mock-only / ai | — |
| Symbol logos, names | provider-owned | quote, profile |

Fetch scope: `sections=quote,profile`

---

### Add Stock

| Field | Ownership | API section |
|-------|-----------|-------------|
| Search results | provider-owned | `GET /api/stocks/search` |
| Result row quote/profile | provider-owned | quote, profile |
| Popular searches | mock-only | — |
| Add to portfolio/watchlist | user-owned write | — |

---

### Settings

No financial bundle fetching. User preferences in settings stores only.

---

## Inflight Deduplication

`ensureStockDataForSymbols` deduplicates concurrent requests for the same `symbols+sections` key via an in-memory `Map<string, Promise<void>>`. A second call with the same key awaits the first — no duplicate API calls on rapid re-renders or concurrent screen mounts.

---

## Mock-Only (No Live Provider Yet)

- Performance charts (historical benchmarks)
- Smart Replace candidates and signals
- Next Moves cards
- Market pulse items on News screen
- Upcoming earnings events on News screen
- AI insights and summaries (all screens)
- Reports downloadable PDFs

---

## API Route Reference

| Route | Purpose |
|-------|---------|
| `GET /api/stocks?symbols=&sections=` | Batch normalized bundles (max 30) |
| `GET /api/stocks/[symbol]?scope=full` | Single full bundle |
| `GET /api/stocks/search?query=` | Symbol search (FMP → Finnhub → mock) |
| `GET /api/news?scope=&symbols=` | News items by scope with 1 h server cache |

---

## QA Audit (2026-06)

Real Data Coverage QA + API Call Budget pass. Focus: data-source correctness, API budget, synchronization — no new features.

### Screen connectivity

| Screen | AppDataProvider | API calls | Intentional mock |
|--------|-----------------|-----------|------------------|
| Dashboard | Yes (`useLivePortfolioData`) | Startup portfolio batch only | Activity, earnings, AI, perf chart |
| Portfolio | Yes (`useLivePortfolioData`) | Startup portfolio batch only | Activity, earnings, sparklines |
| Reports | Yes + manual refresh | Reuses portfolio cache | Benchmarks, risk AI, perf history |
| Watchlist | Yes (`useAppData` + lazy fetch) | `watchlistItems` symbols only on open | Sidebar metrics, AI insight |
| Stock Analysis | Yes (`hydrateStockData` + holdings) | SSR full bundle per symbol | Analysis scaffold |
| News | Yes (symbols from store) | `/api/news` on page open only | Fallback items, pulse, events |
| Alerts Center | Yes + lazy fetch | Page-level batch for alert symbols | Seed alerts, summary metrics |
| Smart Replace | Partial (`usePageStockBundles`) | Lazy quote/profile on open | Entire feature mock-driven |
| Next Moves | Partial (`usePageStockBundles`) | Lazy quote/profile on open | Move cards, health, risks |
| Add Stock | Yes (CRUD + on-select) | Search when query ≥ 2 chars | Trending/popular |
| Settings | No (by design) | None | Catalogs/defaults |

Dashboard, Portfolio, and Reports share the same `portfolioSummary` from `useAppData()`.

### Allowed API call sites

| Layer | Allowed |
|-------|---------|
| `AppDataProvider` mount | One portfolio `quote,profile` batch |
| `ensureStockDataForSymbols` / `usePageStockBundles` | Page-level or user-action batch |
| `GET /api/stocks/search` | Debounced search (Add Stock, TopBar, holding form) |
| `GET /api/news` | News page only |
| SSR `getStockDataBundle` | Stock Analysis route only |
| `GET /api/currency/rates` | App bootstrap (Frankfurter) |

### Forbidden API call sites

- Row, card, table-cell, or `StockLogo` components
- Independent per-holding fetches on Dashboard/Portfolio when store already has data
- News or fundamentals on app startup
- Watchlist symbols on startup (lazy on Watchlist screen)

### Startup call budget (cold cache, 7 portfolio symbols)

| Call | Expected count |
|------|----------------|
| `GET /api/stocks?symbols=…&sections=quote,profile` | 1 client request |
| Server provider section fetches | ≤ 14 (7 × 2 sections; cached within TTL) |
| `GET /api/currency/rates` | 0–1 |
| News / watchlist / full fundamentals | 0 |

Repeat refresh within quote TTL (5 min) → client fresh-skip, zero provider calls.

### Cache and dedupe layers

1. **Server section cache** — `{SYMBOL}:{section}` in `stock-data-cache.ts`; dev logs: cache hits/misses, provider call count, fallback reasons
2. **Client fresh-skip** — `isStockDataFresh` + per-section timestamps in Zustand
3. **Client inflight dedupe** — sorted `symbols+sections` key in `inflightEnsureRequests`
4. **News route cache** — `{scope}:{sortedSymbols}`, 1 h TTL

Dev client logs (`[app-data]`): requested/unique symbols, sections, fresh skipped, in-flight skipped, fetching list, truncation warning, client batch count.

### Data source visibility

`deriveDataSourceSummary` maps bundle `meta` to page-level `StaleDataNotice` source text (FMP live, Finnhub fallback, mock, rate-limited, missing key, provider error). One notice per screen when status is `mock` or `stale`.

### Fixes applied in this pass

- NVDA mock/registry prices aligned to `portfolio-quote-fallbacks` (~131)
- `hydrateStockData` stamps only `availableDataSections`
- Inflight key sorts symbols alphabetically
- Dev-only app-data logs; sections + truncation warnings
- Watchlist fetches user `watchlistItems` only; sidebar enriches from store cache when available

### Known limitations

- News articles are page-local state, not in `stockDataBySymbol`
- Smart Replace / Next Moves derive from portfolio scoring — sparse for small portfolios
- Dismissed next moves persist in localStorage only (Supabase TODO)
- Settings isolated from financial bundles

---

## Global Data Source Status

Per-screen mapping after the global data cleanup pass. See also [`data-coverage.md`](./data-coverage.md).

| Screen | User data source | Market data source | Calculated source | Mock allowed | Sync status |
|--------|------------------|--------------------|-------------------|--------------|-------------|
| Dashboard | `useAppData()` → `enrichedPortfolioHoldings`, `portfolioSummary` | `stockDataBySymbol` via `useLivePortfolioData` | `buildLiveDashboardData` | Demo-only cards when `isUsingDemoPortfolio` | Synced |
| Portfolio | `useAppData()` → holdings, summary, cash | `stockDataBySymbol` | `buildLivePortfolioData` | Demo sections when `isUsingDemoPortfolio` | Synced |
| Watchlist | `useAppData()` → `watchlistItems`, `enrichedWatchlistItems` | `usePageStockBundles` + store cache | Watchlist enrich utils | Demo sidebar when `isUsingDemoPortfolio` | Synced |
| Reports | `useAppData()` via `useLivePortfolioData` | `stockDataBySymbol` bundles | `buildReportsPageData`, `calculateReportMetrics` | Demo fallback when `isUsingDemoPortfolio && !hasHoldings` | Synced |
| Stock Analysis | `useAppData()` position, notes, watchlist | SSR `initialBundle` + `hydrateStockData` | `enrichStockAnalysisWithBundle` | Analysis body seed (`stock-analysis.mock`); API fallback | Synced (position) |
| Alerts Center | `useAppData()` → `userCreatedAlerts` | `usePageStockBundles` | `buildMergedAlerts`, `computeAlertCounts` | Demo alerts only when `isUsingDemoPortfolio` | Synced |
| News | `portfolioHoldings`, `watchlistItems` for symbol filters | `/api/news` + store quote cache | `filterNewsItems`, sidebar builders | API error fallback only | Synced |
| Smart Replace | `enrichedPortfolioHoldings`, `enrichedWatchlistItems` | `usePageStockBundles` | `buildSmartReplacePageData` | Full mock when `isUsingDemoPortfolio` | Synced |
| Next Moves | portfolio, watchlist, alerts, dismissed IDs | bundles for earnings enrichment | `buildNextMovesPageData` | Full mock when `isUsingDemoPortfolio` | Synced |
| Settings | Settings stores | — | Summary utils | Default option metadata (`settings.mock`) | Allowed |

### Data mode guards (`useAppData`)

| Flag | Purpose |
|------|---------|
| `isAuthenticated` | Re-export from `useAuth()` |
| `isAppDataReady` | Provider finished init (`isAppDataInitialized && !isAuthLoading`) |
| `isAuthenticatedDataLoading` | Supabase hydrate in progress |
| `isUserDataPending` | Show loading — never flash demo user data |
| `isUsingDemoPortfolio` | Gate demo portfolio/watchlist/alerts (dev `resetToMock()` only in normal flow) |
| `isUsingDemoData` | Alias of `isUsingDemoPortfolio` |
| `isUsingDemoWatchlist` | Demo watchlist seed detection |

### Intentional mock fallback (do not remove)

- `financial-data.mock.ts` — provider/API error fallback
- `stock-analysis.mock.ts` — analysis content seed
- `settings.mock.ts` — defaults and UI option metadata
- `/api/stocks` error fallback
- `/api/news` error-only fallback when provider returns zero items

### Remaining TODOs

- Persist dismissed next moves to Supabase
- Performance chart history (dashboard/portfolio)
- AI insights from real provider
- Fundamental analysis full provider mapping

### Next recommended tasks

- Persist holdings/watchlist/cache to Supabase (partial — user CRUD sync exists)
- Move news into global store or bundle `news` section
- Audit Fundamental Analysis page when implemented
- Surface `sectionProviders` in dev tools panel (optional)
