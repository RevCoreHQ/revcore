'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SpaceBackground from '@/components/SpaceBackground';
import VideoBackground from '@/components/VideoBackground';
import MagneticButton from '@/components/MagneticButton';
import { useScrollReveal, blurReveal } from '@/hooks/useScrollReveal';

const VIDEO_URL = 'https://assets.cdn.filesafe.space/NYlSya2nYSkSnnXEbY2l/media/69aa0befde2e7de2a9765ced.mp4';

export default function CTA() {
  const { ref, inView } = useScrollReveal({ threshold: 0.15 });

  return (
    <section style={{ padding: '80px 0', background: 'var(--color-white)' }}>
      <div className="container">
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          style={{
            background: 'var(--color-primary)',
            borderRadius: '32px',
            padding: 'clamp(3rem, 6vw, 6rem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            flexWrap: 'wrap',
            position: 'relative',
            overflow: 'hidden',
            ...blurReveal(inView),
          }}
        >
          <SpaceBackground opacity={0.6} />
          <VideoBackground src={VIDEO_URL} opacity={0.05} />

          <div style={{
            position: 'absolute', top: '-100px', right: '-100px',
            width: '400px', height: '400px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(254,100,98,0.2) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '-80px', left: '30%',
            width: '300px', height: '300px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(107,142,254,0.1) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(148,217,107,0.15)', color: '#94D96B',
              padding: '4px 14px', borderRadius: '100px',
              fontSize: '0.72rem', fontWeight: 700,
              border: '1px solid rgba(148,217,107,0.3)',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              marginBottom: '1.25rem',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94D96B', display: 'block' }} />
              Now accepting new partners
            </div>
            <h2 style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 'clamp(1.75rem, 4vw, 3rem)',
              fontWeight: 800, color: 'white',
              lineHeight: 1.15, letterSpacing: '-0.02em',
              maxWidth: '560px',
            }}>
              Ready to stop competing on price and start winning on value?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '1rem', fontSize: '1rem', lineHeight: '1.7', maxWidth: '440px' }}>
              Book a free strategy session. We&apos;ll show you exactly what&apos;s possible in your market, and whether your territory is still available.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
            <MagneticButton href="/contact">
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'white', color: 'var(--color-primary)',
                padding: '14px 32px', borderRadius: '100px',
                fontWeight: 700, fontSize: '0.875rem',
                whiteSpace: 'nowrap',
              }}>
                Book a strategy call <ArrowRight size={16} />
              </span>
            </MagneticButton>
            <MagneticButton href="/portfolio">
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                background: 'transparent', color: 'rgba(255,255,255,0.7)',
                padding: '13px 31px', borderRadius: '100px',
                fontWeight: 600, fontSize: '0.875rem',
                border: '1.5px solid rgba(255,255,255,0.2)',
                whiteSpace: 'nowrap',
              }}>
                See partner results
              </span>
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
