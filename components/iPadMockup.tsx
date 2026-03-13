'use client';

import React, { useRef, useEffect } from 'react';

interface Props {
  children: React.ReactNode;
  tilt?: number;
  width?: number | string;
  accentGlow?: string;
  orientation?: 'landscape' | 'portrait';
}

const LANDSCAPE_INSET = { top: '6%', right: '3.5%', bottom: '6%', left: '3.5%' };
const PORTRAIT_INSET = { top: '3.5%', right: '6%', bottom: '3.5%', left: '6%' };

export default function IpadMockup({ children, tilt = 0, width = 320, accentGlow, orientation = 'landscape' }: Props) {
  const isPortrait = orientation === 'portrait';
  const inset = isPortrait ? PORTRAIT_INSET : LANDSCAPE_INSET;
  const screenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const screen = screenRef.current;
    if (!screen) return;

    const handleWheel = (e: WheelEvent) => {
      // Prevent the page from scrolling while hovering over the iPad
      e.preventDefault();
      e.stopPropagation();

      // Walk up from the event target and find the first scrollable element
      let target = e.target as HTMLElement | null;
      while (target && target !== screen) {
        const overflows = target.scrollHeight > target.clientHeight + 1;
        if (overflows) {
          target.scrollTop += e.deltaY;
          return;
        }
        target = target.parentElement;
      }
    };

    // passive: false is required so we can call preventDefault()
    screen.addEventListener('wheel', handleWheel, { passive: false });
    return () => screen.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div
      style={{
        width,
        transform: `rotate(${tilt}deg)`,
        transformOrigin: 'center center',
        transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {/* Glow behind device */}
      {accentGlow && (
        <div style={{
          position: 'absolute',
          inset: '5%',
          background: accentGlow,
          filter: 'blur(56px)',
          opacity: 0.3,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
        }} />
      )}

      <div style={{
        position: 'relative',
        zIndex: 1,
        height: 0,
        paddingBottom: isPortrait ? '133.33%' : '75%',
      }}>
        <img
          src="https://assets.cdn.filesafe.space/NYlSya2nYSkSnnXEbY2l/media/69a9bb437bdf38763f73b605.png"
          alt=""
          draggable={false}
          style={{
            position: 'absolute',
            ...(isPortrait
              ? { width: '100%', height: 'auto', top: 0, left: 0 }
              : { height: '133.33%', width: 'auto', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-90deg)' }
            ),
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        />

        <div
          ref={screenRef}
          className="ipad-screen"
          style={{
            position: 'absolute',
            top: inset.top,
            right: inset.right,
            bottom: inset.bottom,
            left: inset.left,
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#0d1117',
            zIndex: 2,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
