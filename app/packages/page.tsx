'use client';

import { useState, useMemo } from 'react';
import { Check, ChevronDown, ArrowRight, Globe, Search, Bot, Cog, Megaphone } from 'lucide-react';
import SpaceBackground from '@/components/SpaceBackground';
import GradientText from '@/components/GradientText';
import MagneticButton from '@/components/MagneticButton';
import {
  useScrollReveal,
  useCountUp,
  fadeUp,
  scaleUp,
  blurReveal,
  clipReveal,
  stagger,
} from '@/hooks/useScrollReveal';

/* ─── DATA ─── */

const howItWorksSteps = [
  { num: 1, title: 'Target', desc: 'Specific zip codes in your service area', icon: '🎯' },
  { num: 2, title: 'Attract', desc: 'Scroll-stopping ads built for your trade', icon: '⚡' },
  { num: 3, title: 'Qualify', desc: 'Only serious homeowners get through', icon: '✅' },
  { num: 4, title: 'Book', desc: 'They pick a time that works for both of you', icon: '📅' },
  { num: 5, title: 'Remind', desc: 'Auto reminders keep show rates high', icon: '🔔' },
];

const ecosystemNodes = [
  { num: '01', title: 'Website Building', sub: 'CRM | Lead Capture', color: '#6B8EFE', icon: Globe },
  { num: '02', title: 'SEO / GMB', sub: 'Local Dominance', color: '#94D96B', icon: Search },
  { num: '03', title: 'AEO', sub: 'GPT, Gemini, Alexa', color: '#FEB64A', icon: Bot },
  { num: '04', title: 'Backend Systems', sub: 'Automations', color: '#FE6462', icon: Cog },
  { num: '05', title: 'Paid Advertising', sub: 'Meta Ads', color: '#6B8EFE', icon: Megaphone },
];

const results = [
  { company: 'W&S Construction', location: 'Bellefontaine, OH', logo: 'https://storage.googleapis.com/msgsndr/XN3QKivTiLO5b0k6VrqV/media/6967c3e0264f136b6abbbd4f.png', before: '$143k', after: '$312k', metric: 'revenue/mo', increase: '+118%' },
  { company: 'Diamond Roofers', location: 'Tukwila, WA', logo: 'https://storage.googleapis.com/msgsndr/XVmgV2URJXsmrugEzlcS/media/69408e9990c8fc8a9fbb52f2.jpg', before: '3', after: '7', metric: 'jobs/mo', increase: '+133%' },
  { company: 'Plastering by Nealeigh', location: 'Greenville, OH', logo: 'https://storage.googleapis.com/msgsndr/UrIbmSbNwH6Sfvb4CBZw/media/694939147614ce923b7fa2c6.png', before: '6', after: '14', metric: 'jobs/mo', increase: '+133%' },
  { company: 'Blue Water Poolscapes', location: 'Berea, KY', logo: 'https://storage.googleapis.com/msgsndr/yHN6QY4b97yJaEcdk36w/media/696a8fb5f8c5b87bdfef6304.webp', before: '$211k', after: '$566k', metric: 'revenue/mo', increase: '+168%' },
  { company: 'Aquatic Pools', location: 'Phoenix, AZ', logo: 'https://storage.googleapis.com/msgsndr/RAmAO69TYtGlSS2rVnm9/media/6957ee1b4478a2a1a2bf8db0.png', before: '8', after: '37', metric: 'appts/mo', increase: '+362%' },
  { company: 'Thomas Solutions', location: 'Chicago, IL', logo: 'https://storage.googleapis.com/msgsndr/6zwaVBcn8pWvy1rl2vea/media/697723a9eb392b2a57739d74.png', before: '5', after: '18', metric: 'appts/mo', increase: '+260%' },
];

