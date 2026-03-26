'use client';

import { useState } from 'react';
import { useScrollReveal, fadeUp, slideFromLeft, slideFromRight } from '@/hooks/useScrollReveal';
import AnimatedText from '@/components/AnimatedText';

const steps = [
  {
    number: '01',
    title: 'Strategy Session',
    description: 'We map your ideal customer profile, identify high-income target areas, and audit your current sales process. No guessing, just a clear picture of where revenue is being left on the table.',
    detail: 'Market analysis, competitor audit, territory selection, ICP definition',
  },
  {
    number: '02',
    title: 'System Build',
    description: 'We build your custom growth stack, Meta ad campaigns, landing pages, automated follow-up sequences, CRM setup, and your trade-specific quoting and sales presentation software.',
    detail: 'Ads, funnels, auto callbacks, CRM, quoting software, sales decks',
  },
  {
    number: '03',
    title: 'Launch & Optimize',
    description: 'We go live, monitor every metric, and optimize weekly. Your reps go through in-home sales training while the system starts delivering qualified appointments.',
    detail: 'Campaign launch, A/B testing, sales training, weekly optimization calls',
  },
  {
    number: '04',
    title: 'Scale & Dominate',
    description: 'Once the system is dialed in, we scale ad spend, expand your territory, and help you build the team and processes to dominate your market.',
    detail: 'Territory expansion, team hiring support, scaling ad budget, market lock-in',
  },
];

export default function Process() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const { ref, inView } = useScrollReveal({ threshold: 0.08 });

  return (
    <section ref={ref as React.Ref<HTMLElement>} style={{ padding: 'clamp(48px, 8vw, 120px) 0', background: 'var(--color-bg)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'start' }}>
          {/* Left — sticky heading */}
          <div style={{ position: 'sticky', top: '120px', ...slideFromLeft(inView, 0) }}>
            <div className="section-tag" style={{ ...fadeUp(inView, 0) }}>How We Work</div>
            <AnimatedText
              as="h2"
              inView={inView}
              delay={150}
              stagger={85}
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}
            >
              From strategy to dominating your market
            </AnimatedText>
            <p style={{ color: 'var(--color-gray)', lineHeight: '1.8', maxWidth: '400px', marginBottom: '2rem', ...fadeUp(inView, 600) }}>
              Every RevCore partner goes through the same proven four-phase system, built to generate qualified appointments fast and build the foundation for long-term market dominance.
            </p>
            {activeStep !== null && (
              <div style={{
                padding: '1.25rem 1.5rem',
                background: 'var(--color-primary)',
                borderRadius: '14px',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.8rem',
                lineHeight: '1.6',
              }}>
                <span style={{ color: 'var(--color-accent)', fontWeight: 700, display: 'block', marginBottom: '4px', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Phase {steps[activeStep].number} includes:
                </span>
                {steps[activeStep].detail}
              </div>
            )}
          </div>

          {/* Right — steps */}
          <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', ...slideFromRight(inView, 100) }}>
            {/* Animated progress line */}
            <div style={{
              position: 'absolute',
              left: '24px',
              top: '0',
              bottom: '0',
              width: '2px',
              background: 'var(--color-border)',
              zIndex: 0,
            }}>
              <div style={{
                width: '100%',
                height: inView ? '100%' : '0%',
                background: 'var(--color-accent)',
                transition: 'height 2.5s cubic-bezier(0.22,1,0.36,1) 0.5s',
              }} />
            </div>
            {steps.map((step, i) => (
              <div
                key={step.number}
                onMouseEnter={() => setActiveStep(i)}
                onMouseLeave={() => setActiveStep(null)}
                style={{
                  display: 'flex', gap: '1.5rem',
                  padding: '2rem 0',
                  borderBottom: i < steps.length - 1 ? '1px solid var(--color-border)' : 'none',
                  cursor: 'default',
                  position: 'relative',
                  zIndex: 1,
                  opacity: activeStep !== null && activeStep !== i
                    ? 0.4
                    : inView ? 1 : 0,
                  transform: inView ? 'translateY(0px)' : 'translateY(52px)',
                  transition: `opacity 0.85s cubic-bezier(0.22,1,0.36,1) ${300 + i * 200}ms, transform 0.85s cubic-bezier(0.22,1,0.36,1) ${300 + i * 200}ms`,
                }}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: activeStep === i ? 'var(--color-accent)' : 'var(--color-primary)',
                  color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.8rem',
                  flexShrink: 0,
                  transition: 'background 0.25s',
                }}>
                  {step.number}
                </div>
                <div>
                  <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    {step.title}
                  </h3>
                  <p style={{ color: 'var(--color-gray)', fontSize: '0.875rem', lineHeight: '1.7' }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          section > .container > div {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </section>
  );
}
