'use client';

import { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, ChevronUp, Lock, ArrowRight, Star, Zap, TrendingUp } from 'lucide-react';
import FunnelDiagram from '@/components/FunnelDiagram';
import SEOChecker from '@/components/SEOChecker';
import SpaceBackground from '@/components/SpaceBackground';
const HERO_PHOTO_URL = 'https://assets.cdn.filesafe.space/NYlSya2nYSkSnnXEbY2l/media/69ac7965618c8dfc285b4e82.png';

const SALES_PASSWORD = '  ';

// ─── A la carte services ─────────────────────────────────────────────────────
const services = [
  {
    id: 'meta',
    number: '01',
    title: 'Meta Ads Management',
    description: 'Facebook & Instagram ad campaigns hyper-targeted to homeowners in your service area. Every lead routed directly into your CRM with automated follow-up.',
    startingAt: '$1,200',
    period: '/mo',
    note: '+ ad spend',
    accent: '#FE6462',
    color: '#1a0a0a',
    includes: ['Campaign build & creative', 'Audience targeting & retargeting', 'A/B split testing', 'Weekly performance reports', 'Lead routing to CRM'],
  },
  {
    id: 'google',
    number: '02',
    title: 'Google Ads Management',
    description: 'Search and Local Services Ads to capture high-intent homeowners the moment they search. We handle setup, bidding, landing pages, and conversion tracking.',
    startingAt: '$1,200',
    period: '/mo',
    note: '+ ad spend',
    accent: '#FEB64A',
    color: '#1a150a',
    includes: ['Search & LSA campaigns', 'Keyword research & negative lists', 'Landing page optimization', 'Conversion tracking setup', 'Monthly reporting'],
  },
  {
    id: 'website',
    number: '03',
    title: 'Website & Local SEO',
    description: 'A custom conversion-optimized website built for your trade, plus local SEO that gets you ranking in your market. Built to generate calls and form submissions.',
    startingAt: '$2,500',
    period: ' setup',
    note: '+ $600/mo SEO retainer',
    accent: '#6B8EFE',
    color: '#0a0f1a',
    includes: ['Custom website design & build', 'Google Business Profile optimization', 'Local keyword strategy', 'Review generation system', 'Monthly SEO reporting'],
  },
  {
    id: 'crm',
    number: '04',
    title: 'CRM & Automation Engine',
    description: 'Your leads, follow-ups, reminders, and rehash campaigns all centralized in one custom CRM. Set up once, runs 24/7 without your team touching anything.',
    startingAt: '$1,500',
    period: ' setup',
    note: '+ $400/mo',
    accent: '#94D96B',
    color: '#0a1a0a',
    includes: ['Custom CRM build & configuration', 'SMS & email follow-up sequences', 'Appointment reminder automation', 'Rehash Engine™ (old lead campaigns)', 'Review request automation'],
  },
  {
    id: 'training',
    number: '05',
    title: 'In-Home Sales Training',
    description: 'We train your reps in the field. Scripts, objection handling, how to present Good/Better/Best options, and how to close at the kitchen table at higher ticket prices.',
    startingAt: '$2,500',
    period: '/session',
    note: 'On-site or virtual',
    accent: '#FEB64A',
    color: '#1a150a',
    includes: ['In-home sales scripts', 'Objection handling frameworks', 'Good/Better/Best pricing strategy', 'Role-play & ride-alongs', 'Custom sales presentation build'],
  },
];

