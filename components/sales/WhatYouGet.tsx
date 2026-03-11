'use client';

import { useGsapScrollPin } from '@/hooks/useGsapScrollPin';
import { useScrollReveal, fadeUp, stagger } from '@/hooks/useScrollReveal';
import { Crosshair, Zap, TrendingUp } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Capture',
    subtitle: 'Fill your pipeline with qualified homeowners.',
    icon: Crosshair,
    accent: '#FE6462',
    features: [
      'Meta & Google ad campaigns built for your trade',
      'High-converting landing pages with lead capture',
      'Google Business Profile optimization & local SEO',
      'Lead routing — every inquiry into your CRM instantly',
    ],
  },
  {
    number: '02',
    title: 'Convert',
    subtitle: 'Automate follow-up so no lead goes cold.',
    icon: Zap,
    accent: '#6B8EFE',
    features: [
      '60-second automated response via SMS & email',
      'Appointment booking with calendar integration',
      'CRM pipeline — track every lead from click to close',
      'Rehash Engine™ — re-engage old unsold leads',
    ],
  },
  {
    number: '03',
    title: 'Close',
    subtitle: 'Equip your reps to win bigger jobs.',
    icon: TrendingUp,
    accent: '#94D96B',
    features: [
      'In-home sales training — scripts & objection handling',
      'iPad presentation app — branded to your company',
      'Quoting software with Good/Better/Best pricing',
      'Revenue reporting & close rate analytics',
    ],
  },
];

