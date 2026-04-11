'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewAuditPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'running'>('form');
  const [status, setStatus] = useState('');

  const [form, setForm] = useState({
    businessName: '',
    websiteUrl: '',
    city: '',
    industry: '',
    goals: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStep('running');
    setStatus('Starting Signal Check...');

    try {
      setStatus('Crawling website, checking Google, and measuring speed...');
      
      const response = await fetch('/api/audits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Audit failed');
      }

      setStatus('Analysis complete! Redirecting...');
      router.push(`/dashboard/report/${data.audit.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStep('form');
    } finally {
      setLoading(false);
    }
  }

  if (step === 'running') {
    return (
      <div className="dash-running">
        <div className="dash-spinner" />
        <h2>Scanning the Airwaves…</h2>
        <p className="dash-running-status">{status}</p>
        <div className="dash-running-steps">
          <div className="dash-running-step">
            <span>🔍</span> Deep crawling {form.websiteUrl}…
          </div>
          <div className="dash-running-step">
            <span>📊</span> Checking Google visibility via SERP…
          </div>
          <div className="dash-running-step">
            <span>⚡</span> Measuring site speed with PageSpeed Insights…
          </div>
          <div className="dash-running-step">
            <span>🤖</span> Running AI analysis with DeepSeek…
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-form-wrap">
      <div className="dash-form-header">
        <h2>New Signal Check</h2>
        <p>
          Tell us about your business. We'll crawl your site, check your Google presence, 
          and give you the straight goods — no fluff.
        </p>
      </div>

      {error && (
        <div className="dash-error">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="dash-form">
        <div className="dash-field">
          <label>Business Name *</label>
          <input
            type="text"
            required
            className="dash-input"
            placeholder="e.g. Mountain Peak Plumbing"
            value={form.businessName}
            onChange={(e) => setForm({ ...form, businessName: e.target.value })}
          />
        </div>

        <div className="dash-field">
          <label>Website URL *</label>
          <input
            type="text"
            required
            className="dash-input"
            placeholder="e.g. mountainpeakplumbing.ca"
            value={form.websiteUrl}
            onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
          />
        </div>

        <div className="dash-field-row">
          <div className="dash-field">
            <label>City</label>
            <input
              type="text"
              className="dash-input"
              placeholder="e.g. Fernie"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>
          <div className="dash-field">
            <label>Industry / Trade</label>
            <input
              type="text"
              className="dash-input"
              placeholder="e.g. Plumbing"
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
            />
          </div>
        </div>

        <div className="dash-field">
          <label>Goals (Optional)</label>
          <textarea
            className="dash-input"
            placeholder="e.g. More calls from locals, show up on Google Maps, beat the competition in Cranbrook"
            value={form.goals}
            onChange={(e) => setForm({ ...form, goals: e.target.value })}
            style={{ minHeight: '80px', resize: 'vertical' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !form.businessName || !form.websiteUrl}
          className="dash-submit"
        >
          {loading ? 'Running…' : 'Run Signal Check'}
        </button>

        <p className="dash-form-note">
          Free for up to 3 checks. AI analysis takes 30–60 seconds.
        </p>
      </form>
    </div>
  );
}
