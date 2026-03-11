'use client';

import SpaceBackground from '@/components/SpaceBackground';
import GradientText from '@/components/GradientText';
import MagneticButton from '@/components/MagneticButton';
import { useScrollReveal, useCountUp, textLineReveal, fadeUp } from '@/hooks/useScrollReveal';

const stats = [
  { value: 28, suffix: 'x', label: 'Avg ROI', color: '#FE6462' },
  { value: 98, suffix: '%', label: 'Show rate', color: '#94D96B' },
  { value: 28, prefix: '$', suffix: 'K', label: 'Avg ticket', color: '#6B8EFE' },
  { value: 91, suffix: '%', label: 'Retention', color: '#FEB64A' },
];

function HeroStat({ stat, active, index }: { stat: typeof stats[0]; active: boolean; index: number }) {
  const count = useCountUp(stat.value, active, 1600);
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', gap: '6px',
      ...fadeUp(active, 800 + index * 100),
    }}>
      <span style={{
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '1.5rem',
        fontWeight: 800,
        color: stat.color,
        letterSpacing: '-0.02em',
      }}>
        {stat.prefix || ''}{count}{stat.suffix}
      </span>
      <span style={{
        color: 'rgba(255,255,255,0.3)',
        fontSize: '0.75rem',
        fontWeight: 500,
      }}>
        {stat.label}
      </span>
    </div>
  );
}

export default function SalesHero() {
  const { ref, inView } = useScrollReveal({ threshold: 0.1 });

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      style={{
        background: '#0A0A0A',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '120px 2rem 80px',
      }}
    >
      <SpaceBackground opacity={0.3} />

      <div style={{
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
        maxWidth: '900px',
      }}>
        {/* Tag */}
        <div style={{
          ...textLineReveal(inView, 0, 0, 200),
          marginBottom: '2.5rem',
        }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)',
          }}>
            <span style={{ width: '20px', height: '1px', background: 'rgba(255,255,255,0.2)' }} />
            For Home Service Contractors
            <span style={{ width: '20px', height: '1px', background: 'rgba(255,255,255,0.2)' }} />
          </span>
        </div>

        {/* Headline */}
        <h1 style={{ fontFamily: 'DM Sans, sans-serif', marginBottom: '2rem' }}>
          <span style={{
            display: 'block',
            fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
            fontWeight: 800,
            color: 'transparent',
            WebkitTextStroke: '1.5px rgba(255,255,255,0.5)',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            ...textLineReveal(inView, 1, 0, 200),
          }}>
            Stop leaving
          </span>
          <span style={{
            display: 'block',
            lineHeight: 0.95,
            margin: '0.1em 0',
            ...textLineReveal(inView, 2, 0, 200),
          }}>
            <GradientText
              colors={['#FE6462', '#FF8A65', '#FE6462']}
              speed={6}
              style={{
                fontSize: 'clamp(4rem, 10vw, 8rem)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              revenue
            </GradientText>
          </span>
          <span style={{
            display: 'block',
            fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
            fontWeight: 800,
            color: 'transparent',
            WebkitTextStroke: '1.5px rgba(255,255,255,0.5)',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            ...textLineReveal(inView, 3, 0, 200),
          }}>
            on the table.
          </span>
        </h1>

        {/* Subhead */}
        <p style={{
          color: 'rgba(255,255,255,0.45)',
          fontSize: '1.1rem',
          lineHeight: '1.7',
          maxWidth: '520px',
          margin: '0 auto 2.5rem',
          ...textLineReveal(inView, 4, 0, 200),
        }}>
          The complete revenue system for contractors who are done leaving money on the table.
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap',
          marginBottom: '4rem',
          ...fadeUp(inView, 1000),
        }}>
          <MagneticButton
            href="#packages"
            onClick={() => document.querySelector('[data-section="packages"]')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'white', color: '#000000',
              padding: '14px 32px', borderRadius: '100px',
              fontWeight: 700, fontSize: '0.875rem',
            }}>
              See Packages
            </span>
          </MagneticButton>
          <MagneticButton href="/contact">
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'transparent', color: 'rgba(255,255,255,0.6)',
              padding: '13px 31px', borderRadius: '100px',
              fontWeight: 600, fontSize: '0.875rem',
              border: '1.5px solid rgba(255,255,255,0.15)',
            }}>
              Check Territory
            </span>
          </MagneticButton>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
          flexWrap: 'wrap',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '2rem',
        }}>
          {stats.map((stat, i) => (
            <HeroStat key={stat.label} stat={stat} active={inView} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
