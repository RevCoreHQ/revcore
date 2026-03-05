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
  transform: inView ? 'translateY(0px)' : 'translateY(52px)',
  transition: `opacity 0.85s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.85s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
});

// Fade + scale up from slightly smaller — premium card entry
export const scaleUp = (inView: boolean, delay = 0): React.CSSProperties => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translateY(0px) scale(1)' : 'translateY(48px) scale(0.91)',
  transition: `opacity 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
});

// Clip-path reveal — wipes element visible top-to-bottom
export const clipReveal = (inView: boolean, delay = 0, radius = '0px'): React.CSSProperties => ({
  clipPath: inView
    ? `inset(0 0 0% 0 round ${radius})`
    : `inset(0 0 100% 0 round ${radius})`,
  transition: `clip-path 1.15s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
});

// Slide from left
export const slideFromLeft = (inView: boolean, delay = 0): React.CSSProperties => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translateX(0px)' : 'translateX(-64px)',
  transition: `opacity 0.95s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.95s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
});

// Slide from right
export const slideFromRight = (inView: boolean, delay = 0): React.CSSProperties => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translateX(0px)' : 'translateX(64px)',
  transition: `opacity 0.95s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.95s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
});

// Slide from bottom-left corner
export const slideFromBottomLeft = (inView: boolean, delay = 0): React.CSSProperties => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translate(0px,0px)' : 'translate(-48px,56px)',
  transition: `opacity 1s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 1s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
});

// Slide from bottom-right corner
export const slideFromBottomRight = (inView: boolean, delay = 0): React.CSSProperties => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translate(0px,0px)' : 'translate(48px,56px)',
  transition: `opacity 1s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 1s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
});

// Slide from top-left corner
export const slideFromTopLeft = (inView: boolean, delay = 0): React.CSSProperties => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translate(0px,0px)' : 'translate(-48px,-48px)',
  transition: `opacity 1s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 1s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
});

// Slide from top-right corner
export const slideFromTopRight = (inView: boolean, delay = 0): React.CSSProperties => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translate(0px,0px)' : 'translate(48px,-48px)',
  transition: `opacity 1s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 1s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
});
