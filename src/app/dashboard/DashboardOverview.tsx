'use client';

import Link from 'next/link';
import {
  TrendingUp, TrendingDown, Minus,
  Eye, Shield, MousePointerClick, MapPin, Gauge, Search,
  ArrowRight, CheckSquare, Lock, MessageCircle,
} from 'lucide-react';

interface Snapshot {
  signal_score: number | null;
  visibility_score: number | null;
  trust_score: number | null;
  conversion_score: number | null;
  local_presence_score: number | null;
  seo_score: number | null;
  performance_score: number | null;
  brand_position: number | null;
  industry_position: number | null;
  in_local_pack: boolean;
  competitor_count: number | null;
  review_count: number | null;
  avg_rating: number | null;
  lcp: string | null;
  fcp: string | null;
  cls: string | null;
  mobile_friendly: boolean;
  created_at: string;
}

interface PrevSnapshot {
  signal_score: number | null;
  visibility_score: number | null;
  trust_score: number | null;
  conversion_score: number | null;
  seo_score: number | null;
  performance_score: number | null;
  brand_position: number | null;
  industry_position: number | null;
  created_at: string;
}

interface ActionItem {
  id: string;
  title: string;
  category: string;
  priority: string;
  difficulty: string;
  is_completed: boolean;
  is_locked: boolean;
}

interface Site {
  business_name: string;
  website_url: string;
  city: string | null;
  industry: string | null;
  last_scan_at: string | null;
}

interface HistoryPoint {
  signal_score: number | null;
  created_at: string;
}

function getScoreColor(score: number | null) {
  if (score === null) return 'rgba(255,255,255,0.15)';
  if (score >= 70) return '#27ae60';
  if (score >= 40) return '#e67e22';
  return '#c0392b';
}

function Delta({ current, previous, invert = false }: { current: number | null; previous: number | null; invert?: boolean }) {
  if (current === null || previous === null) return null;
  const diff = invert ? previous - current : current - previous;
  if (diff === 0) return <span className="delta delta--neutral"><Minus size={12} /> Same</span>;
  if (diff > 0) return <span className="delta delta--up"><TrendingUp size={12} /> +{diff}</span>;
  return <span className="delta delta--down"><TrendingDown size={12} /> {diff}</span>;
}