// ─── Packages ─────────────────────────────────────────────────────────────────
const packages = [
  {
    id: 'launchpad',
    name: 'Launchpad',
    tagline: 'Test the waters. Only pay for results.',
    price: '$2,500',
    period: '/mo',
    note: '15 appts ($167/appt) + ad spend',
    accent: '#FE6462',
    highlight: false,
    includes: [
      '15 qualified appts / mo',
      'Meta Ads management',
      'Lead qualification & booking',
      'Basic CRM setup',
      'Appointment reminders',
      'SMS & email sequences',
      'Real-time lead alerts',
      'Dedicated landing page',
      'Weekly reports',
    ],
  },
  {
    id: 'growth',
    name: 'Growth Engine',
    tagline: 'Complete top-of-funnel system with website and SEO.',
    price: '$3,497',
    period: '/mo',
    note: '+ ad spend (you control budget)',
    accent: '#6B8EFE',
    highlight: true,
    includes: [
      '20+ qualified appts / mo',
      'Custom website',
      'Local SEO',
      '24/7 chat widget',
      'Paid ads management',
      'Appointment reminders',
      'Full CRM & pipeline',
      'Lead nurture sequences',
    ],
  },
  {
    id: 'revenue',
    name: 'Revenue Partner',
    tagline: 'Complete revenue engine with automation and sales optimization.',
    price: '$4,997',
    period: '/mo',
    note: '+ 4% revenue share on closed deals',
    accent: '#94D96B',
    highlight: false,
    includes: [
      'Everything in Growth Engine',
      'Google Business optimization',
      'AEO (AI Engine Optimization)',
      'Full automation stack',
      'Rehash Engine™',
      'Sales training & scripts',
      'Custom sales presentation',
      'Quoting software',
      'Dedicated success manager',
      '10-step sales framework',
      'Sales audit & optimization',
      'Monthly strategy sessions',
      'Review automation',
      'Referral program',
    ],
  },
];

// ─── Software pricing ──────────────────────────────────────────────────────────
const softwareOptions = [
  {
    id: 'quoting',
    name: 'Quoting & Proposal Software',
    description: 'Custom-built quoting platform your reps use on-site to generate professional proposals, present Good/Better/Best pricing, and track every job through your pipeline. Branded to your company.',
    setup: '$997',
    monthly: '$197',
    monthlyNote: '/mo per seat',
    accent: '#94D96B',
    color: '#0a1a0a',
    features: [
      'Custom branded proposal builder',
      'Good / Better / Best pricing tiers',
      'Job pipeline & status tracking',
      'Digital quote delivery & acceptance',
      'Automated follow-up on open quotes',
      'Revenue & close rate reporting',
      'Unlimited quote history',
    ],
  },
  {
    id: 'presentation',
    name: 'iPad Presentation App',
    description: 'A professional visual sales presentation built for your trade. Walk homeowners through your process, show before/afters, present your packages, and collect e-signatures before you leave the driveway.',
    setup: '$1,497',
    monthly: '$147',
    monthlyNote: '/mo per seat',
    accent: '#6B8EFE',
    color: '#0a0f1a',
    features: [
      'Custom branded presentation',
      'Trade-specific content & visuals',
      'Package & option showcasing',
      'E-signature collection',
      'CRM integration',
      'Annual content refresh included',
    ],
  },
];

