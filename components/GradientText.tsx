'use client';

import type { CSSProperties, ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  colors?: string[];
  speed?: number;
  className?: string;
  style?: CSSProperties;
}

export default function GradientText({
  children,
  colors,
  speed = 8,
  style,
  className,
}: GradientTextProps) {
  const colorList = colors || ['#FE6462', '#6B8EFE', '#94D96B', '#FE6462'];
  const gradient = `linear-gradient(110deg, ${colorList.join(', ')})`;

  return (
    <>
      <span
        className={className}
        style={{
          ...style,
          backgroundImage: gradient,
          backgroundSize: '300% 100%',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: `gradientShift ${speed}s ease-in-out infinite`,
        }}
      >
        {children}
      </span>
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% center; }
          50% { background-position: 100% center; }
          100% { background-position: 0% center; }
        }
      `}</style>
    </>
  );
}
