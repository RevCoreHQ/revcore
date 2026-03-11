'use client';

import { useScrollReveal, useCountUp, scaleUp, fadeUp, stagger } from '@/hooks/useScrollReveal';

const bigStats = [
  { value: 28, suffix: 'x', label: 'Avg ROI', note: 'Across all partners', color: '#FE6462' },
  { value: 34, suffix: '%', prefix: '+', label: 'Close rate lift', note: 'With software + training', color: '#94D96B' },
  { value: 28, suffix: 'K', prefix: '$', label: 'Avg ticket', note: 'Per closed job', color: '#6B8EFE' },
  { value: 91, suffix: '%', label: 'Retention', note: 'Stay past 12 months', color: '#FEB64A' },
];

const secondaryStats = [
  { value: '60s', label: 'Avg lead response time' },
  { value: '2,400+', label: 'Appointments booked' },
  { value: '18%', label: 'Old leads re-engaged' },
];

function BigStat({ stat, active, index }: { stat: typeof bigStats[0]; active: boolean; index: number }) {
  const count = useCountUp(stat.value, active, 2000);

  return (
    <div style={{
      textAlign: 'center',
      padding: '2.5rem 1.5rem',
      ...scaleUp(active, stagger(index, 200, 150)),
    }}>
      <p style={{
        fontFamily: 'DM Sans, sans-serif',
        fontSize: 'clamp(3.5rem, 7vw, 5.5rem)',
        fontWeight: 800,
        color: stat.color,
        letterSpacing: '-0.04em',
        lineHeight: 1,
        marginBottom: '8px',
      }}>
        {stat.prefix || ''}{count}{stat.suffix}
      </p>
      <p style={{
        color: 'white', fontWeight: 700, fontSize: '0.95rem',
        marginBottom: '4px',
      }}>
        {stat.label}
      </p>
      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem' }}>
        {stat.note}
      </p>
    </div>
  );
}

export default function ResultsSection() {
  const { ref, inView } = useScrollReveal({ threshold: 0.08 });

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      style={{ padding: '120px 0', background: '#0A0A0A' }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem', ...fadeUp(inView) }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '1rem',
          }}>
            <span style={{ width: '20px', height: '1px', background: 'rgba(255,255,255,0.15)' }} />
            Results
            <span style={{ width: '20px', height: '1px', background: 'rgba(255,255,255,0.15)' }} />
          </span>
          <h2 style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em',
            color: 'white',
          }}>
            The numbers speak.
          </h2>
        </div>

        {/* Big stats 2x2 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1px',
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '3rem',
        }}>
          {bigStats.map((stat, i) => (
            <div key={stat.label} style={{ background: '#0A0A0A' }}>
              <BigStat stat={stat} active={inView} index={i} />
            </div>
          ))}
        </div>

        {/* Secondary stats */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '48px',
          marginBottom: '4rem',
          ...fadeUp(inView, 600),
        }}>
          {secondaryStats.map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <p style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: '1.5rem',
                fontWeight: 800, color: 'white', letterSpacing: '-0.02em',
                marginBottom: '4px',
              }}>
                {s.value}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem' }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div style={{
          textAlign: 'center', maxWidth: '600px', margin: '0 auto',
          ...fadeUp(inView, 800),
        }}>
          <p style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: '1.1rem',
            lineHeight: 1.8,
            fontStyle: 'italic',
            fontFamily: 'DM Sans, sans-serif',
          }}>
            &ldquo;RevCore&apos;s system changed how we sell. Our reps went from discounting to closing premium jobs consistently.&rdquo;
          </p>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem', marginTop: '1rem', fontWeight: 600 }}>
            — Roofing contractor, Dallas TX
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: repeat(4, 1fr)"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 500px) {
          div[style*="grid-template-columns: repeat(4, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
