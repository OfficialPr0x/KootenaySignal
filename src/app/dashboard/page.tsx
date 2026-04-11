import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import Link from 'next/link';

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const audits = await prisma.audit.findMany({
    where: { clerkUserId: userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      businessName: true,
      websiteUrl: true,
      city: true,
      industry: true,
      status: true,
      signalScore: true,
      createdAt: true,
    },
  });

  function getScoreColor(score: number | null) {
    if (score === null) return 'rgba(255,255,255,0.3)';
    if (score >= 70) return '#27ae60';
    if (score >= 40) return '#e67e22';
    return '#c0392b';
  }

  function getStatusLabel(status: string) {
    const labels: Record<string, string> = {
      queued: '⏳ Queued',
      crawling: '🔍 Crawling...',
      enriching: '📊 Enriching...',
      analyzing: '🤖 Analyzing...',
      complete: '✅ Complete',
      failed: '❌ Failed',
    };
    return labels[status] || status;
  }

  return (
    <div>
      {audits.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📡</div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', fontFamily: 'var(--font-syne)' }}>
            No Signal Checks Yet
          </h2>
          <p style={{ opacity: 0.6, marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
            Run your first free AI-powered Signal Check to see how your business performs online.
          </p>
          <Link 
            href="/dashboard/new" 
            style={{ 
              display: 'inline-flex',
              padding: '1rem 2.5rem', 
              background: '#e67e22', 
              color: '#fff', 
              borderRadius: '4px', 
              fontWeight: 700, 
              fontSize: '1rem', 
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            Run My First Signal Check
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {audits.map((audit) => (
            <Link 
              key={audit.id} 
              href={audit.status === 'complete' ? `/dashboard/report/${audit.id}` : '#'}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.5rem 2rem',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '4px',
                cursor: audit.status === 'complete' ? 'pointer' : 'default',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                if (audit.status === 'complete') (e.currentTarget as HTMLElement).style.borderColor = 'rgba(230,126,34,0.3)';
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.05)';
              }}
              >
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    {audit.businessName}
                  </h3>
                  <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>
                    {audit.websiteUrl} {audit.city && `• ${audit.city}`} {audit.industry && `• ${audit.industry}`}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>
                    {getStatusLabel(audit.status)}
                  </span>
                  {audit.signalScore !== null && (
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      border: `3px solid ${getScoreColor(audit.signalScore)}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '1rem',
                      fontFamily: 'var(--font-syne)',
                      color: getScoreColor(audit.signalScore),
                    }}>
                      {audit.signalScore}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