function MiniSparkline({ data }: { data: HistoryPoint[] }) {
  if (data.length < 2) return null;
  const scores = data.map(d => d.signal_score ?? 0);
  const max = Math.max(...scores, 100);
  const min = Math.min(...scores, 0);
  const range = max - min || 1;
  const w = 120;
  const h = 32;
  const points = scores.map((s, i) =>
    `${(i / (scores.length - 1)) * w},${h - ((s - min) / range) * h}`
  ).join(' ');

  return (
    <svg width={w} height={h} className="sparkline" viewBox={`0 0 ${w} ${h}`}>
      <polyline
        points={points}
        fill="none"
        stroke="#e67e22"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function categoryIcon(cat: string) {
  switch (cat) {
    case 'seo': return <Search size={14} />;
    case 'local': return <MapPin size={14} />;
    case 'trust': return <Shield size={14} />;
    case 'conversion': return <MousePointerClick size={14} />;
    case 'speed': return <Gauge size={14} />;
    case 'content': return <Eye size={14} />;
    default: return <CheckSquare size={14} />;
  }
}

function priorityClass(p: string) {
  if (p === 'high') return 'action-priority--high';
  if (p === 'low') return 'action-priority--low';
  return 'action-priority--medium';
}

export default function DashboardOverview({
  site, snapshot, previousSnapshot, actionItems, history,
}: {
  site: Site;
  snapshot: Snapshot | null;
  previousSnapshot: PrevSnapshot | null;
  actionItems: ActionItem[];
  history: HistoryPoint[];
}) {
  if (!snapshot) {
    return (
      <div className="dash-no-data">
        <h2>Scan in progress…</h2>
        <p>Your first scan is still processing. Refresh the page in a moment.</p>
      </div>
    );
  }

  const score = snapshot.signal_score ?? 0;
  const scoreColor = getScoreColor(score);
  const lastScan = site.last_scan_at
    ? new Date(site.last_scan_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Never';

  const scoreCards = [
    { label: 'Visibility', score: snapshot.visibility_score, prev: previousSnapshot?.visibility_score, icon: <Eye size={16} /> },
    { label: 'Trust', score: snapshot.trust_score, prev: previousSnapshot?.trust_score, icon: <Shield size={16} /> },
    { label: 'Conversion', score: snapshot.conversion_score, prev: previousSnapshot?.conversion_score, icon: <MousePointerClick size={16} /> },
    { label: 'Local SEO', score: snapshot.local_presence_score, prev: null, icon: <MapPin size={16} /> },
    { label: 'SEO', score: snapshot.seo_score, prev: previousSnapshot?.seo_score, icon: <Search size={16} /> },
    { label: 'Speed', score: snapshot.performance_score, prev: previousSnapshot?.performance_score, icon: <Gauge size={16} /> },
  ];

  const unlockedActions = actionItems.filter(a => !a.is_locked);
  const lockedActions = actionItems.filter(a => a.is_locked);

  return (
    <div className="dash-overview">
      {/* Top bar */}
      <div className="dash-topbar">
        <div>
          <h1 className="dash-page-title">{site.business_name}</h1>
          <p className="dash-page-sub">{site.website_url} {site.city && <>· {site.city}</>} {site.industry && <>· {site.industry}</>}</p>
        </div>
        <div className="dash-topbar-meta">
          <span className="dash-last-scan">Last scan: {lastScan}</span>
        </div>
      </div>

      {/* Signal Score Hero */}
      <div className="dash-score-hero">
        <div className="dash-score-main">
          <div className="dash-score-ring" style={{ borderColor: scoreColor, boxShadow: `0 0 40px ${scoreColor}22` }}>
            <span className="dash-score-number" style={{ color: scoreColor }}>{score}</span>
            <span className="dash-score-max">/100</span>
          </div>
          <div className="dash-score-info">
            <h2>Signal Score</h2>
            <p className="dash-score-verdict" style={{ color: scoreColor }}>
              {score >= 80 ? 'Strong signal — you\'re in good shape' :
               score >= 60 ? 'Decent, but leaking opportunities' :
               score >= 40 ? 'Weak — you\'re being overlooked' :
               'Critical — customers can\'t find you'}
            </p>
            <Delta current={score} previous={previousSnapshot?.signal_score ?? null} />
          </div>
        </div>
        {history.length > 1 && (
          <div className="dash-score-trend">
            <span className="dash-trend-label">Trend</span>
            <MiniSparkline data={history} />
          </div>
        )}
      </div>

      {/* Score Breakdown Grid */}
      <div className="dash-scores-grid">
        {scoreCards.map((card, i) => (
          <div key={i} className="dash-metric-card">
            <div className="dash-metric-header">
              <span className="dash-metric-icon" style={{ color: getScoreColor(card.score) }}>{card.icon}</span>
              <span className="dash-metric-label">{card.label}</span>
            </div>
            <div className="dash-metric-value" style={{ color: getScoreColor(card.score) }}>
              {card.score ?? '—'}
            </div>
            {card.prev !== null && card.prev !== undefined && (
              <Delta current={card.score} previous={card.prev} />
            )}
          </div>
        ))}
      </div>

      {/* Quick Stats Row */}
      <div className="dash-quick-stats">
        <div className="dash-qstat">
          <span className="dash-qstat-label">Google Position</span>
          <span className="dash-qstat-value">
            {snapshot.brand_position ? `#${snapshot.brand_position}` : 'Not found'}
          </span>
          {previousSnapshot?.brand_position && (
            <Delta current={snapshot.brand_position} previous={previousSnapshot.brand_position} invert />
          )}
        </div>
        <div className="dash-qstat">
          <span className="dash-qstat-label">Local Pack</span>
          <span className="dash-qstat-value" style={{ color: snapshot.in_local_pack ? '#27ae60' : '#c0392b' }}>
            {snapshot.in_local_pack ? 'Yes ✓' : 'No ✗'}
          </span>
        </div>
        <div className="dash-qstat">
          <span className="dash-qstat-label">Reviews</span>
          <span className="dash-qstat-value">
            {snapshot.review_count ?? '—'} {snapshot.avg_rating ? `(${snapshot.avg_rating}★)` : ''}
          </span>
        </div>
        <div className="dash-qstat">
          <span className="dash-qstat-label">Mobile Friendly</span>
          <span className="dash-qstat-value" style={{ color: snapshot.mobile_friendly ? '#27ae60' : '#c0392b' }}>
            {snapshot.mobile_friendly ? 'Yes ✓' : 'No ✗'}
          </span>
        </div>
        <div className="dash-qstat">
          <span className="dash-qstat-label">LCP</span>
          <span className="dash-qstat-value">{snapshot.lcp || '—'}</span>
        </div>
      </div>

      {/* Bottom Grid: Actions + Advisor Teaser */}
      <div className="dash-bottom-grid">
        {/* Action Items Preview */}
        <div className="dash-widget">
          <div className="dash-widget-header">
            <h3><CheckSquare size={16} /> Action Items</h3>
            <Link href="/dashboard/actions" className="dash-widget-link">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="dash-widget-body">
            {unlockedActions.length === 0 && lockedActions.length === 0 ? (
              <p className="dash-widget-empty">No action items yet. Run a scan to generate recommendations.</p>
            ) : (
              <>
                {unlockedActions.slice(0, 3).map(item => (
                  <div key={item.id} className="action-preview-item">
                    <span className={`action-priority ${priorityClass(item.priority)}`}>{item.priority}</span>
                    <span className="action-preview-icon">{categoryIcon(item.category)}</span>
                    <span className="action-preview-text">{item.title}</span>
                  </div>
                ))}
                {lockedActions.length > 0 && (
                  <div className="action-preview-item action-preview-item--locked">
                    <Lock size={14} />
                    <span className="action-preview-text">{lockedActions.length} more items require expert help</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* AI Advisor Teaser */}
        <div className="dash-widget dash-widget--advisor">
          <div className="dash-widget-header">
            <h3><MessageCircle size={16} /> AI Advisor</h3>
            <Link href="/dashboard/advisor" className="dash-widget-link">
              Open chat <ArrowRight size={14} />
            </Link>
          </div>
          <div className="dash-widget-body">
            <div className="advisor-teaser">
              <p>Ask anything about your business:</p>
              <div className="advisor-suggestions">
                <Link href="/dashboard/advisor?q=How+can+I+get+more+calls" className="advisor-suggestion">
                  &ldquo;How can I get more calls?&rdquo;
                </Link>
                <Link href="/dashboard/advisor?q=What+should+I+fix+first" className="advisor-suggestion">
                  &ldquo;What should I fix first?&rdquo;
                </Link>
                <Link href="/dashboard/advisor?q=Why+am+I+not+on+Google+Maps" className="advisor-suggestion">
                  &ldquo;Why am I not on Google Maps?&rdquo;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Strip */}
      <div className="dash-cta-strip">
        <p>Want someone to actually fix all this?</p>
        <button
          className="dash-cta-btn"
          data-cal-link="kootenay-signal/30min"
          data-cal-namespace="30min"
          data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
        >
          BOOK A CALL
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
