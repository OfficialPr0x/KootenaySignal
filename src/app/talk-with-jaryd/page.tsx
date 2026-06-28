'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  ArrowRight, ArrowLeft, Check, Phone, Mail, User, Building2,
  Globe, Search, Megaphone, Bot, HelpCircle, CheckCircle2,
  ShieldCheck, Clock, Star, CalendarCheck,
} from 'lucide-react';

const CAL_LINK = 'kootenay-signal/30min';
const CAL_NAMESPACE = '30min';
const JARYD_IMG = 'https://res.cloudinary.com/doajstql7/image/upload/v1776285464/ChatGPT_Image_Apr_12_2026_11_04_25_PM_xi7ewb.png';

type GoalId = 'leads' | 'website' | 'seo' | 'ads' | 'automation' | 'unsure';

const GOALS: { id: GoalId; label: string; desc: string; Icon: React.ElementType }[] = [
  { id: 'leads', label: 'More calls & leads', desc: 'Get the phone ringing daily', Icon: Phone },
  { id: 'website', label: 'A new website', desc: 'Look legit & convert visitors', Icon: Globe },
  { id: 'seo', label: 'Rank higher on Google', desc: 'Show up when they search', Icon: Search },
  { id: 'ads', label: 'Run paid ads', desc: 'Instant leads, done right', Icon: Megaphone },
  { id: 'automation', label: 'Automate follow-ups', desc: 'Never lose a lead again', Icon: Bot },
  { id: 'unsure', label: 'Not sure yet', desc: 'I just need direction', Icon: HelpCircle },
];

const INDUSTRIES = [
  'Trades / Contractor', 'Restaurant / Café', 'Retail / Boutique', 'Salon / Beauty',
  'Auto / Mechanic', 'Real Estate', 'Fitness / Health', 'Cleaning', 'Other',
];

const REVENUE = [
  'Just starting out', 'Under $10k / mo', '$10k–$30k / mo', '$30k–$75k / mo', '$75k+ / mo',
];

const STEPS = ['About You', 'Your Goals', 'Pick a Time'];

