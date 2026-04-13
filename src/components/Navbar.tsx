'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronRight, Signal } from 'lucide-react';

export default function Navbar() {
  const [scroll, setScroll] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScroll((currentScroll / docHeight) * 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  // Close menu on navigation
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  if (pathname === '/sign-in' || pathname === '/sign-up' || pathname.startsWith('/sign-in/') || pathname.startsWith('/sign-up/')) {
    return null;
  }

  return (
    <nav className="navbar" id="main-nav">
      <div className="scroll-progress" style={{ width: `${scroll}%` }}></div>
      
      <Link href="/" className="nav-logo" style={{ textDecoration: 'none' }}>
        <Image 
          src="https://res.cloudinary.com/doajstql7/image/upload/v1775879112/ChatGPT_Image_Apr_10__2026__11_27_53_PM-removebg-preview_vjtdqa.png" 
          alt="Kootenay Signal Logo" 
          width={120}
          height={120}
          className="nav-logo-img"
          style={{ transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
        <div className="mobile-hide" style={{ marginLeft: '1.5rem', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '1.5rem' }}>
          <span style={{ 
            fontSize: '0.85rem', 
            fontWeight: 500, 
            color: 'var(--foreground)', 
            opacity: 0.5,
            whiteSpace: 'nowrap',
            fontFamily: 'var(--font-serif)',
            display: 'block',
            letterSpacing: '0.05em'
          }}>
            THE KOOTENAY SIGNAL
          </span>
        </div>
      </Link>

      {/* Desktop Links */}
      <div className="nav-links mobile-hide">
        <Show when="signed-out">
          <SignInButton>
            <button className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', opacity: 0.8 }}>SIGN IN</button>
          </SignInButton>
          <SignUpButton>
            <button className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.75rem', fontWeight: 800 }}>GET STARTED</button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <Link href="/dashboard" style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', marginRight: '1rem' }}>SIGNAL CHECK</Link>
          <UserButton appearance={{ variables: { colorPrimary: '#e67e22' } }} />
        </Show>
        <button 
          className="btn" 
          data-cal-link="kootenay-signal/30min"
          style={{ 
            padding: '0.7rem 1.8rem',
            fontSize: '0.75rem',
            fontWeight: 900,
            background: 'transparent',
            border: '1px solid var(--primary)',
            color: 'white'
          }}
        >
          START MY SIGNAL BOOST
        </button>
      </div>

      {/* Mobile Toggle */}
      <button 
        className="lg-hide-only"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        style={{ 
          background: 'none', 
          border: 'none', 
          color: 'var(--primary)',
          cursor: 'pointer',
          padding: '0.5rem',
          zIndex: 1001,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
      </button>

      {/* Mobile Menu Overlay */}
      <div style={{ 
        position: 'fixed',
        top: 0,
        right: 0,
        width: '100%',
        height: '100vh',
        background: '#0d1109',
        zIndex: 1000,
        transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)',
        display: 'flex',
        flexDirection: 'column',
        padding: '8rem 2rem 4rem'
      }}>
        {/* Decorative Grid */}
        <div style={{ 
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(230, 126, 34, 0.05) 0%, transparent 70%)',
          opacity: 0.5,
          pointerEvents: 'none'
        }}></div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Navigation Menu</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <Show when="signed-out">
              <SignInButton>
                <button style={{ background: 'none', border: 'none', color: 'white', textAlign: 'left', fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-syne)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  Sign In <ChevronRight size={20} opacity={0.3} />
                </button>
              </SignInButton>
              <SignUpButton>
                <button style={{ background: 'none', border: 'none', color: 'var(--primary)', textAlign: 'left', fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-syne)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  Register Account <ChevronRight size={20} opacity={0.3} />
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Link 
                href="/dashboard" 
                onClick={() => setIsMenuOpen(false)}
                style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-syne)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                Command Center <ChevronRight size={20} opacity={0.3} />
              </Link>
            </Show>
            
            <Link 
              href="/#founder" 
              onClick={() => setIsMenuOpen(false)}
              style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-syne)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              The Founder <ChevronRight size={20} opacity={0.3} />
            </Link>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
            <button 
              className="btn btn-primary" 
              data-cal-link="kootenay-signal/30min"
              onClick={() => setIsMenuOpen(false)}
              style={{ width: '100%', padding: '1.25rem', fontSize: '0.85rem', borderRadius: '4px' }}
            >
              Start My Signal Boost
            </button>
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.65rem', opacity: 0.3, letterSpacing: '0.1em' }}>© 2026 KOOTENAY SIGNAL. ALL RIGHTS RESERVED.</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
