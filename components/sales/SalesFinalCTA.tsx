'use client';

import { ArrowRight } from 'lucide-react';
import MagneticButton from '@/components/MagneticButton';
import { useScrollReveal, blurReveal, fadeUp } from '@/hooks/useScrollReveal';

export default function SalesFinalCTA() {
  const { ref, inView } = useScrollReveal({ threshold: 0.15 });

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      style={{
        padding: '120px 0',
        background: '#000000',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle ambient glow */}
      <div style={{
        position: 'absolute', top: '-150px', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(254,100,98,0.06) 0%, transparent 60%)',
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
          background: 'rgba(148,217,107,0.08)',
          border: '1px solid rgba(148,217,107,0.15)',
          borderRadius: '100px', padding: '6px 16px',
          marginBottom: '2rem',
          ...fadeUp(inView, 200),
        }}>
          <span className="sales-cta-pulse" style={{
            width: '8px', height: '8px', borderRadius: '50%', background: '#94D96B',
            display: 'block',
          }} />
          <span style={{
            fontSize: '0.7rem', fontWeight: 700, color: '#94D96B',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            Now accepting new partners
          </span>
        </div>

        <h2 style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          fontWeight: 800, color: 'white',
          lineHeight: 1.1, letterSpacing: '-0.03em',
          marginBottom: '1rem',
          maxWidth: '600px', margin: '0 auto 1rem',
        }}>
          Only 2 territories available this quarter.
        </h2>
        <p style={{
          color: 'rgba(255,255,255,0.4)',
          fontSize: '1rem', lineHeight: 1.7,
          maxWidth: '520px', margin: '0 auto 2.5rem',
        }}>
          We take one contractor per trade per market. Once your territory is locked, your competition can&apos;t access this system.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <MagneticButton href="/contact">
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'white', color: '#000000',
              padding: '14px 32px', borderRadius: '100px',
              fontWeight: 700, fontSize: '0.875rem',
            }}>
              Check territory availability <ArrowRight size={15} />
            </span>
          </MagneticButton>
          <MagneticButton
            href="#packages"
            onClick={() => document.querySelector('[data-section="packages"]')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'transparent', color: 'rgba(255,255,255,0.6)',
              padding: '13px 31px', borderRadius: '100px',
              fontWeight: 600, fontSize: '0.875rem',
              border: '1.5px solid rgba(255,255,255,0.15)',
            }}>
              See pricing again
            </span>
          </MagneticButton>
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
