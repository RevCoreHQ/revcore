'use client';

import { useScrollReveal, useCountUp, fadeUp } from '@/hooks/useScrollReveal';

const stats = [
  { value: 28, suffix: 'x', label: 'Avg ROI', color: '#FE6462' },
  { value: 98, suffix: '%', label: 'Show rate', color: '#94D96B' },
  { value: 28, prefix: '$', suffix: 'K', label: 'Avg ticket', color: '#6B8EFE' },
  { value: 91, suffix: '%', label: 'Retention', color: '#FEB64A' },
];

function StatItem({ stat, active, index }: { stat: typeof stats[0]; active: boolean; index: number }) {
  const count = useCountUp(stat.value, active, 1600);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      ...fadeUp(active, index * 100),
    }}>
      <div style={{
        width: '8px', height: '8px', borderRadius: '50%',
        background: stat.color,
        boxShadow: `0 0 12px ${stat.color}60`,
      }} />
      <div>
        <span style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '1.5rem',
          fontWeight: 800,
          color: 'white',
          letterSpacing: '-0.02em',
        }}>
          {stat.prefix || ''}{count}{stat.suffix}
        </span>
        <span style={{
          color: 'rgba(255,255,255,0.4)',
          fontSize: '0.78rem',
          fontWeight: 500,
          marginLeft: '8px',
        }}>
          {stat.label}
        </span>
      </div>
    </div>
  );
}

export default function SocialProofBar() {
  const { ref, inView } = useScrollReveal({ threshold: 0.3 });

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      style={{
        background: '#0A0A0A',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '32px 0',
      }}
    >
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '24px',
      }}>
        {stats.map((stat, i) => (
          <StatItem key={stat.label} stat={stat} active={inView} index={i} />
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          section > .container {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
