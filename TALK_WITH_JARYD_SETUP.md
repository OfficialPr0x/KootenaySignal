# Talk With Jaryd → Supabase + Admin Panel — Full Setup Guide

This is the complete, copy‑paste‑ready checklist to make the `/talk-with-jaryd` funnel
**save every lead into Supabase** and **show those leads in a Kootenay Signal admin panel**
you can log into.

It follows the conventions already in this repo:

- Server‑only DB access via `getSupabase()` (`src/lib/db.ts`) using the **service role key** (bypasses RLS, browser never touches the DB).
- `zod` validation + in‑memory IP rate limiting on public routes (same as `/api/signal-check`).
- Clerk auth + `src/proxy.ts` middleware for protected routes.
- The idempotent migration style in `supabase/schema.sql` (enums, `set_updated_at`, `fn_audit_trigger`, RLS lock, `schema_migrations`).

> The funnel itself already lives at `src/app/talk-with-jaryd/page.tsx`. Today it only
> prefills Cal.com. After this guide it will **also** persist a lead row, and you'll have a
> private `/admin` panel to view and manage those leads.

---

## How the data will flow

```
Visitor fills Steps 1–2
        │
        ▼
 POST /api/leads  ──────────►  Supabase: public.leads  (status = 'new')
        │                              ▲
        ▼                              │ (optional) Cal webhook flips status = 'booked'
 Step 3: Cal.com embed (prefilled) ────┘
        │
        ▼
 You log in at /admin  ──────►  reads public.leads (service role) ──► Leads table UI
```

We capture the lead **when the visitor advances from Step 2 → Step 3** (before they even
pick a time), so you still get the lead even if they bail on the calendar.

---

## Step 0 — Environment variables (confirm these exist)

These are the **only** vars required for the core lead capture + admin panel. They're the
same ones the rest of the app already uses — no new secrets needed.

`.env.local` (and Vercel → Project → Settings → Environment Variables):

```bash
# Supabase (server-only writes via service role)
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>   # Settings → API → service_role (secret)

# Clerk (already configured for /dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` must **never** be prefixed with `NEXT_PUBLIC_` and must
> never be imported into a client component. Only `getSupabase()` (server) uses it.

---

## Step 1 — Database: create the `leads` table

Run this in **Supabase → SQL Editor**. It's idempotent (safe to re‑run) and matches the
existing schema's enum / trigger / RLS / migration‑tracking style.

```sql
-- ============================================================================
--  MIGRATION 2026.06.28 — public.leads (Talk With Jaryd funnel)
-- ============================================================================
begin;

-- 1. Status vocabulary
do $$
begin
  if not exists (select 1 from pg_type where typname = 'lead_status') then
    create type public.lead_status as enum
      ('new','booked','contacted','won','lost');
  end if;
end$$;

-- 2. Table
create table if not exists public.leads (
  id             uuid primary key default gen_random_uuid(),
  first_name     text not null,
  last_name      text,
  email          citext not null,
  phone          text,
  business_name  text not null,
  industry       text,
  revenue        text,
  goals          text[] not null default '{}',
  challenge      text,
  notes          text,                         -- the same notes blob sent to Cal.com
  source         text not null default 'talk-with-jaryd',
  status         public.lead_status not null default 'new',
  booked_at      timestamptz,
  cal_booking_uid text,                         -- set by the optional Cal webhook
  utm_source     text,
  utm_medium     text,
  utm_campaign   text,
  referrer       text,
  ip             text,
  user_agent     text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

comment on table public.leads is
  'Inbound leads captured from the Talk With Jaryd booking funnel (public, no Clerk user).';

-- 3. updated_at maintenance (reuses existing helper)
drop trigger if exists trg_leads_updated_at on public.leads;
create trigger trg_leads_updated_at before update on public.leads
  for each row execute function public.set_updated_at();

-- 4. Change tracking into audit_log (reuses existing helper)
drop trigger if exists trg_leads_audit on public.leads;
create trigger trg_leads_audit after insert or update or delete on public.leads
  for each row execute function public.fn_audit_trigger();

-- 5. Indexes
create index if not exists idx_leads_created       on public.leads (created_at desc);
create index if not exists idx_leads_status_created on public.leads (status, created_at desc);
create index if not exists idx_leads_email          on public.leads (email);
create index if not exists idx_leads_business_trgm  on public.leads using gin (business_name gin_trgm_ops);

-- 6. Lock down: enable RLS with no public policies; only service_role may touch it
alter table public.leads enable row level security;
alter table public.leads force  row level security;
revoke all on public.leads from anon, authenticated;
grant  all on public.leads to   service_role;

-- 7. Record the migration
insert into public.schema_migrations (version, description)
values ('2026.06.28', 'Add public.leads table for the Talk With Jaryd funnel.')
on conflict (version) do nothing;

commit;
```

