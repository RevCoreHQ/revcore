'use client';

import { Clock, DollarSign, Unplug } from 'lucide-react';
import { useScrollReveal, slideFromLeft, slideFromRight, stagger } from '@/hooks/useScrollReveal';

const problems = [
  {
    icon: <Clock size={20} />,
    title: 'Leads go cold in minutes',
    description: 'Your competitors respond in 60 seconds. Your team responds in 6 hours. By then the homeowner has 3 other quotes.',
  },
  {
    icon: <DollarSign size={20} />,
    title: 'Your reps sell on price, not value',
    description: 'Without proper training and tools, your team defaults to discounting. That $28K job becomes a $12K race to the bottom.',
  },
  {
    icon: <Unplug size={20} />,
    title: 'Your tools don\'t talk to each other',
    description: 'CRM here, ads there, website somewhere else. No unified system means no way to know what\'s actually working.',
  },
];

export default function ProblemAgitation() {
  const { ref, inView } = useScrollReveal({ threshold: 0.1 });

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      style={{ padding: '96px 0', background: '#0A0A0A' }}
    >
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'start' }}>
          <div style={slideFromLeft(inView)}>
            <div className="section-tag">The Problem</div>
            <h2 style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '1.25rem',
              color: 'white',
            }}>
              You&apos;re bleeding revenue and don&apos;t even know it.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', lineHeight: '1.8', maxWidth: '420px' }}>
              The average home service contractor leaves 40–60% of their revenue on the table. Not because they lack talent — because they lack systems.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {problems.map((problem, i) => (
              <div
                key={problem.title}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  borderLeft: '3px solid #FE6462',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderLeftWidth: '3px',
                  borderLeftColor: '#FE6462',
                  ...slideFromRight(inView, stagger(i, 150, 150)),
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'rgba(254,100,98,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#FE6462', flexShrink: 0,
                  }}>
                    {problem.icon}
                  </div>
                  <h3 style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'white',
                  }}>
                    {problem.title}
                  </h3>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', lineHeight: '1.7', paddingLeft: '48px' }}>
                  {problem.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          section > .container > div {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}
