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
      { label: '15 Qualified Appointments', sub: 'per month, guaranteed' },
      { label: 'Meta Ads Management', sub: 'full campaign setup & targeting' },
      { label: 'Lead Booking System', sub: 'qualification, routing & CRM' },
      { label: 'Automated Follow-up', sub: 'SMS, email & reminders' },
    ],
    moreFeatures: ['Basic CRM setup', 'Real-time lead notifications', 'Dedicated landing page', 'Weekly performance reports'],
  },
  {
    id: 'growth',
    name: 'Growth Partner',
    tagline: 'Complete top-of-funnel system with website and SEO.',
    priceMonthly: 3497,
    note: '+ ad spend (you control budget)',
    accent: '#6B8EFE',
    highlight: true,
    heroFeatures: [
      { label: '20+ Qualified Appointments', sub: 'per month, paid ads managed' },
      { label: 'Custom Website + Local SEO', sub: 'conversion-optimized, built for your trade' },
      { label: 'Full CRM & Pipeline', sub: 'tracking, nurture & follow-up sequences' },
      { label: '24/7 Chat Widget', sub: 'capture leads around the clock' },
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
      { label: 'Everything in Growth Partner', sub: 'every feature, fully managed' },
      { label: 'Dedicated Success Manager', sub: 'one point of contact, always' },
      { label: 'Full Automation Stack', sub: 'Rehash Engine™, review & referral automations' },
      { label: 'Sales Training & Tools', sub: 'scripts, quoting software & presentation app' },
    ],
    moreFeatures: ['Google Business optimization', 'AEO (AI Engine Optimization)', 'Custom sales presentation', '10-step sales framework', 'Sales audit & optimization', 'Monthly strategy sessions', 'Pricing configurator'],
  },
];

