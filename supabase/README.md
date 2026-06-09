# Equi Supabase

User-owned data (portfolio, watchlist, notes, alerts, settings) lives in Supabase. Provider-owned market data (quotes, profiles, news, financials) stays in the financial-data layer — not in these tables.

## Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli) installed
- Equi Supabase project created (dashboard)
- Environment variables in `.env.local` (never commit this file)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Security

- **Client (browser):** `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` only
- **Server / Edge Functions / admin scripts:** `SUPABASE_SERVICE_ROLE_KEY` only
- **Never** commit `.env.local` or the service role key
- **Never** import `SUPABASE_SERVICE_ROLE_KEY` in React or client components
- **RLS must remain enabled** on all user tables — no public read policies

## CLI commands

```bash
# Authenticate
supabase login

# Link to your remote project (find PROJECT_REF in dashboard URL)
supabase link --project-ref <PROJECT_REF>

# Apply migrations to remote database (non-destructive)
supabase db push

# Deploy Edge Functions (placeholders)
supabase functions deploy refresh-market-data
supabase functions deploy process-alerts

# Set provider secrets for Edge Functions (server-side only)
supabase secrets set FMP_API_KEY=your_fmp_key
supabase secrets set FINNHUB_API_KEY=your_finnhub_key
```

## Local development

```bash
# Start local Supabase stack (optional)
supabase start

# Reset local DB (destructive — local only)
# supabase db reset
```

## Schema

See [`src/data/supabase/supabase-schema.md`](../src/data/supabase/supabase-schema.md) for table definitions and app mapping rules.

Migration: `supabase/migrations/20260607120000_create_user_data_tables.sql`

Tables with RLS (select/insert/update/delete own rows only):

- `profiles`
- `portfolio_holdings`
- `cash_balances`
- `watchlist_items`
- `stock_notes`
- `user_alerts`
- `user_settings`

A profile row is created automatically on signup via the `handle_new_user` trigger on `auth.users`.

## Auth (Email + Password)

Auth is implemented in the app via `AuthProvider`, `auth.service`, and the TopBar sign-in entry point.

### Manual dashboard setup

These settings cannot be changed from code — configure them in the Supabase Dashboard:

1. **Enable Email provider**
   - Dashboard → **Authentication** → **Providers**
   - Ensure **Email** is enabled

2. **Email confirmation (development choice)**
   - Dashboard → **Authentication** → **Settings** (or **Email** provider settings)
   - For local MVP development, you may want to **disable email confirmation** temporarily so sign-up creates a session immediately
   - If email confirmation is **enabled**, users must confirm their email before sign-in and session persistence work

3. **Environment variables**
   - Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`
   - Restart the Next.js dev server after changing env vars

### How auth connects to user data

1. User signs in via `AuthModal` (TopBar)
2. `AuthProvider` holds the Supabase session (persisted in browser localStorage by `@supabase/supabase-js`)
3. `getAuthenticatedUserId` returns the signed-in user's id
4. `AppDataProvider` hydrates portfolio, watchlist, notes, alerts, cash, and settings from Supabase
5. Local state changes are persisted to Supabase when authenticated; local/mock mode remains when signed out

### What is NOT persisted to Supabase

- Stock quotes, profiles, logos
- Market/news/financial statement data
- API response caches

## Auth UI entry point

- **Logged out:** TopBar shows “Sign in” and optional “Local mode” badge
- **Logged in:** Avatar with email initials, user menu with sign out and “Synced” badge
