-- RevCore Scraper Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- 1. Scrape sessions (history)
create table if not exists public.rc_scrape_sessions (
  id            text primary key,
  query         text not null,
  location      text not null,
  max_requested integer not null default 50,
  total_found   integer not null default 0,
  new_contacts  integer not null default 0,
  dupes_found   integer not null default 0,
  status        text not null default 'completed',
  created_at    timestamptz not null default now()
);

alter table public.rc_scrape_sessions enable row level security;
create policy "anon_all_scrape_sessions" on public.rc_scrape_sessions
  for all to anon using (true) with check (true);

-- 2. Master contacts (deduplicated by place_id)
create table if not exists public.rc_scraped_contacts (
  place_id           text primary key,
  business_name      text not null,
  phone              text,
  email              text,
  website            text,
  address            text,
  city               text,
  state              text,
  rating             real default 0,
  reviews            integer default 0,
  category           text,
  google_url         text,
  lat                real default 0,
  lng                real default 0,
  claim_status       text,
  permanently_closed boolean default false,
  opening_hours      jsonb,
  additional_info    jsonb,
  phone_valid        boolean,
  phone_type         text,
  carrier            text,
  phone_verified_at  timestamptz,
  first_scraped_at   timestamptz not null default now(),
  last_seen_at       timestamptz not null default now(),
  scrape_session_id  text references rc_scrape_sessions(id)
);

alter table public.rc_scraped_contacts enable row level security;
create policy "anon_all_scraped_contacts" on public.rc_scraped_contacts
  for all to anon using (true) with check (true);

create index if not exists idx_contacts_phone on public.rc_scraped_contacts(phone);
create index if not exists idx_contacts_city_state on public.rc_scraped_contacts(city, state);

-- 3. Junction table (session ↔ contacts)
create table if not exists public.rc_session_contacts (
  session_id  text not null references rc_scrape_sessions(id),
  place_id    text not null references rc_scraped_contacts(place_id),
  is_new      boolean not null default true,
  primary key (session_id, place_id)
);

alter table public.rc_session_contacts enable row level security;
create policy "anon_all_session_contacts" on public.rc_session_contacts
  for all to anon using (true) with check (true);
