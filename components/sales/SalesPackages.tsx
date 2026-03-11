'use client';

import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { useScrollReveal, scaleUp, fadeUp, stagger } from '@/hooks/useScrollReveal';

const packages = [
  {
    id: 'launchpad',
    name: 'Launchpad',
    tagline: 'Test the waters. Only pay for results.',
    priceMonthly: 2500,
    note: '+ ad spend',
    accent: '#FE6462',
    highlight: false,
    heroFeatures: [
      '15 qualified appointments/mo, guaranteed',
      'Meta Ads — full campaign setup & targeting',
      'Lead booking system — qualification & CRM',
      'Automated follow-up — SMS, email & reminders',
    ],
    moreFeatures: ['Basic CRM setup', 'Real-time lead notifications', 'Dedicated landing page', 'Weekly performance reports'],
  },
  {
    id: 'growth',
    name: 'Growth Engine',
    tagline: 'Complete top-of-funnel system with website and SEO.',
    priceMonthly: 3497,
    note: '+ ad spend (you control budget)',
    accent: '#6B8EFE',
    highlight: true,
    heroFeatures: [
      '20+ qualified appointments/mo, paid ads managed',
      'Custom website + local SEO for your trade',
      'Full CRM & pipeline — tracking & nurture',
      '24/7 chat widget — capture leads around the clock',
    ],
    moreFeatures: ['Google & Meta ad campaigns', 'Automated appointment reminders', 'Lead nurture sequences', 'Monthly performance reporting'],
  },
  {
    id: 'revenue',
    name: 'Revenue Partner',
    tagline: 'Complete revenue engine with automation and sales optimization.',
    priceMonthly: 4997,
    note: '+ 4% revenue share on closed deals',
    accent: '#94D96B',
    highlight: false,
    heroFeatures: [
      'Everything in Growth Engine, fully managed',
      'Dedicated success manager — one point of contact',
      'Full automation stack — Rehash Engine™ & more',
      'Sales training & tools — scripts, software & presentations',
    ],
    moreFeatures: ['Google Business optimization', 'AEO (AI Engine Optimization)', 'Custom sales presentation', '10-step sales framework', 'Sales audit & optimization', 'Monthly strategy sessions', 'Pricing configurator'],
  },
];

