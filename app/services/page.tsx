'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useScrollReveal, fadeUp, slideFromRight } from '@/hooks/useScrollReveal';
import SpaceBackground from '@/components/SpaceBackground';
import AnimatedText from '@/components/AnimatedText';

const services = [
  {
    id: 'appointments',
    number: '01',
    title: 'Appointment Generation',
    tagline: 'More appointments. Less chasing.',
    description: 'We build and run paid ad campaigns on Google, Meta, and YouTube — hyper-targeted to homeowners in your service area. Every dollar tracked, every appointment booked directly into your calendar.',
    deliverables: ['Google Ads Management', 'Meta & Instagram Ads', 'Geo-targeted Campaigns', 'Landing Page Build', 'Appointment Booking & Reporting'],
    accent: '#FE6462',
  },
  {
    id: 'organic',
    number: '02',
    title: 'Organic Growth & SEO',
    tagline: 'Rank higher. Stay there.',
    description: 'Long-term visibility that compounds over time. We handle local SEO, Google Business optimization, and content strategy so homeowners find you before they find your competitors.',
    deliverables: ['Local SEO Audit', 'Google Business Profile', 'Keyword Strategy', 'Content Planning', 'Review Generation'],
    accent: '#6B8EFE',
  },
  {
    id: 'automation',
    number: '03',
    title: 'Proprietary Automation',
    tagline: 'Never miss a follow-up again.',
    description: 'From quote follow-ups to review requests to rehash campaigns on old appointments, our automation engine runs 24/7 without your team touching anything. Built specifically for home service sales cycles.',
    deliverables: ['Follow-Up Sequences', 'Rehash Engine', 'Review Request Automation', 'Appointment Reminders', 'Nurture Flows'],
    accent: '#94D96B',
  },
  {
    id: 'training',
    number: '04',
    title: 'In-Home Sales Training',
    tagline: 'Close more at higher tickets.',
    description: 'We train your reps in the field — scripts, objection handling, how to present options, and how to close at the kitchen table. Paired with our software, your team closes more, at higher average tickets.',
    deliverables: ['In-Home Sales Scripts', 'Objection Handling', 'Good / Better / Best Pricing', 'Role-Play Sessions', 'Performance Tracking'],
    accent: '#FEB64A',
  },
  {
    id: 'software',
    number: '05',
    title: 'Proprietary Sales Software',
    tagline: 'Close deals before you leave the driveway.',
    description: 'Two tools built in-house: a quoting platform that generates proposals on-site and tracks every job, and a custom iPad presentation that builds trust and collects e-signatures before you leave the driveway.',
    deliverables: ['Quoting Software', 'iPad Presentation App', 'E-Signature Collection', 'Job Pipeline Tracking', 'Automated Follow-Up'],
    accent: '#94D96B',
  },
  {
    id: 'crm-service',
    number: '06',
    title: 'CRM & Reporting',
    tagline: 'Everything in one place.',
    description: 'Your centralized command center. Website appointments, paid ads, follow-up sequences, and your rehash engine all route into one clean CRM. One dashboard. Every touchpoint. Every dollar.',
    deliverables: ['Custom CRM Build', 'Pipeline Configuration', 'Lead Source Tracking', 'Revenue Reporting', 'Team Access & Roles'],
    accent: '#FEB64A',
  },
];

