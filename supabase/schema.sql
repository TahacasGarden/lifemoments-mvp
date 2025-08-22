-- Supabase schema for LifeMoments

create extension if not exists "pgcrypto";

-- 1) Profiles linked to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2) Types and tables
do $$ begin
  if not exists (select 1 from pg_type where typname = 'entry_visibility') then
    create type entry_visibility as enum ('private','family','public');
  end if;
end $$;

create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text,
  media_type text check (media_type in ('text','audio','video')) default 'text',
  media_path text,
  summary text,
  tags text[] default '{}',
  visibility entry_visibility not null default 'private',
  scheduled_at timestamptz,
  delivered boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.shares (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  token text unique not null,
  label text,
  allowed_visibility entry_visibility[] not null default array['family','public']::entry_visibility[],
  created_at timestamptz default now(),
  expires_at timestamptz
);

create table if not exists public.trusted_viewers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  viewer_email text not null,
  created_at timestamptz default now()
);

create table if not exists public.entry_activity (
  id bigserial primary key,
  entry_id uuid not null references public.entries(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  action text check (action in ('create','view','resurface')),
  created_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.entries enable row level security;
alter table public.shares enable row level security;
alter table public.trusted_viewers enable row level security;
alter table public.entry_activity enable row level security;

-- Profiles: self read/update
drop policy if exists "profiles self read" on public.profiles;
create policy "profiles self read"
on public.profiles for select to authenticated
using (id = auth.uid());

drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update"
on public.profiles for update to authenticated
using (id = auth.uid());

-- Entries: owner CRUD
drop policy if exists "entries owner crud" on public.entries;
create policy "entries owner crud"
on public.entries for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Entries readable to trusted viewers (family/public only)
drop policy if exists "entries readable to trusted viewers" on public.entries;
create policy "entries readable to trusted viewers"
on public.entries for select to authenticated
using (
  visibility in ('family','public')
  and exists (
    select 1 from public.trusted_viewers tv
    where tv.owner_id = entries.user_id
      and tv.viewer_email = auth.jwt()->>'email'
  )
);

-- Shares: owner CRUD
drop policy if exists "shares owner crud" on public.shares;
create policy "shares owner crud"
on public.shares for all to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

-- Trusted viewers: owner CRUD
drop policy if exists "trusted viewers owner crud" on public.trusted_viewers;
create policy "trusted viewers owner crud"
on public.trusted_viewers for all to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

-- Activity: owner insert/select
drop policy if exists "activity owner insert" on public.entry_activity;
create policy "activity owner insert"
on public.entry_activity for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "activity owner select" on public.entry_activity;
create policy "activity owner select"
on public.entry_activity for select to authenticated
using (user_id = auth.uid());
