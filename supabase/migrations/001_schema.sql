-- Reports table: stores generated reports
create table if not exists reports (
  id            uuid primary key default gen_random_uuid(),
  payment_id    text,                          -- Lemon Squeezy order ID (set after payment)
  email         text,
  first_name    text,
  plan          text not null default 'one-time',
  report_data   jsonb not null,
  is_paid       boolean not null default false,
  -- Email sequence tracking
  email_sent_at  timestamptz,
  d3_email_sent  boolean not null default false,
  d7_email_sent  boolean not null default false,
  d30_email_sent boolean not null default false,
  created_at    timestamptz not null default now()
);

alter table reports enable row level security;

-- Waitlist table
create table if not exists waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  first_name text,
  source     text,
  joined_at  timestamptz not null default now()
);

alter table waitlist enable row level security;
