'use client';

import { useScrollReveal, useCountUp, scaleUp, fadeUp, clipReveal, stagger } from '@/hooks/useScrollReveal';

const caseStudies = [
  {
    trade: 'ROOFING',
    tradeColor: '#FE6462',
    beforeLabel: 'Avg ticket before',
    beforeValue: '$8K',
    afterLabel: 'Avg ticket after',
    afterValue: 28,
    afterPrefix: '$',
    afterSuffix: 'K',
    timeline: 'In 90 days',
    quote: '"RevCore\'s system changed how we sell. Our reps went from discounting to closing premium jobs."',
  },
  {
    trade: 'REMODELING',
    tradeColor: '#6B8EFE',
    beforeLabel: 'Monthly revenue',
    beforeValue: '$120K',
    afterLabel: 'Monthly revenue',
    afterValue: 340,
    afterPrefix: '$',
    afterSuffix: 'K',
    timeline: 'In 6 months',
    quote: '"We went from 8 jobs a month to 22 — and every one was at a higher ticket."',
  },
];

const roiStats = [
  { label: 'Avg. close rate lift', value: 34, suffix: '%', prefix: '+', note: 'With software + training', color: '#FE6462' },
  { label: 'Avg. ticket increase', value: 2400, suffix: '', prefix: '+$', note: 'With Good/Better/Best pricing', color: '#94D96B' },
  { label: 'Lead rehash recovery', value: 18, suffix: '%', prefix: '', note: 'Of old leads re-engaged', color: '#6B8EFE' },
  { label: 'Client retention', value: 91, suffix: '%', prefix: '', note: 'Stay past 12 months', color: '#FEB64A' },
];

function RoiStat({ stat, active, index }: { stat: typeof roiStats[0]; active: boolean; index: number }) {
  const count = useCountUp(stat.value, active, 2000);
  const display = stat.value >= 1000
    ? `${stat.prefix}${count.toLocaleString()}`
    : `${stat.prefix}${count}${stat.suffix}`;

  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '16px',
      padding: '2rem',
      textAlign: 'center',
      ...scaleUp(active, stagger(index, 200, 150)),
    }}>
      <p style={{
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '2.5rem',
        fontWeight: 800,
        color: stat.color,
        letterSpacing: '-0.02em',
        marginBottom: '4px',
      }}>
        {display}
      </p>
      <p style={{ color: 'white', fontWeight: 700, fontSize: '0.875rem', marginBottom: '4px' }}>
        {stat.label}
      </p>
      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>{stat.note}</p>
    </div>
  );
}

export default function ResultsSection() {
  const { ref, inView } = useScrollReveal({ threshold: 0.08 });
  const { ref: statsRef, inView: statsInView } = useScrollReveal({ threshold: 0.15 });

  return (
    <section style={{ padding: '96px 0', background: '#0A0A0A' }}>
      <div className="container">
        <div ref={ref as React.Ref<HTMLDivElement>} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem',
            ...fadeUp(inView),
          }}>
            <span style={{ width: '24px', height: '2px', background: '#94D96B', display: 'block' }} />
            Proven Results
            <span style={{ width: '24px', height: '2px', background: '#94D96B', display: 'block' }} />
          </div>
          <h2 style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            fontWeight: 800, color: 'white',
            letterSpacing: '-0.02em', lineHeight: 1.1,
            marginBottom: '1rem',
            ...clipReveal(inView, 200),
          }}>
            What happens when the system is live
          </h2>
        </div>

        {/* Case studies */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '4rem' }}>
          {caseStudies.map((cs, i) => (
            <div
              key={cs.trade}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '20px',
                padding: '2rem',
                ...scaleUp(inView, stagger(i, 300, 150)),
              }}
            >
              <span style={{
                background: `${cs.tradeColor}18`,
                color: cs.tradeColor,
                fontSize: '0.65rem', fontWeight: 800,
                padding: '3px 10px', borderRadius: '100px',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                border: `1px solid ${cs.tradeColor}30`,
              }}>
                {cs.trade}
              </span>

              <div style={{
                display: 'flex', alignItems: 'center', gap: '24px',
                margin: '1.5rem 0',
              }}>
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>
                    {cs.beforeLabel}
                  </p>
                  <p style={{
                    fontFamily: 'DM Sans, sans-serif', fontSize: '1.75rem', fontWeight: 800,
                    color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through',
                    letterSpacing: '-0.02em',
                  }}>
                    {cs.beforeValue}
                  </p>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '1.5rem' }}>→</span>
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>
                    {cs.afterLabel}
                  </p>
                  <p style={{
                    fontFamily: 'DM Sans, sans-serif', fontSize: '1.75rem', fontWeight: 800,
                    color: cs.tradeColor, letterSpacing: '-0.02em',
                  }}>
                    {cs.afterPrefix}{cs.afterValue}{cs.afterSuffix}
                  </p>
                </div>
                <span style={{
                  background: 'rgba(148,217,107,0.12)',
                  color: '#94D96B',
                  fontSize: '0.7rem', fontWeight: 700,
                  padding: '4px 10px', borderRadius: '100px',
                  border: '1px solid rgba(148,217,107,0.2)',
                  marginLeft: 'auto',
                }}>
                  {cs.timeline}
                </span>
              </div>

              <p style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.875rem',
                lineHeight: '1.6',
                fontStyle: 'italic',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                paddingTop: '1rem',
              }}>
                {cs.quote}
              </p>
            </div>
          ))}
        </div>

        {/* ROI stats */}
        <div
          ref={statsRef as React.Ref<HTMLDivElement>}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}
        >
          {roiStats.map((stat, i) => (
            <RoiStat key={stat.label} stat={stat} active={statsInView} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1fr 1fr"],
          div[style*="grid-template-columns: repeat(4, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
