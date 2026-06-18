-- Launch promo redemption tracking
-- One row per email; unique constraint is the enforcement mechanism.

create table if not exists promo_redemptions (
  id           uuid        default gen_random_uuid() primary key,
  email        text        unique not null,
  promo_code   text        not null,
  report_id    uuid,
  redeemed_at  timestamptz default now()
);

alter table promo_redemptions enable row level security;
