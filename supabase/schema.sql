-- ============================================================================
--  KOOTENAY SIGNAL — PRODUCTION DATABASE SCHEMA (PostgreSQL / Supabase)
-- ----------------------------------------------------------------------------
--  Version      : 2026.06.13
--  Target       : Supabase (PostgreSQL 15+)
--  Auth model   : Clerk (external). App accesses the DB ONLY via the
--                 SUPABASE_SERVICE_ROLE_KEY on the server (src/lib/db.ts),
--                 which BYPASSES RLS. The browser never touches the DB.
--
--  Design       : Six application tables (audits, sites, snapshots,
--                 action_items, chat_messages, subscriptions) wrapped with
--                 enterprise infrastructure:
--                   • profiles            — central Clerk user identity
--                   • audit_log + triggers — full change tracking on every
--                                            operational table
--                   • updated_at triggers  — automatic modification stamps
--                   • enum types           — controlled vocabularies
--                   • CHECK constraints     — data integrity
--                   • indexes (btree/GIN/trigram/partial)
--                   • reporting views
--                   • RLS + revoked grants — locked to service role
--                   • schema_migrations    — version tracking
--
--  Idempotent   : Safe to run repeatedly. Intended for a clean project; on an
--                 existing database review before running (CREATE TABLE IF NOT
--                 EXISTS will not alter pre-existing tables).
-- ============================================================================

begin;

-- ============================================================================
-- 0. EXTENSIONS
-- ============================================================================
create extension if not exists pgcrypto;   -- gen_random_uuid()
create extension if not exists pg_trgm;     -- trigram fuzzy search
create extension if not exists citext;      -- case-insensitive text (emails)

-- ============================================================================
-- 1. SCHEMA MIGRATION TRACKING
-- ============================================================================
create table if not exists public.schema_migrations (
  version      text primary key,
  description  text,
  applied_at   timestamptz not null default now()
);

comment on table public.schema_migrations is
  'Tracks which versions of this schema have been applied.';

-- ============================================================================
-- 2. ENUM TYPES (controlled vocabularies)
-- ============================================================================
do $$
begin
  if not exists (select 1 from pg_type where typname = 'audit_status') then
    create type public.audit_status as enum
      ('crawling','enriching','analyzing','complete','failed');
  end if;

  if not exists (select 1 from pg_type where typname = 'action_category') then
    create type public.action_category as enum
      ('seo','local','trust','conversion','speed','content');
  end if;

  if not exists (select 1 from pg_type where typname = 'action_priority') then
    create type public.action_priority as enum ('high','medium','low');
  end if;

  if not exists (select 1 from pg_type where typname = 'action_difficulty') then
    create type public.action_difficulty as enum ('easy','medium','hard');
  end if;

  if not exists (select 1 from pg_type where typname = 'message_role') then
    create type public.message_role as enum ('user','assistant');
  end if;
end$$;

-- ============================================================================
-- 3. UTILITY FUNCTIONS
-- ============================================================================

-- 3.1 Maintain updated_at on UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- 3.2 Generic change-tracking trigger. Logs INSERT/UPDATE/DELETE to audit_log.
--     Heavy JSON blobs are stripped so the audit trail stays lean.
--     Optional actor: SET app.actor = '<clerk_user_id>' on the session.
create or replace function public.fn_audit_trigger()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old   jsonb;
  v_new   jsonb;
  v_pk    uuid;
  v_actor text := nullif(current_setting('app.actor', true), '');
  v_strip text[] := array['crawl_data','serp_data','psi_data','report_data'];
begin
  if tg_op = 'DELETE' then
    v_old := to_jsonb(old) - v_strip;
    v_pk  := old.id;
  elsif tg_op = 'INSERT' then
    v_new := to_jsonb(new) - v_strip;
    v_pk  := new.id;
  else
    v_old := to_jsonb(old) - v_strip;
    v_new := to_jsonb(new) - v_strip;
    v_pk  := new.id;
  end if;

  insert into public.audit_log
    (table_name, record_id, operation, old_data, new_data, changed_by)
  values
    (tg_table_name, v_pk, tg_op, v_old, v_new, v_actor);

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

-- 3.3 Auto-provision a profile row whenever a site/audit is created for a
--     Clerk user that has no profile yet (keeps FK integrity transparent).
create or replace function public.fn_ensure_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (clerk_user_id)
  values (new.clerk_user_id)
  on conflict (clerk_user_id) do nothing;
  return new;
end;
$$;

