'use client';

import { Check } from 'lucide-react';
import { useScrollReveal, scaleUp, fadeUp, stagger } from '@/hooks/useScrollReveal';

const softwareOptions = [
  {
    id: 'quoting', name: 'Quoting & Proposal Software',
    description: 'Custom-built quoting platform your reps use on-site to generate professional proposals, present Good/Better/Best pricing, and track every job through your pipeline. Branded to your company.',
    setup: '$997', monthly: '$197', monthlyNote: '/mo per seat',
    accent: '#94D96B', color: '#0a1a0a',
    features: ['Custom branded proposal builder', 'Good / Better / Best pricing tiers', 'Job pipeline & status tracking', 'Digital quote delivery & acceptance', 'Automated follow-up on open quotes', 'Revenue & close rate reporting', 'Unlimited quote history'],
  },
  {
    id: 'presentation', name: 'iPad Presentation App',
    description: 'A professional visual sales presentation built for your trade. Walk homeowners through your process, show before/afters, present your packages, and collect e-signatures before you leave the driveway.',
    setup: '$1,497', monthly: '$147', monthlyNote: '/mo per seat',
    accent: '#6B8EFE', color: '#0a0f1a',
    features: ['Custom branded presentation', 'Trade-specific content & visuals', 'Package & option showcasing', 'E-signature collection', 'CRM integration', 'Annual content refresh included'],
  },
];

export default function SalesSoftware() {
  const { ref, inView } = useScrollReveal({ threshold: 0.08 });

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      style={{ padding: '96px 0', background: '#ffffff' }}
    >
      <div className="container">
        <div style={{ marginBottom: '4rem', ...fadeUp(inView) }}>
          <div className="section-tag">Proprietary Software</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'end' }}>
            <h2 style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em',
            }}>
              Close more deals with<br />our sales software
            </h2>
            <p style={{ color: 'var(--color-gray)', lineHeight: '1.8' }}>
              Built in-house for home service contractors. Not generic SaaS — tools designed around the in-home sales process, your trade, and your brand.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          {softwareOptions.map((sw, i) => (
            <div
              key={sw.id}
              className="card-hover-up"
              style={{
                borderRadius: '20px', overflow: 'hidden',
                border: `1px solid ${sw.accent}20`, background: 'white',
                ...scaleUp(inView, stagger(i, 100, 150)),
              }}
            >
              <div style={{ background: sw.color, padding: '2rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: sw.accent, marginBottom: '1rem' }} />
                <h3 style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '1.25rem', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: '0.75rem',
                }}>
                  {sw.name}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', lineHeight: '1.7' }}>
                  {sw.description}
                </p>
              </div>

              <div style={{ padding: '1.75rem 2rem' }}>
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
                  marginBottom: '1.75rem', padding: '1.25rem', background: '#F5F5F5', borderRadius: '14px',
                }}>
                  <div>
                    <p style={{ fontSize: '0.65rem', color: '#999', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                      Setup fee
                    </p>
                    <p style={{
                      fontFamily: 'DM Sans, sans-serif', fontSize: '1.75rem', fontWeight: 800,
                      color: '#0A0A0A', letterSpacing: '-0.02em',
                    }}>
                      {sw.setup}
                    </p>
                    <p style={{ fontSize: '0.72rem', color: '#999' }}>one-time</p>
                  </div>
                  <div style={{ borderLeft: '1px solid #E5E5E5', paddingLeft: '12px' }}>
                    <p style={{ fontSize: '0.65rem', color: '#999', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                      Monthly access
                    </p>
                    <p style={{
                      fontFamily: 'DM Sans, sans-serif', fontSize: '1.75rem', fontWeight: 800,
                      color: '#0A0A0A', letterSpacing: '-0.02em',
                    }}>
                      {sw.monthly}
                    </p>
                    <p style={{ fontSize: '0.72rem', color: '#999' }}>{sw.monthlyNote}</p>
                  </div>
                </div>

                <div>
                  {sw.features.map((f, fi) => (
                    <div key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                      <Check size={14} style={{ color: sw.accent, flexShrink: 0, marginTop: '3px' }} />
                      <span style={{ fontSize: '0.875rem', color: '#444', lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bundle callout */}
        <div style={{
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #0a0f1a 0%, #0f1a10 100%)',
          padding: '2.5rem 3rem',
          display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '2rem',
          border: '1px solid rgba(255,255,255,0.06)',
          ...fadeUp(inView, 400),
        }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(148,217,107,0.12)', border: '1px solid rgba(148,217,107,0.2)',
              borderRadius: '100px', padding: '4px 12px', marginBottom: '1rem',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94D96B' }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94D96B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Bundle Deal
              </span>
            </div>
            <h3 style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: '1.5rem', fontWeight: 800,
              color: 'white', marginBottom: '0.5rem',
            }}>
              Both tools together
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.45)', lineHeight: '1.7', maxWidth: '480px', fontSize: '0.9rem' }}>
              Get the Quoting Software and iPad Presentation App bundled at a reduced rate. Most clients see 20–35% higher close rates when both tools are used together.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
              Bundle pricing
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', justifyContent: 'flex-end' }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '2.75rem', fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>
                $1,997
              </span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}> setup</span>
            </div>
            <p style={{ color: '#94D96B', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.25rem' }}>
              + $297/mo per seat
            </p>
            <div style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px', padding: '8px 14px',
              display: 'inline-flex', alignItems: 'center', gap: '8px',
            }}>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'line-through' }}>
                $2,494 setup / $344/mo
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94D96B', fontWeight: 700 }}>
                You save $497 + $47/mo
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1fr 1fr"],
          div[style*="grid-template-columns: 1fr auto"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