function MobileStack() {
  const { ref, inView } = useScrollReveal({ threshold: 0.05 });

  return (
    <div ref={ref as React.Ref<HTMLDivElement>} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {steps.map((step, i) => {
        const Icon = step.icon;
        return (
          <div
            key={step.number}
            style={{
              background: '#111111',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px',
              padding: '2rem',
              ...fadeUp(inView, stagger(i, 0, 150)),
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.25rem' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: `${step.accent}12`,
                border: `1px solid ${step.accent}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={20} style={{ color: step.accent }} />
              </div>
              <div>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: step.accent, letterSpacing: '0.12em' }}>
                  {step.number}
                </span>
                <h3 style={{
                  fontFamily: 'DM Sans, sans-serif', fontSize: '1.25rem',
                  fontWeight: 800, color: 'white', lineHeight: 1.2,
                }}>
                  {step.title}
                </h3>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {step.subtitle}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {step.features.map((f, fi) => (
                <div key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{
                    width: '5px', height: '5px', borderRadius: '50%',
                    background: step.accent, flexShrink: 0, marginTop: '7px', opacity: 0.6,
                  }} />
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
                    {f}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function WhatYouGet() {
  const { containerRef, progress, isMobile } = useGsapScrollPin(3000);
  const { ref: headerRef, inView: headerInView } = useScrollReveal({ threshold: 0.2 });

  const activeIndex = Math.min(Math.floor(progress * 3), 2);

  return (
    <section style={{ background: '#0A0A0A', padding: isMobile ? '96px 0' : 0 }}>
      <div className="container">
        {/* Header */}
        <div
          ref={headerRef as React.Ref<HTMLDivElement>}
          style={{
            textAlign: 'center',
            paddingTop: isMobile ? 0 : '96px',
            paddingBottom: '3.5rem',
            ...fadeUp(headerInView),
          }}
        >
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '1rem',
          }}>
            <span style={{ width: '20px', height: '1px', background: 'rgba(255,255,255,0.15)' }} />
            The System
            <span style={{ width: '20px', height: '1px', background: 'rgba(255,255,255,0.15)' }} />
          </span>
          <h2 style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em',
            color: 'white', marginBottom: '1rem',
          }}>
            Three engines. One system.
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.4)', fontSize: '1rem', lineHeight: 1.7,
            maxWidth: '500px', margin: '0 auto',
          }}>
            Every piece connects. Scroll to see how leads flow from first click to closed deal.
          </p>
        </div>

        {isMobile ? (
          <MobileStack />
        ) : (
          <div
            ref={containerRef}
            style={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              gap: '80px',
            }}
          >
            {/* Left — pinned step indicator */}
            <div style={{ flex: '0 0 340px' }}>
              {steps.map((step, i) => {
                const isActive = i === activeIndex;
                const isPast = i < activeIndex;
                const Icon = step.icon;

                return (
                  <div
                    key={step.number}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: '20px',
                      padding: '24px 0',
                      opacity: isActive ? 1 : isPast ? 0.3 : 0.15,
                      transform: isActive ? 'translateX(0)' : 'translateX(-8px)',
                      transition: 'all 0.6s cubic-bezier(0.22,1,0.36,1)',
                    }}
                  >
                    <div style={{
                      width: '52px', height: '52px', borderRadius: '14px',
                      background: isActive ? `${step.accent}15` : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isActive ? `${step.accent}30` : 'rgba(255,255,255,0.06)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.6s ease',
                    }}>
                      <Icon size={22} style={{ color: isActive ? step.accent : 'rgba(255,255,255,0.2)', transition: 'color 0.6s' }} />
                    </div>
                    <div>
                      <span style={{
                        fontSize: '0.65rem', fontWeight: 700,
                        color: isActive ? step.accent : 'rgba(255,255,255,0.2)',
                        letterSpacing: '0.12em',
                        transition: 'color 0.6s',
                      }}>
                        STEP {step.number}
                      </span>
                      <h3 style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '1.75rem', fontWeight: 800,
                        color: 'white', lineHeight: 1.2,
                        marginBottom: '0.25rem',
                      }}>
                        {step.title}
                      </h3>
                      <p style={{
                        color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', lineHeight: 1.5,
                      }}>
                        {step.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Progress bar */}
              <div style={{
                height: '2px', background: 'rgba(255,255,255,0.06)',
                borderRadius: '2px', marginTop: '8px',
              }}>
                <div style={{
                  height: '100%', borderRadius: '2px',
                  background: steps[activeIndex].accent,
                  width: `${progress * 100}%`,
                  transition: 'background 0.4s ease',
                }} />
              </div>
            </div>

            {/* Right — content panels */}
            <div style={{ flex: 1, position: 'relative', minHeight: '400px' }}>
              {steps.map((step, i) => {
                const isActive = i === activeIndex;

                return (
                  <div
                    key={step.number}
                    style={{
                      position: 'absolute', top: 0, left: 0, right: 0,
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'translateY(0) scale(1)' : `translateY(${i > activeIndex ? '40px' : '-40px'}) scale(0.96)`,
                      transition: 'all 0.7s cubic-bezier(0.22,1,0.36,1)',
                      pointerEvents: isActive ? 'auto' : 'none',
                    }}
                  >
                    <div style={{
                      background: '#111111',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderTop: `2px solid ${step.accent}`,
                      borderRadius: '20px',
                      padding: '2.5rem',
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {step.features.map((f, fi) => (
                          <div
                            key={fi}
                            style={{
                              display: 'flex', alignItems: 'flex-start', gap: '14px',
                              padding: '14px 18px',
                              background: 'rgba(255,255,255,0.03)',
                              borderRadius: '12px',
                              border: '1px solid rgba(255,255,255,0.05)',
                              opacity: isActive ? 1 : 0,
                              transform: isActive ? 'translateX(0)' : 'translateX(20px)',
                              transition: `all 0.5s cubic-bezier(0.22,1,0.36,1) ${fi * 100}ms`,
                            }}
                          >
                            <span style={{
                              width: '6px', height: '6px', borderRadius: '50%',
                              background: step.accent, flexShrink: 0, marginTop: '7px',
                            }} />
                            <span style={{
                              fontSize: '0.95rem', color: 'rgba(255,255,255,0.65)',
                              lineHeight: 1.5, fontWeight: 500,
                            }}>
                              {f}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Step counter */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        marginTop: '2rem', paddingTop: '1.5rem',
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                      }}>
                        <span style={{
                          fontFamily: 'DM Sans, sans-serif',
                          fontSize: '3.5rem', fontWeight: 800,
                          color: step.accent, opacity: 0.15,
                          letterSpacing: '-0.04em', lineHeight: 1,
                        }}>
                          {step.number}
                        </span>
                        <div>
                          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>
                            Step {i + 1} of 3
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
