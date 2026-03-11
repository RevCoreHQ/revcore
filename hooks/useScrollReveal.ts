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

// Bidirectional — animates in on scroll down, out on scroll back up
export function useScrollRevealBidirectional(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.06, ...options }
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

// Blur reveal — sharpens from blurred + slightly scaled
export const blurReveal = (inView: boolean, delay = 0): React.CSSProperties => ({
  opacity: inView ? 1 : 0,
  filter: inView ? 'blur(0px)' : 'blur(12px)',
  transform: inView ? 'scale(1)' : 'scale(1.04)',
  transition: `opacity 1.4s cubic-bezier(0.22,1,0.36,1) ${delay}ms, filter 1.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 1.4s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
});

// Rotate in — subtle rotation + slide up
export const rotateIn = (inView: boolean, delay = 0, deg = 3): React.CSSProperties => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translateY(0) rotate(0deg)' : `translateY(32px) rotate(${deg}deg)`,
  transition: `opacity 1.3s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 1.3s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
});

// Clip reveal from left — horizontal wipe
export const clipRevealLeft = (inView: boolean, delay = 0): React.CSSProperties => ({
  clipPath: inView ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
  transition: `clip-path 1.4s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
});

// Stagger helper — returns delay for a grid item at a given index
export const stagger = (index: number, baseDelay = 0, interval = 120): number =>
  baseDelay + index * interval;

// Scroll-driven parallax on an element
export function useParallax(speed = 0.1) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const viewCenter = window.innerHeight / 2;
      const offset = (center - viewCenter) * speed;
      el.style.transform = `translateY(${offset}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [speed]);

  return ref;
}

// Text line-by-line reveal — staggered entry with blur for headlines
export const textLineReveal = (
  inView: boolean,
  lineIndex: number,
  baseDelay = 0,
  interval = 200,
): React.CSSProperties => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translateY(0px)' : 'translateY(40px)',
  filter: inView ? 'blur(0px)' : 'blur(8px)',
  transition: `opacity 1.2s cubic-bezier(0.22,1,0.36,1) ${baseDelay + lineIndex * interval}ms, transform 1.2s cubic-bezier(0.22,1,0.36,1) ${baseDelay + lineIndex * interval}ms, filter 1.4s cubic-bezier(0.22,1,0.36,1) ${baseDelay + lineIndex * interval}ms`,
});

// Animate a number from 0 to target when active
export function useCountUp(target: number, active: boolean, duration = 1800) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) { setCount(0); return; }
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
