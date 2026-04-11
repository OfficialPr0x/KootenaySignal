'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Milestone, 
  Monitor, 
  Smartphone, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target,
  Radio
} from 'lucide-react';

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

  const [scroll, setScroll] = useState(0);
  const towns = ["Sparwood", "Fernie", "Elkford", "Cranbrook", "Jaffray"];

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScroll((currentScroll / totalScroll) * 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main>
      {/* Navigation */}
      <nav className="navbar" id="main-nav">
        <div className="scroll-progress" style={{ width: `${scroll}%` }}></div>
        <div className="nav-logo">
          <Image 
            src="https://res.cloudinary.com/doajstql7/image/upload/v1775879112/ChatGPT_Image_Apr_10__2026__11_27_53_PM-removebg-preview_vjtdqa.png" 
            alt="Kootenay Signal Logo" 
            width={120}
            height={120}
            className="nav-logo-img"
          />
          <div className="mobile-hide" style={{ marginLeft: '2rem', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '2rem' }}>
            <span style={{ 
              fontSize: '1rem', 
              fontWeight: 400, 
              fontStyle: 'italic',
              color: 'var(--foreground)', 
              opacity: 0.7,
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-serif)',
              display: 'block'
            }}>
              The Kootenay's Go-To For More Business
            </span>
          </div>
        </div>
        <div className="nav-links">
          <Link href="tel:+12505550123" className="nav-link mobile-hide" style={{ fontWeight: 700 }}>(250) 555-0123</Link>
          <button 
            className="btn btn-outline" 
            data-cal-link="kootenay-signal/30min"
            data-cal-namespace="30min"
            data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
            style={{ 
              padding: '0.5rem 1.5rem',
              fontSize: 'min(0.8rem, 3.5vw)',
              background: 'transparent',
              cursor: 'pointer'
            }}
          >
            Start My Signal Boost
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" style={{
        backgroundImage: `linear-gradient(to bottom, rgba(13, 17, 9, 0.4), rgba(13, 17, 9, 0.95)), url('https://res.cloudinary.com/doajstql7/image/upload/v1775879081/Elk_Valley_sunset_workshop_scene_gvwak0.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
      }}>
        <div className="container">
          <div className="hero-content mobile-center">
            <h1 className="mobile-center" style={{ 
              lineHeight: 0.9,
              maxWidth: '850px',
              color: '#fff',
              textShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}>
              If Locals Don’t Know You… <br className="mobile-hide"/>
              <span style={{ color: 'var(--primary)' }}>You Don’t Exist.</span>
            </h1>

            <p className="mobile-font-lg" style={{ 
              fontSize: 'min(0.95rem, 2.5vh)', 
              maxWidth: '600px', 
              marginBottom: '3vh',
              color: '#fff',
              lineHeight: 1.3,
              fontWeight: 400
            }}>
              We put Kootenay businesses on the map—and keep them there. 
              More calls. Better jobs. <span style={{ fontWeight: 700 }}>No city agency bullshit.</span>
            </p>

            <div className="mobile-center" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
              <div className="mobile-stack" style={{ 
                display: 'flex', 
                gap: '1.5rem', 
                flexWrap: 'wrap',
                justifyContent: 'inherit'
              }}>
                <button 
                  className="btn btn-primary" 
                  id="btn-cta-hero"
                  data-cal-link="kootenay-signal/30min"
                  data-cal-namespace="30min"
                  data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
                  style={{ padding: '1.2rem 2.5rem', fontSize: '1.2rem' }}
                >
                  GET MY SIGNAL CHECKED
                </button>
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
              </div>
            </div>
          </div>
        </div>

        {/* Operational Territory Strip (Bottom Frame) */}
        <div className="mobile-hide" style={{ 
          position: 'absolute', 
          bottom: '2rem',
          left: 0, 
          width: '100%',
          zIndex: 10,
          pointerEvents: 'none',
          padding: '0 8vw'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            width: '100%',
            opacity: 0.5,
            fontSize: 'max(0.9vw, 0.75rem)', 
            fontWeight: 900, 
            textTransform: 'uppercase', 
            letterSpacing: '0.5em',
            color: '#fff',
            fontFamily: 'var(--font-pjs)'
          }}>
            <span>Fernie</span>
            <span>Sparwood</span>
            <span>Elkford</span>
            <span>Cranbrook</span>
            <span>Nelson</span>
            <span>Castlegar</span>
            <span>Trail</span>
            <span>Kimberley</span>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ backgroundColor: 'var(--primary)', color: '#000' }}>
        <div className="container">
          <div style={{ maxWidth: '900px' }}>
            <h2 className="mobile-center" style={{ fontSize: 'var(--h2-size)', color: '#000', marginBottom: '2.5rem', lineHeight: 1, fontFamily: 'var(--font-syne)', fontWeight: 800 }}>
              You’re Losing Jobs. <br className="mobile-hide" />You Just Don’t See It.
            </h2>
            <div className="mobile-center" style={{ fontSize: 'var(--p-large-size)', lineHeight: 1.4, fontWeight: 500, fontFamily: 'var(--font-pjs)' }}>
              <p style={{ marginBottom: '1.5rem' }}>Someone searched your service yesterday. They didn’t find you.</p>
              <p style={{ marginBottom: '1.5rem' }}>They found someone worse.</p>
              <p style={{ opacity: 0.8 }}>That job is gone.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="section-padding" style={{ backgroundColor: '#0a0d07' }}>
        <div className="container">
          <div className="section-header mobile-center" style={{ marginBottom: '6rem' }}>
            <span className="badge">Weaponized Systems</span>
            <h2 style={{ fontSize: 'var(--h2-size)' }}>We Build Signal — Not Just Sites</h2>
          </div>
          
          <div className="mobile-grid-1" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '1.5rem',
            overflowX: 'auto',
            paddingBottom: '2rem'
          }}>
            <div className="service-card" style={{ minWidth: '220px', padding: '3rem 2rem', background: 'var(--secondary)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', opacity: 0.2, display: 'block', marginBottom: '1rem' }}>01</span>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>SignalForge™</h3>
              <p style={{ opacity: 0.8, fontSize: '1rem', lineHeight: 1.6 }}>
                Build your signal foundation. High-conversion lead engines that capture every local lead.
              </p>
            </div>
            <div className="service-card" style={{ minWidth: '220px', padding: '3rem 2rem', background: 'var(--secondary)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', opacity: 0.2, display: 'block', marginBottom: '1rem' }}>02</span>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>SearchLock™</h3>
              <p style={{ opacity: 0.8, fontSize: '1rem', lineHeight: 1.6 }}>
                Own local search permanently. Google, Maps, and Local Search — locked in.
              </p>
            </div>
            <div className="service-card" style={{ minWidth: '220px', padding: '3rem 2rem', background: 'var(--secondary)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', opacity: 0.2, display: 'block', marginBottom: '1rem' }}>03</span>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>GhostOps AI™</h3>
              <p style={{ opacity: 0.8, fontSize: '1rem', lineHeight: 1.6 }}>
                Never miss money again. Automated follow-ups, bookings, and missed call handling.
              </p>
            </div>
            <div className="service-card" style={{ minWidth: '220px', padding: '3rem 2rem', background: 'var(--secondary)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', opacity: 0.2, display: 'block', marginBottom: '1rem' }}>04</span>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Kootenay Broadcast™</h3>
              <p style={{ opacity: 0.8, fontSize: '1rem', lineHeight: 1.6 }}>
                Be seen everywhere that matters. High-impact local awareness and signal boosting.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="broadcast" className="section-padding" style={{ backgroundColor: '#0d1109', position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="badge" style={{ borderColor: 'var(--primary)', color: 'var(--primary)', opacity: 1 }}>
              Attention Layer: ACTIVE
            </span>
            <h2 style={{ 
              fontSize: 'var(--h2-size)',
              lineHeight: 0.85,
              margin: '1.5rem 0',
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-syne)',
              fontWeight: 800
            }}>
              Kootenay Broadcast™
            </h2>
            <p className="mobile-font-sm" style={{ 
              fontSize: '1rem',
              lineHeight: 1.4,
              marginBottom: '2rem',
              maxWidth: '600px',
              margin: '0 auto',
              opacity: 0.9,
              fontFamily: 'var(--font-pjs)'
            }}>
              Your business — seen where locals actually look.
            </p>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h3 style={{ fontSize: 'var(--h3-size)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.2 }}>
              If they’re driving, scrolling, or waiting — <br className="mobile-hide"/>
              <span style={{ color: 'var(--primary)' }}>they’re seeing you.</span>
            </h3>
          </div>

          {/* Map Visual */}
          <div style={{ 
            position: 'relative', 
            width: '100%', 
            aspectRatio: '16/9',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '6rem',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
            backgroundColor: '#000'
          }}>
            <div style={{ 
              position: 'absolute', 
              inset: 0, 
              backgroundImage: `url('https://res.cloudinary.com/doajstql7/image/upload/v1775884538/ChatGPT_Image_Apr_11_2026_01_13_00_AM_hx4ibt.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }} />
            
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, transparent 20%, rgba(13, 17, 9, 1) 95%)', pointerEvents: 'none' }} />
            
            <div className="mobile-hide" style={{ position: 'absolute', top: '15%', right: '15%', background: 'rgba(0,0,0,0.8)', padding: '0.6rem 1.2rem', borderRadius: '2px', border: '1px solid var(--primary)', fontSize: '0.8rem', letterSpacing: '0.2em', fontWeight: 800, textTransform: 'uppercase', zIndex: 10 }}>
              Live Broadcast Coverage
            </div>
          </div>

          <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', marginBottom: '6rem' }}>
            <div>
              <p className="mobile-center" style={{ fontSize: '1.4rem', lineHeight: 1.6, fontFamily: 'var(--font-pjs)', marginBottom: '3rem' }}>
                We don’t run ads. <br/>
                <b>We place your business into the real-world flow of the Kootenays.</b>
              </p>
              <div className="mobile-hide" style={{ opacity: 0.7, fontSize: '1.1rem', fontStyle: 'italic', borderLeft: '2px solid var(--primary)', paddingLeft: '1.5rem' }}>
                The same roads. The same stops. The same places everyone passes through every day.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem' }}>
                  <Milestone size={18} /> Highway Presence
                </h4>
                <p style={{ opacity: 0.7, fontSize: '0.8rem' }}>On the drive into town.</p>
              </div>
              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem' }}>
                  <Monitor size={18} /> In-Town Screens
                </h4>
                <p style={{ opacity: 0.7, fontSize: '0.8rem' }}>Where locals stop & wait.</p>
              </div>
              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem' }}>
                  <Smartphone size={18} /> Digital Reinforce
                </h4>
                <p style={{ opacity: 0.7, fontSize: '0.8rem' }}>Appear on their phone.</p>
              </div>
              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem' }}>
                  <RefreshCw size={18} /> Repeat Exposure
                </h4>
                <p style={{ opacity: 0.7, fontSize: '0.8rem' }}>Enough to remember.</p>
              </div>
            </div>
          </div>

          <div style={{ background: '#111', padding: '3rem 2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
             <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
               <div>
                 <h2 style={{ fontSize: 'var(--h3-size)', marginBottom: '1.5rem' }}>The Impact of Total Local Presence</h2>
                 <ul style={{ listStyle: 'none', padding: 0, fontSize: '1.1rem', lineHeight: 1.8 }}>
                   <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                     <CheckCircle2 size={20} style={{ color: 'var(--primary)' }} />
                     People recognize your name
                   </li>
                   <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                     <CheckCircle2 size={20} style={{ color: 'var(--primary)' }} />
                     You feel “bigger” instantly
                   </li>
                   <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                     <CheckCircle2 size={20} style={{ color: 'var(--primary)' }} />
                     Stop explaining who you are
                   </li>
                   <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                     <CheckCircle2 size={20} style={{ color: 'var(--primary)' }} />
                     You start getting chosen
                   </li>
                 </ul>
               </div>
               <div className="mobile-p-0" style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.05)', paddingLeft: '2rem' }}>
                 <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.8 }}>
                   "Businesses inside the Broadcast don’t compete the same way."
                 </p>
                 <div style={{ background: '#000', padding: '2rem', border: '2px solid var(--primary)' }}>
                   <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>Ready to Be Seen?</h3>
                   <p style={{ marginBottom: '1.5rem', opacity: 0.7, fontSize: '0.8rem' }}>One business per category. No exceptions.</p>
                   <button 
                      className="btn btn-primary" 
                      style={{ width: '100%', fontSize: '0.9rem' }}
                      data-cal-link="kootenay-signal/30min"
                      data-cal-namespace="30min"
                      data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
                    >
                      START MY BROADCAST
                    </button>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Local Proof Engine */}
      <section className="section-padding" style={{ backgroundColor: 'var(--secondary)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <div className="section-header mobile-center" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="badge">Results Over Features</span>
            <h2 style={{ fontSize: 'var(--h2-size)' }}>When Signal Goes Up</h2>
          </div>
          <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(4rem, 10vw, 6rem)', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>+42%</div>
              <p style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginTop: '0.5rem', opacity: 0.8, fontSize: '0.8rem' }}>Avg. Increase in Calls</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(4rem, 10vw, 6rem)', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>3 WKS</div>
              <p style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginTop: '0.5rem', opacity: 0.8, fontSize: '0.8rem' }}>Booked Out Lead Time</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(4rem, 10vw, 6rem)', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>0</div>
              <p style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginTop: '0.5rem', opacity: 0.8, fontSize: '0.8rem' }}>Budget Tire Kickers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rooted update */}
      <section className="section-padding" style={{ backgroundColor: '#000' }}>
        <div className="container">
          <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div className="mobile-center">
              <span className="badge">Kootenay DNA</span>
              <h2 style={{ fontSize: 'var(--h2-size)', marginBottom: '2rem' }}>We live here. <br className="mobile-hide"/>We work here.</h2>
              <div style={{ fontSize: 'var(--p-size)', opacity: 0.8, lineHeight: 1.6, fontFamily: 'var(--font-pjs)' }}>
                <p style={{ marginBottom: '2rem' }}>Reputation is everything here. Word spreads fast. One great site, and you own the area.</p>
                <p className="mobile-hide">We build for businesses like yours — not boardrooms in Toronto. If your cousin can't find you, neither can customers.</p>
              </div>
            </div>
            <div style={{ backgroundColor: '#111', padding: '3rem', border: '1px solid var(--primary)', borderRadius: '2px' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--primary)', fontFamily: 'var(--font-syne)' }}>The Kootenay Standard</h3>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '1.1rem' }}>
                <li style={{ marginBottom: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--primary)' }}>✅</span> <b>Sparwood Based</b>
                </li>
                <li style={{ marginBottom: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--primary)' }}>✅</span> <b>On-Site Strategy</b>
                </li>
                <li style={{ marginBottom: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--primary)' }}>✅</span> <b>Direct Cell Access</b>
                </li>
                <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--primary)' }}>✅</span> <b>Results Or We Don't Work</b>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Field Reports */}
      <section id="locals" className="section-padding" style={{ background: '#0a0d07', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <div className="section-header mobile-center" style={{ marginBottom: '4rem' }}>
            <span className="badge">Field Reports</span>
            <h2 style={{ fontSize: 'var(--h2-size)' }}>Local Wins</h2>
          </div>
          <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            <div style={{ padding: '3rem 2rem', background: 'rgba(255,255,255,0.02)', position: 'relative', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.5, position: 'relative', zIndex: 1, fontFamily: 'var(--font-pjs)' }}>
                "Since implementing **SearchLock™**, we've seen a 40% increase in calls. They understand our market. We're booked out for months."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '30px', height: '1px', background: 'var(--primary)' }}></div>
                <div style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem' }}>Fernie Custom Cabinets</div>
              </div>
            </div>
            <div style={{ padding: '3rem 2rem', background: 'rgba(255,255,255,0.02)', position: 'relative', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.5, position: 'relative', zIndex: 1, fontFamily: 'var(--font-pjs)' }}>
                "Kootenay Signal is built different. The **GhostOps AI™** follow-ups have saved us thousands in missed jobs already."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '30px', height: '1px', background: 'var(--primary)' }}></div>
                <div style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem' }}>Elkford Mechanical</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitor Pressure */}
      <section className="section-padding" style={{ backgroundColor: '#620000', color: '#fff', borderTop: '4px solid #8b0000' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '900px' }}>
          <h2 style={{ fontSize: 'var(--h2-size)', color: '#fff', marginBottom: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-syne)' }}>
            Your Competitor Might Call Us First.
          </h2>
          <p style={{ fontSize: '1.4rem', marginBottom: '2rem', fontWeight: 500 }}>
            And if they do — we <span style={{ textDecoration: 'underline' }}>won’t</span> work with you.
          </p>
          <div style={{ opacity: 0.8, fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            We protect our clients' territory. Period.
          </div>
        </div>
      </section>

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
            <button 
              className="btn btn-primary" 
              style={{ padding: '1.8rem 4rem', fontSize: '1.5rem', fontWeight: 800 }}
              data-cal-link="kootenay-signal/30min"
              data-cal-namespace="30min"
              data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
            >
              GET MY SIGNAL CHECKED
            </button>
            
            <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>
              Or text us at <a href="sms:+12505550123" style={{ color: 'var(--primary)' }}>(250) 555-0123</a>
            </div>
          </div>

          <div style={{ marginTop: '6rem', fontSize: '0.7rem', opacity: 0.5, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>
            Kootenay Signal — If they can't find you, they're not hiring you.
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '3rem 0', background: '#000', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ opacity: 0.5, fontSize: '0.7rem', letterSpacing: '0.1em', lineHeight: 1.6 }}>
            &copy; {new Date().getFullYear()} KOOTENAY SIGNAL AGENCY<br className="mobile-hide" /> • BASED IN SPARWOOD, BC • SERVING THE ELK VALLEY
          </p>
        </div>
      </footer>
    </main>
  );
}
