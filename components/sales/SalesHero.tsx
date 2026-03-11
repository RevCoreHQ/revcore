'use client';

import { useEffect, useRef } from 'react';
import { Zap, TrendingUp, Star } from 'lucide-react';
import SpaceBackground from '@/components/SpaceBackground';

const HERO_PHOTO_URL = 'https://assets.cdn.filesafe.space/NYlSya2nYSkSnnXEbY2l/media/69ac7965618c8dfc285b4e82.png';

export default function SalesHero() {
  const photoRef = useRef<HTMLDivElement>(null);
  const revenueRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (photoRef.current) {
        photoRef.current.style.transform = `translateY(${y * 0.12}px)`;
      }
      if (revenueRef.current) {
        const progress = Math.min(1, y / 300);
        const brightness = 1.4 + progress * 1.4;
        const saturate = 1.2 + progress * 1.0;
        revenueRef.current.style.filter = `brightness(${brightness}) saturate(${saturate})`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const pills = [
    { icon: <Zap size={13} />, label: 'Appointments guaranteed' },
    { icon: <TrendingUp size={13} />, label: 'Pay for performance' },
    { icon: <Star size={13} />, label: '1 partner per trade per market' },
  ];

  return (
    <section style={{ background: '#0A0A0A', padding: '12px 12px 0' }}>
      <div style={{
        borderRadius: '24px',
        overflow: 'hidden',
        position: 'relative',
        height: '60vh',
        minHeight: '480px',
        background: '#0d1117',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div ref={photoRef} style={{
          position: 'absolute', inset: '-10% 0',
          backgroundImage: `url(${HERO_PHOTO_URL})`,
          backgroundSize: 'cover', backgroundPosition: 'center top',
          willChange: 'transform',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }} />
        <SpaceBackground opacity={0.7} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.75) 100%)',
          zIndex: 1,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'ns\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.68\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23ns)\'/%3E%3C/svg%3E")',
          backgroundSize: '220px 220px', opacity: 0.14, mixBlendMode: 'soft-light', pointerEvents: 'none', zIndex: 2,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'ns2\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23ns2)\'/%3E%3C/svg%3E")',
          backgroundSize: '180px 180px', opacity: 0.09, mixBlendMode: 'overlay', pointerEvents: 'none', zIndex: 3,
        }} />

        <div className="sales-hero-content" style={{ position: 'relative', zIndex: 4, textAlign: 'center', padding: '0 2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem',
          }}>
            <span style={{ width: '24px', height: '2px', background: '#FE6462', display: 'block' }} />
            For Home Service Contractors Only
            <span style={{ width: '24px', height: '2px', background: '#FE6462', display: 'block' }} />
          </div>
          <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '1.25rem' }}>
            <span className="sales-hero-line">Stop leaving</span>
            <span ref={revenueRef} className="sales-hero-accent">revenue</span>
            <span className="sales-hero-line">on the table.</span>
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '1rem',
            lineHeight: '1.7',
            maxWidth: '540px',
            margin: '0 auto 1.5rem',
          }}>
            Most contractors lose 60% of their leads to slow follow-up, weak sales processes, and disconnected tools. RevCore fixes every leak in your revenue pipeline.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            {pills.map((item, i) => (
              <div key={i} className="sales-hero-pill" style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '100px',
                padding: '7px 14px',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.78rem',
                fontWeight: 500,
                backdropFilter: 'blur(8px)',
                opacity: 0,
                animation: `salesPillIn 0.8s cubic-bezier(0.22,1,0.36,1) ${400 + i * 120}ms forwards`,
              }}>
                <span style={{ color: '#FE6462' }}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .sales-hero-content {
          opacity: 0;
          animation: salesHeroIn 1.4s cubic-bezier(0.22,1,0.36,1) 0.2s forwards;
        }
        @keyframes salesHeroIn {
          from { opacity: 0; filter: blur(8px); transform: scale(1.03); }
          to { opacity: 1; filter: blur(0px); transform: scale(1); }
        }
        @keyframes salesPillIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .sales-hero-line {
          font-size: clamp(1.6rem, 3.5vw, 3rem);
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.65);
          display: block;
          line-height: 1.1;
          letter-spacing: -0.03em;
        }
        .sales-hero-accent {
          font-size: clamp(3.5rem, 9vw, 7.5rem);
          color: #FE6462;
          display: block;
          line-height: 0.92;
          letter-spacing: -0.04em;
          text-shadow: 0 0 80px rgba(254,100,98,0.32);
        }
      `}</style>
    </section>
  );
}