export default function TalkWithJaryd() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
    industry: '',
    goals: [] as GoalId[],
    revenue: '',
    challenge: '',
  });
  const [touched, setTouched] = useState(false);
  const calReady = useRef(false);
  const embedRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleGoal = (id: GoalId) =>
    setForm((f) => ({
      ...f,
      goals: f.goals.includes(id) ? f.goals.filter((g) => g !== id) : [...f.goals, id],
    }));

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const step1Valid = form.firstName.trim().length > 1 && emailValid && form.businessName.trim().length > 0;
  const step2Valid = form.goals.length > 0;

  // ─── Init Cal.com embed script once ───
  useEffect(() => {
    if (calReady.current) return;
    calReady.current = true;
    /* eslint-disable @typescript-eslint/no-explicit-any */
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
    (window as any).Cal('init', CAL_NAMESPACE, { origin: 'https://app.cal.com' });
    (window as any).Cal.ns[CAL_NAMESPACE]('ui', {
      cssVarsPerTheme: { light: { 'cal-brand': '#E3A23A' }, dark: { 'cal-brand': '#0F2A24' } },
      hideEventTypeDetails: false,
      layout: 'month_view',
    });
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }, []);

  // ─── Render inline embed (prefilled) when reaching step 3 ───
  useEffect(() => {
    if (step !== 3 || !embedRef.current) return;

    const name = `${form.firstName} ${form.lastName}`.trim();
    const goalLabels = form.goals.map((g) => GOALS.find((x) => x.id === g)?.label).filter(Boolean);
    const notes = [
      `Business: ${form.businessName}`,
      form.industry && `Industry: ${form.industry}`,
      goalLabels.length ? `Wants help with: ${goalLabels.join(', ')}` : '',
      form.revenue && `Monthly revenue: ${form.revenue}`,
      form.phone && `Phone: ${form.phone}`,
      form.challenge && `Biggest challenge: ${form.challenge}`,
    ].filter(Boolean).join('\n');

    // Reset container so we never stack iframes on back/forward navigation
    embedRef.current.innerHTML = '';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Cal = (window as any).Cal;
    if (!Cal?.ns?.[CAL_NAMESPACE]) return;

    Cal.ns[CAL_NAMESPACE]('inline', {
      elementOrSelector: embedRef.current,
      calLink: CAL_LINK,
      config: {
        layout: 'month_view',
        name,
        email: form.email.trim(),
        notes,
        ...(form.phone ? { smsReminderNumber: form.phone.trim() } : {}),
      },
    });
  }, [step, form]);

  const goNext = () => {
    setTouched(true);
    if (step === 1 && !step1Valid) return;
    if (step === 2 && !step2Valid) return;
    setTouched(false);
    setStep((s) => Math.min(3, s + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const goBack = () => {
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="twj-page">
      {/* Ambient glow */}
      <div className="twj-glow" />

      <div className="twj-shell">
        {/* ─── Left rail — context / trust ─── */}
        <aside className="twj-rail">
          <div className="twj-rail-inner">
            <span className="badge" style={{ marginBottom: '1.75rem' }}>Free Strategy Call</span>
            <h1 className="twj-rail-title">
              Let&apos;s map out your<br />
              <span className="text-gradient-hero">next 90 days.</span>
            </h1>
            <p className="twj-rail-sub">
              Three quick questions, then grab a time that works. On the call, Jaryd breaks down
              exactly what&apos;s costing you business — and the fastest way to fix it.
            </p>

            <div className="twj-founder">
              <div className="twj-founder-img">
                <Image src={JARYD_IMG} alt="Jaryd Paquette — Kootenay Signal" fill style={{ objectFit: 'cover' }} />
              </div>
              <div>
                <p className="twj-founder-name">Jaryd Paquette</p>
                <p className="twj-founder-role">Founder · Kootenay Signal</p>
              </div>
            </div>

            <ul className="twj-trust">
              {[
                { Icon: Clock, t: '30 minutes', d: 'No pressure, no hard sell' },
                { Icon: ShieldCheck, t: 'Built by a tradesman', d: 'Not an agency. Straight talk only.' },
                { Icon: Star, t: 'Local to the Kootenays', d: 'I know your market & competition' },
              ].map(({ Icon, t, d }, i) => (
                <li key={i}>
                  <span className="twj-trust-ico"><Icon size={16} /></span>
                  <span>
                    <strong>{t}</strong>
                    <em>{d}</em>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* ─── Right — the funnel ─── */}
        <section className="twj-funnel">
          {/* Progress */}
          <div className="twj-progress">
            {STEPS.map((label, i) => {
              const n = i + 1;
              const state = n < step ? 'done' : n === step ? 'active' : 'idle';
              return (
                <React.Fragment key={label}>
                  <div className={`twj-prog-step twj-prog-step--${state}`}>
                    <span className="twj-prog-dot">{n < step ? <Check size={14} strokeWidth={3} /> : n}</span>
                    <span className="twj-prog-label">{label}</span>
                  </div>
                  {i < STEPS.length - 1 && <span className={`twj-prog-line ${n < step ? 'twj-prog-line--done' : ''}`} />}
                </React.Fragment>
              );
            })}
          </div>

          {/* Step content */}
          <div className="twj-step" key={step}>
            {step === 1 && (
              <>
                <div className="twj-step-head">
                  <p className="twj-step-eyebrow">Step 1 of 3</p>
                  <h2 className="twj-step-title">Who am I talking to?</h2>
                  <p className="twj-step-desc">The basics so I can prep before we hop on the call.</p>
                </div>

                <div className="twj-fields">
                  <div className="twj-row">
                    <Field label="First name" required>
                      <div className="twj-input-wrap">
                        <User size={16} className="twj-input-ico" />
                        <input
                          className="twj-input" type="text" placeholder="Jaryd"
                          value={form.firstName} onChange={(e) => set('firstName', e.target.value)}
                        />
                      </div>
                    </Field>
                    <Field label="Last name">
                      <div className="twj-input-wrap">
                        <User size={16} className="twj-input-ico" />
                        <input
                          className="twj-input" type="text" placeholder="Paquette"
                          value={form.lastName} onChange={(e) => set('lastName', e.target.value)}
                        />
                      </div>
                    </Field>
                  </div>

                  <Field label="Email" required error={touched && form.email.length > 0 && !emailValid ? 'Enter a valid email' : ''}>
                    <div className="twj-input-wrap">
                      <Mail size={16} className="twj-input-ico" />
                      <input
                        className="twj-input" type="email" placeholder="you@business.com"
                        value={form.email} onChange={(e) => set('email', e.target.value)}
                      />
                    </div>
                  </Field>

                  <div className="twj-row">
                    <Field label="Phone">
                      <div className="twj-input-wrap">
                        <Phone size={16} className="twj-input-ico" />
                        <input
                          className="twj-input" type="tel" placeholder="(250) 000-0000"
                          value={form.phone} onChange={(e) => set('phone', e.target.value)}
                        />
                      </div>
                    </Field>
                    <Field label="Business name" required>
                      <div className="twj-input-wrap">
                        <Building2 size={16} className="twj-input-ico" />
                        <input
                          className="twj-input" type="text" placeholder="Mountain Peak Plumbing"
                          value={form.businessName} onChange={(e) => set('businessName', e.target.value)}
                        />
                      </div>
                    </Field>
                  </div>
                </div>

                {touched && !step1Valid && (
                  <p className="twj-validation">Add your name, a valid email, and your business name to continue.</p>
                )}
              </>
            )}

            {step === 2 && (
              <>
                <div className="twj-step-head">
                  <p className="twj-step-eyebrow">Step 2 of 3</p>
                  <h2 className="twj-step-title">What are you after?</h2>
                  <p className="twj-step-desc">Pick everything that applies — this shapes our whole conversation.</p>
                </div>

                <div className="twj-goals">
                  {GOALS.map(({ id, label, desc, Icon }) => {
                    const active = form.goals.includes(id);
                    return (
                      <button
                        type="button" key={id}
                        className={`twj-goal ${active ? 'twj-goal--active' : ''}`}
                        onClick={() => toggleGoal(id)}
                      >
                        <span className="twj-goal-ico"><Icon size={20} strokeWidth={1.75} /></span>
                        <span className="twj-goal-text">
                          <strong>{label}</strong>
                          <em>{desc}</em>
                        </span>
                        <span className="twj-goal-check">{active && <Check size={13} strokeWidth={3} />}</span>
                      </button>
                    );
                  })}
                </div>

                <Field label="What industry are you in?">
                  <div className="twj-chips">
                    {INDUSTRIES.map((ind) => (
                      <button
                        type="button" key={ind}
                        className={`twj-chip ${form.industry === ind ? 'twj-chip--active' : ''}`}
                        onClick={() => set('industry', form.industry === ind ? '' : ind)}
                      >
                        {ind}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Roughly where's your revenue at? (optional)">
                  <div className="twj-chips">
                    {REVENUE.map((r) => (
                      <button
                        type="button" key={r}
                        className={`twj-chip ${form.revenue === r ? 'twj-chip--active' : ''}`}
                        onClick={() => set('revenue', form.revenue === r ? '' : r)}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Biggest thing holding you back right now? (optional)">
                  <textarea
                    className="twj-textarea" rows={3}
                    placeholder="e.g. The phone just isn't ringing, my site looks dated, I'm losing jobs to competitors who show up first…"
                    value={form.challenge} onChange={(e) => set('challenge', e.target.value)}
                  />
                </Field>

                {touched && !step2Valid && (
                  <p className="twj-validation">Pick at least one goal so we know where to focus.</p>
                )}
              </>
            )}

            {step === 3 && (
              <>
                <div className="twj-step-head">
                  <p className="twj-step-eyebrow">Step 3 of 3</p>
                  <h2 className="twj-step-title">Lock in your call, {form.firstName || 'friend'}.</h2>
                  <p className="twj-step-desc">Pick a time below — your details are already attached, so there&apos;s nothing else to type.</p>
                </div>

                <div className="twj-summary">
                  <CheckCircle2 size={18} className="twj-summary-ico" />
                  <div>
                    <p className="twj-summary-title">{form.businessName} — locked & loaded</p>
                    <p className="twj-summary-meta">
                      {[form.industry, form.goals.map((g) => GOALS.find((x) => x.id === g)?.label).join(', ')]
                        .filter(Boolean).join(' · ') || 'Free 30-minute strategy call'}
                    </p>
                  </div>
                  <button type="button" className="twj-summary-edit" onClick={() => { setStep(1); window.scrollTo({ top: 0 }); }}>
                    Edit
                  </button>
                </div>

                <div className="twj-cal-frame">
                  <div ref={embedRef} className="twj-cal-embed" />
                </div>
              </>
            )}
          </div>

          {/* Nav */}
          {step < 3 && (
            <div className="twj-nav">
              {step > 1 ? (
                <button type="button" className="twj-back" onClick={goBack}>
                  <ArrowLeft size={16} /> Back
                </button>
              ) : <span />}
              <button type="button" className="btn-hero-primary twj-continue" onClick={goNext}>
                {step === 2 ? (
                  <>See Available Times <CalendarCheck size={17} style={{ marginLeft: '0.55rem' }} /></>
                ) : (
                  <>Continue <ArrowRight size={17} style={{ marginLeft: '0.55rem' }} /></>
                )}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="twj-nav">
              <button type="button" className="twj-back" onClick={goBack}>
                <ArrowLeft size={16} /> Back
              </button>
              <span className="twj-reassure">No-show? No problem — reschedule anytime.</span>
            </div>
          )}
        </section>
      </div>

      <style>{`
        .twj-page {
          position: relative;
          min-height: 100vh;
          background: var(--background);
          color: var(--foreground);
          overflow: hidden;
          padding: clamp(5rem, 9vw, 7rem) 0 4rem;
        }
        .twj-glow {
          position: absolute; top: -10%; left: 50%; transform: translateX(-50%);
          width: 90vw; height: 70vw; max-width: 1100px;
          background: radial-gradient(circle, rgba(230,126,34,0.08) 0%, transparent 60%);
          filter: blur(70px); pointer-events: none; z-index: 0;
        }
        .twj-shell {
          position: relative; z-index: 1;
          max-width: 1180px; margin: 0 auto;
          padding: 0 clamp(1rem, 4vw, 2.5rem);
          display: grid; grid-template-columns: 0.85fr 1.15fr;
          gap: clamp(2rem, 5vw, 4.5rem); align-items: start;
        }

        /* ── Left rail ── */
        .twj-rail-inner { position: sticky; top: 6rem; }
        .twj-rail-title {
          font-size: clamp(2rem, 3.6vw, 3rem); line-height: 1.05;
          letter-spacing: -0.03em; color: #fff; margin-bottom: 1.25rem;
        }
        .twj-rail-sub {
          font-size: 1rem; color: rgba(255,255,255,0.5);
          font-family: var(--font-pjs); line-height: 1.75; margin-bottom: 2.5rem; max-width: 420px;
        }
        .twj-founder {
          display: flex; align-items: center; gap: 0.9rem;
          padding: 1rem 1.1rem; background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; margin-bottom: 2rem; max-width: 420px;
        }
        .twj-founder-img {
          position: relative; width: 52px; height: 52px; border-radius: 50%;
          overflow: hidden; flex-shrink: 0; border: 1px solid rgba(230,126,34,0.3);
        }
        .twj-founder-name { font-size: 0.95rem; font-weight: 800; color: #fff; font-family: var(--font-serif); margin: 0; }
        .twj-founder-role { font-size: 0.78rem; color: var(--primary); font-family: var(--font-pjs); margin: 0.1rem 0 0; }
        .twj-trust { list-style: none; display: flex; flex-direction: column; gap: 1rem; max-width: 420px; }
        .twj-trust li { display: flex; gap: 0.85rem; align-items: flex-start; }
        .twj-trust-ico {
          width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
          background: rgba(230,126,34,0.08); border: 1px solid rgba(230,126,34,0.18);
          color: var(--primary); display: flex; align-items: center; justify-content: center;
        }
        .twj-trust strong { display: block; font-size: 0.92rem; color: #fff; font-family: var(--font-serif); font-weight: 700; }
        .twj-trust em { display: block; font-size: 0.82rem; color: rgba(255,255,255,0.4); font-family: var(--font-pjs); font-style: normal; margin-top: 0.1rem; }

        /* ── Funnel card ── */
        .twj-funnel {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: clamp(1.5rem, 3vw, 2.75rem);
          box-shadow: 0 30px 80px rgba(0,0,0,0.35);
        }

        /* Progress */
        .twj-progress { display: flex; align-items: center; margin-bottom: 2.25rem; }
        .twj-prog-step { display: flex; align-items: center; gap: 0.6rem; }
        .twj-prog-dot {
          width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.82rem; font-weight: 800; font-family: var(--font-serif);
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.4); transition: all 0.3s ease;
        }
        .twj-prog-label { font-size: 0.82rem; font-weight: 700; font-family: var(--font-pjs); color: rgba(255,255,255,0.4); white-space: nowrap; transition: color 0.3s ease; }
        .twj-prog-step--active .twj-prog-dot { background: var(--primary); border-color: var(--primary); color: #fff; box-shadow: 0 0 0 4px rgba(230,126,34,0.15); }
        .twj-prog-step--active .twj-prog-label { color: #fff; }
        .twj-prog-step--done .twj-prog-dot { background: rgba(230,126,34,0.15); border-color: var(--primary); color: var(--primary); }
        .twj-prog-step--done .twj-prog-label { color: rgba(255,255,255,0.6); }
        .twj-prog-line { flex: 1; height: 2px; margin: 0 0.65rem; background: rgba(255,255,255,0.08); border-radius: 2px; transition: background 0.4s ease; min-width: 16px; }
        .twj-prog-line--done { background: var(--primary); }

        /* Step */
        .twj-step { animation: twjIn 0.45s cubic-bezier(0.16,1,0.3,1); }
        @keyframes twjIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        .twj-step-head { margin-bottom: 1.75rem; }
        .twj-step-eyebrow { font-size: 0.68rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.22em; color: var(--primary); margin-bottom: 0.6rem; font-family: var(--font-pjs); }
        .twj-step-title { font-size: clamp(1.5rem, 3vw, 2rem); line-height: 1.1; color: #fff; margin-bottom: 0.5rem; }
        .twj-step-desc { font-size: 0.95rem; color: rgba(255,255,255,0.45); font-family: var(--font-pjs); line-height: 1.6; }

        /* Fields */
        .twj-fields { display: flex; flex-direction: column; gap: 1.25rem; }
        .twj-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .twj-field-label { display: block; font-size: 0.78rem; font-weight: 700; color: rgba(255,255,255,0.55); font-family: var(--font-pjs); margin-bottom: 0.5rem; }
        .twj-field-label span { color: var(--primary); }
        .twj-input-wrap { position: relative; display: flex; align-items: center; }
        .twj-input-ico { position: absolute; left: 0.9rem; color: rgba(255,255,255,0.3); pointer-events: none; }
        .twj-input {
          width: 100%; padding: 0.85rem 1rem 0.85rem 2.6rem;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; color: #fff; font-size: 0.95rem; font-family: var(--font-pjs);
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .twj-input::placeholder { color: rgba(255,255,255,0.25); }
        .twj-input:focus { outline: none; border-color: var(--primary); background: rgba(230,126,34,0.04); }
        .twj-textarea {
          width: 100%; padding: 0.85rem 1rem; resize: vertical; min-height: 84px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; color: #fff; font-size: 0.95rem; font-family: var(--font-pjs); line-height: 1.55;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .twj-textarea::placeholder { color: rgba(255,255,255,0.25); }
        .twj-textarea:focus { outline: none; border-color: var(--primary); background: rgba(230,126,34,0.04); }
        .twj-field-err { font-size: 0.75rem; color: #e07b53; font-family: var(--font-pjs); margin-top: 0.4rem; }
        /* Standalone fields (step 2) get vertical rhythm; rows & grouped fields rely on gap */
        .twj-field { margin-top: 1.5rem; }
        .twj-fields .twj-field, .twj-row .twj-field, .twj-field:first-child { margin-top: 0; }

        /* Goals */
        .twj-goals { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.5rem; }
        .twj-goal {
          display: flex; align-items: center; gap: 0.85rem; text-align: left;
          padding: 1rem 1.1rem; background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; cursor: pointer;
          transition: all 0.2s ease; position: relative;
        }
        .twj-goal:hover { border-color: rgba(230,126,34,0.3); background: rgba(230,126,34,0.03); }
        .twj-goal--active { border-color: var(--primary); background: rgba(230,126,34,0.07); }
        .twj-goal-ico {
          width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(230,126,34,0.1); border: 1px solid rgba(230,126,34,0.18); color: var(--primary);
        }
        .twj-goal-text { display: flex; flex-direction: column; flex: 1; min-width: 0; }
        .twj-goal-text strong { font-size: 0.9rem; font-weight: 700; color: #fff; font-family: var(--font-serif); line-height: 1.25; }
        .twj-goal-text em { font-size: 0.78rem; color: rgba(255,255,255,0.4); font-family: var(--font-pjs); font-style: normal; margin-top: 0.15rem; }
        .twj-goal-check {
          width: 20px; height: 20px; border-radius: 6px; flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center;
          color: #fff; transition: all 0.2s ease;
        }
        .twj-goal--active .twj-goal-check { background: var(--primary); border-color: var(--primary); }

        /* Chips */
        .twj-chips { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .twj-chip {
          padding: 0.55rem 1rem; border-radius: 50px; cursor: pointer;
          font-size: 0.82rem; font-weight: 600; font-family: var(--font-pjs);
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6); transition: all 0.2s ease;
        }
        .twj-chip:hover { border-color: rgba(230,126,34,0.3); color: #fff; }
        .twj-chip--active { background: rgba(230,126,34,0.12); border-color: var(--primary); color: var(--primary); }

        /* Validation */
        .twj-validation { margin-top: 1.25rem; font-size: 0.82rem; color: #e07b53; font-family: var(--font-pjs); }

        /* Summary (step 3) */
        .twj-summary {
          display: flex; align-items: center; gap: 0.85rem;
          padding: 1rem 1.25rem; background: rgba(230,126,34,0.06);
          border: 1px solid rgba(230,126,34,0.2); border-radius: 12px; margin-bottom: 1.5rem;
        }
        .twj-summary-ico { color: var(--accent); flex-shrink: 0; }
        .twj-summary-title { font-size: 0.92rem; font-weight: 700; color: #fff; font-family: var(--font-serif); margin: 0; }
        .twj-summary-meta { font-size: 0.8rem; color: rgba(255,255,255,0.5); font-family: var(--font-pjs); margin: 0.15rem 0 0; }
        .twj-summary-edit {
          margin-left: auto; flex-shrink: 0; background: transparent; border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.6); border-radius: 7px; padding: 0.4rem 0.85rem; font-size: 0.78rem;
          font-weight: 600; cursor: pointer; font-family: var(--font-pjs); transition: all 0.2s ease;
        }
        .twj-summary-edit:hover { border-color: var(--primary); color: var(--primary); }

        /* Cal embed */
        .twj-cal-frame {
          border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; overflow: hidden;
          background: rgba(255,255,255,0.015); min-height: 560px;
        }
        .twj-cal-embed { width: 100%; min-height: 560px; height: 100%; overflow: auto; }

        /* Nav */
        .twj-nav { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 2rem; }
        .twj-back {
          display: inline-flex; align-items: center; gap: 0.4rem; background: transparent; border: none;
          color: rgba(255,255,255,0.45); font-size: 0.88rem; font-weight: 600; cursor: pointer;
          font-family: var(--font-pjs); padding: 0.5rem 0; transition: color 0.2s ease;
        }
        .twj-back:hover { color: #fff; }
        .twj-continue { font-size: 0.92rem; padding: 1rem 2.25rem; }
        .twj-reassure { font-size: 0.8rem; color: rgba(255,255,255,0.3); font-family: var(--font-pjs); }

        /* Responsive */
        @media (max-width: 980px) {
          .twj-shell { grid-template-columns: 1fr; gap: 2.5rem; }
          .twj-rail-inner { position: static; }
          .twj-rail-title { font-size: clamp(1.9rem, 7vw, 2.6rem); }
          .twj-trust { flex-direction: row; flex-wrap: wrap; max-width: none; }
          .twj-trust li { flex: 1; min-width: 200px; }
        }
        @media (max-width: 560px) {
          .twj-row, .twj-goals { grid-template-columns: 1fr; }
          .twj-funnel { padding: 1.25rem 1.1rem; border-radius: 16px; }
          .twj-prog-label { display: none; }
          .twj-prog-line { margin: 0 0.4rem; }
          .twj-continue { padding: 0.9rem 1.5rem; font-size: 0.85rem; }
          .twj-summary-edit { display: none; }
        }
      `}</style>
    </main>
  );
}

function Field({
  label, required, error, children,
}: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="twj-field">
      <label className="twj-field-label">
        {label}{required && <span> *</span>}
      </label>
      {children}
      {error && <p className="twj-field-err">{error}</p>}
    </div>
  );
}
