'use client';

import { useEffect, useRef } from 'react';

export default function BlogHeroTitle() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!titleRef.current) return;
      titleRef.current.style.backgroundPositionY = `${-window.scrollY * 0.18}px`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <h1
      ref={titleRef}
      style={{
        fontSize: 'clamp(2.5rem, 8vw, 6rem)',
        fontWeight: 800,
        lineHeight: 1.05,
        letterSpacing: '-0.03em',
        whiteSpace: 'nowrap',
        backgroundImage: 'url(https://assets.cdn.filesafe.space/NYlSya2nYSkSnnXEbY2l/media/69a9d5c5b003fa5c4ac3d374.png)',
        backgroundSize: 'cover',
        backgroundPositionX: 'center',
        backgroundPositionY: '0px',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      Built to grow your trade.
    </h1>
  );
}
