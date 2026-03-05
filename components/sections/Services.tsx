'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useScrollReveal, fadeUp, scaleUp } from '@/hooks/useScrollReveal';
import AnimatedText from '@/components/AnimatedText';

const services = [
  {
    number: '01',
    title: 'Lead Generation',
    short: 'Pay-per-appointment. 12–50+ qualified leads per month.',
    description: 'We run targeted Meta ad campaigns, database reactivation sequences, and geo-specific landing pages to deliver homeowners with real budget, not tire-kickers. Exclusive territory means your market is locked.',
    tags: ['Meta Ads', 'Pay-Per-Appointment', 'Geo Targeting', 'Database Reactivation'],
    color: '#0f1923',
    accent: '#FE6462',
  },
  {
    number: '02',
    title: 'Organic Growth',
    short: 'SEO + AEO that owns your market long-term.',
    description: 'We build 20–40 page conversion-optimized websites combined with traditional SEO and Answer Engine Optimization (AEO) to dominate search engines and answer results before your competitors catch on.',
    tags: ['SEO', 'AEO', 'Website Build', 'Content Strategy'],
    color: '#0f231a',
    accent: '#94D96B',
  },
  {
    number: '03',
    title: 'Smart Automation',
    short: '60-second callbacks. Zero leads lost.',
    description: 'Our proprietary system calls every new lead within 60 seconds, qualifies them, auto-books appointments with SMS reminders, and follows up via personalized sequences, so your team only talks to serious buyers.',
    tags: ['Auto Callbacks', 'Auto-Booking', 'SMS Sequences', 'Review Requests'],
    color: '#1a0f23',
    accent: '#6B8EFE',
  },
  {
    number: '04',
    title: 'In-Home Sales Training',
    short: 'Close premium jobs at $28K+ average ticket.',
    description: 'Our proven in-home sales training teaches your reps to control the room, handle objections on the spot, and close higher-value jobs, producing 47% higher close rates than industry standard.',
    tags: ['Close Rate Optimization', 'Objection Handling', 'Premium Pricing', 'Field Training'],
    color: '#231a0f',
    accent: '#FEB64A',
  },
  {
    number: '05',
    title: 'Custom Sales Presentations',
    short: 'Interactive presentation software built to win.',
    description: 'Trade-specific interactive sales presentation software that helps your reps walk through proposals, before/after comparisons, financing options, and social proof, all on an iPad, right at the kitchen table.',
    tags: ['Interactive Decks', 'Trade-Specific', 'iPad Ready', 'Custom Branding'],
    color: '#0f1a23',
    accent: '#4FC3F7',
  },
  {
    number: '06',
    title: 'Quoting & Pricing Software',
    short: 'Quote on-site. Present options. Lock in the sale.',
    description: 'Custom quoting software lets your team generate accurate proposals at the door, present good/better/best options with visuals, and collect e-signatures before leaving the driveway.',
    tags: ['On-Site Quoting', 'Good/Better/Best', 'Proposal Generator', 'E-Signature'],
    color: '#1a230f',
    accent: '#94D96B',
  },
];

const stages = [
  {
    label: 'Attract',
    step: '01',
    nodes: [
      { name: 'Lead Generation', accent: '#FE6462', detail: 'Meta Ads · Database Reactivation' },
      { name: 'Organic Growth', accent: '#94D96B', detail: 'SEO · AEO · Website' },
    ],
  },
  {
    label: 'Qualify',
    step: '02',
    nodes: [
      { name: 'Smart Automation', accent: '#6B8EFE', detail: '60-sec callback · Auto-book · SMS' },
    ],
  },
  {
    label: 'Present',
    step: '03',
    nodes: [
      { name: 'Sales Presentations', accent: '#4FC3F7', detail: 'iPad decks · Before/after · Financing' },
      { name: 'Quoting Software', accent: '#94D96B', detail: 'On-site quote · E-signature' },
    ],
  },
  {
    label: 'Close',
    step: '04',
    nodes: [
      { name: 'In-Home Training', accent: '#FEB64A', detail: 'Objection handling · Premium pricing' },
    ],
  },
  {
    label: 'Results',
    step: '05',
    nodes: [
      { name: '$28K avg ticket', accent: '#FE6462', detail: 'vs. $8K industry avg' },
      { name: '47% close rate', accent: '#94D96B', detail: 'vs. industry standard' },
      { name: '28x ROI', accent: '#6B8EFE', detail: 'average partner return' },
    ],
  },
];

