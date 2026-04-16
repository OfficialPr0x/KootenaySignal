'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  TrendingUp,
  CheckSquare,
  MessageCircle,
  Home,
  RefreshCw,
} from 'lucide-react';
import { useState } from 'react';

interface Props {
  hasSite: boolean;
  siteName: string;
  children: React.ReactNode;
}

export default function DashboardShell({ hasSite, siteName, children }: Props) {
  const pathname = usePathname();
  const [scanning, setScanning] = useState(false);
  const [scanMsg, setScanMsg] = useState('');

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { href: '/dashboard/rankings', label: 'Rankings & SEO', icon: <TrendingUp size={18} /> },
    { href: '/dashboard/actions', label: 'Action Items', icon: <CheckSquare size={18} /> },
    { href: '/dashboard/advisor', label: 'AI Advisor', icon: <MessageCircle size={18} /> },
  ];

  async function handleScan() {
    setScanning(true);
    setScanMsg('');
    try {
      const res = await fetch('/api/sites/scan', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        setScanMsg(data.error || 'Scan failed');
      } else {
        setScanMsg('Scan complete! Refreshing…');
        window.location.reload();
      }
    } catch {
      setScanMsg('Scan failed. Try again.');
    } finally {
      setScanning(false);
    }
  }

  // If no site, show onboarding — no sidebar
  if (!hasSite) {
    return (
      <div className="dash-shell">
        <div className="dash-inner" style={{ maxWidth: '700px' }}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="dash-shell dash-shell--with-sidebar">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-sidebar-brand">
          <Link href="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h2><span style={{ color: '#e67e22' }}>Signal</span> Dashboard</h2>
          </Link>
          <p className="dash-sidebar-site">{siteName}</p>
        </div>

        <nav className="dash-sidebar-nav">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`dash-sidebar-link ${pathname === item.href ? 'dash-sidebar-link--active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="dash-sidebar-bottom">
          <button
            className="dash-scan-btn"
            onClick={handleScan}
            disabled={scanning}
          >
            <RefreshCw size={14} className={scanning ? 'dash-spin' : ''} />
            <span>{scanning ? 'Scanning…' : 'Run New Scan'}</span>
          </button>
          {scanMsg && <p className="dash-scan-msg">{scanMsg}</p>}

          <Link href="/" className="dash-sidebar-home">
            <Home size={14} />
            <span>Back to Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dash-main">
        {children}
      </main>
    </div>
  );
}
