'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { usePathname } from 'next/navigation';
import { Menu, X, Phone } from 'lucide-react';

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
    <nav className="navbar" id="main-nav" style={{
      top: 0,
      left: 0,
      width: '100%',
      height: '72px',
      background: 'rgba(13, 17, 9, 0.92)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
      padding: '0 clamp(1.5rem, 4vw, 4rem)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      transition: 'all 0.3s ease'
    }}>
      <div className="scroll-progress" style={{ width: `${scroll}%`, height: '2px', bottom: '-1px' }}></div>
      
      <div style={{ 
        width: '100%', 
        maxWidth: '1400px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        {/* ─── Left: Logo + Brand ─── */}
        <Link href="/" className="nav-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Image 
            src="https://res.cloudinary.com/doajstql7/image/upload/v1775879112/ChatGPT_Image_Apr_10__2026__11_27_53_PM-removebg-preview_vjtdqa.png" 
            alt="Kootenay Signal Logo" 
            width={80}
            height={80}
            className="nav-logo-img"
            style={{ height: '48px', width: 'auto' }}
          />
          <div className="mobile-hide" style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <span style={{ 
              fontSize: '0.9rem', 
              fontWeight: 900, 
              color: 'var(--primary)', 
              letterSpacing: '0.15em',
              lineHeight: 1
            }}>
              Kootenay Signal
            </span>
            <span style={{ 
              fontSize: '0.8rem', 
              fontWeight: 300, 
              color: 'white', 
              opacity: 0.3,
            }}>
              More Business. Guaranteed.
            </span>
          </div>
        </Link>

        {/* ─── Right: Nav items — single clean row ─── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          
          {/* Desktop nav links */}
          <div className="nav-links mobile-hide" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Show when="signed-out">
              <SignInButton>
                <button className="nav-item-btn">
                  Sign In
                </button>
              </SignInButton>
            </Show>

            <Show when="signed-in">
              <Link href="/dashboard" className="nav-item-link">
                Dashboard
              </Link>
            </Show>

            <Link href="/#about" className="nav-item-link">
              About
            </Link>

            {/* Divider */}
            <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.08)', margin: '0 0.75rem' }} />

            <Show when="signed-in">
              <UserButton appearance={{ variables: { colorPrimary: '#e67e22' } }} />
              <div style={{ width: '0.5rem' }} />
            </Show>

            {/* Primary CTA */}
            <button 
              className="nav-cta"
              data-cal-link="kootenay-signal/30min"
            >
              LET&apos;S TALK
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
              zIndex: 1001
            }}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* ─── Mobile Menu Overlay ─── */}
      <div style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100dvh',
        background: 'rgba(7, 10, 5, 0.98)',
        zIndex: 1000,
        transform: isMenuOpen ? 'translateY(0)' : 'translateY(-100%)',
        opacity: isMenuOpen ? 1 : 0,
        visibility: isMenuOpen ? 'visible' : 'hidden',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '4rem 3rem',
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <Show when="signed-out">
            <SignInButton>
              <button style={{ 
                background: 'none', border: 'none', color: 'white', textAlign: 'left', 
                fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-syne)',
                cursor: 'pointer', padding: '0.5rem 0',
                opacity: 0.7, transition: 'opacity 0.3s'
              }}>Sign In</button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <Link 
              href="/dashboard" 
              onClick={() => setIsMenuOpen(false)} 
              style={{ 
                color: 'white', fontSize: '2rem', fontWeight: 800, 
                fontFamily: 'var(--font-syne)', padding: '0.5rem 0',
                opacity: 0.7, transition: 'opacity 0.3s'
              }}
            >Dashboard</Link>
          </Show>
          <Link 
            href="/#about" 
            onClick={() => setIsMenuOpen(false)} 
            style={{ 
              color: 'white', fontSize: '2rem', fontWeight: 800, 
              fontFamily: 'var(--font-syne)', padding: '0.5rem 0',
              opacity: 0.7, transition: 'opacity 0.3s'
            }}
          >About</Link>
          
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '1rem 0' }} />

          <button 
            className="btn btn-primary" 
            data-cal-link="kootenay-signal/30min"
            onClick={() => setIsMenuOpen(false)}
            style={{ 
              width: '100%', padding: '1.25rem', fontSize: '1rem', 
              borderRadius: '4px', letterSpacing: '0.1em', fontWeight: 900
            }}
          >
            LET&apos;S TALK
          </button>
        </div>
      </div>
    </nav>
  );
}
