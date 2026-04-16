-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New query)

create table if not exists audits (
  id uuid default gen_random_uuid() primary key,
  clerk_user_id text not null,
  business_name text not null,
  website_url text not null,
  city text,
  industry text,
  goals text,
  status text not null default 'queued',
  error_message text,
  crawl_data jsonb,
  serp_data jsonb,
  psi_data jsonb,
  signal_score integer,
  visibility_score integer,
  trust_score integer,
  conversion_score integer,
  local_presence_score integer,
  offer_clarity_score integer,
  paid_readiness_score integer,
  seo_score integer,
  report_data jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_audits_clerk_user_id on audits (clerk_user_id);

-- Enable RLS (required by Supabase, but we use service role key so it's bypassed)
alter table audits enable row level security;

-- ═══════════════════════════════════════════════════════════
-- MONITORED SITES — One site per user (their dashboard home base)
-- ═══════════════════════════════════════════════════════════
create table if not exists sites (
  id uuid default gen_random_uuid() primary key,
  clerk_user_id text not null unique,
  business_name text not null,
  website_url text not null,
  city text,
  industry text,
  goals text,
  last_scan_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_sites_clerk_user_id on sites (clerk_user_id);
alter table sites enable row level security;

-- ═══════════════════════════════════════════════════════════
-- DAILY SNAPSHOTS — One per day per site (tracks changes over time)
-- ═══════════════════════════════════════════════════════════
create table if not exists snapshots (
  id uuid default gen_random_uuid() primary key,
  site_id uuid not null references sites(id) on delete cascade,
  signal_score integer,
  visibility_score integer,
  trust_score integer,
  conversion_score integer,
  local_presence_score integer,
  seo_score integer,
  performance_score integer,
  -- SERP tracking
  brand_position integer,
  industry_position integer,
  in_local_pack boolean default false,
  competitor_count integer,
  review_count integer,
  avg_rating numeric(2,1),
  -- PageSpeed
  lcp text,
  fcp text,
  cls text,
  mobile_friendly boolean,
  -- Raw data
  crawl_data jsonb,
  serp_data jsonb,
  psi_data jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_snapshots_site_id on snapshots (site_id);
create index if not exists idx_snapshots_created_at on snapshots (created_at desc);
alter table snapshots enable row level security;

-- ═══════════════════════════════════════════════════════════
-- ACTION ITEMS — AI-generated daily signals
-- ═══════════════════════════════════════════════════════════
create table if not exists action_items (
  id uuid default gen_random_uuid() primary key,
  site_id uuid not null references sites(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null, -- 'seo', 'content', 'local', 'conversion', 'speed', 'trust'
  priority text not null default 'medium', -- 'high', 'medium', 'low'
  difficulty text not null default 'easy', -- 'easy', 'medium', 'hard'
  is_completed boolean default false,
  is_locked boolean default false, -- premium items they can see but not access
  impact_score integer not null default 5, -- 1-10, estimated signal score boost
  estimated_minutes integer not null default 15, -- how long this takes to fix
  how_to_fix jsonb default '[]'::jsonb, -- step-by-step instructions array
  completed_at timestamptz, -- when the item was marked complete
  created_at timestamptz default now()
);

create index if not exists idx_action_items_site_id on action_items (site_id);
alter table action_items enable row level security;

-- ═══════════════════════════════════════════════════════════
-- CHAT MESSAGES — AI advisor conversation history
-- ═══════════════════════════════════════════════════════════
create table if not exists chat_messages (
  id uuid default gen_random_uuid() primary key,
  site_id uuid not null references sites(id) on delete cascade,
  role text not null, -- 'user' or 'assistant'
  content text not null,
  created_at timestamptz default now()
);

create index if not exists idx_chat_messages_site_id on chat_messages (site_id);
alter table chat_messages enable row level security;