Verify it landed:

```sql
select count(*) from public.leads;          -- 0
select version, description from public.schema_migrations order by applied_at desc limit 3;
```

---

## Step 2 — Lead capture API route (public)

Create **`src/app/api/leads/route.ts`**. Public `POST` (no auth), validated with `zod`, with
the same in‑memory IP rate‑limit pattern used by `/api/signal-check`.

```ts
import { getSupabase } from '@/lib/db';
import { z } from 'zod';

const schema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().max(100).optional().default(''),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional().default(''),
  businessName: z.string().min(1).max(200),
  industry: z.string().max(100).optional().default(''),
  revenue: z.string().max(100).optional().default(''),
  goals: z.array(z.string().max(100)).max(20).optional().default([]),
  challenge: z.string().max(2000).optional().default(''),
  notes: z.string().max(4000).optional().default(''),
  utm_source: z.string().max(200).optional().default(''),
  utm_medium: z.string().max(200).optional().default(''),
  utm_campaign: z.string().max(200).optional().default(''),
  referrer: z.string().max(500).optional().default(''),
});

// Simple in-memory rate limit: 5 submissions per IP per hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 3600000 });
    return false;
  }
  if (entry.count >= 5) return true;
  entry.count++;
  return false;
}

export async function POST(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  if (rateLimited(ip)) {
    return Response.json({ error: 'Too many submissions. Try again shortly.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }

  const d = parsed.data;
  const supabase = getSupabase();

  const { data: lead, error } = await supabase
    .from('leads')
    .insert({
      first_name: d.firstName,
      last_name: d.lastName || null,
      email: d.email.trim(),
      phone: d.phone || null,
      business_name: d.businessName,
      industry: d.industry || null,
      revenue: d.revenue || null,
      goals: d.goals,
      challenge: d.challenge || null,
      notes: d.notes || null,
      utm_source: d.utm_source || null,
      utm_medium: d.utm_medium || null,
      utm_campaign: d.utm_campaign || null,
      referrer: d.referrer || null,
      ip,
      user_agent: request.headers.get('user-agent')?.slice(0, 500) ?? null,
    })
    .select('id')
    .single();

  if (error || !lead) {
    console.error('[/api/leads] insert error:', error);
    return Response.json({ error: 'Could not save your details.' }, { status: 500 });
  }

  return Response.json({ id: lead.id });
}
```

> `/api/leads` is intentionally **not** added to the protected matcher in `src/proxy.ts` —
> it must stay public so anonymous visitors can submit.

---

## Step 3 — Wire the funnel to save the lead

Edit **`src/app/talk-with-jaryd/page.tsx`**. Three small additions.

**3a.** Add a ref near the other refs (so we never double‑insert):

```tsx
const calReady = useRef(false);
const embedRef = useRef<HTMLDivElement>(null);
const leadSaved = useRef(false);   // ← add this
```

**3b.** Add a `saveLead()` helper inside the component (above `goNext`). It reuses the same
`notes` blob the Cal embed already builds:

```tsx
async function saveLead() {
  if (leadSaved.current) return;
  leadSaved.current = true;

  const goalLabels = form.goals
    .map((g) => GOALS.find((x) => x.id === g)?.label)
    .filter(Boolean) as string[];

  const notes = [
    `Business: ${form.businessName}`,
    form.industry && `Industry: ${form.industry}`,
    goalLabels.length ? `Wants help with: ${goalLabels.join(', ')}` : '',
    form.revenue && `Monthly revenue: ${form.revenue}`,
    form.phone && `Phone: ${form.phone}`,
    form.challenge && `Biggest challenge: ${form.challenge}`,
  ].filter(Boolean).join('\n');

  const params = new URLSearchParams(window.location.search);

  try {
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email.trim(),
        phone: form.phone,
        businessName: form.businessName,
        industry: form.industry,
        revenue: form.revenue,
        goals: goalLabels,
        challenge: form.challenge,
        notes,
        utm_source: params.get('utm_source') ?? '',
        utm_medium: params.get('utm_medium') ?? '',
        utm_campaign: params.get('utm_campaign') ?? '',
        referrer: document.referrer ?? '',
      }),
    });
  } catch {
    leadSaved.current = false; // allow a retry on next advance
  }
}
```

