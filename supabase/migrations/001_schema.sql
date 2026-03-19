-- Reports table: stores generated reports linked to Stripe sessions
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique not null,
  email text,
  plan text not null check (plan in ('one-time', 'monthly')),
  report_data jsonb not null,
  created_at timestamptz not null default now()
);

-- RLS: no public access — all access via service role only
alter table reports enable row level security;

-- Waitlist table: stores emails for monthly plan waitlist
create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text,
  joined_at timestamptz not null default now()
);

-- RLS: no public access — all access via service role only
alter table waitlist enable row level security;
