'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface AuditData {
  id: string;
  business_name: string;
  website_url: string;
  city: string | null;
  industry: string | null;
  status: string;
  signal_score: number | null;
  visibility_score: number | null;
  trust_score: number | null;
  conversion_score: number | null;
  local_presence_score: number | null;
  offer_clarity_score: number | null;
  paid_readiness_score: number | null;
  seo_score: number | null;
  report_data: Report | null;
  created_at: string;
}

interface Report {
  signal_score: number;
  visibility_score: number;
  trust_score: number;
  conversion_score: number;
  local_presence_score: number;
  offer_clarity_score: number;
  paid_readiness_score: number;
  seo_score: number;
  summary: string;
  headline: string;
  strengths: string[];
  weaknesses: string[];
  quick_wins: string[];
  seo_issues: string[];
  keyword_insights: string[];
  recommended_services: string[];
  cta_message: string;
}

function ScoreDial({ score, size = 120, label }: { score: number; size?: number; label: string }) {
  const color = score >= 70 ? '#27ae60' : score >= 40 ? '#e67e22' : '#c0392b';
  const circumference = 2 * Math.PI * (size / 2 - 8);
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 8}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="6"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 8}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dy="0.35em"
          fill={color}
          fontSize={size * 0.28}
          fontWeight="900"
          fontFamily="var(--font-syne)"
          style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}
        >
          {score}
        </text>
      </svg>
      <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6, marginTop: '0.5rem' }}>
        {label}
      </p>
    </div>
  );
}

