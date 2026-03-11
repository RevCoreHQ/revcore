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
    const t1 = setTimeout(() => setPhase('reveal'), 1200);
    const t2 = setTimeout(() => {
      setPhase('done');
      sessionStorage.setItem('revcore-loaded', '1');
    }, 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (phase === 'done') return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: '#0A0A0A',
        clipPath: phase === 'reveal' ? 'inset(0 0 100% 0)' : 'inset(0 0 0 0)',
        transition: 'clip-path 1s cubic-bezier(0.77,0,0.175,1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
      }}
    >
      <img
        src="https://assets.cdn.filesafe.space/NYlSya2nYSkSnnXEbY2l/media/69a9af9fb003fa7bb8bb92ee.png"
        alt="RevCore"
        style={{
          height: '32px',
          width: 'auto',
          opacity: phase === 'loading' ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      />
      <div
        style={{
          height: '1px',
          width: phase === 'loading' ? '80px' : '0px',
          background: 'linear-gradient(90deg, transparent, rgba(254,100,98,0.8), transparent)',
          transition: 'width 0.8s cubic-bezier(0.22,1,0.36,1) 0.4s',
        }}
      />
    </div>
  );
}
