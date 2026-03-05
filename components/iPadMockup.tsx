'use client';

import React, { useRef, useEffect } from 'react';

interface Props {
  children: React.ReactNode;
  tilt?: number;
  width?: number | string;
  accentGlow?: string;
}

/**
 * iPad mockup rendered in landscape orientation.
 * The source image is portrait; we rotate it -90deg and resize the container
 * to match the resulting landscape aspect ratio (~4:3).
 *
 * Screen insets are remapped from portrait → landscape CCW rotation:
 *   landscape top    = portrait left  = 8%
 *   landscape right  = portrait top   = 11%
 *   landscape bottom = portrait right = 8%
 *   landscape left   = portrait bottom= 11%
 */
const SCREEN_INSET = {
  top: '6%',
  right: '3.5%',
  bottom: '6%',
  left: '3.5%',
};

// Portrait iPad mockup is ~3:4 (W:H). Landscape is the inverse: 4:3.
// paddingBottom: 75% on the outer div creates the landscape height.
const LANDSCAPE_RATIO = '75%';

// The image must be taller than the container so it fills width when rotated.
// container height = width * 0.75, so img height = width = container height / 0.75 = 133.33%
const IMG_HEIGHT = '133.33%';

export default function IpadMockup({ children, tilt = 0, width = 320, accentGlow }: Props) {
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

      {/* Landscape container (height comes from paddingBottom) */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        height: 0,
        paddingBottom: LANDSCAPE_RATIO,
      }}>
        {/* Rotated iPad frame image — fills container visually after -90deg */}
        <img
          src="https://assets.cdn.filesafe.space/NYlSya2nYSkSnnXEbY2l/media/69a9bb437bdf38763f73b605.png"
          alt=""
          draggable={false}
          style={{
            position: 'absolute',
            height: IMG_HEIGHT,
            width: 'auto',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-90deg)',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        />

        {/* Screen content — insets calibrated for landscape orientation */}
        <div
          ref={screenRef}
          className="ipad-screen"
          style={{
            position: 'absolute',
            top: SCREEN_INSET.top,
            right: SCREEN_INSET.right,
            bottom: SCREEN_INSET.bottom,
            left: SCREEN_INSET.left,
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
