-- Equi user-owned data schema
-- Provider-owned market data is NOT stored here.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- portfolio_holdings
-- ---------------------------------------------------------------------------

create table public.portfolio_holdings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  symbol text not null,
  shares numeric not null,
  average_cost numeric not null,
  purchase_currency text not null default 'USD',
  purchase_date date,
  account_name text,
  account_type text,
  target_allocation_percent numeric,
  strategy_tag text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index portfolio_holdings_user_id_idx on public.portfolio_holdings (user_id);
create index portfolio_holdings_symbol_idx on public.portfolio_holdings (symbol);

create trigger portfolio_holdings_set_updated_at
before update on public.portfolio_holdings
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- cash_balances
-- ---------------------------------------------------------------------------

create table public.cash_balances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  amount numeric not null default 0,
  currency text not null default 'USD',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, currency)
);

create trigger cash_balances_set_updated_at
before update on public.cash_balances
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- watchlist_items
-- ---------------------------------------------------------------------------

create table public.watchlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  symbol text not null,
  buy_zone_min numeric,
  buy_zone_max numeric,
  target_price numeric,
  priority text,
  status text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, symbol)
);

create trigger watchlist_items_set_updated_at
before update on public.watchlist_items
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- stock_notes
-- ---------------------------------------------------------------------------

create table public.stock_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  symbol text not null,
  thesis text,
  what_to_watch text,
  sell_if text,
  general_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, symbol)
);

create trigger stock_notes_set_updated_at
before update on public.stock_notes
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- user_alerts
-- ---------------------------------------------------------------------------

create table public.user_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  symbol text,
  alert_type text not null,
  target_value numeric,
  priority text,
  status text not null default 'active',
  note text,
  snoozed_until timestamptz,
  triggered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index user_alerts_user_id_idx on public.user_alerts (user_id);
create index user_alerts_symbol_idx on public.user_alerts (symbol);
create index user_alerts_status_idx on public.user_alerts (status);

create trigger user_alerts_set_updated_at
before update on public.user_alerts
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- user_settings
-- ---------------------------------------------------------------------------

create table public.user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade unique,
  display_currency text default 'USD',
  language text default 'en',
  general_settings jsonb not null default '{}'::jsonb,
  appearance_settings jsonb not null default '{}'::jsonb,
  portfolio_settings jsonb not null default '{}'::jsonb,
  scoring_settings jsonb not null default '{}'::jsonb,
  alerts_settings jsonb not null default '{}'::jsonb,
  ai_preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger user_settings_set_updated_at
before update on public.user_settings
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.portfolio_holdings enable row level security;
alter table public.cash_balances enable row level security;
alter table public.watchlist_items enable row level security;
alter table public.stock_notes enable row level security;
alter table public.user_alerts enable row level security;
alter table public.user_settings enable row level security;

-- profiles
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create policy "profiles_delete_own" on public.profiles
  for delete using (auth.uid() = id);

-- portfolio_holdings
create policy "portfolio_holdings_select_own" on public.portfolio_holdings
  for select using (auth.uid() = user_id);

create policy "portfolio_holdings_insert_own" on public.portfolio_holdings
  for insert with check (auth.uid() = user_id);

create policy "portfolio_holdings_update_own" on public.portfolio_holdings
  for update using (auth.uid() = user_id);

create policy "portfolio_holdings_delete_own" on public.portfolio_holdings
  for delete using (auth.uid() = user_id);

-- cash_balances
create policy "cash_balances_select_own" on public.cash_balances
  for select using (auth.uid() = user_id);

create policy "cash_balances_insert_own" on public.cash_balances
  for insert with check (auth.uid() = user_id);

create policy "cash_balances_update_own" on public.cash_balances
  for update using (auth.uid() = user_id);

create policy "cash_balances_delete_own" on public.cash_balances
  for delete using (auth.uid() = user_id);

-- watchlist_items
create policy "watchlist_items_select_own" on public.watchlist_items
  for select using (auth.uid() = user_id);

create policy "watchlist_items_insert_own" on public.watchlist_items
  for insert with check (auth.uid() = user_id);

create policy "watchlist_items_update_own" on public.watchlist_items
  for update using (auth.uid() = user_id);

create policy "watchlist_items_delete_own" on public.watchlist_items
  for delete using (auth.uid() = user_id);

-- stock_notes
create policy "stock_notes_select_own" on public.stock_notes
  for select using (auth.uid() = user_id);

create policy "stock_notes_insert_own" on public.stock_notes
  for insert with check (auth.uid() = user_id);

create policy "stock_notes_update_own" on public.stock_notes
  for update using (auth.uid() = user_id);

create policy "stock_notes_delete_own" on public.stock_notes
  for delete using (auth.uid() = user_id);

-- user_alerts
create policy "user_alerts_select_own" on public.user_alerts
  for select using (auth.uid() = user_id);

create policy "user_alerts_insert_own" on public.user_alerts
  for insert with check (auth.uid() = user_id);

create policy "user_alerts_update_own" on public.user_alerts
  for update using (auth.uid() = user_id);

create policy "user_alerts_delete_own" on public.user_alerts
  for delete using (auth.uid() = user_id);

-- user_settings
create policy "user_settings_select_own" on public.user_settings
  for select using (auth.uid() = user_id);

create policy "user_settings_insert_own" on public.user_settings
  for insert with check (auth.uid() = user_id);

create policy "user_settings_update_own" on public.user_settings
  for update using (auth.uid() = user_id);

create policy "user_settings_delete_own" on public.user_settings
  for delete using (auth.uid() = user_id);
