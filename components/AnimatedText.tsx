'use client';

import React from 'react';

interface Props {
  as?: 'h1' | 'h2' | 'h3';
  children: string;
  inView: boolean;
  delay?: number;
  stagger?: number;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Word-by-word mask reveal. Each word slides up from below its clipping boundary
 * with a slight rotation, creating the premium agency "text wipe" effect.
 */
export default function AnimatedText({
  as: Tag = 'h2',
  children,
  inView,
  delay = 0,
  stagger = 75,
  style,
  className,
}: Props) {
  const words = children.split(' ');

  return (
    <Tag style={style} className={className}>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          {/* Outer span acts as the clip mask */}
          <span
            style={{
              display: 'inline-block',
              overflow: 'hidden',
              verticalAlign: 'bottom',
              paddingBottom: '0.1em',
            }}
          >
            {/* Inner span animates from below the mask */}
            <span
              style={{
                display: 'inline-block',
                transform: inView ? 'translateY(0) rotate(0deg)' : 'translateY(80%) rotate(2deg)',
                opacity: inView ? 1 : 0,
                transition: `transform 1.3s cubic-bezier(0.16,1,0.3,1) ${delay + i * stagger}ms, opacity 0.8s ease ${delay + i * stagger}ms`,
              }}
            >
              {word}
            </span>
          </span>
          {/* Space between words */}
          {i < words.length - 1 ? ' ' : ''}
        </React.Fragment>
      ))}
    </Tag>
  );
}