export default function Services() {
  const [hovered, setHovered] = useState<number | null>(null);
  const { ref: headerRef, inView: headerIn } = useScrollReveal();
  const { ref: cardsRef, inView: cardsIn } = useScrollReveal({ threshold: 0.05 });
  const { ref: diagramRef, inView: diagramIn } = useScrollReveal({ threshold: 0.1 });

  return (
    <section style={{ padding: '120px 0', background: 'var(--color-bg)' }}>
      <div className="container">
        <div
          ref={headerRef as React.Ref<HTMLDivElement>}
          style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3.5rem', flexWrap: 'wrap', gap: '1rem' }}
        >
          <div>
            <div className="section-tag" style={{ ...fadeUp(headerIn, 0) }}>What We Do</div>
            <AnimatedText
              as="h2"
              inView={headerIn}
              delay={120}
              stagger={90}
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' }}
            >
              The full growth stack
            </AnimatedText>
          </div>
          <div style={{ ...fadeUp(headerIn, 150) }}>
            <Link href="/services" className="btn-outline">
              All services <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Service cards */}
        <div ref={cardsRef as React.Ref<HTMLDivElement>} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
          {services.map((service, i) => (
            <div
              key={service.number}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                borderRadius: '20px',
                background: service.color,
                padding: '2.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                minHeight: '280px',
                ...scaleUp(cardsIn, i * 130),
                ...(cardsIn && {
                  transition: `opacity 0.9s cubic-bezier(0.22,1,0.36,1) ${i * 130}ms, transform 0.9s cubic-bezier(0.22,1,0.36,1) ${i * 130}ms, box-shadow 0.3s ease`,
                  transform: hovered === i ? 'translateY(-8px) scale(1)' : 'translateY(0) scale(1)',
                  boxShadow: hovered === i ? '0 24px 60px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.12)',
                }),
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.1em' }}>
                  {service.number}
                </span>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  border: `1px solid ${service.accent}55`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: service.accent,
                  background: hovered === i ? `${service.accent}22` : 'transparent',
                  transition: 'background 0.2s',
                }}>
                  <ArrowRight size={14} />
                </div>
              </div>

              <div>
                <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3rem', fontWeight: 700, color: 'white', marginBottom: '0.6rem', lineHeight: 1.2 }}>
                  {service.title}
                </h3>
                <p style={{
                  fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.65',
                  overflow: 'hidden', transition: 'max-height 0.4s ease',
                  maxHeight: hovered === i ? '160px' : '48px',
                }}>
                  {hovered === i ? service.description : service.short}
                </p>
                <div style={{
                  display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '1rem',
                  opacity: hovered === i ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                  pointerEvents: hovered === i ? 'auto' : 'none',
                }}>
                  {service.tags.map((tag) => (
                    <span key={tag} style={{
                      padding: '3px 10px', borderRadius: '100px',
                      background: `${service.accent}1a`, color: service.accent,
                      fontSize: '0.7rem', fontWeight: 600,
                      border: `1px solid ${service.accent}33`,
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* System flow diagram */}
        <div ref={diagramRef as React.Ref<HTMLDivElement>} style={{
          marginTop: '3rem',
          background: '#0A0A0A',
          borderRadius: '24px',
          padding: '2.5rem 3rem',
          position: 'relative',
          overflow: 'hidden',
          ...fadeUp(diagramIn, 0),
        }}>
          {/* Background grid texture */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            pointerEvents: 'none',
          }} />

          {/* Header */}
          <div style={{ marginBottom: '2.5rem', position: 'relative' }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '6px' }}>
              System Architecture
            </p>
            <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: 'white', letterSpacing: '-0.01em' }}>
              Every piece is connected. Every stage feeds the next.
            </h3>
          </div>

          {/* Flow stages */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0', position: 'relative', overflowX: 'auto', paddingBottom: '4px' }}>

            {/* Animated horizontal base line */}
            <svg style={{ position: 'absolute', top: '28px', left: 0, width: '100%', height: '2px', pointerEvents: 'none' }} preserveAspectRatio="none">
              <line x1="0" y1="1" x2="100%" y2="1" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <line x1="0" y1="1" x2="100%" y2="1"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1"
                strokeDasharray="6 8"
                className="diagram-flow-line"
              />
            </svg>

            {stages.map((stage, si) => (
              <div key={stage.step} style={{ display: 'flex', alignItems: 'flex-start', flex: si === stages.length - 1 ? '0 0 auto' : '1 1 0', minWidth: si === stages.length - 1 ? '160px' : '140px' }}>

                {/* Stage column */}
                <div style={{ flex: 1, paddingRight: '1rem' }}>
                  {/* Stage label + step */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: si === stages.length - 1 ? 'rgba(148,217,107,0.15)' : 'rgba(255,255,255,0.06)',
                      border: si === stages.length - 1 ? '1px solid rgba(148,217,107,0.4)' : '1px solid rgba(255,255,255,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                      zIndex: 1, position: 'relative',
                    }}>
                      <span style={{ fontSize: '0.6rem', fontWeight: 700, color: si === stages.length - 1 ? '#94D96B' : 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>
                        {stage.step}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                      {stage.label}
                    </span>
                  </div>

                  {/* Nodes */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {stage.nodes.map((node, ni) => (
                      <div key={ni} style={{
                        background: `${node.accent}0d`,
                        border: `1px solid ${node.accent}2a`,
                        borderRadius: '10px',
                        padding: '10px 12px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '3px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: node.accent, flexShrink: 0, display: 'block' }} />
                          <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.78rem', color: 'white' }}>
                            {node.name}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.67rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1.5, paddingLeft: '13px' }}>
                          {node.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Arrow connector (not after last stage) */}
                {si < stages.length - 1 && (
                  <div style={{
                    flexShrink: 0,
                    width: '32px',
                    paddingTop: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                      <path d="M0 8h18M14 3l6 5-6 5" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom footnote */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', maxWidth: '400px', lineHeight: 1.6 }}>
              Built as a unified system, not disconnected services. Each stage is optimized to feed qualified, high-intent buyers to the next.
            </p>
            <Link href="/contact" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '9px 18px', borderRadius: '100px',
              fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none',
              transition: 'background 0.2s, color 0.2s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
            >
              See the full system <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes diagram-flow {
          from { stroke-dashoffset: 28; }
          to { stroke-dashoffset: 0; }
        }
        .diagram-flow-line {
          animation: diagram-flow 1.4s linear infinite;
        }
        @media (max-width: 900px) {
          section > .container > div:nth-child(2) { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          section > .container > div:nth-child(2) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
