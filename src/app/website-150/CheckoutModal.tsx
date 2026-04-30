'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { ArrowRight, X, Check, Lock, ChevronLeft, ChevronDown, Zap } from 'lucide-react';
import type { StripeElementsOptionsMode } from '@stripe/stripe-js';

const STORAGE_KEY = 'ks_w150_form';

const BUSINESS_TYPES = [
  'Trades & Contractors', 'Plumbing / Electrical', 'Landscaping', 'Snow Removal',
  'Restaurant / Café', 'Retail / Boutique', 'Hair & Beauty', 'Auto / Mechanic',
  'Photography / Video', 'Real Estate', 'Fitness / Personal Training', 'Cleaning Services',
  'Tour Guide / Outfitter', 'Bed & Breakfast', 'Pet Services', 'Other',
];

const ADDONS = [
  {
    id: 'seo' as const,
    emoji: '🚀',
    label: 'Google Ranking Boost',
    tagline: 'Rank locally for your service + city',
    detail: 'Keywords, title tags, meta descriptions, on-page SEO baked in. Show up when locals search.',
    price: 97,
    priceCents: 9700,
  },
  {
    id: 'missed-call' as const,
    emoji: '📞',
    label: 'Missed Call Text-Back',
    tagline: 'Turn missed calls into booked jobs — automatically',
    detail: 'Auto-text anyone who calls and hangs up: "Hey, this is [Business] — what can we help with?"',
    price: 147,
    priceCents: 14700,
    featured: true,
  },
  {
    id: 'ai-quote' as const,
    emoji: '🧠',
    label: 'AI Quote Assistant',
    tagline: 'Generate professional quotes in seconds',
    detail: 'Contractors hate quoting. Get a simple AI tool that speeds up response time and wins more jobs.',
    price: 97,
    priceCents: 9700,
  },
  {
    id: 'gmb' as const,
    emoji: '📍',
    label: 'Google Profile Optimization',
    tagline: 'Show up on Maps when locals search for you',
    detail: 'Categories, description, keywords, review strategy — your Google Business listing fully done.',
    price: 97,
    priceCents: 9700,
  },
];

type AddonId = 'seo' | 'missed-call' | 'ai-quote' | 'gmb';

type FormData = {
  name: string;
  businessName: string;
  email: string;
  phone: string;
  businessType: string;
  notes: string;
};

const INITIAL_FORM: FormData = {
  name: '', businessName: '', email: '', phone: '', businessType: '', notes: '',
};

function loadForm(): FormData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_FORM;
    return { ...INITIAL_FORM, ...JSON.parse(raw) };
  } catch { return INITIAL_FORM; }
}
function saveForm(form: FormData) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(form)); } catch {} }
function clearForm() { try { localStorage.removeItem(STORAGE_KEY); } catch {} }

