'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [scroll, setScroll] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScroll((currentScroll / totalScroll) * 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide navbar on auth pages
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
      </Link>
      <div className="nav-links">
        <Show when="signed-out">
          <SignInButton>
            <button 
              className="nav-link" 
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                fontWeight: 600,
                color: 'var(--foreground)',
                opacity: 0.8,
                letterSpacing: '0.1em',
                transition: 'opacity 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
            >
              SIGN IN
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.75rem', fontWeight: 800 }}>GET STARTED</button>
          </SignUpButton>
        </Show>
        
        <Show when="signed-in">
          <Link 
            href="/dashboard" 
            style={{ 
              color: '#e67e22', 
              fontWeight: 700, 
              fontSize: '0.75rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em', 
              textDecoration: 'none',
              marginRight: '0.5rem',
            }}
          >
            SIGNAL CHECK
          </Link>
          <div style={{ marginRight: '1rem', display: 'flex', alignItems: 'center' }}>
            <UserButton appearance={{ 
              variables: {
                colorPrimary: '#e67e22',
                colorText: '#ffffff',
                colorBackground: '#0d1109',
                colorInputBackground: '#11140e',
                colorInputText: '#ffffff',
                fontFamily: 'var(--font-pjs)'
              },
              elements: { 
                userButtonAvatarBox: { 
                  width: '40px', 
                  height: '40px', 
                  border: '2px solid var(--primary)',
                  boxShadow: '0 0 15px rgba(230, 126, 34, 0.3)',
                  transition: 'all 0.3s ease'
                },
                userButtonPopoverCard: {
                  backgroundColor: '#0d1109',
                  border: '1px solid rgba(255,255,255,0.05)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                  borderRadius: '4px'
                },
                userButtonPopoverActionButton: {
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(230, 126, 34, 0.1)',
                    color: 'var(--primary)'
                  }
                },
                userButtonPopoverActionButtonIcon: {
                  color: 'var(--primary)'
                },
                userButtonPopoverActionButtonText: {
                  fontFamily: 'var(--font-pjs)',
                  fontWeight: 600,
                  color: 'white'
                },
                userButtonPopoverFooter: {
                  display: 'none'
                },
                userPreviewMainIdentifier: {
                  color: 'white',
                  fontFamily: 'var(--font-syne)',
                  fontWeight: 800
                },
                userPreviewSecondaryIdentifier: {
                  color: 'rgba(255,255,255,0.4)',
                  fontFamily: 'var(--font-pjs)'
                }
              } 
            }} />
          </div>
        </Show>

        <button 
          className="btn" 
          data-cal-link="kootenay-signal/30min"
          data-cal-namespace="30min"
          data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
          style={{ 
            padding: '0.75rem 2rem',
            fontSize: '0.75rem',
            fontWeight: 800,
            fontFamily: 'var(--font-syne)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            background: 'transparent',
            border: '1px solid var(--primary)',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--primary)';
            e.currentTarget.style.boxShadow = '0 0 25px rgba(230, 126, 34, 0.4)';
            e.currentTarget.style.color = 'black';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.color = 'white';
          }}
        >
          Start My Signal Boost
        </button>
      </div>
    </nav>
  );
}
