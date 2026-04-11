import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d1109', paddingTop: '100px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
          <div>
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f4ece1', fontFamily: 'var(--font-syne)' }}>
                <span style={{ color: '#e67e22' }}>Kootenay</span> Signal Check
              </h1>
            </Link>
            <p style={{ fontSize: '0.8rem', opacity: 0.5, marginTop: '0.25rem' }}>Free AI-Powered Signal Audit</p>
          </div>
          <Link 
            href="/dashboard/new" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.7rem 1.5rem', 
              background: '#e67e22', 
              color: '#fff', 
              borderRadius: '4px', 
              fontWeight: 700, 
              fontSize: '0.8rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              textDecoration: 'none',
            }}
          >
            + New Audit
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
