'use client';

import { useRef, useState, type ReactNode, type CSSProperties, type MouseEvent } from 'react';
import Link from 'next/link';

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  className?: string;
  style?: CSSProperties;
  strength?: number;
  onClick?: () => void;
}

export default function MagneticButton({
  children, href, className, style, strength = 8, onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setOffset({ x: dx * strength, y: dy * strength });
  };

  const onLeave = () => setOffset({ x: 0, y: 0 });

  const mergedStyle: CSSProperties = {
    ...style,
    transform: `translate(${offset.x}px, ${offset.y}px)`,
    transition: offset.x === 0
      ? 'transform 0.5s cubic-bezier(0.22,1,0.36,1)'
      : 'transform 0.15s ease-out',
    willChange: 'transform',
    display: 'inline-block',
  };

  if (href) {
    return (
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={mergedStyle}
      >
        <Link href={href} className={className} onClick={onClick} style={{ textDecoration: 'none' }}>
          {children}
        </Link>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      className={className}
      style={{ ...mergedStyle, cursor: 'pointer' }}
    >
      {children}
    </div>
  );
}
