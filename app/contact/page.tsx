'use client';

import Script from 'next/script';
import { useEffect, useRef } from 'react';
import { Mail, Clock, CheckCircle } from 'lucide-react';
import SpaceBackground from '@/components/SpaceBackground';

export default function ContactPage() {
  const bookRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!bookRef.current) return;
      const pct = Math.min(window.scrollY / 600, 1);
      bookRef.current.style.backgroundPositionX = `${pct * 200}%`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* ── Hero card — mirrors home page style ── */}
      <section style={{ background: '#ffffff', paddingTop: '80px' }}>
        <div style={{
          margin: '12px',
          borderRadius: '24px',
          overflow: 'hidden',
          position: 'relative',
          height: '52vh',
          minHeight: '380px',
          background: '#0d1117',
        }}>
          {/* Background image */}
          <div style={{
            position: 'absolute',
            inset: '-10% 0',
            backgroundImage: 'url(https://assets.cdn.filesafe.space/NYlSya2nYSkSnnXEbY2l/media/69a9d5c5b003fa5c4ac3d374.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }} />

          {/* Vignette */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.65) 100%)',
            zIndex: 1,
          }} />

          {/* Grain */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.68\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
            backgroundSize: '220px 220px',
            opacity: 0.12,
            mixBlendMode: 'soft-light',
            pointerEvents: 'none',
            zIndex: 2,
          }} />

          {/* Text */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'flex-start',
            padding: '0 clamp(1rem, 4vw, 3.25rem)', zIndex: 3,
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)',
              marginBottom: '1.25rem',
            }}>
              <span style={{ width: '24px', height: '2px', background: '#FE6462', display: 'block' }} />
              Contact
            </div>
            <span style={{
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(3.5rem, 10vw, 8rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.04em',
              color: 'transparent',
              WebkitTextStroke: '1.5px rgba(255,255,255,0.72)',
              display: 'block',
              userSelect: 'none',
            }}>Let&apos;s Talk</span>
            <span ref={bookRef} style={{
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              background: 'linear-gradient(118deg, #4158D0 0%, #C850C0 25%, #6B8EFE 50%, #4158D0 75%, #C850C0 100%)',
              backgroundSize: '300% 100%',
              backgroundPositionX: '0%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'block',
              userSelect: 'none',
              marginTop: '0.15em',
            }}>Book a Call</span>
          </div>
        </div>
      </section>

      {/* ── Calendar + Info ── */}
      <section style={{ background: '#070b0f', padding: '80px 0 120px', position: 'relative', overflow: 'hidden' }}>
        <SpaceBackground opacity={0.45} />
        {/* Animated orbs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div className="contact-orb contact-orb-1" />
          <div className="contact-orb contact-orb-2" />
          <div className="contact-orb contact-orb-3" />
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="contact-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: '4rem',
            alignItems: 'start',
          }}>

            {/* Left — info */}
            <div>
              <p style={{
                fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)',
                marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <span style={{ width: '24px', height: '2px', background: '#FE6462', display: 'block' }} />
                Strategy Call
              </p>

              <h2 style={{
                fontFamily: 'DM Sans, sans-serif', fontWeight: 800,
                fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', lineHeight: 1.15,
                letterSpacing: '-0.02em', color: 'white', marginBottom: '1rem',
              }}>
                30 minutes.<br />No fluff.
              </h2>

              <p style={{
                color: 'rgba(255,255,255,0.4)', lineHeight: '1.75',
                fontSize: '0.9375rem', marginBottom: '2.5rem',
              }}>
                Tell us where you are, where you want to be. We'll show you exactly how we get you there.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                {[
                  'Audit your current lead flow',
                  'Identify your biggest revenue leaks',
                  'Walk through our process & software',
                  'No obligation, just clarity',
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle size={14} color="#94D96B" />
                    <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem' }}>{item}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { icon: Mail, label: 'Email', value: 'hello@revcorehq.com', href: 'mailto:hello@revcorehq.com' },
                  { icon: Clock, label: 'Response time', value: 'Within 24 hours', href: null },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <item.icon size={16} color="rgba(255,255,255,0.5)" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>{item.label}</div>
                      {item.href ? (
                        <a href={item.href} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontWeight: 500, fontSize: '0.875rem' }}>{item.value}</a>
                      ) : (
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, fontSize: '0.875rem' }}>{item.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — calendar embed */}
            <div style={{
              borderRadius: '20px',
              overflow: 'hidden',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              minHeight: '700px',
            }}>
              <iframe
                src="https://api.leadconnectorhq.com/widget/booking/NV47jMb2Se8WlgRuKuA5"
                style={{ width: '100%', border: 'none', minHeight: '700px', display: 'block' }}
                id="NV47jMb2Se8WlgRuKuA5_1772736857244"
              />
            </div>

          </div>
        </div>
      </section>

      <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="lazyOnload" />

      <style>{`
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .contact-grid iframe {
            min-height: 500px !important;
          }
        }
        .contact-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0;
          animation: orbFloat 14s ease-in-out infinite;
        }
        .contact-orb-1 {
          width: 520px; height: 520px;
          background: radial-gradient(circle, rgba(75,65,220,0.28) 0%, transparent 70%);
          top: -120px; left: -160px;
          animation-delay: 0s;
        }
        .contact-orb-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(107,142,254,0.22) 0%, transparent 70%);
          bottom: 40px; right: -100px;
          animation-delay: -5s;
          animation-duration: 18s;
        }
        .contact-orb-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(180,80,200,0.16) 0%, transparent 70%);
          top: 40%; left: 38%;
          animation-delay: -9s;
          animation-duration: 22s;
        }
        @keyframes orbFloat {
          0%   { opacity: 0.7; transform: translate(0px, 0px) scale(1); }
          33%  { opacity: 0.9; transform: translate(18px, -22px) scale(1.04); }
          66%  { opacity: 0.6; transform: translate(-12px, 16px) scale(0.97); }
          100% { opacity: 0.7; transform: translate(0px, 0px) scale(1); }
        }
      `}</style>
    </>
  );
}