-- ============================================================================
-- 4. AUDIT LOG (must exist before triggers reference it)
-- ============================================================================
create table if not exists public.audit_log (
  id          bigint generated always as identity primary key,
  table_name  text not null,
  record_id   uuid,
  operation   text not null check (operation in ('INSERT','UPDATE','DELETE')),
  old_data    jsonb,
  new_data    jsonb,
  changed_by  text,
  changed_at  timestamptz not null default now()
);

create index if not exists idx_audit_log_table_record
  on public.audit_log (table_name, record_id);
create index if not exists idx_audit_log_changed_at
  on public.audit_log (changed_at desc);

comment on table public.audit_log is
  'Immutable change history for all operational tables (insert/update/delete).';

-- ============================================================================
-- 5. PROFILES — central Clerk user identity
-- ============================================================================
create table if not exists public.profiles (
  id             uuid primary key default gen_random_uuid(),
  clerk_user_id  text not null unique,
  email          citext,
  display_name   text,
  is_admin       boolean not null default false,
  metadata       jsonb not null default '{}'::jsonb,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

comment on table public.profiles is
  'One row per Clerk user. Auto-provisioned on first site/audit. Source of truth for app users.';
comment on column public.profiles.clerk_user_id is 'Clerk user id (external auth).';
comment on column public.profiles.is_admin is 'Marks internal/admin-portal operators.';

-- ============================================================================
-- 6. AUDITS — one-off "Signal Check" reports (/api/audits)
-- ============================================================================
create table if not exists public.audits (
  id                    uuid primary key default gen_random_uuid(),
  clerk_user_id         text not null
                          references public.profiles (clerk_user_id) on delete cascade,
  business_name         text not null,
  website_url           text not null,
  city                  text,
  industry              text,
  goals                 text,
  status                public.audit_status not null default 'crawling',
  signal_score          integer check (signal_score          between 0 and 100),
  visibility_score      integer check (visibility_score      between 0 and 100),
  trust_score           integer check (trust_score           between 0 and 100),
  conversion_score      integer check (conversion_score      between 0 and 100),
  local_presence_score  integer check (local_presence_score  between 0 and 100),
  offer_clarity_score   integer check (offer_clarity_score   between 0 and 100),
  paid_readiness_score  integer check (paid_readiness_score  between 0 and 100),
  seo_score             integer check (seo_score             between 0 and 100),
  crawl_data            jsonb,
  serp_data             jsonb,
  psi_data              jsonb,
  report_data           jsonb,
  error_message         text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

comment on table public.audits is
  'One-off Signal Check audit reports run from the public funnel.';

-- ============================================================================
-- 7. SITES — one monitored site per user (dashboard) (/api/sites)
-- ============================================================================
create table if not exists public.sites (
  id             uuid primary key default gen_random_uuid(),
  clerk_user_id  text not null unique
                   references public.profiles (clerk_user_id) on delete cascade,
  business_name  text not null,
  website_url    text not null,
  city           text,
  industry       text,
  goals          text,
  last_scan_at   timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

comment on table public.sites is
  'A user''s continuously-monitored website. One per Clerk user (enforced by UNIQUE).';

-- ============================================================================
-- 8. SNAPSHOTS — historical scan results for a site (append-only)
-- ============================================================================
create table if not exists public.snapshots (
  id                    uuid primary key default gen_random_uuid(),
  site_id               uuid not null references public.sites (id) on delete cascade,
  signal_score          integer  check (signal_score          between 0 and 100),
  visibility_score      integer  check (visibility_score      between 0 and 100),
  trust_score           integer  check (trust_score           between 0 and 100),
  conversion_score      integer  check (conversion_score      between 0 and 100),
  local_presence_score  integer  check (local_presence_score  between 0 and 100),
  seo_score             integer  check (seo_score             between 0 and 100),
  performance_score     integer  check (performance_score     between 0 and 100),
  brand_position        integer  check (brand_position    >= 0),
  industry_position     integer  check (industry_position >= 0),
  in_local_pack         boolean,
  competitor_count      integer  check (competitor_count  >= 0),
  review_count          integer  check (review_count      >= 0),
  avg_rating            numeric(3,2) check (avg_rating between 0 and 5),
  lcp                   double precision,
  fcp                   double precision,
  cls                   double precision,
  mobile_friendly       boolean,
  crawl_data            jsonb,
  serp_data             jsonb,
  psi_data              jsonb,
  created_at            timestamptz not null default now()
);

comment on table public.snapshots is
  'Point-in-time scan result for a site. Append-only history (the tracking record).';

-- ============================================================================
-- 9. ACTION_ITEMS — generated fix-it tasks per site
-- ============================================================================
create table if not exists public.action_items (
  id                 uuid primary key default gen_random_uuid(),
  site_id            uuid not null references public.sites (id) on delete cascade,
  title              text not null,
  description        text,
  category           public.action_category,
  priority           public.action_priority,
  difficulty         public.action_difficulty,
  is_locked          boolean not null default false,
  is_completed       boolean not null default false,
  completed_at       timestamptz,
  impact_score       integer check (impact_score between 1 and 10),
  estimated_minutes  integer check (estimated_minutes >= 0),
  how_to_fix         text[],
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

comment on table public.action_items is
  'Actionable recommendations generated per scan; users mark them complete.';

-- ============================================================================
-- 10. CHAT_MESSAGES — AI advisor conversation per site (append-only)
-- ============================================================================
create table if not exists public.chat_messages (
  id          uuid primary key default gen_random_uuid(),
  site_id     uuid not null references public.sites (id) on delete cascade,
  role        public.message_role not null,
  content     text not null,
  created_at  timestamptz not null default now()
);

comment on table public.chat_messages is
  'AI advisor chat log scoped to a site. Append-only.';

-- ============================================================================
-- 11. SUBSCRIPTIONS — Stripe retainer billing (/api/webhooks/stripe)
-- ============================================================================
create table if not exists public.subscriptions (
  id                      uuid primary key default gen_random_uuid(),
  stripe_subscription_id  text not null unique,   -- webhook upsert conflict target
  stripe_customer_id      text,
  stripe_price_id         text,
  plan_name               text,
  plan_slug               text,
  customer_email          citext,
  customer_name           text,
  status                  text,   -- Stripe-driven (active, past_due, canceled, trialing, ...)
  current_period_start    timestamptz,
  current_period_end      timestamptz,
  cancel_at_period_end    boolean not null default false,
  amount                  integer check (amount >= 0),   -- cents
  currency                text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

comment on table public.subscriptions is
  'Stripe subscription mirror for retainer plans. Kept in sync via webhooks.';
comment on column public.subscriptions.status is
  'Raw Stripe status string (kept as text to tolerate new Stripe statuses).';

-- ============================================================================
-- 12. TRIGGERS
-- ============================================================================

-- 12.1 updated_at maintenance
drop trigger if exists trg_profiles_updated_at      on public.profiles;
drop trigger if exists trg_audits_updated_at        on public.audits;
drop trigger if exists trg_sites_updated_at         on public.sites;
drop trigger if exists trg_action_items_updated_at  on public.action_items;
drop trigger if exists trg_subscriptions_updated_at on public.subscriptions;

create trigger trg_profiles_updated_at      before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger trg_audits_updated_at        before update on public.audits
  for each row execute function public.set_updated_at();
create trigger trg_sites_updated_at         before update on public.sites
  for each row execute function public.set_updated_at();
create trigger trg_action_items_updated_at  before update on public.action_items
  for each row execute function public.set_updated_at();
create trigger trg_subscriptions_updated_at before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- 12.2 Auto-provision profiles before site/audit insert
drop trigger if exists trg_sites_ensure_profile  on public.sites;
drop trigger if exists trg_audits_ensure_profile on public.audits;

create trigger trg_sites_ensure_profile  before insert on public.sites
  for each row execute function public.fn_ensure_profile();
create trigger trg_audits_ensure_profile before insert on public.audits
  for each row execute function public.fn_ensure_profile();

-- 12.3 Change tracking (audit_log) on operational tables.
--      (snapshots & chat_messages are append-only and excluded by design.)
drop trigger if exists trg_profiles_audit      on public.profiles;
drop trigger if exists trg_audits_audit        on public.audits;
drop trigger if exists trg_sites_audit         on public.sites;
drop trigger if exists trg_action_items_audit  on public.action_items;
drop trigger if exists trg_subscriptions_audit on public.subscriptions;

create trigger trg_profiles_audit      after insert or update or delete on public.profiles
  for each row execute function public.fn_audit_trigger();
create trigger trg_audits_audit        after insert or update or delete on public.audits
  for each row execute function public.fn_audit_trigger();
create trigger trg_sites_audit         after insert or update or delete on public.sites
  for each row execute function public.fn_audit_trigger();
create trigger trg_action_items_audit  after insert or update or delete on public.action_items
  for each row execute function public.fn_audit_trigger();
create trigger trg_subscriptions_audit after insert or update or delete on public.subscriptions
  for each row execute function public.fn_audit_trigger();

-- ============================================================================
-- 13. INDEXES
-- ============================================================================

-- Profiles
create index if not exists idx_profiles_email on public.profiles (email);

-- Audits
create index if not exists idx_audits_user_created
  on public.audits (clerk_user_id, created_at desc);
create index if not exists idx_audits_status
  on public.audits (status);
create index if not exists idx_audits_business_trgm
  on public.audits using gin (business_name gin_trgm_ops);
create index if not exists idx_audits_report_data
  on public.audits using gin (report_data jsonb_path_ops);

-- Sites
create index if not exists idx_sites_business_trgm
  on public.sites using gin (business_name gin_trgm_ops);

-- Snapshots
create index if not exists idx_snapshots_site_created
  on public.snapshots (site_id, created_at desc);
create index if not exists idx_snapshots_serp_data
  on public.snapshots using gin (serp_data jsonb_path_ops);

-- Action items
create index if not exists idx_action_items_site_created
  on public.action_items (site_id, created_at desc);
create index if not exists idx_action_items_site_open
  on public.action_items (site_id)
  where is_completed = false;

-- Chat
create index if not exists idx_chat_messages_site_created
  on public.chat_messages (site_id, created_at);
create index if not exists idx_chat_messages_site_role_created
  on public.chat_messages (site_id, role, created_at);

-- Subscriptions
create index if not exists idx_subscriptions_customer
  on public.subscriptions (stripe_customer_id);
create index if not exists idx_subscriptions_email
  on public.subscriptions (customer_email);
create index if not exists idx_subscriptions_status
  on public.subscriptions (status);
create index if not exists idx_subscriptions_active
  on public.subscriptions (status)
  where status in ('active','trialing','past_due');

-- ============================================================================
-- 14. REPORTING VIEWS (read-only; honor caller RLS)
-- ============================================================================

create or replace view public.v_site_latest_snapshot as
  select distinct on (s.site_id) s.*
  from public.snapshots s
  order by s.site_id, s.created_at desc;

create or replace view public.v_site_overview as
  select
    si.id                                            as site_id,
    si.clerk_user_id,
    si.business_name,
    si.website_url,
    si.city,
    si.industry,
    si.last_scan_at,
    ls.signal_score,
    ls.visibility_score,
    ls.trust_score,
    ls.conversion_score,
    ls.local_presence_score,
    ls.seo_score,
    ls.performance_score,
    ls.created_at                                    as last_snapshot_at,
    (select count(*) from public.action_items ai
       where ai.site_id = si.id and ai.is_completed = false) as open_action_items,
    (select count(*) from public.action_items ai
       where ai.site_id = si.id and ai.is_completed = true)  as completed_action_items
  from public.sites si
  left join public.v_site_latest_snapshot ls on ls.site_id = si.id;

create or replace view public.v_active_subscriptions as
  select * from public.subscriptions
  where status in ('active','trialing','past_due');

-- Run views with the privileges/RLS of the querying role (PG15+).
alter view public.v_site_latest_snapshot set (security_invoker = true);
alter view public.v_site_overview        set (security_invoker = true);
alter view public.v_active_subscriptions set (security_invoker = true);

-- ============================================================================
-- 15. ROW LEVEL SECURITY + GRANTS (defense in depth)
--     Enable RLS with NO public policies. The server's service_role bypasses
--     RLS; anon/authenticated are additionally stripped of table privileges so
--     a future misconfiguration cannot expose data.
-- ============================================================================
do $$
declare
  t text;
  tables text[] := array[
    'profiles','audits','sites','snapshots','action_items',
    'chat_messages','subscriptions','audit_log','schema_migrations'
  ];
begin
  foreach t in array tables loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('alter table public.%I force row level security;', t);
    execute format('revoke all on public.%I from anon, authenticated;', t);
    execute format('grant all on public.%I to service_role;', t);
  end loop;
end$$;

revoke all on all sequences in schema public from anon, authenticated;
grant  all on all sequences in schema public to   service_role;

-- ============================================================================
-- 16. (OPTIONAL) REALTIME — uncomment to stream dashboard updates to clients.
--     Requires appropriate RLS policies for the subscribing role.
-- ----------------------------------------------------------------------------
-- alter publication supabase_realtime add table public.snapshots;
-- alter publication supabase_realtime add table public.action_items;
-- alter publication supabase_realtime add table public.chat_messages;

-- ============================================================================
-- 17. RECORD THIS MIGRATION
-- ============================================================================
insert into public.schema_migrations (version, description)
values ('2026.06.13', 'Full e2e schema: core tables, profiles, audit log, triggers, enums, indexes, views, RLS.')
on conflict (version) do nothing;

commit;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
