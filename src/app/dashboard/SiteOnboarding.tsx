'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Globe, MapPin, Briefcase, ArrowRight, Radio } from 'lucide-react';

export default function SiteOnboarding() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'scanning'>('form');
  const [form, setForm] = useState({
    businessName: '', websiteUrl: '', city: '', industry: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStep('scanning');

    try {
      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Setup failed');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStep('form');
    } finally {
      setLoading(false);
    }
  }

  if (step === 'scanning') {
    return (
      <div className="onboard-scanning">
        <div className="onboard-scan-ring">
          <div className="onboard-scan-pulse" />
          <Radio size={40} color="#e67e22" />
        </div>
        <h2>Setting up your dashboard…</h2>
        <p>We&apos;re scanning your site, checking Google, and building your first report. This takes about 30–60 seconds.</p>
        <div className="onboard-scan-steps">
          <div className="onboard-scan-step">🔍 Crawling your website…</div>
          <div className="onboard-scan-step">📊 Checking Google rankings…</div>
          <div className="onboard-scan-step">⚡ Measuring site speed…</div>
          <div className="onboard-scan-step">🧠 Building your action plan…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="onboard-wrap">
      <div className="onboard-header">
        <div className="onboard-icon">
          <Radio size={32} color="#e67e22" />
        </div>
        <h2>Activate Your Signal Dashboard</h2>
        <p>Enter your website and we&apos;ll set up your personalized business monitoring dashboard — track your online presence, get daily action items, and talk to our AI advisor.</p>
      </div>

      {error && <div className="dash-error">{error}</div>}

      <form onSubmit={handleSubmit} className="onboard-form">
        <div className="onboard-field">
          <label>
            <Globe size={14} />
            <span>Website URL *</span>
          </label>
          <input
            type="text"
            required
            className="dash-input"
            placeholder="yourwebsite.com"
            value={form.websiteUrl}
            onChange={e => setForm({ ...form, websiteUrl: e.target.value })}
          />
        </div>

        <div className="onboard-field">
          <label>
            <Briefcase size={14} />
            <span>Business Name *</span>
          </label>
          <input
            type="text"
            required
            className="dash-input"
            placeholder="e.g. Mountain Peak Plumbing"
            value={form.businessName}
            onChange={e => setForm({ ...form, businessName: e.target.value })}
          />
        </div>

        <div className="onboard-field-row">
          <div className="onboard-field">
            <label>
              <MapPin size={14} />
              <span>City</span>
            </label>
            <input
              type="text"
              className="dash-input"
              placeholder="e.g. Fernie"
              value={form.city}
              onChange={e => setForm({ ...form, city: e.target.value })}
            />
          </div>
          <div className="onboard-field">
            <label>
              <Briefcase size={14} />
              <span>Industry</span>
            </label>
            <input
              type="text"
              className="dash-input"
              placeholder="e.g. Plumbing"
              value={form.industry}
              onChange={e => setForm({ ...form, industry: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !form.businessName || !form.websiteUrl}
          className="onboard-submit"
        >
          <span>ACTIVATE MY DASHBOARD</span>
          <ArrowRight size={18} />
        </button>
      </form>

      <div className="onboard-features">
        <div className="onboard-feat">
          <span>📊</span>
          <div>
            <strong>Daily Monitoring</strong>
            <p>Track your SEO, rankings, and site health over time</p>
          </div>
        </div>
        <div className="onboard-feat">
          <span>✅</span>
          <div>
            <strong>Action Items</strong>
            <p>Get specific tasks to improve your online presence</p>
          </div>
        </div>
        <div className="onboard-feat">
          <span>🤖</span>
          <div>
            <strong>AI Advisor</strong>
            <p>Ask questions about your business and get real answers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
