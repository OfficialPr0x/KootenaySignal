'use client';

import { Eye, Search, Gauge, MapPin, TrendingUp, TrendingDown, Minus, Star, Lock } from 'lucide-react';

interface Snapshot {
  signal_score: number | null;
  visibility_score: number | null;
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

interface Site {
  business_name: string;
  website_url: string;
  city: string | null;
  industry: string | null;
}

function getScoreColor(score: number | null) {
  if (score === null) return 'rgba(255,255,255,0.15)';
  if (score >= 70) return '#27ae60';
  if (score >= 40) return '#e67e22';
  return '#c0392b';
}

function Chart({ data, label, color }: { data: (number | null)[]; label: string; color: string }) {
  const valid = data.filter((d): d is number => d !== null);
  if (valid.length < 2) return <p className="rank-chart-empty">Not enough data yet</p>;
  const max = Math.max(...valid, 100);
  const min = Math.min(...valid, 0);
  const range = max - min || 1;
  const w = 280;
  const h = 60;
  const points = valid.map((v, i) =>
    `${(i / (valid.length - 1)) * w},${h - ((v - min) / range) * h}`
  ).join(' ');

  return (
    <div className="rank-chart">
      <div className="rank-chart-label">{label}</div>
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="rank-chart-values">
        <span>{valid[0]}</span>
        <span style={{ color }}>{valid[valid.length - 1]}</span>
      </div>
    </div>
  );
}

export default function RankingsView({ site, snapshots }: { site: Site; snapshots: Snapshot[] }) {
  const latest = snapshots[snapshots.length - 1] ?? null;
  const prev = snapshots.length >= 2 ? snapshots[snapshots.length - 2] : null;

  function delta(curr: number | null, p: number | null, invert = false) {
    if (curr === null || p === null) return null;
    const diff = invert ? p - curr : curr - p;
    if (diff === 0) return <span className="delta delta--neutral"><Minus size={12} /></span>;
    if (diff > 0) return <span className="delta delta--up"><TrendingUp size={12} /> +{diff}</span>;
    return <span className="delta delta--down"><TrendingDown size={12} /> {diff}</span>;
  }

  return (
    <div className="dash-rankings">
      <div className="dash-topbar">
        <div>
          <h1 className="dash-page-title">Rankings & SEO</h1>
          <p className="dash-page-sub">Track how {site.business_name} performs on Google over time</p>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="rank-metrics">
        <div className="rank-metric">
          <div className="rank-metric-header">
            <Search size={16} />
            <span>Brand Position</span>
          </div>
          <div className="rank-metric-value">
            {latest?.brand_position ? `#${latest.brand_position}` : 'Not found'}
          </div>
          {delta(latest?.brand_position ?? null, prev?.brand_position ?? null, true)}
        </div>

        <div className="rank-metric">
          <div className="rank-metric-header">
            <Search size={16} />
            <span>Industry Position</span>
          </div>
          <div className="rank-metric-value">
            {latest?.industry_position ? `#${latest.industry_position}` : 'Not ranked'}
          </div>
          {delta(latest?.industry_position ?? null, prev?.industry_position ?? null, true)}
        </div>

        <div className="rank-metric">
          <div className="rank-metric-header">
            <MapPin size={16} />
            <span>Local Pack</span>
          </div>
          <div className="rank-metric-value" style={{ color: latest?.in_local_pack ? '#27ae60' : '#c0392b' }}>
            {latest?.in_local_pack ? 'Showing ✓' : 'Missing ✗'}
          </div>
        </div>

        <div className="rank-metric">
          <div className="rank-metric-header">
            <Star size={16} />
            <span>Reviews</span>
          </div>
          <div className="rank-metric-value">
            {latest?.review_count ?? '—'} {latest?.avg_rating ? `(${latest.avg_rating}★)` : ''}
          </div>
        </div>
      </div>

      {/* Trend Charts */}
      <div className="rank-charts-grid">
        <div className="rank-chart-card">
          <Chart
            data={snapshots.map(s => s.signal_score)}
            label="Signal Score"
            color="#e67e22"
          />
        </div>
        <div className="rank-chart-card">
          <Chart
            data={snapshots.map(s => s.visibility_score)}
            label="Visibility"
            color="#3498db"
          />
        </div>
        <div className="rank-chart-card">
          <Chart
            data={snapshots.map(s => s.seo_score)}
            label="SEO Score"
            color="#27ae60"
          />
        </div>
        <div className="rank-chart-card">
          <Chart
            data={snapshots.map(s => s.performance_score)}
            label="Performance"
            color="#9b59b6"
          />
        </div>
      </div>

      {/* Site Speed Details */}
      <div className="rank-section">
        <h3 className="rank-section-title"><Gauge size={16} /> Site Performance</h3>
        <div className="rank-speed-grid">
          <div className="rank-speed-item">
            <span className="rank-speed-label">LCP (Largest Contentful Paint)</span>
            <span className="rank-speed-value">{latest?.lcp || '—'}</span>
          </div>
          <div className="rank-speed-item">
            <span className="rank-speed-label">FCP (First Contentful Paint)</span>
            <span className="rank-speed-value">{latest?.fcp || '—'}</span>
          </div>
          <div className="rank-speed-item">
            <span className="rank-speed-label">CLS (Layout Shift)</span>
            <span className="rank-speed-value">{latest?.cls || '—'}</span>
          </div>
          <div className="rank-speed-item">
            <span className="rank-speed-label">Mobile Friendly</span>
            <span className="rank-speed-value" style={{ color: latest?.mobile_friendly ? '#27ae60' : '#c0392b' }}>
              {latest?.mobile_friendly ? 'Yes ✓' : 'No ✗'}
            </span>
          </div>
        </div>
      </div>

      {/* Locked deep insights */}
      <div className="rank-locked-section">
        <Lock size={20} />
        <h3>Deep SEO Insights</h3>
        <p>Backlink analysis, keyword opportunity mapping, competitor gap analysis, and content strategy recommendations are available when you work with us.</p>
        <button
          className="dash-cta-btn"
          data-cal-link="kootenay-signal/30min"
          data-cal-namespace="30min"
          data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
        >
          TALK TO US ABOUT SEO
        </button>
      </div>
    </div>
  );
}
