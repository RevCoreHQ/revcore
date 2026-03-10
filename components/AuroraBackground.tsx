'use client';
import React, { ReactNode } from 'react';

interface AuroraBackgroundProps {
  children?: ReactNode;
  showRadialGradient?: boolean;
  style?: React.CSSProperties;
}

export function AuroraBackground({ children, showRadialGradient = true, style }: AuroraBackgroundProps) {
  return (
    <>
      <style>{`
        @keyframes aurora {
          0%   { background-position: 50% 50%, 50% 50%; }
          100% { background-position: 350% 50%, 350% 50%; }
        }
        .aurora-layer {
          position: absolute;
          inset: -10px;
          opacity: 0.45;
          will-change: transform;
          background-image:
            repeating-linear-gradient(100deg, #000 0%, #000 7%, transparent 10%, transparent 12%, #000 16%),
            repeating-linear-gradient(100deg, #3b82f6 10%, #818cf8 15%, #93c5fd 20%, #c4b5fd 25%, #60a5fa 30%);
          background-size: 300%, 200%;
          background-position: 50% 50%, 50% 50%;
          filter: blur(10px);
          animation: aurora 12s linear infinite;
          ${showRadialGradient ? 'mask-image: radial-gradient(ellipse at 80% 0%, black 10%, transparent 70%); -webkit-mask-image: radial-gradient(ellipse at 80% 0%, black 10%, transparent 70%);' : ''}
          pointer-events: none;
        }
        .aurora-layer::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(100deg, #000 0%, #000 7%, transparent 10%, transparent 12%, #000 16%),
            repeating-linear-gradient(100deg, #3b82f6 10%, #818cf8 15%, #93c5fd 20%, #c4b5fd 25%, #60a5fa 30%);
          background-size: 200%, 100%;
          background-attachment: fixed;
          animation: aurora 8s linear infinite;
          mix-blend-mode: difference;
          opacity: 0.6;
        }
      `}</style>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', ...style }}>
        <div className="aurora-layer" />
      </div>
      {children}
    </>
  );
}