**3c.** Call it when the visitor advances **from Step 2 to Step 3** inside the existing
`goNext`:

```tsx
const goNext = () => {
  setTouched(true);
  if (step === 1 && !step1Valid) return;
  if (step === 2 && !step2Valid) return;
  setTouched(false);
  if (step === 2) saveLead();          // ← add this line
  setStep((s) => Math.min(3, s + 1));
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
```

That's it for capture — the lead is saved the moment they reach the calendar, and Cal.com
still gets the prefilled booking.

---

## Step 4 — Make yourself an admin

The admin panel is gated by `profiles.is_admin`. Two parts: get your Clerk user id, then
flip the flag.

**4a. Find your Clerk user id**

- Clerk Dashboard → **Users** → click your user → copy the **User ID** (looks like `user_2abc…`).
- Or log into the app and read it from server code temporarily, but the dashboard is easiest.

**4b. Insert/flag your profile** (Supabase → SQL Editor). Profiles are normally
auto‑provisioned on first site/audit, so as the operator you likely need to create yours:

```sql
insert into public.profiles (clerk_user_id, email, display_name, is_admin)
values ('user_REPLACE_WITH_YOURS', 'jaryd@kootenaysignal.com', 'Jaryd', true)
on conflict (clerk_user_id)
do update set is_admin = true;
```

Confirm:

```sql
select clerk_user_id, email, is_admin from public.profiles where is_admin = true;
```

**4c. Admin guard helper** — create **`src/lib/admin.ts`**:

```ts
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getSupabase } from '@/lib/db';

/** Server-only. Redirects non-admins away. Returns the admin's Clerk user id. */
export async function requireAdmin(): Promise<string> {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const supabase = getSupabase();
  const { data } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('clerk_user_id', userId)
    .single();

  if (!data?.is_admin) redirect('/');
  return userId;
}

/** For API routes: returns true if the current Clerk user is an admin. */
export async function isAdmin(): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) return false;
  const supabase = getSupabase();
  const { data } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('clerk_user_id', userId)
    .single();
  return !!data?.is_admin;
}
```

---

## Step 5 — The admin panel (`/admin`)

A standalone route (kept **out** of `/dashboard`, which is the customer‑facing per‑site
dashboard). Three files.

**5a. `src/app/admin/layout.tsx`** — gate + keep it out of search results:

```tsx
import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/admin';

export const metadata: Metadata = {
  title: 'Admin — Leads | Kootenay Signal',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin(); // redirects non-admins
  return <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--foreground)' }}>{children}</div>;
}
```

**5b. `src/app/admin/page.tsx`** — server component that reads the leads:

```tsx
import { getSupabase } from '@/lib/db';
import LeadsTable, { type Lead } from './LeadsTable';

export const dynamic = 'force-dynamic'; // always fresh

export default async function AdminLeadsPage() {
  const supabase = getSupabase();
  const { data: leads } = await supabase
    .from('leads')
    .select('id, first_name, last_name, email, phone, business_name, industry, revenue, goals, challenge, notes, status, source, booked_at, created_at')
    .order('created_at', { ascending: false })
    .limit(500);

  return <LeadsTable initialLeads={(leads ?? []) as Lead[]} />;
}
```

**5c. `src/app/admin/LeadsTable.tsx`** — client UI (search, status filter, inline status
update). Styled to match the site's dark/orange theme:

