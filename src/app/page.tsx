'use client';

import { useEffect } from 'react';
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
  Radio,
  Lock,
  Unlock,
  Calculator,
  TrendingDown,
  TrendingUp,
  MapPin,
  XCircle,
  Clock
} from 'lucide-react';
import { useState } from 'react';

  // Atmosphere Component for depth
  const Atmosphere = () => (
    <div style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px', zIndex: 0 }} />
  );

export default function Home() {
  const [jobValue, setJobValue] = useState(500);
  const [missedCalls, setMissedCalls] = useState(5);

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

  return (
    <main style={{ position: 'relative' }}>
      {/* Hero Section */}

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
              If You’re Not Seen <br className="mobile-hide"/>
              <span style={{ color: 'var(--primary)' }}>You’re Skipped.</span>
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
                <Link 
                  href="/dashboard/new"
                  className="btn btn-primary" 
                  id="btn-cta-hero"
                  style={{ padding: '1.2rem 2.5rem', fontSize: '1.2rem', textDecoration: 'none' }}
                >
                  GET MY SIGNAL CHECKED
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

      {/* Founder Story - Jaryd Paquette */}
      <section style={{ padding: '8rem 0', background: 'var(--background)', position: 'relative', overflow: 'hidden' }}>
        <Atmosphere />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            
            {/* Branded 16:9 Frame */}
            <div style={{ position: 'relative', marginBottom: '5rem' }}>
              <div style={{ 
                position: 'relative',
                aspectRatio: '16/9',
                width: '100%',
                borderRadius: '4px',
                overflow: 'hidden',
                border: '1px solid var(--border-color)',
                boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
                backgroundColor: '#0a0d07'
              }}>
                <Image 
                  src="https://res.cloudinary.com/doajstql7/image/upload/v1776048942/ChatGPT_Image_Apr_12_2026_10_33_06_PM_jqsll7.png" 
                  alt="Jaryd Paquette - Kootenay Signal Founder" 
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'bottom right', filter: 'contrast(1.05) brightness(0.9)' }}
                  priority
                />
                
                {/* Tech Overlay Theming */}
                <div style={{ 
                  position: 'absolute', 
                  top: '20px', 
                  left: '20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  opacity: 0.6
                }}>
                  <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', boxShadow: '0 0 10px var(--primary)' }} />
                  <span style={{ fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Signal Active: sparwood_node_01</span>
                </div>
              </div>
              
              {/* Frame Accents */}
              <div style={{ position: 'absolute', top: '-15px', left: '-15px', width: '60px', height: '60px', borderTop: '2px solid var(--primary)', borderLeft: '2px solid var(--primary)', opacity: 0.5 }} />
              <div style={{ position: 'absolute', bottom: '-15px', right: '-15px', width: '60px', height: '60px', borderBottom: '2px solid var(--primary)', borderRight: '2px solid var(--primary)', opacity: 0.5 }} />
            </div>

            {/* Story Content */}
            <div className="founder-story">
              <span className="badge" style={{ marginBottom: '2.5rem' }}>Identity Protocol</span>
              
              <h2 style={{ 
                fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
                lineHeight: 1, 
                marginBottom: '1rem',
                fontFamily: 'var(--font-serif)'
              }}>
                Why I’m Betting on the Kootenays <br />
                <span className="text-gradient">(And How I Can Help You Win Here)</span>
              </h2>
              
              <p style={{ 
                fontSize: '1.25rem', 
                fontWeight: 700, 
                color: 'var(--primary)', 
                marginBottom: '4rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                By Jaryd Paquette
              </p>

              <div style={{ 
                fontSize: 'var(--p-large-size)', 
                lineHeight: 1.8, 
                opacity: 0.9,
                fontFamily: 'var(--font-sans)'
              }}>
                <p style={{ marginBottom: '2.5rem', fontSize: '1.3rem', fontWeight: 500 }}>
                  I just moved to Sparwood with a duffelbag of clothes, work boots, a laptop, and a reason to stay alive.
                </p>

                <p style={{ marginBottom: '2rem' }}>
                  I’m a lead developer and systems architect by trade. But before I got here, I was homeless in Ottawa. I lost my savings, my stuff, and almost my mind. Then I did something that changed everything: I traded my skills for a roof. That one pivot became <Link href="https://www.hostelhack.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline', fontWeight: 800 }}>HostelHack</Link>—a platform that lets travelers exchange real work for accommodation. It got me off the street, into a hostel, and onto a flight to BC (I was even <Link href="https://www.wfxg.com/online_features/press_releases/hostelhack-launches-after-founder-trades-skills-for-shelter-creating-a-skill-based-exchange-platform/article_e38b2ed7-5663-5488-9f78-c6d9aa8f59f7.html" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>featured on Fox</Link> for it).
                </p>

                <p style={{ marginBottom: '2rem' }}>
                  Now I’m building houses and renos by day ($40/hr, a place to live, mountains out my window). And by night, I’m building <b>Kootenay Signal</b>—because this community deserves a digital hub that actually works for local businesses.
                </p>

                <h3 style={{ fontSize: '2rem', color: '#fff', margin: '4rem 0 2rem' }}>Why should a Kootenay business owner listen to me?</h3>
                
                <p style={{ marginBottom: '2rem' }}>
                  I’m not a suit. I’m not a “growth hacker” selling dreams. I’m a guy who went from zero to a functioning platform in 10 days while sleeping in a hostel. That means I know how to:
                </p>

                <div style={{ display: 'grid', gap: '2rem', marginBottom: '4rem' }}>
                  <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderLeft: '3px solid var(--primary)' }}>
                    <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Fix what’s broken</h4>
                    <p style={{ opacity: 0.7 }}>Websites that don’t convert, booking systems that leak customers, social media that goes nowhere.</p>
                  </div>
                  <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderLeft: '3px solid var(--accent)' }}>
                    <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Automate the boring stuff</h4>
                    <p style={{ opacity: 0.7 }}>AI booking agents, lead follow‑ups, inventory alerts – so you can go back to actually running your business.</p>
                  </div>
                  <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderLeft: '3px solid #fff' }}>
                    <h4 style={{ color: '#fff', marginBottom: '0.5rem' }}>Build without bloat</h4>
                    <p style={{ opacity: 0.7 }}>I write clean code and lean systems. No $50k “digital transformation” projects. Just solutions that pay for themselves in weeks.</p>
                  </div>
                </div>

                <h3 style={{ fontSize: '2rem', color: '#fff', margin: '4rem 0 2rem' }}>What I’m NOT going to do</h3>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '4rem' }}>
                  <li style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}><XCircle size={24} color="#c0392b" /> Sell you a retainer you don’t need.</li>
                  <li style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}><XCircle size={24} color="#c0392b" /> Use buzzwords like “synergy” or “paradigm shift.”</li>
                  <li style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}><XCircle size={24} color="#c0392b" /> Pretend I know your industry better than you do.</li>
                </ul>

                <h3 style={{ fontSize: '2rem', color: '#fff', margin: '4rem 0 2rem' }}>What I AM offering – right now</h3>
                <p style={{ marginBottom: '2.5rem' }}>Because I’m new here and I want to earn my place:</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                   <div style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '4px' }}>
                      <p style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: '1rem' }}>01. FREE AUDIT</p>
                      <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>A free 30‑minute tech audit. I’ll show you three specific things that are costing you money.</p>
                   </div>
                   <div style={{ border: '2px solid var(--primary)', padding: '2rem', borderRadius: '4px', background: 'rgba(230, 126, 34, 0.05)' }}>
                      <p style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: '1rem' }}>02. FLAT-FEE BETA</p>
                      <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>No retainer project for the first three businesses that say “yes.” You pay only for the work delivered.</p>
                   </div>
                </div>

                <div style={{ padding: '4rem', background: '#111', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', textAlign: 'center' }}>
                  <h3 style={{ marginBottom: '2rem' }}>Who I am, simply</h3>
                  <p style={{ marginBottom: '1rem' }}>I’m the guy who will show up on time, over‑deliver, and never bullshit you.</p>
                  <p style={{ marginBottom: '1rem' }}>I’ve failed enough to know what actually works.</p>
                  <p style={{ marginBottom: '3rem' }}>I love the Kootenays because people here value grit over glamour. That’s my language.</p>
                  
                  <Link href="/dashboard/new" className="btn btn-primary" style={{ padding: '1.5rem 3rem' }}>
                    LET'S GET TO WORK
                  </Link>
                </div>

                <p style={{ marginTop: '5rem', fontSize: '1.2rem', fontStyle: 'italic', textAlign: 'center', opacity: 0.7 }}>
                  Let’s grab a coffee in Sparwood, Fernie, or Cranbrook. Or just send me a message through Kootenay Signal. I’ll show you what I’m building – and how I can help you build, too.
                </p>
                
                <p style={{ textAlign: 'center', marginTop: '2rem', fontWeight: 800, fontSize: '1.5rem' }}>– Jaryd</p>

                <p style={{ marginTop: '4rem', fontSize: '0.9rem', opacity: 0.5, maxWidth: '600px', margin: '4rem auto 0', textAlign: 'center' }}>
                  P.S. My whole messy story is on my site. But the only thing that matters is: I’m here, I’m staying, and I want to make your business run better. No strings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. COMPETITOR THREAT SECTION */}
      <section style={{ padding: '8rem 0', background: '#0a0d07', position: 'relative', overflow: 'hidden' }}>
        <Atmosphere />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div className="badge" style={{ marginBottom: '2rem' }}>Territory Exclusivity Protocol</div>
            <h2 style={{ fontSize: 'var(--h2-size)', color: '#fff', marginBottom: '1.5rem', lineHeight: 1 }}>
              Regional <span style={{ color: 'var(--primary)' }}>Dominance List</span>
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.4)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.5 }}>
              We deploy the Kootenay Broadcast™ for only <b>one business per niche</b> in each territory. Once a spot is filled, we literally cannot help your competition.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1rem',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {[
              { trade: "Electricians", area: "Fernie", status: "LOCKED", icon: <Zap size={24} /> },
              { trade: "Plumbers", area: "Sparwood", status: "AVAILABLE", icon: <RefreshCw size={24} /> },
              { trade: "Roofing/Siding", area: "Cranbrook", status: "AVAILABLE", icon: <ShieldCheck size={24} /> },
              { trade: "HVAC Experts", area: "Elkford", status: "LOCKED", icon: <Target size={24} /> },
              { trade: "Excavation / Septic", area: "Nelson", status: "AVAILABLE", icon: <MapPin size={24} /> },
              { trade: "Landscaping / Snow", area: "Rossland", status: "LOCKED", icon: <Milestone size={24} /> },
            ].map((item, i) => (
              <div key={i} style={{
                background: item.status === 'LOCKED' ? 'rgba(255,255,255,0.01)' : 'rgba(230, 126, 34, 0.03)',
                border: `1px solid ${item.status === 'LOCKED' ? 'rgba(255,255,255,0.05)' : 'rgba(230, 126, 34, 0.15)'}`,
                padding: '2rem',
                borderRadius: '8px',
                position: 'relative',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '200px'
              }}>
                <div>
                   <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      background: item.status === 'LOCKED' ? 'rgba(255,255,255,0.05)' : 'rgba(230, 126, 34, 0.1)', 
                      borderRadius: '4px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      marginBottom: '1.5rem',
                      color: item.status === 'LOCKED' ? 'rgba(255,255,255,0.2)' : 'var(--primary)'
                   }}>
                      {item.icon}
                   </div>
                   <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', fontWeight: 800 }}>{item.trade}</h3>
                   <p style={{ opacity: 0.4, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700 }}>{item.area}</p>
                </div>
                
                <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    color: item.status === 'LOCKED' ? '#ff4d4d' : '#00ff88',
                    fontSize: '0.75rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em'
                  }}>
                    {item.status === 'LOCKED' ? <Lock size={14} /> : <Unlock size={14} />}
                    {item.status}
                  </div>
                  {item.status === 'LOCKED' ? (
                    <button 
                      data-cal-link="kootenay-signal/waitlist"
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      Join Waitlist
                    </button>
                  ) : (
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      background: '#00ff88', 
                      boxShadow: '0 0 15px #00ff88' 
                    }} />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '5rem' }}>
             <button 
                className="btn btn-primary" 
                data-cal-link="kootenay-signal/30min"
                style={{ padding: '1.25rem 3.5rem', borderRadius: '2px' }}
              >
               CHECK MY TRADE AVAILABILITY
             </button>
          </div>
        </div>
      </section>

      {/* 2. MISSED MONEY CALCULATOR */}
      <section id="calculator" style={{ padding: '10rem 0', background: 'var(--background)', position: 'relative', overflow: 'hidden' }}>
        <Atmosphere />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div className="badge" style={{ background: 'rgba(192, 57, 43, 0.1)', color: '#c0392b', borderColor: 'rgba(192, 57, 43, 0.2)' }}>The Cost of Invisibility</div>
              <h2 style={{ fontSize: 'var(--h2-size)', marginBottom: '1.5rem', lineHeight: 1.1 }}>
                Stop Guessing. <br />
                <span className="text-gradient">Measure Your Loss.</span>
              </h2>
              <p style={{ fontSize: '1.1rem', opacity: 0.6, marginBottom: '2rem' }}>
                Every time your phone doesn't ring because a competitor was "seen first," that's money leaving your bank account. Turn abstract ideas into real loss.
              </p>
              
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6 }}>
                    Avg. Job Revenue ($)
                  </label>
                  <input 
                    type="range" 
                    min="100" 
                    max="10000" 
                    step="100" 
                    value={jobValue}
                    onChange={(e) => setJobValue(parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--primary)' }} 
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontWeight: 800, fontFamily: 'var(--font-syne)' }}>
                    <span>$100</span>
                    <span style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>${jobValue.toLocaleString()}</span>
                    <span>$10,000</span>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6 }}>
                    Missed Calls Per Week (Inbound Intent)
                  </label>
                  <input 
                    type="range" 
                    min="1" 
                    max="50" 
                    step="1" 
                    value={missedCalls}
                    onChange={(e) => setMissedCalls(parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--primary)' }} 
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontWeight: 800, fontFamily: 'var(--font-syne)' }}>
                    <span>1</span>
                    <span style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>{missedCalls}</span>
                    <span>50</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ 
              background: 'linear-gradient(135deg, #11140e 0%, #0d1109 100%)', 
              padding: '4rem', 
              borderRadius: '4px', 
              border: '1px solid var(--primary)',
              textAlign: 'center',
              boxShadow: '0 20px 80px rgba(0,0,0,0.6)',
              transform: 'rotate(1deg)'
            }}>
              <TrendingDown size={48} color="#c0392b" style={{ marginBottom: '1.5rem' }} />
              <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.8rem', opacity: 0.5, marginBottom: '0.5rem' }}>
                Estimated Monthly Revenue Loss
              </p>
              <h2 style={{ fontSize: 'min(4.5rem, 15vw)', fontFamily: 'var(--font-syne)', color: 'white', margin: 0 }}>
                ${(jobValue * missedCalls * 0.3 * 4).toLocaleString()}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', marginTop: '1rem' }}>
                *Based on a conservative 30% closing rate
              </p>
              
              <button 
                className="btn btn-primary" 
                data-cal-link="kootenay-signal/30min"
                style={{ width: '100%', marginTop: '3.5rem', padding: '1.5rem', fontWeight: 900 }}
              >
                FIX MY SIGNAL
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DAY IN THE LIFE SPLIT */}
      <section style={{ background: '#0a0d07', borderTop: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', position: 'relative' }}>
        <Atmosphere />
        <div style={{ display: 'flex', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          <div style={{ flex: '1 1 500px', padding: '8rem 4rem', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
             <XCircle size={40} color="#c0392b" style={{ marginBottom: '2rem' }} />
             <h2 style={{ fontSize: 'var(--h3-size)', marginBottom: '2.5rem' }}>Without Signal</h2>
             <ul style={{ listStyle: 'none', padding: 0 }}>
               {[
                 "Relying on 'Neighborly' referrals that dry up every winter.",
                 "Checking the phone at 2 PM to see 0 new notifications.",
                 "Competing on price because they've never heard of your quality.",
                 "Total silence during the 'Slow Season'.",
                 "Being the best kept secret in the Elk Valley."
               ].map((item, i) => (
                 <li key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', opacity: 0.5, fontSize: '1.1rem' }}>
                   <span style={{ color: '#c0392b', fontWeight: 900 }}>—</span> {item}
                 </li>
               ))}
             </ul>
          </div>
          <div style={{ flex: '1 1 500px', padding: '8rem 4rem', background: 'rgba(230, 126, 34, 0.02)' }}>
             <TrendingUp size={40} color="#27ae60" style={{ marginBottom: '2rem' }} />
             <h2 style={{ fontSize: 'var(--h3-size)', marginBottom: '2.5rem' }}>With Signal</h2>
             <ul style={{ listStyle: 'none', padding: 0 }}>
               {[
                 "Inbound flows that scale when you're ready for more.",
                 "The 'I see you everywhere' moment on every first call.",
                 "Booked out weeks in advance—regardless of the weather.",
                 "Dominating local search results for your primary trade.",
                 "Owning the digital territory before the competition wakes up."
               ].map((item, i) => (
                 <li key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                   <CheckCircle2 size={24} color="#27ae60" /> {item}
                 </li>
               ))}
             </ul>
          </div>
        </div>
      </section>

      {/* 4. YOU'VE SEEN THIS BEFORE MOMENT + PROOF */}
      <section style={{ padding: '8rem 0', background: 'var(--background)' }}>
         <div className="container">
           <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
             <h2 style={{ fontSize: 'var(--h2-size)', marginBottom: '1.5rem' }}>You’ve Seen These Businesses Everywhere</h2>
             <p style={{ fontSize: '2rem', fontFamily: 'var(--font-syne)', fontStyle: 'italic', color: 'var(--primary)', fontWeight: 800 }}>
               That wasn't luck.
             </p>
             <p style={{ maxWidth: '650px', margin: '2rem auto 0', opacity: 0.6, fontSize: '1.2rem', lineHeight: 1.6 }}>
               The businesses that "everyone knows" in the Kootenays didn't get there by accident. They are running intentional Signal engines. We are the technicians behind those engines.
             </p>
           </div>

           <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '4rem',
              alignItems: 'center'
           }}>
             <div>
               <div style={{ background: '#0a0d07', padding: '3rem', border: '1px solid var(--primary)', borderRadius: '4px', position: 'relative' }}>
                 <div style={{ position: 'absolute', top: '-20px', left: '20px', background: 'var(--primary)', padding: '0.25rem 1rem', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: 'black' }}>
                   Case: SEARCHLOCK™
                 </div>
                 <p style={{ fontSize: '1.5rem', fontFamily: 'var(--font-syne)', fontWeight: 800, marginBottom: '1.5rem' }}>
                   "We started seeing calls from people who said ‘I see you everywhere’"
                 </p>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <div style={{ width: '40px', height: '40px', background: '#e67e22', borderRadius: '50%' }} />
                   <div>
                     <p style={{ margin: 0, fontWeight: 700 }}>Local Trade Founder</p>
                     <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.5 }}>Sparwood, BC</p>
                   </div>
                 </div>
               </div>
             </div>
             
             <div>
               <h3 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Real-World Signal Penetration</h3>
               <p style={{ opacity: 0.6, marginBottom: '2rem', lineHeight: 1.6 }}>
                 We don't trust "clicks." We trust volume. Our systems map placements and call routing to ensure that when a local needs help, your name is the only one they remember.
               </p>
               <div style={{ display: 'flex', gap: '2rem' }}>
                 <div>
                   <p style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)', margin: 0 }}>4.2x</p>
                   <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5 }}>Search Volume Map Expansion</p>
                 </div>
                 <div>
                   <p style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)', margin: 0 }}>280%</p>
                   <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5 }}>Avg Call Intent Increase</p>
                 </div>
               </div>
             </div>
           </div>

           {/* Re-contextualized Broadcast Map */}
           <div style={{ 
              marginTop: '8rem',
              position: 'relative', 
              width: '100%', 
              aspectRatio: '16/8',
              borderRadius: '4px',
              overflow: 'hidden',
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
                opacity: 0.6
              }} />
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, transparent 20%, rgba(13, 17, 9, 1) 95%)' }} />
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '100%', padding: '0 2rem' }}>
                <p style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.5em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                  SIGNAL COVERAGE MAP
                </p>
                <h2 style={{ fontSize: 'min(3rem, 8vw)', fontFamily: 'var(--font-syne)', fontWeight: 900, textTransform: 'uppercase' }}>
                  Total Regional Overlook
                </h2>
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

      {/* Rooted Update */}
      <section className="section-padding" style={{ backgroundColor: '#000', position: 'relative' }}>
        <Atmosphere />
        <div className="container">
          <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div className="mobile-center">
              <span className="badge">Kootenay DNA</span>
              <h2 style={{ fontSize: 'var(--h2-size)', marginBottom: '2rem' }}>We live here. <br className="mobile-hide"/>We work here.</h2>
              <div style={{ fontSize: 'var(--p-size)', opacity: 0.8, lineHeight: 1.6, fontFamily: 'var(--font-sans)' }}>
                <p style={{ marginBottom: '2rem' }}>Reputation is everything here. Word spreads fast. One great site, and you own the area.</p>
                <p className="mobile-hide">We build for businesses like yours — not boardrooms in Toronto. If your cousin can't find you, neither can customers.</p>
              </div>
            </div>
            <div style={{ backgroundColor: '#111', padding: '3rem', border: '1px solid var(--primary)', borderRadius: '2px', boxShadow: '0 0 40px rgba(230, 126, 34, 0.05)' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}>The Kootenay Standard</h3>
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
            <Link 
              href="/dashboard/new"
              className="btn btn-primary" 
              style={{ padding: '1.8rem 4rem', fontSize: '1.5rem', fontWeight: 800, textDecoration: 'none' }}
            >
              GET MY SIGNAL CHECKED
            </Link>
            
            <button 
              className="btn btn-secondary" 
              style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}
              data-cal-link="kootenay-signal/30min"
              data-cal-namespace="30min"
              data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
            >
              OR BOOK A CALL
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
