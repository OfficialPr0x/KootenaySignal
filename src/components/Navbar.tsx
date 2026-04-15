'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SignInButton, Show, UserButton } from "@clerk/nextjs";
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
          width={140}
          height={140}
          className="nav-logo-img"
        />
        <div className="mobile-hide" style={{ marginLeft: '1.25rem', borderLeft: '1px solid rgba(255,255,255,0.12)', paddingLeft: '1.25rem' }}>
          <span style={{ 
            fontSize: '1.1rem', 
            fontWeight: 400, 
            fontStyle: 'italic',
            color: 'var(--foreground)', 
            opacity: 0.6,
            whiteSpace: 'nowrap',
            fontFamily: 'var(--font-serif)',
            display: 'block'
          }}>
            The Kootenay&apos;s Go-To For More Business
          </span>
        </div>
      </Link>
      <div className="nav-links">
        <Show when="signed-out">
          <Link
            href="/signal-check"
            className="nav-link-signal"
          >
            FREE SIGNAL CHECK
          </Link>
          <SignInButton>
            <button className="nav-get-started">GET STARTED</button>
          </SignInButton>
        </Show>
        
        <Show when="signed-in">
          <Link
            href="/signal-check"
            className="nav-link-signal"
          >
            FREE SIGNAL CHECK
          </Link>
          <Link 
            href="/dashboard" 
            className="nav-link-dash"
          >
            DASHBOARD
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
          className="nav-cta" 
          data-cal-link="kootenay-signal/30min"
          data-cal-namespace="30min"
          data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
        >
          Book a Call
        </button>
      </div>
    </nav>
  );
}
