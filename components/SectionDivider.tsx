'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function SectionDivider({ color = 'var(--color-accent)' }: { color?: string }) {
  const { ref, inView } = useScrollReveal({ threshold: 0.5 });

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '0',
      }}
    >
      <div
        style={{
          height: '1px',
          width: inView ? '80px' : '0px',
          background: color,
          transition: 'width 1.2s cubic-bezier(0.22,1,0.36,1)',
          boxShadow: inView ? `0 0 20px ${color}40` : 'none',
        }}
      />
    </div>
  );
}
