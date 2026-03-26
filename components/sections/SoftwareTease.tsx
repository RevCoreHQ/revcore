'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import SpaceBackground from '@/components/SpaceBackground';
import VideoBackground from '@/components/VideoBackground';

const VIDEO_URL = 'https://assets.cdn.filesafe.space/NYlSya2nYSkSnnXEbY2l/media/69aa0befde2e7de2a9765ced.mp4';
import { useScrollReveal, fadeUp, scaleUp } from '@/hooks/useScrollReveal';
import AnimatedText from '@/components/AnimatedText';
import IpadMockup from '@/components/iPadMockup';
import QuotingApp from '@/components/QuotingApp';
import PitchApp from '@/components/PitchApp';

const quotingFeatures = [
  'On-site quote generation',
  'Job tracking pipeline',
  'Automated follow-up sequences',
  'Review request automation',
  'Good / Better / Best options',
  'E-signature collection',
];

const pitchFeatures = [
  'Trade-specific slide decks',
  'Before & after comparisons',
  'Financing option display',
  'Works offline on iPad',
  'Built-in social proof',
  'E-signature close',
];

export default function SoftwareTease() {
  const { ref, inView } = useScrollReveal({ threshold: 0.06 });

  return (
    <section ref={ref as React.Ref<HTMLElement>} style={{ padding: 'clamp(48px, 8vw, 120px) 0', background: '#070b0f', overflow: 'hidden', position: 'relative' }}>
      <SpaceBackground />
      <VideoBackground src={VIDEO_URL} opacity={0.05} />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div className="section-tag" style={{
            ...fadeUp(inView, 0),
            background: 'rgba(255,255,255,0.07)',
            color: 'rgba(255,255,255,0.45)',
            display: 'inline-block',
          }}>
            RevCore Software
          </div>
          <AnimatedText
            as="h2"
            inView={inView}
            delay={120}
            stagger={80}
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.15,
              letterSpacing: '-0.02em', color: 'white', marginBottom: '1rem',
            }}
          >
            Two tools. Built to close more jobs.
          </AnimatedText>
          <p style={{
            color: 'rgba(255,255,255,0.38)', maxWidth: '480px', margin: '0 auto',
            lineHeight: '1.75', fontSize: '1rem', ...fadeUp(inView, 500),
          }}>
            Purpose-built for home service contractors. Quote faster, present better, automate everything in between.
          </p>
        </div>

        {/* iPad display — two side by side */}
        <div className="software-ipads" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: '3rem',
          marginBottom: '5rem',
          flexWrap: 'wrap',
        }}>
          <div style={{ maxWidth: '100%', ...scaleUp(inView, 150) }}>
            <IpadMockup tilt={-4} width="min(500px, 90vw)" accentGlow="rgba(148,217,107,0.5)">
              <QuotingApp />
            </IpadMockup>
          </div>

          <div style={{ maxWidth: '100%', ...scaleUp(inView, 320) }}>
            <IpadMockup tilt={4} width="min(500px, 90vw)" accentGlow="rgba(107,142,254,0.5)">
              <PitchApp />
            </IpadMockup>
          </div>
        </div>

        {/* Feature lists */}
        <div className="software-feature-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '3.5rem' }}>

          <div style={{
            borderRadius: '20px', background: '#0f1a10',
            border: '1px solid rgba(148,217,107,0.12)', padding: '2rem',
            ...fadeUp(inView, 450),
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#94D96B' }} />
              <span style={{ color: '#94D96B', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em' }}>QUOTING SOFTWARE</span>
            </div>
            <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.2rem', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: '0.5rem' }}>
              Quote, track &amp; follow up, all in one place.
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', lineHeight: '1.65', marginBottom: '1.25rem' }}>
              Generate accurate proposals on-site, track every job, and let automated sequences handle follow-ups and review requests.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {quotingFeatures.map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={12} color="#94D96B" />
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            borderRadius: '20px', background: '#0f1020',
            border: '1px solid rgba(107,142,254,0.12)', padding: '2rem',
            ...fadeUp(inView, 580),
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6B8EFE' }} />
              <span style={{ color: '#6B8EFE', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em' }}>PRESENTATION SOFTWARE</span>
            </div>
            <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.2rem', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: '0.5rem' }}>
              Close at the kitchen table. Every time.
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', lineHeight: '1.65', marginBottom: '1.25rem' }}>
              A trade-specific iPad presentation that builds trust, handles objections visually, and collects e-signatures before you leave the driveway.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {pitchFeatures.map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={12} color="#6B8EFE" />
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', ...fadeUp(inView, 700) }}>
          <Link href="/software" style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: 'white', color: '#0A0A0A',
            padding: '14px 28px', borderRadius: '100px',
            fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(255,255,255,0.15)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            See the full software suite <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .software-feature-grid { grid-template-columns: 1fr !important; }
          .software-feature-grid div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          .software-ipads { gap: 1.5rem !important; }
          .software-ipads > div { max-width: 100% !important; }
        }
      `}</style>
    </section>
  );
}
