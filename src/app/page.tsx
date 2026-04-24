'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  PhoneIncoming, 
  CalendarCheck, 
  TrendingUp,
  Search,
  Users,
  Shield,
  Check,
  Globe,
  Megaphone,
  Wrench,
  MessageSquare,
  BarChart3,
  Zap,
  Star,
  X,
  Phone,
  MapPin,
  MousePointerClick,
  RefreshCw
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
function Counter({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
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

export default function Home() {

  const calLoaded = useRef(false);

  const loadCal = () => {
    if (calLoaded.current) return;
    calLoaded.current = true;
    (function (C, A, L) {
      let p = function (a: any, ar: any) { a.q.push(ar); };
      let d = C.document;
      // @ts-ignore
      C.Cal = C.Cal || function () {
        // @ts-ignore
        let cal = C.Cal;
        let ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function () { p(api, arguments); };
          const namespace = ar[1];
          // @ts-ignore
          api.q = api.q || [];
          // @ts-ignore
          if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
      // @ts-ignore
    })(window, "https://app.cal.com/embed/embed.js", "init");
    // @ts-ignore
    Cal("init", "30min", { origin: "https://app.cal.com" });
    // @ts-ignore
    Cal.ns["30min"]("ui", { "cssVarsPerTheme": { "light": { "cal-brand": "#E3A23A" }, "dark": { "cal-brand": "#0F2A24" } }, "hideEventTypeDetails": false, "layout": "month_view" });
  };

  useEffect(() => {
    // Load Cal on first pointer interaction anywhere on the page
    const handler = () => loadCal();
    window.addEventListener('pointerdown', handler, { once: true });
    window.addEventListener('touchstart', handler, { once: true, passive: true });
    return () => {
      window.removeEventListener('pointerdown', handler);
      window.removeEventListener('touchstart', handler);
    };
  }, []);

  const s2 = useReveal();
  const s3 = useReveal();
  const s4 = useReveal();
  const s5 = useReveal();
  const s6 = useReveal();
  const s7 = useReveal();
  const s8 = useReveal();
  const s9 = useReveal();

  return (
    <main style={{ position: 'relative', overflow: 'hidden' }}>

      {/* ═══════════════════════════════════════════════════════════
          HERO — THE PROBLEM + THE RESULT
          ═══════════════════════════════════════════════════════════ */}
      <section className="hero" style={{
        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,1) 100%), url('https://res.cloudinary.com/doajstql7/image/upload/v1777002754/ChatGPT_Image_Apr_23_2026_10_40_28_PM_z260fw.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 35%',
        position: 'relative',
      }}>
        {/* Grain overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.035, pointerEvents: 'none',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat', zIndex: 1
        }} />
        {/* Orange glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '5%', width: '55vw', height: '55vw',
          background: 'radial-gradient(circle, rgba(230,126,34,0.07) 0%, transparent 65%)',
          pointerEvents: 'none', zIndex: 1, filter: 'blur(80px)'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-content mobile-center">

            {/* Micro-label */}
            <div className="hero-reveal hero-reveal-1" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
              marginBottom: '2rem'
            }}>
              <div style={{ width: '40px', height: '1px', background: 'var(--primary)' }} />
              <span style={{
                fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase',
                letterSpacing: '0.3em', color: 'var(--primary)'
              }}>Sparwood, BC · Contractors</span>
            </div>

            <h1 className="hero-reveal hero-reveal-2 mobile-center" style={{ color: '#fff' }}>
              Your phone<br />should be ringing.<br />
              <span className="text-gradient-hero">It&apos;s not.</span>
            </h1>

            <p className="hero-reveal hero-reveal-3 hero-subtitle" style={{ 
              marginBottom: '4vh',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.6,
              fontWeight: 400,
              fontFamily: 'var(--font-pjs)',
            }}>
              We build systems that bring you jobs — daily.
            </p>

            <div className="hero-reveal hero-reveal-4 mobile-center" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
              <div className="mobile-stack" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'inherit' }}>
                <button
                  className="btn-hero-primary"
                  data-cal-link="kootenay-signal/30min"
                  data-cal-namespace="30min"
                  data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
                >
                  GET MY PIPELINE BUILT
                  <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                </button>
                <Link
                  href="/signal-check"
                  className="btn-hero-secondary"
                  style={{ textDecoration: 'none' }}
                >
                  FREE SIGNAL CHECK
                </Link>
              </div>

              {/* Trust breaker */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.65rem',
                opacity: 0.45
              }}>
                <div style={{ width: '28px', height: '1px', background: 'rgba(255,255,255,0.3)' }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'var(--font-pjs)', color: 'rgba(255,255,255,0.6)' }}>
                  Built by a contractor. Not an agency.
                </span>
                <div style={{ width: '28px', height: '1px', background: 'rgba(255,255,255,0.3)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Towns strip */}
        <div className="towns-strip mobile-towns-hide" style={{ 
          position: 'absolute', bottom: 0, left: 0, width: '100%', zIndex: 10,
          pointerEvents: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '0.85rem 0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', width: '100%', padding: '0 clamp(1.25rem, 4vw, 4rem)', flexWrap: 'wrap' }}>
            {['Fernie', 'Sparwood', 'Elkford', 'Cranbrook', 'Nelson', 'Castlegar', 'Trail', 'Kimberley'].map((town, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ whiteSpace: 'nowrap', fontSize: 'clamp(0.5rem, 1.5vw, 0.7rem)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-sans)' }}>{town}</span>
                {i < 7 && <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: '0.5rem' }}>·</span>}
              </span>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          SECTION 2 — THE PROBLEM (Emotional hook)
          ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(6rem, 12vw, 11rem) 0', background: '#000', position: 'relative', overflow: 'hidden' }}>
        {/* Industrial texture */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.015, pointerEvents: 'none',
          backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 60px),
            repeating-linear-gradient(90deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 60px)`,
        }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-5%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(230,126,34,0.04) 0%, transparent 60%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div ref={s2.ref} className="container" style={{ maxWidth: '880px', position: 'relative', zIndex: 1 }}>
          {/* Heading */}
          <div style={{
            opacity: s2.visible ? 1 : 0,
            transform: s2.visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            marginBottom: '4rem'
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '30px', height: '1px', background: 'var(--primary)', opacity: 0.5 }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--primary)' }}>The Real Problem</span>
              <div style={{ width: '30px', height: '1px', background: 'var(--primary)', opacity: 0.5 }} />
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)', lineHeight: 1.05, color: '#fff', fontFamily: 'var(--font-syne)', fontWeight: 800, textAlign: 'center' }}>
              Sound familiar?
            </h2>
          </div>

          {/* Pain cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '4rem' }}>
            {[
              'Nobody can find you online',
              'Your phone barely rings',
              "You're booked by luck, not by design",
              "You're busy… but not profitable",
            ].map((pain, i) => (
              <div key={i} className="pain-card" style={{
                opacity: s2.visible ? 1 : 0,
                transform: s2.visible ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + i * 0.1}s`,
              }}>
                <div className="pain-card-inner">
                  <div className="pain-accent" />
                  <span className="pain-arrow">→</span>
                  <span className="pain-text">{pain}</span>
                </div>
              </div>
            ))}
          </div>

          {/* The slam */}
          <div style={{
            opacity: s2.visible ? 1 : 0,
            transform: s2.visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.5s',
            textAlign: 'center',
            padding: 'clamp(2rem, 4vw, 3rem)',
            background: 'rgba(230,126,34,0.04)',
            border: '1px solid rgba(230,126,34,0.15)',
            borderRadius: '12px',
          }}>
            <p style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-pjs)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              That&apos;s not a work problem.
            </p>
            <p style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)', color: '#fff', fontFamily: 'var(--font-syne)', fontWeight: 800, lineHeight: 1.2 }}>
              That&apos;s a <span className="text-gradient-hero">system problem.</span>
            </p>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          SECTION 3 — WHAT I ACTUALLY BUILD (System Diagram)
          ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(6rem, 12vw, 11rem) 0', background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: '70vw', height: '40vw', background: 'radial-gradient(ellipse, rgba(230,126,34,0.05) 0%, transparent 60%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div ref={s3.ref} className="container" style={{ maxWidth: '1060px', position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div style={{
            textAlign: 'center', marginBottom: 'clamp(3.5rem, 6vw, 5.5rem)',
            opacity: s3.visible ? 1 : 0,
            transform: s3.visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '30px', height: '1px', background: 'var(--primary)', opacity: 0.5 }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--primary)' }}>Your Business System</span>
              <div style={{ width: '30px', height: '1px', background: 'var(--primary)', opacity: 0.5 }} />
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)', lineHeight: 1.05, color: '#fff', fontFamily: 'var(--font-syne)', fontWeight: 800, marginBottom: '1.25rem' }}>
              Here&apos;s what I build.
            </h2>
            <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-pjs)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
              Not marketing. A complete pipeline — every piece connected.
            </p>
          </div>

          {/* Pipeline flow diagram */}
          <div style={{
            opacity: s3.visible ? 1 : 0,
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            marginBottom: 'clamp(3rem, 5vw, 4.5rem)'
          }}>
            <div className="pipeline-flow">
              {[
                { label: 'TRAFFIC', icon: <Search size={22} strokeWidth={1.5} /> },
                { label: 'CAPTURE', icon: <MousePointerClick size={22} strokeWidth={1.5} /> },
                { label: 'CLOSE', icon: <Phone size={22} strokeWidth={1.5} /> },
                { label: 'RETAIN', icon: <RefreshCw size={22} strokeWidth={1.5} /> },
              ].map((stage, i) => (
                <div key={i} className="pipeline-stage-wrap">
                  <div className="pipeline-stage">
                    <div className="pipeline-icon">{stage.icon}</div>
                    <span className="pipeline-label">{stage.label}</span>
                  </div>
                  {i < 3 && <div className="pipeline-arrow"><ArrowRight size={18} strokeWidth={2} /></div>}
                </div>
              ))}
            </div>
          </div>

          {/* 6-component breakdown */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
          }}
          className="pipeline-grid-3"
          >
            {[
              { icon: <MapPin size={20} strokeWidth={1.5} />, title: 'Google (SEO + Maps)', desc: 'Show up when they search. Dominate your local area.' },
              { icon: <Megaphone size={20} strokeWidth={1.5} />, title: 'Ads', desc: 'Instant leads while you sleep. Pay for results, not guesses.' },
              { icon: <Globe size={20} strokeWidth={1.5} />, title: 'Website', desc: 'Not a brochure. A conversion machine that turns clicks into calls.' },
              { icon: <CalendarCheck size={20} strokeWidth={1.5} />, title: 'Booking System', desc: 'Auto-scheduling. No phone tag. Jobs land on your calendar.' },
              { icon: <MessageSquare size={20} strokeWidth={1.5} />, title: 'CRM', desc: 'Follow-ups handled. No missed leads. No jobs lost to silence.' },
              { icon: <BarChart3 size={20} strokeWidth={1.5} />, title: 'Content', desc: 'Trust built over time. You become the obvious choice.' },
            ].map((item, i) => (
              <div key={i} className="system-component-card" style={{
                opacity: s3.visible ? 1 : 0,
                transform: s3.visible ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + i * 0.08}s`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
                  <div style={{ color: 'var(--primary)', display: 'flex', flexShrink: 0 }}>{item.icon}</div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-syne)', margin: 0 }}>{item.title}</h4>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-pjs)', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Tagline */}
          <div style={{
            textAlign: 'center', marginTop: 'clamp(2.5rem, 4vw, 3.5rem)',
            opacity: s3.visible ? 0.65 : 0,
            transition: 'opacity 0.8s ease 0.8s'
          }}>
            <div style={{ width: '40px', height: '2px', background: 'var(--primary)', margin: '0 auto 1.25rem' }} />
            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-pjs)', fontStyle: 'italic' }}>
              Every piece works together. No gaps. No missed jobs.
            </p>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          SECTION 4 — BEFORE / AFTER
          ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(6rem, 12vw, 11rem) 0', background: '#000', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(230,126,34,0.3), transparent)' }} />

        <div ref={s4.ref} className="container" style={{ maxWidth: '960px', position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div style={{
            textAlign: 'center', marginBottom: 'clamp(3rem, 5vw, 4.5rem)',
            opacity: s4.visible ? 1 : 0,
            transform: s4.visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '30px', height: '1px', background: 'var(--primary)', opacity: 0.5 }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--primary)' }}>The Difference</span>
              <div style={{ width: '30px', height: '1px', background: 'var(--primary)', opacity: 0.5 }} />
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)', lineHeight: 1.05, color: '#fff', fontFamily: 'var(--font-syne)', fontWeight: 800 }}>
              Before vs. After
            </h2>
          </div>

          {/* Split screen */}
          <div className="before-after-grid" style={{
            opacity: s4.visible ? 1 : 0,
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s',
          }}>
            {/* BEFORE */}
            <div className="before-card">
              <div className="ba-header ba-header--before">
                <X size={16} strokeWidth={3} />
                <span>WITHOUT A SYSTEM</span>
              </div>
              {['Missed calls', 'Random jobs', 'No system', 'Guessing every month', 'Chasing customers'].map((item, i) => (
                <div key={i} className="ba-item ba-item--before">
                  <X size={14} strokeWidth={2.5} style={{ flexShrink: 0, color: '#555' }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* VS divider */}
            <div className="ba-vs">
              <div className="ba-vs-line" />
              <span className="ba-vs-text">VS</span>
              <div className="ba-vs-line" />
            </div>

            {/* AFTER */}
            <div className="after-card">
              <div className="ba-header ba-header--after">
                <Check size={16} strokeWidth={3} />
                <span>WITH THE PIPELINE</span>
              </div>
              {['Daily leads rolling in', 'Booked calendar', 'Automated follow-ups', 'Predictable income', 'You select the jobs'].map((item, i) => (
                <div key={i} className="ba-item ba-item--after">
                  <Check size={14} strokeWidth={2.5} style={{ flexShrink: 0, color: 'var(--primary)' }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Punchline */}
          <div style={{
            textAlign: 'center', marginTop: 'clamp(3rem, 5vw, 4rem)',
            opacity: s4.visible ? 1 : 0,
            transition: 'opacity 0.8s ease 0.5s'
          }}>
            <p style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.75rem)', color: '#fff', fontFamily: 'var(--font-syne)', fontWeight: 800, lineHeight: 1.2 }}>
              Stop chasing work.<br />
              <span className="text-gradient-hero">Start selecting jobs.</span>
            </p>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          SECTION 5 — HOW IT WORKS (Like a Contract)
          ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(6rem, 12vw, 11rem) 0', background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
        {/* Grid texture */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.018, pointerEvents: 'none',
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />

        <div ref={s5.ref} className="container" style={{ maxWidth: '820px', position: 'relative', zIndex: 1 }}>
          <div style={{
            textAlign: 'center', marginBottom: 'clamp(3rem, 5vw, 5rem)',
            opacity: s5.visible ? 1 : 0,
            transform: s5.visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '30px', height: '1px', background: 'var(--primary)', opacity: 0.5 }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--primary)' }}>The Contract</span>
              <div style={{ width: '30px', height: '1px', background: 'var(--primary)', opacity: 0.5 }} />
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)', lineHeight: 1.05, color: '#fff', fontFamily: 'var(--font-syne)', fontWeight: 800, marginBottom: '1rem' }}>
              How it works.
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-pjs)' }}>
              Like hiring a crew. Four phases. No smoke and mirrors.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
            <div className="mobile-hide" style={{
              position: 'absolute', left: '40px', top: '3rem', bottom: '3rem',
              width: '1px', background: 'linear-gradient(to bottom, var(--primary), rgba(230,126,34,0.05))',
              opacity: 0.25
            }} />

            {[
              {
                num: '01', title: 'Audit — I tear it apart.',
                desc: 'I pull apart your current setup and find every leak — where leads are slipping away, where you\'re invisible, where you\'re losing jobs to a competitor who shows up first.'
              },
              {
                num: '02', title: 'Build — Website, SEO, ads, backend.',
                desc: 'I build the whole system from the ground up. Every piece engineered to bring calls — your website, your Google presence, your ad campaigns, your follow-up machine.'
              },
              {
                num: '03', title: 'Launch — Turn everything on.',
                desc: 'We flip the switch. Leads start moving through the pipeline. Your phone starts ringing from real people with real jobs to give you.'
              },
              {
                num: '04', title: 'Scale — More jobs. Better jobs. Higher ticket.',
                desc: 'Once the system is producing, we optimize. You stop taking every job and start picking the ones worth taking. That\'s control.'
              },
            ].map((step, i) => (
              <div key={i} className="step-row" style={{
                opacity: s5.visible ? 1 : 0,
                transform: s5.visible ? 'translateX(0)' : 'translateX(-30px)',
                transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.15}s`,
              }}>
                <div className="step-number"><span>{step.num}</span><div className="step-dot" /></div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          SECTION 6 — PROOF (Testimonial)
          ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(6rem, 12vw, 11rem) 0', background: '#000', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(230,126,34,0.05) 0%, transparent 60%)', filter: 'blur(100px)', pointerEvents: 'none' }} />

        <div ref={s6.ref} className="container" style={{ maxWidth: '900px', position: 'relative', zIndex: 1 }}>
          <div style={{
            textAlign: 'center', marginBottom: 'clamp(2.5rem, 5vw, 4rem)',
            opacity: s6.visible ? 1 : 0,
            transform: s6.visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '30px', height: '1px', background: 'var(--primary)', opacity: 0.5 }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--primary)' }}>Don&apos;t Take Our Word For It</span>
              <div style={{ width: '30px', height: '1px', background: 'var(--primary)', opacity: 0.5 }} />
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)', lineHeight: 1.05, color: '#fff', fontFamily: 'var(--font-syne)', fontWeight: 800, marginBottom: '0.75rem' }}>
              Real businesses.<br /><span className="text-gradient">Real results.</span>
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-pjs)' }}>
              You can&apos;t pay for something this good.
            </p>
          </div>

          {/* Video */}
          <div style={{
            opacity: s6.visible ? 1 : 0,
            transform: s6.visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.97)',
            transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            position: 'relative', borderRadius: '12px', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
            aspectRatio: '16/9', maxWidth: '800px', margin: '0 auto'
          }}>
            <video controls playsInline preload="metadata"
              poster="https://res.cloudinary.com/doajstql7/image/upload/v1776300647/ChatGPT_Image_Apr_15_2026_08_50_40_PM_zkfg8l.png"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            >
              <source src="https://res.cloudinary.com/doajstql7/video/upload/v1776298495/Check_Out_Our_1_Testimonial___You_Cannot_Pay_For_Something_This_Good_dl8cdw.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          SECTION 7 — THE OFFER
          ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(6rem, 12vw, 11rem) 0', background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(230,126,34,0.3), transparent)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(230,126,34,0.15), transparent)' }} />

        <div ref={s7.ref} className="container" style={{ maxWidth: '760px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            opacity: s7.visible ? 1 : 0,
            transform: s7.visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '30px', height: '1px', background: 'var(--primary)', opacity: 0.5 }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--primary)' }}>The Offer</span>
              <div style={{ width: '30px', height: '1px', background: 'var(--primary)', opacity: 0.5 }} />
            </div>

            <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-pjs)', lineHeight: 1.7, marginBottom: '2rem' }}>
              I don&apos;t sell marketing.<br />I don&apos;t sell ads.<br />I don&apos;t sell websites.
            </p>

            <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', lineHeight: 1.05, color: '#fff', fontFamily: 'var(--font-syne)', fontWeight: 800, marginBottom: '3rem' }}>
              I build you a <span className="text-gradient-hero">pipeline.</span>
            </h2>

            {/* The offer card */}
            <div style={{
              padding: 'clamp(2rem, 4vw, 3.5rem)',
              background: 'rgba(230,126,34,0.04)',
              border: '1px solid rgba(230,126,34,0.2)',
              borderRadius: '16px',
              marginBottom: '2.5rem',
              textAlign: 'left',
              boxShadow: '0 0 80px rgba(230,126,34,0.06)'
            }}>
              {[
                { icon: <Search size={18} />, line: 'You show up on Google when they search for your trade' },
                { icon: <Megaphone size={18} />, line: 'Ads bring you warm leads — people ready to hire' },
                { icon: <Globe size={18} />, line: 'Your website turns visits into calls' },
                { icon: <CalendarCheck size={18} />, line: 'Jobs book automatically — no back-and-forth' },
                { icon: <MessageSquare size={18} />, line: 'Every lead gets followed up — nothing falls through' },
                { icon: <BarChart3 size={18} />, line: 'You see everything working in real time' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '1rem',
                  padding: '0.9rem 0',
                  borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.04)' : 'none'
                }}>
                  <div style={{ color: 'var(--primary)', display: 'flex', flexShrink: 0, marginTop: '2px' }}>{item.icon}</div>
                  <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-pjs)', lineHeight: 1.5 }}>{item.line}</span>
                </div>
              ))}
            </div>

            <button
              className="btn-cta-final"
              data-cal-link="kootenay-signal/30min"
              data-cal-namespace="30min"
              data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
              style={{ marginBottom: '1.5rem' }}
            >
              <span>LET&apos;S BUILD YOURS</span>
              <ArrowRight size={20} />
            </button>

            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-pjs)', fontWeight: 600, letterSpacing: '0.05em' }}>
              I only take a handful of clients per region. Spots are limited.
            </p>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          SECTION 8 — ABOUT (Meet Jaryd)
          ═══════════════════════════════════════════════════════════ */}
      <section id="about" style={{ padding: 'clamp(6rem, 14vw, 14rem) 0', background: '#000', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: '60vw', height: '40vw', background: 'radial-gradient(circle, rgba(230,126,34,0.04) 0%, transparent 70%)', filter: 'blur(100px)', pointerEvents: 'none' }} />

        <div ref={s8.ref} className="container" style={{ maxWidth: '1100px', position: 'relative', zIndex: 1 }}>
          <div style={{
            opacity: s8.visible ? 1 : 0,
            transform: s8.visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(3rem, 6vw, 5rem)',
            alignItems: 'center',
            marginBottom: 'clamp(4rem, 8vw, 7rem)'
          }}
          className="founder-grid"
          >
            <div style={{ position: 'relative', aspectRatio: '4/5', borderRadius: '6px', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Image
                src="https://res.cloudinary.com/doajstql7/image/upload/v1776285464/ChatGPT_Image_Apr_12_2026_11_04_25_PM_xi7ewb.png"
                alt="Jaryd Paquette — Founder of Kootenay Signal"
                fill style={{ objectFit: 'cover' }} priority
              />
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.3em', color: 'var(--primary)', textTransform: 'uppercase', display: 'block', marginBottom: '1.25rem' }}>The Founder</span>
              <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.05, color: '#fff', fontFamily: 'var(--font-syne)', fontWeight: 800, marginBottom: '1.75rem' }}>
                I&apos;m Jaryd.
              </h2>
              <p style={{ fontSize: 'clamp(1.05rem, 1.5vw, 1.2rem)', lineHeight: 1.85, color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-pjs)', marginBottom: '1.5rem' }}>
                I work construction during the day and build business growth systems at night. I know what it means to put in a shift — I don&apos;t sell dreams, I build <span style={{ color: '#fff', fontWeight: 600 }}>real infrastructure</span> for your business.
              </p>
              <p style={{ fontSize: 'clamp(1.05rem, 1.5vw, 1.2rem)', lineHeight: 1.85, color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-pjs)' }}>
                I live in the Kootenays. I only work with a handful of businesses at a time. No fluff. No runaround. Just honest work that gets you <span style={{ color: '#fff', fontWeight: 600 }}>more customers</span>.
              </p>
            </div>
          </div>

          <div style={{
            opacity: s8.visible ? 1 : 0,
            transform: s8.visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'clamp(2rem, 4vw, 3.5rem)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: 'clamp(3rem, 6vw, 4.5rem)'
          }}
          className="founder-pillars"
          >
            {[
              { title: 'Built by a Tradesman', body: "I understand the hustle. Early mornings, long days, earning every dollar. I bring that same work ethic to your online presence." },
              { title: 'Local. Not Corporate.', body: "You're not a ticket number. I get to know your business, your town, and your competition — then I build something that actually works here." },
              { title: 'Straight Talk Only', body: "If I can help you, I'll show you exactly how. If I can't, I'll tell you up front. Either way, you'll know where you stand." },
            ].map((p, i) => (
              <div key={i}>
                <h3 style={{ fontSize: 'clamp(1.1rem, 1.5vw, 1.3rem)', color: '#fff', fontWeight: 800, fontFamily: 'var(--font-syne)', marginBottom: '1rem', lineHeight: 1.3 }}>{p.title}</h3>
                <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-pjs)' }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          SECTION 9 — HARD CLOSE
          ═══════════════════════════════════════════════════════════ */}
      <section id="contact" style={{ padding: 'clamp(7rem, 14vw, 14rem) 0', background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80vw', height: '80vw', background: 'radial-gradient(circle, rgba(230,126,34,0.07) 0%, transparent 50%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div ref={s9.ref} className="container" style={{ textAlign: 'center', maxWidth: '820px', position: 'relative', zIndex: 1 }}>
          <div style={{
            opacity: s9.visible ? 1 : 0,
            transform: s9.visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.97)',
            transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.25rem)', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-pjs)', lineHeight: 1.7, marginBottom: '2rem' }}>
              If your phone isn&apos;t ringing…
              you don&apos;t have a lead problem.
            </p>

            <h2 className="hard-close-h2" style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)', lineHeight: 1, color: '#fff', fontFamily: 'var(--font-syne)', fontWeight: 800, marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '-0.03em', whiteSpace: 'nowrap' }}>
              You have a <span className="text-gradient-hero">visibility problem.</span>
            </h2>

            <p style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', color: '#fff', fontFamily: 'var(--font-syne)', fontWeight: 700, marginBottom: '3rem' }}>
              I fix that.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
              <button
                className="btn-cta-final"
                data-cal-link="kootenay-signal/30min"
                data-cal-namespace="30min"
                data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
              >
                <span>GET MY PIPELINE</span>
                <ArrowRight size={20} />
              </button>

              <Link
                href="/signal-check"
                style={{
                  textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', fontWeight: 700,
                  fontFamily: 'var(--font-pjs)', textTransform: 'uppercase', letterSpacing: '0.1em',
                  transition: 'color 0.3s ease'
                }}
              >
                or run the free signal check first
                <ArrowRight size={14} />
              </Link>
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

