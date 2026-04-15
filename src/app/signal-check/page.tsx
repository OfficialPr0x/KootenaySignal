'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Eye,
  MousePointerClick,
  MessageCircle,
  Gauge,
  AlertTriangle,
} from 'lucide-react';

interface SignalReport {
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

const SCAN_MESSAGES = [
  'Checking if people can actually find you',
  'Looking for visibility gaps',
  'Scanning trust and conversion issues',
  'Reviewing speed and user experience',
  'Comparing your signal strength',
  'Building your results',
];

// ─── MAIN PAGE COMPONENT ─────────────────────────────────────
export default function SignalCheckPage() {
  const [phase, setPhase] = useState<'landing' | 'scanning' | 'results'>('landing');
  const [form, setForm] = useState({
    websiteUrl: '',
    businessName: '',
    city: '',
    industry: '',
  });
  const [report, setReport] = useState<SignalReport | null>(null);
  const [error, setError] = useState('');
  const [scanStep, setScanStep] = useState(0);
  const [progress, setProgress] = useState(0);

  // Cycle scan messages
  useEffect(() => {
    if (phase !== 'scanning') return;
    const interval = setInterval(() => {
      setScanStep((p) => (p + 1) % SCAN_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [phase]);

  // Animate progress bar
  useEffect(() => {
    if (phase !== 'scanning') return;
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 6 + 2, 88));
    }, 1200);
    return () => clearInterval(interval);
  }, [phase]);

  // Cal.com embed for results CTA
  useEffect(() => {
    if (phase !== 'results') return;
    (function (C: any, A: string, L: string) {
      const p = function (a: any, ar: any) { a.q.push(ar); };
      const d = C.document;
      C.Cal = C.Cal || function () {
        const cal = C.Cal;
        const ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement('script')).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api: any = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === 'string') {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ['initNamespace', namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, 'https://app.cal.com/embed/embed.js', 'init');
    (window as any).Cal('init', '30min', { origin: 'https://app.cal.com' });
    (window as any).Cal.ns['30min']('ui', {
      cssVarsPerTheme: { light: { 'cal-brand': '#E3A23A' }, dark: { 'cal-brand': '#0F2A24' } },
      hideEventTypeDetails: false,
      layout: 'month_view',
    });
  }, [phase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setPhase('scanning');
    setProgress(0);
    setScanStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const res = await fetch('/api/signal-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Check failed');

      const r = data.report;
      setReport({
        ...r,
        strengths: r.strengths ?? [],
        weaknesses: r.weaknesses ?? [],
        quick_wins: r.quick_wins ?? [],
        seo_issues: r.seo_issues ?? [],
        keyword_insights: r.keyword_insights ?? [],
        recommended_services: r.recommended_services ?? [],
      });
      setProgress(100);
      setTimeout(() => {
        setPhase('results');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setPhase('landing');
    }
  }

  // ─── SCANNING PHASE ──────────────────────────────────────
  if (phase === 'scanning') {
    return (
      <main className="sc-page">
        <div className="sc-scan-wrap">
          {/* Signal Ring */}
          <div className="sc-signal-ring">
            <div className="sc-signal-ring-inner" />
            <div className="sc-signal-ring-pulse" />
            <div className="sc-signal-ring-pulse sc-signal-ring-pulse--2" />
            <div className="sc-signal-ring-dot" />
          </div>

          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontFamily: 'var(--font-syne)', fontWeight: 800, marginBottom: '0.75rem' }}>
            Checking your signal…
          </h1>
          <p style={{ opacity: 0.5, maxWidth: '440px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
            We&apos;re scanning the stuff most business owners never get shown clearly.
          </p>

          {/* Progress bar */}
          <div className="sc-progress-track">
            <div className="sc-progress-fill" style={{ width: `${progress}%` }} />
          </div>

          {/* Cycling status message */}
          <div className="sc-scan-status" key={scanStep}>
            {SCAN_MESSAGES[scanStep]}
          </div>

          {/* Static step list */}
          <div className="sc-scan-steps">
            {SCAN_MESSAGES.map((msg, i) => (
              <div key={i} className={`sc-scan-step ${i <= scanStep ? 'sc-scan-step--active' : ''}`}>
                <span className="sc-scan-step-dot" />
                {msg}
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // ─── RESULTS PHASE ────────────────────────────────────────
  if (phase === 'results' && report) {
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
      issueCards.push({ icon: <Eye size={24} />, title: 'Low visibility', desc: 'You\'re not showing up strongly where local customers are looking.' });
    if (report.local_presence_score < 65)
      issueCards.push({ icon: <MapPin size={24} />, title: 'Weak location signals', desc: 'Your site doesn\'t clearly tell search engines and visitors that you serve the right area.' });
    if (report.conversion_score < 65)
      issueCards.push({ icon: <MousePointerClick size={24} />, title: 'Conversion friction', desc: 'Even when people land on your site, parts of it may be slowing them down or causing doubt.' });
    if (report.seo_score < 65 || report.paid_readiness_score < 50)
      issueCards.push({ icon: <Gauge size={24} />, title: 'Performance issues', desc: 'Slow load times or technical issues can hurt both rankings and customer trust.' });
    if (report.offer_clarity_score < 65)
      issueCards.push({ icon: <MessageCircle size={24} />, title: 'Message clarity', desc: 'It may not be obvious enough what you do, who you help, or why someone should contact you.' });
    if (report.trust_score < 65)
      issueCards.push({ icon: <Shield size={24} />, title: 'Trust gaps', desc: 'Your site may be missing the signals that help visitors feel confident about reaching out.' });

    // Limit to 5 max
    const topIssues = issueCards.slice(0, 5);

    // Quick wins — top 3
    const topWins = report.quick_wins.slice(0, 3);

    return (
      <main className="sc-page">
        <div className="sc-results-wrap">
          {/* Results hero */}
          <div className="sc-results-hero">
            <p className="sc-results-label">Signal Check Results</p>
            <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontFamily: 'var(--font-syne)', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.1 }}>
              Here&apos;s what&apos;s costing you business
            </h1>
            <p style={{ opacity: 0.4, fontSize: '0.9rem', marginBottom: '2.5rem' }}>
              Signal Check for <strong style={{ color: '#f4ece1' }}>{form.businessName}</strong>
              {form.city && <> &middot; {form.city}</>}
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
          <div className="sc-summary-box">
            <h2 className="sc-section-title">What this means</h2>
            <p style={{ opacity: 0.8, lineHeight: 1.7, fontSize: '1.05rem' }}>
              {report.summary}
            </p>
          </div>

          {/* Core issue cards */}
          {topIssues.length > 0 && (
            <div className="sc-section">
              <h2 className="sc-section-title">What&apos;s hurting you</h2>
              <div className="sc-issue-grid">
                {topIssues.map((issue, i) => (
                  <div key={i} className="sc-issue-card">
                    <div className="sc-issue-icon">{issue.icon}</div>
                    <h3 className="sc-issue-title">{issue.title}</h3>
                    <p className="sc-issue-desc">{issue.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What's already working */}
          {report.strengths.length > 0 && (
            <div className="sc-section">
              <h2 className="sc-section-title">What&apos;s already working</h2>
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

          {/* Fastest wins */}
          {topWins.length > 0 && (
            <div className="sc-section">
              <h2 className="sc-section-title">What to fix first</h2>
              <div className="sc-wins">
                {topWins.map((win, i) => (
                  <div key={i} className="sc-win-card">
                    <div className="sc-win-number">{i + 1}</div>
                    <div>
                      <p className="sc-win-text">{win}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What better signal leads to */}
          <div className="sc-section sc-outcomes">
            <h2 className="sc-section-title">What better signal can lead to</h2>
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
          <div className="sc-cta-block">
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontFamily: 'var(--font-syne)', fontWeight: 800, marginBottom: '1rem' }}>
              Want help fixing this?
            </h2>
            <p style={{ opacity: 0.7, maxWidth: '500px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
              I help local businesses turn weak visibility into more calls, more customers, and more business.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                data-cal-link="kootenay-signal/30min"
                data-cal-namespace="30min"
                data-cal-config='{"layout":"month_view"}'
                style={{ padding: '1.1rem 2.5rem', fontSize: '1rem', fontWeight: 800, cursor: 'pointer' }}
              >
                LET&apos;S FIX THIS
              </button>
              <button
                className="btn btn-outline"
                data-cal-link="kootenay-signal/30min"
                data-cal-namespace="30min"
                data-cal-config='{"layout":"month_view"}'
                style={{ padding: '1.1rem 2.5rem', fontSize: '1rem', cursor: 'pointer' }}
              >
                BOOK A SIGNAL CALL
              </button>
            </div>

            <button
              onClick={() => { setPhase('landing'); setReport(null); setForm({ websiteUrl: '', businessName: '', city: '', industry: '' }); window.scrollTo({ top: 0 }); }}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', marginTop: '2rem', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Run another check
            </button>
          </div>

          {/* Footer note */}
          <div style={{ textAlign: 'center', padding: '3rem 0 2rem', opacity: 0.2, fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>
            Kootenay Signal &mdash; A free 30-second check that shows what&apos;s costing your business customers.
          </div>
        </div>
      </main>
    );
  }

  // ─── LANDING PHASE (DEFAULT) ──────────────────────────────
  return (
    <main className="sc-page">
      {/* Hero */}
      <section className="sc-hero">
        <div className="sc-hero-inner">
          <div className="sc-hero-content">
            <h1 className="sc-hero-headline">
              Find out why your business isn&apos;t getting more customers
            </h1>
            <p className="sc-hero-sub">
              Drop in your website and get a free Signal Check in under 30 seconds.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="sc-form">
              <div className="sc-form-fields">
                <div className="sc-field">
                  <label>Website URL *</label>
                  <input
                    type="text"
                    required
                    placeholder="yourwebsite.com"
                    value={form.websiteUrl}
                    onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                    className="sc-input"
                  />
                </div>
                <div className="sc-field">
                  <label>Business Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mountain Peak Plumbing"
                    value={form.businessName}
                    onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                    className="sc-input"
                  />
                </div>
                <div className="sc-field-row">
                  <div className="sc-field">
                    <label>Town</label>
                    <input
                      type="text"
                      placeholder="e.g. Fernie"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="sc-input"
                    />
                  </div>
                  <div className="sc-field">
                    <label>Business Category</label>
                    <input
                      type="text"
                      placeholder="e.g. Plumbing"
                      value={form.industry}
                      onChange={(e) => setForm({ ...form, industry: e.target.value })}
                      className="sc-input"
                    />
                  </div>
                </div>
              </div>

              {error && <div className="sc-error">{error}</div>}

              <button
                type="submit"
                disabled={!form.websiteUrl || !form.businessName}
                className="sc-submit"
              >
                Run My Free Signal Check
              </button>

              <p className="sc-trust-line">
                No fluff. No spam. Just a clear breakdown of what&apos;s helping or hurting your business online.
              </p>
            </form>
          </div>

          {/* You'll see bullets */}
          <div className="sc-hero-bullets">
            <p className="sc-bullets-label">You&apos;ll see:</p>
            <ul className="sc-bullets">
              <li><CheckCircle2 size={16} color="#27ae60" /> How visible your business is</li>
              <li><CheckCircle2 size={16} color="#27ae60" /> What&apos;s costing you customers</li>
              <li><CheckCircle2 size={16} color="#27ae60" /> What to fix first</li>
              <li><CheckCircle2 size={16} color="#27ae60" /> How your site is performing</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="sc-proof-strip">
        <div className="sc-proof-inner">
          <span>Built in the Kootenays</span>
          <span className="sc-proof-sep">&middot;</span>
          <span>Made for local businesses</span>
          <span className="sc-proof-sep">&middot;</span>
          <span>Clear results in seconds</span>
        </div>
      </section>

      {/* What this checks */}
      <section className="sc-checks-section">
        <div className="sc-container">
          <h2 className="sc-section-heading">What this checks</h2>
          <div className="sc-checks-grid">
            <div className="sc-check-card">
              <div className="sc-check-icon"><Search size={28} /></div>
              <h3>Can people find you?</h3>
              <p>Checks your visibility in search and local signals.</p>
            </div>
            <div className="sc-check-card">
              <div className="sc-check-icon"><Shield size={28} /></div>
              <h3>Does your site help or hurt?</h3>
              <p>Checks speed, trust, clarity, and conversion issues.</p>
            </div>
            <div className="sc-check-card">
              <div className="sc-check-icon"><Zap size={28} /></div>
              <h3>What should you fix first?</h3>
              <p>Shows the fastest wins that can improve results.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why people use it */}
      <section className="sc-why-section">
        <div className="sc-container">
          <h2 className="sc-why-heading">
            Most businesses don&apos;t need more guessing. They need clarity.
          </h2>
          <p className="sc-why-body">
            Most owners know they should be getting more business. They just don&apos;t know what&apos;s blocking it.
            This check shows you where the problem really is.
          </p>
        </div>
      </section>

      {/* Secondary CTA */}
      <section className="sc-bottom-cta">
        <div className="sc-container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontFamily: 'var(--font-syne)', fontWeight: 800, marginBottom: '1.5rem' }}>
            Ready to find out?
          </h2>
          <button
            className="sc-submit"
            style={{ maxWidth: '400px', margin: '0 auto' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Run My Free Signal Check
          </button>
          <p style={{ opacity: 0.3, fontSize: '0.8rem', marginTop: '1.5rem' }}>
            A free 30-second check that shows what&apos;s costing your business customers.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '2rem 0', textAlign: 'center', opacity: 0.15, fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        Kootenay Signal &mdash; Built in Sparwood, BC
      </footer>
    </main>
  );
}
