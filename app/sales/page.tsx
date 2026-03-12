'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import SalesHero from '@/components/sales/SalesHero';
import SalesPackages from '@/components/sales/SalesPackages';
import WhatYouGet from '@/components/sales/WhatYouGet';
import ResultsSection from '@/components/sales/ResultsSection';
import AlaCarteServices from '@/components/sales/AlaCarteServices';
import SalesSoftware from '@/components/sales/SalesSoftware';
import FAQ from '@/components/sales/FAQ';
import SalesFinalCTA from '@/components/sales/SalesFinalCTA';

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
      background: '#000000',
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
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem' }}>
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
              color: 'rgba(255,255,255,0.25)',
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
              background: 'rgba(255,255,255,0.04)',
              border: `1.5px solid ${error ? '#FE6462' : 'rgba(255,255,255,0.08)'}`,
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
            background: 'white',
            color: '#000000',
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

// ─── Main sales deck ──────────────────────────────────────────────────────────
function SalesDeck() {
  return (
    <div style={{ background: '#000000', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Top bar */}
      <div style={{
        background: '#000000',
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
              background: 'rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.4)',
              fontSize: '0.6rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '100px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              Sales Team
            </span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.72rem' }}>Internal — do not share</span>
        </div>
      </div>

      {/* Conversion-optimized flow */}
      <SalesHero />
      <div data-section="packages">
        <SalesPackages />
      </div>
      <WhatYouGet />
      <ResultsSection />
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
