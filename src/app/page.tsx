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
  Shield
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

  useEffect(() => {
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
  }, []);

  const s2 = useReveal();
  const s3 = useReveal();
  const s4 = useReveal();
  const s5 = useReveal();
  const s6 = useReveal();
  const s7 = useReveal();

  return (
    <main style={{ position: 'relative', overflow: 'hidden' }}>

      {/* ═══════════════════════════════════════════════════════════
          HERO — CINEMATIC FULL-SCREEN
          ═══════════════════════════════════════════════════════════ */}
      <section className="hero" style={{
        backgroundImage: `linear-gradient(180deg, rgba(13,17,9,0.2) 0%, rgba(13,17,9,0.6) 50%, rgba(13,17,9,1) 100%), url('https://res.cloudinary.com/doajstql7/image/upload/v1775879081/Elk_Valley_sunset_workshop_scene_gvwak0.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        position: 'relative',
      }}>
        {/* Atmospheric grain overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat', zIndex: 1
        }} />

        {/* Radial glow behind text */}
        <div style={{
          position: 'absolute', top: '30%', left: '20%', width: '60vw', height: '60vw',
          background: 'radial-gradient(circle, rgba(230,126,34,0.06) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 1, filter: 'blur(60px)'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-content mobile-center">
            {/* Micro-label */}
            <div className="hero-reveal hero-reveal-1" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
              marginBottom: '2rem', opacity: 0.6
            }}>
              <div style={{ width: '40px', height: '1px', background: 'var(--primary)' }} />
              <span style={{
                fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase',
                letterSpacing: '0.3em', color: 'var(--primary)'
              }}>Sparwood, BC</span>
            </div>

            <h1 className="hero-reveal hero-reveal-2 mobile-center" style={{ 
              lineHeight: 0.95,
              maxWidth: '900px',
              color: '#fff',
            }}>
              I Help Kootenay<br className="mobile-hide"/>
              Businesses <span className="text-gradient-hero">Get<br className="mobile-hide"/> More Business.</span>
            </h1>

            <p className="hero-reveal hero-reveal-3 mobile-font-lg" style={{ 
              fontSize: '1.35rem', 
              maxWidth: '480px', 
              marginBottom: '4vh',
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.6,
              fontWeight: 400,
              fontFamily: 'var(--font-pjs)'
            }}>
              More calls. More jobs. Less guesswork.
            </p>

            <div className="hero-reveal hero-reveal-4 mobile-center" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
              <div className="mobile-stack" style={{ 
                display: 'flex', 
                gap: '1rem', 
                flexWrap: 'wrap',
                justifyContent: 'inherit'
              }}>
<<<<<<< HEAD
                <a 
                  href="#how-it-works"
                  className="btn-hero-primary" 
=======
                <Link 
                  href="/signal-check"
                  className="btn btn-primary" 
>>>>>>> 8648445 (feat: implement free signal check feature with new API and UI updates)
                  id="btn-cta-hero"
                >
<<<<<<< HEAD
                  SEE HOW THIS WORKS
                  <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                </a>
                <button 
                  className="btn-hero-secondary"
                  data-cal-link="kootenay-signal/30min"
                  data-cal-namespace="30min"
                  data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
                >
                  LET&apos;S TALK
                </button>
=======
                  FREE SIGNAL CHECK
                </Link>
                <Link href="#locals" className="btn btn-secondary mobile-hide" style={{ padding: '1.25rem 2.5rem' }}>
                  SEE LOCAL RESULTS »
                </Link>
              </div>
              
              <div style={{ marginTop: '2vh' }}>
                <div className="badge animate-subtle-glow mobile-font-sm" style={{ 
                  background: 'rgba(230, 126, 34, 0.1)', 
                  borderColor: 'rgba(230, 126, 34, 0.3)', 
                  color: 'rgba(230, 126, 34, 0.9)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.6rem 1.2rem',
                  fontWeight: 900,
                  borderRadius: '3px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  lineHeight: 1
                }}>
                  <AlertTriangle size={18} className="mobile-hide" />
                  SCARCITY: We only work with 3–5 per trade, per area.
                </div>
>>>>>>> 8648445 (feat: implement free signal check feature with new API and UI updates)
              </div>
            </div>
          </div>
        </div>

        {/* ─── Towns Service Strip — anchored at hero bottom ─── */}
        <div style={{ 
          position: 'absolute', bottom: 0, left: 0, width: '100%',
          zIndex: 10, pointerEvents: 'none',
          background: 'rgba(13,17,9,0.6)',
          backdropFilter: 'blur(8px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '1.25rem 4vw'
        }}>
          <div style={{ 
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            gap: 'clamp(1rem, 2.5vw, 2.5rem)',
            width: '100%', flexWrap: 'wrap',
            fontSize: 'clamp(0.55rem, 0.75vw, 0.7rem)', fontWeight: 800, 
            textTransform: 'uppercase', letterSpacing: '0.35em',
            color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-pjs)'
          }}>
            {['Fernie', 'Sparwood', 'Elkford', 'Cranbrook', 'Nelson', 'Castlegar', 'Trail', 'Kimberley'].map((town, i) => (
              <span key={i} className={i >= 6 ? '' : ''} style={{ whiteSpace: 'nowrap' }}>
                {town}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Vertical line separator */}
      <div style={{ height: '100px', width: '1px', background: 'linear-gradient(to bottom, var(--primary), transparent)', margin: '0 auto', opacity: 0.2 }} />



      {/* ═══════════════════════════════════════════════════════════
          SECTION 2: RELATABILITY — "Yeah… that's me"
          ═══════════════════════════════════════════════════════════ */}
      <section style={{ 
        padding: 'clamp(5rem, 10vw, 10rem) 0', 
        background: '#070a05', 
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle side glow */}
        <div style={{
          position: 'absolute', top: '-20%', right: '-10%', width: '50vw', height: '50vw',
          background: 'radial-gradient(circle, rgba(230,126,34,0.04) 0%, transparent 60%)',
          pointerEvents: 'none', filter: 'blur(80px)'
        }} />

        <div ref={s2.ref} className="container" style={{ maxWidth: '900px', position: 'relative', zIndex: 1 }}>
          <div style={{
            opacity: s2.visible ? 1 : 0,
            transform: s2.visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <h2 style={{ 
              fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
              lineHeight: 1.1, 
              marginBottom: '4rem',
              textAlign: 'center',
              color: '#fff',
              fontFamily: 'var(--font-syne)',
              fontWeight: 800
            }}>
              If you&apos;re good at what you do… <br className="mobile-hide"/>
              <span className="text-gradient">you should be busier.</span>
            </h2>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '1rem',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {[
              "Not getting enough calls",
              "People can't find you online",
              "You rely on word of mouth alone",
              "Losing leads you never see"
            ].map((pain, i) => (
              <div key={i} className="pain-card" style={{
                opacity: s2.visible ? 1 : 0,
                transform: s2.visible ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.15 + i * 0.1}s`,
              }}>
                <div className="pain-card-inner">
                  <div className="pain-accent" />
                  <span className="pain-arrow">→</span>
                  <span className="pain-text">{pain}</span>
                </div>
              </div>
            ))}
          </div>

          <p style={{ 
            textAlign: 'center', 
            marginTop: '3.5rem', 
            fontSize: '1.15rem', 
            opacity: s2.visible ? 0.45 : 0,
            fontStyle: 'italic',
            transition: 'opacity 1s ease 0.6s',
            fontFamily: 'var(--font-pjs)'
          }}>
            Sound familiar? You&apos;re not alone — and it&apos;s fixable.
          </p>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          SECTION 3: WHAT I ACTUALLY DO — Premium Cards
          ═══════════════════════════════════════════════════════════ */}
      <section id="how-it-works" style={{ 
        padding: 'clamp(5rem, 10vw, 10rem) 0', 
        background: 'var(--background)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background accent line */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '1px', height: '120px',
          background: 'linear-gradient(to bottom, var(--primary), transparent)',
          opacity: 0.3
        }} />

        <div ref={s3.ref} className="container" style={{ maxWidth: '1000px', position: 'relative', zIndex: 1 }}>
          <div style={{
            textAlign: 'center', marginBottom: 'clamp(3rem, 6vw, 5rem)',
            opacity: s3.visible ? 1 : 0,
            transform: s3.visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ width: '30px', height: '1px', background: 'var(--primary)', opacity: 0.5 }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--primary)' }}>What I Do</span>
              <div style={{ width: '30px', height: '1px', background: 'var(--primary)', opacity: 0.5 }} />
            </div>

            <h2 style={{ 
              fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
              lineHeight: 1.05,
              color: '#fff',
              fontFamily: 'var(--font-syne)',
              fontWeight: 800,
              marginBottom: '1.25rem'
            }}>
              Here&apos;s what I do.
            </h2>
            <p style={{ 
              fontSize: '1.25rem', 
              color: 'rgba(255,255,255,0.5)',
              maxWidth: '500px',
              margin: '0 auto',
              lineHeight: 1.6,
              fontFamily: 'var(--font-pjs)'
            }}>
              I help local businesses get more customers — <b style={{ color: 'rgba(255,255,255,0.85)' }}>consistently.</b>
            </p>
          </div>

          <div className="mobile-grid-1" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '1.5rem'
          }}>
            {[
              { 
                icon: <Search size={28} strokeWidth={1.5} />, 
                title: "Get Found", 
                desc: "I make you easier to find when people search for what you do.",
                gradient: 'linear-gradient(135deg, rgba(230,126,34,0.08) 0%, rgba(230,126,34,0) 100%)'
              },
              { 
                icon: <Users size={28} strokeWidth={1.5} />, 
                title: "Get Chosen", 
                desc: "I make people pick you over the competition — every time.",
                gradient: 'linear-gradient(135deg, rgba(39,174,96,0.08) 0%, rgba(39,174,96,0) 100%)'
              },
              { 
                icon: <Shield size={28} strokeWidth={1.5} />, 
                title: "Never Miss Out", 
                desc: "I make sure leads don't fall through the cracks.",
                gradient: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 100%)'
              }
            ].map((item, i) => (
              <div key={i} className="service-card" style={{
                opacity: s3.visible ? 1 : 0,
                transform: s3.visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
                transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.15 + i * 0.12}s`,
              }}>
                <div style={{
                  position: 'absolute', inset: 0, background: item.gradient,
                  borderRadius: '12px', opacity: 0, transition: 'opacity 0.5s',
                  pointerEvents: 'none'
                }} className="card-gradient-bg" />

                <div style={{ 
                  width: '56px', height: '56px', borderRadius: '12px',
                  background: 'rgba(230,126,34,0.08)',
                  border: '1px solid rgba(230,126,34,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--primary)', marginBottom: '1.75rem',
                  transition: 'all 0.4s ease'
                }} className="icon-box">
                  {item.icon}
                </div>

                <h3 style={{ 
                  fontSize: '1.5rem', marginBottom: '0.75rem', color: '#fff',
                  fontFamily: 'var(--font-syne)', fontWeight: 800
                }}>{item.title}</h3>
                <p style={{ 
                  opacity: 0.5, fontSize: '1rem', lineHeight: 1.65,
                  fontFamily: 'var(--font-pjs)'
                }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          SECTION 4: HOW — Cinematic numbered steps
          ═══════════════════════════════════════════════════════════ */}
      <section style={{ 
        padding: 'clamp(5rem, 10vw, 10rem) 0', 
        background: '#070a05',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.02, pointerEvents: 'none',
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />

        <div ref={s4.ref} className="container" style={{ maxWidth: '900px', position: 'relative', zIndex: 1 }}>
          <div style={{
            textAlign: 'center', marginBottom: 'clamp(3rem, 6vw, 5rem)',
            opacity: s4.visible ? 1 : 0,
            transform: s4.visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ width: '30px', height: '1px', background: 'var(--primary)', opacity: 0.5 }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--primary)' }}>The Process</span>
              <div style={{ width: '30px', height: '1px', background: 'var(--primary)', opacity: 0.5 }} />
            </div>

            <h2 style={{ 
              fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.05,
              color: '#fff', fontFamily: 'var(--font-syne)', fontWeight: 800,
              marginBottom: '1rem'
            }}>
              How I make that happen.
            </h2>
            <p style={{ 
              fontSize: '1.15rem', opacity: 0.4, maxWidth: '500px', margin: '0 auto',
              fontFamily: 'var(--font-pjs)'
            }}>
              No smoke and mirrors. Just real work that gets real results.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative' }}>
            {/* Connecting line */}
            <div className="mobile-hide" style={{
              position: 'absolute', left: '40px', top: '3rem', bottom: '3rem',
              width: '1px', background: 'linear-gradient(to bottom, var(--primary), rgba(230,126,34,0.1))',
              opacity: 0.2
            }} />

            {[
              { 
                num: "01", 
                title: "Fix what's costing you customers",
                desc: "I look at your online presence, your reviews, your website — and find the holes where people are slipping away."
              },
              { 
                num: "02", 
                title: "Set up systems that bring people in",
                desc: "I put you where customers are already looking. When someone needs what you do, they find you first."
              },
              { 
                num: "03", 
                title: "Make sure leads don't fall through",
                desc: "Missed call? Forgot to follow up? I build simple systems so you never lose a job to bad timing again."
              }
            ].map((step, i) => (
              <div key={i} className="step-row" style={{
                opacity: s4.visible ? 1 : 0,
                transform: s4.visible ? 'translateX(0)' : 'translateX(-30px)',
                transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.15}s`,
              }}>
                <div className="step-number">
                  <span>{step.num}</span>
                  <div className="step-dot" />
                </div>
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
          SECTION 5: OUTCOMES — Bold stats + emotional proof
          ═══════════════════════════════════════════════════════════ */}
      <section style={{ 
        padding: 'clamp(5rem, 10vw, 10rem) 0', 
        background: 'var(--background)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Dramatic accent */}
        <div style={{
          position: 'absolute', bottom: '-30%', left: '50%', transform: 'translateX(-50%)',
          width: '80vw', height: '80vw',
          background: 'radial-gradient(circle, rgba(230,126,34,0.04) 0%, transparent 50%)',
          pointerEvents: 'none', filter: 'blur(100px)'
        }} />

        <div ref={s5.ref} className="container" style={{ maxWidth: '1100px', position: 'relative', zIndex: 1 }}>
          <div style={{
            textAlign: 'center', marginBottom: 'clamp(3rem, 6vw, 5rem)',
            opacity: s5.visible ? 1 : 0,
            transform: s5.visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ width: '30px', height: '1px', background: 'var(--primary)', opacity: 0.5 }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--primary)' }}>Real Results</span>
              <div style={{ width: '30px', height: '1px', background: 'var(--primary)', opacity: 0.5 }} />
            </div>

            <h2 style={{ 
              fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.05,
              color: '#fff', fontFamily: 'var(--font-syne)', fontWeight: 800,
              marginBottom: '1rem'
            }}>
              What this looks like <span className="text-gradient">in real life.</span>
            </h2>
            <p style={{ 
              fontSize: '1.15rem', opacity: 0.4, fontFamily: 'var(--font-pjs)'
            }}>
              Here&apos;s what changes when your business actually gets found.
            </p>
          </div>

          <div className="mobile-grid-1" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '1.5rem'
          }}>
            {[
              { 
                icon: <PhoneIncoming size={32} strokeWidth={1.5} />, 
                stat: "More Calls", 
                desc: "Your phone starts ringing from people who actually need your services.",
                accent: 'var(--primary)'
              },
              { 
                icon: <CalendarCheck size={32} strokeWidth={1.5} />, 
                stat: "Booked Out Weeks", 
                desc: "No more wondering where next month's work comes from.",
                accent: 'var(--accent)'
              },
              { 
                icon: <TrendingUp size={32} strokeWidth={1.5} />, 
                stat: "Less Chasing", 
                desc: "Customers come to you — not the other way around.",
                accent: '#fff'
              }
            ].map((outcome, i) => (
              <div key={i} className="outcome-card" style={{
                opacity: s5.visible ? 1 : 0,
                transform: s5.visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.96)',
                transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.15 + i * 0.12}s`,
              }}>
                {/* Top accent line */}
                <div style={{
                  position: 'absolute', top: 0, left: '2rem', right: '2rem',
                  height: '2px', background: `linear-gradient(90deg, transparent, ${outcome.accent}, transparent)`,
                  opacity: 0.3
                }} />

                <div style={{ 
                  color: outcome.accent, marginBottom: '2rem',
                  display: 'flex', justifyContent: 'center', opacity: 0.8
                }}>
                  {outcome.icon}
                </div>
                <h3 style={{ 
                  fontSize: '1.6rem', marginBottom: '1rem', textAlign: 'center',
                  color: outcome.accent, fontWeight: 800, fontFamily: 'var(--font-syne)'
                }}>{outcome.stat}</h3>
                <p style={{ 
                  opacity: 0.5, fontSize: '1rem', lineHeight: 1.65, textAlign: 'center',
                  fontFamily: 'var(--font-pjs)'
                }}>{outcome.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          SECTION 6: JARYD — Cinematic Central Focus
          ═══════════════════════════════════════════════════════════ */}
      <section id="about" style={{ 
        padding: 'clamp(5rem, 12vw, 12rem) 0', 
        background: '#070a05',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Deep atmospheric glow centering the section */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '70vw', height: '50vw',
          background: 'radial-gradient(circle, rgba(230,126,34,0.06) 0%, transparent 70%)',
          pointerEvents: 'none', filter: 'blur(100px)', zIndex: 0
        }} />

        <div ref={s6.ref} className="container" style={{ maxWidth: '1200px', position: 'relative', zIndex: 1 }}>
          <div style={{
            opacity: s6.visible ? 1 : 0,
            transform: s6.visible ? 'translateY(0)' : 'translateY(60px)',
            transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
            textAlign: 'center',
            marginBottom: '4rem'
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ width: '30px', height: '1px', background: 'var(--primary)', opacity: 0.5 }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', color: 'var(--primary)' }}>The Founder</span>
              <div style={{ width: '30px', height: '1px', background: 'var(--primary)', opacity: 0.5 }} />
            </div>
            <h2 style={{ 
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
              lineHeight: 1, color: '#fff',
              fontFamily: 'var(--font-syne)', fontWeight: 800
            }}>
              I&apos;m Jaryd.
            </h2>
          </div>

          <div style={{ 
            opacity: s6.visible ? 1 : 0,
            transform: s6.visible ? 'scale(1)' : 'scale(0.98)',
            transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            position: 'relative',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {/* ─── Cinematic Branded Frame ─── */}
            <div style={{ 
              position: 'relative', 
              aspectRatio: '16/9', 
              borderRadius: '2px',
              padding: '12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.8)'
            }}>
              {/* Viewfinder Brackets */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '40px', borderTop: '2px solid var(--primary)', borderLeft: '2px solid var(--primary)', opacity: 0.6, zIndex: 10 }} />
              <div style={{ position: 'absolute', top: 0, right: 0, width: '40px', height: '40px', borderTop: '2px solid var(--primary)', borderRight: '2px solid var(--primary)', opacity: 0.6, zIndex: 10 }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: '40px', height: '40px', borderBottom: '2px solid var(--primary)', borderLeft: '2px solid var(--primary)', opacity: 0.6, zIndex: 10 }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: '40px', height: '40px', borderBottom: '2px solid var(--primary)', borderRight: '2px solid var(--primary)', opacity: 0.6, zIndex: 10 }} />

              {/* Technical Labels */}
              <div style={{ position: 'absolute', top: '24px', left: '24px', fontSize: '0.55rem', letterSpacing: '0.2em', opacity: 0.4, fontWeight: 900, textTransform: 'uppercase', zIndex: 10 }}>ID: FOUNDER_SIGNAL-01</div>
              <div style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10 }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff3b30', animation: 'pulse 1.5s infinite' }} />
                <span style={{ fontSize: '0.55rem', letterSpacing: '0.2em', opacity: 0.4, fontWeight: 900, textTransform: 'uppercase' }}>REC [ON]</span>
              </div>
              <div style={{ position: 'absolute', bottom: '24px', left: '24px', fontSize: '0.55rem', letterSpacing: '0.2em', opacity: 0.4, fontWeight: 900, textTransform: 'uppercase', zIndex: 10 }}>LOC: 49.7749° N, 114.8858° W</div>

              <div style={{ 
                position: 'relative', width: '100%', height: '100%', 
                overflow: 'hidden', background: '#000'
              }}>
                <Image 
                  src="https://res.cloudinary.com/doajstql7/image/upload/v1776285464/ChatGPT_Image_Apr_12_2026_11_04_25_PM_xi7ewb.png" 
                  alt="Jaryd Paquette" 
                  fill
                  style={{ objectFit: 'cover', filter: 'contrast(1.1) brightness(0.85)' }}
                  priority
                />
                {/* Scanline overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))', backgroundSize: '100% 4px, 3px 100%', pointerEvents: 'none', opacity: 0.4 }} />
              </div>
            </div>
          </div>

          {/* ─── Raw Signal Dossier Layout ─── */}
          <div style={{ 
            marginTop: '6rem',
            opacity: s6.visible ? 1 : 0,
            transform: s6.visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            maxWidth: '900px'
          }}>
            {/* Hacker style header */}
            <div style={{ 
              fontFamily: 'monospace', 
              fontSize: '0.75rem', 
              color: 'var(--primary)', 
              marginBottom: '3rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              letterSpacing: '0.2em'
            }}>
              [ ACCESSING_FOUNDER_FILES ]
              <div style={{ flex: 1, height: '1px', background: 'rgba(230,126,34,0.1)' }} />
              SIGNAL_01_DECRYPTED
            </div>

            <div style={{ 
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
              gap: '4rem' 
            }}>
              {/* Directive 1 */}
              <div>
                <div style={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', marginBottom: '1rem' }}>
                  // MODE: TRADESMAN_ORIGIN
                </div>
                <h3 style={{ fontSize: '1.4rem', color: '#fff', fontWeight: 800, fontFamily: 'var(--font-syne)', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
                  Construction by day.<br/>Signal by night.
                </h3>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-pjs)' }}>
                  I work <span style={{ color: 'var(--primary)' }}>construction during the day</span> and build business growth systems at night. I know what it means to put in a shift. I don&apos;t sell dreams; I build load-bearing infrastructure for your business.
                </p>
              </div>

              {/* Directive 2 */}
              <div>
                <div style={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', marginBottom: '1rem' }}>
                  // MODE: LOCAL_INTEGRITY
                </div>
                <h3 style={{ fontSize: '1.4rem', color: '#fff', fontWeight: 800, fontFamily: 'var(--font-syne)', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
                  Hand-Picked Clients.<br/>Zero Static.
                </h3>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-pjs)' }}>
                  I live in the Kootenays, I am getting to know the community, and I only work with a handful of businesses at a time. I don&apos;t scale for the sake of scaling. I deliver for the sake of reputation.
                </p>
              </div>

              {/* Directive 3 */}
              <div>
                <div style={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', marginBottom: '1rem' }}>
                  // MODE: TRANSPARENCY
                </div>
                <h3 style={{ fontSize: '1.4rem', color: '#fff', fontWeight: 800, fontFamily: 'var(--font-syne)', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
                  Truth Over Fluff.<br/>Period.
                </h3>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-pjs)' }}>
                  I am here to <span style={{ color: '#fff' }}>help you get more business.</span> If I can&apos;t help you, I&apos;ll tell you straight up. If I can, we&apos;ll build something that works while you stay focused on your trade.
                </p>
              </div>

              {/* Action */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '1rem' }}>
                <div style={{ 
                  padding: '2rem', 
                  borderLeft: '2px solid var(--primary)', 
                  background: 'rgba(230,126,34,0.03)',
                  marginBottom: '2rem'
                }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', marginBottom: '1rem', color: 'var(--primary)' }}>[ SYSTEM_DIRECTIVE ]</div>
                  <p style={{ fontSize: '0.95rem', fontStyle: 'italic', opacity: 0.7, marginBottom: '0' }}>
                    &ldquo;Build the signal. Cut the noise.&rdquo;
                  </p>
                </div>
                <Link href="/#how-it-works" className="story-link" style={{ fontSize: '0.9rem', fontWeight: 900 }}>
                  <span style={{ fontFamily: 'monospace' }}>ACCESS_BLUEPRINT_FILE</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* Terminal Footer */}
            <div style={{ 
              marginTop: '4rem', 
              fontFamily: 'monospace', 
              fontSize: '0.6rem', 
              opacity: 0.2,
              display: 'flex',
              justifyContent: 'space-between',
              textTransform: 'uppercase',
              letterSpacing: '0.2em'
            }}>
              <span>SIGNAL_STRENGTH: 100%</span>
              <span>CONNECTION: ENCRYPTED_DIRECT_P2P</span>
              <span>KOOTENAY_SIGNAL_V2.0.4</span>
            </div>
          </div>
        </div>
      </section>




<<<<<<< HEAD
      {/* ═══════════════════════════════════════════════════════════
          SECTION 7: CTA — Dramatic final close
          ═══════════════════════════════════════════════════════════ */}
      <section id="contact" style={{ 
        padding: 'clamp(6rem, 12vw, 12rem) 0', 
        background: 'var(--background)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Full-width glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '80vw', height: '80vw',
          background: 'radial-gradient(circle, rgba(230,126,34,0.06) 0%, transparent 50%)',
          pointerEvents: 'none', filter: 'blur(80px)'
        }} />

        <div ref={s7.ref} className="container" style={{ textAlign: 'center', maxWidth: '700px', position: 'relative', zIndex: 1 }}>
          <div style={{
            opacity: s7.visible ? 1 : 0,
            transform: s7.visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.97)',
            transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <h2 style={{ 
              fontSize: 'clamp(2.5rem, 7vw, 5rem)', 
              lineHeight: 0.95, marginBottom: '1.5rem', 
              fontFamily: 'var(--font-syne)', fontWeight: 800,
              color: '#fff'
            }}>
              Want more<br />
              <span className="text-gradient">business?</span>
            </h2>
            <p style={{ 
              fontSize: '1.3rem', marginBottom: '3.5rem', opacity: 0.45, 
              fontFamily: 'var(--font-pjs)'
            }}>
              No pressure. Just a conversation.
            </p>
=======
      {/* Final Conversion Section */}
      <section id="contact" className="section-padding" style={{ backgroundColor: '#0d1109' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '900px' }}>
          <span className="badge" style={{ marginBottom: '2rem' }}>Ready to Win?</span>
          <h2 style={{ fontSize: 'var(--h1-size)', lineHeight: 0.9, marginBottom: '3rem', fontFamily: 'var(--font-syne)' }}>
            Let’s Talk.
          </h2>
          <p style={{ fontSize: 'var(--p-large-size)', marginBottom: '4rem', opacity: 0.8, fontFamily: 'var(--font-pjs)' }}>
            No pitch. I’ll show you where you’re losing work.
          </p>
          
          <div className="mobile-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
            <Link 
              href="/signal-check"
              className="btn btn-primary" 
              style={{ padding: '1.8rem 4rem', fontSize: '1.5rem', fontWeight: 800, textDecoration: 'none' }}
            >
              RUN MY FREE SIGNAL CHECK
            </Link>
>>>>>>> 8648445 (feat: implement free signal check feature with new API and UI updates)
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
              <button 
                className="btn-cta-final"
                data-cal-link="kootenay-signal/30min"
                data-cal-namespace="30min"
                data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
              >
                <span>LET&apos;S TALK</span>
                <ArrowRight size={20} />
              </button>
              
              <p style={{ fontSize: '0.9rem', opacity: 0.3, marginTop: '0.5rem', fontFamily: 'var(--font-pjs)' }}>
                Or text me directly — I respond fast.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer style={{ 
        padding: '3rem 0', background: '#000', 
        borderTop: '1px solid rgba(255,255,255,0.04)' 
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ opacity: 0.25, fontSize: '0.7rem', letterSpacing: '0.15em', lineHeight: 2, fontWeight: 600, textTransform: 'uppercase' }}>
            &copy; {new Date().getFullYear()} Kootenay Signal<br className="mobile-hide" /> · Based in Sparwood, BC · Serving the Kootenays
          </p>
        </div>
      </footer>
    </main>
  );
}