export default function SalesPackages() {
  const [isQuarterly, setIsQuarterly] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const { ref, inView } = useScrollReveal({ threshold: 0.08 });

  const fmtPrice = (monthly: number) => {
    const p = isQuarterly ? Math.round(monthly * 0.9) : monthly;
    return '$' + p.toLocaleString();
  };
  const quarterlyTotal = (monthly: number) => '$' + (Math.round(monthly * 0.9) * 3).toLocaleString();
  const monthlySavings = (monthly: number) => '$' + Math.round(monthly * 0.1).toLocaleString();

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      style={{ padding: '96px 0', background: '#070b0f', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '30%', left: '50%',
        transform: 'translateX(-50%)',
        width: '900px', height: '500px',
        background: 'radial-gradient(ellipse at center, rgba(107,142,254,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem', ...fadeUp(inView) }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '1rem',
          }}>
            <span style={{ width: '20px', height: '2px', background: '#6B8EFE', display: 'block' }} />
            Bundle Packages
            <span style={{ width: '20px', height: '2px', background: '#6B8EFE', display: 'block' }} />
          </div>
          <h2 style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em',
            color: 'white', marginBottom: '1rem',
          }}>
            Full-stack retainer packages
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '520px', margin: '0 auto 2rem', lineHeight: '1.8' }}>
            Bundling services into a package is significantly more cost-effective than a la carte. One retainer, one point of contact, all connected.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '100px', padding: '4px', gap: '2px',
            }}>
              <button
                onClick={() => setIsQuarterly(false)}
                style={{
                  padding: '8px 22px', borderRadius: '100px', border: 'none', cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.875rem',
                  background: !isQuarterly ? 'white' : 'transparent',
                  color: !isQuarterly ? '#0A0A0A' : 'rgba(255,255,255,0.45)',
                  transition: 'all 0.2s',
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsQuarterly(true)}
                style={{
                  padding: '8px 22px', borderRadius: '100px', border: 'none', cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.875rem',
                  background: isQuarterly ? 'white' : 'transparent',
                  color: isQuarterly ? '#0A0A0A' : 'rgba(255,255,255,0.45)',
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}
              >
                Quarterly
                <span style={{
                  background: '#94D96B', color: '#0a0a0a',
                  fontSize: '0.6rem', fontWeight: 800,
                  padding: '2px 7px', borderRadius: '100px', letterSpacing: '0.05em',
                }}>
                  SAVE 10%
                </span>
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', alignItems: 'center' }}>
          {packages.map((pkg, i) => (
            <div
              key={pkg.id}
              className={pkg.highlight ? 'pkg-highlight' : 'card-hover-up'}
              style={{
                borderRadius: '20px',
                background: 'linear-gradient(160deg, #13161e 0%, #1a1e2a 50%, #13161e 100%)',
                border: `1px solid ${pkg.accent}30`,
                overflow: 'hidden', position: 'relative',
                transform: pkg.highlight ? 'scale(1.045)' : 'scale(1)',
                zIndex: pkg.highlight ? 2 : 1,
                boxShadow: pkg.highlight
                  ? `0 0 0 1px ${pkg.accent}20, 0 -8px 160px 0px ${pkg.accent}28, 0 20px 60px rgba(0,0,0,0.6)`
                  : '0 4px 24px rgba(0,0,0,0.5)',
                transition: 'transform 0.3s ease',
                ...scaleUp(inView, stagger(i, 200, 150)),
              }}
            >
              <div style={{
                height: '3px',
                background: `linear-gradient(90deg, transparent 0%, ${pkg.accent} 40%, ${pkg.accent} 60%, transparent 100%)`,
                opacity: pkg.highlight ? 1 : 0.5,
              }} />

              {pkg.highlight && (
                <div style={{
                  position: 'absolute', top: '19px', right: '16px',
                  background: `linear-gradient(135deg, ${pkg.accent}ee, ${pkg.accent}99)`,
                  color: 'white',
                  fontSize: '0.62rem', fontWeight: 800,
                  padding: '4px 12px', borderRadius: '100px',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  boxShadow: `0 2px 12px ${pkg.accent}50`,
                }}>
                  Most Popular
                </div>
              )}

              <div style={{ padding: '1.75rem 1.75rem 1.25rem' }}>
                <h3 style={{
                  fontFamily: 'DM Sans, sans-serif', fontSize: '1.2rem', fontWeight: 800,
                  color: 'white', marginBottom: '0.3rem',
                }}>
                  {pkg.name}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                  {pkg.tagline}
                </p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px', marginBottom: '2px' }}>
                  <span style={{
                    fontFamily: 'DM Sans, sans-serif', fontSize: '2.5rem', fontWeight: 800,
                    letterSpacing: '-0.03em', color: 'white',
                  }}>
                    {fmtPrice(pkg.priceMonthly)}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.28)' }}>/mo</span>
                </div>

                {isQuarterly ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
                      billed {quarterlyTotal(pkg.priceMonthly)}/quarter
                    </span>
                    <span style={{
                      fontSize: '0.68rem', fontWeight: 700, color: '#94D96B',
                      background: 'rgba(148,217,107,0.12)', border: '1px solid rgba(148,217,107,0.2)',
                      padding: '2px 8px', borderRadius: '100px',
                    }}>
                      save {monthlySavings(pkg.priceMonthly)}/mo
                    </span>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.75rem', color: pkg.accent, fontWeight: 600 }}>
                    {pkg.note}
                  </span>
                )}
              </div>

              <div style={{ padding: '0 1.75rem 1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{
                  fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)',
                  margin: '1rem 0 0.75rem',
                }}>
                  What&apos;s included
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {pkg.heroFeatures.map((f, fi) => (
                    <div key={fi} style={{
                      background: `${pkg.accent}0e`,
                      border: `1px solid ${pkg.accent}20`,
                      borderLeft: `3px solid ${pkg.accent}`,
                      borderRadius: '8px', padding: '9px 12px',
                    }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.88)', marginBottom: '1px' }}>
                        {f.label}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.38)', lineHeight: 1.4 }}>
                        {f.sub}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setExpandedCards(prev => ({ ...prev, [pkg.id]: !prev[pkg.id] }))}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', fontWeight: 600,
                    marginTop: '10px', padding: '0', transition: 'color 0.15s',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
                >
                  <ChevronDown
                    size={13}
                    style={{
                      transform: expandedCards[pkg.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}
                  />
                  {expandedCards[pkg.id]
                    ? 'Show less'
                    : `See all ${pkg.heroFeatures.length + pkg.moreFeatures.length} features`}
                </button>

                {expandedCards[pkg.id] && (
                  <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {pkg.moreFeatures.map((f, fi) => (
                      <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Check size={12} style={{ color: pkg.accent, flexShrink: 0 }} />
                        <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ padding: '1rem 1.75rem 1.75rem' }}>
                <button
                  style={{
                    width: '100%', padding: '13px', borderRadius: '100px',
                    fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', border: 'none',
                    background: pkg.highlight
                      ? `linear-gradient(135deg, ${pkg.accent}dd 0%, ${pkg.accent}99 100%)`
                      : `${pkg.accent}18`,
                    color: 'white', transition: 'opacity 0.2s, transform 0.2s',
                    boxShadow: pkg.highlight ? `0 4px 24px ${pkg.accent}45` : 'none',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 30-Day Guarantee */}
        <div style={{
          textAlign: 'center', marginTop: '3rem',
          ...fadeUp(inView, 600),
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(148,217,107,0.08)',
            border: '1px solid rgba(148,217,107,0.15)',
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
        @keyframes pkg-glow-pulse {
          0%, 100% { box-shadow: 0 0 0 1px rgba(107,142,254,0.2), 0 -8px 160px 0px rgba(107,142,254,0.28), 0 20px 60px rgba(0,0,0,0.6); }
          50%       { box-shadow: 0 0 0 1px rgba(107,142,254,0.35), 0 -8px 200px 0px rgba(107,142,254,0.42), 0 20px 60px rgba(0,0,0,0.6); }
        }
        .pkg-highlight {
          animation: pkg-glow-pulse 3s ease-in-out infinite;
          transition: transform 0.3s ease;
        }
        .pkg-highlight:hover { transform: scale(1.055) !important; }
        @media (max-width: 900px) {
          div[style*="grid-template-columns: repeat(3, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
