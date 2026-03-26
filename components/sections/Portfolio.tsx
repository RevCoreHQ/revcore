'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

const results = [
  {
    slug: 'apex-roofing',
    trade: 'Roofing',
    company: 'Apex Roofing Co.',
    headline: '$2.4M in new revenue',
    sub: 'In 9 months from launch',
    metric: '+$2.4M',
    color: '#1a0f0f',
    accent: '#FE6462',
  },
  {
    slug: 'climate-pro-hvac',
    trade: 'HVAC',
    company: 'Climate Pro HVAC',
    headline: '47% close rate increase',
    sub: 'After in-home sales training',
    metric: '+47%',
    color: '#0f1a1a',
    accent: '#4FC3F7',
  },
  {
    slug: 'solar-summit',
    trade: 'Solar',
    company: 'Solar Summit',
    headline: '28x ROI in 90 days',
    sub: 'On total marketing spend',
    metric: '28x',
    color: '#1a1a0f',
    accent: '#FEB64A',
  },
  {
    slug: 'premier-windows',
    trade: 'Windows & Doors',
    company: 'Premier Windows',
    headline: '98% show-up rate',
    sub: 'From system-booked appointments',
    metric: '98%',
    color: '#0f0f1a',
    accent: '#6B8EFE',
  },
  {
    slug: 'greenscape-pools',
    trade: 'Pools',
    company: 'Greenscape Pools',
    headline: '50+ appointments / month',
    sub: 'All qualified homeowners',
    metric: '50+',
    color: '#0f1a13',
    accent: '#94D96B',
  },
];

export default function Portfolio() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section style={{ padding: 'clamp(48px, 8vw, 120px) 0', background: 'var(--color-white)' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="section-tag">Partner Results</div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              Real numbers. Real contractors.
            </h2>
          </div>
          <Link href="/portfolio" className="btn-outline" style={{ whiteSpace: 'nowrap' }}>
            All case studies <ArrowRight size={15} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <ResultCard result={results[0]} large hovered={hovered === 0} onHover={() => setHovered(0)} onLeave={() => setHovered(null)} />
          </div>
          <ResultCard result={results[1]} hovered={hovered === 1} onHover={() => setHovered(1)} onLeave={() => setHovered(null)} />
          <ResultCard result={results[2]} hovered={hovered === 2} onHover={() => setHovered(2)} onLeave={() => setHovered(null)} />
          <div style={{ gridColumn: 'span 2' }}>
            <ResultCard result={results[3]} large hovered={hovered === 3} onHover={() => setHovered(3)} onLeave={() => setHovered(null)} />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          section > .container > div:last-child {
            grid-template-columns: 1fr !important;
          }
          section > .container > div:last-child > div[style*="span 2"] {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </section>
  );
}

function ResultCard({
  result, large = false, hovered, onHover, onLeave,
}: {
  result: typeof results[0]; large?: boolean;
  hovered: boolean; onHover: () => void; onLeave: () => void;
}) {
  return (
    <Link
      href={`/portfolio/${result.slug}`}
      style={{ textDecoration: 'none', display: 'block' }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div style={{
        borderRadius: '20px',
        overflow: 'hidden',
        background: result.color,
        aspectRatio: large ? '16/9' : '4/5',
        position: 'relative',
        cursor: 'pointer',
        transform: hovered ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform 0.3s ease',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)' }} />

        {/* Big metric */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: `translate(-50%, -50%) scale(${hovered ? 1.08 : 1})`,
          transition: 'transform 0.3s ease, opacity 0.3s ease',
          opacity: hovered ? 0.12 : 0.07,
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(4rem, 8vw, 7rem)',
          color: result.accent,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}>
          {result.metric}
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{
                background: `${result.accent}22`, color: result.accent,
                padding: '2px 10px', borderRadius: '100px',
                fontSize: '0.68rem', fontWeight: 700,
                border: `1px solid ${result.accent}44`,
                textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>
                {result.trade}
              </span>
            </div>
            <h3 style={{ color: 'white', fontSize: large ? '1.5rem' : '1.1rem', fontWeight: 800, fontFamily: 'DM Sans, sans-serif', marginBottom: '2px' }}>
              {result.headline}
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{result.sub}</p>
          </div>
          <div style={{
            width: '44px', height: '44px', borderRadius: '50%',
            background: hovered ? result.accent : 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', flexShrink: 0,
            transition: 'background 0.25s',
          }}>
            <ArrowRight size={18} />
          </div>
        </div>

        <div style={{
          position: 'absolute', top: '1.25rem', right: '1.25rem',
          background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
          borderRadius: '100px', padding: '4px 12px',
          color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem',
        }}>
          {result.company}
        </div>
      </div>
    </Link>
  );
}