```tsx
'use client';

import { useMemo, useState } from 'react';

export interface Lead {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string | null;
  business_name: string;
  industry: string | null;
  revenue: string | null;
  goals: string[] | null;
  challenge: string | null;
  notes: string | null;
  status: 'new' | 'booked' | 'contacted' | 'won' | 'lost';
  source: string;
  booked_at: string | null;
  created_at: string;
}

const STATUSES = ['new', 'booked', 'contacted', 'won', 'lost'] as const;
const STATUS_COLOR: Record<Lead['status'], string> = {
  new: '#e67e22', booked: '#27ae60', contacted: '#3498db', won: '#2ecc71', lost: '#7f8c8d',
};

export default function LeadsTable({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<'all' | Lead['status']>('all');

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return leads.filter((l) => {
      if (filter !== 'all' && l.status !== filter) return false;
      if (!needle) return true;
      return [l.first_name, l.last_name, l.email, l.business_name, l.industry]
        .filter(Boolean).join(' ').toLowerCase().includes(needle);
    });
  }, [leads, q, filter]);

  async function updateStatus(id: string, status: Lead['status']) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '2rem', marginBottom: '0.25rem' }}>
        Leads <span style={{ color: '#e67e22' }}>({leads.length})</span>
      </h1>
      <p style={{ opacity: 0.5, marginBottom: '1.5rem' }}>Talk With Jaryd funnel submissions.</p>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <input
          value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, email, business…"
          style={{ flex: 1, minWidth: 220, padding: '0.6rem 0.9rem', borderRadius: 8,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}
          style={{ padding: '0.6rem 0.9rem', borderRadius: 8, background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}>
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div style={{ overflowX: 'auto', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', background: 'rgba(255,255,255,0.03)' }}>
              {['When', 'Name', 'Business', 'Contact', 'Goals', 'Status'].map((h) => (
                <th key={h} style={{ padding: '0.75rem 1rem', fontWeight: 700, opacity: 0.6, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((l) => (
              <tr key={l.id} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap', opacity: 0.6 }}>
                  {new Date(l.created_at).toLocaleDateString()}
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>{l.first_name} {l.last_name}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  {l.business_name}
                  {l.industry && <div style={{ opacity: 0.45, fontSize: '0.8rem' }}>{l.industry}</div>}
                </td>
                <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                  <a href={`mailto:${l.email}`} style={{ color: '#e67e22' }}>{l.email}</a>
                  {l.phone && <div style={{ opacity: 0.6 }}>{l.phone}</div>}
                </td>
                <td style={{ padding: '0.75rem 1rem', maxWidth: 220 }}>
                  {(l.goals ?? []).join(', ')}
                  {l.challenge && <div style={{ opacity: 0.45, fontSize: '0.8rem', marginTop: 4 }}>{l.challenge}</div>}
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <select
                    value={l.status}
                    onChange={(e) => updateStatus(l.id, e.target.value as Lead['status'])}
                    style={{ padding: '0.35rem 0.5rem', borderRadius: 6, color: STATUS_COLOR[l.status],
                      background: 'rgba(255,255,255,0.05)', border: `1px solid ${STATUS_COLOR[l.status]}55`, fontWeight: 700 }}
                  >
                    {STATUSES.map((s) => <option key={s} value={s} style={{ color: '#000' }}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>No leads match.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## Step 6 — Admin status‑update API + route protection

**6a. `src/app/api/leads/[id]/route.ts`** — admin‑only `PATCH` (note the Next 16 `params`
is a `Promise`, matching `src/app/api/audits/[id]/route.ts`):

```ts
import { getSupabase } from '@/lib/db';
import { isAdmin } from '@/lib/admin';
import { z } from 'zod';

