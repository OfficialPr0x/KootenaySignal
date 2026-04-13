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
    <nav className="navbar" id="main-nav" style={{
      top: 0,
      left: 0,
      width: '100%',
      height: '90px',
      background: 'rgba(13, 17, 9, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(230, 126, 34, 0.2)',
      padding: '0 4rem',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          <Link href="/" className="nav-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Image 
              src="https://res.cloudinary.com/doajstql7/image/upload/v1775879112/ChatGPT_Image_Apr_10__2026__11_27_53_PM-removebg-preview_vjtdqa.png" 
              alt="Kootenay Signal Logo" 
              width={80}
              height={80}
              className="nav-logo-img"
              style={{ height: '60px', width: 'auto' }}
            />
            <div className="mobile-hide" style={{ marginLeft: '2rem', display: 'flex', flexDirection: 'column' }}>
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
                marginTop: '6px'
              }}>
                Dominate The Local Market
              </span>
            </div>
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          {/* Nav Links Container */}
          <div className="nav-links mobile-hide" style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
            <Show when="signed-out">
              <SignInButton>
                <button 
                  className="nav-link-premium"
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'white', 
                    fontSize: '0.8rem', 
                    fontWeight: 800, 
                    letterSpacing: '0.05em', 
                    opacity: 0.5,
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.3s'
                  }}
                >
                  Check My Signal
                </button>
              </SignInButton>
            </Show>

            <Show when="signed-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <Link 
                  href="/dashboard" 
                  style={{ 
                    color: 'var(--primary)', 
                    fontWeight: 900, 
                    fontSize: '0.8rem', 
                    letterSpacing: '0.05em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem'
                  }}
                >
                  <div className="pulse-dot" style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%' }} />
                  System Status: Active
                </Link>
                <UserButton appearance={{ variables: { colorPrimary: '#e67e22' } }} />
              </div>
            </Show>

            <Link href="/#founder" style={{ 
              color: 'white', 
              opacity: 0.5, 
              fontSize: '0.8rem', 
              fontWeight: 800, 
              letterSpacing: '0.05em',
              transition: 'opacity 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
            >
              Founder Story
            </Link>

            {/* Main CTA - Weaponized Industrial Button */}
            <button 
              data-cal-link="kootenay-signal/30min"
              style={{ 
                height: '48px',
                padding: '0 2.5rem',
                background: 'transparent',
                color: 'var(--primary)',
                border: '1px solid var(--primary)',
                fontSize: '0.8rem',
                fontWeight: 900,
                letterSpacing: '0.05em',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--primary)';
                e.currentTarget.style.color = 'black';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(230, 126, 34, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--primary)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Signal size={16} />
              Initiate Signal Boost
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
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div style={{ 
        position: 'fixed',
        top: '-20px',
        right: '-2rem',
        width: 'calc(100% + 4rem)',
        height: '100vh',
        background: 'rgba(13, 17, 9, 0.98)',
        zIndex: 1000,
        transform: isMenuOpen ? 'translateY(20px)' : 'translateY(-100%)',
        opacity: isMenuOpen ? 1 : 0,
        visibility: isMenuOpen ? 'visible' : 'hidden',
        transition: 'all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)',
        display: 'flex',
        flexDirection: 'column',
        padding: '8rem 4rem 4rem',
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '0.1rem' }}>Navigation</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <Show when="signed-out">
              <SignInButton>
                <button style={{ background: 'none', border: 'none', color: 'white', textAlign: 'left', fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-syne)' }}>Check My Signal</button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} style={{ color: 'white', fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-syne)' }}>Command Center</Link>
            </Show>
            <Link href="/#founder" onClick={() => setIsMenuOpen(false)} style={{ color: 'white', fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-syne)' }}>Founder Story</Link>
          </div>

          <div style={{ marginTop: 'auto' }}>
            <button 
              className="btn btn-primary" 
              data-cal-link="kootenay-signal/30min"
              onClick={() => setIsMenuOpen(false)}
              style={{ width: '100%', padding: '1.5rem', fontSize: '0.9rem', borderRadius: '4px', letterSpacing: '0.1rem' }}
            >
              Initiate Signal Boost
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
