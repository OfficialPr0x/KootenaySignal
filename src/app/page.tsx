'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
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
          <div style={{ marginLeft: '2rem', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '2rem' }}>
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
          <Link href="tel:+12505550123" className="nav-link" style={{ fontWeight: 700 }}>(250) 555-0123</Link>
          <Link 
            href="#contact" 
            className="btn btn-outline" 
            style={{ 
              padding: '0.5rem 1.5rem',
            }}
          >
            Start My Signal Boost
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" style={{
        backgroundImage: `linear-gradient(to bottom, rgba(13, 17, 9, 0.4), rgba(13, 17, 9, 0.95)), url('https://res.cloudinary.com/doajstql7/image/upload/v1775879081/Elk_Valley_sunset_workshop_scene_gvwak0.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
      }}>
        <div className="container">
          <div className="hero-content">
            <h1 style={{ 
              lineHeight: 0.95,
              maxWidth: '1000px',
              color: '#fff',
              textShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}>
              If Locals Don’t Know You… <br/>
              <span style={{ color: 'var(--primary)' }}>You Don’t Exist.</span>
            </h1>

            <p style={{ 
              fontSize: '1.5rem', 
              maxWidth: '650px', 
              marginBottom: '3rem',
              color: '#fff',
              lineHeight: 1.4,
              fontWeight: 400
            }}>
              We put Kootenay businesses on the map—and keep them there. 
              More calls. Better jobs. <span style={{ fontWeight: 700 }}>No city agency bullshit.</span>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ 
                display: 'flex', 
                gap: '1.5rem', 
                flexWrap: 'wrap',
              }}>
                <Link href="#contact" className="btn btn-primary" id="btn-cta-hero" style={{ padding: '1.2rem 2.5rem', fontSize: '1.2rem' }}>
                  GET MY SIGNAL CHECKED
                </Link>
                <Link href="#locals" className="btn btn-outline" style={{ padding: '1.2rem 2.5rem', fontSize: '1.2rem' }}>
                  SEE LOCAL RESULTS »
                </Link>
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                color: 'var(--primary)', 
                fontWeight: 700,
                fontSize: '0.9rem',
                letterSpacing: '0.05em'
              }}>
                <span style={{ backgroundColor: 'var(--primary)', color: '#000', padding: '2px 6px', borderRadius: '2px' }}>⚠️ SCARCITY</span>
                We only work with 3–5 businesses per trade, per area.
              </div>
            </div>
          </div>
        </div>

      {/* Operational Territory Bar */}
      <div style={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        width: '100%',
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '1.25rem 0',
        zIndex: 5,
      }}>
        <div className="container" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          gap: '2.5rem',
          flexWrap: 'wrap',
          opacity: 0.8,
          fontSize: '0.75rem', 
          fontWeight: 800, 
          textTransform: 'uppercase', 
          letterSpacing: '0.25em',
          color: 'var(--foreground)'
        }}>
          <span style={{ color: 'var(--primary)', opacity: 1 }}>📡 PRIMARY SIGNAL:</span>
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

      {/* Call-Out Section (Urgency) */}
      <section style={{ backgroundColor: 'var(--primary)', color: '#000', padding: '8rem 0' }}>
        <div className="container">
          <div style={{ maxWidth: '900px' }}>
            <h2 style={{ fontSize: 'max(4vw, 3rem)', color: '#000', marginBottom: '2.5rem', lineHeight: 1, fontFamily: 'var(--font-syne)', fontWeight: 800 }}>
              You’re Losing Jobs. <br/>You Just Don’t See It.
            </h2>
            <div style={{ fontSize: '1.8rem', lineHeight: 1.4, fontWeight: 500, fontFamily: 'var(--font-pjs)' }}>
              <p style={{ marginBottom: '1.5rem' }}>Someone searched your service yesterday. They didn’t find you.</p>
              <p style={{ marginBottom: '1.5rem' }}>They found someone worse.</p>
              <p style={{ opacity: 0.8 }}>That job is gone.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overhaul */}
      <section id="services" style={{ padding: '10rem 0', backgroundColor: '#0a0d07' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '6rem' }}>
            <span className="badge">Weaponized Systems</span>
            <h2 style={{ fontSize: '4rem' }}>We Build Signal — Not Just Sites</h2>
          </div>
          
          <div style={{ 
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

      {/* KOOTENAY BROADCAST™ SECTION */}
      <section id="broadcast" style={{ padding: '10rem 0', backgroundColor: '#0d1109', position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
            <span className="badge" style={{ borderColor: 'var(--primary)', color: 'var(--primary)', opacity: 1 }}>
              Attention Layer: ACTIVE
            </span>
            <h2 style={{ fontSize: 'max(5vw, 4rem)', lineHeight: 0.9, marginBottom: '1.5rem', fontFamily: 'var(--font-syne)' }}>
              Kootenay Broadcast™
            </h2>
            <p style={{ fontSize: '1.5rem', opacity: 0.8, fontFamily: 'var(--font-pjs)' }}>
              Your business — seen where locals actually look.
            </p>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h3 style={{ fontSize: '2.5rem', maxWidth: '800px', margin: '0 auto', lineHeight: 1.2 }}>
              If they’re driving, scrolling, or waiting — <br/>
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
            marginBottom: '10rem',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
            backgroundColor: '#000'
          }}>
            <div style={{ 
              position: 'absolute', 
              inset: 0, 
              backgroundImage: `url('https://res.cloudinary.com/doajstql7/image/upload/v1775884538/ChatGPT_Image_Apr_11_2026_01_13_00_AM_hx4ibt.png')`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }} />
            
            {/* Aesthetic Glow Overlays */}
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, transparent 20%, rgba(13, 17, 9, 1) 95%)', pointerEvents: 'none' }} />
            
            <div style={{ position: 'absolute', top: '15%', right: '15%', background: 'rgba(0,0,0,0.8)', padding: '0.6rem 1.2rem', borderRadius: '2px', border: '1px solid var(--primary)', fontSize: '0.8rem', letterSpacing: '0.2em', fontWeight: 800, textTransform: 'uppercase', zIndex: 10 }}>
              Live Broadcast Coverage
            </div>

            {/* Overlay Tags - Recalibrated for 16:9 center */}
            <div className="signal-pulse" style={{ position: 'absolute', top: '40%', left: '55%' }}>
              <div style={{ background: 'var(--primary)', color: '#000', padding: '0.4rem 1rem', borderRadius: '2px', fontSize: '0.75rem', fontWeight: 800, transform: 'translate(25px, -15px)', whiteSpace: 'nowrap' }}>HIGH TRAFFIC ZONE</div>
            </div>
            
            <div className="signal-pulse" style={{ position: 'absolute', top: '55%', left: '58%' }}>
              <div style={{ background: 'rgba(0,0,0,0.9)', color: '#fff', padding: '0.4rem 1rem', borderRadius: '2px', fontSize: '0.75rem', border: '1px solid var(--primary)', transform: 'translate(25px, -15px)', whiteSpace: 'nowrap' }}>REPEAT VISIBILITY AREA</div>
            </div>

            <div className="signal-pulse" style={{ position: 'absolute', top: '65%', left: '35%' }}>
              <div style={{ background: 'rgba(0,0,0,0.9)', color: '#fff', padding: '0.4rem 1rem', borderRadius: '2px', fontSize: '0.75rem', border: '1px solid var(--primary)', transform: 'translate(25px, -15px)', whiteSpace: 'nowrap' }}>DAILY EXPOSURE ROUTE</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '6rem', marginBottom: '10rem' }}>
            <div>
              <p style={{ fontSize: '1.4rem', lineHeight: 1.6, fontFamily: 'var(--font-pjs)', marginBottom: '3rem' }}>
                We don’t run ads. <br/>
                <b>We place your business into the real-world flow of the Kootenays.</b>
              </p>
              <div style={{ opacity: 0.7, fontSize: '1.1rem', fontStyle: 'italic', borderLeft: '2px solid var(--primary)', paddingLeft: '1.5rem' }}>
                The same roads. The same stops. The same places everyone passes through every day.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>🚧 Highway Presence</h4>
                <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>On the drive into town — before they even think to search.</p>
              </div>
              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>🏙️ In-Town Screens</h4>
                <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Where locals stop, wait, and look around.</p>
              </div>
              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>📱 Digital Reinforcement</h4>
                <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>They saw you earlier — now you show up again on their phone.</p>
              </div>
              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>🔁 Repeat Exposure</h4>
                <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Not once. Not twice. Enough that they remember you.</p>
              </div>
            </div>
          </div>

          <div style={{ background: '#111', padding: '6rem 4rem', border: '1px solid rgba(255,255,255,0.05)' }}>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem', alignItems: 'center' }}>
               <div>
                 <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>The Impact of Total Local Presence</h2>
                 <ul style={{ listStyle: 'none', padding: 0, fontSize: '1.2rem', lineHeight: 1.8 }}>
                   <li style={{ marginBottom: '1rem' }}>✅ People recognize your name before calling</li>
                   <li style={{ marginBottom: '1rem' }}>✅ You feel “bigger” than competitors instantly</li>
                   <li style={{ marginBottom: '1rem' }}>✅ You stop explaining who you are</li>
                   <li>✅ You start getting chosen</li>
                 </ul>
               </div>
               <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.05)', paddingLeft: '4rem' }}>
                 <p style={{ fontSize: '1.3rem', marginBottom: '2.5rem', opacity: 0.8 }}>
                   "Businesses inside the Broadcast don’t compete the same way anymore."
                 </p>
                 <div style={{ background: '#000', padding: '3rem', border: '2px solid var(--primary)' }}>
                   <h3 style={{ marginBottom: '1rem' }}>Ready to Be Seen Everywhere?</h3>
                   <p style={{ marginBottom: '2rem', opacity: 0.7, fontSize: '0.9rem' }}>One business per category, per area. No exceptions.</p>
                   <Link href="#contact" className="btn btn-primary" style={{ width: '100%' }}>
                     START MY BROADCAST
                   </Link>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Local Proof Engine */}
      <section style={{ backgroundColor: 'var(--secondary)', padding: '10rem 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <span className="badge">Results Over Features</span>
            <h2 style={{ fontSize: '4rem' }}>What Happens When Your Signal Goes Up</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '4rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '6rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>+42%</div>
              <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700, marginTop: '1rem', opacity: 0.8 }}>Avg. Increase in Calls</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '6rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>3 WKS</div>
              <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700, marginTop: '1rem', opacity: 0.8 }}>Booked Out Lead Time</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '6rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>0</div>
              <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700, marginTop: '1rem', opacity: 0.8 }}>Budget Tire Kickers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rooted update */}
      <section style={{ padding: '10rem 0', backgroundColor: '#000' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '6rem', alignItems: 'center' }}>
            <div>
              <span className="badge">Kootenay DNA</span>
              <h2 style={{ fontSize: '4rem', marginBottom: '2rem' }}>We live here. <br/>We work here.</h2>
              <div style={{ fontSize: '1.3rem', opacity: 0.8, lineHeight: 1.6, fontFamily: 'var(--font-pjs)' }}>
                <p style={{ marginBottom: '2rem' }}>Reputation is everything in the Kootenays. This isn't Vancouver—word spreads fast. One bad website, and people move on. One great one, and you own the area.</p>
                <p>We build for businesses like yours — not boardrooms in Toronto. If your cousin can't find your business on Google, neither can your customers.</p>
              </div>
            </div>
            <div style={{ backgroundColor: '#111', padding: '4rem', border: '1px solid var(--primary)', borderRadius: '2px' }}>
              <h3 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--primary)', fontFamily: 'var(--font-syne)' }}>The Kootenay Standard</h3>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '1.2rem' }}>
                <li style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--primary)' }}>✅</span> <b>Sparwood Based</b>
                </li>
                <li style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--primary)' }}>✅</span> <b>On-Site Strategy Meetings</b>
                </li>
                <li style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--primary)' }}>✅</span> <b>Direct Cell Access (No Queues)</b>
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
      <section id="locals" style={{ padding: '10rem 0', background: '#0a0d07', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '6rem' }}>
            <span className="badge">Field Reports</span>
            <h2 style={{ fontSize: '4rem' }}>Captured Signals & Local Wins</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '3rem' }}>
            <div style={{ padding: '4rem 3rem', background: 'rgba(255,255,255,0.02)', position: 'relative', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ position: 'absolute', top: '2rem', left: '2rem', fontSize: '6rem', color: 'var(--primary)', opacity: 0.1, fontFamily: 'var(--font-serif)' }}>"</span>
              <p style={{ fontSize: '1.4rem', marginBottom: '2.5rem', lineHeight: 1.5, position: 'relative', zIndex: 1, fontFamily: 'var(--font-pjs)' }}>
                "Since implementing **SearchLock™**, we've seen a 40% increase in calls from Elk Valley residents. They actually understand our market. We're booked out for months."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '1px', background: 'var(--primary)' }}></div>
                <div style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.9rem' }}>Fernie Custom Cabinets</div>
              </div>
            </div>
            <div style={{ padding: '4rem 3rem', background: 'rgba(255,255,255,0.02)', position: 'relative', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ position: 'absolute', top: '2rem', left: '2rem', fontSize: '6rem', color: 'var(--primary)', opacity: 0.1, fontFamily: 'var(--font-serif)' }}>"</span>
              <p style={{ fontSize: '1.4rem', marginBottom: '2.5rem', lineHeight: 1.5, position: 'relative', zIndex: 1, fontFamily: 'var(--font-pjs)' }}>
                "Our previous agency was generic. Kootenay Signal is built different. The **GhostOps AI™** follow-ups have saved us thousands in missed jobs already."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '1px', background: 'var(--primary)' }}></div>
                <div style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.9rem' }}>Elkford Mechanical</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitor Pressure */}
      <section style={{ padding: '8rem 0', backgroundColor: '#620000', color: '#fff', borderTop: '4px solid #8b0000' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '900px' }}>
          <h2 style={{ fontSize: 'max(4vw, 3rem)', color: '#fff', marginBottom: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-syne)' }}>
            Your Competitor Might Call Us First.
          </h2>
          <p style={{ fontSize: '1.8rem', marginBottom: '2rem', fontWeight: 500 }}>
            And if they do — we <span style={{ textDecoration: 'underline' }}>won’t</span> work with you.
          </p>
          <div style={{ opacity: 0.8, fontSize: '1.1rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            We protect our clients' territory. Period.
          </div>
        </div>
      </section>

      {/* Final Conversion Section */}
      <section id="contact" style={{ padding: '12rem 0', backgroundColor: '#0d1109' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '900px' }}>
          <span className="badge" style={{ marginBottom: '2rem' }}>Ready to Win?</span>
          <h2 style={{ fontSize: 'max(5vw, 4rem)', lineHeight: 0.9, marginBottom: '3rem', fontFamily: 'var(--font-syne)' }}>
            Let’s Look at Your Business Together.
          </h2>
          <p style={{ fontSize: '1.6rem', marginBottom: '4rem', opacity: 0.8, fontFamily: 'var(--font-pjs)' }}>
            No pitch. I’ll show you exactly where you’re losing work.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
            <Link href="tel:+12505550123" className="btn btn-primary" style={{ padding: '1.8rem 4rem', fontSize: '1.5rem', fontWeight: 800 }}>
              GET MY SIGNAL CHECKED
            </Link>
            
            <div style={{ fontSize: '1.3rem', fontWeight: 600 }}>
              Or text us at <a href="sms:+12505550123" style={{ color: 'var(--primary)' }}>(250) 555-0123</a>
            </div>
          </div>

          <div style={{ marginTop: '8rem', fontSize: '0.9rem', opacity: 0.5, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700 }}>
            Kootenay Signal — If they can't find you, they're not hiring you.
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '4rem 0', background: '#000', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ opacity: 0.5, fontSize: '0.8rem', letterSpacing: '0.1em' }}>
            &copy; {new Date().getFullYear()} KOOTENAY SIGNAL AGENCY • BASED IN SPARWOOD, BC • SERVING THE ELK VALLEY
          </p>
        </div>
      </footer>
    </main>
  );
}
