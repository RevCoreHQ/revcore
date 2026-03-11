'use client';

import { Zap, Award, Layers } from 'lucide-react';
import { useScrollReveal, fadeUp, scaleUp, stagger } from '@/hooks/useScrollReveal';

const solutions = [
  {
    icon: <Zap size={24} />,
    title: '60-Second Response',
    description: 'Automated follow-up fires the instant a lead comes in. SMS, email, and AI callbacks so no lead ever goes cold.',
    accent: '#94D96B',
  },
  {
    icon: <Award size={24} />,
    title: 'Premium Sales System',
    description: 'In-home sales training, Good/Better/Best pricing, custom proposals, and iPad presentations that close $28K+ jobs.',
    accent: '#6B8EFE',
  },
  {
    icon: <Layers size={24} />,
    title: 'Unified Revenue Stack',
    description: 'Ads, CRM, automation, website, SEO, and sales tools all connected. One system, one dashboard, one team managing it all.',
    accent: '#FE6462',
  },
];

export default function SolutionOverview() {
  const { ref, inView } = useScrollReveal({ threshold: 0.12 });

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      style={{ padding: '96px 0', background: '#ffffff' }}
    >
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem', ...fadeUp(inView) }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'var(--color-gray)', marginBottom: '1rem',
          }}>
            <span style={{ width: '20px', height: '2px', background: '#94D96B', display: 'block' }} />
            The Solution
            <span style={{ width: '20px', height: '2px', background: '#94D96B', display: 'block' }} />
          </div>
          <h2 style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em',
            marginBottom: '1rem',
          }}>
            One system. Every revenue lever.
          </h2>
          <p style={{ color: 'var(--color-gray)', maxWidth: '520px', margin: '0 auto', lineHeight: '1.8' }}>
            RevCore builds and manages a complete revenue engine — from the ad click to the signed contract. Every piece is connected and optimized.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {solutions.map((sol, i) => (
            <div
              key={sol.title}
              className="card-hover-glow"
              style={{
                background: '#fafafa',
                borderRadius: '20px',
                padding: '2.5rem 2rem',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
                ...scaleUp(inView, stagger(i, 100, 120)),
              }}
            >
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px',
                background: `${sol.accent}12`,
                border: `1px solid ${sol.accent}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: sol.accent,
                margin: '0 auto 1.5rem',
              }}>
                {sol.icon}
              </div>
              <h3 style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '1.125rem',
                fontWeight: 700,
                marginBottom: '0.75rem',
              }}>
                {sol.title}
              </h3>
              <p style={{ color: 'var(--color-gray)', fontSize: '0.875rem', lineHeight: '1.7' }}>
                {sol.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          section > .container > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
