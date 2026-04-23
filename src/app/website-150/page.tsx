'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, Check, X,
  Search, PhoneCall, DollarSign, RefreshCw,
  Smartphone, Globe, Phone, Layers, Zap, MapPin,
} from 'lucide-react';

// ─────────────────────────────────────────────
// UPDATE THIS NUMBER AS SPOTS ARE CLAIMED
const SPOTS_CLAIMED = 3;
// ─────────────────────────────────────────────
const TOTAL_SPOTS = 10;

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
  const sPrice   = useReveal();
  const sMirror  = useReveal();
  const sInc     = useReveal();
  const sSpots   = useReveal();
  const sFinal   = useReveal();

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
          <h1 className="hero-reveal hero-reveal-2" style={{ fontSize: 'clamp(3.25rem, 10vw, 7.5rem)', fontWeight: 800, lineHeight: 0.88, letterSpacing: '-0.04em', textTransform: 'uppercase', marginBottom: '2.25rem', color: '#fff' }}>
            A Website<br />That Actually<br />
            <span className="text-gradient-hero">Works. $150.</span>
          </h1>

          <p className="hero-reveal hero-reveal-3" style={{ fontSize: 'clamp(1rem, 2.2vw, 1.25rem)', color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.8, fontFamily: 'var(--font-pjs)', fontWeight: 400 }}>
            Locking in <strong style={{ color: '#fff', fontWeight: 700 }}>exactly {TOTAL_SPOTS} Kootenay business owners</strong> at a flat $150 —
            built, launched, done. Invisible online? Broken site? I&apos;m fixing it.
            This price doesn&apos;t exist anywhere else. It won&apos;t exist here much longer.
          </p>

          {/* CTA */}
          <div className="hero-reveal hero-reveal-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <button className="btn-hero-primary" {...calProps} style={{ fontSize: '0.95rem', padding: '1.1rem 2.75rem', letterSpacing: '0.1em' }}>
              LOCK IN MY SPOT — $150
              <ArrowRight size={18} style={{ marginLeft: '0.6rem' }} />
            </button>
            <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.28)', fontFamily: 'var(--font-pjs)', letterSpacing: '0.02em' }}>
              No contracts. No monthly fees. No bullshit.
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
              <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-pjs)', lineHeight: 1.8, marginBottom: '2.5rem' }}>
                Everything a Kootenay business owner needs to look credible, get found, and turn visitors into paying customers.
              </p>
              <button className="btn-hero-primary" {...calProps} style={{ fontSize: '0.85rem', padding: '0.9rem 2rem' }}>
                GET STARTED — $150
                <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
              </button>
            </div>

            {/* Right — feature list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {([
                { Icon: Smartphone, title: 'Mobile-First Design', desc: '70%+ of your customers are searching on their phone. Your site looks perfect on every screen.' },
                { Icon: Globe, title: 'Google-Ready SEO', desc: 'Structured so Google knows you exist. Show up when locals search for what you do.' },
                { Icon: Phone, title: 'Click-to-Call & Contact Forms', desc: 'One tap to call you. A form that gets you real leads. Zero friction between them and booking.' },
                { Icon: Layers, title: 'Portfolio & Services Pages', desc: 'Show your work. List your services. Give them every reason to choose you over the next guy.' },
                { Icon: Zap, title: 'Fast & Reliable', desc: 'No bloated builders. No plugins dragging you down. Clean, fast, professional code.' },
                { Icon: MapPin, title: 'Local Presence Setup', desc: 'Google Maps embed and Google Business Profile tips so locals find you first.' },
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

          <button className="btn-hero-primary" {...calProps} style={{ fontSize: '0.92rem', padding: '1rem 2.5rem' }}>
            OKAY — BOOK MY SPOT
            <ArrowRight size={17} style={{ marginLeft: '0.6rem' }} />
          </button>
        </div>
      </section>

      {/* ═══════════════════════ WHAT'S INCLUDED ═══════════════════════ */}
      <section ref={sInc.ref} style={{ padding: '9rem 0', opacity: sInc.visible ? 1 : 0, transform: sInc.visible ? 'none' : 'translateY(40px)', transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)' }}>
        <div className="container" style={{ maxWidth: '660px' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="badge">Every Single Thing Included</div>
            <h2 style={{ fontSize: 'var(--h2-size)', lineHeight: 1.05 }}>
              $150. <span className="text-gradient">Here&apos;s Exactly What You Get.</span>
            </h2>
          </div>

          <div style={{ border: '1px solid rgba(230,126,34,0.18)', borderRadius: '16px', overflow: 'hidden' }}>
            {[
              'Custom-designed website — not a Wix template',
              'Up to 5 pages: Home, Services, About, Gallery/Portfolio, Contact',
              'Mobile-responsive — perfect on every device',
              'Click-to-call button + working contact form',
              'SEO foundation: title tags, meta descriptions, structured for Google',
              'Google Maps embed + directions link',
              'Fast load times — zero bloated page builders',
              'Social media profile links',
              'Delivered within 7 business days',
              '1 round of revisions included',
              '30-day post-launch support',
            ].map((item, idx, arr) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.1rem 1.75rem', borderBottom: idx < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(230,126,34,0.03)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}>
                <Check size={14} color="var(--accent)" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.935rem', color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-pjs)' }}>{item}</span>
              </div>
            ))}
            <div style={{ padding: '1.75rem 1.75rem', background: 'rgba(230,126,34,0.06)', borderTop: '1px solid rgba(230,126,34,0.18)', display: 'flex', alignItems: 'baseline', gap: '1rem', justifyContent: 'center' }}>
              <span style={{ fontSize: 'clamp(2.5rem, 7vw, 3.25rem)', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-serif)', lineHeight: 1 }}>$150</span>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-pjs)' }}>one-time · no monthly fees · first {TOTAL_SPOTS} only</span>
            </div>
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

          <button className="btn-hero-primary" {...calProps} style={{ fontSize: '0.95rem', padding: '1.1rem 2.75rem', letterSpacing: '0.1em' }}>
            I WANT ONE OF THESE SPOTS
            <ArrowRight size={18} style={{ marginLeft: '0.6rem' }} />
          </button>
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
            Book a 30-minute call. Tell me about your business.
            I&apos;ll build something that makes people reach out and actually book you.{' '}
            <strong style={{ color: 'rgba(255,255,255,0.75)' }}>$150. Done. No headaches.</strong>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.75rem' }}>
            <button className="btn-hero-primary" {...calProps} style={{ fontSize: '1rem', padding: '1.2rem 3rem', letterSpacing: '0.08em' }}>
              BOOK MY $150 WEBSITE — RIGHT NOW
              <ArrowRight size={18} style={{ marginLeft: '0.65rem' }} />
            </button>
            <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['Only 10 spots total', 'No monthly fees', 'Local to the Kootenays', '7-day delivery'].map((item, i) => (
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
        @media (max-width: 768px) {
          .w150-two-col { grid-template-columns: 1fr !important; }
          .w150-price-row { grid-template-columns: 1fr !important; gap: 0.35rem !important; }
          .w150-sticky { position: static !important; }
        }
      `}</style>
    </main>
  );
}