// ─── Password gate ─────────────────────────────────────────────────────────────
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value === SALES_PASSWORD) {
      onUnlock();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setValue('');
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0A0A',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '2.5rem',
      }}>
        <img
          src="https://assets.cdn.filesafe.space/NYlSya2nYSkSnnXEbY2l/media/69a9af9fb003fa7bb8bb92ee.png"
          alt="RevCore"
          style={{ height: '36px', width: 'auto', marginBottom: '1.5rem', opacity: 0.9 }}
        />
        <h1 style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '1.75rem',
          fontWeight: 800,
          color: 'white',
          marginBottom: '0.5rem',
          letterSpacing: '-0.02em',
        }}>
          RevCore Sales Hub
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>
          Team access only — enter your password to continue
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          width: '100%',
          maxWidth: '360px',
          animation: shake ? 'shake 0.4s ease' : 'none',
        }}
      >
        <div style={{ position: 'relative' }}>
          <Lock
            size={15}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255,255,255,0.3)',
            }}
          />
          <input
            type="password"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(false); }}
            placeholder="Password"
            autoFocus
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.06)',
              border: `1.5px solid ${error ? '#FE6462' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '12px',
              padding: '14px 14px 14px 40px',
              color: 'white',
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
          />
        </div>

        {error && (
          <p style={{ color: '#FE6462', fontSize: '0.8rem', textAlign: 'center', margin: 0 }}>
            Incorrect password. Try again.
          </p>
        )}

        <button
          type="submit"
          style={{
            background: '#FE6462',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '14px',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Enter
        </button>
      </form>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}

// ─── Collapsible feature list ──────────────────────────────────────────────────
function FeatureList({ items, accent, showAll = false, textColor = '#444' }: { items: string[]; accent: string; showAll?: boolean; textColor?: string }) {
  const [expanded, setExpanded] = useState(showAll);
  const preview = items.slice(0, 5);
  const rest = items.slice(5);
  const displayed = expanded ? items : preview;

  return (
    <div>
      {displayed.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
          <Check size={14} style={{ color: accent, flexShrink: 0, marginTop: '3px' }} />
          <span style={{ fontSize: '0.875rem', color: textColor, lineHeight: 1.5 }}>{item}</span>
        </div>
      ))}
      {!showAll && rest.length > 0 && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: textColor === '#444' ? '#999' : 'rgba(255,255,255,0.4)',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginTop: '8px',
            padding: 0,
          }}
        >
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          {expanded ? 'Show less' : `Show ${rest.length} more`}
        </button>
      )}
    </div>
  );
}

// ─── Main sales deck ──────────────────────────────────────────────────────────
function SalesDeck() {
  const revenueRef = useRef<HTMLSpanElement>(null);
  const photoRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (photoRef.current) {
        photoRef.current.style.transform = `translateY(${y * 0.12}px)`;
      }
      if (revenueRef.current) {
        const progress = Math.min(1, y / 300);
        const brightness = 1.4 + progress * 1.4;
        const saturate   = 1.2 + progress * 1.0;
        revenueRef.current.style.filter = `brightness(${brightness}) saturate(${saturate})`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ background: '#F5F5F5', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Top bar ── */}
      <div style={{
        background: '#0A0A0A',
        padding: '12px 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src="https://assets.cdn.filesafe.space/NYlSya2nYSkSnnXEbY2l/media/69a9af9fb003fa7bb8bb92ee.png"
              alt="RevCore"
              style={{ height: '24px', width: 'auto' }}
            />
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'white' }}>
              RevCore
            </span>
            <span style={{
              background: '#FE6462',
              color: 'white',
              fontSize: '0.65rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '100px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              Sales Team
            </span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>Internal — do not share</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <section style={{ background: '#0A0A0A', padding: '12px 12px 0' }}>
        <div style={{
          borderRadius: '24px',
          overflow: 'hidden',
          position: 'relative',
          height: '60vh',
          minHeight: '480px',
          background: '#0d1117',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Parallax background image */}
          <div ref={photoRef} style={{
            position: 'absolute', inset: '-10% 0',
            backgroundImage: `url(${HERO_PHOTO_URL})`,
            backgroundSize: 'cover', backgroundPosition: 'center top',
            willChange: 'transform',
          }} />
          {/* Base dark overlay — slightly darker per request */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }} />
          {/* Space stars */}
          <SpaceBackground opacity={0.7} />
          {/* Gradient vignette */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.75) 100%)',
            zIndex: 1,
          }} />
          {/* Film grain layer 1 */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'ns\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.68\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23ns)\'/%3E%3C/svg%3E")',
            backgroundSize: '220px 220px', opacity: 0.14, mixBlendMode: 'soft-light', pointerEvents: 'none', zIndex: 2,
          }} />
          {/* Film grain layer 2 */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'ns2\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23ns2)\'/%3E%3C/svg%3E")',
            backgroundSize: '180px 180px', opacity: 0.09, mixBlendMode: 'overlay', pointerEvents: 'none', zIndex: 3,
          }} />
          {/* Text content */}
          <div style={{ position: 'relative', zIndex: 4, textAlign: 'center', padding: '0 2rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem',
            }}>
              <span style={{ width: '24px', height: '2px', background: '#FE6462', display: 'block' }} />
              Complete Pricing Guide
              <span style={{ width: '24px', height: '2px', background: '#FE6462', display: 'block' }} />
            </div>
            <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '1.25rem' }}>
              <span className="sales-hero-line">Built to grow your</span>
              <span ref={revenueRef} className="sales-hero-accent">revenue.</span>
              <span className="sales-hero-line">Not just your leads.</span>
            </h1>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              {[
                { icon: <Zap size={13} />, label: 'Appointments guaranteed' },
                { icon: <TrendingUp size={13} />, label: 'Pay for performance' },
                { icon: <Star size={13} />, label: '1 partner per trade per market' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '100px',
                  padding: '7px 14px',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  backdropFilter: 'blur(8px)',
                }}>
                  <span style={{ color: '#FE6462' }}>{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section: Marketing Funnel ── */}
      <section style={{ padding: '96px 0 80px', background: '#F5F5F5' }}>
        <div className="container">
          <div style={{ marginBottom: '2.5rem' }}>
            <div className="section-tag">The System</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'end' }}>
              <h2 style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em',
              }}>
                How the full<br />funnel works
              </h2>
              <p style={{ color: 'var(--color-gray)', lineHeight: '1.8' }}>
                Every service connects into one system — from the first impression all the way to a booked appointment. Drag to explore, scroll to zoom.
              </p>
            </div>
          </div>
          <FunnelDiagram />
        </div>
      </section>

      {/* ── Section: SEO Analyser ── */}
      <section style={{ padding: '80px 0', background: '#070b0f' }}>
        <div className="container">
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '1rem' }}>
              <span style={{ width: '20px', height: '2px', background: '#94D96B', display: 'block' }} />
              Live Tool
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'end' }}>
              <h2 style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'white',
              }}>
                SEO Audit —<br />run it live
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.45)', lineHeight: '1.8' }}>
                Paste a client&apos;s website URL and get an instant SEO report. 14 checks across technical SEO, content, images, and social — each with a clear recommendation and why it matters.
              </p>
            </div>
          </div>
          <SEOChecker />
        </div>
      </section>

      {/* ── Section: Individual Services ── */}
      <section style={{ padding: '96px 0 80px', background: '#ffffff' }}>
        <div className="container">
          <div style={{ marginBottom: '3.5rem' }}>
            <div className="section-tag">A La Carte Services</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'end' }}>
              <h2 style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}>
                Individual services,<br />starting prices
              </h2>
              <p style={{ color: 'var(--color-gray)', lineHeight: '1.8' }}>
                Pick the services that fit your current stage. Most clients start with one or two and expand. Bundle into a package for the best rate.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {services.map((service) => (
              <div
                key={service.id}
                className="card-hover"
                style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: `1px solid ${service.accent}18`,
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 240px', minHeight: '200px' }}>
                  {/* Dark label panel */}
                  <div style={{
                    background: service.color,
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}>
                    <span style={{ fontSize: '0.68rem', color: service.accent, fontWeight: 700, letterSpacing: '0.12em', opacity: 0.7 }}>
                      {service.number}
                    </span>
                    <div>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: service.accent, marginBottom: '0.75rem' }} />
                      <h3 style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: 'white',
                        lineHeight: 1.2,
                      }}>
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description + includes */}
                  <div style={{ padding: '2rem', background: '#fafafa', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <p style={{ color: 'var(--color-gray)', lineHeight: '1.75', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                      {service.description}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                      {service.includes.map((d) => (
                        <span key={d} style={{
                          padding: '4px 12px', borderRadius: '100px',
                          background: 'white', fontSize: '0.75rem', fontWeight: 500,
                          border: `1px solid ${service.accent}30`, color: '#333',
                        }}>
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing panel */}
                  <div style={{
                    padding: '2rem',
                    background: 'white',
                    borderLeft: `3px solid ${service.accent}20`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    gap: '6px',
                  }}>
                    <p style={{ fontSize: '0.65rem', color: '#999', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                      Starting at
                    </p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                      <span style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '2.25rem',
                        fontWeight: 800,
                        color: '#0A0A0A',
                        letterSpacing: '-0.02em',
                      }}>
                        {service.startingAt}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: '#999', fontWeight: 500 }}>
                        {service.period}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: service.accent, fontWeight: 600 }}>
                      {service.note}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section: Packages ── */}
      <section style={{ padding: '96px 0', background: '#070b0f', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          pointerEvents: 'none',
        }} />
        {/* Central ambient glow */}
        <div style={{
          position: 'absolute', top: '30%', left: '50%',
          transform: 'translateX(-50%)',
          width: '900px', height: '500px',
          background: 'radial-gradient(ellipse at center, rgba(107,142,254,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '1rem',
            }}>
              <span style={{ width: '20px', height: '2px', background: '#6B8EFE', display: 'block' }} />
              Bundle Packages
              <span style={{ width: '20px', height: '2px', background: '#6B8EFE', display: 'block' }} />
            </div>
            <h2 style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: 'white',
              marginBottom: '1rem',
            }}>
              Full-stack retainer packages
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '520px', margin: '0 auto', lineHeight: '1.8' }}>
              Bundling services into a package is significantly more cost-effective than a la carte. One retainer, one point of contact, all connected.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', alignItems: 'center' }}>
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={pkg.highlight ? 'pkg-highlight' : 'card-hover-up'}
                style={{
                  borderRadius: '20px',
                  background: 'linear-gradient(160deg, #13161e 0%, #1a1e2a 50%, #13161e 100%)',
                  border: `1px solid ${pkg.accent}30`,
                  overflow: 'hidden',
                  position: 'relative',
                  transform: pkg.highlight ? 'scale(1.045)' : 'scale(1)',
                  zIndex: pkg.highlight ? 2 : 1,
                  boxShadow: pkg.highlight
                    ? `0 0 0 1px ${pkg.accent}20, 0 -8px 160px 0px ${pkg.accent}28, 0 20px 60px rgba(0,0,0,0.6)`
                    : '0 4px 24px rgba(0,0,0,0.5)',
                  transition: 'transform 0.3s ease',
                }}
              >
                {/* Colored top accent line */}
                <div style={{
                  height: '3px',
                  background: `linear-gradient(90deg, transparent 0%, ${pkg.accent} 40%, ${pkg.accent} 60%, transparent 100%)`,
                  opacity: pkg.highlight ? 1 : 0.5,
                }} />

                {pkg.highlight && (
                  <div style={{
                    position: 'absolute',
                    top: '19px',
                    right: '16px',
                    background: `linear-gradient(135deg, ${pkg.accent}ee, ${pkg.accent}99)`,
                    color: pkg.accent === '#6B8EFE' ? 'white' : '#0a0a0a',
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    padding: '4px 12px',
                    borderRadius: '100px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    boxShadow: `0 2px 12px ${pkg.accent}50`,
                  }}>
                    Most Popular
                  </div>
                )}

                {/* Header */}
                <div style={{ padding: '1.75rem 2rem 1.5rem' }}>
                  <h3 style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    color: 'white',
                    marginBottom: '0.4rem',
                  }}>
                    {pkg.name}
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    {pkg.tagline}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                    <span style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '2.75rem',
                      fontWeight: 800,
                      letterSpacing: '-0.03em',
                      color: 'white',
                    }}>
                      {pkg.price}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.28)' }}>{pkg.period}</span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: pkg.accent, fontWeight: 600 }}>
                    {pkg.note}
                  </span>
                </div>

                {/* Feature pills */}
                <div style={{ padding: '1.25rem 2rem 1.75rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.25)',
                    marginBottom: '1rem',
                  }}>
                    {pkg.id === 'revenue' ? "Includes everything, plus" : "What's included"}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                    {pkg.includes.map((feature, i) => (
                      <span
                        key={i}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: `${pkg.accent}10`,
                          border: `1px solid ${pkg.accent}22`,
                          borderRadius: '8px',
                          padding: '5px 10px',
                          fontSize: '0.775rem',
                          fontWeight: 500,
                          color: 'rgba(255,255,255,0.72)',
                          lineHeight: 1.3,
                        }}
                      >
                        <span style={{
                          width: '5px', height: '5px',
                          borderRadius: '50%',
                          background: pkg.accent,
                          flexShrink: 0,
                          boxShadow: `0 0 6px ${pkg.accent}80`,
                        }} />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div style={{ padding: '0 2rem 1.75rem' }}>
                  <button
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '100px',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: 'none',
                      background: pkg.highlight
                        ? `linear-gradient(135deg, ${pkg.accent}dd 0%, ${pkg.accent}99 100%)`
                        : `${pkg.accent}18`,
                      color: 'white',
                      transition: 'opacity 0.2s, transform 0.2s',
                      boxShadow: pkg.highlight ? `0 4px 24px ${pkg.accent}45` : 'none',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section: Software ── */}
      <section style={{ padding: '96px 0', background: '#ffffff' }}>
        <div className="container">
          <div style={{ marginBottom: '4rem' }}>
            <div className="section-tag">Proprietary Software</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'end' }}>
              <h2 style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}>
                Close more deals with<br />our sales software
              </h2>
              <p style={{ color: 'var(--color-gray)', lineHeight: '1.8' }}>
                Built in-house for home service contractors. Not generic SaaS — tools designed around the in-home sales process, your trade, and your brand.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            {softwareOptions.map((sw) => (
              <div
                key={sw.id}
                className="card-hover-up"
                style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: `1px solid ${sw.accent}20`,
                  background: 'white',
                }}
              >
                <div style={{ background: sw.color, padding: '2rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: sw.accent, marginBottom: '1rem' }} />
                  <h3 style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'white',
                    lineHeight: 1.2,
                    marginBottom: '0.75rem',
                  }}>
                    {sw.name}
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', lineHeight: '1.7' }}>
                    {sw.description}
                  </p>
                </div>

                <div style={{ padding: '1.75rem 2rem' }}>
                  {/* Pricing */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '1.75rem',
                    padding: '1.25rem',
                    background: '#F5F5F5',
                    borderRadius: '14px',
                  }}>
                    <div>
                      <p style={{ fontSize: '0.65rem', color: '#999', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                        Setup fee
                      </p>
                      <p style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '1.75rem',
                        fontWeight: 800,
                        color: '#0A0A0A',
                        letterSpacing: '-0.02em',
                      }}>
                        {sw.setup}
                      </p>
                      <p style={{ fontSize: '0.72rem', color: '#999' }}>one-time</p>
                    </div>
                    <div style={{ borderLeft: '1px solid #E5E5E5', paddingLeft: '12px' }}>
                      <p style={{ fontSize: '0.65rem', color: '#999', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                        Monthly access
                      </p>
                      <p style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '1.75rem',
                        fontWeight: 800,
                        color: '#0A0A0A',
                        letterSpacing: '-0.02em',
                      }}>
                        {sw.monthly}
                      </p>
                      <p style={{ fontSize: '0.72rem', color: '#999' }}>{sw.monthlyNote}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <FeatureList items={sw.features} accent={sw.accent} showAll />
                </div>
              </div>
            ))}
          </div>

          {/* Software bundle callout */}
          <div style={{
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #0a0f1a 0%, #0f1a10 100%)',
            padding: '2.5rem 3rem',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'center',
            gap: '2rem',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'rgba(148,217,107,0.12)',
                border: '1px solid rgba(148,217,107,0.2)',
                borderRadius: '100px',
                padding: '4px 12px',
                marginBottom: '1rem',
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94D96B' }} />
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94D96B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Bundle Deal
                </span>
              </div>
              <h3 style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '1.5rem',
                fontWeight: 800,
                color: 'white',
                marginBottom: '0.5rem',
              }}>
                Both tools together
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.45)', lineHeight: '1.7', maxWidth: '480px', fontSize: '0.9rem' }}>
                Get the Quoting Software and iPad Presentation App bundled at a reduced rate. Most clients see 20–35% higher close rates when both tools are used together.
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
                Bundle pricing
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', justifyContent: 'flex-end' }}>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '2.75rem', fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>
                  $1,997
                </span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}> setup</span>
              </div>
              <p style={{ color: '#94D96B', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                + $297/mo per seat
              </p>
              <div style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '8px 14px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'line-through' }}>
                  $2,494 setup / $344/mo
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94D96B', fontWeight: 700 }}>
                  You save $497 + $47/mo
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROI callout ── */}
      <section style={{ padding: '96px 0', background: '#0A0A0A' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem' }}>
              <span style={{ width: '24px', height: '2px', background: '#94D96B', display: 'block' }} />
              Why it works
              <span style={{ width: '24px', height: '2px', background: '#94D96B', display: 'block' }} />
            </div>
            <h2 style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              marginBottom: '1rem',
            }}>
              One system, compounding results
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '520px', margin: '0 auto', lineHeight: '1.8' }}>
              Every piece connects. More leads, more automation, better sales software, and trained reps compound into dramatically higher revenue per job.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[
              { label: 'Avg. close rate lift', value: '+34%', note: 'With software + training', color: '#FE6462' },
              { label: 'Avg. ticket increase', value: '+$2,400', note: 'With Good/Better/Best pricing', color: '#94D96B' },
              { label: 'Lead rehash recovery', value: '18%', note: 'Of old leads re-engaged', color: '#6B8EFE' },
              { label: 'Client retention', value: '91%', note: 'Stay past 12 months', color: '#FEB64A' },
            ].map((stat, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px',
                padding: '2rem',
                textAlign: 'center',
              }}>
                <p style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  color: stat.color,
                  letterSpacing: '-0.02em',
                  marginBottom: '4px',
                }}>
                  {stat.value}
                </p>
                <p style={{ color: 'white', fontWeight: 700, fontSize: '0.875rem', marginBottom: '4px' }}>
                  {stat.label}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>{stat.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA footer ── */}
      <section style={{ padding: '64px 0', background: '#F5F5F5', borderTop: '1px solid #E5E5E5' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h3 style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 800,
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em',
          }}>
            Ready to build their growth engine?
          </h3>
          <p style={{ color: 'var(--color-gray)', marginBottom: '2rem', lineHeight: '1.7' }}>
            Book them in for a strategy call or send over a proposal.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/contact" className="btn-primary" style={{ textDecoration: 'none' }}>
              Book a strategy call <ArrowRight size={15} />
            </a>
            <a href="mailto:hello@revcorehq.com" className="btn-outline" style={{ textDecoration: 'none' }}>
              Email the team
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pkg-glow-pulse {
          0%, 100% { box-shadow: 0 0 0 1px rgba(107,142,254,0.2), 0 -8px 160px 0px rgba(107,142,254,0.28), 0 20px 60px rgba(0,0,0,0.6); }
          50%       { box-shadow: 0 0 0 1px rgba(107,142,254,0.35), 0 -8px 200px 0px rgba(107,142,254,0.42), 0 20px 60px rgba(0,0,0,0.6); }
        }
        .pkg-highlight {
          animation: pkg-glow-pulse 3s ease-in-out infinite;
          transition: transform 0.3s ease;
        }
        .pkg-highlight:hover { transform: scale(1.055) !important; }
        .sales-hero-line {
          font-size: clamp(1.6rem, 3.5vw, 3rem);
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.65);
          display: block;
          line-height: 1.1;
          letter-spacing: -0.03em;
        }
        .sales-hero-accent {
          font-size: clamp(3.5rem, 9vw, 7.5rem);
          color: #FE6462;
          display: block;
          line-height: 0.92;
          letter-spacing: -0.04em;
          text-shadow: 0 0 80px rgba(254,100,98,0.32);
        }
        @media (max-width: 1024px) {
          div[style*="grid-template-columns: 280px 1fr 240px"] {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 900px) {
          div[style*="grid-template-columns: repeat(3, 1fr)"],
          div[style*="grid-template-columns: 1fr 1fr"],
          div[style*="grid-template-columns: repeat(4, 1fr)"],
          div[style*="grid-template-columns: 1fr auto"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

// ─── Page entry point ─────────────────────────────────────────────────────────
export default function SalesPage() {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  return <SalesDeck />;
}
