'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ExternalLink,
  Check,
  Plus,
  Minus,
  Camera,
  PenTool,
  MapPin,
  Calculator,
  MessageSquare,
  FileText,
  PenLine,
  Receipt,
  Users,
  Search,
  Mic,
} from 'lucide-react';

/* ─── Intersection Observer hook for scroll reveals ─── */
function useReveal(threshold = 0.05) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── Animated Counter ─── */
function Counter({ end, suffix = '', duration = 1800 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const animate = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(eased * end));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const SECTION_LABEL = {
  fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase' as const,
  letterSpacing: '0.3em', color: 'var(--primary)',
};

const SCORES = [
  { name: 'Local / market fit', score: 10.0, note: 'Towns, RDEK/RDCK, snow loads, FireSmart — hyper-specific' },
  { name: 'AI engineering', score: 9.5, note: 'Multi-model routing, fallbacks, cost caps, validated end-to-end' },
  { name: 'Brand & visual craft', score: 9.5, note: 'Cohesive design system, cinematic detail, accessibility-aware' },
  { name: 'Conversion design', score: 9.5, note: 'No dead ends; AI tools self-qualify every lead' },
  { name: 'Back-office system', score: 9.5, note: 'Quotes, e-sign, bookkeeping, CRM, prospecting' },
  { name: 'Lead generation', score: 9.5, note: 'Capture + progression + outbound prospecting' },
  { name: 'SEO & shareability', score: 9.0, note: 'Structured data, OG cards, keyword-targeted' },
];

const LAYERS = [
  {
    tag: '01 · Get found & booked',
    title: 'The marketing site',
    body: 'A homepage built as one funnel — every section has a job, and there are no dead ends. A cold homeowner lands, the AI tools do the selling, and they book a site visit. No salesperson needed.',
  },
  {
    tag: '02 · Build authority',
    title: 'The field guide funnel',
    body: 'An 18-chapter homeowner manual — permits, snow loads, FireSmart, rebates — that reads like it came from the municipality. It captures leads and walks readers straight to a booked walkthrough.',
  },
  {
    tag: '03 · Run the business',
    title: 'The back-office OS',
    body: 'Quotes, estimates, invoices with BC tax built in, e-signatures, an AI bookkeeper, a CRM, and an outbound prospector. The paperwork that eats your evenings — automated.',
  },
];

const AI_TOOLS = [
  { icon: <Camera size={20} strokeWidth={1.6} />, name: 'AI Quote Wizard', fear: 'How much will it cost?', body: 'Homeowner uploads site photos; AI reads them and returns a real priced estimate with a downloadable PDF, then books a visit. If they bail, the lead is still captured.' },
  { icon: <PenTool size={20} strokeWidth={1.6} />, name: 'Draw It Out', fear: 'What will it look like?', body: 'They sketch a deck or fence on screen; AI returns a photorealistic concept render. Dream-building that converts.' },
  { icon: <MapPin size={20} strokeWidth={1.6} />, name: 'Project Check', fear: 'Is my lot even buildable?', body: 'Type an address; AI returns slope, snow load, frost line, sun hours, permit authority, and whether an engineer\u2019s stamp is likely needed.' },
  { icon: <Calculator size={20} strokeWidth={1.6} />, name: 'Cost Calculator', fear: 'Can I trust the price?', body: 'Live slider pricing with no email gate — pure transparency that disarms the #1 homeowner fear, with an optional AI sanity-check.' },
  { icon: <MessageSquare size={20} strokeWidth={1.6} />, name: 'Concierge Chat', fear: 'I have a quick question.', body: 'An always-on assistant answers permit, budget, and material questions, then points to the right tool or the phone. Never hard-quotes.' },
];

const BACK_OFFICE = [
  { icon: <FileText size={18} strokeWidth={1.7} />, title: 'Quotes · Estimates · Invoices', body: 'Three document types with BC tax handled correctly — GST 5% on installs, PST 7% on supply, split contracts, exemptions. Branded PDF in one click.' },
  { icon: <PenLine size={18} strokeWidth={1.7} />, title: 'E-Signatures', body: 'Send a secure sign link, client signs on screen, status tracked at every stage with email alerts. No DocuSign subscription.' },
  { icon: <Receipt size={18} strokeWidth={1.7} />, title: 'AI Bookkeeper', body: 'Snap a receipt — AI reads it, files it, renames it, and writes the bookkeeping record into the right folder.' },
  { icon: <Users size={18} strokeWidth={1.7} />, title: 'Multi-Channel CRM', body: 'Every lead lands in four places at once (file, email, Slack, database) so a lead is never lost.' },
  { icon: <Search size={18} strokeWidth={1.7} />, title: 'AI Prospector', body: 'Searches the region for general contractors and developers, scores fit, and builds a B2B partner pipeline.' },
  { icon: <Mic size={18} strokeWidth={1.7} />, title: 'Voice Ops Assistant', body: 'An internal assistant for day-to-day ops and follow-ups — with voice input.' },
];

const UNDER_HOOD = [
  {
    title: 'The AI engine is infrastructure, not a ChatGPT wrapper',
    body: 'Nine AI jobs each route to a purpose-chosen model (Claude, GPT-5, Gemini, Perplexity, Flux) — swappable by config with no code change. On any failure or bad response, the call auto-walks to the next model, so customers never see a hard error. Per-request dollar caps and structured logging keep costs governed.',
  },
  {
    title: 'Type-safe end to end, with defense in depth',
    body: 'One schema validates the form input, instructs the AI, and validates the AI\u2019s output. Public tools fall back to deterministic pricing engines if AI is down. Rate limits, honeypot fields, and a 30-minute cache protect every endpoint. The API key never touches the browser.',
  },
  {
    title: 'Honest notes (for credibility)',
    body: 'A few showcase pieces are intentional demos: the \u201cContractor TV\u201d section is a Coming-Soon teaser, the live project map is a static regional image, and the client portal uses sample data. Everything in the scorecard above is live, working code.',
  },
];

const STACK = [
  'Next.js 16', 'React 19', 'TypeScript 5', 'Tailwind 4', 'Zod 4',
  'Supabase', 'OpenRouter', 'Perplexity Sonar', 'SerpAPI', 'Resend',
  'OpenAI Whisper', 'Cloudinary',
];

export default function BlackTimberCaseStudy() {
  const calLoaded = useRef(false);

  const loadCal = () => {
    if (calLoaded.current) return;
    calLoaded.current = true;
    (function (C, A, L) {
      const p = function (a: any, ar: any) { a.q.push(ar); };
      const d = C.document;
      // @ts-ignore
      C.Cal = C.Cal || function () {
        // @ts-ignore
        const cal = C.Cal; const ar = arguments;
        if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement('script')).src = A; cal.loaded = true; }
        if (ar[0] === L) {
          const api = function () { p(api, arguments); };
          const namespace = ar[1];
          // @ts-ignore
          api.q = api.q || [];
          // @ts-ignore
          if (typeof namespace === 'string') { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ['initNamespace', namespace]); } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
      // @ts-ignore
    })(window, 'https://app.cal.com/embed/embed.js', 'init');
    // @ts-ignore
    Cal('init', '30min', { origin: 'https://app.cal.com' });
    // @ts-ignore
    Cal.ns['30min']('ui', { cssVarsPerTheme: { light: { 'cal-brand': '#E3A23A' }, dark: { 'cal-brand': '#0F2A24' } }, hideEventTypeDetails: false, layout: 'month_view' });
  };

  useEffect(() => {
    const handler = () => loadCal();
    window.addEventListener('pointerdown', handler, { once: true });
    window.addEventListener('touchstart', handler, { once: true, passive: true });
    return () => {
      window.removeEventListener('pointerdown', handler);
      window.removeEventListener('touchstart', handler);
    };
  }, []);

  const sValue = useReveal();
  const sLayers = useReveal();
  const sScore = useReveal();
  const sTools = useReveal();
  const sOffice = useReveal();
  const sVerify = useReveal();
  const sHood = useReveal();
  const sClose = useReveal();

  const [openHood, setOpenHood] = useState<number | null>(0);

  return (
    <main style={{ position: 'relative', overflow: 'hidden' }}>

      {/* ═══════════════════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════════════════ */}
      <section style={{
        padding: 'clamp(9rem, 18vw, 13rem) 0 clamp(5rem, 9vw, 8rem)',
        background: '#000', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.035, pointerEvents: 'none',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat', zIndex: 1,
        }} />
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: '55vw', height: '55vw', background: 'radial-gradient(circle, rgba(230,126,34,0.08) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 1, filter: 'blur(80px)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '900px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <div style={{ width: '40px', height: '1px', background: 'var(--primary)' }} />
            <span style={SECTION_LABEL}>Case Study · Built by Kootenay Signal</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.6rem, 7vw, 5.2rem)', lineHeight: 1.02, color: '#fff', fontFamily: 'var(--font-syne)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1.75rem' }}>
            Black Timber<br /><span className="text-gradient-hero">Contracting.</span>
          </h1>

          <p style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)', color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-pjs)', lineHeight: 1.6, maxWidth: '680px', marginBottom: '2.5rem' }}>
            We didn&apos;t build a contractor website. We built the machine that{' '}
            <span style={{ color: '#fff', fontWeight: 600 }}>books the job, prices it, signs it, and files the paperwork</span>{' '}
            — and gave a small Kootenay crew the presence of a 30-year firm.
          </p>

          <div className="mobile-stack" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <a
              href="https://www.blacktimber.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hero-primary"
              style={{ textDecoration: 'none' }}
            >
              VISIT THE LIVE SITE
              <ExternalLink size={17} style={{ marginLeft: '0.5rem' }} />
            </a>
            <button
              className="btn-hero-secondary"
              data-cal-link="kootenay-signal/30min"
              data-cal-namespace="30min"
              data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
            >
              BUILD MINE
            </button>
          </div>

          <div style={{ marginTop: '2.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.65rem', opacity: 0.45 }}>
            <div style={{ width: '28px', height: '1px', background: 'rgba(255,255,255,0.3)' }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'var(--font-pjs)', color: 'rgba(255,255,255,0.6)' }}>
              blacktimber.ca · Fernie · Sparwood · Elkford · Cranbrook · Nelson
            </span>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          GRADE + VALUE
          ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(5rem, 10vw, 9rem) 0', background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(230,126,34,0.3), transparent)' }} />

        <div ref={sValue.ref} className="container" style={{ maxWidth: '1060px', position: 'relative', zIndex: 1 }}>
          {/* Grade card */}
          <div style={{
            opacity: sValue.visible ? 1 : 0,
            transform: sValue.visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex', flexWrap: 'wrap', gap: 'clamp(2rem, 5vw, 4rem)', alignItems: 'center',
            padding: 'clamp(2rem, 4vw, 3.5rem)',
            background: 'rgba(230,126,34,0.05)',
            border: '1px solid rgba(230,126,34,0.25)',
            borderRadius: '16px',
            boxShadow: '0 0 80px rgba(230,126,34,0.06)',
            marginBottom: 'clamp(3rem, 5vw, 4.5rem)',
          }}>
            <div style={{ textAlign: 'center', minWidth: '150px', margin: '0 auto' }}>
              <div style={{ fontSize: 'clamp(4.5rem, 11vw, 7rem)', lineHeight: 0.9, fontWeight: 800, fontFamily: 'var(--font-syne)', letterSpacing: '-0.04em' }} className="text-gradient-hero">A</div>
              <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-syne)', marginTop: '0.5rem' }}>9.4 / 10</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-pjs)', marginTop: '0.35rem' }}>Overall build grade</div>
            </div>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <h2 style={{ fontSize: 'clamp(1.3rem, 2.6vw, 1.9rem)', color: '#fff', fontFamily: 'var(--font-syne)', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>
                Independently graded against the source code.
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-pjs)', lineHeight: 1.7 }}>
                Every major claim was checked file-by-file in the live repository — the AI engine, the tax logic, the e-signatures, the bookkeeper, the 18-chapter field guide. This is a genuine, production-grade build, not a template with a logo dropped on top.
              </p>
            </div>
          </div>

          {/* Value bar */}
          <div style={{
            opacity: sValue.visible ? 1 : 0,
            transform: sValue.visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem',
          }}>
            <div style={{ padding: '1.75rem', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-pjs)', marginBottom: '0.65rem' }}>Built elsewhere</div>
              <div style={{ fontSize: 'clamp(2rem, 4vw, 2.6rem)', fontWeight: 800, color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-syne)', textDecoration: 'line-through', textDecorationColor: 'rgba(230,126,34,0.5)' }}>$15,000+</div>
            </div>
            <div style={{ padding: '1.75rem', background: 'rgba(230,126,34,0.07)', border: '1px solid rgba(230,126,34,0.35)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--primary)', fontFamily: 'var(--font-pjs)', marginBottom: '0.65rem' }}>With Kootenay Signal</div>
              <div style={{ fontSize: 'clamp(2rem, 4vw, 2.6rem)', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-syne)' }}>$5,000</div>
            </div>
            <div style={{ padding: '1.75rem', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-pjs)', lineHeight: 1.6, margin: 0 }}>
                Agency-grade work at a fraction of agency pricing — because it&apos;s built by one person who lives the trade, not a billable team.
              </p>
            </div>
          </div>

          {/* Stat strip */}
          <div style={{
            marginTop: 'clamp(3rem, 5vw, 4.5rem)',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1px',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden',
          }}>
            {[
              { end: 3, suffix: '', label: 'Systems in one (site · guide · back office)' },
              { end: 5, suffix: '', label: 'Customer-facing AI tools' },
              { end: 18, suffix: '', label: 'Chapters in the field guide' },
              { end: 6, suffix: '+', label: 'AI models routed per job' },
            ].map((stat, i) => (
              <div key={i} style={{ background: '#0a0a0a', padding: 'clamp(1.5rem, 3vw, 2.25rem) 1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', fontWeight: 800, fontFamily: 'var(--font-syne)', lineHeight: 1, marginBottom: '0.6rem' }} className="text-gradient-hero">
                  <Counter end={stat.end} suffix={stat.suffix} />
                </div>
                <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-pjs)', lineHeight: 1.5 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          ONE MACHINE, THREE LAYERS
          ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(6rem, 12vw, 11rem) 0', background: '#000', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: '70vw', height: '40vw', background: 'radial-gradient(ellipse, rgba(230,126,34,0.05) 0%, transparent 60%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div ref={sLayers.ref} className="container" style={{ maxWidth: '1060px', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 6vw, 5rem)', opacity: sLayers.visible ? 1 : 0, transform: sLayers.visible ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '30px', height: '1px', background: 'var(--primary)', opacity: 0.5 }} />
              <span style={SECTION_LABEL}>The Build</span>
              <div style={{ width: '30px', height: '1px', background: 'var(--primary)', opacity: 0.5 }} />
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)', lineHeight: 1.05, color: '#fff', fontFamily: 'var(--font-syne)', fontWeight: 800, marginBottom: '1.25rem' }}>
              One machine, three layers.
            </h2>
            <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-pjs)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
              A lead enters cold at the top and exits as a signed, invoiced, filed job at the bottom — with AI accelerating every step.
            </p>
          </div>

          <div className="pipeline-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
            {LAYERS.map((l, i) => (
              <div key={l.title} style={{
                opacity: sLayers.visible ? 1 : 0,
                transform: sLayers.visible ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${0.15 + i * 0.1}s`,
                padding: 'clamp(1.75rem, 2.5vw, 2.25rem)',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '14px',
              }}>
                <div style={{ fontSize: '0.66rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.16em', color: 'var(--primary)', fontFamily: 'var(--font-pjs)', marginBottom: '1rem' }}>{l.tag}</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-syne)', marginBottom: '0.75rem', lineHeight: 1.2 }}>{l.title}</h3>
                <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-pjs)', lineHeight: 1.65, margin: 0 }}>{l.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          SCORECARD
          ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(6rem, 12vw, 11rem) 0', background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.018, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

        <div ref={sScore.ref} className="container" style={{ maxWidth: '880px', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 5vw, 4.5rem)', opacity: sScore.visible ? 1 : 0, transform: sScore.visible ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '30px', height: '1px', background: 'var(--primary)', opacity: 0.5 }} />
              <span style={SECTION_LABEL}>The Scorecard</span>
              <div style={{ width: '30px', height: '1px', background: 'var(--primary)', opacity: 0.5 }} />
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)', lineHeight: 1.05, color: '#fff', fontFamily: 'var(--font-syne)', fontWeight: 800 }}>
              How it scores.
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {SCORES.map((dim, i) => (
              <div key={dim.name} style={{
                opacity: sScore.visible ? 1 : 0,
                transform: sScore.visible ? 'translateX(0)' : 'translateX(-30px)',
                transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + i * 0.08}s`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.6rem', gap: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-syne)' }}>{dim.name}</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-syne)' }}>{dim.score.toFixed(1)}</span>
                </div>
                {/* Bar track */}
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.55rem' }}>
                  <div style={{
                    height: '100%', borderRadius: '999px',
                    width: sScore.visible ? `${dim.score * 10}%` : '0%',
                    background: 'linear-gradient(90deg, var(--primary), #f0a050)',
                    transition: `width 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${0.25 + i * 0.08}s`,
                  }} />
                </div>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-pjs)', lineHeight: 1.5, margin: 0 }}>{dim.note}</p>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.22)', fontFamily: 'var(--font-pjs)', fontWeight: 600, letterSpacing: '0.05em' }}>
            Score out of 10 per dimension · Independently assessed against the Black Timber source code
          </p>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          FIVE AI TOOLS
          ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(6rem, 12vw, 11rem) 0', background: '#000', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(230,126,34,0.3), transparent)' }} />

        <div ref={sTools.ref} className="container" style={{ maxWidth: '1060px', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 6vw, 5rem)', opacity: sTools.visible ? 1 : 0, transform: sTools.visible ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '30px', height: '1px', background: 'var(--primary)', opacity: 0.5 }} />
              <span style={SECTION_LABEL}>The AI Suite</span>
              <div style={{ width: '30px', height: '1px', background: 'var(--primary)', opacity: 0.5 }} />
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)', lineHeight: 1.05, color: '#fff', fontFamily: 'var(--font-syne)', fontWeight: 800, marginBottom: '1.25rem' }}>
              Five AI tools that<br /><span className="text-gradient-hero">sell for you.</span>
            </h2>
            <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-pjs)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
              Each tool kills a specific homeowner objection <span style={{ color: '#fff', fontWeight: 600 }}>before</span> a human is ever involved. The customer self-qualifies and arrives warm.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {AI_TOOLS.map((tool, i) => (
              <div key={tool.name} style={{
                opacity: sTools.visible ? 1 : 0,
                transform: sTools.visible ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.15 + i * 0.08}s`,
                padding: 'clamp(1.75rem, 2.5vw, 2.25rem)',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '14px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
                  <div style={{ color: 'var(--primary)', display: 'flex', flexShrink: 0, width: '42px', height: '42px', alignItems: 'center', justifyContent: 'center', background: 'rgba(230,126,34,0.08)', borderRadius: '10px', border: '1px solid rgba(230,126,34,0.18)' }}>{tool.icon}</div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-syne)', margin: 0 }}>{tool.name}</h3>
                </div>
                <p style={{ fontSize: '1rem', color: 'var(--primary)', fontFamily: 'var(--font-pjs)', fontStyle: 'italic', fontWeight: 600, marginBottom: '0.6rem' }}>&ldquo;{tool.fear}&rdquo;</p>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-pjs)', lineHeight: 1.65, margin: 0 }}>{tool.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          BACK OFFICE
          ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(6rem, 12vw, 11rem) 0', background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: '70vw', height: '40vw', background: 'radial-gradient(ellipse, rgba(230,126,34,0.04) 0%, transparent 60%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div ref={sOffice.ref} className="container" style={{ maxWidth: '1060px', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 6vw, 5rem)', opacity: sOffice.visible ? 1 : 0, transform: sOffice.visible ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '30px', height: '1px', background: 'var(--primary)', opacity: 0.5 }} />
              <span style={SECTION_LABEL}>The Back Office</span>
              <div style={{ width: '30px', height: '1px', background: 'var(--primary)', opacity: 0.5 }} />
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)', lineHeight: 1.05, color: '#fff', fontFamily: 'var(--font-syne)', fontWeight: 800, marginBottom: '1.25rem' }}>
              Where most agencies stop,<br /><span className="text-gradient-hero">we kept going.</span>
            </h2>
            <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-pjs)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
              A complete operating system that runs the business after the lead lands.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {BACK_OFFICE.map((item, i) => (
              <div key={item.title} style={{
                opacity: sOffice.visible ? 1 : 0,
                transform: sOffice.visible ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.12 + i * 0.07}s`,
                display: 'flex', gap: '1rem', alignItems: 'flex-start',
                padding: '1.5rem',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '12px',
              }}>
                <div style={{ color: 'var(--primary)', display: 'flex', flexShrink: 0, marginTop: '2px' }}>{item.icon}</div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-syne)', margin: '0 0 0.4rem' }}>{item.title}</h4>
                  <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-pjs)', lineHeight: 1.6, margin: 0 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          VERIFIED + UNDER THE HOOD
          ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(6rem, 12vw, 11rem) 0', background: '#000', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(230,126,34,0.3), transparent)' }} />

        <div className="container" style={{ maxWidth: '820px', position: 'relative', zIndex: 1 }}>
          {/* Verified callout */}
          <div ref={sVerify.ref} style={{
            opacity: sVerify.visible ? 1 : 0,
            transform: sVerify.visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            padding: 'clamp(1.75rem, 3vw, 2.5rem)',
            background: 'rgba(39,174,96,0.05)',
            border: '1px solid rgba(39,174,96,0.25)',
            borderRadius: '14px',
            marginBottom: 'clamp(3.5rem, 6vw, 5.5rem)',
            display: 'flex', gap: '1.1rem', alignItems: 'flex-start',
          }}>
            <div style={{ color: 'var(--accent)', display: 'flex', flexShrink: 0, width: '34px', height: '34px', alignItems: 'center', justifyContent: 'center', background: 'rgba(39,174,96,0.12)', borderRadius: '8px', marginTop: '2px' }}>
              <Check size={18} strokeWidth={3} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-syne)', margin: '0 0 0.6rem' }}>Verified against the live repository</h3>
              <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-pjs)', lineHeight: 1.65, margin: 0 }}>
                Framework versions, the 9-task AI routing layer with model fallbacks and per-request cost caps, BC tax math, the tokenized e-sign flow, the AI bookkeeper&apos;s receipt-reading actions, the four-sink lead delivery, and all 18 guide chapters were each confirmed in real source files — not just claimed.
              </p>
            </div>
          </div>

          {/* Under the hood accordion */}
          <div ref={sHood.ref} style={{ opacity: sHood.visible ? 1 : 0, transform: sHood.visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '30px', height: '1px', background: 'var(--primary)', opacity: 0.5 }} />
                <span style={SECTION_LABEL}>Under The Hood</span>
                <div style={{ width: '30px', height: '1px', background: 'var(--primary)', opacity: 0.5 }} />
              </div>
              <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-pjs)' }}>
                For the technically curious — the engineering that earns the &ldquo;we know AI&rdquo; claim.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {UNDER_HOOD.map((row, i) => {
                const open = openHood === i;
                return (
                  <div key={row.title} style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${open ? 'rgba(230,126,34,0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '12px', overflow: 'hidden', transition: 'border-color 0.3s ease' }}>
                    <button
                      onClick={() => setOpenHood(open ? null : i)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
                        padding: '1.25rem 1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
                      }}
                      aria-expanded={open}
                    >
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-syne)', lineHeight: 1.3 }}>{row.title}</span>
                      <span style={{ color: 'var(--primary)', display: 'flex', flexShrink: 0 }}>{open ? <Minus size={18} /> : <Plus size={18} />}</span>
                    </button>
                    <div style={{ maxHeight: open ? '300px' : '0', transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)', overflow: 'hidden' }}>
                      <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-pjs)', lineHeight: 1.7, padding: '0 1.5rem 1.5rem', margin: 0 }}>{row.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stack pills */}
            <div style={{ marginTop: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
              <p style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-pjs)', textAlign: 'center', marginBottom: '1.25rem' }}>The Stack</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center' }}>
                {STACK.map((s) => (
                  <span key={s} style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-pjs)', padding: '0.45rem 0.9rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '999px' }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          HARD CLOSE
          ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(7rem, 14vw, 14rem) 0', background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80vw', height: '80vw', background: 'radial-gradient(circle, rgba(230,126,34,0.07) 0%, transparent 50%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div ref={sClose.ref} className="container" style={{ textAlign: 'center', maxWidth: '820px', position: 'relative', zIndex: 1 }}>
          <div style={{ opacity: sClose.visible ? 1 : 0, transform: sClose.visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.97)', transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.25rem)', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-pjs)', lineHeight: 1.7, marginBottom: '2rem' }}>
              We understand your business — BC tax rules, permit authorities, snow loads, and the paperwork that eats your evenings. We understand AI as real, cost-governed infrastructure that books work and files receipts.
            </p>

            <h2 className="hard-close-h2" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)', lineHeight: 1.05, color: '#fff', fontFamily: 'var(--font-syne)', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
              That&apos;s the standard.<br /><span className="text-gradient-hero">That&apos;s Kootenay Signal.</span>
            </h2>

            <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.35rem)', color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-pjs)', marginBottom: '3rem', lineHeight: 1.6 }}>
              Want a machine like this for your trade? Let&apos;s build yours.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
              <button
                className="btn-cta-final"
                data-cal-link="kootenay-signal/30min"
                data-cal-namespace="30min"
                data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
              >
                <span>BUILD MY MACHINE</span>
                <ArrowRight size={20} />
              </button>

              <a
                href="https://www.blacktimber.ca"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'var(--font-pjs)', textTransform: 'uppercase', letterSpacing: '0.1em' }}
              >
                or explore the live Black Timber site
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer style={{ padding: '3rem 0', background: '#000', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ opacity: 0.2, fontSize: '0.7rem', letterSpacing: '0.15em', lineHeight: 2, fontWeight: 600, textTransform: 'uppercase' }}>
            &copy; {new Date().getFullYear()} Kootenay Signal<br className="mobile-hide" /> · Based in Sparwood, BC · Serving the Kootenays
          </p>
        </div>
      </footer>
    </main>
  );
}
