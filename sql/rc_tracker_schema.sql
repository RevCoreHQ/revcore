-- ============================================================
-- RevCore Tracker Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Create the table
create table if not exists public.rc_tracker_data (
  key   text primary key,
  value jsonb not null
);

-- 2. Enable Row Level Security
alter table public.rc_tracker_data enable row level security;

-- 3. Allow the anon key to read and write (tracker uses anon key)
create policy "anon_read_write"
  on public.rc_tracker_data
  for all
  to anon
  using (true)
  with check (true);

-- 4. Enable Realtime so the tracker syncs across devices
alter publication supabase_realtime add table public.rc_tracker_data;