// ─── Branded select ───────────────────────────────────────────────────────────
function BrandedSelect({ value, onChange, hasError }: { value: string; onChange: (v: string) => void; hasError: boolean }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <button type="button" onClick={() => setOpen(o => !o)} style={{ width: '100%', padding: '0.82rem 1rem', background: 'rgba(255,255,255,0.03)', border: `1px solid ${hasError ? 'rgba(231,76,60,0.5)' : open ? 'rgba(230,126,34,0.5)' : 'rgba(255,255,255,0.09)'}`, borderRadius: '8px', color: value ? '#e67e22' : 'rgba(255,255,255,0.28)', fontSize: '0.92rem', fontFamily: 'var(--font-pjs)', fontWeight: value ? 600 : 400, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', transition: 'border-color 0.2s' }}>
        <span>{value || 'Select your industry…'}</span>
        <ChevronDown size={15} color={value ? '#e67e22' : 'rgba(255,255,255,0.25)'} style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 200, background: '#0a1209', border: '1px solid rgba(230,126,34,0.22)', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 16px 48px rgba(0,0,0,0.7)', maxHeight: '280px', overflowY: 'auto' }}>
          {BUSINESS_TYPES.map(biz => (
            <button key={biz} type="button" onClick={() => { onChange(biz); setOpen(false); }}
              style={{ width: '100%', padding: '0.72rem 1.1rem', background: value === biz ? 'rgba(230,126,34,0.1)' : 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)', color: value === biz ? '#e67e22' : 'rgba(230,126,34,0.75)', fontSize: '0.88rem', fontFamily: 'var(--font-pjs)', fontWeight: value === biz ? 700 : 400, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(230,126,34,0.07)'; (e.currentTarget as HTMLButtonElement).style.color = '#e67e22'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = value === biz ? 'rgba(230,126,34,0.1)' : 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = value === biz ? '#e67e22' : 'rgba(230,126,34,0.75)'; }}>
              {biz}
              {value === biz && <Check size={12} color="#e67e22" strokeWidth={2.5} style={{ flexShrink: 0 }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Stripe inner form ────────────────────────────────────────────────────────
function StripePaymentForm({ formData, addOns, total, onSuccess, onBack }: {
  formData: FormData; addOns: AddonId[]; total: number; onSuccess: () => void; onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const selectedAddons = ADDONS.filter(a => addOns.includes(a.id));

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true); setError('');

    const { error: submitErr } = await elements.submit();
    if (submitErr) { setError(submitErr.message ?? 'Payment error.'); setLoading(false); return; }

    let clientSecret: string;
    try {
      const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...formData, addOns }) });
      const json = await res.json();
      if (json.error || !json.clientSecret) { setError(json.error ?? 'Something went wrong.'); setLoading(false); return; }
      clientSecret = json.clientSecret;
    } catch { setError('Network error. Check your connection and try again.'); setLoading(false); return; }

    const { error: confirmErr } = await stripe.confirmPayment({
      elements, clientSecret,
      confirmParams: { return_url: `${window.location.origin}/website-150?paid=1`, payment_method_data: { billing_details: { name: formData.name, email: formData.email, phone: formData.phone } } },
      redirect: 'if_required',
    });
    if (confirmErr) { setError(confirmErr.message ?? 'Payment failed.'); setLoading(false); }
    else { onSuccess(); }
  };

  return (
    <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
      {/* Order summary */}
      <div style={{ background: 'rgba(230,126,34,0.05)', border: '1px solid rgba(230,126,34,0.15)', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ padding: '0.85rem 1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', borderBottom: selectedAddons.length > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-serif)', marginBottom: '0.15rem' }}>Your Order</p>
            <p style={{ fontSize: '0.88rem', color: '#fff', fontFamily: 'var(--font-pjs)', fontWeight: 600, lineHeight: 1.3 }}>Custom Website — 5 Pages · 7-Day Delivery</p>
            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.28)', fontFamily: 'var(--font-pjs)', marginTop: '0.1rem' }}>For {formData.businessName}</p>
          </div>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-serif)', flexShrink: 0, textDecoration: selectedAddons.length > 0 ? 'none' : 'none' }}>$150</span>
        </div>
        {selectedAddons.map(a => (
          <div key={a.id} style={{ padding: '0.6rem 1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-pjs)' }}>{a.emoji} {a.label}</p>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-serif)', flexShrink: 0 }}>+${a.price}</span>
          </div>
        ))}
        <div style={{ padding: '0.85rem 1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', background: 'rgba(230,126,34,0.04)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-serif)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Total Today</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}>${total}</span>
        </div>
      </div>

      <div style={{ padding: '1.1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px' }}>
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      {error && <p style={{ fontSize: '0.84rem', color: '#e74c3c', fontFamily: 'var(--font-pjs)', padding: '0.75rem 1rem', background: 'rgba(231,76,60,0.07)', border: '1px solid rgba(231,76,60,0.2)', borderRadius: '8px', lineHeight: 1.5 }}>{error}</p>}

      <button type="submit" disabled={!stripe || loading} className="btn-hero-primary"
        style={{ width: '100%', padding: '1rem', fontSize: '0.9rem', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: (!stripe || loading) ? 0.6 : 1, cursor: (!stripe || loading) ? 'not-allowed' : 'pointer', border: 'none' }}>
        {loading ? 'Processing…' : `LOCK IN MY SITE — START GETTING CLIENTS →`}
      </button>

      <button type="button" onClick={onBack} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.28)', fontSize: '0.8rem', fontFamily: 'var(--font-pjs)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.1rem 0', margin: '0 auto' }}>
        <ChevronLeft size={13} /> Back to your details
      </button>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem' }}>
        <Lock size={10} color="rgba(255,255,255,0.18)" />
        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.18)', fontFamily: 'var(--font-pjs)' }}>Secured by Stripe · 256-bit SSL · Total: ${total}</span>
      </div>
    </form>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export default function CheckoutModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [addOns, setAddOns] = useState<AddonId[]>(['seo', 'missed-call']);
  const calRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setForm(loadForm()); }, []);
  useEffect(() => { if (Object.values(form).some(v => v !== '')) saveForm(form); }, [form]);

  const stripePromise = useMemo(() => loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''), []);

  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }, []);
  useEffect(() => { const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h); }, [onClose]);

  useEffect(() => {
    if (step !== 3) return;
    const t = setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Cal = (window as any).Cal;
      if (!Cal) return;
      Cal('init', 'checkout-booking', { origin: 'https://app.cal.com' });
      Cal.ns['checkout-booking']('inline', { elementOrSelector: '#cal-inline-booking', calLink: 'kootenay-signal/30min', config: { layout: 'month_view' } });
      Cal.ns['checkout-booking']('ui', { cssVarsPerTheme: { light: { 'cal-brand': '#E3A23A' }, dark: { 'cal-brand': '#E3A23A' } }, hideEventTypeDetails: false });
    }, 350);
    return () => clearTimeout(t);
  }, [step]);

  const addonTotal = ADDONS.filter(a => addOns.includes(a.id)).reduce((s, a) => s + a.price, 0);
  const total = 150 + addonTotal;
  const totalCents = 15000 + ADDONS.filter(a => addOns.includes(a.id)).reduce((s, a) => s + a.priceCents, 0);

  const toggleAddon = (id: AddonId) => setAddOns(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleSuccess = () => { clearForm(); setStep(3); };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.businessName.trim()) e.businessName = 'Required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.businessType) e.businessType = 'Please select your industry';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const stripeOptions: StripeElementsOptionsMode = {
    mode: 'payment', amount: totalCents, currency: 'cad',
    appearance: {
      theme: 'night',
      variables: { colorPrimary: '#e67e22', colorBackground: '#0d1109', colorText: '#f4ece1', colorDanger: '#e74c3c', fontFamily: 'system-ui, sans-serif', borderRadius: '8px', spacingUnit: '4px' },
      rules: { '.Input': { border: '1px solid rgba(255,255,255,0.09)', boxShadow: 'none' }, '.Input:focus': { border: '1px solid rgba(230,126,34,0.5)', boxShadow: 'none' }, '.Label': { color: 'rgba(244,236,225,0.4)', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase' } },
    },
  };

  const inputStyle = (field: keyof FormData): React.CSSProperties => ({
    width: '100%', padding: '0.82rem 1rem', background: 'rgba(255,255,255,0.03)',
    border: `1px solid ${errors[field] ? 'rgba(231,76,60,0.5)' : 'rgba(255,255,255,0.09)'}`,
    borderRadius: '8px', color: '#f4ece1', fontSize: '0.92rem', fontFamily: 'var(--font-pjs)', outline: 'none', transition: 'border-color 0.2s',
  });

  const labelStyle: React.CSSProperties = {
    fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em',
    color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-serif)', display: 'block', marginBottom: '0.4rem',
  };

  const hasSavedData = Object.values(form).some(v => v !== '');
  const STEPS = [{ num: 1, label: 'Your Business' }, { num: 2, label: 'Payment' }, { num: 3, label: 'Book a Call' }] as const;

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(5,8,4,0.9)', backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '1.5rem 1rem', overflowY: 'auto' }}>
      <div style={{ width: '100%', maxWidth: step === 3 ? '660px' : step === 2 ? '580px' : '520px', background: '#0d1109', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px', overflow: 'hidden', position: 'relative', margin: 'auto', transition: 'max-width 0.4s cubic-bezier(0.16,1,0.3,1)' }}>

        {/* Header */}
        <div style={{ padding: '1.75rem 1.75rem 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <p style={{ fontSize: '0.62rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--primary)', fontFamily: 'var(--font-serif)', marginBottom: '0.3rem' }}>Step {step} of 3</p>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-serif)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              {step === 1 && 'Tell Us About Your Business'}
              {step === 2 && `Secure Your Spot — $${total}`}
              {step === 3 && "You're In! Book a Kickoff Call"}
            </h2>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <X size={14} color="rgba(255,255,255,0.4)" />
          </button>
        </div>

        {/* Progress */}
        <div style={{ padding: '0 1.75rem', marginBottom: '1.75rem', display: 'flex', gap: '0.5rem' }}>
          {STEPS.map(s => (
            <div key={s.num} style={{ flex: 1 }}>
              <div style={{ height: '3px', borderRadius: '2px', background: step >= s.num ? 'var(--primary)' : 'rgba(255,255,255,0.07)', transition: 'background 0.4s' }} />
              <p style={{ fontSize: '0.6rem', fontWeight: 700, color: step >= s.num ? 'var(--primary)' : 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-pjs)', marginTop: '0.4rem', letterSpacing: '0.04em' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Body */}
        <div style={{ padding: '0 1.75rem 1.75rem' }}>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {hasSavedData && (
                <div style={{ padding: '0.65rem 1rem', background: 'rgba(230,126,34,0.06)', border: '1px solid rgba(230,126,34,0.18)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                  <p style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-pjs)' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>↩ Progress restored.</span>{' '}Your details were saved from last time.
                  </p>
                  <button onClick={() => { setForm(INITIAL_FORM); clearForm(); }} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.22)', fontSize: '0.7rem', fontFamily: 'var(--font-pjs)', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, textDecoration: 'underline', padding: 0 }}>
                    Start over
                  </button>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={labelStyle}>Your Name *</label>
                  <input type="text" placeholder="Jane Smith" value={form.name} onChange={e => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: undefined }); }} style={inputStyle('name')} />
                  {errors.name && <p style={{ fontSize: '0.7rem', color: '#e74c3c', marginTop: '0.3rem', fontFamily: 'var(--font-pjs)' }}>{errors.name}</p>}
                </div>
                <div>
                  <label style={labelStyle}>Business Name *</label>
                  <input type="text" placeholder="Smith Plumbing" value={form.businessName} onChange={e => { setForm({ ...form, businessName: e.target.value }); setErrors({ ...errors, businessName: undefined }); }} style={inputStyle('businessName')} />
                  {errors.businessName && <p style={{ fontSize: '0.7rem', color: '#e74c3c', marginTop: '0.3rem', fontFamily: 'var(--font-pjs)' }}>{errors.businessName}</p>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input type="email" placeholder="jane@smithplumbing.ca" value={form.email} onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: undefined }); }} style={inputStyle('email')} />
                  {errors.email && <p style={{ fontSize: '0.7rem', color: '#e74c3c', marginTop: '0.3rem', fontFamily: 'var(--font-pjs)' }}>{errors.email}</p>}
                </div>
                <div>
                  <label style={labelStyle}>Phone *</label>
                  <input type="tel" placeholder="250-555-0100" value={form.phone} onChange={e => { setForm({ ...form, phone: e.target.value }); setErrors({ ...errors, phone: undefined }); }} style={inputStyle('phone')} />
                  {errors.phone && <p style={{ fontSize: '0.7rem', color: '#e74c3c', marginTop: '0.3rem', fontFamily: 'var(--font-pjs)' }}>{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Type of Business *</label>
                <BrandedSelect value={form.businessType} onChange={val => { setForm({ ...form, businessType: val }); setErrors({ ...errors, businessType: undefined }); }} hasError={!!errors.businessType} />
                {errors.businessType && <p style={{ fontSize: '0.7rem', color: '#e74c3c', marginTop: '0.3rem', fontFamily: 'var(--font-pjs)' }}>{errors.businessType}</p>}
              </div>

              <div>
                <label style={labelStyle}>Anything else? <span style={{ color: 'rgba(255,255,255,0.18)', fontWeight: 400, textTransform: 'none' }}>(optional)</span></label>
                <textarea placeholder="Services you offer, style preferences, sites you love…" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} style={{ ...inputStyle('notes'), resize: 'vertical', lineHeight: 1.6 }} />
              </div>

              <button onClick={() => { if (validate()) setStep(2); }} className="btn-hero-primary"
                style={{ width: '100%', padding: '1rem', fontSize: '0.92rem', letterSpacing: '0.07em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.35rem', border: 'none', cursor: 'pointer' }}>
                CONTINUE TO PAYMENT <ArrowRight size={16} />
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.74rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-pjs)', lineHeight: 1.5 }}>No payment charged yet — that&apos;s the next step.</p>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

              {/* Upsell add-ons */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <p style={{ fontSize: '0.68rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-serif)' }}>Upgrade Your Package</p>
                  <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-pjs)' }}>Add before paying</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  {ADDONS.map(addon => {
                    const checked = addOns.includes(addon.id);
                    return (
                      <button key={addon.id} type="button" onClick={() => toggleAddon(addon.id)}
                        style={{ width: '100%', textAlign: 'left', padding: '0.9rem 1rem', background: checked ? 'rgba(230,126,34,0.07)' : 'rgba(255,255,255,0.02)', border: `1px solid ${checked ? 'rgba(230,126,34,0.35)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '0.85rem', transition: 'all 0.18s', position: 'relative' }}>
                        {'featured' in addon && addon.featured && (
                          <span style={{ position: 'absolute', top: '-1px', right: '0.75rem', fontSize: '0.55rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#0d1109', background: 'var(--primary)', borderRadius: '0 0 6px 6px', padding: '0.2rem 0.5rem' }}>Most Popular</span>
                        )}
                        <div style={{ width: '20px', height: '20px', borderRadius: '5px', flexShrink: 0, marginTop: '1px', background: checked ? 'var(--primary)' : 'rgba(255,255,255,0.05)', border: `1.5px solid ${checked ? 'var(--primary)' : 'rgba(255,255,255,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.18s' }}>
                          {checked && <Check size={11} color="#fff" strokeWidth={3} />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: checked ? '#fff' : 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-serif)' }}>{addon.emoji} {addon.label}</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-serif)', flexShrink: 0 }}>+${addon.price}</span>
                          </div>
                          <p style={{ fontSize: '0.75rem', color: checked ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-pjs)', lineHeight: 1.5 }}>{addon.detail}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {addOns.length > 0 && (
                  <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.85rem', background: 'rgba(39,174,96,0.05)', border: '1px solid rgba(39,174,96,0.12)', borderRadius: '8px' }}>
                    <Zap size={11} color="var(--accent)" strokeWidth={2.5} />
                    <p style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-pjs)' }}>
                      You&apos;re building a revenue system, not just a website.{' '}
                      <strong style={{ color: 'rgba(255,255,255,0.65)' }}>Total: ${total}</strong>
                    </p>
                  </div>
                )}
              </div>

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

              {/* key=totalCents forces Elements remount when total changes */}
              <Elements key={totalCents} stripe={stripePromise} options={stripeOptions}>
                <StripePaymentForm formData={form} addOns={addOns} total={total} onSuccess={handleSuccess} onBack={() => setStep(1)} />
              </Elements>
            </div>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <div>
              <div style={{ padding: '1rem 1.25rem', background: 'rgba(39,174,96,0.06)', border: '1px solid rgba(39,174,96,0.18)', borderRadius: '10px', display: 'flex', alignItems: 'flex-start', gap: '0.85rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(39,174,96,0.1)', border: '1px solid rgba(39,174,96,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                  <Check size={15} color="var(--accent)" strokeWidth={2.5} />
                </div>
                <div>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-serif)', marginBottom: '0.2rem' }}>Payment confirmed — you&apos;re locked in!</p>
                  <p style={{ fontSize: '0.77rem', color: 'rgba(255,255,255,0.38)', fontFamily: 'var(--font-pjs)', lineHeight: 1.5 }}>Receipt sent to {form.email}. Intake form coming within 24 hrs.</p>
                </div>
              </div>

              {/* Post-purchase upsell */}
              <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(230,126,34,0.18)', borderLeft: '3px solid var(--primary)', borderRadius: '10px', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.58rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--primary)', fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>One-Time Offer · Right Now Only</p>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-serif)', lineHeight: 1.25, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                  Turn This Into a Lead Machine — <span style={{ color: 'var(--primary)' }}>$297</span>
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-pjs)', lineHeight: 1.65, marginBottom: '1rem' }}>
                  You bought the website. This makes it <em style={{ color: 'rgba(255,255,255,0.7)', fontStyle: 'normal', fontWeight: 600 }}>actually bring you jobs</em>. Lead capture, call tracking, automated follow-up — set up alongside your site.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                  {['Lead capture form wired to your inbox + CRM', 'Call tracking — know exactly which jobs came from your site', 'Auto follow-up texts for leads who don\'t call back', 'Simple pipeline so nothing ever slips through the cracks'].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Check size={11} color="var(--accent)" strokeWidth={3} style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '0.79rem', color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-pjs)' }}>{item}</span>
                    </div>
                  ))}
                </div>
                <a href="mailto:hello@kootensaysignal.ca?subject=Lead Machine Add-On — $297" className="btn-hero-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', padding: '0.7rem 1.5rem', textDecoration: 'none', letterSpacing: '0.06em' }}>
                  ADD THIS TO MY ORDER — $297 <ArrowRight size={14} />
                </a>
                <p style={{ marginTop: '0.5rem', fontSize: '0.68rem', color: 'rgba(255,255,255,0.18)', fontFamily: 'var(--font-pjs)' }}>I&apos;ll reach out within 24 hrs to get this set up alongside your site.</p>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-pjs)', lineHeight: 1.75, marginBottom: '1.25rem' }}>
                Pick a time for your <strong style={{ color: '#fff' }}>free 15-minute kickoff call</strong> — we&apos;ll cover your goals, style, and anything specific before I start building.
              </p>
              <div ref={calRef} id="cal-inline-booking" style={{ width: '100%', minHeight: '480px', borderRadius: '10px', overflow: 'hidden', background: 'rgba(255,255,255,0.01)' }} />
              <p style={{ marginTop: '1rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.18)', fontFamily: 'var(--font-pjs)', textAlign: 'center', lineHeight: 1.5 }}>
                Can&apos;t find a time? Skip this — I&apos;ll follow up by email within 24 hours.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
