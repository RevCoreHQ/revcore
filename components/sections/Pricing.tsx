import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const industries = [
  { name: 'Roofing', color: '#1a0f0f', accent: '#FE6462' },
  { name: 'Window Companies', color: '#0f0f1a', accent: '#6B8EFE' },
  { name: 'Interior Remodeling', color: '#1a0a0a', accent: '#94D96B' },
  { name: 'General Contractors', color: '#0f1a10', accent: '#94D96B' },
  { name: 'Stucco & Siding', color: '#1a0f1a', accent: '#FE6462' },
  { name: 'Decks & Patios', color: '#1a150a', accent: '#FEB64A' },
  { name: 'Pool Contractors', color: '#0a1a1a', accent: '#4FC3F7' },
  { name: 'Landscaping', color: '#0f1a0f', accent: '#94D96B' },
];

export default function Industries() {
  return (
    <section style={{ padding: 'clamp(48px, 8vw, 120px) 0', background: 'var(--color-white)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-tag" style={{ justifyContent: 'center' }}>Who We Serve</div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            Built for home service contractors
          </h2>
          <p style={{ color: 'var(--color-gray)', maxWidth: '520px', margin: '0 auto', lineHeight: '1.7' }}>
            We work exclusively with contractors, one partner per trade per market. If your trade is available in your area, now is the time to lock it in.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
          {industries.map((industry, i) => (
            <div
              key={i}
              className="card-hover-up"
              style={{
                borderRadius: '16px',
                background: industry.color,
                padding: '1.75rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'default',
              }}
            >
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '0.9rem', color: industry.accent, opacity: 0.8, flexShrink: 0 }}>
                {industry.name.slice(0, 2).toUpperCase()}
              </span>
              <span style={{
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: 'white',
              }}>
                {industry.name}
              </span>
              <div style={{
                marginLeft: 'auto',
                width: '8px', height: '8px', borderRadius: '50%',
                background: industry.accent,
                flexShrink: 0,
              }} />
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/contact" className="btn-primary">
            Check territory availability <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          section > .container > div:nth-child(2) { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 640px) {
          section > .container > div:nth-child(2) { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