function ScoreBar({ score, label }: { score: number; label: string }) {
  const color = score >= 70 ? '#27ae60' : score >= 40 ? '#e67e22' : '#c0392b';
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: '0.8rem', fontWeight: 800, color }}>{score}/100</span>
      </div>
      <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${score}%`,
          background: color,
          borderRadius: '3px',
          transition: 'width 1s ease',
        }} />
      </div>
    </div>
  );
}

function Card({ title, children, accent }: { title: string; children: React.ReactNode; accent?: string }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: `1px solid ${accent ? accent + '33' : 'rgba(255,255,255,0.05)'}`,
      borderRadius: '4px',
      padding: '2rem',
    }}>
      <h3 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.5, marginBottom: '1.25rem' }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function ReportContent({ audit }: { audit: AuditData }) {
  const rawReport: Report | null = audit.report_data ?? null;

  // Normalize arrays — API may return undefined for any of these
  const report = rawReport ? {
    ...rawReport,
    strengths: rawReport.strengths ?? [],
    weaknesses: rawReport.weaknesses ?? [],
    quick_wins: rawReport.quick_wins ?? [],
    seo_issues: rawReport.seo_issues ?? [],
    keyword_insights: rawReport.keyword_insights ?? [],
    recommended_services: rawReport.recommended_services ?? [],
  } : null;

  // Load Cal.com embed on mount so the booking button works
  useEffect(() => {
    (function (C: any, A: string, L: string) {
      const p = function (a: any, ar: any) { a.q.push(ar); };
      const d = C.document;
      C.Cal = C.Cal || function () {
        const cal = C.Cal;
        const ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api: any = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    (window as any).Cal("init", "30min", { origin: "https://app.cal.com" });
    (window as any).Cal.ns["30min"]("ui", {
      cssVarsPerTheme: { light: { "cal-brand": "#E3A23A" }, dark: { "cal-brand": "#0F2A24" } },
      hideEventTypeDetails: false,
      layout: "month_view",
    });
  }, []);

  function handleSaveReport() {
    window.print();
  }

  if (!report) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2>Report not available</h2>
        <p style={{ opacity: 0.5 }}>This audit may still be processing or encountered an error.</p>
        <Link href="/dashboard" style={{ color: '#e67e22', marginTop: '1rem', display: 'inline-block' }}>
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/dashboard"
        style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: '0.8rem',
          textDecoration: 'none',
          display: 'inline-block',
          marginBottom: '1.5rem',
          fontWeight: 600,
          transition: 'color 0.3s ease',
        }}
      >
        ← Back to Dashboard
      </Link>

      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem',
        padding: '3rem 2rem',
        background: 'rgba(255,255,255,0.01)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '4px',
      }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: '#e67e22',
          }}>
            Kootenay Signal Check Report
          </span>
        </div>
        <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-syne)', marginBottom: '0.5rem', fontWeight: 800 }}>
          {audit.business_name}
        </h2>
        <p style={{ opacity: 0.4, fontSize: '0.85rem', marginBottom: '2rem' }}>
          {audit.website_url} {audit.city && `• ${audit.city}`} {audit.industry && `• ${audit.industry}`}
        </p>

        <ScoreDial score={report.signal_score} size={160} label="Signal Score" />

        <p style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          fontFamily: 'var(--font-syne)',
          marginTop: '1.5rem',
          color: report.signal_score >= 70 ? '#27ae60' : report.signal_score >= 40 ? '#e67e22' : '#c0392b',
        }}>
          {report.headline}
        </p>
        <p style={{ opacity: 0.6, maxWidth: '600px', margin: '1rem auto 0', lineHeight: 1.6 }}>
          {report.summary}
        </p>
      </div>

      {/* Score Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <Card title="Score Breakdown">
          <ScoreBar score={report.visibility_score} label="Visibility" />
          <ScoreBar score={report.trust_score} label="Trust" />
          <ScoreBar score={report.conversion_score} label="Conversion" />
          <ScoreBar score={report.local_presence_score} label="Local Presence" />
          <ScoreBar score={report.offer_clarity_score} label="Offer Clarity" />
          <ScoreBar score={report.paid_readiness_score} label="Paid Ad Readiness" />
          <ScoreBar score={report.seo_score} label="SEO" />
        </Card>

        <Card title="Category Scores">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <ScoreDial score={report.visibility_score} size={80} label="Visibility" />
            <ScoreDial score={report.trust_score} size={80} label="Trust" />
            <ScoreDial score={report.conversion_score} size={80} label="Conversion" />
            <ScoreDial score={report.local_presence_score} size={80} label="Local" />
            <ScoreDial score={report.offer_clarity_score} size={80} label="Clarity" />
            <ScoreDial score={report.seo_score} size={80} label="SEO" />
          </div>
        </Card>
      </div>

      {/* Strengths & Weaknesses */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <Card title="Strengths" accent="#27ae60">
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {report.strengths.map((s, i) => (
              <li key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                <span style={{ color: '#27ae60', fontWeight: 900, flexShrink: 0 }}>✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Weaknesses" accent="#c0392b">
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {report.weaknesses.map((w, i) => (
              <li key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                <span style={{ color: '#c0392b', fontWeight: 900, flexShrink: 0 }}>✗</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Quick Wins */}
      {report.quick_wins.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <Card title="Quick Wins — Fastest Improvements" accent="#e67e22">
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {report.quick_wins.map((qw, i) => (
                <div key={i} style={{
                  display: 'flex',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  background: 'rgba(230,126,34,0.05)',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  alignItems: 'flex-start',
                }}>
                  <span style={{ color: '#e67e22', fontWeight: 900, fontSize: '1.1rem', flexShrink: 0 }}>⚡</span>
                  <span>{qw}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* SEO Issues & Keyword Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {report.seo_issues.length > 0 && (
          <Card title="SEO Issues">
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {report.seo_issues.map((issue, i) => (
                <li key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                  <span style={{ color: '#f39c12', fontWeight: 900, flexShrink: 0 }}>⚠</span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {report.keyword_insights.length > 0 && (
          <Card title="Keyword Rankings">
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {report.keyword_insights.map((insight, i) => (
                <li key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                  <span style={{ color: '#3498db', fontWeight: 900, flexShrink: 0 }}>📍</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      {/* Recommended Services */}
      {report.recommended_services.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <Card title="Recommended Kootenay Signal Services">
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {report.recommended_services.map((s, i) => (
                <div key={i} style={{
                  padding: '0.75rem 1rem',
                  background: 'rgba(230,126,34,0.03)',
                  border: '1px solid rgba(230,126,34,0.1)',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}>
                  {s}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* CTA Block */}
      <div style={{
        textAlign: 'center',
        padding: '3rem 2rem',
        background: 'linear-gradient(135deg, rgba(230,126,34,0.05) 0%, rgba(230,126,34,0.02) 100%)',
        border: '2px solid rgba(230,126,34,0.2)',
        borderRadius: '4px',
        marginBottom: '2rem',
      }}>
        <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-syne)', marginBottom: '1rem', fontWeight: 800 }}>
          Ready to Fix Your Signal?
        </h3>
        <p style={{ opacity: 0.7, maxWidth: '500px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
          {report.cta_message}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            data-cal-link="kootenay-signal/30min"
            data-cal-namespace="30min"
            data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
            style={{ padding: '1rem 2.5rem', fontSize: '1rem', fontWeight: 800, cursor: 'pointer' }}
          >
            Book a Signal Strategy Call
          </button>
          <Link
            href="/dashboard/new"
            className="dash-new-btn"
            style={{ padding: '1rem 2.5rem', fontSize: '0.85rem' }}
          >
            <span>Run Another Check</span>
          </Link>
        </div>
      </div>

      {/* Save / Download Bar */}
      <div className="report-save-bar" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '1.5rem 2rem',
        marginBottom: '2rem',
        background: 'rgba(255,255,255,0.015)',
        border: '1px solid rgba(255,255,255,0.04)',
        borderRadius: '4px',
      }}>
        <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.35, fontWeight: 700 }}>
          Save this report
        </span>
        <button
          onClick={handleSaveReport}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1.5rem',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '3px',
            color: '#f4ece1',
            fontWeight: 700,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: 'var(--font-sans)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary)';
            e.currentTarget.style.color = 'var(--primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.color = '#f4ece1';
          }}
        >
          📄 Save as PDF
        </button>
      </div>

      {/* Footer meta */}
      <div style={{ textAlign: 'center', padding: '2rem 0', opacity: 0.3, fontSize: '0.7rem' }}>
        Report generated on {new Date(audit.created_at).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
        <br />Powered by Kootenay Signal Check AI
      </div>
    </div>
  );
}
