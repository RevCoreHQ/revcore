'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function Hero() {
  const imgRef = useRef<HTMLDivElement>(null);
  const label3Ref = useRef<HTMLSpanElement>(null);
  const growthRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Third label starts well below — will rise on scroll
    if (label3Ref.current) {
      label3Ref.current.style.opacity = '0';
      label3Ref.current.style.transform = 'translateY(72px)';
    }

    const onScroll = () => {
      const y = window.scrollY;

      // Parallax image
      if (imgRef.current) {
        imgRef.current.style.transform = `translateY(${y * 0.25}px)`;
      }


      // Growth Firm — background-position shifts independently of the text
      // so the image visibly moves inside the letterforms as you scroll
      if (growthRef.current) {
        const progress = Math.min(1, y / 280);
        const brightness = 1.6 + progress * 1.6;
        const saturate = 1.2 + progress * 1.0;
        growthRef.current.style.filter = `brightness(${brightness}) saturate(${saturate})`;
      }

      // Third label rises from below — scroll-driven (starts at 72px, lands at 0)
      if (label3Ref.current) {
        const p = Math.max(0, Math.min(1, (y - 20) / 160));
        label3Ref.current.style.opacity = String(p);
        label3Ref.current.style.transform = `translateY(${72 * (1 - p)}px)`;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <style>{`
        .hero-outlined {
          font-family: 'DM Sans', sans-serif;
          font-weight: 800;
          font-size: clamp(5rem, 14vw, 13rem);
          line-height: 0.9;
          letter-spacing: -0.04em;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.72);
          display: block;
          user-select: none;
        }
        .hero-outlined-rev {
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.72);
          background-image: linear-gradient(110deg,
            rgba(255,255,255,0.04) 0%,
            rgba(255,255,255,0.04) 35%,
            rgba(255,255,255,0.13) 48%,
            rgba(255,255,255,0.06) 55%,
            rgba(255,255,255,0.04) 70%,
            rgba(255,255,255,0.04) 100%
          );
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: revShimmer 10s ease-in-out infinite;
        }
        @keyframes revShimmer {
          0%   { background-position: 160% center; }
          50%  { background-position: -60% center; }
          100% { background-position: -60% center; }
        }
        .hero-gradient {
          font-family: 'DM Sans', sans-serif;
          font-weight: 800;
          font-size: clamp(4rem, 11vw, 10rem);
          line-height: 0.9;
          letter-spacing: -0.04em;
          background: linear-gradient(118deg,
            rgba(13,3,5,0.82) 0%,
            rgba(92,15,15,0.72) 28%,
            rgba(181,32,32,0.60) 52%,
            rgba(122,16,16,0.72) 72%,
            rgba(26,4,6,0.82) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: brightness(1.1) saturate(1.2);
          display: block;
          user-select: none;
          will-change: filter;
        }
        @media (max-width: 768px) {
          .hero-outlined { font-size: clamp(3.5rem, 18vw, 6rem); }
          .hero-gradient { font-size: clamp(2.75rem, 14vw, 5rem); }
        }

        /* Rotating CTA */
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        .hero-cta-ring {
          animation: spin-slow 16s linear infinite;
          transform-origin: center;
        }
        .hero-cta-wrap:hover .hero-cta-ring {
          animation-duration: 6s;
        }
        .hero-cta-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: rgba(255,255,255,0.14);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), background 0.3s ease;
        }
        .hero-cta-wrap:hover .hero-cta-center {
          transform: translate(-50%, -50%) scale(1.22);
          background: rgba(255,255,255,0.95);
        }
        .hero-cta-arrow {
          transition: transform 0.35s ease, color 0.3s ease;
          color: white;
        }
        .hero-cta-wrap:hover .hero-cta-arrow {
          transform: rotate(45deg) scale(1.1);
          color: #0A0A0A;
        }
        .hero-cta-wrap {
          text-decoration: none;
          display: block;
          position: absolute;
          bottom: 48px;
          right: 48px;
          z-index: 6;
          width: 144px;
          height: 144px;
        }
      `}</style>

      <section style={{ background: '#ffffff', paddingTop: '80px' }}>
        <div style={{
          margin: '12px',
          borderRadius: '24px',
          overflow: 'hidden',
          position: 'relative',
          height: 'calc(100vh - 80px - 24px)',
          minHeight: '500px',
          background: '#0d1117',
        }}>

          {/* Parallax image */}
          <div
            ref={imgRef}
            style={{
              position: 'absolute',
              inset: '-10% 0',
              backgroundImage: 'url(https://assets.cdn.filesafe.space/NYlSya2nYSkSnnXEbY2l/media/69a9c640cc83074a8516f0d7.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              willChange: 'transform',
            }}
          />

          {/* Dark vignette overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.55) 100%)',
            zIndex: 1,
          }} />

          {/* Static grain overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.68\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
              backgroundSize: '220px 220px',
              opacity: 0.12,
              mixBlendMode: 'soft-light',
              pointerEvents: 'none',
              zIndex: 2,
              transition: 'opacity 0.1s',
            }}
          />

          {/* Upper grain layer — sits above text to add grain to Growth Firm */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n2\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n2)\'/%3E%3C/svg%3E")',
              backgroundSize: '180px 180px',
              opacity: 0.09,
              mixBlendMode: 'overlay',
              pointerEvents: 'none',
              zIndex: 4,
            }}
          />

          {/* Large text */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              padding: '0 52px',
              zIndex: 5,
            }}
          >
            <span className="hero-outlined"><span className="hero-outlined-rev">Rev</span>Core</span>
            <span ref={growthRef} className="hero-gradient">Growth Firm</span>

            {/* Sub-labels */}
            <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', fontWeight: 500 }}>
                Lead Generation &amp; Proprietary Automation
              </span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', fontWeight: 500 }}>
                In-Home Sales Training &amp; Revenue Systems
              </span>
              {/* Third label — reveals on scroll */}
              <span
                ref={label3Ref}
                style={{
                  color: 'rgba(255,255,255,0.35)',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  fontStyle: 'italic',
                  transition: 'opacity 0.12s linear, transform 0.12s linear',
                  willChange: 'opacity, transform',
                }}
              >
                Your competitors are racing to the bottom.
              </span>
            </div>
          </div>

          {/* Rotating "LET'S TALK NOW" CTA */}
          <Link href="/contact" className="hero-cta-wrap">
            {/* Rotating text ring */}
            <svg
              className="hero-cta-ring"
              viewBox="0 0 144 144"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
            >
              <defs>
                <path
                  id="cta-path"
                  d="M 72,72 m -50,0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
                />
              </defs>
              <text>
                <textPath
                  href="#cta-path"
                  style={{
                    fill: 'rgba(255,255,255,0.65)',
                    fontSize: '9px',
                    fontFamily: 'DM Sans, sans-serif',
                    fontWeight: 600,
                    letterSpacing: '3.5px',
                    textTransform: 'uppercase',
                  } as React.CSSProperties}
                >
                  LET&apos;S TALK NOW &nbsp;·&nbsp; BOOK A CALL &nbsp;·&nbsp;
                </textPath>
              </text>
            </svg>

            {/* Center button */}
            <div className="hero-cta-center">
              <ArrowUpRight size={20} className="hero-cta-arrow" />
            </div>
          </Link>

        </div>
      </section>
    </>
  );
}
