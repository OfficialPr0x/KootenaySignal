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

        {/* Town Strip */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '3rem',
          opacity: 0.5,
          fontSize: '0.8rem',
          textTransform: 'uppercase',
          letterSpacing: '0.3em',
          fontWeight: 700,
          whiteSpace: 'nowrap',
          width: '100%',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          {towns.concat(towns).map((town, i) => (
            <span key={i}>{town}</span>
          ))}
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
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="service-card" style={{ padding: '4rem 2rem', background: 'var(--secondary)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--primary)', opacity: 0.2, display: 'block', marginBottom: '1rem' }}>01</span>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>SignalForge™</h3>
              <p style={{ opacity: 0.8, fontSize: '1.1rem', lineHeight: 1.6 }}>
                Build your signal foundation. High-conversion lead engines that capture every local lead.
              </p>
            </div>
            <div className="service-card" style={{ padding: '4rem 2rem', background: 'var(--secondary)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--primary)', opacity: 0.2, display: 'block', marginBottom: '1rem' }}>02</span>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>SearchLock™</h3>
              <p style={{ opacity: 0.8, fontSize: '1.1rem', lineHeight: 1.6 }}>
                Own local search permanently. Google, Maps, and Local Search — locked in.
              </p>
            </div>
            <div className="service-card" style={{ padding: '4rem 2rem', background: 'var(--secondary)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--primary)', opacity: 0.2, display: 'block', marginBottom: '1rem' }}>03</span>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>GhostOps AI™</h3>
              <p style={{ opacity: 0.8, fontSize: '1.1rem', lineHeight: 1.6 }}>
                Never miss money again. Automated follow-ups, bookings, and missed call handling.
              </p>
            </div>
            <div className="service-card" style={{ padding: '4rem 2rem', background: 'var(--secondary)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--primary)', opacity: 0.2, display: 'block', marginBottom: '1rem' }}>04</span>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Kootenay Broadcast™</h3>
              <p style={{ opacity: 0.8, fontSize: '1.1rem', lineHeight: 1.6 }}>
                Be seen everywhere that matters. High-impact local awareness and signal boosting.
              </p>
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
