'use client';

import { Check } from 'lucide-react';
import { useScrollReveal, fadeUp, stagger } from '@/hooks/useScrollReveal';

const services = [
  {
    id: 'meta', number: '01', title: 'Meta Ads Management',
    description: 'Facebook & Instagram ad campaigns hyper-targeted to homeowners in your service area. Every lead routed directly into your CRM with automated follow-up.',
    startingAt: '$1,200', period: '/mo', note: '+ ad spend',
    accent: '#FE6462', color: '#1a0a0a',
    includes: ['Campaign build & creative', 'Audience targeting & retargeting', 'A/B split testing', 'Weekly performance reports', 'Lead routing to CRM'],
  },
  {
    id: 'google', number: '02', title: 'Google Ads Management',
    description: 'Search and Local Services Ads to capture high-intent homeowners the moment they search. We handle setup, bidding, landing pages, and conversion tracking.',
    startingAt: '$1,200', period: '/mo', note: '+ ad spend',
    accent: '#FEB64A', color: '#1a150a',
    includes: ['Search & LSA campaigns', 'Keyword research & negative lists', 'Landing page optimization', 'Conversion tracking setup', 'Monthly reporting'],
  },
  {
    id: 'website', number: '03', title: 'Website & Local SEO',
    description: 'A custom conversion-optimized website built for your trade, plus local SEO that gets you ranking in your market. Built to generate calls and form submissions.',
    startingAt: '$2,500', period: ' setup', note: '+ $600/mo SEO retainer',
    accent: '#6B8EFE', color: '#0a0f1a',
    includes: ['Custom website design & build', 'Google Business Profile optimization', 'Local keyword strategy', 'Review generation system', 'Monthly SEO reporting'],
  },
  {
    id: 'crm', number: '04', title: 'CRM & Automation Engine',
    description: 'Your leads, follow-ups, reminders, and rehash campaigns all centralized in one custom CRM. Set up once, runs 24/7 without your team touching anything.',
    startingAt: '$1,500', period: ' setup', note: '+ $400/mo',
    accent: '#94D96B', color: '#0a1a0a',
    includes: ['Custom CRM build & configuration', 'SMS & email follow-up sequences', 'Appointment reminder automation', 'Rehash Engine™ (old lead campaigns)', 'Review request automation'],
  },
  {
    id: 'training', number: '05', title: 'In-Home Sales Training',
    description: 'We train your reps in the field. Scripts, objection handling, how to present Good/Better/Best options, and how to close at the kitchen table at higher ticket prices.',
    startingAt: '$2,500', period: '/session', note: 'On-site or virtual',
    accent: '#FEB64A', color: '#1a150a',
    includes: ['In-home sales scripts', 'Objection handling frameworks', 'Good/Better/Best pricing strategy', 'Role-play & ride-alongs', 'Custom sales presentation build'],
  },
];

export default function AlaCarteServices() {
  const { ref, inView } = useScrollReveal({ threshold: 0.05 });

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      style={{ padding: '96px 0 80px', background: '#0A0A0A' }}
    >
      <div className="container">
        <div style={{ marginBottom: '3.5rem', ...fadeUp(inView) }}>
          <div className="section-tag">A La Carte Services</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'end' }}>
            <h2 style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em',
              color: 'white',
            }}>
              Prefer to start with<br />one service?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', lineHeight: '1.8' }}>
              Pick the services that fit your current stage. Most clients start with one or two and expand.{' '}
              <a
                href="#packages"
                onClick={(e) => { e.preventDefault(); document.querySelector('[data-section="packages"]')?.scrollIntoView({ behavior: 'smooth' }); }}
                style={{ color: '#6B8EFE', fontWeight: 600, textDecoration: 'none' }}
              >
                Bundle into a package for the best rate →
              </a>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {services.map((service, i) => (
            <div
              key={service.id}
              className="card-hover"
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                border: `1px solid ${service.accent}18`,
                ...fadeUp(inView, stagger(i, 100, 100)),
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 240px', minHeight: '200px' }}>
                <div style={{
                  background: service.color, padding: '2rem',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                }}>
                  <span style={{ fontSize: '0.68rem', color: service.accent, fontWeight: 700, letterSpacing: '0.12em', opacity: 0.7 }}>
                    {service.number}
                  </span>
                  <div>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: service.accent, marginBottom: '0.75rem' }} />
                    <h3 style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '1.25rem', fontWeight: 800, color: 'white', lineHeight: 1.2,
                    }}>
                      {service.title}
                    </h3>
                  </div>
                </div>

                <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <p style={{ color: 'rgba(255,255,255,0.45)', lineHeight: '1.75', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                    {service.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                    {service.includes.map((d) => (
                      <span key={d} style={{
                        padding: '4px 12px', borderRadius: '100px',
                        background: 'rgba(255,255,255,0.06)', fontSize: '0.75rem', fontWeight: 500,
                        border: `1px solid ${service.accent}30`, color: 'rgba(255,255,255,0.6)',
                      }}>
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{
                  padding: '2rem', background: 'rgba(255,255,255,0.02)',
                  borderLeft: `3px solid ${service.accent}20`,
                  display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', gap: '6px',
                }}>
                  <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                    Starting at
                  </p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                    <span style={{
                      fontFamily: 'DM Sans, sans-serif', fontSize: '2.25rem', fontWeight: 800,
                      color: 'white', letterSpacing: '-0.02em',
                    }}>
                      {service.startingAt}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                      {service.period}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: service.accent, fontWeight: 600 }}>
                    {service.note}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          div[style*="grid-template-columns: 280px 1fr 240px"] {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 900px) {
          section > .container > div:first-child > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
