'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useScrollReveal, fadeUp, stagger } from '@/hooks/useScrollReveal';

const services = [
  {
    id: 'meta', number: '01', title: 'Meta Ads Management',
    price: '$1,200', period: '/mo', note: '+ ad spend',
    accent: '#FE6462',
    description: 'Facebook & Instagram ad campaigns hyper-targeted to homeowners in your service area. Every lead routed directly into your CRM with automated follow-up.',
    includes: ['Campaign build & creative', 'Audience targeting & retargeting', 'A/B split testing', 'Weekly performance reports', 'Lead routing to CRM'],
  },
  {
    id: 'google', number: '02', title: 'Google Ads Management',
    price: '$1,200', period: '/mo', note: '+ ad spend',
    accent: '#FEB64A',
    description: 'Search and Local Services Ads to capture high-intent homeowners the moment they search. We handle setup, bidding, landing pages, and conversion tracking.',
    includes: ['Search & LSA campaigns', 'Keyword research & negative lists', 'Landing page optimization', 'Conversion tracking setup', 'Monthly reporting'],
  },
  {
    id: 'website', number: '03', title: 'Website & Local SEO',
    price: '$2,500', period: ' setup', note: '+ $600/mo SEO retainer',
    accent: '#6B8EFE',
    description: 'A custom conversion-optimized website built for your trade, plus local SEO that gets you ranking in your market.',
    includes: ['Custom website design & build', 'Google Business Profile optimization', 'Local keyword strategy', 'Review generation system', 'Monthly SEO reporting'],
  },
  {
    id: 'crm', number: '04', title: 'CRM & Automation Engine',
    price: '$1,500', period: ' setup', note: '+ $400/mo',
    accent: '#94D96B',
    description: 'Leads, follow-ups, reminders, and rehash campaigns centralized in one custom CRM. Set up once, runs 24/7.',
    includes: ['Custom CRM build & configuration', 'SMS & email follow-up sequences', 'Appointment reminder automation', 'Rehash Engine™', 'Review request automation'],
  },
  {
    id: 'training', number: '05', title: 'In-Home Sales Training',
    price: '$2,500', period: '/session', note: 'On-site or virtual',
    accent: '#FEB64A',
    description: 'We train your reps in the field — scripts, objection handling, Good/Better/Best pricing, and how to close at the kitchen table.',
    includes: ['In-home sales scripts', 'Objection handling frameworks', 'Good/Better/Best pricing strategy', 'Role-play & ride-alongs', 'Custom sales presentation build'],
  },
];

function ServiceRow({ service, index, inView }: { service: typeof services[0]; index: number; inView: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      borderBottom: '1px solid #EBEBEB',
      ...fadeUp(inView, stagger(index, 100, 80)),
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '1.5rem 0',
          display: 'grid', gridTemplateColumns: '40px 1fr auto 40px',
          alignItems: 'center', gap: '16px',
          background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{
          fontSize: '0.7rem', fontWeight: 700, color: service.accent,
          letterSpacing: '0.1em', opacity: 0.6,
        }}>
          {service.number}
        </span>
        <span style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '1.1rem', fontWeight: 700, color: '#0A0A0A', lineHeight: 1.3,
        }}>
          {service.title}
        </span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
          <span style={{
            fontFamily: 'DM Sans, sans-serif', fontSize: '1.25rem',
            fontWeight: 800, color: '#0A0A0A', letterSpacing: '-0.02em',
          }}>
            {service.price}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#BBB' }}>
            {service.period}
          </span>
        </div>
        <ChevronDown
          size={16}
          style={{
            color: '#CCC', justifySelf: 'end',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1)',
          }}
        />
      </button>

      <div style={{
        maxHeight: open ? '400px' : '0px',
        overflow: 'hidden',
        transition: 'max-height 0.5s cubic-bezier(0.22,1,0.36,1)',
      }}>
        <div style={{
          padding: '0 0 1.5rem',
          display: 'grid', gridTemplateColumns: '40px 1fr',
          gap: '16px',
        }}>
          <div />
          <div>
            <p style={{
              color: '#777', fontSize: '0.875rem',
              lineHeight: 1.7, marginBottom: '1rem', maxWidth: '520px',
            }}>
              {service.description}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
              {service.includes.map((item) => (
                <span key={item} style={{
                  padding: '5px 12px', borderRadius: '100px',
                  background: '#F5F5F5',
                  border: '1px solid #E8E8E8',
                  fontSize: '0.75rem', color: '#666', fontWeight: 500,
                }}>
                  {item}
                </span>
              ))}
            </div>
            <span style={{ fontSize: '0.78rem', color: service.accent, fontWeight: 600 }}>
              {service.note}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AlaCarteServices() {
  const { ref, inView } = useScrollReveal({ threshold: 0.05 });

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      style={{ padding: '96px 0', background: '#FFFFFF' }}
    >
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem', ...fadeUp(inView) }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: '#999', marginBottom: '1rem',
          }}>
            <span style={{ width: '20px', height: '1px', background: '#DDD' }} />
            A La Carte
            <span style={{ width: '20px', height: '1px', background: '#DDD' }} />
          </span>
          <h2 style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em',
            color: '#0A0A0A', marginBottom: '0.75rem',
          }}>
            Prefer to start with one service?
          </h2>
          <p style={{ color: '#888', fontSize: '0.95rem', lineHeight: 1.7 }}>
            Pick what fits your stage. Most clients start with one or two and expand.{' '}
            <button
              onClick={() => document.querySelector('[data-section="packages"]')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#6B8EFE', fontWeight: 600, fontSize: '0.95rem',
                padding: 0, fontFamily: 'inherit',
              }}
            >
              Bundle into a package for the best rate →
            </button>
          </p>
        </div>

        {/* Accordion rows */}
        <div style={{ borderTop: '1px solid #EBEBEB' }}>
          {services.map((service, i) => (
            <ServiceRow key={service.id} service={service} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
