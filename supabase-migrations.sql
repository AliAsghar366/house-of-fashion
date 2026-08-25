-- ═══════════════════════════════════════════════════════════════
-- House of Fashion — Full Database Schema
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

create extension if not exists "uuid-ossp";

-- ─── 1. User Profiles ─────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  phone text default '',
  avatar_url text default '',
  address text default '',
  city text default '',
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, is_admin)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.email, ''),
    coalesce((new.raw_user_meta_data->>'is_admin')::boolean, false)
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── 2. Admin Settings (password-only login) ─────────────────
-- Password hash for admin login (default: "admin123")
-- To change: UPDATE admin_settings SET password_hash = '<new_sha256_hash>';
create table if not exists public.admin_settings (
  id int primary key default 1,
  password_hash text not null,
  updated_at timestamptz not null default now()
);

insert into public.admin_settings (id, password_hash)
values (1, '240be518fabd2724ddb6f05eeb57ef4b491a0e68f68e1c53f91e5aa6e463b31f')
on conflict (id) do nothing;

alter table public.admin_settings enable row level security;
create policy "admin_settings_public_read" on public.admin_settings for select using (true);
create policy "admin_settings_admin_update" on public.admin_settings for update using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);

-- ─── 3. Orders ────────────────────────────────────────────────
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  order_code text unique not null,
  user_id uuid references public.profiles(id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null default '',
  items jsonb not null default '[]'::jsonb,
  payment_method text not null default 'cod',
  receipt_url text default '',
  subtotal numeric not null default 0,
  shipping numeric not null default 0,
  grand_total numeric not null default 0,
  status text not null default 'pending'
    check (status in ('pending','accepted','shipped','payment_received','delivered','declined','closed')),
  status_history jsonb not null default '[]'::jsonb,
  notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── 4. Reviews ───────────────────────────────────────────────
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  product_slug text not null,
  rating int not null check (rating between 1 and 5),
  title text not null default '',
  body text not null default '',
  helpful_count int not null default 0,
  created_at timestamptz not null default now()
);

-- ─── 5. Support Tickets ───────────────────────────────────────
create table if not exists public.support_tickets (
  id uuid primary key default uuid_generate_v4(),
  ticket_code text unique not null,
  user_id uuid references public.profiles(id) on delete set null,
  name text not null,
  email text not null,
  subject text not null,
  category text not null default 'general'
    check (category in ('general','order','payment','shipping','return','technical','other')),
  message text not null,
  status text not null default 'open'
    check (status in ('open','in_progress','resolved','closed')),
  priority text not null default 'normal'
    check (priority in ('low','normal','high','urgent')),
  admin_reply text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── 6. Wishlist ──────────────────────────────────────────────
create table if not exists public.wishlists (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  product_slug text not null,
  created_at timestamptz not null default now(),
  unique(user_id, product_slug)
);

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════

alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.reviews enable row level security;
alter table public.support_tickets enable row level security;
alter table public.wishlists enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

create policy "orders_select_own" on public.orders for select using (auth.uid() = user_id);
create policy "orders_insert_own" on public.orders for insert with check (auth.uid() = user_id or user_id is null);
create policy "orders_track_by_code" on public.orders for select using (true);

create policy "reviews_select_public" on public.reviews for select using (true);
create policy "reviews_insert_own" on public.reviews for insert with check (auth.uid() = user_id);
create policy "reviews_update_own" on public.reviews for update using (auth.uid() = user_id);
create policy "reviews_delete_own" on public.reviews for delete using (auth.uid() = user_id);

create policy "tickets_select_own" on public.support_tickets for select using (auth.uid() = user_id);
create policy "tickets_insert_own" on public.support_tickets for insert with check (auth.uid() = user_id or user_id is null);

create policy "wishlists_select_own" on public.wishlists for select using (auth.uid() = user_id);
create policy "wishlists_insert_own" on public.wishlists for insert with check (auth.uid() = user_id);
create policy "wishlists_delete_own" on public.wishlists for delete using (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════════

create index if not exists idx_orders_user on public.orders(user_id);
create index if not exists idx_orders_code on public.orders(order_code);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_reviews_product on public.reviews(product_slug);
create index if not exists idx_reviews_user on public.reviews(user_id);
create index if not exists idx_tickets_user on public.support_tickets(user_id);
create index if not exists idx_tickets_code on public.support_tickets(ticket_code);
create index if not exists idx_wishlists_user on public.wishlists(user_id);