export default function SalesPackages() {
  const [isQuarterly, setIsQuarterly] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const { ref, inView } = useScrollReveal({ threshold: 0.06 });

  const fmtPrice = (monthly: number) => {
    const p = isQuarterly ? Math.round(monthly * 0.9) : monthly;
    return '$' + p.toLocaleString();
  };
  const quarterlyTotal = (monthly: number) => '$' + (Math.round(monthly * 0.9) * 3).toLocaleString();
  const monthlySavings = (monthly: number) => '$' + Math.round(monthly * 0.1).toLocaleString();

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      data-section="packages"
      style={{ padding: '120px 0', background: '#000000' }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem', ...fadeUp(inView) }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '1rem',
          }}>
            <span style={{ width: '20px', height: '1px', background: 'rgba(255,255,255,0.15)' }} />
            Packages
            <span style={{ width: '20px', height: '1px', background: 'rgba(255,255,255,0.15)' }} />
          </span>
          <h2 style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em',
            color: 'white', marginBottom: '1.5rem',
          }}>
            One system. Three ways in.
          </h2>

          {/* Billing toggle */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '100px', padding: '4px', gap: '2px',
            }}>
              <button
                onClick={() => setIsQuarterly(false)}
                style={{
                  padding: '8px 22px', borderRadius: '100px', border: 'none', cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.875rem',
                  background: !isQuarterly ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: !isQuarterly ? 'white' : 'rgba(255,255,255,0.4)',
                  transition: 'all 0.25s',
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsQuarterly(true)}
                style={{
                  padding: '8px 22px', borderRadius: '100px', border: 'none', cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.875rem',
                  background: isQuarterly ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: isQuarterly ? 'white' : 'rgba(255,255,255,0.4)',
                  transition: 'all 0.25s',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}
              >
                Quarterly
                <span style={{
                  background: '#94D96B', color: '#000',
                  fontSize: '0.6rem', fontWeight: 800,
                  padding: '2px 7px', borderRadius: '100px', letterSpacing: '0.05em',
                }}>
                  SAVE 10%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', alignItems: 'start' }}>
          {packages.map((pkg, i) => (
            <div
              key={pkg.id}
              style={{
                borderRadius: '20px',
                background: '#111111',
                border: `1px solid rgba(255,255,255,0.08)`,
                borderTop: pkg.highlight ? `2px solid ${pkg.accent}` : `1px solid rgba(255,255,255,0.08)`,
                overflow: 'hidden',
                position: 'relative',
                transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1), border-color 0.3s ease, box-shadow 0.4s ease',
                ...scaleUp(inView, stagger(i, 100, 150)),
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = `translateY(-4px)${pkg.highlight ? ' scale(1.02)' : ''}`;
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = pkg.highlight ? 'scale(1.02)' : '';
                e.currentTarget.style.borderColor = pkg.highlight ? pkg.accent : 'rgba(255,255,255,0.08)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {pkg.highlight && (
                <div style={{
                  position: 'absolute', top: '16px', right: '16px',
                  background: pkg.accent,
                  color: 'white',
                  fontSize: '0.62rem', fontWeight: 800,
                  padding: '4px 12px', borderRadius: '100px',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                }}>
                  Most Popular
                </div>
              )}

              {/* Pricing */}
              <div style={{ padding: '2rem 2rem 1.5rem' }}>
                <h3 style={{
                  fontFamily: 'DM Sans, sans-serif', fontSize: '1.25rem', fontWeight: 800,
                  color: 'white', marginBottom: '0.25rem',
                }}>
                  {pkg.name}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                  {pkg.tagline}
                </p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px', marginBottom: '4px' }}>
                  <span style={{
                    fontFamily: 'DM Sans, sans-serif', fontSize: '2.75rem', fontWeight: 800,
                    letterSpacing: '-0.03em', color: 'white',
                  }}>
                    {fmtPrice(pkg.priceMonthly)}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.25)' }}>/mo</span>
                </div>

                {isQuarterly ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
                      billed {quarterlyTotal(pkg.priceMonthly)}/quarter
                    </span>
                    <span style={{
                      fontSize: '0.68rem', fontWeight: 700, color: '#94D96B',
                      background: 'rgba(148,217,107,0.08)', border: '1px solid rgba(148,217,107,0.15)',
                      padding: '2px 8px', borderRadius: '100px',
                    }}>
                      save {monthlySavings(pkg.priceMonthly)}/mo
                    </span>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: pkg.accent, fontWeight: 600 }}>
                    {pkg.note}
                  </span>
                )}
              </div>

              {/* Features */}
              <div style={{ padding: '0 2rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{
                  fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)',
                  margin: '1.25rem 0 1rem',
                }}>
                  What&apos;s included
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {pkg.heroFeatures.map((f, fi) => (
                    <div key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <Check size={14} style={{ color: pkg.accent, flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                        {f}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setExpandedCards(prev => ({ ...prev, [pkg.id]: !prev[pkg.id] }))}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', fontWeight: 600,
                    marginTop: '12px', padding: '0', transition: 'color 0.2s',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
                >
                  <ChevronDown
                    size={13}
                    style={{
                      transform: expandedCards[pkg.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1)',
                    }}
                  />
                  {expandedCards[pkg.id] ? 'Show less' : `See all ${pkg.heroFeatures.length + pkg.moreFeatures.length} features`}
                </button>

                {expandedCards[pkg.id] && (
                  <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {pkg.moreFeatures.map((f, fi) => (
                      <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Check size={12} style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CTA */}
              <div style={{ padding: '0 2rem 2rem' }}>
                <button
                  style={{
                    width: '100%', padding: '14px', borderRadius: '12px',
                    fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
                    background: pkg.highlight ? pkg.accent : 'transparent',
                    color: 'white',
                    border: pkg.highlight ? 'none' : '1px solid rgba(255,255,255,0.12)',
                    transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.opacity = '0.85'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.opacity = '1'; }}
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantee */}
        <div style={{
          textAlign: 'center', marginTop: '3rem',
          ...fadeUp(inView, 600),
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(148,217,107,0.06)',
            border: '1px solid rgba(148,217,107,0.1)',
            borderRadius: '100px', padding: '8px 20px',
          }}>
            <span style={{ fontSize: '1rem' }}>🛡️</span>
            <span style={{ color: '#94D96B', fontSize: '0.8rem', fontWeight: 700 }}>
              30-Day Performance Guarantee
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: repeat(3, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
