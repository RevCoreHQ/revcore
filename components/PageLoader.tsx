'use client';

import { useEffect, useState } from 'react';

export default function PageLoader() {
  const [phase, setPhase] = useState<'loading' | 'reveal' | 'done'>('loading');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('revcore-loaded')) {
      setPhase('done');
      return;
    }
    const t1 = setTimeout(() => setPhase('reveal'), 1400);
    const t2 = setTimeout(() => {
      setPhase('done');
      sessionStorage.setItem('revcore-loaded', '1');
    }, 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (phase === 'done') return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: '#fff',
        clipPath: phase === 'reveal' ? 'inset(0 0 100% 0)' : 'inset(0 0 0 0)',
        transition: 'clip-path 1s cubic-bezier(0.77,0,0.175,1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
      }}
    >
      {/* RevCore logo — black on white */}
      <img
        src="https://assets.cdn.filesafe.space/NYlSya2nYSkSnnXEbY2l/media/69a9af9fb003fa7bb8bb92ee.png"
        alt="RevCore"
        style={{
          height: '36px',
          width: 'auto',
          filter: 'brightness(0)',
          opacity: phase === 'loading' ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      />

      {/* Animated loading bar */}
      <div
        style={{
          width: '120px',
          height: '2px',
          background: 'rgba(0,0,0,0.06)',
          borderRadius: '100px',
          overflow: 'hidden',
          opacity: phase === 'loading' ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      >
        <div
          style={{
            width: '40%',
            height: '100%',
            background: '#0A0A0A',
            borderRadius: '100px',
            animation: 'loader-slide 1.2s cubic-bezier(0.45,0,0.55,1) infinite',
          }}
        />
      </div>

      <style>{`
        @keyframes loader-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  );
}
