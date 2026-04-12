import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="dash-shell">
      <div className="dash-inner">
        <div className="dash-header">
          <div className="dash-brand">
            <Link href="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h1>
                <span style={{ color: '#e67e22' }}>Kootenay</span> Signal Check
              </h1>
            </Link>
            <p>Your business signal — loud and clear</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link
              href="/"
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
              }}
            >
              ← Home
            </Link>
            <Link href="/dashboard/new" className="dash-new-btn">
              <span>+ Run New Check</span>
            </Link>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
