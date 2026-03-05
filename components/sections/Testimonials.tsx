'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    quote: "Before RevCore we were chasing $8K jobs. Now we're closing $28K average tickets and turning down work we don't want. The in-home sales training alone paid for everything 10x over.",
    name: 'Marcus T.',
    role: 'Owner, Apex Roofing Co.',
    initials: 'MT',
    color: '#FE6462',
    trade: 'Roofing',
  },
  {
    quote: "The system called a lead at 11pm and had them booked for an appointment by morning. I woke up to a confirmed appointment, no one on my team touched it. That alone is game-changing.",
    name: 'Derek L.',
    role: 'Owner, Climate Pro HVAC',
    initials: 'DL',
    color: '#4FC3F7',
    trade: 'HVAC',
  },
  {
    quote: "28x ROI in the first 90 days. I've worked with 3 other marketing agencies and none of them came close. RevCore is the only team that actually understands the contractor business.",
    name: 'James K.',
    role: 'Owner, Solar Summit',
    initials: 'JK',
    color: '#FEB64A',
    trade: 'Solar',
  },
  {
    quote: "The exclusive territory thing is real. My competitor tried to sign up and was told the market was locked. That's exactly what I wanted, and it's still locked a year later.",
    name: 'Brian S.',
    role: 'Owner, Premier Windows',
    initials: 'BS',
    color: '#94D96B',
    trade: 'Windows & Doors',
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  const t = testimonials[current];

  return (
    <section style={{ padding: '120px 0', background: 'var(--color-bg)', overflow: 'hidden' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-tag" style={{ justifyContent: 'center' }}>Partner Reviews</div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            Contractors who stopped racing to the bottom
          </h2>
        </div>

        <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '1.5rem' }}>
            {[...Array(5)].map((_, i) => (
              <span key={i} style={{ color: '#FEB64A', fontSize: '1.25rem' }}>★</span>
            ))}
          </div>

          <span style={{
            display: 'inline-block', marginBottom: '1.5rem',
            background: `${t.color}1a`, color: t.color,
            padding: '3px 12px', borderRadius: '100px',
            fontSize: '0.72rem', fontWeight: 700,
            border: `1px solid ${t.color}44`,
            textTransform: 'uppercase', letterSpacing: '0.1em',
            transition: 'all 0.3s',
          }}>
            {t.trade}
          </span>

          <blockquote style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
            lineHeight: '1.75',
            color: 'var(--color-primary)',
            fontStyle: 'italic',
            marginBottom: '2.5rem',
            minHeight: '120px',
          }}>
            &ldquo;{t.quote}&rdquo;
          </blockquote>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: t.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: '0.875rem',
              transition: 'background 0.3s',
            }}>
              {t.initials}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{t.name}</div>
              <div style={{ color: 'var(--color-gray)', fontSize: '0.8125rem' }}>{t.role}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '3rem' }}>
            <button onClick={prev} style={{
              width: '44px', height: '44px', borderRadius: '50%',
              border: '1.5px solid var(--color-border)', background: 'transparent',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'inherit'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
            >
              <ChevronLeft size={18} />
            </button>

            <div style={{ display: 'flex', gap: '8px' }}>
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} style={{
                  width: i === current ? '24px' : '8px',
                  height: '8px', borderRadius: '100px',
                  background: i === current ? 'var(--color-primary)' : 'var(--color-border)',
                  border: 'none', cursor: 'pointer',
                  transition: 'all 0.3s ease', padding: 0,
                }} />
              ))}
            </div>

            <button onClick={next} style={{
              width: '44px', height: '44px', borderRadius: '50%',
              border: '1.5px solid var(--color-border)', background: 'transparent',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'inherit'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
