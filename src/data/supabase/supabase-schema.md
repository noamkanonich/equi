# Supabase User Data Schema

User-owned data persisted in Supabase. Provider-owned market data (quotes, profiles, news, financials) is **not** stored here.

## Tables

### profiles

Extends `auth.users`. Auto-created on signup via `handle_new_user` trigger.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | References `auth.users(id)` |
| email | text | |
| full_name | text | |
| avatar_url | text | |
| created_at / updated_at | timestamptz | |

RLS: `auth.uid() = id`

### portfolio_holdings

User portfolio lots. Multiple rows per symbol allowed (separate lots).

**Persisted:** symbol, shares, average_cost, purchase_currency, purchase_date, account_name, account_type, target_allocation_percent, strategy_tag, notes.

**Not persisted:** assetId, market, exchange, provider, providerSymbol — re-derived on load for provider enrichment.

### cash_balances

One row per `(user_id, currency)`.

### watchlist_items

One row per `(user_id, symbol)`.

**Persisted:** symbol, buy_zone_min/max, target_price, status, notes.

**Not persisted:** qualityScore, opportunityScore, trigger, action, isFavorite, whyWatchingKey, monitorKeys, opportunityTrend — defaults applied on hydrate.

### stock_notes

One row per `(user_id, symbol)`.

| App field | DB column |
|-----------|-----------|
| whyIOwnIt | thesis |
| whatToWatch | what_to_watch |
| sellIf | sell_if |
| StockGeneralNote[] | general_note (JSON string) |

`general_note` stores a JSON-serialized array of `StockGeneralNote` objects to preserve append-only notes without a separate table.

### user_alerts

User-created alerts. Mock alert status overrides are not persisted.

| App field | DB column |
|-----------|-----------|
| form.alertType | alert_type |
| form.targetValue | target_value (numeric) |
| form.priority | priority |
| form.note | note |
| status | status |

### user_settings

One row per user.

| Column | Content |
|--------|---------|
| display_currency | Top-level display currency |
| language | Top-level locale |
| general_settings | JSONB — marketRegion, dateFormat, benchmark |
| appearance_settings | JSONB |
| portfolio_settings | JSONB |
| scoring_settings | JSONB |
| alerts_settings | JSONB |
| ai_preferences | JSONB |

## RLS

All tables have RLS enabled. Users can only SELECT/INSERT/UPDATE/DELETE their own rows (`auth.uid() = user_id`). No public read policies.

## Security

- Client uses `NEXT_PUBLIC_SUPABASE_ANON_KEY` only.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only (`src/lib/supabase/admin.ts`).
- Never commit `.env.local` or service role keys.
