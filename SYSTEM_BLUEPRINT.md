# Kootenay Signal — V1 System Blueprint

> **One sentence:** A business intelligence layer for local companies that tracks leads, calls, traffic, and attribution — then proves ROI on a dashboard they actually understand.

---

## What This Document Covers

1. [Architecture Overview](#1-architecture-overview)
2. [Database Schema](#2-database-schema)
3. [Tracking Script (ks-track.js)](#3-tracking-script)
4. [Ingestion API](#4-ingestion-api)
5. [Call Tracking](#5-call-tracking)
6. [Form Tracking](#6-form-tracking)
7. [Attribution Engine](#7-attribution-engine)
8. [Signal Score System](#8-signal-score-system)
9. [Dashboard UI](#9-dashboard-ui)
10. [Client Onboarding Flow](#10-client-onboarding-flow)
11. [Automation Layer](#11-automation-layer)
12. [Integrations (Phase 2)](#12-integrations-phase-2)
13. [Deployment & Infrastructure](#13-deployment--infrastructure)
14. [Implementation Phases](#14-implementation-phases)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                  CLIENT WEBSITE                      │
│                                                      │
│  <script src="https://signal.kootenaysignal.com      │
│    /ks-track.js"></script>                            │
│  <script>KS.init({ businessId: "abc123" })</script>  │
└──────────────┬──────────────────────┬────────────────┘
               │                      │
          auto-track              manual track
        (page views,           (form submits,
         referrer,              button clicks)
         UTM params)
               │                      │
               ▼                      ▼
┌──────────────────────────────────────────────────────┐
│              INGESTION API                            │
│         POST /api/events                              │
│                                                       │
│  Validates → Enriches (geo, device) → Stores          │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│              SUPABASE (POSTGRES)                      │
│                                                       │
│  businesses │ events │ leads │ calls │ signal_scores  │
└──────────────────────┬───────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
┌──────────────────┐   ┌──────────────────────────────┐
│  ATTRIBUTION     │   │  SIGNAL SCORE ENGINE          │
│  ENGINE          │   │  (daily snapshots)            │
│                  │   │                                │
│  UTM → source    │   │  visibility + trust +          │
│  referrer → med  │   │  conversion + local +          │
│  session → path  │   │  offer clarity = score         │
└────────┬─────────┘   └──────────────┬────────────────┘
         │                            │
         ▼                            ▼
┌──────────────────────────────────────────────────────┐
│              DASHBOARD UI                             │
│                                                       │
│  Leads today │ Source breakdown │ Growth chart         │
│  Signal Score │ Call log │ Weekly trend                │
└──────────────────────────────────────────────────────┘
```

### Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js 16 (App Router) | Already in use, SSR + API routes |
| Auth | Clerk | Already in use, handles multi-tenant |
| Database | Supabase (Postgres) | Already in use, real-time, RLS |
| Tracking | Custom JS (~3KB) | No dependencies, fast, privacy-first |
| Call tracking | Twilio | Programmable numbers, webhooks |
| Email/alerts | Resend | Simple transactional email |
| Hosting | Vercel | Zero-config Next.js deploys |

---

## 2. Database Schema

### Existing table (keep as-is)

```sql
-- audits: Signal Check results (already exists)
-- No changes needed
```

### New tables

```sql
-- ═══════════════════════════════════════════
-- BUSINESSES — Client accounts
-- ═══════════════════════════════════════════
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  domain TEXT NOT NULL,
  city TEXT,
  industry TEXT,
  phone TEXT,
  tracking_id TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(8), 'hex'),
  -- tracking_id is what goes in KS.init({ businessId: "..." })
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX idx_businesses_clerk ON businesses(clerk_user_id);
CREATE UNIQUE INDEX idx_businesses_tracking ON businesses(tracking_id);


-- ═══════════════════════════════════════════
-- EVENTS — Raw event stream
-- ═══════════════════════════════════════════
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  -- event_type: page_view | form_submit | phone_call | click | custom
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  session_id TEXT,
  visitor_id TEXT,
  -- visitor_id: anonymous fingerprint (no PII)
  page_url TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  metadata JSONB DEFAULT '{}',
  -- metadata: flexible payload per event type
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_events_business ON events(business_id, timestamp DESC);
CREATE INDEX idx_events_type ON events(business_id, event_type, timestamp DESC);


-- ═══════════════════════════════════════════
-- LEADS — Identified contacts
-- ═══════════════════════════════════════════
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  phone TEXT,
  source TEXT,
  -- source: google_organic | google_ads | facebook | direct | referral | unknown
  medium TEXT,
  campaign TEXT,
  referrer TEXT,
  page_url TEXT,
  form_id TEXT,
  status TEXT DEFAULT 'new',
  -- status: new | contacted | qualified | won | lost
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_leads_business ON leads(business_id, created_at DESC);
CREATE INDEX idx_leads_status ON leads(business_id, status);


-- ═══════════════════════════════════════════
-- CALLS — Phone call log
-- ═══════════════════════════════════════════
CREATE TABLE calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  tracking_number TEXT NOT NULL,
  caller_number TEXT,
  duration_seconds INTEGER DEFAULT 0,
  status TEXT DEFAULT 'completed',
  -- status: completed | missed | voicemail
  source TEXT,
  medium TEXT,
  campaign TEXT,
  recording_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_calls_business ON calls(business_id, created_at DESC);


-- ═══════════════════════════════════════════
-- SIGNAL_SCORES — Daily snapshots
-- ═══════════════════════════════════════════
CREATE TABLE signal_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  score_date DATE NOT NULL DEFAULT CURRENT_DATE,
  signal_score NUMERIC(5,2),
  visibility_score NUMERIC(5,2),
  trust_score NUMERIC(5,2),
  conversion_score NUMERIC(5,2),
  local_presence_score NUMERIC(5,2),
  offer_clarity_score NUMERIC(5,2),
  lead_count INTEGER DEFAULT 0,
  call_count INTEGER DEFAULT 0,
  page_view_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(business_id, score_date)
);

CREATE INDEX idx_scores_business ON signal_scores(business_id, score_date DESC);


-- ═══════════════════════════════════════════
-- TRACKING_NUMBERS — Twilio number pool
-- ═══════════════════════════════════════════
CREATE TABLE tracking_numbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
  twilio_number TEXT UNIQUE NOT NULL,
  forward_to TEXT,
  -- forward_to: the business's real phone number
  is_active BOOLEAN DEFAULT true,
  assigned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 3. Tracking Script

### What it is

A lightweight (~3KB gzipped) JavaScript snippet that clients drop on their website. One line. No config beyond their business ID.

### Install (client-side)

```html
<!-- Kootenay Signal Tracking — paste before </body> -->
<script src="https://signal.kootenaysignal.com/ks-track.js"></script>
<script>KS.init({ businessId: "abc123" })</script>
```

That's it. One copy-paste.

### What it does automatically

| Signal | How |
|--------|-----|
| Page views | Fires on every page load + SPA navigation |
| Referrer | `document.referrer` captured on first hit |
| UTM parameters | Parsed from URL, stored in sessionStorage |
| Session tracking | Random session ID, persists per tab |
| Visitor ID | Anonymous hash stored in localStorage (no cookies, no PII) |
| Device info | Screen size, mobile/desktop (from user agent) |

### Manual tracking (optional)

```js
// Track a form submission
KS.track("form_submit", {
  form_id: "contact",
  name: "John",
  email: "john@example.com",
  phone: "250-555-1234"
});

// Track a button click
KS.track("click", {
  button_id: "call_now",
  label: "Call Now Button"
});

// Track a custom event
KS.track("quote_request", {
  service: "deck_building",
  budget: "5000-10000"
});
```

### Script architecture

```
ks-track.js
├── KS.init(config)          → sets businessId, starts auto-tracking
├── KS.track(event, data)    → manual event push
├── _autoTrack()             → page_view on load + popstate
├── _getSession()            → sessionStorage session ID
├── _getVisitor()            → localStorage anonymous hash
├── _getUtm()                → parse ?utm_source, etc.
├── _send(payload)           → POST to /api/events (beacon API)
└── _queue[]                 → offline queue, flush on reconnect
```

### Key design decisions

- **Beacon API** for sends — doesn't block page unload
- **No cookies** — localStorage + sessionStorage only
- **Offline queue** — events stored locally if network fails, sent on next page load
- **< 3KB gzipped** — smaller than a single icon font
- **Privacy-first** — no fingerprinting, no cross-site tracking, no PII in auto-track

### File location

```
public/ks-track.js          → served as static asset
src/lib/tracking/tracker.ts  → source (compiled to public/)
```

---

## 4. Ingestion API

### Endpoint

```
POST /api/events
```

### Request

```json
{
  "businessId": "abc123",
  "event": "page_view",
  "sessionId": "s_8f2a...",
  "visitorId": "v_3b1c...",
  "pageUrl": "https://example.com/services",
  "referrer": "https://google.com",
  "utmSource": "google",
  "utmMedium": "organic",
  "utmCampaign": null,
  "metadata": {
    "screenWidth": 1440,
    "device": "desktop"
  },
  "timestamp": "2026-04-15T12:00:00Z"
}
```

### Response

```json
{ "ok": true }
```

### Processing pipeline

```
Request
  │
  ├─ 1. Validate businessId exists
  ├─ 2. Rate limit (100 events/min per business)
  ├─ 3. Sanitize metadata (strip scripts, limit size)
  ├─ 4. Insert into events table
  │
  ├─ 5. IF event_type = "form_submit"
  │     └─ Also insert into leads table
  │        with source attribution from UTM/referrer
  │
  └─ 6. Return { ok: true }
```

### File location

```
src/app/api/events/route.ts
```

### Security

- CORS: allow only registered business domains
- Rate limiting: 100 events/min per businessId
- Payload size limit: 10KB max
- No auth required (tracking script is public)
- businessId validated against `businesses` table

---

## 5. Call Tracking

### How it works

```
Customer sees tracking number on website
         │
         ▼
Customer calls tracking number
         │
         ▼
Twilio receives call → forwards to business real number
         │
         ▼
Twilio fires webhook → POST /api/webhooks/twilio
         │
         ▼
We log: caller, duration, source, timestamp
         │
         ▼
Shows up on dashboard as a lead
```

### Dynamic number swapping

The tracking script swaps phone numbers on the client's website based on traffic source:

```js
// In ks-track.js — auto-detects phone numbers on page
KS._swapNumbers({
  default: "+12505551234",    // business real number
  google: "+12505559001",     // tracking number for Google traffic
  facebook: "+12505559002",   // tracking number for Facebook traffic
  direct: "+12505559003"      // tracking number for direct traffic
});
```

### Twilio webhook endpoint

```
POST /api/webhooks/twilio
```

```
src/app/api/webhooks/twilio/route.ts
```

### What we store

```json
{
  "business_id": "...",
  "tracking_number": "+12505559001",
  "caller_number": "+12505551234",
  "duration_seconds": 180,
  "status": "completed",
  "source": "google",
  "medium": "organic"
}
```

### V1 simplification

Start with **1 tracking number per business**. No dynamic swapping. Just:

1. Buy a Twilio number
2. Set it to forward to business real number
3. Log all calls via webhook
4. Show on dashboard

Upgrade to multi-number source attribution in V2.

---

## 6. Form Tracking

### Option A — Auto-detect (default)

The tracking script automatically detects form submissions:

```js
// Inside ks-track.js
document.addEventListener("submit", (e) => {
  const form = e.target;
  const data = new FormData(form);
  KS.track("form_submit", {
    form_id: form.id || form.action,
    // Only capture fields that look like contact info
    name: data.get("name") || data.get("full_name"),
    email: data.get("email"),
    phone: data.get("phone") || data.get("tel")
  });
});
```

### Option B — API-routed forms (better)

For clients who want guaranteed capture, route forms through our API:

```html
<form action="https://signal.kootenaysignal.com/api/leads" method="POST">
  <input type="hidden" name="businessId" value="abc123" />
  <input name="name" placeholder="Name" />
  <input name="email" placeholder="Email" />
  <input name="phone" placeholder="Phone" />
  <button type="submit">Get a Quote</button>
</form>
```

### Lead creation endpoint

```
POST /api/leads
```

```
src/app/api/leads/route.ts
```

This creates both:
- A `leads` row (with attribution from referrer/UTM)
- An `events` row (type: `form_submit`)

### Redirect after submit

```json
{
  "redirect": "https://clientsite.com/thank-you"
}
```

Or return JSON for AJAX forms.

---

## 7. Attribution Engine

### How source is determined

Priority order (first match wins):

```
1. UTM parameters     → utm_source / utm_medium / utm_campaign
2. Referrer domain     → google.com → "google" / "organic"
3. Click ID            → gclid → "google" / "cpc"
                         fbclid → "facebook" / "cpc"
4. Direct              → no referrer → "direct" / "none"
```

### Source mapping table

| Referrer contains | Source | Medium |
|-------------------|--------|--------|
| google.com | google | organic |
| bing.com | bing | organic |
| facebook.com | facebook | social |
| instagram.com | instagram | social |
| yelp.com | yelp | referral |
| maps.google | google | maps |
| gclid param | google | cpc |
| fbclid param | facebook | cpc |
| (none) | direct | none |
| (other) | {domain} | referral |

### Implementation

```
src/lib/services/attribution.ts
```

```ts
export function attributeSource(referrer: string, utmParams: UTM): Attribution {
  // 1. Check UTM first (explicit always wins)
  if (utmParams.source) return { source: utmParams.source, medium: utmParams.medium, campaign: utmParams.campaign };

  // 2. Check click IDs
  if (utmParams.gclid) return { source: 'google', medium: 'cpc' };
  if (utmParams.fbclid) return { source: 'facebook', medium: 'cpc' };

  // 3. Parse referrer
  if (!referrer) return { source: 'direct', medium: 'none' };
  return matchReferrer(referrer);
}
```

### V1 scope

Simple last-touch attribution. The source attached to the lead is whatever brought them to the site on that session.

No multi-touch, no complex funnels. That's V2+.

---

## 8. Signal Score System

### What already exists

The current `analyzeWithDeepSeek()` function calculates:

| Score | Weight | What it measures |
|-------|--------|-----------------|
| Visibility | 20% | Google discoverability, rankings |
| Trust | 20% | Reviews, testimonials, SSL, contact info |
| Conversion | 20% | CTAs, booking flow, form quality |
| Local Presence | 15% | Map pack, branded search, schema |
| Offer Clarity | 15% | Service messaging clarity |
| Paid Readiness | 10% | Speed, mobile, conversion flow |
| SEO | bonus | PageSpeed technical score |

### What changes in V1

Add **real data** from tracking into the score:

| New factor | Source | Impact |
|------------|--------|--------|
| Lead volume trend | leads table | +/- conversion score |
| Call answer rate | calls table | +/- trust score |
| Traffic trend | events table | +/- visibility score |
| Source diversity | attribution | +/- visibility score |

### Daily snapshot job

A cron (Vercel Cron or Supabase pg_cron) runs daily:

```
1. For each business:
2.   Run signal check (crawl + SERP + PageSpeed)
3.   Pull today's event counts
4.   Calculate composite score
5.   Insert into signal_scores table
6.   If score changed significantly → trigger alert
```

```
src/lib/services/score-snapshot.ts
```

### Score history enables

- "Your score went from 42 → 67 in 30 days"
- Trend charts on dashboard
- Weekly email: "Here's how your signal changed"

---

## 9. Dashboard UI

### Page structure

```
/dashboard
├── /                    → Overview (leads, score, chart)
├── /leads               → Lead feed + filters
├── /calls               → Call log
├── /sources             → Attribution breakdown
├── /settings            → Business info, tracking setup
├── /report/[id]         → Signal Check report (existing)
└── /new                 → Run new Signal Check (existing)
```

### Overview page (`/dashboard`)

```
┌─────────────────────────────────────────────────────┐
│  SIGNAL SCORE              LEADS TODAY    CALLS      │
│  ┌───────┐                                           │
│  │  67   │  ↑ 12 pts      8  (+3)       4  (+1)     │
│  │       │  this month                               │
│  └───────┘                                           │
├─────────────────────────────────────────────────────┤
│                                                      │
│  LEADS THIS MONTH                                    │
│  ┌───────────────────────────────────────────────┐   │
│  │  ▁ ▂ ▃ ▅ ▃ ▆ ▅ ▇ ▆ ▅ ▇ ▆ █ ▇ █              │   │
│  │  Mar 1                              Mar 31    │   │
│  └───────────────────────────────────────────────┘   │
│                                                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│  WHERE LEADS COME FROM         RECENT LEADS          │
│  ┌──────────────────┐          ┌──────────────────┐  │
│  │ Google    ████ 45%│          │ John D.          │  │
│  │ Direct    ███  28%│          │ via Google · 2h  │  │
│  │ Facebook  ██  15%│          ├──────────────────┤  │
│  │ Referral  █   12%│          │ Sarah M.         │  │
│  └──────────────────┘          │ via Facebook · 5h│  │
│                                └──────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### UI components

| Component | Library |
|-----------|---------|
| Charts | Recharts (already lightweight) |
| Data tables | Custom (no heavy lib needed) |
| Score ring | Existing `.sc-score-ring` CSS |
| Layout | Existing dashboard layout |
| Icons | Lucide React (already installed) |

### Key queries powering the dashboard

```sql
-- Leads today
SELECT COUNT(*) FROM leads
WHERE business_id = $1 AND created_at >= CURRENT_DATE;

-- Leads by source (pie chart)
SELECT source, COUNT(*) as count FROM leads
WHERE business_id = $1 AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY source ORDER BY count DESC;

-- Daily lead trend (line chart)
SELECT DATE(created_at) as day, COUNT(*) as count FROM leads
WHERE business_id = $1 AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY day ORDER BY day;

-- Recent leads (feed)
SELECT * FROM leads
WHERE business_id = $1
ORDER BY created_at DESC LIMIT 20;

-- Signal score history (trend)
SELECT score_date, signal_score FROM signal_scores
WHERE business_id = $1 AND score_date >= NOW() - INTERVAL '90 days'
ORDER BY score_date;

-- Page views today
SELECT COUNT(*) FROM events
WHERE business_id = $1 AND event_type = 'page_view'
AND timestamp >= CURRENT_DATE;
```

---

## 10. Client Onboarding Flow

### The 3-step setup

```
Step 1: Sign up (Clerk)
         │
         ▼
Step 2: Add your business
         - Business name
         - Website URL
         - Phone number
         - City
         - Industry
         │
         ▼
Step 3: Install tracking
         - Copy/paste 2 lines of code
         - OR click "Install it for me" (we do it)
         │
         ▼
Done. Dashboard starts showing data.
```

### "Install it for me" flow

```
Client clicks "Install it for me"
         │
         ▼
We receive notification (email + dashboard alert)
         │
         ▼
We access their site (WordPress plugin, manual, or tag manager)
         │
         ▼
We add the tracking script
         │
         ▼
We mark setup as complete
         │
         ▼
Client sees data flowing in
```

### WordPress plugin (Phase 2)

A simple WordPress plugin that:

1. Client installs from WordPress admin
2. Enters their business ID
3. Plugin injects tracking script on all pages
4. Plugin auto-captures Contact Form 7 / Gravity Forms / WPForms submissions

```
kootenay-signal-wp/
├── kootenay-signal.php        → plugin bootstrap
├── includes/
│   ├── tracker-inject.php     → adds script to wp_footer
│   └── form-hooks.php         → hooks into CF7/Gravity/WPForms
└── readme.txt
```

### Google Tag Manager (alternative)

For non-WordPress sites, provide a GTM container JSON they can import:

```json
{
  "tag": {
    "name": "Kootenay Signal Tracker",
    "type": "html",
    "html": "<script src='...ks-track.js'></script><script>KS.init({businessId:'{{KS Business ID}}'})</script>",
    "trigger": "All Pages"
  }
}
```

---

## 11. Automation Layer

### Weekly summary email

Every Monday at 8am, each active business gets:

```
Subject: Your Signal Report — Week of Apr 7

Hey [Business Name],

Here's your week:

  Leads:      14  (+5 from last week)
  Calls:       6  (+2)
  Page views: 842
  Signal Score: 67 → 71 ↑

Top source: Google (62%)

Your biggest win: 3 new leads from your
Google Business Profile this week.

→ View full dashboard
→ Book a strategy call
```

### Real-time alerts

| Trigger | Notification |
|---------|-------------|
| New lead | Email + dashboard badge |
| Missed call | Email: "You missed a call from 250-555-..." |
| Score drop > 5 pts | Email: "Your Signal Score dropped" |
| Zero leads in 7 days | Email: "No new leads this week — let's fix that" |

### Implementation

```
src/lib/services/notifications.ts   → email via Resend
src/app/api/cron/weekly-report/     → Vercel Cron (Monday 8am)
src/app/api/cron/daily-scores/      → Vercel Cron (daily 2am)
```

---

## 12. Integrations (Phase 2)

### Google Business Profile

Pull via GBP API:

- Profile views
- Search queries
- Direction requests
- Phone calls (from GBP listing)
- Photo views

This feeds into the Signal Score visibility component.

### Google Analytics (read-only)

Pull via GA4 Data API:

- Sessions by source
- Top landing pages
- Bounce rate
- Average session duration

Supplements our own tracking data for businesses that already have GA.

### Google Search Console

Pull via Search Console API:

- Impressions
- Clicks
- Average position
- Top queries

Feeds directly into visibility score.

### Integration install flow

```
Dashboard → Settings → Integrations

┌─────────────────────────────────────┐
│  Google Business Profile            │
│  Connect your listing to see        │
│  profile views, calls, and more.    │
│                                     │
│  [Connect with Google]  ← OAuth     │
└─────────────────────────────────────┘
```

One-click OAuth. No API keys. No config.

---

## 13. Deployment & Infrastructure

### Hosting

| Service | Purpose | Cost |
|---------|---------|------|
| Vercel | Next.js hosting, API routes, cron | Free → $20/mo |
| Supabase | Postgres, auth (RLS), realtime | Free → $25/mo |
| Twilio | Phone numbers, call forwarding | ~$1/number/mo + $0.02/min |
| Resend | Transactional email | Free (100/day) → $20/mo |
| Cloudflare | CDN for tracking script | Free |

### Cost per client

| Item | Monthly cost |
|------|-------------|
| 1 Twilio number | ~$1.15 |
| Database storage | ~$0 (Supabase free tier) |
| Email sends | ~$0 (4 emails/mo/client) |
| **Total per client** | **~$1.50/mo** |

At 20 clients, infrastructure cost is ~$30/mo + $25 Supabase + $20 Vercel = **~$75/mo total**.

### Environment variables (new)

```env
# Existing
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
SERPAPI_KEY=...
DEEPSEEK_API_KEY=...
CLERK_SECRET_KEY=...

# New
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_WEBHOOK_SECRET=...
RESEND_API_KEY=...
```

---

## 14. Implementation Phases

### Phase 1 — Foundation (Week 1–2)

> Goal: Clients can install tracking and see leads on a dashboard.

| Task | Files | Priority |
|------|-------|----------|
| Create `businesses` table | `supabase-schema.sql` | P0 |
| Create `events` table | `supabase-schema.sql` | P0 |
| Create `leads` table | `supabase-schema.sql` | P0 |
| Build tracking script | `public/ks-track.js` | P0 |
| Build ingestion API | `src/app/api/events/route.ts` | P0 |
| Build leads API | `src/app/api/leads/route.ts` | P0 |
| Client onboarding page | `src/app/dashboard/setup/page.tsx` | P0 |
| Dashboard overview | `src/app/dashboard/page.tsx` (update) | P0 |
| Lead feed page | `src/app/dashboard/leads/page.tsx` | P1 |

**Deliverable:** Client installs 2 lines of code → sees page views and form leads on dashboard.

---

### Phase 2 — Call Tracking (Week 3)

> Goal: Track phone calls with source attribution.

| Task | Files | Priority |
|------|-------|----------|
| Create `calls` table | `supabase-schema.sql` | P0 |
| Create `tracking_numbers` table | `supabase-schema.sql` | P0 |
| Twilio webhook endpoint | `src/app/api/webhooks/twilio/route.ts` | P0 |
| Number provisioning API | `src/lib/services/twilio.ts` | P0 |
| Call log page | `src/app/dashboard/calls/page.tsx` | P1 |
| Number swap in tracker | `public/ks-track.js` (update) | P1 |

**Deliverable:** Calls show up on dashboard with duration and source.

---

### Phase 3 — Attribution & Scores (Week 4)

> Goal: Show where leads come from. Daily Signal Score snapshots.

| Task | Files | Priority |
|------|-------|----------|
| Attribution engine | `src/lib/services/attribution.ts` | P0 |
| Create `signal_scores` table | `supabase-schema.sql` | P0 |
| Daily score cron | `src/app/api/cron/daily-scores/route.ts` | P0 |
| Source breakdown page | `src/app/dashboard/sources/page.tsx` | P1 |
| Score trend chart | Dashboard overview (update) | P1 |

**Deliverable:** Dashboard shows "62% of your leads come from Google" + score trending up.

---

### Phase 4 — Automation & Alerts (Week 5)

> Goal: Clients get notified of new leads. Weekly email reports.

| Task | Files | Priority |
|------|-------|----------|
| Email service setup | `src/lib/services/email.ts` | P0 |
| New lead notification | Trigger in leads API | P0 |
| Weekly report cron | `src/app/api/cron/weekly-report/route.ts` | P1 |
| Missed call alert | Trigger in Twilio webhook | P1 |
| Settings page | `src/app/dashboard/settings/page.tsx` | P1 |

**Deliverable:** Client gets email: "New lead from Google — John D. just submitted a form."

---

### Phase 5 — Integrations (Week 6–8)

> Goal: One-click Google connections. WordPress plugin.

| Task | Files | Priority |
|------|-------|----------|
| GBP OAuth flow | `src/app/api/integrations/google/` | P1 |
| GBP data pull | `src/lib/services/gbp.ts` | P1 |
| WordPress plugin | `kootenay-signal-wp/` | P1 |
| GTM container export | Dashboard settings | P2 |
| GA4 integration | `src/lib/services/analytics.ts` | P2 |

**Deliverable:** Client clicks "Connect Google" → GBP data flows into dashboard.

---

### New file tree (after all phases)

```
src/
├── app/
│   ├── api/
│   │   ├── audits/              ← existing
│   │   ├── signal-check/        ← existing
│   │   ├── health/              ← existing
│   │   ├── events/              ← NEW: event ingestion
│   │   │   └── route.ts
│   │   ├── leads/               ← NEW: form leads
│   │   │   └── route.ts
│   │   ├── webhooks/
│   │   │   └── twilio/          ← NEW: call tracking
│   │   │       └── route.ts
│   │   ├── cron/
│   │   │   ├── daily-scores/    ← NEW: score snapshots
│   │   │   │   └── route.ts
│   │   │   └── weekly-report/   ← NEW: email reports
│   │   │       └── route.ts
│   │   └── integrations/
│   │       └── google/          ← NEW: GBP OAuth
│   │           └── route.ts
│   ├── dashboard/
│   │   ├── page.tsx             ← UPDATE: real data overview
│   │   ├── leads/               ← NEW: lead feed
│   │   │   └── page.tsx
│   │   ├── calls/               ← NEW: call log
│   │   │   └── page.tsx
│   │   ├── sources/             ← NEW: attribution
│   │   │   └── page.tsx
│   │   ├── settings/            ← NEW: business config
│   │   │   └── page.tsx
│   │   ├── setup/               ← NEW: onboarding
│   │   │   └── page.tsx
│   │   ├── report/[id]/         ← existing
│   │   └── new/                 ← existing
│   └── signal-check/            ← existing
├── lib/
│   ├── db.ts                    ← existing
│   └── services/
│       ├── crawler.ts           ← existing
│       ├── serp.ts              ← existing
│       ├── pagespeed.ts         ← existing
│       ├── deepseek.ts          ← existing
│       ├── attribution.ts       ← NEW
│       ├── twilio.ts            ← NEW
│       ├── email.ts             ← NEW
│       ├── score-snapshot.ts    ← NEW
│       └── gbp.ts               ← NEW (Phase 5)
└── components/
    ├── Navbar.tsx               ← existing
    ├── LeadFeed.tsx             ← NEW
    ├── SourceChart.tsx          ← NEW
    ├── ScoreTrend.tsx           ← NEW
    ├── StatCard.tsx             ← NEW
    └── CallLog.tsx              ← NEW
public/
└── ks-track.js                  ← NEW: tracking script
```

---

## Summary

| What you're building | What it replaces |
|---------------------|-----------------|
| Tracking script | Google Analytics (simpler, yours) |
| Lead feed | Spreadsheets, sticky notes |
| Call tracking | "How'd you hear about us?" |
| Source attribution | Guessing |
| Signal Score | Nothing (this doesn't exist for local biz) |
| Weekly reports | Manual check-ins |
| Dashboard | "Trust me, it's working" |

### V1 is 5 tables, 1 script, and 4 API routes.

That's it. Everything else is UI on top of queries.

The moment a client sees their first lead appear on the dashboard in real time — with the source, the name, the page they came from — they'll never go back to guessing.
