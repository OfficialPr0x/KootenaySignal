-- ================================================================
-- KOOTENAY SIGNAL — Full E2E Supabase Setup
-- Run this in: Supabase Dashboard > SQL Editor > New query
-- One-shot: safe to run on a fresh project
-- ================================================================

-- ----------------------------------------------------------------
-- 0. EXTENSIONS
-- ----------------------------------------------------------------
-- gen_random_uuid() is available via pgcrypto which Supabase enables
-- by default. No extra extension needed.

-- ----------------------------------------------------------------
-- 1. UTILITY — auto-update updated_at trigger
-- ----------------------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ================================================================
-- TABLE: audits
-- Used by: /api/audits (signal-check one-shot reports for auth users)
-- ================================================================
create table if not exists audits (
  id                    uuid        default gen_random_uuid() primary key,
  clerk_user_id         text        not null,
  business_name         text        not null,
  website_url           text        not null,
  city                  text,
  industry              text,
  goals                 text,
  status                text        not null default 'queued',
  -- status values: 'queued' | 'crawling' | 'enriching' | 'analyzing' | 'done' | 'error'
  error_message         text,
  crawl_data            jsonb,
  serp_data             jsonb,
  psi_data              jsonb,
  signal_score          integer,
  visibility_score      integer,
  trust_score           integer,
  conversion_score      integer,
  local_presence_score  integer,
  offer_clarity_score   integer,
  paid_readiness_score  integer,
  seo_score             integer,
  report_data           jsonb,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

create index if not exists idx_audits_clerk_user_id on audits (clerk_user_id);
create index if not exists idx_audits_created_at    on audits (created_at desc);

alter table audits enable row level security;

-- RLS: service role key bypasses all policies. These policies are a
-- safety net if you ever add anon/authenticated reads in the future.
create policy "Service role full access — audits"
  on audits for all
  using (true)
  with check (true);

drop trigger if exists trg_audits_updated_at on audits;
create trigger trg_audits_updated_at
  before update on audits
  for each row execute function set_updated_at();

-- ================================================================
-- TABLE: sites
-- Used by: /api/sites (one monitored site per Clerk user)
-- ================================================================
create table if not exists sites (
  id             uuid        default gen_random_uuid() primary key,
  clerk_user_id  text        not null unique,
  business_name  text        not null,
  website_url    text        not null,
  city           text,
  industry       text,
  goals          text,
  last_scan_at   timestamptz,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create index if not exists idx_sites_clerk_user_id on sites (clerk_user_id);

alter table sites enable row level security;

create policy "Service role full access — sites"
  on sites for all
  using (true)
  with check (true);

drop trigger if exists trg_sites_updated_at on sites;
create trigger trg_sites_updated_at
  before update on sites
  for each row execute function set_updated_at();

-- ================================================================
-- TABLE: snapshots
-- Used by: /api/sites/scan, /api/sites/snapshots
-- One record per daily scan per site — tracks score history
-- ================================================================
create table if not exists snapshots (
  id                    uuid        default gen_random_uuid() primary key,
  site_id               uuid        not null references sites (id) on delete cascade,

  -- Signal scores
  signal_score          integer,
  visibility_score      integer,
  trust_score           integer,
  conversion_score      integer,
  local_presence_score  integer,
  seo_score             integer,
  performance_score     integer,

  -- SERP / local presence
  brand_position        integer,
  industry_position     integer,
  in_local_pack         boolean     default false,
  competitor_count      integer,
  review_count          integer,
  avg_rating            numeric(3, 1),

  -- PageSpeed Core Web Vitals
  lcp                   text,    -- Largest Contentful Paint (e.g. "2.1 s")
  fcp                   text,    -- First Contentful Paint
  cls                   text,    -- Cumulative Layout Shift
  mobile_friendly       boolean,

  -- Raw data blobs for re-processing / debugging
  crawl_data            jsonb,
  serp_data             jsonb,
  psi_data              jsonb,

  created_at            timestamptz default now()
);

create index if not exists idx_snapshots_site_id    on snapshots (site_id);
create index if not exists idx_snapshots_created_at on snapshots (created_at desc);

alter table snapshots enable row level security;

create policy "Service role full access — snapshots"
  on snapshots for all
  using (true)
  with check (true);

-- ================================================================
-- TABLE: action_items
-- Used by: /api/sites/actions (GET list, PATCH complete)
-- AI-generated improvement tasks; refreshed on each scan
-- ================================================================
create table if not exists action_items (
  id                 uuid        default gen_random_uuid() primary key,
  site_id            uuid        not null references sites (id) on delete cascade,

  title              text        not null,
  description        text        not null,
  category           text        not null,
  -- category values: 'seo' | 'content' | 'local' | 'conversion' | 'speed' | 'trust'

  priority           text        not null default 'medium',
  -- priority values: 'high' | 'medium' | 'low'

  difficulty         text        not null default 'easy',
  -- difficulty values: 'easy' | 'medium' | 'hard'

  is_completed       boolean     not null default false,
  is_locked          boolean     not null default false,
  -- is_locked: premium items visible but not actionable without upgrade

  impact_score       integer     not null default 5,   -- 1-10 estimated score boost
  estimated_minutes  integer     not null default 15,  -- estimated fix time in minutes

  how_to_fix         jsonb       not null default '[]'::jsonb,
  -- array of step-by-step instruction strings

  completed_at       timestamptz,
  created_at         timestamptz default now()
);

create index if not exists idx_action_items_site_id on action_items (site_id);

alter table action_items enable row level security;

create policy "Service role full access — action_items"
  on action_items for all
  using (true)
  with check (true);

-- ================================================================
-- TABLE: chat_messages
-- Used by: /api/sites/chat (AI advisor conversation)
-- Rate-limited to 20 user messages per day per site
-- ================================================================
create table if not exists chat_messages (
  id          uuid        default gen_random_uuid() primary key,
  site_id     uuid        not null references sites (id) on delete cascade,
  role        text        not null check (role in ('user', 'assistant')),
  content     text        not null,
  created_at  timestamptz default now()
);

create index if not exists idx_chat_messages_site_id    on chat_messages (site_id);
create index if not exists idx_chat_messages_created_at on chat_messages (created_at desc);

alter table chat_messages enable row level security;

create policy "Service role full access — chat_messages"
  on chat_messages for all
  using (true)
  with check (true);

-- ================================================================
-- DONE
-- All 5 tables created:
--   audits, sites, snapshots, action_items, chat_messages

-- ================================================================
-- TABLE: subscriptions
-- Used by: /api/webhooks/stripe (synced from Stripe events)
-- Tracks all active monthly retainer subscribers
-- ================================================================
create table if not exists subscriptions (
  id                       uuid        default gen_random_uuid() primary key,
  stripe_customer_id       text        not null,
  stripe_subscription_id   text        not null unique,
  stripe_price_id          text,

  plan_name                text        not null,
  plan_slug                text        not null,
  -- plan_slug values: 'automation' | 'seo-retainer' | 'ads-management'
  --                   'signal-core' | 'search-vault' | 'search-sync'

  customer_email           text,
  customer_name            text,

  status                   text        not null default 'active',
  -- status values: 'active' | 'past_due' | 'canceled' | 'unpaid' | 'trialing'

  current_period_start     timestamptz,
  current_period_end       timestamptz,
  cancel_at_period_end     boolean     default false,

  amount                   integer,    -- unit amount in cents (CAD)
  currency                 text        default 'cad',

  created_at               timestamptz default now(),
  updated_at               timestamptz default now()
);

create index if not exists idx_subscriptions_customer_id on subscriptions (stripe_customer_id);
create index if not exists idx_subscriptions_status      on subscriptions (status);
create index if not exists idx_subscriptions_plan_slug   on subscriptions (plan_slug);

alter table subscriptions enable row level security;

create policy "Service role full access — subscriptions"
  on subscriptions for all
  using (true)
  with check (true);

drop trigger if exists trg_subscriptions_updated_at on subscriptions;
create trigger trg_subscriptions_updated_at
  before update on subscriptions
  for each row execute function set_updated_at();

-- ================================================================
-- COMPLETE — All 6 tables:
--   audits, sites, snapshots, action_items, chat_messages,
--   subscriptions
-- ================================================================
