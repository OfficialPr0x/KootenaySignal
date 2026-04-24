'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, Check, X,
  Search, PhoneCall, DollarSign, RefreshCw,
  Smartphone, Globe, Phone, Layers, Zap, MapPin,
  ChevronLeft, ChevronRight, ExternalLink,
  Shield, Clock, TrendingUp, Gift,
} from 'lucide-react';

// ─────────────────────────────────────────────
// UPDATE THIS NUMBER AS SPOTS ARE CLAIMED
const SPOTS_CLAIMED = 3;
// ─────────────────────────────────────────────
const TOTAL_SPOTS = 10;
const STRIPE_URL = 'https://buy.stripe.com/7sY5kxbYf0I35Kk08db3q02';

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

export default function Website150() {
  const spotsLeft = TOTAL_SPOTS - SPOTS_CLAIMED;

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (function (C: any, A: string, L: string) {
      const p = function (a: any, ar: any) { a.q.push(ar); };
      const d = C.document;
      C.Cal = C.Cal || function () {
        const cal = C.Cal;
        const ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement('script')).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api: { q: unknown[]; [key: string]: unknown } = function () { p(api, arguments); } as unknown as { q: unknown[]; [key: string]: unknown };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === 'string') {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ['initNamespace', namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, 'https://app.cal.com/embed/embed.js', 'init');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).Cal('init', '30min', { origin: 'https://app.cal.com' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).Cal.ns['30min']('ui', {
      cssVarsPerTheme: { light: { 'cal-brand': '#E3A23A' }, dark: { 'cal-brand': '#0F2A24' } },
      hideEventTypeDetails: false,
      layout: 'month_view',
    });
  }, []);

  const sProb    = useReveal();
  const sWhat    = useReveal();
  const sPort    = useReveal();
  const sPrice   = useReveal();
  const sHow     = useReveal();
  const sMirror  = useReveal();
  const sInc     = useReveal();
  const sSpots   = useReveal();
  const sFinal   = useReveal();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const portfolioProjects = [
    { name: 'Passion for the Cract', url: 'passionforthecract.ca', tag: 'Craft Marketplace', image: 'https://image.thum.io/get/width/1200/crop/630/https://www.passionforthecract.ca/' },
    { name: 'HostelHack', url: 'hostelhack.com', tag: 'Travel App', image: 'https://res.cloudinary.com/dpfapm0tl/image/upload/v1774459722/744808c2-e19f-4048-803b-fa9226046a3e_hlb0oj.jpg' },
    { name: 'Revlo', url: 'wearerevlo.com', tag: 'Fitness Community', image: 'https://res.cloudinary.com/dpfapm0tl/image/upload/v1771259282/ChatGPT_Image_Feb_16_2026_11_27_50_AM_uorc1u.png' },
    { name: 'Snowblowr', url: 'snowblowr.com', tag: 'Snow Removal', image: 'https://res.cloudinary.com/dtc6oth0i/image/upload/v1764387886/ChatGPT_Image_Nov_28_2025_10_44_12_PM_idoizu.png' },
    { name: 'Scale With Jaryd', url: 'scalewithjaryd.com', tag: 'Business Coaching', image: 'https://res.cloudinary.com/ds1sfjkua/image/upload/v1765743855/ChatGPT_Image_Dec_14_2025_03_24_01_PM_fm1rgt.png' },
    { name: 'IndeedBot', url: 'indeedbot.xyz', tag: 'AI Job Search', image: 'https://res.cloudinary.com/dpfapm0tl/image/upload/v1770923699/ChatGPT_Image_Feb_12_2026_02_14_17_PM_nxwmok.png' },
    { name: 'DocsStudio', url: 'docsstudio.dev', tag: 'Documentation Tool', image: 'https://res.cloudinary.com/dpfapm0tl/image/upload/v1775257813/ChatGPT_Image_Apr_3_2026_07_08_40_PM_aqoo6r.png' },
  ];

  const goTo = (i: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const card = container.children[i] as HTMLElement;
    container.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
    setActiveIdx(i);
  };
  const goPrev = () => goTo(Math.max(0, activeIdx - 1));
  const goNext = () => goTo(Math.min(portfolioProjects.length - 1, activeIdx + 1));

  const calProps = {
    'data-cal-link': 'kootenay-signal/30min',
    'data-cal-namespace': '30min',
    'data-cal-config': '{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}',
  };

  return (
    <main style={{ background: 'var(--background)', color: 'var(--foreground)', position: 'relative', overflow: 'hidden' }}>

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', padding: '9rem 0 6rem', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-15%', left: '50%', transform: 'translateX(-50%)', width: '90vw', height: '90vw', maxWidth: '1000px', background: 'radial-gradient(circle, rgba(230,126,34,0.07) 0%, transparent 60%)', pointerEvents: 'none', filter: 'blur(60px)', zIndex: 0 }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '860px' }}>

          {/* Urgency pill */}
          <div className="hero-reveal hero-reveal-1" style={{ marginBottom: '2.5rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 1.25rem', background: 'rgba(230,126,34,0.08)', border: '1px solid rgba(230,126,34,0.25)', borderRadius: '50px', fontSize: '0.68rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--primary)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', display: 'inline-block', animation: 'pulseDot 1.5s infinite', flexShrink: 0 }} />
              {spotsLeft} of {TOTAL_SPOTS} spots remaining · Kootenay Businesses Only
            </span>
          </div>

          {/* Headline */}
          <h1 className="hero-reveal hero-reveal-2" style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5rem)', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.04em', textTransform: 'uppercase', marginBottom: '2.25rem', color: '#fff' }}>
            A $3,800 Website.<br />
            <span className="text-gradient-hero">Yours for $150.</span>
          </h1>

          <p className="hero-reveal hero-reveal-3" style={{ fontSize: 'clamp(1rem, 2.2vw, 1.25rem)', color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.8, fontFamily: 'var(--font-pjs)', fontWeight: 400 }}>
            Locking in <strong style={{ color: '#fff', fontWeight: 700 }}>exactly {TOTAL_SPOTS} Kootenay business owners</strong> at $150 —
            custom-built website, live in 7 days, everything included. 5 pages. Mobile-ready. SEO-ready.
            The kind of site agencies charge $3,800 for.{' '}
            <strong style={{ color: '#fff', fontWeight: 700 }}>When these spots are gone, this price is gone forever.</strong>
          </p>

          {/* CTA */}
          <div className="hero-reveal hero-reveal-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <a
              href={STRIPE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hero-primary"
              style={{ fontSize: '1rem', padding: '1.2rem 3rem', letterSpacing: '0.08em', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
            >
              BUY NOW · $150 · SKIP THE CALL
              <ArrowRight size={18} style={{ marginLeft: '0.6rem' }} />
            </a>
            <button {...calProps} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.55)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem', padding: '0.75rem 1.75rem', letterSpacing: '0.06em', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--font-serif)', transition: 'all 0.2s' }}>
              Or Book a Free 30-Min Call First
            </button>
            <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.28)', fontFamily: 'var(--font-pjs)', letterSpacing: '0.02em' }}>
              Pay now · Intake form in your inbox · Site live in 7 days · No headaches.
            </span>
          </div>

          {/* Spot tracker */}
          <div className="hero-reveal hero-reveal-4" style={{ marginTop: '5rem' }}>
            <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.2)', marginBottom: '1rem', fontWeight: 800 }}>Spots Claimed</p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {Array.from({ length: TOTAL_SPOTS }).map((_, i) => (
                <div key={i} style={{
                  width: '44px', height: '44px', borderRadius: '8px',
                  background: i < SPOTS_CLAIMED ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${i < SPOTS_CLAIMED ? 'var(--primary)' : 'rgba(255,255,255,0.07)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}>
                  {i < SPOTS_CLAIMED
                    ? <Check size={16} color="#fff" strokeWidth={3} />
                    : <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.2)', fontWeight: 800 }}>{i + 1}</span>}
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)', marginTop: '1rem', fontFamily: 'var(--font-pjs)' }}>
              <strong style={{ color: 'var(--primary)' }}>{SPOTS_CLAIMED} claimed</strong> · {spotsLeft} left at this price
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ PROBLEM ═══════════════════════ */}
      <section ref={sProb.ref} style={{ padding: '9rem 0', borderTop: '1px solid rgba(255,255,255,0.05)', opacity: sProb.visible ? 1 : 0, transform: sProb.visible ? 'none' : 'translateY(40px)', transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)' }}>
        <div className="container" style={{ maxWidth: '1040px' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div className="badge">The Uncomfortable Truth</div>
            <h2 style={{ fontSize: 'var(--h2-size)', lineHeight: 1.05, marginBottom: '1.25rem' }}>
              Right Now You&apos;re <span className="text-gradient">Invisible.</span><br />Or Worse — You&apos;re Repelling People.
            </h2>
            <p style={{ fontSize: 'var(--p-large-size)', color: 'rgba(255,255,255,0.5)', maxWidth: '580px', margin: '0 auto', fontFamily: 'var(--font-pjs)', lineHeight: 1.75 }}>
              While you&apos;re out there doing the actual work, your competitors —
              average skills, decent website — are taking your phone calls.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', overflow: 'hidden' }}>
            {([
              { Icon: Search, num: '01', title: 'They Google You', desc: 'Someone needs exactly what you do. They search. You don\'t show up — or what shows up looks like it was built in 2009 and never touched since.' },
              { Icon: PhoneCall, num: '02', title: 'They Call Someone Else', desc: 'Your competitor\'s site had a phone number, photos of real work, a few Google reviews. Yours had none of that. Or nothing at all.' },
              { Icon: DollarSign, num: '03', title: 'You Lose the Job', desc: 'Not because you were less qualified. Not because you were more expensive. Because you didn\'t look like you were worth calling.' },
              { Icon: RefreshCw, num: '04', title: 'And It Repeats', desc: 'Every single day. Every search. Every person who needed exactly you — ended up somewhere else. This is the leak you can\'t see.' },
            ] as { Icon: React.ElementType; num: string; title: string; desc: string }[]).map(({ Icon, num, title, desc }, i) => (
              <div key={i} style={{ padding: '3rem 2.75rem', background: 'rgba(13,17,9,1)', position: 'relative', overflow: 'hidden', transition: 'background 0.3s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(230,126,34,0.03)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(13,17,9,1)'; }}>
                <span style={{ position: 'absolute', top: '2rem', right: '2.5rem', fontSize: '3.5rem', fontWeight: 900, color: 'rgba(255,255,255,0.03)', fontFamily: 'var(--font-serif)', lineHeight: 1 }}>{num}</span>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(230,126,34,0.08)', border: '1px solid rgba(230,126,34,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <Icon size={18} color="var(--primary)" strokeWidth={1.75} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem', color: '#fff', fontFamily: 'var(--font-serif)', letterSpacing: '-0.02em' }}>{title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-pjs)', lineHeight: 1.7, fontSize: '0.92rem' }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* Problem section CTA */}
          <div style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
            <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-pjs)', marginBottom: '0.25rem' }}>
              Stop being the business they scroll past.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <a
                href={STRIPE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hero-primary"
                style={{ fontSize: '0.88rem', padding: '0.9rem 2rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', letterSpacing: '0.07em' }}
              >
                FIX THIS — $150
                <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
              </a>
              <button {...calProps} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.45)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem', padding: '0.9rem 1.75rem', letterSpacing: '0.05em', fontWeight: 600, fontFamily: 'var(--font-pjs)', transition: 'all 0.2s' }}>
                Book a Free Call
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ WHAT I BUILD ═══════════════════════ */}
      <section ref={sWhat.ref} style={{ padding: '9rem 0', borderTop: '1px solid rgba(255,255,255,0.04)', opacity: sWhat.visible ? 1 : 0, transform: sWhat.visible ? 'none' : 'translateY(40px)', transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)' }}>
        <div className="container" style={{ maxWidth: '1040px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'start' }}>
            {/* Left — sticky header */}
            <div style={{ position: 'sticky', top: '8rem' }}>
              <div className="badge">What You Get</div>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.05, marginBottom: '1.5rem' }}>
                Not a Template.<br />Not a DIY Builder.<br /><span className="text-gradient">A Real Website.</span>
              </h2>
              <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-pjs)', lineHeight: 1.8, marginBottom: '0.75rem' }}>
                Everything a Kootenay business owner needs to look credible, get found, and turn visitors into paying customers.
              </p>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-pjs)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
                Agencies charge $3,800–$8,000 for this. You pay $150. One time.
              </p>
              <a
                href={STRIPE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hero-primary"
                style={{ fontSize: '0.85rem', padding: '0.9rem 2rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
              >
                BUY NOW — $150
                <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
              </a>
              <button {...calProps} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.4)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', padding: '0.7rem 1.5rem', letterSpacing: '0.05em', fontWeight: 600, fontFamily: 'var(--font-pjs)', transition: 'all 0.2s', width: '100%', textAlign: 'center' }}>
                Or Book a Free Call
              </button>
            </div>

            {/* Right — feature list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {([
                { Icon: Smartphone, title: 'Mobile-First Design', desc: 'Over 70% of your customers are searching on their phones right now. Your site looks flawless on every screen — and Google ranks mobile-ready sites higher in local search.' },
                { Icon: Globe, title: 'Built to Rank on Google', desc: 'Local SEO baked in from day one: title tags, meta descriptions, schema markup. When someone in your area searches for what you do — you show up. Not your competitor.' },
                { Icon: Phone, title: 'Click-to-Call + Lead Forms', desc: 'One tap and they\'re calling you. A contact form that lands straight in your inbox the second it\'s filled out. Zero friction between seeing your site and booking a job.' },
                { Icon: Layers, title: 'Every Page You Actually Need', desc: 'Home, Services, About, Gallery/Portfolio, Contact — 5 fully custom pages, each designed to do a specific job: convert a visitor into a customer.' },
                { Icon: Zap, title: 'Blazing Fast, Zero Bloat', desc: 'Written in clean code — no WordPress, no Wix, no page builder garbage. Fast sites rank better on Google, hold attention longer, and look far more professional.' },
                { Icon: MapPin, title: 'Local Discovery Setup', desc: 'Google Maps embedded. Directions link included. Google Business Profile optimization guide provided. Get found by people around the corner who need you today.' },
              ] as { Icon: React.ElementType; title: string; desc: string }[]).map(({ Icon, title, desc }, i, arr) => (
                <div key={i} style={{ display: 'flex', gap: '1.25rem', padding: '1.75rem 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', alignItems: 'flex-start' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(230,126,34,0.07)', border: '1px solid rgba(230,126,34,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <Icon size={16} color="var(--primary)" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.975rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem', fontFamily: 'var(--font-serif)', letterSpacing: '-0.01em' }}>{title}</h3>
                    <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.42)', fontFamily: 'var(--font-pjs)', lineHeight: 1.65 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ PORTFOLIO ═══════════════════════ */}
      <section ref={sPort.ref} style={{ padding: '9rem 0', borderTop: '1px solid rgba(255,255,255,0.04)', opacity: sPort.visible ? 1 : 0, transform: sPort.visible ? 'none' : 'translateY(40px)', transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)' }}>
        <div className="container" style={{ maxWidth: '1180px' }}>

          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="badge">Past Work</div>
            <h2 style={{ fontSize: 'var(--h2-size)', lineHeight: 1.05, marginBottom: '1.25rem' }}>
              Real Sites.<br /><span className="text-gradient">Real Results.</span>
            </h2>
            <p style={{ fontSize: 'var(--p-size)', color: 'rgba(255,255,255,0.45)', maxWidth: '500px', margin: '0 auto', fontFamily: 'var(--font-pjs)', lineHeight: 1.75 }}>
              Every one of these was built from scratch. No templates. No drag-and-drop.
            </p>
          </div>

          {/* Carousel */}
          <div style={{ position: 'relative' }}>

            {/* Arrow — prev */}
            <button
              onClick={goPrev}
              disabled={activeIdx === 0}
              aria-label="Previous"
              style={{ position: 'absolute', left: '-1.75rem', top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(13,17,9,0.92)', border: '1px solid rgba(255,255,255,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: activeIdx === 0 ? 'not-allowed' : 'pointer', opacity: activeIdx === 0 ? 0.2 : 1, transition: 'opacity 0.2s', backdropFilter: 'blur(8px)' }}
            >
              <ChevronLeft size={18} color="#fff" strokeWidth={2} />
            </button>

            {/* Scroll container */}
            <div
              ref={scrollRef}
              style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', scrollBehavior: 'smooth', gap: '1.25rem', paddingBottom: '2px', WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'], scrollbarWidth: 'none' as React.CSSProperties['scrollbarWidth'] }}
              onScroll={() => {
                const el = scrollRef.current;
                if (!el) return;
                const cardW = (el.children[0] as HTMLElement)?.offsetWidth + 20 || 1;
                setActiveIdx(Math.round(el.scrollLeft / cardW));
              }}
            >
              {portfolioProjects.map((p, i) => (
                <a
                  key={i}
                  href={`https://www.${p.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="port-card"
                  style={{ flexShrink: 0, width: 'clamp(280px, 42vw, 460px)', scrollSnapAlign: 'start', textDecoration: 'none', display: 'block', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.015)', overflow: 'hidden', transition: 'border-color 0.3s, transform 0.3s' }}
                >
                  {/* Image */}
                  <div style={{ aspectRatio: '1.91 / 1', overflow: 'hidden', background: '#0a0d07', position: 'relative' }}>
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease' }}
                      className="port-img"
                    />
                    {/* Tag overlay */}
                    <span style={{ position: 'absolute', top: '0.85rem', left: '0.85rem', fontSize: '0.62rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--primary)', background: 'rgba(13,17,9,0.82)', border: '1px solid rgba(230,126,34,0.2)', borderRadius: '50px', padding: '0.3rem 0.75rem', backdropFilter: 'blur(6px)' }}>
                      {p.tag}
                    </span>
                  </div>

                  {/* Footer */}
                  <div style={{ padding: '1.1rem 1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.93rem', color: '#fff', margin: 0, fontFamily: 'var(--font-serif)', letterSpacing: '-0.01em' }}>{p.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.28)', margin: '0.2rem 0 0', fontFamily: 'var(--font-pjs)' }}>{p.url}</p>
                    </div>
                    <ExternalLink size={13} color="rgba(255,255,255,0.2)" style={{ flexShrink: 0 }} />
                  </div>
                </a>
              ))}
            </div>

            {/* Arrow — next */}
            <button
              onClick={goNext}
              disabled={activeIdx === portfolioProjects.length - 1}
              aria-label="Next"
              style={{ position: 'absolute', right: '-1.75rem', top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(13,17,9,0.92)', border: '1px solid rgba(255,255,255,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: activeIdx === portfolioProjects.length - 1 ? 'not-allowed' : 'pointer', opacity: activeIdx === portfolioProjects.length - 1 ? 0.2 : 1, transition: 'opacity 0.2s', backdropFilter: 'blur(8px)' }}
            >
              <ChevronRight size={18} color="#fff" strokeWidth={2} />
            </button>
          </div>

          {/* Dot indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2.25rem' }}>
            {portfolioProjects.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{ width: i === activeIdx ? '24px' : '7px', height: '7px', borderRadius: '50px', background: i === activeIdx ? 'var(--primary)' : 'rgba(255,255,255,0.15)', border: 'none', padding: 0, cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)' }}
              />
            ))}
          </div>

          {/* Portfolio section CTA */}
          <div style={{ marginTop: '3.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.28)', fontFamily: 'var(--font-pjs)' }}>
              Your business deserves a site like these. For $150.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <a
                href={STRIPE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hero-primary"
                style={{ fontSize: '0.88rem', padding: '0.9rem 2rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', letterSpacing: '0.07em' }}
              >
                GET MINE — $150
                <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
              </a>
              <button {...calProps} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.45)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem', padding: '0.9rem 1.75rem', letterSpacing: '0.05em', fontWeight: 600, fontFamily: 'var(--font-pjs)', transition: 'all 0.2s' }}>
                Book a Free Call
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ PRICE REALITY CHECK ═══════════════════════ */}
      <section ref={sPrice.ref} style={{ padding: '9rem 0', borderTop: '1px solid rgba(255,255,255,0.04)', opacity: sPrice.visible ? 1 : 0, transform: sPrice.visible ? 'none' : 'translateY(40px)', transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)' }}>
        <div className="container" style={{ maxWidth: '1040px' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div className="badge">Reality Check</div>
            <h2 style={{ fontSize: 'var(--h2-size)', lineHeight: 1.05, marginBottom: '1.25rem' }}>
              What A Website Actually Costs<br /><span className="text-gradient">Everywhere Else</span>
            </h2>
            <p style={{ fontSize: 'var(--p-size)', color: 'rgba(255,255,255,0.45)', maxWidth: '520px', margin: '0 auto', fontFamily: 'var(--font-pjs)', lineHeight: 1.75 }}>
              Understand exactly what you&apos;re walking away from if you scroll past this.
            </p>
          </div>

          {/* Table */}
          <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', overflow: 'hidden' }}>
            {/* Header row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '1rem 2rem' }}>
              {['Option', 'What You Pay', 'The Reality'].map((h, i) => (
                <span key={i} style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)' }}>{h}</span>
              ))}
            </div>
            {[
              { label: 'DIY Wix / Squarespace', price: '$30–$60 / mo', note: 'Forever. Plus your time. Plus it looks exactly like it.', bad: true },
              { label: 'Fiverr Freelancer', price: '$400–$1,200', note: 'Offshore. Slow. Generic. You get what you pay for.', bad: true },
              { label: 'Local Agency', price: '$2,500–$8,000+', note: '$200+/mo to maintain after. Months of back-and-forth.', bad: true },
              { label: 'Kootenay Signal — First 10 Only', price: '$150. Flat. Once.', note: 'Local. Professional. Done in 7 days. No monthly fees. Ever.', bad: false },
            ].map((item, i, arr) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0',
                padding: '1.5rem 2rem',
                background: item.bad ? 'transparent' : 'rgba(230,126,34,0.05)',
                borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                borderLeft: item.bad ? 'none' : '3px solid var(--primary)',
                alignItems: 'center',
              }}>
                <span style={{ fontSize: '0.9rem', fontWeight: item.bad ? 400 : 700, color: item.bad ? 'rgba(255,255,255,0.45)' : '#fff', fontFamily: 'var(--font-pjs)' }}>{item.label}</span>
                <span style={{ fontSize: item.bad ? '0.95rem' : '1.1rem', fontWeight: 800, color: item.bad ? 'rgba(255,255,255,0.3)' : 'var(--primary)', fontFamily: 'var(--font-serif)', textDecoration: item.bad ? 'line-through' : 'none', textDecorationColor: 'rgba(255,80,80,0.4)' }}>{item.price}</span>
                <span style={{ fontSize: '0.85rem', color: item.bad ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-pjs)', lineHeight: 1.5 }}>{item.note}</span>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-pjs)' }}>
            Same quality. From someone who actually knows the Kootenay market. <strong style={{ color: 'rgba(255,255,255,0.6)' }}>$150. One time.</strong>
          </p>

          {/* Price section CTA */}
          <div style={{ marginTop: '3rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a
              href={STRIPE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hero-primary"
              style={{ fontSize: '0.9rem', padding: '1rem 2.25rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', letterSpacing: '0.07em' }}
            >
              LOCK IN $150 NOW
              <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
            </a>
            <button {...calProps} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.45)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.86rem', padding: '1rem 1.75rem', letterSpacing: '0.05em', fontWeight: 600, fontFamily: 'var(--font-pjs)', transition: 'all 0.2s' }}>
              Book a Free 30-Min Call
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ THE MIRROR ═══════════════════════ */}
      <section ref={sMirror.ref} style={{ padding: '9rem 0', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', opacity: sMirror.visible ? 1 : 0, transform: sMirror.visible ? 'none' : 'translateY(40px)', transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)' }}>
        <div className="container" style={{ maxWidth: '760px', textAlign: 'center' }}>
          <div className="badge">This One&apos;s Going to Sting</div>
          <h2 style={{ fontSize: 'var(--h2-size)', lineHeight: 1.05, marginBottom: '2rem' }}>
            You Expect Your Clients to<br /><span className="text-gradient">Pull the Trigger.</span><br />Why Won&apos;t You?
          </h2>

          <div style={{ padding: '2.25rem 2.75rem', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', textAlign: 'left', marginBottom: '3.5rem', borderLeft: '3px solid var(--primary)' }}>
            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-pjs)', lineHeight: 1.9, fontStyle: 'italic' }}>
              &ldquo;You&apos;re great at what you do. You want people to just book you — no shopping around, no three quotes, no &lsquo;I&apos;ll think about it.&rsquo; You want them to see your work, trust you immediately, and just call.&rdquo;
            </p>
          </div>

          <p style={{ fontSize: 'var(--p-large-size)', color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-pjs)', lineHeight: 1.85, marginBottom: '1.75rem' }}>
            But right now, <strong style={{ color: '#fff' }}>your potential customers</strong> are doing exactly what you hate — hesitating,
            shopping around, going with whoever looks more legit online. They&apos;re not choosing your competitor because
            they&apos;re better. They&apos;re choosing them because they <em style={{ color: 'var(--primary)', fontStyle: 'normal', fontWeight: 700 }}>look</em> better.
          </p>
          <p style={{ fontSize: 'var(--p-large-size)', color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-pjs)', lineHeight: 1.85, marginBottom: '4rem' }}>
            A proper website fixes that. It&apos;s the single thing standing between you and the call that books the job.{' '}
            <strong style={{ color: '#fff' }}>Right now it costs $150.</strong>
          </p>

          {/* With / Without grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden', marginBottom: '4rem', textAlign: 'left' }}>
            {[
              { trade: 'Plumber', yes: 'Quick — calling this guy', no: 'Who are you again?' },
              { trade: 'Electrician', yes: 'Booked. Done.', no: 'Let me get 3 quotes...' },
              { trade: 'Restaurant', yes: 'Reserving right now', no: "I'll find somewhere else" },
              { trade: 'Any Trades', yes: 'They look legit, I trust them', no: "Can't find their website" },
            ].map((item, i) => (
              <div key={i} style={{ padding: '1.5rem 1.75rem', background: 'rgba(13,17,9,1)' }}>
                <p style={{ fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)', marginBottom: '0.9rem' }}>{item.trade}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <Check size={13} color="var(--accent)" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-pjs)' }}>{item.yes}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <X size={13} color="rgba(231,76,60,0.7)" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-pjs)' }}>{item.no}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.9rem' }}>
            <a
              href={STRIPE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hero-primary"
              style={{ fontSize: '0.92rem', padding: '1rem 2.5rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
            >
              OKAY — BUY MY SITE FOR $150
              <ArrowRight size={17} style={{ marginLeft: '0.6rem' }} />
            </a>
            <button {...calProps} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'var(--font-pjs)', textDecoration: 'underline', padding: 0 }}>
              or book a free call first
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ WHAT'S INCLUDED ═══════════════════════ */}
      <section ref={sInc.ref} style={{ padding: '9rem 0', opacity: sInc.visible ? 1 : 0, transform: sInc.visible ? 'none' : 'translateY(40px)', transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)' }}>
        <div className="container" style={{ maxWidth: '760px' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="badge">Every Single Thing Included</div>
            <h2 style={{ fontSize: 'var(--h2-size)', lineHeight: 1.05 }}>
              $3,800+ In Real Value.<br /><span className="text-gradient">$150 Right Now.</span>
            </h2>
            <p style={{ marginTop: '1.25rem', fontSize: 'var(--p-size)', color: 'rgba(255,255,255,0.45)', maxWidth: '560px', margin: '1.25rem auto 0', fontFamily: 'var(--font-pjs)', lineHeight: 1.75 }}>
              Here&apos;s every deliverable with its real market price attached — so you know exactly what you&apos;re walking away from if you scroll past this.
            </p>
          </div>

          <div style={{ border: '1px solid rgba(230,126,34,0.18)', borderRadius: '16px', overflow: 'hidden' }}>
            {([
              { item: 'Custom-built website — 5 full pages, zero templates', value: '$1,200', detail: 'Home, Services, About, Gallery & Contact. Every page designed from scratch to convert.' },
              { item: 'Mobile-first responsive design', value: '$400', detail: 'Pixel-perfect on every iPhone, Android, and tablet. Google rewards this with higher rankings.' },
              { item: 'Click-to-call button + working lead form', value: '$200', detail: 'One tap to dial you. Every form submission hits your inbox the moment it\'s sent.' },
              { item: 'Local SEO foundation — built to rank on Google', value: '$600', detail: 'Title tags, meta descriptions, schema markup + Google Business Profile optimization guide.' },
              { item: 'Google Maps embed + tap-to-directions link', value: '$150', detail: 'Local customers find you and navigate to you in one tap. Zero friction.' },
              { item: 'Fast-loading, clean code — no page builder bloat', value: '$350', detail: 'No Wix, no WordPress. Lean custom code = faster load times = better Google rankings.' },
              { item: 'Social media profile links + integration', value: '$100', detail: 'Instagram, Facebook, TikTok — all connected and looking sharp.' },
              { item: '7-business-day delivery', value: '$250', detail: 'Agencies take 6–12 weeks. You\'re live in a week.' },
              { item: '1 full round of revisions included', value: '$200', detail: 'Review it. Request changes. I fix it. No extra charge, no arguments.' },
              { item: '30-day post-launch support', value: '$350', detail: 'Bug? Question? Small update? I\'ve got you covered for a full month after launch.' },
            ] as { item: string; value: string; detail: string }[]).map(({ item, value, detail }, idx, arr) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '1.1rem 1.75rem', borderBottom: idx < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(230,126,34,0.03)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.9rem', flex: 1 }}>
                  <Check size={14} color="var(--accent)" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <span style={{ fontSize: '0.935rem', color: 'rgba(255,255,255,0.82)', fontFamily: 'var(--font-pjs)', display: 'block', fontWeight: 600 }}>{item}</span>
                    <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.28)', fontFamily: 'var(--font-pjs)', display: 'block', marginTop: '0.2rem', lineHeight: 1.5 }}>{detail}</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.18)', fontFamily: 'var(--font-serif)', flexShrink: 0, textDecoration: 'line-through', textDecorationColor: 'rgba(231,76,60,0.4)' }}>{value}</span>
              </div>
            ))}
            {/* Total value row */}
            <div style={{ padding: '1.1rem 1.75rem', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 900, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: 'var(--font-serif)' }}>Total Market Value</span>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'rgba(255,255,255,0.18)', fontFamily: 'var(--font-serif)', textDecoration: 'line-through', textDecorationColor: 'rgba(231,76,60,0.45)' }}>$3,800+</span>
            </div>
            {/* Price + Buy Now row */}
            <div style={{ padding: '1.75rem 1.75rem', background: 'rgba(230,126,34,0.06)', borderTop: '1px solid rgba(230,126,34,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                <span style={{ fontSize: 'clamp(2.5rem, 7vw, 3.25rem)', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-serif)', lineHeight: 1 }}>$150</span>
                <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-pjs)' }}>one-time · no monthly fees · first {TOTAL_SPOTS} only</span>
              </div>
              <a
                href={STRIPE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hero-primary"
                style={{ fontSize: '0.9rem', padding: '0.9rem 1.75rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', letterSpacing: '0.07em' }}
              >
                BUY NOW
                <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
              </a>
            </div>
          </div>

          {/* Risk reversal */}
          <div style={{ marginTop: '1.5rem', padding: '1.4rem 1.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <Shield size={18} color="var(--primary)" strokeWidth={1.75} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '0.3rem', fontFamily: 'var(--font-serif)' }}>You Review It Before It Goes Live</p>
              <p style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-pjs)', lineHeight: 1.65 }}>
                You see the site before anyone else does. If it&apos;s not right, I fix it. You don&apos;t go live until you&apos;re happy with it. Zero risk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ HOW IT WORKS ═══════════════════════ */}
      <section ref={sHow.ref} style={{ padding: '9rem 0', borderTop: '1px solid rgba(255,255,255,0.04)', opacity: sHow.visible ? 1 : 0, transform: sHow.visible ? 'none' : 'translateY(40px)', transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="badge">The Process</div>
            <h2 style={{ fontSize: 'var(--h2-size)', lineHeight: 1.05, marginBottom: '1.25rem' }}>
              From Zero to Live Site<br /><span className="text-gradient">In 3 Steps.</span>
            </h2>
            <p style={{ fontSize: 'var(--p-size)', color: 'rgba(255,255,255,0.45)', maxWidth: '480px', margin: '0 auto', fontFamily: 'var(--font-pjs)', lineHeight: 1.75 }}>
              No drawn-out meetings. No six-week timelines. No back-and-forth invoices. Here&apos;s how it actually works.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {([
              {
                step: '01',
                Icon: Gift,
                title: 'Pay $150 Today',
                desc: 'Click "Buy Now" below. Takes 2 minutes. You\'re locked in at this price — guaranteed. No call required.',
                sub: 'Or book a free 30-min call first if you want to chat before paying.',
              },
              {
                step: '02',
                Icon: Clock,
                title: 'Fill a 15-Min Form',
                desc: 'You\'ll get a short intake form by email. Tell me about your business, services, and what you want. That\'s the full extent of your work.',
                sub: '15 minutes. One time. Then I take it from here.',
              },
              {
                step: '03',
                Icon: TrendingUp,
                title: 'Review & Go Live',
                desc: 'In 7 business days, your site is ready. You review it, tell me any tweaks, I fix them. We launch. Done.',
                sub: 'No surprises. No extra invoices. Exactly what was promised.',
              },
            ] as { step: string; Icon: React.ElementType; title: string; desc: string; sub: string }[]).map(({ step, Icon: StepIcon, title, desc, sub }, i) => (
              <div key={i} style={{ padding: '2.5rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', position: 'relative', overflow: 'hidden' }}>
                <span style={{ position: 'absolute', top: '1.5rem', right: '1.75rem', fontSize: '3.5rem', fontWeight: 900, color: 'rgba(255,255,255,0.025)', fontFamily: 'var(--font-serif)', lineHeight: 1 }}>{step}</span>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(230,126,34,0.1)', border: '1px solid rgba(230,126,34,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <StepIcon size={20} color="var(--primary)" strokeWidth={1.75} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem', fontFamily: 'var(--font-serif)', letterSpacing: '-0.02em' }}>{title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-pjs)', lineHeight: 1.7, marginBottom: '1rem' }}>{desc}</p>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.22)', fontFamily: 'var(--font-pjs)', lineHeight: 1.6, fontStyle: 'italic' }}>{sub}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.9rem' }}>
            <a
              href={STRIPE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hero-primary"
              style={{ fontSize: '0.95rem', padding: '1.1rem 2.75rem', letterSpacing: '0.08em', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
            >
              START NOW — PAY $150
              <ArrowRight size={18} style={{ marginLeft: '0.6rem' }} />
            </a>
            <p style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-pjs)' }}>
              {spotsLeft} spots left · Kootenay businesses only
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ SPOTS COUNTER ═══════════════════════ */}
      <section ref={sSpots.ref} style={{ padding: '9rem 0', borderTop: '1px solid rgba(230,126,34,0.08)', borderBottom: '1px solid rgba(230,126,34,0.08)', opacity: sSpots.visible ? 1 : 0, transform: sSpots.visible ? 'none' : 'translateY(40px)', transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(230,126,34,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ textAlign: 'center', maxWidth: '640px', position: 'relative', zIndex: 1 }}>
          <span className="text-gradient-hero" style={{ fontSize: 'clamp(7rem, 22vw, 14rem)', fontWeight: 800, display: 'block', lineHeight: 0.85, fontFamily: 'var(--font-serif)', marginBottom: '1.5rem' }}>{spotsLeft}</span>
          <h2 style={{ fontSize: 'var(--h3-size)', marginBottom: '1.25rem', color: 'rgba(255,255,255,0.8)', letterSpacing: '-0.02em' }}>Spots Left at $150</h2>
          <p style={{ fontSize: 'var(--p-large-size)', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-pjs)', lineHeight: 1.75, marginBottom: '3rem' }}>
            When these are gone, the price goes back to market rate.
            No waitlist. No deal later.{' '}
            <strong style={{ color: 'rgba(255,255,255,0.75)' }}>This is literally it.</strong>
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '3.5rem', flexWrap: 'wrap' }}>
            {Array.from({ length: TOTAL_SPOTS }).map((_, i) => (
              <div key={i} style={{ width: '52px', height: '52px', borderRadius: '10px', background: i < SPOTS_CLAIMED ? 'var(--primary)' : 'rgba(255,255,255,0.04)', border: `1px solid ${i < SPOTS_CLAIMED ? 'var(--primary)' : 'rgba(255,255,255,0.07)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {i < SPOTS_CLAIMED
                  ? <Check size={20} color="#fff" strokeWidth={2.5} />
                  : <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', fontWeight: 800 }}>{i + 1}</span>}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.9rem' }}>
            <a
              href={STRIPE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hero-primary"
              style={{ fontSize: '0.95rem', padding: '1.1rem 2.75rem', letterSpacing: '0.1em', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
            >
              CLAIM MY SPOT — $150
              <ArrowRight size={18} style={{ marginLeft: '0.6rem' }} />
            </a>
            <button {...calProps} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'var(--font-pjs)', textDecoration: 'underline', padding: 0 }}>
              or book a free 30-min call first
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ FINAL CTA ═══════════════════════ */}
      <section ref={sFinal.ref} style={{ padding: '11rem 0', textAlign: 'center', opacity: sFinal.visible ? 1 : 0, transform: sFinal.visible ? 'none' : 'translateY(40px)', transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: '-20%', left: '50%', transform: 'translateX(-50%)', width: '80vw', height: '80vw', maxWidth: '800px', background: 'radial-gradient(circle, rgba(230,126,34,0.06) 0%, transparent 65%)', pointerEvents: 'none', filter: 'blur(60px)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '680px' }}>
          <div className="badge">Last Chance</div>
          <h2 style={{ fontSize: 'var(--h2-size)', lineHeight: 1.05, marginBottom: '1.5rem' }}>
            Stop Letting a Bad Website<br /><span className="text-gradient">Cost You Clients.</span>
          </h2>
          <p style={{ fontSize: 'var(--p-large-size)', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-pjs)', lineHeight: 1.85, marginBottom: '3.5rem' }}>
            Right now, someone in the Kootenays is searching for exactly what you offer — and they&apos;re finding your competition instead.
            $150 fixes that. A professional site, live in 7 days, zero monthly fees.{' '}
            <strong style={{ color: 'rgba(255,255,255,0.75)' }}>When these {spotsLeft} spots are gone, this price is gone. No waitlist. No exceptions.</strong>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.75rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.9rem' }}>
              <a
                href={STRIPE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hero-primary"
                style={{ fontSize: '1rem', padding: '1.2rem 3rem', letterSpacing: '0.08em', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
              >
                BUY NOW — LOCK IN $150
                <ArrowRight size={18} style={{ marginLeft: '0.65rem' }} />
              </a>
              <button {...calProps} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.4)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', padding: '0.7rem 1.75rem', letterSpacing: '0.05em', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--font-serif)', transition: 'all 0.2s' }}>
                Book a Free Call First
              </button>
            </div>
            <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {[`${spotsLeft} spots left at this price`, 'No monthly fees. Ever.', '7-day delivery', 'Review before it goes live'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.28)', fontFamily: 'var(--font-pjs)' }}>
                  <Check size={11} color="var(--accent)" strokeWidth={3} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(0.7); }
        }
        .port-card:hover { border-color: rgba(230,126,34,0.22) !important; transform: translateY(-2px); }
        .port-card:hover .port-img { transform: scale(1.04); }
        @media (max-width: 768px) {
          .w150-two-col { grid-template-columns: 1fr !important; }
          .w150-price-row { grid-template-columns: 1fr !important; gap: 0.35rem !important; }
          .w150-sticky { position: static !important; }
        }
      `}</style>
    </main>
  );
}
