'use client';

import { Phone, Wrench, Rocket } from 'lucide-react';
import { useScrollReveal, fadeUp, stagger } from '@/hooks/useScrollReveal';

const steps = [
  {
    number: '01',
    icon: <Phone size={24} />,
    title: 'Strategy Call',
    description: 'We audit your market, identify your ICP, and map exactly where revenue is leaking. 30 minutes. No pitch.',
    accent: '#FE6462',
  },
  {
    number: '02',
    icon: <Wrench size={24} />,
    title: 'Custom System Build',
    description: 'We build your entire growth stack: ads, website, automation, CRM, sales tools. Typically live in 14 days.',
    accent: '#6B8EFE',
  },
  {
    number: '03',
    icon: <Rocket size={24} />,
    title: 'Launch & Scale',
    description: 'Qualified appointments start flowing. Your reps close bigger deals. We optimize weekly and scale what works.',
    accent: '#94D96B',
  },
];

export default function HowItWorks() {
  const { ref, inView } = useScrollReveal({ threshold: 0.12 });

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      style={{ padding: '96px 0', background: '#0A0A0A' }}
    >
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem', ...fadeUp(inView) }}>
          <div className="section-tag" style={{ justifyContent: 'center' }}>How It Works</div>
          <h2 style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em',
            color: 'white',
          }}>
            From zero to qualified appointments in 3 steps
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', position: 'relative' }}>
          {/* Connecting lines */}
          <svg
            style={{
              position: 'absolute',
              top: '48px',
              left: '16.67%',
              width: '66.67%',
              height: '4px',
              overflow: 'visible',
              zIndex: 0,
            }}
          >
            <line
              x1="0" y1="2" x2="100%" y2="2"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="2"
              strokeDasharray="8 6"
              style={{
                strokeDashoffset: inView ? '0' : '200',
                transition: 'stroke-dashoffset 2s cubic-bezier(0.22,1,0.36,1) 0.5s',
              }}
            />
          </svg>

          {steps.map((step, i) => (
            <div
              key={step.number}
              style={{
                textAlign: 'center',
                padding: '0 2rem',
                position: 'relative',
                zIndex: 1,
                ...fadeUp(inView, stagger(i, 200, 200)),
              }}
            >
              <div style={{
                width: '96px', height: '96px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                border: `2px solid ${step.accent}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem',
                color: step.accent,
                boxShadow: `0 8px 32px ${step.accent}15`,
                position: 'relative',
              }}>
                {step.icon}
                <span style={{
                  position: 'absolute', top: '-4px', right: '-4px',
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: step.accent,
                  color: 'white',
                  fontSize: '0.7rem', fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'DM Sans, sans-serif',
                }}>
                  {step.number}
                </span>
              </div>
              <h3 style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '1.125rem',
                fontWeight: 700,
                marginBottom: '0.75rem',
                color: 'white',
              }}>
                {step.title}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', lineHeight: '1.7' }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          section > .container > div:last-child {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          section > .container > div:last-child > svg {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
