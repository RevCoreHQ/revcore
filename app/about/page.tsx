'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import SpaceBackground from '@/components/SpaceBackground';
import {
  useScrollReveal,
  fadeUp,
  scaleUp,
  slideFromLeft,
  slideFromRight,
  slideFromBottomLeft,
  slideFromBottomRight,
  slideFromTopLeft,
  slideFromTopRight,
} from '@/hooks/useScrollReveal';
import AnimatedText from '@/components/AnimatedText';
import SystemDiagram from '@/components/sections/SystemDiagram';

function CountUp({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const duration = 1600;
    const start = performance.now();
    const frame = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [inView, target]);
  return <>{count}{suffix}</>;
}

const stats = [
  { target: 3, suffix: 'x', label: 'Average revenue lift', sub: 'in first 90 days' },
  { target: 40, suffix: '%', label: 'More quotes closed', sub: 'with our quoting software' },
  { target: 100, suffix: '%', label: 'Custom-built', sub: 'for your trade & goals' },
  { target: 1, suffix: '', label: 'Point of contact', sub: 'for your entire growth stack' },
];

const pillars = [
  {
    number: '01',
    title: 'Revenue-First Thinking',
    body: 'Every tool we build, every system we set up, every ad we run is tied back to one question: does this close more jobs? We don\'t optimize for vanity metrics.',
    color: '#1a0a0a',
    accent: '#FE6462',
  },
  {
    number: '02',
    title: 'Built 100% Custom',
    body: 'No templates. No cookie-cutter packages. Everything, your CRM pipelines, your presentation decks, your ad campaigns, your automation sequences, is built specifically for your company, your trade, and your market.',
    color: '#0a0f1a',
    accent: '#6B8EFE',
  },
  {
    number: '03',
    title: 'One Point of Contact',
    body: 'Instead of hiring 3–4 vendors for leads, software, training, and follow-up, you get everything through us. One team that understands your whole business. No handoff chaos.',
    color: '#0a1a0a',
    accent: '#94D96B',
  },
  {
    number: '04',
    title: 'Everything Routes to Your CRM',
    body: 'Website, paid ads, follow-up sequences, and our rehash engine all feed directly into your centralized CRM. Every lead tracked, every touchpoint visible, every dollar accountable.',
    color: '#1a150a',
    accent: '#FEB64A',
  },
];

const timeline = [
  { year: 'Step 1', label: 'Discovery Call', body: 'We learn your trade, your market, your current numbers, and your goals. No guesswork.' },
  { year: 'Step 2', label: 'Custom Build', body: 'We build out your CRM, automations, quoting software, presentation app, and ad campaigns, all branded to you.' },
  { year: 'Step 3', label: 'Sales Training', body: 'We train your team in-home. Scripts, objection handling, how to use the tools, how to close at the kitchen table.' },
  { year: 'Step 4', label: 'Launch & Optimize', body: 'We go live, monitor everything, and keep optimizing. You get regular reporting with real revenue numbers.' },
];

