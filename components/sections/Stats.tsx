'use client';

import { useEffect, useRef, useState } from 'react';
import SpaceBackground from '@/components/SpaceBackground';
import VideoBackground from '@/components/VideoBackground';

const VIDEO_URL = 'https://assets.cdn.filesafe.space/NYlSya2nYSkSnnXEbY2l/media/69aa0befde2e7de2a9765ced.mp4';

const stats = [
  { num: 28, prefix: '$', suffix: 'K', label: 'Avg. job value closed', sub: 'By RevCore partners' },
  { num: 47, prefix: '', suffix: '%', label: 'Higher close rates', sub: 'vs. industry standard' },
  { num: 98, prefix: '', suffix: '%', label: 'Show-up rate', sub: 'To scheduled appointments' },
  { num: 28, prefix: '', suffix: 'x', label: 'Average ROI', sub: 'For our partners' },
];

function useCountUp(target: number, active: boolean, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
}

function StatItem({ stat, active, index }: { stat: typeof stats[0]; active: boolean; index: number }) {
  const count = useCountUp(stat.num, active);
  return (
    <div style={{
      textAlign: 'center',
      padding: '2rem 1rem',
      borderRight: index < stats.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
    }}>
      <div style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 800, fontFamily: 'DM Sans, sans-serif', color: 'var(--color-white)', lineHeight: 1 }}>
        {stat.prefix}{count}{stat.suffix}
      </div>
      <div style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, marginTop: '0.75rem', fontSize: '0.9375rem' }}>
        {stat.label}
      </div>
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '4px' }}>
        {stat.sub}
      </div>
    </div>
  );
}

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} style={{ padding: '100px 0', background: 'var(--color-primary)', position: 'relative', overflow: 'hidden' }}>
      <SpaceBackground />
      <VideoBackground src={VIDEO_URL} opacity={0.05} />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
          {stats.map((s, i) => (
            <StatItem key={i} stat={s} active={active} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          section > .container > div {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          section > .container > div > div {
            border-right: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.1);
          }
        }
      `}</style>
    </section>
  );
}
