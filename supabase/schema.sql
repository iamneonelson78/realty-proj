-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ============================================================
-- PROFILES (mirrors auth.users)
-- ============================================================
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  full_name text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "profiles: owner only" on profiles
  using (id = auth.uid());

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- LISTINGS
-- ============================================================
create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users on delete cascade,
  title text not null,
  description text,
  price numeric(12,2),
  location text,
  status text not null default 'available' check (status in ('available','occupied')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table listings enable row level security;
create policy "listings: owner select" on listings for select using (owner_id = auth.uid());
create policy "listings: owner insert" on listings for insert with check (owner_id = auth.uid());
create policy "listings: owner update" on listings for update using (owner_id = auth.uid());
create policy "listings: owner delete" on listings for delete using (owner_id = auth.uid());

create index if not exists listings_owner_status on listings(owner_id, status);

-- ============================================================
-- LEADS
-- ============================================================
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users on delete cascade,
  listing_id uuid references listings on delete set null,
  name text not null,
  contact_number text,
  source text not null default 'manual' check (source in ('facebook','sms','manual')),
  status text not null default 'new' check (status in ('new','contacted','viewing','reserved','closed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table leads enable row level security;
create policy "leads: owner select" on leads for select using (owner_id = auth.uid());
create policy "leads: owner insert" on leads for insert with check (owner_id = auth.uid());
create policy "leads: owner update" on leads for update using (owner_id = auth.uid());
create policy "leads: owner delete" on leads for delete using (owner_id = auth.uid());

create index if not exists leads_owner_status on leads(owner_id, status);

-- ============================================================
-- LEAD MESSAGES
-- ============================================================
create table if not exists lead_messages (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads on delete cascade,
  owner_id uuid not null references auth.users on delete cascade,
  body text not null,
  created_at timestamptz default now()
);

alter table lead_messages enable row level security;
create policy "lead_messages: owner select" on lead_messages for select using (owner_id = auth.uid());
create policy "lead_messages: owner insert" on lead_messages for insert with check (owner_id = auth.uid());
create policy "lead_messages: owner delete" on lead_messages for delete using (owner_id = auth.uid());

-- ============================================================
-- REMINDERS
-- ============================================================
create table if not exists reminders (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users on delete cascade,
  lead_id uuid references leads on delete cascade,
  title text not null,
  remind_at timestamptz not null,
  done boolean not null default false,
  created_at timestamptz default now()
);

alter table reminders enable row level security;
create policy "reminders: owner select" on reminders for select using (owner_id = auth.uid());
create policy "reminders: owner insert" on reminders for insert with check (owner_id = auth.uid());
create policy "reminders: owner update" on reminders for update using (owner_id = auth.uid());
create policy "reminders: owner delete" on reminders for delete using (owner_id = auth.uid());

create index if not exists reminders_upcoming on reminders(owner_id, remind_at) where done = false;

-- ============================================================
-- APPOINTMENTS
-- ============================================================
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users on delete cascade,
  lead_id uuid references leads on delete cascade,
  listing_id uuid references listings on delete set null,
  scheduled_at timestamptz not null,
  notes text,
  created_at timestamptz default now()
);

alter table appointments enable row level security;
create policy "appointments: owner select" on appointments for select using (owner_id = auth.uid());
create policy "appointments: owner insert" on appointments for insert with check (owner_id = auth.uid());
create policy "appointments: owner update" on appointments for update using (owner_id = auth.uid());
create policy "appointments: owner delete" on appointments for delete using (owner_id = auth.uid());
