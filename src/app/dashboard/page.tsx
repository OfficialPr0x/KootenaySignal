import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getSupabase } from '@/lib/db';
import Link from 'next/link';

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  let auditList: Array<{
    id: string;
    business_name: string;
    website_url: string;
    city: string | null;
    industry: string | null;
    status: string;
    signal_score: number | null;
    created_at: string;
  }> = [];

  try {
    const supabase = getSupabase();
    const { data: audits, error } = await supabase
      .from('audits')
      .select('id, business_name, website_url, city, industry, status, signal_score, created_at')
      .eq('clerk_user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase query error:', error);
    }
    auditList = audits ?? [];
  } catch (err) {
    console.error('Dashboard DB error:', err);
  }

  function getScoreColor(score: number | null) {
    if (score === null) return 'rgba(255,255,255,0.15)';
    if (score >= 70) return '#27ae60';
    if (score >= 40) return '#e67e22';
    return '#c0392b';
  }

  function getStatusClass(status: string) {
    if (status === 'complete') return 'dash-card-status--complete';
    if (status === 'failed') return 'dash-card-status--failed';
    if (status === 'queued') return 'dash-card-status--queued';
    return 'dash-card-status--running';
  }

  function getStatusLabel(status: string) {
    const labels: Record<string, string> = {
      queued: 'Queued',
      crawling: 'Crawling…',
      enriching: 'Enriching…',
      analyzing: 'Analyzing…',
      complete: 'Complete',
      failed: 'Failed',
    };
    return labels[status] || status;
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  const completedCount = auditList.filter(a => a.status === 'complete').length;
  const avgScore = completedCount > 0
    ? Math.round(auditList.filter(a => a.signal_score !== null).reduce((sum, a) => sum + (a.signal_score ?? 0), 0) / completedCount)
    : null;
  const bestScore = completedCount > 0
    ? Math.max(...auditList.filter(a => a.signal_score !== null).map(a => a.signal_score ?? 0))
    : null;

  return (
    <div>
      {auditList.length === 0 ? (
        <div className="dash-empty">
          <div className="dash-empty-icon">
            <div className="dash-empty-tower">📡</div>
          </div>
          <h2>No Signal Out Here… Yet</h2>
          <p>
            Every business has a signal — most just don&apos;t know if anyone can hear it.
            Run your first free check and find out where you stand.
          </p>
          <Link href="/dashboard/new" className="dash-empty-cta">
            Run My First Signal Check →
          </Link>
          <div className="dash-empty-features">
            <div className="dash-empty-feat">
              <span>🔍</span> Can people find you?
            </div>
            <div className="dash-empty-feat">
              <span>📊</span> Does your site build trust?
            </div>
            <div className="dash-empty-feat">
              <span>⚡</span> What to fix first
            </div>
            <div className="dash-empty-feat">
              <span>📈</span> How your site performs
            </div>
          </div>
        </div>
      ) : (
        <>
          {completedCount > 0 && (
            <div className="dash-stats">
              <div className="dash-stat">
                <div className="dash-stat-value">{auditList.length}</div>
                <div className="dash-stat-label">Checks Run</div>
              </div>
              <div className="dash-stat">
                <div className="dash-stat-value">{completedCount}</div>
                <div className="dash-stat-label">Completed</div>
              </div>
              <div className="dash-stat">
                <div className="dash-stat-value" style={{ color: avgScore !== null && avgScore >= 70 ? '#27ae60' : avgScore !== null && avgScore >= 40 ? '#e67e22' : '#c0392b' }}>
                  {avgScore ?? '—'}
                </div>
                <div className="dash-stat-label">Avg Score</div>
              </div>
              <div className="dash-stat">
                <div className="dash-stat-value" style={{ color: '#27ae60' }}>
                  {bestScore ?? '—'}
                </div>
                <div className="dash-stat-label">Best Score</div>
              </div>
            </div>
          )}

          <div className="dash-section-label">Signal Check History</div>
          <div className="dash-grid">
            {auditList.map((audit) => (
              <Link
                key={audit.id}
                href={audit.status === 'complete' ? `/dashboard/report/${audit.id}` : `/dashboard`}
                className="dash-card"
                style={{ pointerEvents: audit.status === 'complete' ? 'auto' : 'none' }}
              >
                <div
                  className="dash-card-score"
                  style={{
                    color: getScoreColor(audit.signal_score),
                    borderColor: getScoreColor(audit.signal_score),
                    border: `2px solid ${getScoreColor(audit.signal_score)}`,
                  }}
                >
                  {audit.signal_score ?? '—'}
                </div>
                <div className="dash-card-info">
                  <h3>{audit.business_name}</h3>
                  <div className="dash-card-meta">
                    <span>{audit.website_url}</span>
                    {audit.city && <><span className="sep">·</span><span>{audit.city}</span></>}
                    {audit.industry && <><span className="sep">·</span><span>{audit.industry}</span></>}
                  </div>
                </div>
                <div className="dash-card-right">
                  <span className={`dash-card-status ${getStatusClass(audit.status)}`}>
                    {getStatusLabel(audit.status)}
                  </span>
                  <span className="dash-card-date">{formatDate(audit.created_at)}</span>
                  {audit.status === 'complete' && (
                    <span className="dash-card-arrow">→</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
