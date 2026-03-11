'use client';

import { useEffect, useRef, useState } from 'react';

export function useGsapScrollPin(scrubLength = 3000) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobile = window.innerWidth < 900;
    setIsMobile(mobile);
    if (mobile) return;

    let trigger: { kill: () => void } | null = null;

    async function init() {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!containerRef.current) return;

      trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${scrubLength}`,
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => setProgress(self.progress),
      });
    }

    init();
    return () => { if (trigger) trigger.kill(); };
  }, [scrubLength]);

  return { containerRef, progress, isMobile };
}