const packages = [
  {
    id: 'ppa',
    badge: 'Minimum Package',
    badgeStyle: 'outline' as const,
    name: 'Pay-Per-Appointment',
    description: 'Test the waters. Only pay for results.',
    price: '2,500',
    priceNote: '15 appointments ($167/appt) + ad spend',
    accent: '#FE6462',
    features: [
      '15 qualified appointments / mo',
      'Meta Ads management',
      'Lead qualification & booking',
      'Basic CRM setup',
    ],
    expandedFeatures: [
      'Automated appointment reminders',
      'SMS & email follow-up sequences',
      'Real-time lead notifications',
      'Dedicated landing page',
      'Weekly performance reports',
    ],
  },
  {
    id: 'growth',
    badge: 'Most Popular',
    badgeStyle: 'popular' as const,
    name: 'Growth Engine',
    description: 'Complete top-of-funnel system with website and SEO.',
    price: '3,497',
    priceNote: '+ ad spend (you control budget)',
    accent: '#6B8EFE',
    features: [
      '20+ Qualified Appointments per month',
      'Custom conversion-optimized website',
      'Local SEO',
      '24/7 Website chat widget',
    ],
    expandedFeatures: [
      'Top-of-funnel paid ads management',
      'Automated appointment reminders',
    ],
  },
  {
    id: 'fullscale',
    badge: 'Premium',
    badgeStyle: 'premium' as const,
    name: 'Full Scale Partner',
    description: 'Complete revenue engine with automation stack and sales optimization.',
    price: '4,997',
    priceNote: '+ 4% revenue share on closed deals',
    accent: '#94D96B',
    features: [
      'Everything in Growth Engine, plus:',
      'Google Business optimization',
      'AEO (AI Engine Optimization)',
      'Full automation stack',
      'Rehash Engine\u2122 (automated follow-up)',
    ],
    expandedFeatures: [
      'Sales training & scripts',
      'Custom sales presentation',
      'Pricing configurator & quoting software',
      'Dedicated success manager',
      '10-step sales framework',
      'Sales audit & process optimization',
      'Monthly strategy sessions',
      'Review request automation',
      'Referral program',
    ],
  },
];

const appointmentOptions = [
  { appts: 20, adSpend: 1500, daily: 50 },
  { appts: 40, adSpend: 3000, daily: 100 },
  { appts: 60, adSpend: 4500, daily: 150 },
  { appts: 80, adSpend: 6000, daily: 200 },
];

/* ─── SUB-COMPONENTS ─── */

