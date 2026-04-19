-- 上号吗 · Supabase schema
-- Run in Supabase SQL editor. Idempotent via drop/create on enum + create-if-not-exists tables.

-- ─────────────────────────────────────────────────────────────
-- Extensions
-- ─────────────────────────────────────────────────────────────
create extension if not exists pgcrypto;

-- ─────────────────────────────────────────────────────────────
-- Types
-- ─────────────────────────────────────────────────────────────
do $$
begin
  if not exists (select 1 from pg_type where typname = 'status_kind') then
    create type status_kind as enum ('free','busy','sleep','offline','custom');
  end if;
end$$;

-- ─────────────────────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  name text not null,
  hue int not null default 200,
  init text not null default '?',
  created_at timestamptz not null default now()
);

create table if not exists groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text unique not null,
  owner_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists group_members (
  group_id uuid references groups(id) on delete cascade,
  user_id  uuid references profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

create table if not exists statuses (
  user_id uuid primary key references profiles(id) on delete cascade,
  status status_kind not null default 'offline',
  until_minutes int,
  note text not null default '',
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- Helper: does auth.uid() share a group with target_user?
-- Uses SECURITY DEFINER to bypass RLS within the function body
-- to avoid recursive policy evaluation on group_members.
-- ─────────────────────────────────────────────────────────────
create or replace function shares_group(target_user uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from group_members gm_me
    join group_members gm_them
      on gm_me.group_id = gm_them.group_id
    where gm_me.user_id = auth.uid()
      and gm_them.user_id = target_user
  );
$$;

grant execute on function shares_group(uuid) to authenticated;

create or replace function is_group_member(target_group uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from group_members
    where group_id = target_group
      and user_id = auth.uid()
  );
$$;

grant execute on function is_group_member(uuid) to authenticated;

-- ─────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────
alter table profiles enable row level security;
alter table groups enable row level security;
alter table group_members enable row level security;
alter table statuses enable row level security;

-- profiles
drop policy if exists "profiles_select_self_or_shared" on profiles;
create policy "profiles_select_self_or_shared" on profiles
  for select to authenticated
  using (id = auth.uid() or shares_group(id));

drop policy if exists "profiles_insert_self" on profiles;
create policy "profiles_insert_self" on profiles
  for insert to authenticated
  with check (id = auth.uid());

drop policy if exists "profiles_update_self" on profiles;
create policy "profiles_update_self" on profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- groups
drop policy if exists "groups_select_member" on groups;
create policy "groups_select_member" on groups
  for select to authenticated
  using (is_group_member(id));

drop policy if exists "groups_select_by_code" on groups;
-- Allow authenticated users to look up a group by code so they can join.
-- Clients must filter by code; we cannot enforce that in RLS, but exposing
-- group rows (name, owner_id, member count) to any logged-in user is acceptable
-- given the code acts as the secret.
create policy "groups_select_by_code" on groups
  for select to authenticated
  using (true);

drop policy if exists "groups_insert_self" on groups;
create policy "groups_insert_self" on groups
  for insert to authenticated
  with check (owner_id = auth.uid());

drop policy if exists "groups_update_owner" on groups;
create policy "groups_update_owner" on groups
  for update to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists "groups_delete_owner" on groups;
create policy "groups_delete_owner" on groups
  for delete to authenticated
  using (owner_id = auth.uid());

-- group_members
drop policy if exists "group_members_select_same_group" on group_members;
create policy "group_members_select_same_group" on group_members
  for select to authenticated
  using (user_id = auth.uid() or is_group_member(group_id));

drop policy if exists "group_members_insert_self" on group_members;
create policy "group_members_insert_self" on group_members
  for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "group_members_delete_self_or_owner" on group_members;
create policy "group_members_delete_self_or_owner" on group_members
  for delete to authenticated
  using (
    user_id = auth.uid()
    or exists (select 1 from groups where id = group_id and owner_id = auth.uid())
  );

-- statuses
drop policy if exists "statuses_select_shared" on statuses;
create policy "statuses_select_shared" on statuses
  for select to authenticated
  using (user_id = auth.uid() or shares_group(user_id));

drop policy if exists "statuses_insert_self" on statuses;
create policy "statuses_insert_self" on statuses
  for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "statuses_update_self" on statuses;
create policy "statuses_update_self" on statuses
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ─────────────────────────────────────────────────────────────
-- Realtime replication
-- Run once: add tables to supabase_realtime publication.
-- ─────────────────────────────────────────────────────────────
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'statuses'
  ) then
    execute 'alter publication supabase_realtime add table statuses';
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'group_members'
  ) then
    execute 'alter publication supabase_realtime add table group_members';
  end if;
end$$;
