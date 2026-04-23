'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';

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
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', padding: '8rem 0 5rem', overflow: 'hidden' }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '80vw', height: '80vw', maxWidth: '900px', background: 'radial-gradient(circle, rgba(230,126,34,0.09) 0%, transparent 65%)', pointerEvents: 'none', filter: 'blur(40px)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '920px' }}>

          {/* Live urgency badge */}
          <div className="hero-reveal hero-reveal-1" style={{ marginBottom: '2rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 1.25rem', background: 'rgba(230,126,34,0.1)', border: '1px solid var(--border-color)', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--primary)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', display: 'inline-block', animation: 'pulseDot 1.5s infinite' }} />
              {spotsLeft} of {TOTAL_SPOTS} spots remaining · Kootenay Businesses Only
            </span>
          </div>

          {/* Main headline */}
          <h1 className="hero-reveal hero-reveal-2" style={{ fontSize: 'clamp(3rem, 9vw, 7rem)', fontWeight: 800, lineHeight: 0.9, letterSpacing: '-0.04em', textTransform: 'uppercase', marginBottom: '2rem', color: '#fff' }}>
            A Website<br />That Actually<br />
            <span className="text-gradient-hero">Works. $150.</span>
          </h1>

          <p className="hero-reveal hero-reveal-3" style={{ fontSize: 'clamp(1.05rem, 2.5vw, 1.35rem)', color: 'rgba(255,255,255,0.65)', maxWidth: '640px', margin: '0 auto 3rem', lineHeight: 1.75, fontFamily: 'var(--font-pjs)' }}>
            I&apos;m locking in <strong style={{ color: 'var(--primary)' }}>exactly {TOTAL_SPOTS} Kootenay business owners</strong> at $150 —
            built, launched, done. Whether you&apos;re invisible online or have a broken embarrassment of a site, I&apos;m fixing it.
            This price doesn&apos;t exist anywhere else. It won&apos;t exist here for long either.
          </p>

          {/* Primary CTA */}
          <div className="hero-reveal hero-reveal-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <button className="btn-hero-primary" {...calProps} style={{ fontSize: '1rem', padding: '1.1rem 2.75rem', letterSpacing: '0.1em' }}>
              LOCK IN MY SPOT — $150
              <ArrowRight size={20} style={{ marginLeft: '0.75rem' }} />
            </button>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-pjs)' }}>
              No contracts. No monthly fees. Just a website that works.
            </span>
          </div>

          {/* Spot tracker */}
          <div className="hero-reveal hero-reveal-4" style={{ marginTop: '4rem' }}>
            <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.25)', marginBottom: '0.75rem', fontWeight: 700 }}>Spots Claimed</p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {Array.from({ length: TOTAL_SPOTS }).map((_, i) => (
                <div key={i} style={{ width: '42px', height: '42px', borderRadius: '8px', background: i < SPOTS_CLAIMED ? 'var(--primary)' : 'rgba(255,255,255,0.05)', border: `1px solid ${i < SPOTS_CLAIMED ? 'var(--primary)' : 'rgba(255,255,255,0.08)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {i < SPOTS_CLAIMED
                    ? <Check size={16} color="#fff" strokeWidth={3} />
                    : <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', fontWeight: 700 }}>{i + 1}</span>}
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.75rem', fontFamily: 'var(--font-pjs)' }}>
              <strong style={{ color: 'var(--primary)' }}>{SPOTS_CLAIMED} claimed</strong> — {spotsLeft} left at this price
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ PROBLEM ═══════════════════════ */}
      <section ref={sProb.ref} style={{ padding: '8rem 0', borderTop: '1px solid rgba(255,255,255,0.05)', opacity: sProb.visible ? 1 : 0, transform: sProb.visible ? 'none' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="badge">The Uncomfortable Truth</div>
          <h2 style={{ fontSize: 'var(--h2-size)', marginBottom: '1.5rem', lineHeight: 1.05 }}>
            Right Now You&apos;re <span className="text-gradient">Invisible.</span><br />Or Worse — You&apos;re Repelling People.
          </h2>
          <p style={{ fontSize: 'var(--p-large-size)', color: 'rgba(255,255,255,0.55)', maxWidth: '660px', margin: '0 auto 5rem', fontFamily: 'var(--font-pjs)', lineHeight: 1.75 }}>
            While you&apos;re out there doing the actual work, your competitors — average skills, decent website — are taking your phone calls.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.5rem', textAlign: 'left', maxWidth: '920px', margin: '0 auto' }}>
            {[
              { icon: '🔍', title: 'They Google You', desc: "Someone needs exactly what you do. They search. You don't show up — or what shows up looks like it was built in 2009 and never touched since." },
              { icon: '📞', title: 'They Call Someone Else', desc: "Your competitor's site had a phone number, photos of real work, and a few Google reviews. Yours had none of that. Or nothing at all." },
              { icon: '💸', title: 'You Lose the Job', desc: "Not because you were less qualified. Not because you were more expensive. Because you didn't look like you were worth calling." },
              { icon: '🔄', title: 'And It Repeats', desc: "Every single day. Every search. Every person who needed exactly you — but ended up somewhere else. This is the leak you can't see." },
            ].map((item, i) => (
              <div key={i} className="service-card" style={{ padding: '2rem 1.75rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', color: '#fff' }}>{item.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-pjs)', lineHeight: 1.65, fontSize: '0.95rem' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ WHAT I BUILD ═══════════════════════ */}
      <section ref={sWhat.ref} style={{ padding: '8rem 0', background: 'rgba(230,126,34,0.025)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', opacity: sWhat.visible ? 1 : 0, transform: sWhat.visible ? 'none' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="badge">What You Get</div>
            <h2 style={{ fontSize: 'var(--h2-size)', lineHeight: 1.05, marginBottom: '1rem' }}>
              Not a Template. Not a DIY Builder.<br /><span className="text-gradient">A Real Website.</span>
            </h2>
            <p style={{ fontSize: 'var(--p-size)', color: 'rgba(255,255,255,0.55)', maxWidth: '560px', margin: '0 auto', fontFamily: 'var(--font-pjs)', lineHeight: 1.75 }}>
              Everything a Kootenay business owner needs to look credible, get found, and turn visitors into paying customers.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', maxWidth: '920px', margin: '0 auto' }}>
            {[
              { icon: '📱', title: 'Mobile-First Design', desc: '70%+ of your customers are searching on their phone. Your site looks perfect on every screen.' },
              { icon: '🚀', title: 'Google-Ready SEO', desc: "Structured so Google actually knows you exist. Show up when locals search for what you do." },
              { icon: '📞', title: 'Click-to-Call & Contact Forms', desc: 'One tap to call you. A form that gets you real leads. No friction between them and booking.' },
              { icon: '🏆', title: 'Portfolio & Services Pages', desc: 'Show your work. List your services. Give them every reason to choose you over the next guy.' },
              { icon: '⚡', title: 'Fast & Reliable', desc: 'No bloated page builders. No plugins dragging you down. Clean, fast, professional code.' },
              { icon: '🗺️', title: 'Local Presence Setup', desc: 'Google Maps embed and tips to nail your Google Business Profile so locals find you first.' },
            ].map((item, i) => (
              <div
                key={i}
                style={{ padding: '1.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', transition: 'all 0.3s ease', cursor: 'default' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(230,126,34,0.3)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(230,126,34,0.04)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'; }}
              >
                <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff', fontFamily: 'var(--font-serif)' }}>{item.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-pjs)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ PRICE REALITY CHECK ═══════════════════════ */}
      <section ref={sPrice.ref} style={{ padding: '8rem 0', opacity: sPrice.visible ? 1 : 0, transform: sPrice.visible ? 'none' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="badge">Reality Check</div>
          <h2 style={{ fontSize: 'var(--h2-size)', lineHeight: 1.05, marginBottom: '1rem' }}>
            What A Website Actually Costs<br /><span className="text-gradient">Everywhere Else</span>
          </h2>
          <p style={{ fontSize: 'var(--p-size)', color: 'rgba(255,255,255,0.55)', maxWidth: '560px', margin: '0 auto 4rem', fontFamily: 'var(--font-pjs)', lineHeight: 1.75 }}>
            I want you to understand exactly what you&apos;re walking away from if you scroll past this.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.5rem', maxWidth: '980px', margin: '0 auto 4rem' }}>
            {[
              { label: 'DIY Wix / Squarespace', price: '$30–$60/mo', note: 'Forever. Plus your time. Plus it looks exactly like it.', bad: true },
              { label: 'Fiverr Freelancer', price: '$400–$1,200', note: 'Offshore. Slow. Generic. You get exactly what you pay for.', bad: true },
              { label: 'Local Agency', price: '$2,500–$8,000+', note: 'Then $200+/mo to maintain. Months of back-and-forth. Committees.', bad: true },
              { label: 'Kootenay Signal\n(First 10 Only)', price: '$150. Flat.', note: 'One time. Done. Local. Professional. No monthly fees. Ever.', bad: false },
            ].map((item, i) => (
              <div key={i} style={{ padding: '2rem 1.5rem', background: item.bad ? 'rgba(255,255,255,0.02)' : 'rgba(230,126,34,0.08)', border: `1px solid ${item.bad ? 'rgba(255,255,255,0.06)' : 'rgba(230,126,34,0.4)'}`, borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
                {!item.bad && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--primary), #f0a556)' }} />}
                {!item.bad && <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'var(--primary)', color: '#fff', fontSize: '0.58rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', padding: '0.25rem 0.6rem', borderRadius: '50px' }}>This Is You</div>}
                <div style={{ marginBottom: '0.5rem', fontSize: '0.75rem', color: item.bad ? 'rgba(255,255,255,0.35)' : 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'pre-line' }}>{item.label}</div>
                <div style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 800, color: item.bad ? 'rgba(255,255,255,0.6)' : '#fff', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)', textDecoration: item.bad ? 'line-through' : 'none', textDecorationColor: 'rgba(255,80,80,0.5)' }}>{item.price}</div>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-pjs)', lineHeight: 1.5 }}>{item.note}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'inline-block', padding: '1.25rem 2.5rem', background: 'rgba(230,126,34,0.05)', border: '1px solid rgba(230,126,34,0.15)', borderRadius: '12px', fontSize: 'var(--p-size)', color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-pjs)', lineHeight: 1.7 }}>
            You&apos;re not just saving money. You&apos;re getting the same quality<br />— from someone who actually knows <strong style={{ color: 'var(--primary)' }}>the Kootenay market</strong>.
          </div>
        </div>
      </section>

      {/* ═══════════════════════ THE MIRROR ═══════════════════════ */}
      <section ref={sMirror.ref} style={{ padding: '8rem 0', background: 'rgba(0,0,0,0.25)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', opacity: sMirror.visible ? 1 : 0, transform: sMirror.visible ? 'none' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
        <div className="container" style={{ maxWidth: '780px', textAlign: 'center' }}>
          <div className="badge">This One&apos;s Going to Sting a Little</div>
          <h2 style={{ fontSize: 'var(--h2-size)', lineHeight: 1.05, marginBottom: '2rem' }}>
            You Expect Your Clients to<br /><span className="text-gradient">Pull the Trigger.</span><br />Why Won&apos;t You?
          </h2>

          <div style={{ padding: '2.5rem', background: 'rgba(230,126,34,0.04)', border: '1px solid rgba(230,126,34,0.15)', borderRadius: '16px', textAlign: 'left', marginBottom: '3rem' }}>
            <p style={{ fontSize: 'var(--p-size)', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-pjs)', lineHeight: 1.85, fontStyle: 'italic' }}>
              &ldquo;You&apos;re great at what you do. You want people to just book you — without shopping around,
              without getting three quotes, without &lsquo;thinking about it.&rsquo; You want them to see your work,
              trust you immediately, and just call.&rdquo;
            </p>
          </div>

          <p style={{ fontSize: 'var(--p-large-size)', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-pjs)', lineHeight: 1.8, marginBottom: '2rem' }}>
            But right now, <strong style={{ color: '#fff' }}>YOUR potential customers</strong> are doing exactly what you hate —
            hesitating, shopping around, going with whoever looks more legit online.
            They&apos;re not choosing your competitor because they&apos;re better.
            They&apos;re choosing them because they <em style={{ color: 'var(--primary)' }}>look</em> better.
          </p>

          <p style={{ fontSize: 'var(--p-large-size)', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-pjs)', lineHeight: 1.8, marginBottom: '3.5rem' }}>
            A proper website fixes that. It&apos;s not a luxury. It&apos;s the single thing standing between you
            and the call that books the job. <strong style={{ color: '#fff' }}>And right now it costs $150.</strong>
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3.5rem' }}>
            {[
              { job: 'Plumber', yes: 'Quick, calling this guy', no: 'Who are you again?' },
              { job: 'Electrician', yes: 'Booked. Done.', no: 'Let me get 3 quotes...' },
              { job: 'Restaurant', yes: 'Reserving right now', no: "I'll find somewhere else" },
              { job: 'Any Trades', yes: 'They look legit, I trust them', no: "Can't find their website" },
            ].map((item, i) => (
              <div key={i} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', textAlign: 'left' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)', marginBottom: '0.75rem' }}>{item.job}</div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Check size={14} color="#27ae60" strokeWidth={3} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-pjs)' }}>{item.yes}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <X size={14} color="#e74c3c" strokeWidth={3} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-pjs)' }}>{item.no}</span>
                </div>
              </div>
            ))}
          </div>

          <button className="btn-hero-primary" {...calProps} style={{ fontSize: '0.95rem', padding: '1rem 2.5rem' }}>
            OKAY, I&apos;M IN — BOOK MY SPOT
            <ArrowRight size={18} style={{ marginLeft: '0.6rem' }} />
          </button>
        </div>
      </section>

      {/* ═══════════════════════ WHAT'S INCLUDED ═══════════════════════ */}
      <section ref={sInc.ref} style={{ padding: '8rem 0', opacity: sInc.visible ? 1 : 0, transform: sInc.visible ? 'none' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="badge">Every Single Thing Included</div>
            <h2 style={{ fontSize: 'var(--h2-size)', lineHeight: 1.05 }}>
              $150. <span className="text-gradient">Here&apos;s Exactly What You Get.</span>
            </h2>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(230,126,34,0.2)', borderRadius: '16px', overflow: 'hidden' }}>
            {[
              'Custom-designed website — not a Wix template',
              'Up to 5 pages: Home, Services, About, Gallery / Portfolio, Contact',
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
              <div
                key={idx}
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.1rem 1.75rem', borderBottom: idx < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.2s ease', cursor: 'default' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(230,126,34,0.03)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
              >
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(39,174,96,0.12)', border: '1px solid rgba(39,174,96,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={12} color="#27ae60" strokeWidth={3} />
                </div>
                <span style={{ fontSize: '0.975rem', color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-pjs)' }}>{item}</span>
              </div>
            ))}

            {/* Price footer */}
            <div style={{ padding: '1.75rem', background: 'rgba(230,126,34,0.07)', borderTop: '1px solid rgba(230,126,34,0.2)', textAlign: 'center' }}>
              <span style={{ fontSize: 'clamp(2.5rem, 7vw, 3.5rem)', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}>$150</span>
              <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.35)', marginLeft: '0.75rem', fontFamily: 'var(--font-pjs)' }}>one-time · no monthly fees · first {TOTAL_SPOTS} only</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ SPOTS COUNTER ═══════════════════════ */}
      <section ref={sSpots.ref} style={{ padding: '8rem 0', background: 'rgba(230,126,34,0.04)', borderTop: '1px solid rgba(230,126,34,0.1)', borderBottom: '1px solid rgba(230,126,34,0.1)', opacity: sSpots.visible ? 1 : 0, transform: sSpots.visible ? 'none' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '680px' }}>
          <span className="text-gradient-hero" style={{ fontSize: 'clamp(6rem, 20vw, 12rem)', fontWeight: 800, display: 'block', lineHeight: 1, fontFamily: 'var(--font-serif)' }}>{spotsLeft}</span>
          <h2 style={{ fontSize: 'var(--h3-size)', marginBottom: '1.5rem', color: 'rgba(255,255,255,0.85)' }}>Spots Left at $150</h2>
          <p style={{ fontSize: 'var(--p-large-size)', color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-pjs)', lineHeight: 1.75, marginBottom: '3rem' }}>
            When these spots are gone, the price goes back to market rate.
            There&apos;s no waitlist. There&apos;s no deal later.{' '}
            <strong style={{ color: '#fff' }}>This is literally it.</strong>
          </p>

          <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap' }}>
            {Array.from({ length: TOTAL_SPOTS }).map((_, i) => (
              <div key={i} style={{ width: '54px', height: '54px', borderRadius: '12px', background: i < SPOTS_CLAIMED ? 'var(--primary)' : 'rgba(255,255,255,0.05)', border: `1px solid ${i < SPOTS_CLAIMED ? 'var(--primary)' : 'rgba(255,255,255,0.08)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {i < SPOTS_CLAIMED
                  ? <Check size={22} color="#fff" strokeWidth={3} />
                  : <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', fontWeight: 700 }}>{i + 1}</span>}
              </div>
            ))}
          </div>

          <button className="btn-hero-primary" {...calProps} style={{ fontSize: '1rem', padding: '1.1rem 3rem', letterSpacing: '0.1em' }}>
            I WANT ONE OF THESE SPOTS
            <ArrowRight size={20} style={{ marginLeft: '0.75rem' }} />
          </button>
        </div>
      </section>

      {/* ═══════════════════════ FINAL CTA ═══════════════════════ */}
      <section ref={sFinal.ref} style={{ padding: '10rem 0', textAlign: 'center', opacity: sFinal.visible ? 1 : 0, transform: sFinal.visible ? 'none' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: '-20%', left: '50%', transform: 'translateX(-50%)', width: '80vw', height: '80vw', maxWidth: '800px', background: 'radial-gradient(circle, rgba(230,126,34,0.07) 0%, transparent 65%)', pointerEvents: 'none', filter: 'blur(60px)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '700px' }}>
          <div className="badge">Last Chance Energy</div>
          <h2 style={{ fontSize: 'var(--h2-size)', lineHeight: 1.05, marginBottom: '1.5rem' }}>
            Stop Letting a Bad Website<br /><span className="text-gradient">Cost You Clients.</span>
          </h2>
          <p style={{ fontSize: 'var(--p-large-size)', color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-pjs)', lineHeight: 1.8, marginBottom: '3rem' }}>
            Book a 30-minute call. Tell me about your business.
            I&apos;ll build you something that makes people actually reach out — and actually book you.
            <strong style={{ color: '#fff' }}> $150. Done. No headaches.</strong>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <button className="btn-hero-primary" {...calProps} style={{ fontSize: '1.05rem', padding: '1.2rem 3rem', letterSpacing: '0.08em' }}>
              BOOK MY $150 WEBSITE — RIGHT NOW
              <ArrowRight size={20} style={{ marginLeft: '0.75rem' }} />
            </button>
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['Only 10 spots total', 'No monthly fees', 'Local to the Kootenays', '7-day delivery'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-pjs)' }}>
                  <Check size={12} color="var(--accent)" strokeWidth={3} />
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
          50% { opacity: 0.4; transform: scale(0.75); }
        }
      `}</style>
    </main>
  );
}
