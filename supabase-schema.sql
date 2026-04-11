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