function CountStat({ value, active, color, suffix = '', prefix = '' }: { value: number; active: boolean; color: string; suffix?: string; prefix?: string }) {
  const count = useCountUp(value, active, 2000);
  return (
    <span style={{ color, fontFamily: 'DM Sans, sans-serif', fontWeight: 800 }}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

function PackageCard({ pkg, index, inView }: { pkg: typeof packages[0]; index: number; inView: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const isPopular = pkg.badgeStyle === 'popular';

  return (
    <div
      className="card-hover-up"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${isPopular ? pkg.accent + '40' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: '24px',
        padding: '2rem',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        ...(isPopular ? { borderTop: `2px solid ${pkg.accent}`, transform: 'scale(1.02)' } : {}),
        ...scaleUp(inView, stagger(index, 100, 150)),
      }}
    >
      {/* Badge */}
      <div style={{
        display: 'inline-flex',
        alignSelf: 'flex-start',
        padding: '4px 12px',
        borderRadius: '100px',
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginBottom: '1.25rem',
        ...(isPopular
          ? { background: `${pkg.accent}20`, color: pkg.accent, border: `1px solid ${pkg.accent}30` }
          : pkg.badgeStyle === 'premium'
            ? { background: `${pkg.accent}15`, color: pkg.accent, border: `1px solid ${pkg.accent}25` }
            : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }
        ),
      }}>
        {pkg.badge}
      </div>

      {/* Name & Description */}
      <h3 style={{
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '1.5rem',
        fontWeight: 800,
        color: 'white',
        lineHeight: 1.2,
        marginBottom: '0.5rem',
      }}>
        {pkg.name}
      </h3>
      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
        {pkg.description}
      </p>

      {/* Price */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        borderRadius: '16px',
        padding: '1.25rem',
        marginBottom: '1.5rem',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.25rem', fontWeight: 600 }}>$</span>
          <span style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '2.75rem',
            fontWeight: 800,
            color: 'white',
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}>
            {pkg.price}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', marginLeft: '2px' }}>/mo</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '6px' }}>
          <strong style={{ color: 'rgba(255,255,255,0.6)' }}>{pkg.priceNote.split(')')[0]})</strong>
          {pkg.priceNote.includes(')') ? pkg.priceNote.split(')').slice(1).join(')') : ''}
        </p>
      </div>

      {/* Features */}
      <div style={{ flex: 1, marginBottom: '1.5rem' }}>
        <p style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          color: 'rgba(255,255,255,0.35)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '1rem',
        }}>
          What&apos;s Included
        </p>
        {pkg.features.map((f, fi) => (
          <div key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
            {f.includes('Everything in') ? (
              <span style={{ fontSize: '0.875rem', color: pkg.accent, fontWeight: 600, lineHeight: 1.5 }}>{f}</span>
            ) : (
              <>
                <Check size={14} style={{ color: pkg.accent, flexShrink: 0, marginTop: '3px' }} />
                <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{f}</span>
              </>
            )}
          </div>
        ))}

        {/* Expandable features */}
        {pkg.expandedFeatures.length > 0 && (
          <>
            <div style={{
              maxHeight: expanded ? '500px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
            }}>
              {pkg.expandedFeatures.map((f, fi) => (
                <div key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                  <Check size={14} style={{ color: pkg.accent, flexShrink: 0, marginTop: '3px' }} />
                  <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{f}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                background: 'none',
                border: 'none',
                color: pkg.accent,
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 0',
                marginTop: '4px',
              }}
            >
              {expanded ? 'Show less' : 'See all features'}
              <ChevronDown size={14} style={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.3s ease',
              }} />
            </button>
          </>
        )}
      </div>

      {/* CTA */}
      <a
        href="/contact"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '14px 24px',
          borderRadius: '100px',
          fontWeight: 700,
          fontSize: '0.875rem',
          textDecoration: 'none',
          transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
          ...(isPopular
            ? { background: pkg.accent, color: '#0A0A0A' }
            : { background: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1.5px solid rgba(255,255,255,0.15)' }
          ),
        }}
        onMouseEnter={(e) => {
          if (isPopular) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 12px 40px ${pkg.accent}30`;
          } else {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
            e.currentTarget.style.color = 'white';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
          if (!isPopular) {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
          }
        }}
      >
        Get Started <ArrowRight size={15} />
      </a>
    </div>
  );
}

/* ─── MAIN PAGE ─── */

export default function PackagesPage() {
  /* Scroll reveal refs */
  const { ref: heroRef, inView: heroInView } = useScrollReveal({ threshold: 0.15 });
  const { ref: howRef, inView: howInView } = useScrollReveal({ threshold: 0.08 });
  const { ref: ecoRef, inView: ecoInView } = useScrollReveal({ threshold: 0.08 });
  const { ref: resultsRef, inView: resultsInView } = useScrollReveal({ threshold: 0.06 });
  const { ref: pkgRef, inView: pkgInView } = useScrollReveal({ threshold: 0.06 });
  const { ref: calcRef, inView: calcInView } = useScrollReveal({ threshold: 0.1 });
  const { ref: exclRef, inView: exclInView } = useScrollReveal({ threshold: 0.1 });
  const { ref: ctaRef, inView: ctaInView } = useScrollReveal({ threshold: 0.15 });

  /* ROI Calculator state */
  const [calcPkg, setCalcPkg] = useState<'core' | 'full'>('core');
  const [calcAppts, setCalcAppts] = useState(0);
  const [avgJob, setAvgJob] = useState(18000);
  const [closeRate, setCloseRate] = useState(35);

  const calcResult = useMemo(() => {
    const opt = appointmentOptions[calcAppts];
    const appts = opt.appts;
    const gross = appts * (closeRate / 100) * avgJob;
    const adSpend = opt.adSpend;
    let investment: number;
    let investmentLabel: string;

    if (calcPkg === 'core') {
      investment = 3497 + adSpend;
      investmentLabel = `$3,497/mo + $${adSpend.toLocaleString()}/mo ad spend`;
    } else {
      const revShare = gross * 0.04;
      investment = 4997 + revShare + adSpend;
      investmentLabel = `$4,997/mo + 4% rev share + $${adSpend.toLocaleString()}/mo ad spend`;
    }
    const net = gross - investment;
    return {
      net,
      gross,
      appts,
      investmentLabel,
      breakdown: `${appts} appointments × ${closeRate}% close rate × $${avgJob.toLocaleString()} = $${gross.toLocaleString()} gross`,
    };
  }, [calcPkg, calcAppts, avgJob, closeRate]);

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>

      {/* ═══ HERO ═══ */}
      <section
        ref={heroRef as React.Ref<HTMLElement>}
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '140px 0 96px',
          background: '#000000',
        }}
      >
        <SpaceBackground opacity={0.6} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 30%, rgba(107,142,254,0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(254,100,98,0.12)', border: '1px solid rgba(254,100,98,0.25)',
            borderRadius: '100px', padding: '6px 16px', marginBottom: '2rem',
            ...fadeUp(heroInView),
          }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#FE6462', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              The Complete Marketing System for Contractors
            </span>
          </div>

          <h1 style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.75rem)',
            fontWeight: 800,
            color: 'white',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem',
            maxWidth: '800px',
            margin: '0 auto 1.25rem',
            ...clipReveal(heroInView, 200),
          }}>
            Stop Chasing Leads.<br />
            <GradientText style={{ display: 'inline' }}>Start Dominating Your Market.</GradientText>
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '1.1rem',
            lineHeight: 1.7,
            maxWidth: '620px',
            margin: '0 auto 2.5rem',
            ...fadeUp(heroInView, 400),
          }}>
            We build complete revenue engines for contractors &mdash; the same systems that grow businesses
            from $1M to $10M, and $10M to $50M annually.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', ...fadeUp(heroInView, 600) }}>
            <MagneticButton href="#pricing" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'white', color: '#0A0A0A',
              padding: '14px 32px', borderRadius: '100px',
              fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none',
            }}>
              See Packages <ArrowRight size={15} />
            </MagneticButton>
            <MagneticButton href="/contact" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'transparent', color: 'rgba(255,255,255,0.6)',
              padding: '13px 31px', borderRadius: '100px',
              fontWeight: 600, fontSize: '0.875rem',
              border: '1.5px solid rgba(255,255,255,0.15)',
              textDecoration: 'none',
            }}>
              Check Territory
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section
        ref={howRef as React.Ref<HTMLElement>}
        style={{ padding: '96px 0', background: '#0A0A0A' }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem', ...fadeUp(howInView) }}>
            <div className="section-tag">See It In Action</div>
            <h2 style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 800, color: 'white',
              letterSpacing: '-0.02em', lineHeight: 1.1,
              marginBottom: '1rem',
            }}>
              How We <span style={{ color: '#FE6462' }}>Fill Your Calendar</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
              Click through each step to see exactly how it works.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '16px',
          }}>
            {howItWorksSteps.map((step, i) => (
              <div
                key={step.num}
                className="card-hover-up"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '20px',
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                  ...scaleUp(howInView, stagger(i, 100, 100)),
                }}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: 'rgba(254,100,98,0.1)', border: '1px solid rgba(254,100,98,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontSize: '1.25rem',
                }}>
                  {step.icon}
                </div>
                <div style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.65rem', fontWeight: 700,
                  color: '#FE6462', letterSpacing: '0.15em',
                  textTransform: 'uppercase', marginBottom: '0.5rem',
                }}>
                  Step {step.num}
                </div>
                <h3 style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '1.1rem', fontWeight: 800,
                  color: 'white', marginBottom: '0.5rem',
                }}>
                  {step.title}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ECOSYSTEM ═══ */}
      <section
        ref={ecoRef as React.Ref<HTMLElement>}
        style={{ padding: '96px 0', background: '#000000' }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem', ...fadeUp(ecoInView) }}>
            <div className="section-tag">Complete System</div>
            <h2 style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 800, color: 'white',
              letterSpacing: '-0.02em', lineHeight: 1.1,
              marginBottom: '1rem',
            }}>
              You Can&apos;t Scale Without <span style={{ color: '#FE6462' }}>This</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>
              Running ads alone won&apos;t grow your business. SEO alone won&apos;t either.
              Contractors who scale have every piece working together as one optimized system.
            </p>
          </div>

          {/* Ecosystem grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '16px',
            marginBottom: '2rem',
          }}>
            {ecosystemNodes.map((node, i) => {
              const Icon = node.icon;
              return (
                <div
                  key={node.num}
                  className="card-hover"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${node.color}20`,
                    borderRadius: '20px',
                    padding: '2rem 1.25rem',
                    textAlign: 'center',
                    position: 'relative',
                    ...scaleUp(ecoInView, stagger(i, 200, 120)),
                  }}
                >
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: `${node.color}15`,
                    border: `1px solid ${node.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1rem',
                  }}>
                    <Icon size={20} style={{ color: node.color }} />
                  </div>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700,
                    color: node.color, letterSpacing: '0.12em',
                    opacity: 0.7,
                  }}>
                    {node.num}
                  </span>
                  <h3 style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '1rem', fontWeight: 800,
                    color: 'white', marginTop: '0.25rem', marginBottom: '0.25rem',
                  }}>
                    {node.title}
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>
                    {node.sub}
                  </p>
                </div>
              );
            })}
          </div>

          <div style={{
            textAlign: 'center',
            padding: '1.25rem 2rem',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '14px',
            ...fadeUp(ecoInView, 800),
          }}>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>
              Each system feeds the others &mdash; more visibility, more leads, better data, smarter optimization.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ RESULTS ═══ */}
      <section
        ref={resultsRef as React.Ref<HTMLElement>}
        style={{ padding: '96px 0', background: '#0A0A0A' }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem', ...fadeUp(resultsInView) }}>
            <div className="section-tag">Real Results</div>
            <h2 style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 800, color: 'white',
              letterSpacing: '-0.02em', lineHeight: 1.1,
              marginBottom: '1rem',
            }}>
              What Contractors Are <span style={{ color: '#94D96B' }}>Actually Seeing</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '550px', margin: '0 auto', lineHeight: 1.7 }}>
              These are real numbers from contractors using our system.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
          }}>
            {results.map((r, i) => (
              <div
                key={r.company}
                className="card-hover-up"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '20px',
                  padding: '1.75rem',
                  ...scaleUp(resultsInView, stagger(i, 100, 100)),
                }}
              >
                {/* Company header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.logo}
                    alt={r.company}
                    style={{
                      width: '48px', height: '48px', borderRadius: '10px',
                      objectFit: 'contain', background: 'white',
                    }}
                  />
                  <div>
                    <p style={{ fontWeight: 700, color: 'white', fontSize: '0.9rem' }}>{r.company}</p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>{r.location}</p>
                  </div>
                </div>

                {/* Before / After */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                      Before
                    </p>
                    <p style={{
                      fontFamily: 'DM Sans, sans-serif', fontSize: '1.5rem', fontWeight: 800,
                      color: 'rgba(255,255,255,0.35)', textDecoration: 'line-through', letterSpacing: '-0.02em',
                    }}>
                      {r.before}
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)' }}>{r.metric}</p>
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '1.25rem' }}>&rarr;</span>
                  <div>
                    <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                      After
                    </p>
                    <p style={{
                      fontFamily: 'DM Sans, sans-serif', fontSize: '1.5rem', fontWeight: 800,
                      color: '#FE6462', letterSpacing: '-0.02em',
                    }}>
                      {r.after}
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)' }}>{r.metric}</p>
                  </div>
                </div>

                {/* Increase badge */}
                <div style={{
                  background: 'rgba(148,217,107,0.1)',
                  border: '1px solid rgba(148,217,107,0.2)',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  textAlign: 'center',
                }}>
                  <span style={{ fontWeight: 700, color: '#94D96B', fontSize: '0.85rem' }}>{r.increase} increase</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PACKAGES ═══ */}
      <section
        ref={pkgRef as React.Ref<HTMLElement>}
        id="pricing"
        style={{
          padding: '96px 0',
          background: '#000000',
          position: 'relative',
        }}
      >
        {/* Subtle grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }} />
        {/* Glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '800px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(107,142,254,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem', ...fadeUp(pkgInView) }}>
            <div className="section-tag">Choose Your Path</div>
            <h2 style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 800, color: 'white',
              letterSpacing: '-0.02em', lineHeight: 1.1,
              marginBottom: '1rem',
            }}>
              Growth Packages Built for{' '}
              <GradientText style={{ display: 'inline' }}>Contractors</GradientText>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '550px', margin: '0 auto', lineHeight: 1.7 }}>
              Three proven systems designed to meet you where you are and take you where you want to go.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            alignItems: 'stretch',
          }}>
            {packages.map((pkg, i) => (
              <PackageCard key={pkg.id} pkg={pkg} index={i} inView={pkgInView} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ROI CALCULATOR ═══ */}
      <section
        ref={calcRef as React.Ref<HTMLElement>}
        style={{
          padding: '96px 0',
          background: 'linear-gradient(180deg, #0d0d1a 0%, #0A0A0A 100%)',
        }}
      >
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem', ...fadeUp(calcInView) }}>
            <div className="section-tag">See Your Potential</div>
            <h2 style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 800, color: 'white',
              letterSpacing: '-0.02em', lineHeight: 1.1,
              marginBottom: '1rem',
            }}>
              System <span style={{ color: '#FE6462' }}>ROI</span> Calculator
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
              Select your package and appointment volume to see your projected net revenue.
            </p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px',
            padding: '2.5rem',
            ...scaleUp(calcInView, 200),
          }}>
            {/* Package Selection */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginBottom: '10px' }}>
                Select Package
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {(['core', 'full'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCalcPkg(p)}
                    style={{
                      padding: '14px 12px',
                      borderRadius: '12px',
                      border: `2px solid ${calcPkg === p ? '#FE6462' : 'rgba(255,255,255,0.15)'}`,
                      background: calcPkg === p ? 'rgba(254,100,98,0.15)' : 'rgba(255,255,255,0.04)',
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {p === 'core' ? 'Growth Engine' : 'Full Scale Partner'}
                  </button>
                ))}
              </div>
            </div>

            {/* Appointments */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginBottom: '10px' }}>
                Appointments Per Month
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {appointmentOptions.map((opt, i) => (
                  <button
                    key={opt.appts}
                    onClick={() => setCalcAppts(i)}
                    style={{
                      padding: '14px 8px',
                      borderRadius: '12px',
                      border: `2px solid ${calcAppts === i ? '#FE6462' : 'rgba(255,255,255,0.15)'}`,
                      background: calcAppts === i ? 'rgba(254,100,98,0.15)' : 'rgba(255,255,255,0.04)',
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '1rem', fontWeight: 700 }}>{opt.appts} Appts</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                      ~${opt.adSpend.toLocaleString()}/mo ads
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Your Numbers */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginBottom: '8px' }}>
                  Average Job Value
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }}>$</span>
                  <input
                    type="number"
                    value={avgJob}
                    onChange={(e) => setAvgJob(Number(e.target.value) || 0)}
                    style={{
                      width: '100%', padding: '14px 14px 14px 30px',
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '12px', color: 'white',
                      fontSize: '1rem', fontWeight: 600, fontFamily: 'inherit',
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginBottom: '8px' }}>
                  Your Close Rate
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    value={closeRate}
                    min={1}
                    max={100}
                    onChange={(e) => setCloseRate(Math.min(100, Math.max(1, Number(e.target.value) || 1)))}
                    style={{
                      width: '100%', padding: '14px', paddingRight: '36px',
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '12px', color: 'white',
                      fontSize: '1rem', fontWeight: 600, fontFamily: 'inherit',
                    }}
                  />
                  <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }}>%</span>
                </div>
              </div>
            </div>

            {/* Result */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(254,100,98,0.12) 0%, rgba(254,100,98,0.04) 100%)',
              border: '1px solid rgba(254,100,98,0.25)',
              borderRadius: '20px',
              padding: '2rem',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                Net Monthly Revenue After Investment
              </p>
              <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 800,
                color: calcResult.net >= 0 ? '#94D96B' : '#FE6462',
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}>
                ${calcResult.net.toLocaleString()}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: '12px' }}>
                {calcResult.breakdown}
              </p>
              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                  Investment: {calcResult.investmentLabel}
                </p>
              </div>
            </div>

            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', marginTop: '1rem' }}>
              Results vary based on market, competition, and execution.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ EXCLUSIVITY ═══ */}
      <section
        ref={exclRef as React.Ref<HTMLElement>}
        style={{ padding: '96px 0', background: '#000000' }}
      >
        <div className="container">
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px',
            padding: '3.5rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            ...blurReveal(exclInView),
          }}>
            {/* Glow */}
            <div style={{
              position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)',
              width: '600px', height: '400px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(254,100,98,0.08) 0%, transparent 60%)',
              pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(254,100,98,0.12)', border: '1px solid rgba(254,100,98,0.2)',
                borderRadius: '100px', padding: '4px 14px', marginBottom: '1.5rem',
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FE6462' }} />
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#FE6462', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Market Exclusivity
                </span>
              </div>

              <h2 style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                fontWeight: 800, color: 'white',
                letterSpacing: '-0.02em', lineHeight: 1.1,
                marginBottom: '1rem',
              }}>
                While You Build, <span style={{ color: '#FE6462' }}>They Can&apos;t</span>
              </h2>
              <p style={{
                color: 'rgba(255,255,255,0.45)',
                fontSize: '1rem',
                lineHeight: 1.7,
                maxWidth: '600px',
                margin: '0 auto 2rem',
              }}>
                Your competitors can&apos;t access RevCore in your market.
                While you&apos;re building SEO authority, reactivating your database, and training your team &mdash;
                they&apos;re stuck buying shared leads. That gap only widens.
              </p>

              <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FE6462' }} />
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Claimed Territory</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#94D96B', boxShadow: '0 0 8px rgba(148,217,107,0.5)' }} />
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Still Open</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section
        ref={ctaRef as React.Ref<HTMLElement>}
        style={{
          padding: '96px 0',
          background: '#070b0f',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <SpaceBackground opacity={0.4} />

        {/* Glow orbs */}
        <div style={{
          position: 'absolute', top: '-80px', right: '15%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(254,100,98,0.1) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-100px', left: '20%',
          width: '350px', height: '350px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(107,142,254,0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        <div
          className="container"
          style={{ position: 'relative', zIndex: 1, textAlign: 'center', ...blurReveal(ctaInView) }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(148,217,107,0.12)',
            border: '1px solid rgba(148,217,107,0.25)',
            borderRadius: '100px', padding: '6px 16px',
            marginBottom: '2rem',
          }}>
            <span className="packages-cta-pulse" style={{
              width: '8px', height: '8px', borderRadius: '50%', background: '#94D96B',
              display: 'block',
            }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94D96B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Now accepting new partners
            </span>
          </div>

          <h2 style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 'clamp(1.75rem, 4vw, 3rem)',
            fontWeight: 800, color: 'white',
            lineHeight: 1.1, letterSpacing: '-0.02em',
            marginBottom: '1rem',
            maxWidth: '600px', margin: '0 auto 1rem',
          }}>
            Ready to dominate your market?
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.45)',
            fontSize: '1rem', lineHeight: '1.7',
            maxWidth: '520px', margin: '0 auto 2.5rem',
          }}>
            We take one contractor per trade per market. Once your territory is locked,
            your competition can&apos;t access this system.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <MagneticButton href="/contact" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'white', color: '#0A0A0A',
              padding: '14px 32px', borderRadius: '100px',
              fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none',
            }}>
              Check territory availability <ArrowRight size={15} />
            </MagneticButton>
            <MagneticButton
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'transparent', color: 'rgba(255,255,255,0.6)',
                padding: '13px 31px', borderRadius: '100px',
                fontWeight: 600, fontSize: '0.875rem',
                border: '1.5px solid rgba(255,255,255,0.15)',
                cursor: 'pointer',
              }}
            >
              See pricing again
            </MagneticButton>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes packagesCtaPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }
        .packages-cta-pulse {
          animation: packagesCtaPulse 2s ease-in-out infinite;
        }
        @media (max-width: 900px) {
          div[style*="grid-template-columns: repeat(5"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
