'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Zap, FileText, Bell, Star, Layers, Monitor } from 'lucide-react';
import { useScrollReveal, useScrollRevealBidirectional, fadeUp, scaleUp } from '@/hooks/useScrollReveal';
import AnimatedText from '@/components/AnimatedText';
import IpadMockup from '@/components/iPadMockup';
import QuotingApp from '@/components/QuotingApp';
import PitchApp from '@/components/PitchApp';
import SpaceBackground from '@/components/SpaceBackground';

/* ─── Feature grid item ──────────────────────────────────────────────────── */
function Feature({ icon, title, desc, accent }: { icon: React.ReactNode; title: string; desc: string; accent: string }) {
  return (
    <div
      style={{
        padding: '1.5rem',
        borderRadius: '16px',
        background: `${accent}08`,
        border: `1px solid ${accent}18`,
        transition: 'transform 0.28s cubic-bezier(0.22,1,0.36,1), box-shadow 0.28s ease, background 0.28s ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = `0 16px 40px ${accent}20`;
        e.currentTarget.style.background = `${accent}12`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.background = `${accent}08`;
      }}
    >
      <div style={{
        width: '38px', height: '38px', borderRadius: '10px',
        background: `${accent}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: accent, marginBottom: '0.875rem',
      }}>
        {icon}
      </div>
      <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'white', marginBottom: '0.4rem' }}>
        {title}
      </div>
      <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', lineHeight: '1.65' }}>
        {desc}
      </p>
    </div>
  );
}

/* ─── Demo data ──────────────────────────────────────────────────────────── */
interface DemoStep { tag: string; title: string; desc: string; bullets: string[]; }
interface QuotingDemoStep extends DemoStep { tab: 'dashboard' | 'quote' | 'jobs' | 'followup' | 'estimate'; }
interface PitchDemoStep extends DemoStep { slide: number; }

const QUOTING_STEPS: QuotingDemoStep[] = [
  { tab: 'dashboard', tag: 'Live Dashboard', title: 'Every metric,\nat a glance.', desc: 'Revenue, open quotes, follow-ups, and new reviews updated in real time, no more switching between platforms.', bullets: ['$89.3K tracked this month', '12 open quotes monitored', '7 follow-ups queued automatically'] },
  { tab: 'quote', tag: 'Quote Builder', title: 'Quote built\nbefore you leave.', desc: 'Add line items from your pre-built catalog, adjust quantities, and fire off a professional quote at the door.', bullets: ['Pre-loaded pricing catalog', 'Live total calculation', 'One-tap send via SMS or email'] },
  { tab: 'jobs', tag: 'Job Pipeline', title: 'Every job,\nevery status.', desc: 'See every active quote with its current status and dollar value. Viewed, signed, or cold, you always know.', bullets: ['Color-coded job statuses', 'Dollar value at a glance', 'Tap any job to act instantly'] },
  { tab: 'estimate', tag: 'Sign & Send', title: 'Signed on iPad.\nIn their inbox in minutes.', desc: 'Your rep collects a signature right on the iPad. It auto-uploads into a branded PDF and hits the customer\'s phone in seconds. Contractors who send same-day estimates close 3 to 4 times more jobs.', bullets: ['Digital signature collected on the iPad', 'Auto-uploads into branded PDF instantly', 'Customer copy delivered in minutes'] },
  { tab: 'followup', tag: 'Automation', title: 'Follow-ups that\nrun while you sleep.', desc: 'When a quote goes cold, timed SMS and email sequences fire automatically. Your team focuses on closing, not chasing.', bullets: ['Multi-touch: 24h, 72h, 7-day triggers', 'Auto-fires on quote status change', 'Progress tracked per contact'] },
];

const PITCH_STEPS: PitchDemoStep[] = [
  { slide: 0, tag: 'Brand Intro', title: 'Walk in with\na presentation.', desc: 'Customers trust what they can see. Open with a branded, customer-personalized intro before you say a word.', bullets: ['Personalized per customer name', 'Your logo, brand, and photos', 'Credibility built on slide one'] },
  { slide: 2, tag: 'Your Process', title: 'Show them exactly\nwhat happens.', desc: 'A clear 4-step walkthrough eliminates objections before they\'re even asked. Transparency closes deals.', bullets: ['Step-by-step visual timeline', 'Removes friction and uncertainty', 'Sets professional expectations early'] },
  { slide: 7, tag: 'Project Gallery', title: 'Proof they\ncan see.', desc: 'Six project photos built right into the presentation. Real jobs that close deals by letting your work speak.', bullets: ['Full-bleed project photos', 'Labeled by service type', 'Always current from your portfolio'] },
  { slide: 6, tag: 'Pricing Tiers', title: 'Good, Better,\nBest pricing.', desc: 'Present three tiers so the customer picks a level, not whether to buy. Proven to increase average ticket 34%.', bullets: ['Interactive tier selection', 'Monthly pricing displayed clearly', 'No long-term contract messaging'] },
  { slide: 9, tag: 'E-Signature', title: 'Close the deal\non the spot.', desc: 'The final slide collects a digital signature and submits the contract. Signed and scheduled before you leave.', bullets: ['Tap-to-sign on the iPad', 'Full contract summary visible', 'Instant confirmation sent'] },
];

/* ─── Watch Demo button ──────────────────────────────────────────────────── */
function WatchDemoBtn({ onClick, accent }: { onClick: () => void; accent: string }) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginTop: '2rem' }}>
      <span style={{ position: 'absolute', inset: '-8px', borderRadius: '100px', border: `1px solid ${accent}55`, animation: 'demoPulseA 2.6s ease-out infinite', pointerEvents: 'none' }} />
      <span style={{ position: 'absolute', inset: '-8px', borderRadius: '100px', border: `1px solid ${accent}35`, animation: 'demoPulseA 2.6s ease-out 1s infinite', pointerEvents: 'none' }} />
      <button
        onClick={onClick}
        style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '11px 22px', borderRadius: '100px', background: 'transparent', border: `1.5px solid ${accent}45`, color: accent, fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.01em', transition: 'all 0.25s' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = `${accent}12`; e.currentTarget.style.borderColor = `${accent}80`; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = `${accent}45`; }}
      >
        <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: `${accent}20`, border: `1px solid ${accent}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="7" height="9" viewBox="0 0 7 9" fill="none"><path d="M1 1l5 3.5L1 8V1z" fill={accent} /></svg>
        </span>
        Watch Demo
      </button>
    </div>
  );
}

/* ─── Demo overlay ───────────────────────────────────────────────────────── */
function SoftwareDemoOverlay({ open, onClose, ipadSide, accent, steps, step, onStep, ipadContent }: {
  open: boolean; onClose: () => void; ipadSide: 'left' | 'right'; accent: string;
  steps: DemoStep[]; step: number; onStep: (n: number) => void; ipadContent: React.ReactNode;
}): React.ReactPortal | null {
  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && step < steps.length - 1) onStep(step + 1);
      if (e.key === 'ArrowLeft' && step > 0) onStep(step - 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, step, steps.length, onClose, onStep]);

  const [activityTs, setActivityTs] = useState(0);
  const handleActivity = () => setActivityTs(Date.now());

  // Autoplay: advance after 5.5s of idle; resets on any user interaction or step change
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      onStep(step < steps.length - 1 ? step + 1 : 0);
    }, 5500);
    return () => clearTimeout(t);
  }, [open, step, activityTs, steps.length, onStep]);

  if (!open || typeof document === 'undefined') return null;
  const isLeft = ipadSide === 'left';

  const textPanel = (
    <div style={{ flex: '0 0 36%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2.5rem 3rem', position: 'relative', zIndex: 10, pointerEvents: 'auto', animation: 'demoFadeUp 0.5s ease 0.2s both' }}>
      <div key={step} style={{ animation: 'demoStepIn 0.38s cubic-bezier(0.22,1,0.36,1) both' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '100px', background: `${accent}14`, border: `1px solid ${accent}28`, marginBottom: '1.5rem' }}>
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent }} />
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: accent, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>{steps[step].tag}</span>
        </div>
        <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.2)', fontWeight: 600, letterSpacing: '0.12em', marginBottom: '0.6rem', textTransform: 'uppercase' as const }}>
          {String(step + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
        </div>
        <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(1.7rem, 2.4vw, 2.2rem)', fontWeight: 800, color: 'white', lineHeight: 1.12, letterSpacing: '-0.03em', margin: '0 0 1rem', whiteSpace: 'pre-line' as const }}>
          {steps[step].title}
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.42)', lineHeight: '1.75', margin: '0 0 1.75rem' }}>
          {steps[step].desc}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px', marginBottom: '2.5rem' }}>
          {steps[step].bullets.map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: `${accent}14`, border: `1px solid ${accent}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="8" height="7" viewBox="0 0 8 7" fill="none"><path d="M1.5 3.5L3.2 5.2L6.5 1.8" stroke={accent} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{b}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {steps.map((_, i) => (
              <button key={i} onClick={() => { onStep(i); handleActivity(); }} style={{ width: i === step ? '22px' : '6px', height: '6px', borderRadius: '100px', background: i === step ? accent : 'rgba(255,255,255,0.18)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)' }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => { if (step > 0) { onStep(step - 1); handleActivity(); } }} disabled={step === 0} style={{ width: '36px', height: '36px', borderRadius: '50%', background: step === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: step === 0 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.65)', cursor: step === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', fontSize: '1rem' }}>←</button>
            <button onClick={() => { if (step < steps.length - 1) { onStep(step + 1); handleActivity(); } }} disabled={step === steps.length - 1} style={{ width: '36px', height: '36px', borderRadius: '50%', background: step === steps.length - 1 ? 'rgba(255,255,255,0.04)' : `${accent}20`, border: `1px solid ${step === steps.length - 1 ? 'rgba(255,255,255,0.1)' : accent + '40'}`, color: step === steps.length - 1 ? 'rgba(255,255,255,0.18)' : accent, cursor: step === steps.length - 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', fontSize: '1rem' }}>→</button>
          </div>
        </div>
      </div>
    </div>
  );

  const ipadPanel = (
    <div style={{ flex: '0 0 64%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', animation: 'demoIpadIn 0.55s cubic-bezier(0.22,1,0.36,1) both' }}>
      <div style={{ width: '100%', maxWidth: '700px', cursor: 'default' }}>{ipadContent}</div>
      {/* Interact hint */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '1.25rem', padding: '6px 14px', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', animation: 'demoFadeUp 0.5s ease 1.2s both' }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.5 }}>
          <path d="M5 1v4H1m0 0l4-4m-4 4l4 4" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="6" y="6" width="5" height="5" rx="1" stroke="white" strokeWidth="1.3" opacity="0.5"/>
        </svg>
        <span style={{ fontSize: '0.67rem', color: 'rgba(255,255,255,0.35)', fontWeight: 500, letterSpacing: '0.04em' }}>Live &amp; interactive, click around</span>
      </div>
    </div>
  );

  return createPortal(
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', background: 'rgba(4,7,11,0.94)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)', animation: 'demoBackdropIn 0.3s ease both' }}
      onMouseMove={handleActivity}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', animation: 'demoFadeUp 0.4s ease 0.2s both' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: accent, display: 'block', animation: 'demoDot 2s ease-in-out infinite' }} />
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Interactive Demo</span>
        </div>
        <button
          onClick={onClose}
          style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', transition: 'all 0.15s' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
        >✕</button>
      </div>
      <div
        style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', maxWidth: '1380px', margin: '0 auto', padding: '72px 2rem 2rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        {isLeft ? <>{ipadPanel}{textPanel}</> : <>{textPanel}{ipadPanel}</>}
      </div>
      <style>{`
        @keyframes demoBackdropIn { from { opacity:0 } to { opacity:1 } }
        @keyframes demoIpadIn { from { opacity:0; transform:scale(0.87) translateY(22px) } to { opacity:1; transform:scale(1) translateY(0) } }
        @keyframes demoSlideR { from { opacity:0; transform:translateX(32px) } to { opacity:1; transform:translateX(0) } }
        @keyframes demoSlideL { from { opacity:0; transform:translateX(-32px) } to { opacity:1; transform:translateX(0) } }
        @keyframes demoStepIn { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
        @keyframes demoFadeUp { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes demoDot { 0%,100% { opacity:1 } 50% { opacity:0.3 } }
      `}</style>
    </div>,
    document.body
  );
}

/* ─── Quote + e-signature (Scope demo) ──────────────────────────────────── */
type SigState = 'idle' | 'signing' | 'signed';
function QuoteSignatureApp({ signTrigger, onSigned }: { signTrigger?: boolean; onSigned?: () => void }) {
  const [sigState, setSigState] = useState<SigState>('idle');

  // When parent triggers signing (e.g. next button clicked)
  useEffect(() => {
    if (!signTrigger || sigState !== 'idle') return;
    setSigState('signing');
    const t = setTimeout(() => { setSigState('signed'); onSigned?.(); }, 2600);
    return () => clearTimeout(t);
  }, [signTrigger]);

  const sign = () => {
    if (sigState !== 'idle') return;
    setSigState('signing');
    setTimeout(() => { setSigState('signed'); onSigned?.(); }, 2600);
  };

  const lineItems = [
    { desc: 'Arch. Shingles (28 sq)', price: '$9,800' },
    { desc: 'Ice & Water Shield', price: '$1,200' },
    { desc: 'Ridge Vent + Labor', price: '$2,450' },
  ];

  return (
    <div style={{ background: '#fff', height: '100%', overflow: 'hidden', fontFamily: 'DM Sans, sans-serif', color: '#1a1a1a', display: 'flex', flexDirection: 'column', fontSize: '11px' }}>
      {/* Header bar */}
      <div style={{ background: '#0d0d0d', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ color: '#fff', fontWeight: 800, fontSize: '13px', letterSpacing: '-0.02em' }}>RevCore</div>
        <div style={{ background: '#94D96B', color: '#0a0a0a', fontSize: '8px', fontWeight: 800, padding: '3px 10px', borderRadius: '100px', letterSpacing: '0.1em' }}>ESTIMATE</div>
      </div>

      <div style={{ padding: '10px 13px 12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {/* Customer + estimate meta */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
          <div>
            <div style={{ fontSize: '7.5px', color: '#999', fontWeight: 700, letterSpacing: '0.07em', marginBottom: '2px' }}>BILL TO</div>
            <div style={{ fontWeight: 700, fontSize: '11px', lineHeight: 1.2 }}>John & Sarah Miller</div>
            <div style={{ fontSize: '9px', color: '#888', lineHeight: 1.4 }}>4821 Oakwood Dr, Austin TX</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '7.5px', color: '#999', fontWeight: 700, letterSpacing: '0.07em', marginBottom: '2px' }}>ESTIMATE</div>
            <div style={{ fontWeight: 700, fontSize: '11px', lineHeight: 1.2 }}>RC-2847</div>
            <div style={{ fontSize: '9px', color: '#94D96B', fontWeight: 600 }}>Valid 30 days</div>
          </div>
        </div>

        {/* Line items */}
        <div style={{ border: '1px solid #ebebeb', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '5px 10px', background: '#f5f5f5', borderBottom: '1px solid #ebebeb' }}>
            <span style={{ fontSize: '7.5px', color: '#aaa', fontWeight: 700, letterSpacing: '0.07em' }}>DESCRIPTION</span>
            <span style={{ fontSize: '7.5px', color: '#aaa', fontWeight: 700, letterSpacing: '0.07em' }}>TOTAL</span>
          </div>
          {lineItems.map((item, i) => (
            <div key={item.desc} style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '7px 10px', borderBottom: i < lineItems.length - 1 ? '1px solid #f3f3f3' : 'none', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', color: '#333' }}>{item.desc}</span>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#1a1a1a' }}>{item.price}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div style={{ padding: '8px 11px', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #ebebeb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#999', marginBottom: '6px', paddingBottom: '6px', borderBottom: '1px solid #e8e8e8' }}>
            <span>Subtotal (incl. tear-off &amp; disposal)</span><span style={{ fontWeight: 600, color: '#555' }}>$13,450</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800 }}>
            <span>Total Due</span><span style={{ color: '#16a34a' }}>$13,450</span>
          </div>
        </div>

        {/* Signature area */}
        <div>
          <div style={{ fontSize: '7.5px', color: '#999', fontWeight: 700, letterSpacing: '0.07em', marginBottom: '5px' }}>CUSTOMER SIGNATURE</div>
          <div
            onClick={sign}
            style={{
              border: sigState === 'signed' ? '1.5px solid #94D96B' : sigState === 'signing' ? '1.5px dashed #bbb' : '1.5px dashed #d8d8d8',
              borderRadius: '10px',
              height: '64px',
              position: 'relative',
              overflow: 'hidden',
              cursor: sigState === 'idle' ? 'pointer' : 'default',
              background: sigState === 'signed' ? 'rgba(148,217,107,0.05)' : '#fafafa',
              transition: 'border-color 0.4s ease, background 0.4s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {sigState === 'idle' && (
              <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.2, display: 'block', margin: '0 auto 3px' }}>
                  <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div style={{ fontSize: '8.5px', color: '#bbb', fontWeight: 500 }}>Tap here to sign</div>
              </div>
            )}
            {sigState !== 'idle' && (
              <svg width="185" height="52" viewBox="0 0 185 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 12,44 C 4,26 16,7 30,17 C 42,25 38,46 24,50 C 12,53 4,42 12,32 L 30,25 C 46,17 62,21 66,35 C 70,49 58,57 46,55 M 76,13 L 70,55 M 68,27 C 80,11 100,11 100,27 C 100,43 88,57 76,55 M 108,25 C 118,9 140,11 140,27 L 132,57 M 148,15 L 158,57 M 148,55 L 160,17"
                  stroke="#1e1e1e"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength="1"
                  strokeDasharray="1"
                  strokeDashoffset={sigState === 'signed' ? '0' : '1'}
                  style={{ animation: sigState === 'signing' ? 'drawSignature 2.4s cubic-bezier(0.3,0,0.15,1) forwards' : 'none' }}
                />
              </svg>
            )}
            {sigState === 'signed' && (
              <div style={{ position: 'absolute', bottom: '5px', right: '8px', fontSize: '8px', color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px', animation: 'sigBadgeIn 0.4s ease both' }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Accepted
              </div>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
            <div style={{ fontSize: '8px', color: '#ccc' }}>x________________________</div>
            <div style={{ fontSize: '8px', color: '#bbb' }}>March 8, 2026</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes drawSignature {
          from { stroke-dashoffset: 1; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes sigBadgeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ─── Stat pill ──────────────────────────────────────────────────────────── */
function StatPill({ value, label, accent, inView, delay }: { value: string; label: string; accent: string; inView: boolean; delay: number }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '7px 16px', borderRadius: '100px', background: `${accent}08`, border: `1px solid ${accent}20`, ...scaleUp(inView, delay) }}>
      <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '0.88rem', color: accent }}>{value}</span>
      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{label}</span>
    </div>
  );
}

/* ─── Page sections ──────────────────────────────────────────────────────── */
function QuotingSection() {
  const { ref, inView } = useScrollRevealBidirectional({ threshold: 0.06 });
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [sigTrigger, setSigTrigger] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const pendingStepRef = React.useRef<number | null>(null);
  const advanceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset signature state when leaving the estimate step
  useEffect(() => {
    if (demoStep !== 3) {
      setSigTrigger(false);
      setIsSigned(false);
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    }
  }, [demoStep]);

  const handleStep = (n: number) => {
    // Intercept forward navigation away from estimate step if not yet signed
    if (demoStep === 3 && n > 3 && !isSigned) {
      pendingStepRef.current = n;
      setSigTrigger(true);
      // Advance after animation completes (2.4s) + small buffer
      advanceTimerRef.current = setTimeout(() => {
        setDemoStep(n);
      }, 2700);
      return;
    }
    setDemoStep(n);
  };
  const quotingFeatures = [
    { icon: <FileText size={16} />, title: 'On-Site Quote Generation', desc: 'Build accurate, professional proposals at the door with your pricing built in. No office trips.' },
    { icon: <Layers size={16} />, title: 'Good / Better / Best Tiers', desc: 'Present three options on every job — proven to increase average ticket size by 34%.' },
    { icon: <Zap size={16} />, title: 'Job Tracking Pipeline', desc: 'Every quote status at a glance: sent, viewed, followed up, signed. Nothing slips.' },
    { icon: <Bell size={16} />, title: 'Automated Follow-Up', desc: 'Timed SMS & email sequences fire automatically when a quote goes cold.' },
    { icon: <Star size={16} />, title: 'Review Request Automation', desc: 'After every closed job, the system requests a Google review. No awkward asks.' },
    { icon: <CheckCircle size={16} />, title: 'E-Signature Collection', desc: 'Collect digital signatures in the field. Lock in the job before you leave the driveway.' },
  ];

  return (
    <>
      <SoftwareDemoOverlay
        open={demoOpen}
        onClose={() => { setDemoOpen(false); setDemoStep(0); }}
        ipadSide="left"
        accent="#94D96B"
        steps={QUOTING_STEPS}
        step={demoStep}
        onStep={handleStep}
        ipadContent={
          <IpadMockup width="100%" accentGlow="rgba(148,217,107,0.6)">
            {QUOTING_STEPS[demoStep].tab === 'estimate' ? (
              <QuoteSignatureApp signTrigger={sigTrigger} onSigned={() => setIsSigned(true)} />
            ) : (
              <QuotingApp controlledTab={QUOTING_STEPS[demoStep].tab} />
            )}
          </IpadMockup>
        }
      />
      <section ref={ref as React.Ref<HTMLElement>} style={{ padding: '120px 0', background: '#060c06', position: 'relative', overflow: 'hidden' }}>
        <SpaceBackground parallax={0.15} />
        {/* Fade into Presentation section */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '140px', background: 'linear-gradient(to bottom, transparent, #06080f)', pointerEvents: 'none', zIndex: 2 }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>

            {/* Left — iPad + stat pills + demo button */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', ...fadeUp(inView, 0) }}>
              <IpadMockup width={560} accentGlow="rgba(148,217,107,0.45)">
                <QuotingApp />
              </IpadMockup>
              <div style={{ display: 'flex', gap: '10px', marginTop: '1.75rem', flexWrap: 'wrap' as const, justifyContent: 'center' }}>
                <StatPill value="34%" label="higher avg. ticket" accent="#94D96B" inView={inView} delay={300} />
                <StatPill value="0" label="quotes lost to cold leads" accent="#94D96B" inView={inView} delay={420} />
              </div>
              <div style={{ ...scaleUp(inView, 560) }}>
                <WatchDemoBtn onClick={() => { setDemoStep(0); setDemoOpen(true); }} accent="#94D96B" />
              </div>
            </div>

            {/* Right — content */}
            <div>
              {/* Label */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: '100px', background: 'rgba(148,217,107,0.07)', border: '1px solid rgba(148,217,107,0.18)', marginBottom: '1.75rem', ...fadeUp(inView, 80) }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#94D96B', display: 'block' }} />
                <span style={{ color: '#94D96B', fontSize: '0.67rem', fontWeight: 700, letterSpacing: '0.1em' }}>SCOPE · ESTIMATING & QUOTING</span>
              </div>

              {/* Product name */}
              <div style={{ ...fadeUp(inView, 140) }}>
                <p style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 'clamp(3.5rem, 5.5vw, 5.25rem)',
                  fontWeight: 900,
                  lineHeight: 0.92,
                  letterSpacing: '-0.045em',
                  margin: '0 0 1.1rem',
                  background: 'linear-gradient(110deg, #fff 5%, #94D96B 38%, #d4f7b5 58%, #fff 88%)',
                  backgroundSize: '300% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: inView ? 'sectionGradientShift 9s ease-in-out infinite' : 'none',
                }}>Scope.</p>
              </div>

              {/* Tagline */}
              <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(1.25rem, 2vw, 1.65rem)', fontWeight: 700, color: 'rgba(255,255,255,0.78)', lineHeight: 1.3, letterSpacing: '-0.02em', margin: '0 0 1.25rem', ...fadeUp(inView, 210) }}>
                Quote on-site. Track every job.<br />Never lose a follow-up.
              </h2>

              {/* Description */}
              <p style={{ color: 'rgba(255,255,255,0.42)', lineHeight: '1.85', marginBottom: '2.25rem', fontSize: '0.93rem', ...fadeUp(inView, 300) }}>
                Most contractors lose 40% of quotes because they never follow up. Scope eliminates that, with a built-in pipeline, automated sequences, and review requests that run without lifting a finger.
              </p>

              {/* Features */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '11px', marginBottom: '2rem' }}>
                {quotingFeatures.map((f, i) => (
                  <div key={f.title} style={{ ...scaleUp(inView, 380 + i * 65) }}>
                    <Feature {...f} accent="#94D96B" />
                  </div>
                ))}
              </div>

              {/* Availability */}
              <div style={{ ...fadeUp(inView, 800), borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: '8px' }}>
                <span style={{ fontSize: '0.77rem', color: 'rgba(255,255,255,0.28)', lineHeight: 1.5 }}>
                  Available on its own, or as part of{' '}
                  <span style={{ color: 'rgba(255,255,255,0.58)', fontWeight: 600 }}>RevCore Pro</span>.
                </span>
                <a href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#94D96B', fontSize: '0.77rem', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.01em', opacity: 0.85, transition: 'opacity 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.85'; }}>
                  Get started <ArrowRight size={12} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

function PresentationSection() {
  const { ref, inView } = useScrollRevealBidirectional({ threshold: 0.06 });
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const pitchFeatures = [
    { icon: <Monitor size={16} />, title: 'Trade-Specific Decks', desc: 'Built for your exact trade — roofing, windows, remodeling, siding, decks, pools, and more. Not a template.' },
    { icon: <Layers size={16} />, title: 'Before & After Comparisons', desc: 'Photo-heavy slides showing real transformations. Homeowners buy emotion, give it to them.' },
    { icon: <FileText size={16} />, title: 'Financing On-Screen', desc: 'Display monthly payment options inside the presentation. Remove sticker shock on the spot.' },
    { icon: <Star size={16} />, title: 'Built-in Social Proof', desc: 'Reviews, photos, certifications, and warranties surfaced at exactly the right moment.' },
    { icon: <CheckCircle size={16} />, title: 'iPad-Ready & Offline', desc: 'Works without internet. No loading screens in the field. Flawless on any device.' },
    { icon: <Zap size={16} />, title: 'E-Signature Close', desc: 'Collect a signed contract before you stand up from the kitchen table.' },
  ];

  return (
    <>
      <SoftwareDemoOverlay
        open={demoOpen}
        onClose={() => { setDemoOpen(false); setDemoStep(0); }}
        ipadSide="right"
        accent="#6B8EFE"
        steps={PITCH_STEPS}
        step={demoStep}
        onStep={setDemoStep}
        ipadContent={
          <IpadMockup width="100%" accentGlow="rgba(107,142,254,0.6)">
            <PitchApp controlledSlide={PITCH_STEPS[demoStep].slide} />
          </IpadMockup>
        }
      />
      <section ref={ref as React.Ref<HTMLElement>} style={{ padding: '120px 0', background: '#06080f', position: 'relative', overflow: 'hidden' }}>
        <SpaceBackground parallax={0.15} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>

            {/* Left — content */}
            <div>
              {/* Label */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: '100px', background: 'rgba(107,142,254,0.07)', border: '1px solid rgba(107,142,254,0.18)', marginBottom: '1.75rem', ...fadeUp(inView, 80) }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#6B8EFE', display: 'block' }} />
                <span style={{ color: '#6B8EFE', fontSize: '0.67rem', fontWeight: 700, letterSpacing: '0.1em' }}>PITCH · SALES PRESENTATION</span>
              </div>

              {/* Product name */}
              <div style={{ ...fadeUp(inView, 140) }}>
                <p style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 'clamp(3.5rem, 5.5vw, 5.25rem)',
                  fontWeight: 900,
                  lineHeight: 0.92,
                  letterSpacing: '-0.045em',
                  margin: '0 0 1.1rem',
                  background: 'linear-gradient(110deg, #fff 5%, #6B8EFE 38%, #b8caff 58%, #fff 88%)',
                  backgroundSize: '300% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: inView ? 'sectionGradientShift 9s ease-in-out infinite' : 'none',
                }}>Pitch.</p>
              </div>

              {/* Tagline */}
              <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(1.25rem, 2vw, 1.65rem)', fontWeight: 700, color: 'rgba(255,255,255,0.78)', lineHeight: 1.3, letterSpacing: '-0.02em', margin: '0 0 1.25rem', ...fadeUp(inView, 210) }}>
                Stand out. Build trust.<br />Win the job before you leave.
              </h2>

              {/* Description */}
              <p style={{ color: 'rgba(255,255,255,0.42)', lineHeight: '1.85', marginBottom: '2.25rem', fontSize: '0.93rem', ...fadeUp(inView, 300) }}>
                Your competitors show up with a pen and a brochure. Pitch puts you in a different category entirely, a custom interactive presentation that makes homeowners feel confident they&apos;re hiring the best.
              </p>

              {/* Features */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '11px', marginBottom: '2rem' }}>
                {pitchFeatures.map((f, i) => (
                  <div key={f.title} style={{ ...scaleUp(inView, 380 + i * 65) }}>
                    <Feature {...f} accent="#6B8EFE" />
                  </div>
                ))}
              </div>

              {/* Availability */}
              <div style={{ ...fadeUp(inView, 800), borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: '8px' }}>
                <span style={{ fontSize: '0.77rem', color: 'rgba(255,255,255,0.28)', lineHeight: 1.5 }}>
                  Available on its own, or as part of{' '}
                  <span style={{ color: 'rgba(255,255,255,0.58)', fontWeight: 600 }}>RevCore Pro</span>.
                </span>
                <a href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#6B8EFE', fontSize: '0.77rem', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.01em', opacity: 0.85, transition: 'opacity 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.85'; }}>
                  Get started <ArrowRight size={12} />
                </a>
              </div>
            </div>

            {/* Right — iPad + stat pills + demo button */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', ...fadeUp(inView, 0) }}>
              <IpadMockup width={560} accentGlow="rgba(107,142,254,0.45)">
                <PitchApp />
              </IpadMockup>
              <div style={{ display: 'flex', gap: '10px', marginTop: '1.75rem', flexWrap: 'wrap' as const, justifyContent: 'center' }}>
                <StatPill value="3×" label="more likely to close on first visit" accent="#6B8EFE" inView={inView} delay={300} />
                <StatPill value="0" label="paper contracts" accent="#6B8EFE" inView={inView} delay={420} />
              </div>
              <div style={{ ...scaleUp(inView, 560) }}>
                <WatchDemoBtn onClick={() => { setDemoStep(0); setDemoOpen(true); }} accent="#6B8EFE" />
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

function InFieldSection() {
  const { ref, inView } = useScrollReveal({ threshold: 0.1 });
  const photos = [
    {
      url: 'https://assets.cdn.filesafe.space/NYlSya2nYSkSnnXEbY2l/media/69ac8f8436702f23d94db789.png',
      tag: 'Scope',
      tagColor: '#94D96B',
      caption: 'Built in the car before you walk in',
      sub: 'Your rep pulls up the job, builds a quote, and steps inside with numbers already locked.',
    },
    {
      url: 'https://assets.cdn.filesafe.space/NYlSya2nYSkSnnXEbY2l/media/69ac8f84618c8d48205efad9.png',
      tag: 'Pitch',
      tagColor: '#6B8EFE',
      caption: 'Closed at the kitchen table',
      sub: 'Present, build trust, handle objections, collect an e-signature, all before you stand up.',
    },
  ];

  return (
    <section ref={ref as React.Ref<HTMLElement>} style={{ padding: '80px 0', background: '#06080f', position: 'relative', overflow: 'hidden' }}>
      <SpaceBackground />
      {/* Fade into Integration section */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px', background: 'linear-gradient(to bottom, transparent, #0a0a0a)', pointerEvents: 'none', zIndex: 2 }} />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', ...fadeUp(inView, 0) }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem' }}>In the field</div>
          <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', margin: 0 }}>
            This is what it looks like on a real job.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {photos.map((p, i) => (
            <div key={p.tag} style={{ borderRadius: '20px', overflow: 'hidden', border: `1px solid ${p.tagColor}18`, ...fadeUp(inView, 100 + i * 120) }}>
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <img
                  src={p.url}
                  alt={p.caption}
                  style={{ width: '100%', height: 'auto', display: 'block', transition: 'transform 0.6s cubic-bezier(0.22,1,0.36,1)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.03)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
                />
                <div style={{ position: 'absolute', top: '14px', left: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '100px', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', border: `1px solid ${p.tagColor}30` }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: p.tagColor, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: p.tagColor, letterSpacing: '0.1em' }}>{p.tag}</span>
                </div>
              </div>
              <div style={{ padding: '1.25rem 1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem', marginBottom: '0.35rem' }}>{p.caption}</div>
                <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.82rem', lineHeight: '1.65', margin: 0 }}>{p.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Speed + signature callout */}
        <div style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', ...fadeUp(inView, 380) }}>
          {[
            { stat: '< 5 min', label: 'From conversation to a completed estimate', accent: '#94D96B' },
            { stat: 'On-site', label: 'Digital signature collected before you leave', accent: '#6B8EFE' },
            { stat: 'Instant', label: 'Signed PDF delivered to the customer\'s phone', accent: '#94D96B' },
          ].map((item) => (
            <div key={item.stat} style={{ padding: '1.25rem 1.5rem', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', textAlign: 'center' }}>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '1.35rem', color: item.accent, marginBottom: '0.4rem' }}>{item.stat}</div>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.38)', lineHeight: '1.55', margin: 0 }}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function IntegrationBanner() {
  const { ref, inView } = useScrollReveal({ threshold: 0.12 });
  return (
    <section ref={ref as React.Ref<HTMLElement>} style={{ padding: '80px 0', background: '#0A0A0A', position: 'relative', overflow: 'hidden' }}>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #0f1a10 0%, #0a0f1a 100%)',
          padding: '3.5rem',
          border: '1px solid rgba(255,255,255,0.07)',
          ...fadeUp(inView, 0),
        }}>
          {/* Top row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'start', gap: '3rem', marginBottom: '2.5rem' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '20px', height: '2px', background: '#94D96B', display: 'block' }} />
                All Connected. All In One.
              </div>
              <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: '1rem' }}>
                Every tool routes directly<br />into your RevCore CRM.
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.45)', lineHeight: '1.75', maxWidth: '540px' }}>
                Your website, paid ads, quoting software, presentation app, follow-up sequences, and rehash engine all feed back into one centralized CRM, custom-built for your company. Instead of logging into four different platforms, you see every lead, every touchpoint, and every dollar in one place.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '240px' }}>
              {[
                { label: 'Website leads → CRM', color: '#94D96B' },
                { label: 'Paid Ads → CRM', color: '#6B8EFE' },
                { label: 'Scope → CRM', color: '#94D96B' },
                { label: 'Pitch → CRM', color: '#6B8EFE' },
                { label: 'Follow-Up Engine → CRM', color: '#FEB64A' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Bottom — "all in 1" value prop */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {[
              { label: '1 point of contact', sub: 'Not 3 to 4 vendors. One team that knows your whole business.' },
              { label: '100% custom-built', sub: 'Every pipeline, sequence, and script built for your trade and market.' },
              { label: 'Zero handoff chaos', sub: 'Your ads, software, training, and CRM all speak the same language.' },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', marginBottom: '4px' }}>{item.label}</div>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', lineHeight: '1.6' }}>{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Comparison Section ─────────────────────────────────────────────────── */
function ComparisonSection() {
  const { ref, inView } = useScrollReveal({ threshold: 0.08 });

  // Pricing rows (displayed above features)
  const pricingRows: { label: string; revcore: string; values: string[] }[] = [
    { label: 'Starting Price',     revcore: 'Included',  values: ['$300+/mo',       '$39–199/mo',    '$245+/tech/mo',  '$59–329/mo',     '$79–297/mo',     '$127+/user'] },
    { label: 'Setup / Onboarding', revcore: '$0',        values: ['$0',             '$0',            '$2K–$10K+',      '$0',             'Annual contract', '$4K–$10K+'] },
    { label: 'Per-User Fees',      revcore: 'None',      values: ['$30–75/user',    '$29/user',      'Per-tech pricing','$35/user (MAX)', '$99/user',       'Per-user pricing'] },
  ];

  const features = [
    'iPad Sales Presentation Tool',
    'In-Field Quote Builder',
    'Good / Better / Best Pricing',
    'Digital E-Signature',
    'Auto Follow-up Sequences',
    'Photo Gallery & Project Proof',
    'Branded, Personalized Proposals',
    'Built for In-Home Closers, by Closers',
    'Same-Day Setup, No Onboarding Fee',
    'Dedicated Account Support',
    'GMB & Website Service Included',
    'No Long-Term Contract Required',
  ];

  type CheckVal = '✓' | '~' | '✗';

  const competitors: { name: string; values: CheckVal[] }[] = [
    {
      name: 'JobNimbus',
      //                Pres  Quote  GBB   Esig  Auto  Photo Brand  Rep   Setup  Supp  GMB   Contract
      values:          ['✗',  '✓',  '✗',  '✓',  '~',  '✗',  '✗',  '✗',  '✗',  '~',  '✗',  '✗'],
    },
    {
      name: 'Jobber',
      values:          ['✗',  '✓',  '✗',  '✓',  '✓',  '✗',  '~',  '✗',  '✗',  '~',  '✗',  '✗'],
    },
    {
      name: 'ServiceTitan',
      values:          ['✗',  '✓',  '~',  '✓',  '✓',  '✗',  '~',  '✗',  '✗',  '✓',  '✗',  '✗'],
    },
    {
      name: 'Housecall Pro',
      values:          ['✗',  '✓',  '✗',  '✓',  '~',  '✗',  '✗',  '✗',  '✗',  '~',  '✗',  '✗'],
    },
    {
      name: 'Leap',
      values:          ['✓',  '~',  '✓',  '✓',  '✗',  '~',  '✓',  '✓',  '✗',  '~',  '✗',  '✗'],
    },
    {
      name: 'Ingage',
      //                Pres  Quote  GBB   Esig  Auto  Photo Brand  Rep   Setup  Supp  GMB   Contract
      values:          ['✓',  '✗',  '✗',  '✗',  '✗',  '✓',  '✓',  '~',  '✗',  '~',  '✗',  '✗'],
    },
  ];

  const revCoreValues: CheckVal[] = features.map(() => '✓');

  function CheckIcon({ val }: { val: CheckVal }) {
    if (val === '✓') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(148,217,107,0.12)', border: '1px solid rgba(148,217,107,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1.5 4L3.8 6.3L8.5 1" stroke="#94D96B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      );
    }
    if (val === '~') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '13px', color: '#F59E0B', fontWeight: 700, lineHeight: 1 }}>~</span>
          </div>
        </div>
      );
    }
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.18)', fontWeight: 500 }}>✗</span>
      </div>
    );
  }

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      style={{ padding: '6rem clamp(1.5rem, 6vw, 6rem)', background: '#080c10', position: 'relative', overflow: 'hidden' }}
    >
      {/* Background glow */}
      <div style={{ position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '400px', background: 'radial-gradient(ellipse, rgba(148,217,107,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem', ...fadeUp(inView, 0) }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '5px 14px', borderRadius: '100px', background: 'rgba(148,217,107,0.08)', border: '1px solid rgba(148,217,107,0.2)', marginBottom: '1.5rem' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#94D96B' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94D96B', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Feature Comparison</span>
          </div>
          <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: 'white', lineHeight: 1.12, letterSpacing: '-0.025em', marginBottom: '1rem' }}>
            How We Stack Up
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', lineHeight: '1.8', maxWidth: '580px', margin: '0 auto', fontSize: '1rem' }}>
            RevCore is built for one thing, closing more jobs in the field. The others are built to manage everything else.
          </p>
        </div>

        {/* Table wrapper — horizontally scrollable on mobile */}
        <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.07)', ...scaleUp(inView, 150) }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px', fontFamily: 'DM Sans, sans-serif' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {/* Feature column header */}
                <th style={{
                  padding: '1.1rem 1.5rem',
                  textAlign: 'left',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.35)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase' as const,
                  background: '#0d1117',
                  position: 'sticky',
                  left: 0,
                  zIndex: 2,
                  minWidth: '220px',
                }}>
                  Feature
                </th>
                {/* RevCore header — highlighted */}
                <th style={{
                  padding: '1.1rem 1.25rem',
                  textAlign: 'center',
                  background: 'rgba(148,217,107,0.06)',
                  borderLeft: '2px solid rgba(148,217,107,0.35)',
                  borderRight: '1px solid rgba(255,255,255,0.06)',
                  minWidth: '120px',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '4px' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#94D96B' }}>RevCore</div>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(148,217,107,0.6)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>Recommended</div>
                  </div>
                </th>
                {/* Competitor headers */}
                {competitors.map((comp) => (
                  <th key={comp.name} style={{
                    padding: '1.1rem 1.25rem',
                    textAlign: 'center',
                    background: '#0d1117',
                    borderRight: '1px solid rgba(255,255,255,0.05)',
                    minWidth: '120px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.4)',
                  }}>
                    {comp.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* ── Pricing rows ── */}
              {pricingRows.map((row, prIdx) => (
                <tr
                  key={row.label}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    background: 'rgba(148,217,107,0.02)',
                  }}
                >
                  <td style={{
                    padding: '0.85rem 1.5rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.75)',
                    background: prIdx % 2 === 0 ? '#0e1219' : '#0d1218',
                    position: 'sticky',
                    left: 0,
                    zIndex: 1,
                    borderBottom: prIdx === pricingRows.length - 1 ? '2px solid rgba(255,255,255,0.08)' : undefined,
                  }}>
                    {row.label}
                  </td>
                  {/* RevCore pricing — green highlight */}
                  <td style={{
                    padding: '0.85rem 1.25rem',
                    textAlign: 'center',
                    background: 'rgba(148,217,107,0.08)',
                    borderLeft: '2px solid rgba(148,217,107,0.35)',
                    borderRight: '1px solid rgba(255,255,255,0.05)',
                    borderBottom: prIdx === pricingRows.length - 1 ? '2px solid rgba(255,255,255,0.08)' : undefined,
                  }}>
                    <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#94D96B' }}>{row.revcore}</span>
                  </td>
                  {/* Competitor pricing */}
                  {row.values.map((val, ci) => (
                    <td key={ci} style={{
                      padding: '0.85rem 1.25rem',
                      textAlign: 'center',
                      borderRight: '1px solid rgba(255,255,255,0.04)',
                      borderBottom: prIdx === pricingRows.length - 1 ? '2px solid rgba(255,255,255,0.08)' : undefined,
                    }}>
                      <span style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: val.includes('$') && (val.includes('K') || val.includes('tech') || val.includes('user'))
                          ? '#F59E0B'
                          : 'rgba(255,255,255,0.55)',
                      }}>
                        {val}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}

              {/* ── Feature rows ── */}
              {features.map((feat, rowIdx) => (
                <tr
                  key={feat}
                  style={{
                    borderBottom: rowIdx < features.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    background: rowIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(255,255,255,0.025)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = rowIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'; }}
                >
                  {/* Feature name — sticky */}
                  <td style={{
                    padding: '0.95rem 1.5rem',
                    fontSize: '0.875rem',
                    color: 'rgba(255,255,255,0.65)',
                    fontWeight: 500,
                    background: rowIdx % 2 === 0 ? '#0d1117' : '#0e1219',
                    position: 'sticky',
                    left: 0,
                    zIndex: 1,
                  }}>
                    {feat}
                  </td>
                  {/* RevCore value */}
                  <td style={{
                    padding: '0.95rem 1.25rem',
                    textAlign: 'center',
                    background: 'rgba(148,217,107,0.05)',
                    borderLeft: '2px solid rgba(148,217,107,0.25)',
                    borderRight: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <CheckIcon val={revCoreValues[rowIdx]} />
                  </td>
                  {/* Competitor values */}
                  {competitors.map((comp) => (
                    <td key={comp.name} style={{
                      padding: '0.95rem 1.25rem',
                      textAlign: 'center',
                      borderRight: '1px solid rgba(255,255,255,0.04)',
                    }}>
                      <CheckIcon val={comp.values[rowIdx]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pricing summary strip */}
        <div style={{
          marginTop: '2rem',
          padding: '1.25rem 2rem',
          borderRadius: '12px',
          background: 'rgba(148,217,107,0.04)',
          border: '1px solid rgba(148,217,107,0.15)',
          textAlign: 'center',
          ...fadeUp(inView, 250),
        }}>
          <p style={{ margin: 0, fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            RevCore includes both <span style={{ color: '#94D96B', fontWeight: 700 }}>Scope</span> + <span style={{ color: '#6B8EFE', fontWeight: 700 }}>Pitch</span> in every package.{' '}
            <span style={{ color: 'rgba(255,255,255,0.45)' }}>Competitors charge $300–$3,000+/mo for less.</span>
          </p>
        </div>

        {/* Footnote */}
        <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'rgba(255,255,255,0.22)', marginTop: '1rem', ...fadeUp(inView, 300) }}>
          Pricing as of 2026. Competitor pricing may vary by plan and team size.
        </p>
      </div>
    </section>
  );
}

function SoftwareCTA() {
  const { ref, inView } = useScrollReveal({ threshold: 0.2 });
  return (
    <section ref={ref as React.Ref<HTMLElement>} style={{ padding: '140px 0', background: '#070b0f', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <SpaceBackground />
      {/* Centered nebula glow */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '900px', height: '500px', background: 'radial-gradient(ellipse, rgba(254,100,98,0.04) 0%, rgba(107,142,254,0.02) 45%, transparent 70%)', pointerEvents: 'none' }} />
      <div className="container" style={{ maxWidth: '660px', position: 'relative', zIndex: 1 }}>
        {/* Eyebrow pill */}
        <div style={{ ...fadeUp(inView, 0), marginBottom: '1.75rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '5px 16px', borderRadius: '100px', background: 'rgba(254,100,98,0.08)', border: '1px solid rgba(254,100,98,0.22)', color: '#FE6462', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#FE6462', boxShadow: '0 0 8px #FE6462', animation: 'ctaDot 2s ease-in-out infinite', display: 'inline-block' }} />
            Ready to see it in action?
          </span>
        </div>
        <AnimatedText
          as="h2"
          inView={inView}
          delay={150}
          stagger={70}
          style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, color: 'white', lineHeight: 1.12, letterSpacing: '-0.025em', marginBottom: '1.25rem' }}
        >
          Get a live demo. Built for your trade.
        </AnimatedText>
        <p style={{ color: 'rgba(255,255,255,0.42)', lineHeight: '1.8', marginBottom: '3rem', ...fadeUp(inView, 600) }}>
          We&apos;ll walk you through both tools, show you how they integrate with your business, and have a custom version built for your trade before you hang up.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', ...fadeUp(inView, 750) }}>
          {/* Primary CTA with pulse ring */}
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ position: 'absolute', inset: '-8px', borderRadius: '100px', border: '1px solid rgba(254,100,98,0.4)', animation: 'heroBtnPulse 2.6s ease-out infinite', pointerEvents: 'none' }} />
            <span style={{ position: 'absolute', inset: '-8px', borderRadius: '100px', border: '1px solid rgba(254,100,98,0.2)', animation: 'heroBtnPulse 2.6s ease-out 1s infinite', pointerEvents: 'none' }} />
            <Link href="/contact"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'linear-gradient(135deg, #FE6462 0%, #e84f4d 100%)', color: 'white', padding: '15px 30px', borderRadius: '100px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', boxShadow: '0 0 28px rgba(254,100,98,0.22), 0 4px 16px rgba(254,100,98,0.14)', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(254,100,98,0.32), 0 8px 24px rgba(254,100,98,0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 28px rgba(254,100,98,0.22), 0 4px 16px rgba(254,100,98,0.14)'; }}
            >
              Book a demo <ArrowRight size={16} />
            </Link>
          </div>
          <Link href="/services"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.12)', padding: '15px 30px', borderRadius: '100px', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', backdropFilter: 'blur(10px)', transition: 'background 0.2s ease, border-color 0.2s ease, color 0.2s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
          >
            Full growth stack <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────────────── */
function SoftwareHero() {
  const { ref, inView } = useScrollReveal({ threshold: 0.1 });
  const heroImgRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (heroImgRef.current) {
        heroImgRef.current.style.transform = `translateY(${window.scrollY * 0.22}px)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section style={{ background: '#070b0f', paddingTop: '80px' }}>
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        style={{ margin: '12px 12px 0', borderRadius: '24px', overflow: 'hidden', position: 'relative', minHeight: '86vh', background: '#0d1117' }}
      >
        {/* Parallax background image */}
        <div
          ref={heroImgRef}
          style={{
            position: 'absolute', inset: '-10% 0',
            backgroundImage: 'url(https://assets.cdn.filesafe.space/NYlSya2nYSkSnnXEbY2l/media/69ac98d7618c8d796f604f22.png)',
            backgroundSize: 'cover', backgroundPosition: 'center',
            willChange: 'transform',
          }}
        />
        {/* Dark overlay — slightly darker than about page */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
        {/* Stars */}
        <SpaceBackground opacity={0.7} parallax={0.15} />
        {/* Gradient vignette */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.08) 42%, rgba(0,0,0,0.72) 100%)', zIndex: 1 }} />
        {/* Grain layer 1 */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.68\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          backgroundSize: '220px 220px', opacity: 0.10, mixBlendMode: 'soft-light', pointerEvents: 'none', zIndex: 2,
        }} />
        {/* Grain layer 2 */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n2\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n2)\'/%3E%3C/svg%3E")',
          backgroundSize: '180px 180px', opacity: 0.07, mixBlendMode: 'overlay', pointerEvents: 'none', zIndex: 3,
        }} />
        {/* Fade into Quoting section */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '160px', background: 'linear-gradient(to bottom, transparent, #060c06)', pointerEvents: 'none', zIndex: 4 }} />
        {/* Content */}
        <div className="container" style={{ textAlign: 'center', maxWidth: '1000px', position: 'relative', zIndex: 5, paddingTop: '200px', paddingBottom: '100px' }}>
          <div style={{ ...fadeUp(inView, 0) }}>
            <div style={{ display: 'inline-flex', gap: '8px', marginBottom: '1.75rem' }}>
              <span style={{ padding: '4px 14px', borderRadius: '100px', background: 'rgba(148,217,107,0.1)', color: '#94D96B', fontSize: '0.72rem', fontWeight: 700, border: '1px solid rgba(148,217,107,0.25)', boxShadow: '0 0 16px rgba(148,217,107,0.12)' }}>
                Scope
              </span>
              <span style={{ padding: '4px 14px', borderRadius: '100px', background: 'rgba(107,142,254,0.1)', color: '#6B8EFE', fontSize: '0.72rem', fontWeight: 700, border: '1px solid rgba(107,142,254,0.25)', boxShadow: '0 0 16px rgba(107,142,254,0.12)' }}>
                Pitch
              </span>
              <span style={{ padding: '4px 14px', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', fontWeight: 700, border: '1px solid rgba(255,255,255,0.1)' }}>
                RevCore Pro
              </span>
            </div>
          </div>
          <div style={{ ...fadeUp(inView, 150), marginBottom: '1.5rem' }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.05,
              letterSpacing: '-0.03em', margin: 0, whiteSpace: 'nowrap',
              background: 'linear-gradient(110deg, #fff 0%, #fff 15%, #6B8EFE 38%, #94D96B 58%, #fff 82%, #fff 100%)',
              backgroundSize: '250% 100%',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              animation: 'gradientShift 12s ease-in-out infinite',
            }}>
              Software that closes jobs.
            </h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem', lineHeight: '1.8', maxWidth: '680px', margin: '0 auto 3rem', ...fadeUp(inView, 600) }}>
            Scope and Pitch, two purpose-built tools that work together, from the first quote to the signed contract and the five-star review. Available separately, or bundled as RevCore Pro.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', ...fadeUp(inView, 750) }}>
            <a href="#quoting"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #94D96B 0%, #6fb847 100%)', color: '#0a0a0a', padding: '14px 28px', borderRadius: '100px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', boxShadow: '0 4px 16px rgba(148,217,107,0.2)', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(148,217,107,0.3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(148,217,107,0.2)'; }}
            >
              Explore Scope ↓
            </a>
            <a href="#presentation"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #6B8EFE 0%, #4a6dea 100%)', color: 'white', padding: '14px 28px', borderRadius: '100px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', boxShadow: '0 4px 16px rgba(107,142,254,0.2)', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(107,142,254,0.3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(107,142,254,0.2)'; }}
            >
              Explore Pitch ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function SoftwarePage() {
  return (
    <>
      <SoftwareHero />
      <div id="quoting"><QuotingSection /></div>
      <div id="presentation"><PresentationSection /></div>
      <InFieldSection />
      <IntegrationBanner />
      <ComparisonSection />
      <SoftwareCTA />

      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 100% center; }
          50%       { background-position: 0% center; }
        }
        @keyframes sectionGradientShift {
          0%, 100% { background-position: 100% center; }
          50%       { background-position: 0% center; }
        }
        @keyframes demoPulseA {
          0%   { opacity: 0.7; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.7); }
        }
        @keyframes heroBtnPulse {
          0%   { opacity: 0.7; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.9); }
        }
        @keyframes ctaDot {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px #FE6462; }
          50%       { opacity: 0.5; box-shadow: 0 0 14px #FE6462; }
        }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"],
          div[style*="grid-template-columns: 140px 1fr"],
          div[style*="grid-template-columns: 1fr auto"] {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          div[style*="grid-template-columns: repeat(3, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
          section[style*="padding: 120px"] {
            padding-top: 48px !important;
            padding-bottom: 48px !important;
          }
          section[style*="padding: 140px"] {
            padding-top: 48px !important;
            padding-bottom: 48px !important;
          }
          table[style*="minWidth"] {
            min-width: 0 !important;
          }
          th[style*="minWidth"], td[style*="minWidth"] {
            min-width: 0 !important;
          }
        }
      `}</style>
    </>
  );
}
