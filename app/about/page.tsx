'use client';

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

const stats = [
  { num: '3x', label: 'Average revenue lift', sub: 'in first 90 days' },
  { num: '40%', label: 'More quotes closed', sub: 'with our quoting software' },
  { num: '100%', label: 'Custom-built', sub: 'for your trade & goals' },
  { num: '1', label: 'Point of contact', sub: 'for your entire growth stack' },
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
          <div style={{
            position: 'absolute', inset: '-10% 0',
            backgroundImage: 'url(https://assets.cdn.filesafe.space/NYlSya2nYSkSnnXEbY2l/media/69a9c640cc83074a8516f0d7.png)',
            backgroundSize: 'cover', backgroundPosition: 'center top',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 45%, rgba(0,0,0,0.65) 100%)',
            zIndex: 1,
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.68\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
            backgroundSize: '220px 220px', opacity: 0.12, mixBlendMode: 'soft-light', pointerEvents: 'none', zIndex: 2,
          }} />
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'flex-start', padding: '0 52px', zIndex: 3,
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
            <span style={{
              fontFamily: 'DM Sans, sans-serif', fontWeight: 800,
              fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', lineHeight: 0.95, letterSpacing: '-0.04em',
              background: 'linear-gradient(118deg, rgba(13,3,5,0.82) 0%, rgba(92,15,15,0.72) 28%, rgba(181,32,32,0.60) 52%, rgba(122,16,16,0.72) 72%, rgba(26,4,6,0.82) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              display: 'block', userSelect: 'none', marginTop: '0.1em',
            }}>Marketing Agency.</span>
          </div>
        </div>
      </section>

      {/* ── Who we are — story intro ── */}
      <section ref={hero.ref as React.Ref<HTMLElement>} style={{ padding: '100px 0', background: '#ffffff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
            <div>
              <div style={{ ...slideFromBottomLeft(hero.inView, 0) }}>
                <div className="section-tag">Who We Are</div>
                <h2 style={{
                  fontFamily: 'DM Sans, sans-serif', fontWeight: 800,
                  fontSize: 'clamp(2rem, 4vw, 3.25rem)', lineHeight: 1.1,
                  letterSpacing: '-0.03em', marginBottom: '1.5rem',
                }}>
                  A boutique growth firm built{' '}
                  <span style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>exclusively</span>{' '}
                  for home service contractors.
                </h2>
              </div>
              <div style={{ ...fadeUp(hero.inView, 200) }}>
                <p style={{ fontSize: '1.0625rem', lineHeight: '1.85', color: 'var(--color-gray)', marginBottom: '1.25rem' }}>
                  RevCore is not a generalist agency. We don't take on e-commerce brands, SaaS companies, or restaurants. We do one thing: help contractors in trades like roofing, HVAC, solar, windows, and siding grow their revenue fast, with systems that actually work in the field.
                </p>
                <p style={{ fontSize: '1.0625rem', lineHeight: '1.85', color: 'var(--color-gray)' }}>
                  Instead of sending you to four different vendors for your CRM, your ads, your software, and your training, we handle all of it. One team. One point of contact. Everything custom-built around your business.
                </p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', ...fadeUp(hero.inView, 350) }}>
              {[
                { label: 'All tools connect', sub: 'into your RevCore CRM', color: '#0f1a10', accent: '#94D96B' },
                { label: 'Custom to your trade', sub: 'no generic templates', color: '#0a0f1a', accent: '#6B8EFE' },
                { label: '1 point of contact', sub: 'for your entire stack', color: '#1a0a0a', accent: '#FE6462' },
                { label: 'In-home training', sub: 'your team, your market', color: '#1a150a', accent: '#FEB64A' },
              ].map((c) => (
                <div key={c.label} style={{
                  background: c.color, borderRadius: '20px', padding: '1.75rem',
                  aspectRatio: '1/1', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                  border: `1px solid ${c.accent}20`,
                }}>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1rem', fontWeight: 800, color: c.accent, lineHeight: 1.2, marginBottom: '4px' }}>{c.label}</div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>{c.sub}</div>
                </div>
              ))}
            </div>
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
                ...scaleUp(statsSection.inView, i * 100),
              }}>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 800, color: 'white', lineHeight: 1 }}>{s.num}</div>
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
                  border: `1px solid ${p.accent}18`, padding: '2.5rem',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  ...anim,
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = `${anim.transform ?? ''} translateY(-6px)`; e.currentTarget.style.boxShadow = `0 20px 60px ${p.accent}18`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = anim.transform ?? ''; e.currentTarget.style.boxShadow = 'none'; }}
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
                      background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
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
                    ].map((item) => (
                      <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
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
        @media (max-width: 768px) {
          .about-grid-2 { grid-template-columns: 1fr !important; }
          .about-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </>
  );
}
