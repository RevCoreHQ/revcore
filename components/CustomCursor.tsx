'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const hovering = useRef(false);

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;

    const setHover = (active: boolean) => {
      if (!ring || hovering.current === active) return;
      hovering.current = active;
      if (active) {
        ring.style.width = '56px';
        ring.style.height = '56px';
        ring.style.marginLeft = '-28px';
        ring.style.marginTop = '-28px';
        ring.style.background = 'rgba(254,100,98,0.06)';
        ring.style.borderColor = 'rgba(254,100,98,0.4)';
        ring.style.mixBlendMode = 'normal';
      } else {
        ring.style.width = '30px';
        ring.style.height = '30px';
        ring.style.marginLeft = '-15px';
        ring.style.marginTop = '-15px';
        ring.style.background = 'transparent';
        ring.style.borderColor = 'white';
        ring.style.mixBlendMode = 'difference';
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      if (dot) {
        dot.style.transform = `translate3d(${x}px,${y}px,0)`;
      }
      if (ring) {
        ring.style.transform = `translate3d(${x}px,${y}px,0)`;
      }

      const target = (e.target as HTMLElement).closest('a, button, [data-cursor]');
      setHover(!!target);
    };

    document.addEventListener('mousemove', onMouseMove, { passive: true });

    const style = document.createElement('style');
    style.id = 'custom-cursor-hide';
    style.textContent = '*, *::before, *::after { cursor: none !important; }';
    document.head.appendChild(style);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.getElementById('custom-cursor-hide')?.remove();
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'white',
          mixBlendMode: 'difference',
          pointerEvents: 'none',
          zIndex: 999999,
          marginLeft: '-3px',
          marginTop: '-3px',
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          border: '1.5px solid white',
          background: 'transparent',
          mixBlendMode: 'difference',
          pointerEvents: 'none',
          zIndex: 999998,
          marginLeft: '-15px',
          marginTop: '-15px',
          willChange: 'transform',
          transition: 'transform 90ms ease-out, width 0.35s cubic-bezier(0.22,1,0.36,1), height 0.35s cubic-bezier(0.22,1,0.36,1), margin 0.35s cubic-bezier(0.22,1,0.36,1), background 0.35s ease, border-color 0.35s ease, mix-blend-mode 0.35s ease',
        }}
      />
    </>
  );
}