const schema = z.object({
  status: z.enum(['new', 'booked', 'contacted', 'won', 'lost']),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;

  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 });

  const supabase = getSupabase();
  const { error } = await supabase
    .from('leads')
    .update({
      status: parsed.data.status,
      ...(parsed.data.status === 'booked' ? { booked_at: new Date().toISOString() } : {}),
    })
    .eq('id', id);

  if (error) {
    console.error('[/api/leads/:id] update error:', error);
    return Response.json({ error: 'Update failed' }, { status: 500 });
  }
  return Response.json({ ok: true });
}
```

**6b. Protect the admin pages in `src/proxy.ts`.** Add `/admin(.*)` so Clerk forces login
before the `requireAdmin()` check even runs. **Do not** add `/api/leads` (it must stay
public for capture) — the `[id]` PATCH route protects itself via `isAdmin()`.

```ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/api/audits(.*)', '/admin(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
```

---

## Step 7 — (Optional) Auto‑mark leads as "booked" with a Cal.com webhook

Capture in Step 3 already records the lead. If you also want the status to flip to
`booked` automatically when someone completes the calendar, add a Cal webhook.

**7a.** In **Cal.com → Settings → Developer → Webhooks**: add a webhook pointing to
`https://www.kootenaysignal.com/api/webhooks/cal`, subscribe to **Booking Created**, and
copy the signing secret.

**7b.** Add to env: `CAL_WEBHOOK_SECRET=...`

**7c.** Create **`src/app/api/webhooks/cal/route.ts`**:

```ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSupabase } from '@/lib/db';

const SECRET = process.env.CAL_WEBHOOK_SECRET ?? '';

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get('x-cal-signature-256') ?? '';

  // Verify HMAC-SHA256 signature of the raw body
  if (SECRET) {
    const expected = crypto.createHmac('sha256', SECRET).update(raw).digest('hex');
    if (sig !== expected) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  }

  let event: any;
  try { event = JSON.parse(raw); } catch { return NextResponse.json({ error: 'Bad JSON' }, { status: 400 }); }

  if (event?.triggerEvent === 'BOOKING_CREATED') {
    const payload = event.payload ?? {};
    const email = payload?.attendees?.[0]?.email ?? payload?.responses?.email?.value;
    const uid = payload?.uid ?? payload?.bookingId;

    if (email) {
      const supabase = getSupabase();
      // Flip the most recent matching lead to "booked"
      const { data: match } = await supabase
        .from('leads')
        .select('id')
        .eq('email', email)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (match) {
        await supabase.from('leads')
          .update({ status: 'booked', booked_at: new Date().toISOString(), cal_booking_uid: uid ?? null })
          .eq('id', match.id);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
```

> The exact Cal payload shape can vary by Cal version/event type. Log `event` once in
> development and adjust the `email` / `uid` paths if needed. This route is public (Cal
> calls it) and is protected by the signature check, so **do not** add it to the middleware
> matcher.

---

## Step 8 — Test checklist

Local:

```bash
npm run dev
```

1. **Capture** — open `http://localhost:3000/talk-with-jaryd?utm_source=test`, fill Steps 1–2,
   click **See Available Times**. Then in Supabase:
   ```sql
   select first_name, business_name, email, goals, status, utm_source, created_at
   from public.leads order by created_at desc limit 5;
   ```
   You should see your row with `status = 'new'` and `utm_source = 'test'`.
2. **No double‑insert** — go Back to Step 2 and forward again; still only **one** row
   (guarded by `leadSaved`).
3. **Admin gate** — visit `/admin` while logged out → redirected to sign‑in. Logged in as a
   non‑admin → redirected to `/`. Logged in as your admin profile → you see the Leads table.
4. **Status update** — change a lead's status dropdown in `/admin`; re‑query and confirm
   `status` (and `booked_at` when set to `booked`) updated.
5. **(Optional) Cal webhook** — complete a real booking with the same email and confirm the
   lead flips to `booked`.

---

## Step 9 — Deploy

1. Add the same env vars in **Vercel → Settings → Environment Variables** (Production +
   Preview): `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, Clerk keys, and
   `CAL_WEBHOOK_SECRET` if using the webhook.
2. Run the **Step 1 migration** against your production Supabase project.
3. Run the **Step 4b** SQL against production to flag your admin profile (your Clerk user id
   is the same across environments only if you use the same Clerk instance — otherwise grab
   the production user id).
4. Deploy. Point the Cal webhook (if used) at the **production** URL.

---

## Appendix — `leads` column reference

| Column | Type | Source |
|---|---|---|
| `id` | uuid | auto |
| `first_name` / `last_name` | text | Step 1 |
| `email` | citext | Step 1 (required) |
| `phone` | text | Step 1 |
| `business_name` | text | Step 1 (required) |
| `industry` | text | Step 2 chips |
| `revenue` | text | Step 2 chips |
| `goals` | text[] | Step 2 goal cards (labels) |
| `challenge` | text | Step 2 textarea |
| `notes` | text | Composed blob (also sent to Cal.com) |
| `source` | text | `'talk-with-jaryd'` |
| `status` | enum `lead_status` | `new` → `booked`/`contacted`/`won`/`lost` |
| `booked_at` | timestamptz | set on `booked` |
| `cal_booking_uid` | text | Cal webhook (optional) |
| `utm_*` / `referrer` | text | Query string + `document.referrer` |
| `ip` / `user_agent` | text | Request headers |
| `created_at` / `updated_at` | timestamptz | auto (trigger) |

### Files this guide creates/edits

| File | Action |
|---|---|
| `supabase/schema.sql` (or SQL Editor) | Run Step 1 migration |
| `src/app/api/leads/route.ts` | **new** — public lead capture |
| `src/app/api/leads/[id]/route.ts` | **new** — admin status update |
| `src/app/talk-with-jaryd/page.tsx` | **edit** — call `saveLead()` on Step 2→3 |
| `src/lib/admin.ts` | **new** — `requireAdmin()` / `isAdmin()` |
| `src/app/admin/layout.tsx` | **new** — admin gate |
| `src/app/admin/page.tsx` | **new** — server lead fetch |
| `src/app/admin/LeadsTable.tsx` | **new** — leads UI |
| `src/proxy.ts` | **edit** — protect `/admin(.*)` |
| `src/app/api/webhooks/cal/route.ts` | **new (optional)** — auto‑mark booked |
```
