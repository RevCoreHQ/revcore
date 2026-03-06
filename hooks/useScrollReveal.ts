'use client';

import { useEffect, useRef, useState } from 'react';

export function useScrollReveal(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

// Fade + slide up from below
export const fadeUp = (inView: boolean, delay = 0): React.CSSProperties => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translateY(0px)' : 'translateY(28px)',
  transition: `opacity 1.2s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 1.2s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
});

// Fade + scale up from slightly smaller — premium card entry
export const scaleUp = (inView: boolean, delay = 0): React.CSSProperties => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translateY(0px) scale(1)' : 'translateY(24px) scale(0.96)',
  transition: `opacity 1.3s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 1.3s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
});

// Clip-path reveal — wipes element visible top-to-bottom
export const clipReveal = (inView: boolean, delay = 0, radius = '0px'): React.CSSProperties => ({
  clipPath: inView
    ? `inset(0 0 0% 0 round ${radius})`
    : `inset(0 0 100% 0 round ${radius})`,
  transition: `clip-path 1.4s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
});

// Slide from left
export const slideFromLeft = (inView: boolean, delay = 0): React.CSSProperties => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translateX(0px)' : 'translateX(-36px)',
  transition: `opacity 1.25s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 1.25s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
});

// Slide from right
export const slideFromRight = (inView: boolean, delay = 0): React.CSSProperties => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translateX(0px)' : 'translateX(36px)',
  transition: `opacity 1.25s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 1.25s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
});

// Slide from bottom-left corner
export const slideFromBottomLeft = (inView: boolean, delay = 0): React.CSSProperties => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translate(0px,0px)' : 'translate(-28px,32px)',
  transition: `opacity 1.3s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 1.3s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
});

// Slide from bottom-right corner
export const slideFromBottomRight = (inView: boolean, delay = 0): React.CSSProperties => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translate(0px,0px)' : 'translate(28px,32px)',
  transition: `opacity 1.3s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 1.3s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
});

// Slide from top-left corner
export const slideFromTopLeft = (inView: boolean, delay = 0): React.CSSProperties => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translate(0px,0px)' : 'translate(-28px,-28px)',
  transition: `opacity 1.3s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 1.3s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
});

// Slide from top-right corner
export const slideFromTopRight = (inView: boolean, delay = 0): React.CSSProperties => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translate(0px,0px)' : 'translate(28px,-28px)',
  transition: `opacity 1.3s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 1.3s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
});
