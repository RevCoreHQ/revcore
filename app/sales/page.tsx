'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import FunnelDiagram from '@/components/FunnelDiagram';
import SalesHero from '@/components/sales/SalesHero';
import SocialProofBar from '@/components/sales/SocialProofBar';
import ProblemAgitation from '@/components/sales/ProblemAgitation';
import SolutionOverview from '@/components/sales/SolutionOverview';
import HowItWorks from '@/components/sales/HowItWorks';
import ResultsSection from '@/components/sales/ResultsSection';
import SalesPackages from '@/components/sales/SalesPackages';
import AlaCarteServices from '@/components/sales/AlaCarteServices';
import SalesSoftware from '@/components/sales/SalesSoftware';
import FAQ from '@/components/sales/FAQ';
import SalesFinalCTA from '@/components/sales/SalesFinalCTA';
import SectionDivider from '@/components/SectionDivider';
import { useScrollReveal, fadeUp } from '@/hooks/useScrollReveal';

const SALES_PASSWORD = '  ';

// ─── Password gate ─────────────────────────────────────────────────────────────
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value === SALES_PASSWORD) {
      onUnlock();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setValue('');
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0A0A',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <img
          src="https://assets.cdn.filesafe.space/NYlSya2nYSkSnnXEbY2l/media/69a9af9fb003fa7bb8bb92ee.png"
          alt="RevCore"
          style={{ height: '36px', width: 'auto', marginBottom: '1.5rem', opacity: 0.9 }}
        />
        <h1 style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '1.75rem',
          fontWeight: 800,
          color: 'white',
          marginBottom: '0.5rem',
          letterSpacing: '-0.02em',
        }}>
          RevCore Sales Hub
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>
          Team access only — enter your password to continue
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          width: '100%',
          maxWidth: '360px',
          animation: shake ? 'shake 0.4s ease' : 'none',
        }}
      >
        <div style={{ position: 'relative' }}>
          <Lock
            size={15}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255,255,255,0.3)',
            }}
          />
          <input
            type="password"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(false); }}
            placeholder="Password"
            autoFocus
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.06)',
              border: `1.5px solid ${error ? '#FE6462' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '12px',
              padding: '14px 14px 14px 40px',
              color: 'white',
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
          />
        </div>

        {error && (
          <p style={{ color: '#FE6462', fontSize: '0.8rem', textAlign: 'center', margin: 0 }}>
            Incorrect password. Try again.
          </p>
        )}

        <button
          type="submit"
          style={{
            background: '#FE6462',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '14px',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Enter
        </button>
      </form>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}

// ─── Funnel diagram section wrapper ──────────────────────────────────────────
function FunnelSection() {
  const { ref, inView } = useScrollReveal({ threshold: 0.06 });

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      style={{ padding: '96px 0 80px', background: '#F5F5F5' }}
    >
      <div className="container">
        <div style={{ marginBottom: '2.5rem', ...fadeUp(inView) }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'var(--color-gray)', marginBottom: '1rem',
          }}>
            <span style={{ width: '20px', height: '2px', background: 'var(--color-accent)', display: 'block' }} />
            The Full System
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'end' }}>
            <h2 style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em',
            }}>
              See how every<br />piece connects
            </h2>
            <p style={{ color: 'var(--color-gray)', lineHeight: '1.8' }}>
              This is the exact system your competitors don&apos;t have. Hover each stage to explore how leads flow from first impression to booked appointment.
            </p>
          </div>
        </div>
        <FunnelDiagram />
      </div>
    </section>
  );
}

// ─── Main sales deck ──────────────────────────────────────────────────────────
function SalesDeck() {
  return (
    <div style={{ background: '#F5F5F5', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Top bar */}
      <div style={{
        background: '#0A0A0A',
        padding: '12px 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src="https://assets.cdn.filesafe.space/NYlSya2nYSkSnnXEbY2l/media/69a9af9fb003fa7bb8bb92ee.png"
              alt="RevCore"
              style={{ height: '24px', width: 'auto' }}
            />
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'white' }}>
              RevCore
            </span>
            <span style={{
              background: '#FE6462',
              color: 'white',
              fontSize: '0.65rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '100px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              Sales Team
            </span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>Internal — do not share</span>
        </div>
      </div>

      {/* Conversion-optimized flow */}
      <SalesHero />
      <SocialProofBar />
      <ProblemAgitation />
      <SolutionOverview />
      <SectionDivider color="#94D96B" />
      <HowItWorks />
      <FunnelSection />
      <ResultsSection />
      <div data-section="packages">
        <SalesPackages />
      </div>
      <AlaCarteServices />
      <SalesSoftware />
      <FAQ />
      <SalesFinalCTA />
    </div>
  );
}

// ─── Page entry point ─────────────────────────────────────────────────────────
export default function SalesPage() {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  return <SalesDeck />;
}
