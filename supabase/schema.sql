-- ============================================================================
-- #Foodie — Supabase schema (Phase 3)
-- Paste this whole file into: Supabase dashboard → SQL Editor → New query → Run.
-- Safe to re-run (uses IF NOT EXISTS / drop-and-recreate for policies).
--
-- What it creates:
--   • profiles   — one row per user; holds the app state blob (Phase 3 sync)
--   • weeks      — saved weeks history (used by later phases)
--   • favorites  — saved recipes    (used by later phases)
--   • photos     — metadata for user dish photos (files live in Storage)
--   • user_dishes — dishes the user added themselves ("Add a dish I love", V3 §0.7)
--   • Row-Level Security so each user can only ever see/change their OWN rows
--   • a private "dish-photos" Storage bucket + owner-only access policies
-- ============================================================================

-- ---- profiles: the per-user app document (Phase 3 stores everything here) ----
create table if not exists public.profiles (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  state       jsonb not null default '{}'::jsonb,   -- { profile, week, favorites, useAI, checked }
  updated_at  timestamptz not null default now()
);

-- ---- weeks: history of saved weeks (later phases: "Browse & add" carousels) ----
create table if not exists public.weeks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  week_start  date,
  week        jsonb not null,
  created_at  timestamptz not null default now()
);
create index if not exists weeks_user_idx on public.weeks (user_id, created_at desc);

-- ---- favorites: saved recipes ----
create table if not exists public.favorites (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  recipe      jsonb not null,
  created_at  timestamptz not null default now()
);
create index if not exists favorites_user_idx on public.favorites (user_id, created_at desc);

-- ---- photos: metadata for user dish photos (files stored in Storage) ----
create table if not exists public.photos (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  recipe_name   text,
  storage_path  text not null,
  created_at    timestamptz not null default now()
);
create index if not exists photos_user_idx on public.photos (user_id, created_at desc);

-- ---- user_dishes: dishes the user added via "Add a dish I love" (V3 §0.7) ----
-- One row per dish, stored in the recipes-db.js shape. `verified` means the user
-- confirmed the allergen list — an unverified dish must NEVER enter meal generation.
create table if not exists public.user_dishes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  dish        jsonb not null,          -- one object in the recipes-db.js shape
  source      text,                    -- 'name' | 'text' | 'url' | 'photo'
  verified    boolean not null default false,   -- user confirmed the allergens
  created_at  timestamptz not null default now()
);
create index if not exists user_dishes_user_idx on public.user_dishes (user_id, created_at desc);

-- ============================================================================
-- Row-Level Security: owner-only access on every table
-- ============================================================================
alter table public.profiles     enable row level security;
alter table public.weeks        enable row level security;
alter table public.favorites    enable row level security;
alter table public.photos       enable row level security;
alter table public.user_dishes  enable row level security;

do $$
declare t text;
begin
  foreach t in array array['profiles','weeks','favorites','photos','user_dishes'] loop
    execute format('drop policy if exists "owner_all_%1$s" on public.%1$I;', t);
    execute format($f$
      create policy "owner_all_%1$s" on public.%1$I
        for all
        using (auth.uid() = user_id)
        with check (auth.uid() = user_id);
    $f$, t);
  end loop;
end $$;

-- ============================================================================
-- Storage: private "dish-photos" bucket + owner-only policies
-- Files are stored under a per-user folder:  <user_id>/<timestamp>-<dish>.jpg
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('dish-photos', 'dish-photos', false)
on conflict (id) do nothing;

drop policy if exists "dish_photos_owner_all" on storage.objects;
create policy "dish_photos_owner_all" on storage.objects
  for all
  using (bucket_id = 'dish-photos' and auth.uid()::text = (storage.foldername(name))[1])
  with check (bucket_id = 'dish-photos' and auth.uid()::text = (storage.foldername(name))[1]);
