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

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.9rem 1rem',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '4px',
    color: '#f4ece1',
    fontSize: '1rem',
    fontFamily: 'var(--font-pjs)',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    opacity: 0.6,
  };

  if (step === 'running') {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            border: '3px solid rgba(230,126,34,0.2)',
            borderTopColor: '#e67e22',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
        <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-syne)', marginBottom: '1rem' }}>
          Running Signal Check
        </h2>
        <p style={{ opacity: 0.6, marginBottom: '1rem' }}>{status}</p>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.5rem', 
          maxWidth: '400px', 
          margin: '2rem auto 0',
          fontSize: '0.8rem',
          opacity: 0.4,
          textAlign: 'left',
        }}>
          <div>🔍 Deep crawling {form.websiteUrl}...</div>
          <div>📊 Checking Google visibility with SERP API...</div>
          <div>⚡ Measuring site speed with PageSpeed Insights...</div>
          <div>🤖 Running AI analysis with DeepSeek...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-syne)', marginBottom: '0.5rem' }}>
          New Signal Check
        </h2>
        <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>
          Enter your business details and our AI will analyze your online presence.
        </p>
      </div>

      {error && (
        <div style={{
          padding: '1rem 1.5rem',
          background: 'rgba(192,57,43,0.1)',
          border: '1px solid rgba(192,57,43,0.3)',
          borderRadius: '4px',
          color: '#e74c3c',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={labelStyle}>Business Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Mountain Peak Plumbing"
            value={form.businessName}
            onChange={(e) => setForm({ ...form, businessName: e.target.value })}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Website URL *</label>
          <input
            type="text"
            required
            placeholder="e.g. mountainpeakplumbing.ca"
            value={form.websiteUrl}
            onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>City</label>
            <input
              type="text"
              placeholder="e.g. Fernie"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Industry</label>
            <input
              type="text"
              placeholder="e.g. Plumbing"
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Goals (Optional)</label>
          <textarea
            placeholder="e.g. More calls from local customers, better Google visibility"
            value={form.goals}
            onChange={(e) => setForm({ ...form, goals: e.target.value })}
            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !form.businessName || !form.websiteUrl}
          style={{
            padding: '1.2rem',
            background: loading ? 'rgba(230,126,34,0.5)' : '#e67e22',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-pjs)',
            transition: 'background 0.2s',
            marginTop: '0.5rem',
          }}
        >
          {loading ? 'Running...' : 'Run Signal Check'}
        </button>

        <p style={{ fontSize: '0.7rem', opacity: 0.3, textAlign: 'center' }}>
          Free for up to 3 audits. AI-powered analysis takes 30–60 seconds.
        </p>
      </form>
    </div>
  );
}