export default function AboutPage() {
  const heroImgRef = useRef<HTMLDivElement>(null);
  const agencyRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (agencyRef.current) {
      agencyRef.current.style.filter = 'brightness(1.2) saturate(1.3)';
      agencyRef.current.style.backgroundPosition = '0% center';
    }
    const onScroll = () => {
      if (heroImgRef.current) {
        heroImgRef.current.style.transform = `translateY(${window.scrollY * 0.25}px)`;
      }
      if (agencyRef.current) {
        const progress = Math.min(1, window.scrollY / 700);
        agencyRef.current.style.filter = `brightness(${1.2 + progress * 2.0}) saturate(${1.3 + progress * 1.0})`;
        agencyRef.current.style.backgroundPosition = `${progress * 300}% center`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const hero = useScrollReveal({ threshold: 0.1 });
  const statsSection = useScrollReveal({ threshold: 0.08 });
  const pillarsSection = useScrollReveal({ threshold: 0.05 });
  const timelineSection = useScrollReveal({ threshold: 0.08 });
  const crmSection = useScrollReveal({ threshold: 0.15 });
  const ctaSection = useScrollReveal({ threshold: 0.2 });

  return (
    <>
      {/* ── Hero card — dark, mirrors homepage style ── */}
      <section style={{ background: '#ffffff', paddingTop: '80px' }}>
        <div style={{
          margin: '12px',
          borderRadius: '24px',
          overflow: 'hidden',
          position: 'relative',
          height: '60vh',
          minHeight: '420px',
          background: '#0d1117',
        }}>
          {/* Parallax background image */}
          <div
            ref={heroImgRef}
            style={{
              position: 'absolute', inset: '-10% 0',
              backgroundImage: 'url(https://assets.cdn.filesafe.space/NYlSya2nYSkSnnXEbY2l/media/69ac7965618c8dfc285b4e82.png)',
              backgroundSize: 'cover', backgroundPosition: 'center top',
              willChange: 'transform',
            }}
          />
          {/* Base dark overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />
          {/* Space stars — above base overlay */}
          <SpaceBackground opacity={0.75} />
          {/* Gradient vignette */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.72) 100%)',
            zIndex: 1,
          }} />
          {/* Lower grain */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.68\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
            backgroundSize: '220px 220px', opacity: 0.14, mixBlendMode: 'soft-light', pointerEvents: 'none', zIndex: 2,
          }} />
          {/* Upper grain */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n2\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n2)\'/%3E%3C/svg%3E")',
            backgroundSize: '180px 180px', opacity: 0.09, mixBlendMode: 'overlay', pointerEvents: 'none', zIndex: 3,
          }} />
          {/* Text content */}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'flex-start', padding: '0 52px', zIndex: 4,
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '1.25rem',
            }}>
              <span style={{ width: '24px', height: '2px', background: '#FE6462', display: 'block' }} />
              About RevCore
            </div>
            <span style={{
              fontFamily: 'DM Sans, sans-serif', fontWeight: 800,
              fontSize: 'clamp(3.5rem, 10vw, 8rem)', lineHeight: 0.9, letterSpacing: '-0.04em',
              color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.72)', display: 'block', userSelect: 'none',
            }}>Not Another</span>
            <span
              ref={agencyRef}
              className="about-agency"
              style={{
                fontFamily: 'DM Sans, sans-serif', fontWeight: 800,
                fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', lineHeight: 1, letterSpacing: '-0.04em',
                display: 'block', userSelect: 'none', marginTop: '0.1em', paddingBottom: '0.1em',
                willChange: 'filter',
              }}
            >Marketing Agency.</span>
          </div>
        </div>
      </section>

      {/* ── Who we are ── */}
      <section ref={hero.ref as React.Ref<HTMLElement>} style={{ padding: '100px 0', background: '#070b0f', position: 'relative', overflow: 'hidden' }}>
        <SpaceBackground opacity={0.22} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ ...fadeUp(hero.inView, 0) }}>
            <div className="section-tag" style={{ color: 'rgba(255,255,255,0.35)' }}>
              <span style={{ width: '24px', height: '2px', background: '#FE6462', display: 'block' }} />
              Who We Are
            </div>
          </div>
          <AnimatedText
            as="h2"
            inView={hero.inView}
            delay={100}
            stagger={65}
            style={{
              fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)', fontWeight: 800,
              lineHeight: 1.1, letterSpacing: '-0.03em',
              color: 'white', maxWidth: '820px', marginBottom: '3rem',
            }}
          >
            Not a generalist agency. A revenue firm built exclusively for the trades.
          </AnimatedText>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3.5rem' }}>
            <p style={{ fontSize: '1.0625rem', lineHeight: '1.85', color: 'rgba(255,255,255,0.45)', ...slideFromLeft(hero.inView, 350) }}>
              RevCore is not a generalist agency. We don&apos;t take on e-commerce brands, SaaS companies, or restaurants. We do one thing: help home improvement contractors — roofers, remodelers, window companies, pool builders, landscapers, and more — grow their revenue fast, with systems that actually work in the field.
            </p>
            <p style={{ fontSize: '1.0625rem', lineHeight: '1.85', color: 'rgba(255,255,255,0.45)', ...slideFromRight(hero.inView, 450) }}>
              Instead of sending you to four different vendors for your CRM, your ads, your software, and your training, we handle all of it. One team. One point of contact. Everything custom-built around your business.
            </p>
          </div>
          {/* Founder story */}
          <div style={{
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '2.25rem 2.5rem',
            marginBottom: '3rem',
            position: 'relative',
            overflow: 'hidden',
            ...fadeUp(hero.inView, 500),
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: 'linear-gradient(180deg, #FE6462 0%, transparent 100%)', borderRadius: '3px 0 0 3px' }} />
            <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: '#FE6462', marginBottom: '1.25rem' }}>
              Why RevCore Exists
            </div>
            <p style={{ fontSize: '1rem', lineHeight: '1.9', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
              RevCore was built by someone who lived both sides of the business. Years spent in tech, writing code, building databases, designing automations, custom reporting, information security, and architecting systems from scratch. Then a pivot into home improvement sales, closing at the kitchen table, and helping scale a local family owned company from $1M to $10M in under two years, all while still closing himself. In the last year alone, $3.5M in sold jobs, while simultaneously managing the sales team and building the presentation tools, trackers, and systems this industry was missing. RevCore exists because that person looked for what he needed, couldn&apos;t find it anywhere, and decided to build it himself.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {['Roofing', 'Windows', 'Interior Remodeling', 'General Contracting', 'Stucco & Siding', 'Decks & Patios', 'Pool Contractors', 'Landscaping', '+ More'].map((trade, i) => (
              <span key={trade} style={{
                padding: '6px 18px', borderRadius: '100px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', fontWeight: 500,
                cursor: 'default', transition: 'background 0.2s ease, color 0.2s ease, border-color 0.2s ease',
                ...fadeUp(hero.inView, 550 + i * 45),
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(254,100,98,0.12)'; e.currentTarget.style.borderColor = 'rgba(254,100,98,0.35)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
              >{trade}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── System diagram ── */}
      <SystemDiagram />

      {/* ── Stats bar — dark ── */}
      <section ref={statsSection.ref as React.Ref<HTMLElement>} style={{ padding: '80px 0', background: '#070b0f', position: 'relative', overflow: 'hidden' }}>
        <SpaceBackground opacity={0.45} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.07)', borderRadius: '20px', overflow: 'hidden' }}>
            {stats.map((s, i) => (
              <div key={s.label} style={{
                padding: '3rem 2rem', background: '#070b0f', textAlign: 'center',
                transition: 'background 0.3s ease',
                ...scaleUp(statsSection.inView, i * 100),
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#0d1520'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#070b0f'; }}
              >
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 800, color: 'white', lineHeight: 1 }}>
                  <CountUp target={s.target} suffix={s.suffix} inView={statsSection.inView} />
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', margin: '8px 0 4px' }}>{s.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Four pillars — corner animations ── */}
      <section ref={pillarsSection.ref as React.Ref<HTMLElement>} style={{ padding: '100px 0', background: '#0A0A0A', position: 'relative', overflow: 'hidden' }}>
        <SpaceBackground opacity={0.45} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem', ...fadeUp(pillarsSection.inView, 0) }}>
            <div className="section-tag" style={{ color: 'rgba(255,255,255,0.35)', justifyContent: 'center' }}>
              <span style={{ width: '24px', height: '2px', background: '#FE6462', display: 'block' }} />
              How We Think
            </div>
            <AnimatedText
              as="h2"
              inView={pillarsSection.inView}
              delay={120}
              stagger={75}
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'white' }}
            >
              The four things that make RevCore different.
            </AnimatedText>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            {pillars.map((p, i) => {
              const corners = [slideFromTopLeft, slideFromTopRight, slideFromBottomLeft, slideFromBottomRight];
              const anim = corners[i](pillarsSection.inView, 150 + i * 100);
              return (
                <div key={p.number} style={{
                  borderRadius: '20px', background: p.color,
                  border: `1px solid ${p.accent}25`, padding: '2.5rem',
                  transition: 'transform 0.6s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s ease',
                  willChange: 'transform',
                  ...anim,
                }}
                  onMouseMove={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - r.left) / r.width - 0.5;
                    const y = (e.clientY - r.top) / r.height - 0.5;
                    e.currentTarget.style.transition = 'box-shadow 0.15s ease';
                    e.currentTarget.style.transform = `perspective(900px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg) translateY(-8px) scale(1.02)`;
                    e.currentTarget.style.boxShadow = `${-x * 20}px ${-y * 20}px 50px ${p.accent}22, 0 24px 60px ${p.accent}15`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s ease';
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span style={{ fontSize: '0.68rem', color: p.accent, fontWeight: 700, letterSpacing: '0.1em', display: 'block', marginBottom: '0.75rem' }}>{p.number}</span>
                  <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3rem', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: '0.875rem' }}>{p.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.45)', lineHeight: '1.75', fontSize: '0.9rem' }}>{p.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it works — timeline ── */}
      <section ref={timelineSection.ref as React.Ref<HTMLElement>} style={{ padding: '100px 0', background: '#ffffff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'start' }}>
            <div style={{ ...slideFromLeft(timelineSection.inView, 0) }}>
              <div className="section-tag">How It Works</div>
              <h2 style={{
                fontFamily: 'DM Sans, sans-serif', fontWeight: 800,
                fontSize: 'clamp(2rem, 4vw, 3.25rem)', lineHeight: 1.1,
                letterSpacing: '-0.03em', marginBottom: '1.5rem',
              }}>
                From strategy call to full system, in weeks, not months.
              </h2>
              <p style={{ color: 'var(--color-gray)', lineHeight: '1.8', fontSize: '1rem', marginBottom: '2rem' }}>
                We've built this process for contractors who can't wait around. Every step is structured to get you generating more revenue as fast as possible.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  'Your CRM is live before you finish onboarding',
                  'Ads running within the first week',
                  'Software trained and deployed to your team',
                  'Full automation stack active from day one',
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <CheckCircle size={16} color="#94D96B" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ color: 'var(--color-gray)', fontSize: '0.9375rem' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {timeline.map((step, i) => (
                <div key={step.year} style={{
                  display: 'flex', gap: '1.5rem', alignItems: 'flex-start',
                  ...slideFromRight(timelineSection.inView, 100 + i * 120),
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: '#0A0A0A', border: '2px solid rgba(255,255,255,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, position: 'relative',
                      animation: timelineSection.inView ? `stepPop 0.5s cubic-bezier(0.34,1.56,0.64,1) ${0.1 + i * 0.15}s both` : 'none',
                    }}>
                      <span style={{ color: 'white', fontSize: '0.7rem', fontWeight: 800 }}>{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    {i < timeline.length - 1 && (
                      <div style={{ width: '1px', flexGrow: 1, background: '#e5e5e5', margin: '6px 0', minHeight: '48px' }} />
                    )}
                  </div>
                  <div style={{ paddingBottom: i < timeline.length - 1 ? '2rem' : 0 }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-gray)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>{step.year}</div>
                    <h4 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{step.label}</h4>
                    <p style={{ color: 'var(--color-gray)', fontSize: '0.9rem', lineHeight: '1.7' }}>{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CRM spotlight — dark ── */}
      <section ref={crmSection.ref as React.Ref<HTMLElement>} style={{ padding: '100px 0', background: '#070b0f', position: 'relative', overflow: 'hidden' }}>
        <SpaceBackground opacity={0.45} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
                <div style={{
                  borderRadius: '24px', padding: '3.5rem',
                  background: 'linear-gradient(135deg, #0f1a10 0%, #0a0f1a 100%)',
                  border: '1px solid rgba(255,255,255,0.07)', ...fadeUp(crmSection.inView, 0),
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#94D96B', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>CRM & Central Command</span>
                  </div>
                  <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', color: 'white', lineHeight: 1.15, marginBottom: '1.25rem' }}>
                    Every lead. Every touchpoint.<br />Every dollar. All in one place.
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.45)', lineHeight: '1.8', marginBottom: '2.5rem', fontSize: '1rem' }}>
                    Your website, your paid ads, your follow-up sequences, and your rehash engine (automated re-engagement for old leads) all route back into your RevCore CRM. It's a centralized command center, so instead of logging into four different platforms to figure out what's working, you see everything in one clean dashboard.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    {[
                      { label: 'Website leads → CRM', color: '#94D96B' },
                      { label: 'Paid ads → CRM', color: '#6B8EFE' },
                      { label: 'Follow-up engine → CRM', color: '#FEB64A' },
                      { label: 'Rehash automation → CRM', color: '#FE6462' },
                    ].map((item, i) => (
                      <div key={item.label} style={{
                        display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px',
                        borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                        transition: 'background 0.25s ease, border-color 0.25s ease',
                        ...(i % 2 === 0 ? slideFromLeft(crmSection.inView, i * 100) : slideFromRight(crmSection.inView, i * 100)),
                      }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = `${item.color}30`; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                      >
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                        <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section ref={ctaSection.ref as React.Ref<HTMLElement>} style={{ padding: '100px 0', background: 'var(--color-bg)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <div style={{ ...fadeUp(ctaSection.inView, 0) }}>
            <div className="section-tag" style={{ justifyContent: 'center' }}>Ready?</div>
          </div>
          <AnimatedText
            as="h2"
            inView={ctaSection.inView}
            delay={150}
            stagger={70}
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '1rem' }}
          >
            Let&apos;s build your growth system.
          </AnimatedText>
          <p style={{ color: 'var(--color-gray)', marginBottom: '2rem', lineHeight: '1.75', ...fadeUp(ctaSection.inView, 500) }}>
            One call is all it takes to map out exactly what your business needs and how we get you there.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', ...fadeUp(ctaSection.inView, 650) }}>
            <Link href="/contact" className="btn-primary">
              Book a strategy call <ArrowRight size={16} />
            </Link>
            <Link href="/services" className="btn-outline">
              See all services
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .about-agency {
          background: linear-gradient(118deg,
            #ffffff 0%, #FE6462 20%, #ff9e9d 42%, #ffffff 58%, #FE6462 76%, #ff9e9d 88%, #ffffff 100%
          );
          background-size: 300% auto;
          background-position: 0% center;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        @keyframes stepPop {
          0%   { transform: scale(0.4); opacity: 0; }
          100% { transform: scale(1);   opacity: 1; }
        }
        @media (max-width: 768px) {
          .about-grid-2 { grid-template-columns: 1fr !important; }
          .about-stats { grid-template-columns: repeat(2, 1fr) !important; }
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
