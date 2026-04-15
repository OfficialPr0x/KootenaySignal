'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import {
  Eye,
  MapPin,
  MousePointerClick,
  Gauge,
  MessageCircle,
  Shield,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

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

export default function ReportContent({ audit }: { audit: AuditData }) {
  const rawReport: Report | null = audit.report_data ?? null;

  const report = rawReport ? {
    ...rawReport,
    strengths: rawReport.strengths ?? [],
    weaknesses: rawReport.weaknesses ?? [],
    quick_wins: rawReport.quick_wins ?? [],
    seo_issues: rawReport.seo_issues ?? [],
    keyword_insights: rawReport.keyword_insights ?? [],
    recommended_services: rawReport.recommended_services ?? [],
  } : null;

  // Load Cal.com embed on mount
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

  const score = report.signal_score;
  const scoreColor = score >= 80 ? '#27ae60' : score >= 60 ? '#e67e22' : score >= 40 ? '#e67e22' : '#c0392b';
  const scoreLabel =
    score >= 80 ? 'Strong signal' :
    score >= 60 ? 'Decent, but leaking opportunities' :
    score >= 40 ? 'Weak visibility and missed potential' :
    'You\'re likely being overlooked';

  // Build issue cards from sub-scores
  const issueCards: { icon: React.ReactNode; title: string; desc: string }[] = [];
  if (report.visibility_score < 65)
    issueCards.push({ icon: <Eye size={22} />, title: 'Low visibility', desc: 'You\'re not showing up strongly where local customers are looking.' });
  if (report.local_presence_score < 65)
    issueCards.push({ icon: <MapPin size={22} />, title: 'Weak location signals', desc: 'Your site doesn\'t clearly tell search engines and visitors that you serve the right area.' });
  if (report.conversion_score < 65)
    issueCards.push({ icon: <MousePointerClick size={22} />, title: 'Conversion friction', desc: 'Even when people land on your site, parts of it may be slowing them down or causing doubt.' });
  if (report.seo_score < 65 || report.paid_readiness_score < 50)
    issueCards.push({ icon: <Gauge size={22} />, title: 'Performance issues', desc: 'Slow load times or technical issues can hurt both rankings and customer trust.' });
  if (report.offer_clarity_score < 65)
    issueCards.push({ icon: <MessageCircle size={22} />, title: 'Message clarity', desc: 'It may not be obvious enough what you do, who you help, or why someone should contact you.' });
  if (report.trust_score < 65)
    issueCards.push({ icon: <Shield size={22} />, title: 'Trust gaps', desc: 'Your site may be missing the signals that help visitors feel confident about reaching out.' });

  const topIssues = issueCards.slice(0, 5);
  const topWins = report.quick_wins.slice(0, 3);

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
        }}
      >
        ← Back to Dashboard
      </Link>

      {/* Results Hero */}
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem',
        padding: '3rem 2rem',
        background: 'rgba(255,255,255,0.01)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '6px',
      }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#e67e22', marginBottom: '1rem' }}>
          Signal Check Results
        </p>
        <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontFamily: 'var(--font-syne)', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.1 }}>
          Here&apos;s what&apos;s costing you business
        </h2>
        <p style={{ opacity: 0.4, fontSize: '0.85rem', marginBottom: '2rem' }}>
          Signal Check for <strong style={{ color: '#f4ece1' }}>{audit.business_name}</strong>
          {audit.city && <> &middot; {audit.city}</>}
          {audit.industry && <> &middot; {audit.industry}</>}
        </p>

        {/* Main Score */}
        <div className="sc-score-block">
          <div className="sc-score-ring" style={{ borderColor: scoreColor, boxShadow: `0 0 40px ${scoreColor}22` }}>
            <span className="sc-score-number" style={{ color: scoreColor }}>{score}</span>
            <span className="sc-score-max">/100</span>
          </div>
          <p className="sc-score-label">Signal Score</p>
          <p className="sc-score-verdict" style={{ color: scoreColor }}>{scoreLabel}</p>
        </div>
      </div>

      {/* What this means */}
      <div className="sc-summary-box" style={{ marginBottom: '2rem' }}>
        <h3 className="sc-section-title">What this means</h3>
        <p style={{ opacity: 0.8, lineHeight: 1.7, fontSize: '1.05rem' }}>
          {report.summary}
        </p>
      </div>

      {/* Core Issue Cards */}
      {topIssues.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 className="sc-section-title">What&apos;s hurting you</h3>
          <div className="sc-issue-grid">
            {topIssues.map((issue, i) => (
              <div key={i} className="sc-issue-card">
                <div className="sc-issue-icon">{issue.icon}</div>
                <h4 className="sc-issue-title">{issue.title}</h4>
                <p className="sc-issue-desc">{issue.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What's Already Working */}
      {report.strengths.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 className="sc-section-title">What&apos;s already working</h3>
          <div className="sc-strengths">
            {report.strengths.map((s, i) => (
              <div key={i} className="sc-strength-item">
                <CheckCircle2 size={18} color="#27ae60" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fastest Wins */}
      {topWins.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 className="sc-section-title">What to fix first</h3>
          <div className="sc-wins">
            {topWins.map((win, i) => (
              <div key={i} className="sc-win-card">
                <div className="sc-win-number">{i + 1}</div>
                <p className="sc-win-text">{win}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What better signal leads to */}
      <div className="sc-outcomes" style={{ marginBottom: '2rem' }}>
        <h3 className="sc-section-title">What better signal can lead to</h3>
        <div className="sc-outcome-list">
          {[
            'More calls from local customers',
            'Better trust when people land on your site',
            'Less business lost to competitors who are easier to find',
          ].map((item, i) => (
            <div key={i} className="sc-outcome-item">
              <ArrowRight size={16} color="#e67e22" style={{ flexShrink: 0 }} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Block */}
      <div className="sc-cta-block" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-syne)', marginBottom: '1rem', fontWeight: 800 }}>
          Want help fixing this?
        </h3>
        <p style={{ opacity: 0.7, maxWidth: '500px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
          {report.cta_message}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            data-cal-link="kootenay-signal/30min"
            data-cal-namespace="30min"
            data-cal-config='{"layout":"month_view"}'
            style={{ padding: '1rem 2.5rem', fontSize: '1rem', fontWeight: 800, cursor: 'pointer' }}
          >
            LET&apos;S FIX THIS
          </button>
          <button
            className="btn btn-outline"
            data-cal-link="kootenay-signal/30min"
            data-cal-namespace="30min"
            data-cal-config='{"layout":"month_view"}'
            style={{ padding: '1rem 2.5rem', fontSize: '1rem', cursor: 'pointer' }}
          >
            BOOK A SIGNAL CALL
          </button>
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
        <br />Kootenay Signal &mdash; A free check that shows what&apos;s costing your business customers.
      </div>
    </div>
  );
}