export default function ServicesPage() {
  const heroImgRef = useRef<HTMLDivElement>(null);
  const doBestRef = useRef<HTMLSpanElement>(null);
  const hScrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    if (doBestRef.current) {
      doBestRef.current.style.filter = 'brightness(1.2) saturate(1.3)';
      doBestRef.current.style.backgroundPosition = '0% center';
    }

    function updateHeight() {
      if (hScrollRef.current && trackRef.current) {
        const maxTranslate = trackRef.current.scrollWidth - window.innerWidth;
        hScrollRef.current.style.height = `${window.innerHeight + maxTranslate}px`;
      }
    }
    updateHeight();
    window.addEventListener('resize', updateHeight);

    const onScroll = () => {
      if (heroImgRef.current) {
        heroImgRef.current.style.transform = `translateY(${window.scrollY * 0.25}px)`;
      }
      if (doBestRef.current) {
        const progress = Math.min(1, window.scrollY / 700);
        doBestRef.current.style.filter = `brightness(${1.2 + progress * 2.0}) saturate(${1.3 + progress * 1.0})`;
        doBestRef.current.style.backgroundPosition = `${progress * 300}% center`;
      }
      if (hScrollRef.current && trackRef.current) {
        const rect = hScrollRef.current.getBoundingClientRect();
        const maxTranslate = trackRef.current.scrollWidth - window.innerWidth;
        const scrolled = -rect.top;
        const totalScroll = hScrollRef.current.offsetHeight - window.innerHeight;
        const progress = Math.max(0, Math.min(1, scrolled / totalScroll));
        trackRef.current.style.transform = `translateX(${-progress * maxTranslate}px)`;
        setActiveCard(Math.round(progress * (services.length - 1)));
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  const heroSection = useScrollReveal({ threshold: 0.1 });
  const crmSection = useScrollReveal({ threshold: 0.15 });

  return (
    <>
      {/* ── Hero ── */}
      <section style={{ background: '#ffffff', paddingTop: '80px' }}>
        <div style={{
          margin: '12px', borderRadius: '24px', overflow: 'hidden',
          position: 'relative', height: '88vh', minHeight: '480px', background: '#0d1117',
        }}>
          <div
            ref={heroImgRef}
            style={{
              position: 'absolute', inset: '-10% 0',
              backgroundImage: 'url(https://assets.cdn.filesafe.space/NYlSya2nYSkSnnXEbY2l/media/69ac7965b003fa52d21b8088.png)',
              backgroundSize: 'cover', backgroundPosition: '50% 5%',
              willChange: 'transform',
            }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />
          <SpaceBackground opacity={0.75} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.72) 100%)',
            zIndex: 1,
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.68\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
            backgroundSize: '220px 220px', opacity: 0.14, mixBlendMode: 'soft-light', pointerEvents: 'none', zIndex: 2,
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n2\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n2)\'/%3E%3C/svg%3E")',
            backgroundSize: '180px 180px', opacity: 0.09, mixBlendMode: 'overlay', pointerEvents: 'none', zIndex: 3,
          }} />
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            justifyContent: 'flex-end', alignItems: 'flex-start', padding: '0 52px 52px', zIndex: 4,
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '1.25rem',
            }}>
              <span style={{ width: '24px', height: '2px', background: '#94D96B', display: 'block' }} />
              Services
            </div>
            <span style={{
              fontFamily: 'DM Sans, sans-serif', fontWeight: 800,
              fontSize: 'clamp(3rem, 9vw, 7rem)', lineHeight: 0.9, letterSpacing: '-0.04em',
              color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.72)', display: 'block',
            }}>What we</span>
            <span
              ref={doBestRef}
              className="services-do-best"
              style={{
                fontFamily: 'DM Sans, sans-serif', fontWeight: 800,
                fontSize: 'clamp(2.25rem, 6.5vw, 5rem)', lineHeight: 1, letterSpacing: '-0.04em',
                display: 'block', marginTop: '0.1em', paddingBottom: '0.1em',
                willChange: 'filter',
                backgroundPosition: '0% center',
              }}
            >do best.</span>
          </div>
        </div>
      </section>

      {/* ── Intro ── */}
      <section ref={heroSection.ref as React.Ref<HTMLElement>} style={{ padding: '72px 0 48px', background: '#ffffff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <AnimatedText
              as="h2"
              inView={heroSection.inView}
              delay={100}
              stagger={65}
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' }}
            >
              Six services. One team. All connected into your CRM.
            </AnimatedText>
            <p style={{ color: 'var(--color-gray)', lineHeight: '1.8', fontSize: '1rem', ...fadeUp(heroSection.inView, 400) }}>
              Every service we offer is built to work together. Your ads fill your calendar with booked appointments. Your automation follows them up. Your software closes them. Your CRM tracks it all. One point of contact. Zero gaps.
            </p>
          </div>
          <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '14px', ...fadeUp(heroSection.inView, 600) }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)' }}>
              Scroll to explore
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {services.map((s, i) => (
                <div key={s.id} style={{
                  width: activeCard === i ? '20px' : '6px',
                  height: '6px', borderRadius: '100px',
                  background: activeCard === i ? s.accent : 'rgba(0,0,0,0.12)',
                  transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Horizontal scroll section ── */}
      <div ref={hScrollRef} style={{ position: 'relative', height: '600vh' }}>
        <div style={{
          position: 'sticky', top: 0, height: '100vh', overflow: 'hidden',
          background: '#070b0f', display: 'flex', alignItems: 'center',
        }}>
          <SpaceBackground opacity={0.22} />

          {/* Top progress bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.06)', zIndex: 10 }}>
            <div style={{
              height: '100%',
              background: services[activeCard]?.accent || '#94D96B',
              width: `${((activeCard + 1) / services.length) * 100}%`,
              transition: 'width 0.35s ease, background 0.35s ease',
            }} />
          </div>

          {/* Card counter */}
          <div style={{ position: 'absolute', top: '28px', right: '40px', zIndex: 10 }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>
              {String(activeCard + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
            </span>
          </div>

          {/* Cards track */}
          <div
            ref={trackRef}
            style={{
              display: 'flex',
              gap: '24px',
              paddingLeft: '40px',
              paddingRight: '40px',
              willChange: 'transform',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {services.map((service, i) => (
              <div
                key={service.id}
                style={{
                  width: 'clamp(360px, 48vw, 640px)',
                  height: 'min(calc(100vh - 160px), 680px)',
                  flexShrink: 0,
                  borderRadius: '20px',
                  background: `linear-gradient(145deg, ${service.accent}09 0%, #0d1117 55%, #070b0f 100%)`,
                  border: `1px solid ${activeCard === i ? service.accent + '35' : service.accent + '15'}`,
                  padding: '2.5rem',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'border-color 0.5s ease, box-shadow 0.5s ease',
                  boxShadow: activeCard === i ? `0 0 80px ${service.accent}0d` : 'none',
                }}
              >
                {/* Ghost number */}
                <span style={{
                  position: 'absolute', right: '-20px', bottom: '-60px',
                  fontSize: '20rem', fontWeight: 900, lineHeight: 1,
                  color: `${service.accent}07`, fontFamily: 'DM Sans, sans-serif',
                  letterSpacing: '-0.08em', userSelect: 'none', pointerEvents: 'none',
                }}>
                  {service.number}
                </span>

                {/* Top content */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2.5rem' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.16em', color: service.accent, opacity: 0.6 }}>
                      {service.number}
                    </span>
                    <div style={{ flex: 1, height: '1px', background: `${service.accent}18` }} />
                  </div>
                  <p style={{
                    fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em',
                    color: service.accent, textTransform: 'uppercase', marginBottom: '0.85rem',
                  }}>
                    {service.tagline}
                  </p>
                  <h2 style={{
                    fontFamily: 'DM Sans, sans-serif', fontWeight: 800,
                    fontSize: 'clamp(1.5rem, 2.4vw, 2.25rem)', color: 'white',
                    lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1.25rem',
                  }}>
                    {service.title}
                  </h2>
                  <p style={{
                    color: 'rgba(255,255,255,0.45)', lineHeight: '1.75',
                    fontSize: '0.875rem', maxWidth: '480px',
                  }}>
                    {service.description}
                  </p>
                </div>

                {/* Bottom content */}
                <div>
                  <p style={{
                    fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em',
                    textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '0.85rem',
                  }}>
                    What&apos;s included
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {service.deliverables.map((d) => (
                      <span key={d} style={{
                        padding: '6px 14px', borderRadius: '100px',
                        background: `${service.accent}10`,
                        border: `1px solid ${service.accent}22`,
                        fontSize: '0.8rem', fontWeight: 500, color: 'rgba(255,255,255,0.65)',
                      }}>
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom dot indicators */}
          <div style={{
            position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: '8px', zIndex: 10,
          }}>
            {services.map((s, i) => (
              <div key={s.id} style={{
                width: activeCard === i ? '24px' : '6px',
                height: '6px', borderRadius: '100px',
                background: activeCard === i ? s.accent : 'rgba(255,255,255,0.18)',
                transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* ── All-in-1 CRM banner ── */}
      <section ref={crmSection.ref as React.Ref<HTMLElement>} style={{ padding: '80px 0 120px', background: '#070b0f', position: 'relative', overflow: 'hidden' }}>
        <SpaceBackground opacity={0.45} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #0f1a10 0%, #0a0f1a 100%)',
            padding: '3.5rem',
            border: '1px solid rgba(255,255,255,0.07)',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'center',
            gap: '3rem',
            ...fadeUp(crmSection.inView, 0),
          }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '20px', height: '2px', background: '#94D96B', display: 'block' }} />
                All In One
              </div>
              <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: '1rem' }}>
                One firm. One CRM.<br />Everything custom-built for you.
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.45)', lineHeight: '1.75', maxWidth: '540px', marginBottom: '1.5rem' }}>
                Instead of hiring separate companies for your ads, your software, your training, and your follow-up, RevCore does all of it. And because everything is built in-house, every piece connects. Your website, your paid ads, your follow-up engine, and your rehash campaigns all route back into one centralized CRM, fully custom to your company, your trade, and your goals.
              </p>
              <Link href="/contact" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'white', color: '#0A0A0A',
                padding: '12px 24px', borderRadius: '100px',
                fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none',
              }}>
                Build your system <ArrowRight size={15} />
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '240px' }}>
              {[
                { label: 'Website → CRM', color: '#94D96B', delay: 0 },
                { label: 'Paid Ads → CRM', color: '#6B8EFE', delay: 80 },
                { label: 'Follow-Up Engine → CRM', color: '#FEB64A', delay: 160 },
                { label: 'Rehash Automation → CRM', color: '#FE6462', delay: 240 },
                { label: 'Sales Software → CRM', color: '#94D96B', delay: 320 },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 16px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                    cursor: 'default',
                    ...slideFromRight(crmSection.inView, item.delay),
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = `${item.color}12`;
                    (e.currentTarget as HTMLElement).style.borderColor = `${item.color}30`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
                  }}
                >
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .services-do-best {
          background: linear-gradient(118deg,
            #ffffff 0%, #94D96B 18%, #d4f5a8 38%, #ffffff 52%, #FEB64A 70%, #ffe0a0 84%, #ffffff 100%
          );
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-position: 0% center;
        }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"],
          div[style*="grid-template-columns: 1fr auto"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
