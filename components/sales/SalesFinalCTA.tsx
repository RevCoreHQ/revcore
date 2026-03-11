'use client';

import { ArrowRight } from 'lucide-react';
import SpaceBackground from '@/components/SpaceBackground';
import { useScrollReveal, blurReveal, fadeUp } from '@/hooks/useScrollReveal';

export default function SalesFinalCTA() {
  const { ref, inView } = useScrollReveal({ threshold: 0.15 });

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      style={{
        padding: '96px 0',
        background: '#070b0f',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <SpaceBackground opacity={0.5} />

      {/* Ambient glow orbs */}
      <div style={{
        position: 'absolute', top: '-100px', right: '10%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(254,100,98,0.12) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-120px', left: '20%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(107,142,254,0.08) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div
        className="container"
        style={{
          position: 'relative', zIndex: 1,
          textAlign: 'center',
          ...blurReveal(inView),
        }}
      >
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(148,217,107,0.12)',
          border: '1px solid rgba(148,217,107,0.25)',
          borderRadius: '100px', padding: '6px 16px',
          marginBottom: '2rem',
          ...fadeUp(inView, 200),
        }}>
          <span className="sales-cta-pulse" style={{
            width: '8px', height: '8px', borderRadius: '50%', background: '#94D96B',
            display: 'block',
          }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94D96B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Now accepting new partners
          </span>
        </div>

        <h2 style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 'clamp(1.75rem, 4vw, 3rem)',
          fontWeight: 800, color: 'white',
          lineHeight: 1.1, letterSpacing: '-0.02em',
          marginBottom: '1rem',
          maxWidth: '600px', margin: '0 auto 1rem',
        }}>
          Only 2 territories available this quarter.
        </h2>
        <p style={{
          color: 'rgba(255,255,255,0.45)',
          fontSize: '1rem', lineHeight: '1.7',
          maxWidth: '520px', margin: '0 auto 2.5rem',
        }}>
          We take one contractor per trade per market. Once your territory is locked, your competition can&apos;t access this system.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="/contact"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'white', color: '#0A0A0A',
              padding: '14px 32px', borderRadius: '100px',
              fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none',
              transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,255,255,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Check territory availability <ArrowRight size={15} />
          </a>
          <button
            onClick={() => document.querySelector('[data-section="packages"]')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'transparent', color: 'rgba(255,255,255,0.6)',
              padding: '13px 31px', borderRadius: '100px',
              fontWeight: 600, fontSize: '0.875rem',
              border: '1.5px solid rgba(255,255,255,0.15)',
              cursor: 'pointer',
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
            }}
          >
            See pricing again
          </button>
        </div>
      </div>

      <style>{`
        @keyframes salesCtaPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }
        .sales-cta-pulse {
          animation: salesCtaPulse 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
