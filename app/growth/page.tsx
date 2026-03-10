'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import SpaceBackground from '@/components/SpaceBackground';
import { useScrollReveal, fadeUp, scaleUp } from '@/hooks/useScrollReveal';

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface NicheTab {
  id: string;
  label: string;
  company: string;
  location: string;
  tagline: string;
  subtext: string;
  cta: string;
  phone: string;
  domain: string;
  accent: string;
  bgColor: string;
  navItems: string[];
  services: { name: string; desc: string }[];
  stats: { label: string; value: string }[];
  trust: string[];
}

/* ─── Niche Data ─────────────────────────────────────────────────────────── */
const NICHES: NicheTab[] = [
  {
    id: 'roofing',
    label: 'Roofing',
    company: 'Summit Roofing Co.',
    location: 'Dallas, TX',
    tagline: 'Protecting DFW\nHomes Since 2009',
    subtext: 'Storm damage repairs, full replacements, and new installs. Lifetime workmanship warranty on every job.',
    cta: 'Get Your Free Inspection',
    phone: '(214) 555-0182',
    domain: 'summitroofingtx.com',
    accent: '#D95F2C',
    bgColor: '#100a06',
    navItems: ['Services', 'Gallery', 'Reviews', 'About', 'Contact'],
    services: [
      { name: 'Roof Replacement', desc: 'Full tear-off and install. All materials included.' },
      { name: 'Storm Damage Repair', desc: 'We work directly with your insurance company.' },
      { name: 'Gutter Installation', desc: 'Seamless gutters with lifetime clog warranty.' },
    ],
    stats: [{ value: '4,800+', label: 'Roofs Installed' }, { value: 'A+', label: 'BBB Rating' }, { value: 'Lifetime', label: 'Warranty' }, { value: '4.9★', label: '312 Reviews' }],
    trust: ['Licensed & Insured', 'BBB Accredited', 'GAF Certified', '5-Year Labor Warranty'],
  },
  {
    id: 'remodeling',
    label: 'Remodeling',
    company: 'Keystone Interiors',
    location: 'Nashville, TN',
    tagline: 'Where Design Meets\nCraftsmanship',
    subtext: 'Kitchen, bath, and whole-home renovations built around the way your family lives. No shortcuts.',
    cta: 'Book a Free Design Consult',
    phone: '(615) 555-0287',
    domain: 'keystoneinteriors.com',
    accent: '#B8825A',
    bgColor: '#0f0c07',
    navItems: ['Services', 'Portfolio', 'Process', 'Reviews', 'Contact'],
    services: [
      { name: 'Kitchen Remodeling', desc: 'Custom cabinets, countertops, layout redesign.' },
      { name: 'Bathroom Renovation', desc: 'Full gut-and-rebuild or targeted upgrades.' },
      { name: 'Whole-Home Remodel', desc: 'Coordinated multi-room transformations.' },
    ],
    stats: [{ value: '12+', label: 'Years Experience' }, { value: '340+', label: 'Projects Done' }, { value: '5★', label: 'Houzz Rating' }, { value: '$0', label: 'Down to Start' }],
    trust: ['Licensed Contractor', 'NKBA Member', 'Houzz Pro', 'Insured & Bonded'],
  },
  {
    id: 'windows',
    label: 'Windows',
    company: 'ClearView Windows',
    location: 'Charlotte, NC',
    tagline: 'Windows That Pay\nFor Themselves',
    subtext: 'Triple-pane, energy-rated windows installed in one day. Average 30% reduction on energy bills guaranteed.',
    cta: 'Get a Free Energy Audit',
    phone: '(704) 555-0391',
    domain: 'clearviewwindowsnc.com',
    accent: '#3A80C9',
    bgColor: '#060c14',
    navItems: ['Products', 'Gallery', 'Energy Savings', 'Financing', 'Contact'],
    services: [
      { name: 'Window Replacement', desc: 'Triple-pane, ENERGY STAR rated. One-day install.' },
      { name: 'Patio & Entry Doors', desc: 'Impact-resistant, custom-framed door systems.' },
      { name: 'Free Energy Audit', desc: 'We identify exactly where your home is losing heat.' },
    ],
    stats: [{ value: '30%', label: 'Energy Savings' }, { value: '500+', label: 'Homes Done' }, { value: '1-Day', label: 'Install' }, { value: 'Triple', label: 'Pane Glass' }],
    trust: ['ENERGY STAR Partner', 'Licensed & Insured', 'Financing Available', '10-Year Warranty'],
  },
  {
    id: 'pool',
    label: 'Pool & Landscape',
    company: 'Meridian Outdoor Living',
    location: 'Scottsdale, AZ',
    tagline: 'Your Backyard.\nTransformed.',
    subtext: 'Custom pool design, outdoor kitchens, and full landscape architecture. From concept to your first swim.',
    cta: 'Start Your Project',
    phone: '(602) 555-0514',
    domain: 'meridianoutdoorliving.com',
    accent: '#26B87A',
    bgColor: '#05100a',
    navItems: ['Pools', 'Landscaping', 'Gallery', 'Financing', 'Contact'],
    services: [
      { name: 'Custom Pool Design', desc: 'Fully engineered, built to your lot and lifestyle.' },
      { name: 'Outdoor Kitchens', desc: 'Gas grills, pizza ovens, bars, and shade structures.' },
      { name: 'Landscape Architecture', desc: 'Planting, lighting, turf, and hardscape design.' },
    ],
    stats: [{ value: '200+', label: 'Pools Built' }, { value: 'Award', label: 'Winning Design' }, { value: '15+', label: 'Years Exp.' }, { value: '4.8★', label: 'Google' }],
    trust: ['ROC Licensed', 'Fully Insured', 'APSP Member', 'Financing Available'],
  },
];

/* ─── GMB Section ────────────────────────────────────────────────────────── */
function GmbSection() {
  const { ref, inView } = useScrollReveal({ threshold: 0.12 });

  const checkItems = [
    'Google Business Profile optimization',
    'Photo and post strategy',
    'Review generation system',
    'Local rank tracking',
    'Citation building',
  ];

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      style={{ padding: '6rem clamp(1.5rem, 6vw, 6rem)', background: '#070b0f', position: 'relative', overflow: 'hidden' }}
    >
      {/* Subtle background glow */}
      <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(ellipse, rgba(107,142,254,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
        {/* Left: Copy */}
        <div style={fadeUp(inView, 0)}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '5px 14px', borderRadius: '100px', background: 'rgba(107,142,254,0.08)', border: '1px solid rgba(107,142,254,0.2)', marginBottom: '1.5rem' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#6B8EFE' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6B8EFE', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Google Business Profile</span>
          </div>
          <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: 'white', lineHeight: 1.12, letterSpacing: '-0.025em', marginBottom: '1.25rem' }}>
            Own Your Neighborhood<br />on Google
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', lineHeight: '1.8', marginBottom: '2rem', fontSize: '1rem' }}>
            When a homeowner searches for a contractor in your area, we make sure your business shows up at the top, with great reviews and a profile that converts.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '14px' }}>
            {checkItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', ...fadeUp(inView, 100 + i * 80) }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '7px', background: 'rgba(107,142,254,0.12)', border: '1px solid rgba(107,142,254,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1.5 4L3.8 6.3L8.5 1.5" stroke="#6B8EFE" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Google Local Card Mock */}
        <div style={{ ...scaleUp(inView, 200), position: 'relative' }}>
          {/* Glow behind card */}
          <div style={{ position: 'absolute', inset: '-30px', background: 'radial-gradient(ellipse, rgba(107,142,254,0.08) 0%, transparent 70%)', pointerEvents: 'none', borderRadius: '50%' }} />
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
            fontFamily: 'Arial, sans-serif',
            position: 'relative',
          }}>
            {/* Google search bar */}
            <div style={{ background: '#f8f9fa', borderBottom: '1px solid #e8eaed', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#9aa0a6" strokeWidth="2" />
                <path d="M20 20L17 17" stroke="#9aa0a6" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: '13px', color: '#3c4043', flex: 1 }}>roofing contractor dallas tx</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#4285f4" />
              </svg>
            </div>

            {/* Business Panel Header */}
            <div style={{ background: '#fff', padding: '14px 16px', borderBottom: '1px solid #e8eaed' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: '#202124', lineHeight: 1.2, marginBottom: '2px' }}>Summit Roofing Co.</div>
                  <div style={{ fontSize: '12px', color: '#70757a' }}>Roofing Contractor in Dallas, TX</div>
                </div>
                <div style={{ background: '#4285f4', color: 'white', fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '4px', whiteSpace: 'nowrap' as const }}>
                  Open
                </div>
              </div>
              {/* Stars */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#202124' }}>4.9</span>
                <div style={{ display: 'flex', gap: '1px' }}>
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill="#fbbc04">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <span style={{ fontSize: '12px', color: '#70757a' }}>312 reviews</span>
              </div>
            </div>

            {/* Real Dallas TX map */}
            <div style={{ height: '110px', position: 'relative', overflow: 'hidden' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d53733.27!2d-96.79699!3d32.77667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1741600000000!5m2!1sen!2sus"
                width="100%"
                height="110"
                style={{ border: 'none', display: 'block', filter: 'grayscale(0.15)' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Dallas TX map"
              />
              {/* Red pin overlay centered on Dallas */}
              <div style={{ position: 'absolute', top: '38%', left: '50%', transform: 'translate(-50%, -100%)', pointerEvents: 'none', filter: 'drop-shadow(0 3px 6px rgba(234,67,53,0.5))' }}>
                <svg width="22" height="28" viewBox="0 0 24 32" fill="none">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 20 12 20s12-11 12-20C24 5.37 18.63 0 12 0z" fill="#ea4335" />
                  <circle cx="12" cy="12" r="5" fill="white" />
                </svg>
              </div>
            </div>

            {/* Details */}
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#3c4043' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#5f6368" strokeWidth="1.5" />
                  <path d="M12 7v5l3 3" stroke="#5f6368" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span><span style={{ color: '#188038', fontWeight: 500 }}>Open</span> · Closes 6 PM</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#3c4043' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="#5f6368" />
                </svg>
                <span>(214) 555-0182</span>
              </div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                <button style={{ flex: 1, padding: '7px', background: '#e8f0fe', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 600, color: '#1a73e8', cursor: 'pointer' }}>Directions</button>
                <button style={{ flex: 1, padding: '7px', background: '#e8f0fe', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 600, color: '#1a73e8', cursor: 'pointer' }}>Call</button>
                <button style={{ flex: 1, padding: '7px', background: '#e8f0fe', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 600, color: '#1a73e8', cursor: 'pointer' }}>Website</button>
              </div>
            </div>
          </div>

          {/* "Ranked #1" badge */}
          <div style={{ position: 'absolute', top: '-14px', right: '-14px', background: 'linear-gradient(135deg, #6B8EFE, #4a6dea)', color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '6px 14px', borderRadius: '100px', boxShadow: '0 4px 16px rgba(107,142,254,0.35)', letterSpacing: '0.05em' }}>
            #1 LOCAL RANK
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Website Section ────────────────────────────────────────────────────── */
function WebsiteSection() {
  const { ref, inView } = useScrollReveal({ threshold: 0.1 });

  const features = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#FE6462" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Lightning Fast',
      desc: 'Sub-1 second load times. Every millisecond counts when a homeowner is comparing contractors on mobile.',
      accent: '#FE6462',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="#6B8EFE" strokeWidth="1.8" />
          <path d="M20 20L17 17" stroke="#6B8EFE" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ),
      title: 'Local SEO Baked In',
      desc: 'Schema markup, city landing pages, and keyword architecture built for local search dominance from day one.',
      accent: '#6B8EFE',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="5" y="2" width="14" height="20" rx="2" stroke="#94D96B" strokeWidth="1.8" />
          <path d="M12 18h.01" stroke="#94D96B" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      title: 'Mobile-First Design',
      desc: 'Over 70% of home service searches happen on mobile. We design for thumbs, not desktop mice.',
      accent: '#94D96B',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="#FE6462" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ),
      title: 'Call & Form Tracking',
      desc: 'Know exactly which page, ad, or keyword drove every call. ROI tracking baked into every lead.',
      accent: '#FE6462',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#6B8EFE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Review Widget',
      desc: 'Your Google and Facebook reviews display live on your site, building social proof with every visitor.',
      accent: '#6B8EFE',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#94D96B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'ADA Compliant',
      desc: 'WCAG 2.1 AA accessibility standards met out of the box. Broader reach, zero compliance risk.',
      accent: '#94D96B',
    },
  ];

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      style={{ padding: '6rem clamp(1.5rem, 6vw, 6rem)', background: '#080c10', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', top: '50%', right: '-5%', transform: 'translateY(-50%)', width: '500px', height: '500px', background: 'radial-gradient(ellipse, rgba(254,100,98,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem', ...fadeUp(inView, 0) }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '5px 14px', borderRadius: '100px', background: 'rgba(254,100,98,0.08)', border: '1px solid rgba(254,100,98,0.2)', marginBottom: '1.5rem' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#FE6462' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#FE6462', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Website Design</span>
          </div>
          <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: 'white', lineHeight: 1.12, letterSpacing: '-0.025em', marginBottom: '1rem' }}>
            Sites Built to Convert,<br />Not Just Look Good
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', lineHeight: '1.8', maxWidth: '600px', margin: '0 auto', fontSize: '1rem' }}>
            Every page is engineered to turn visitors into booked appointments. Beauty and performance, not either/or.
          </p>
        </div>

        {/* Feature grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
          {features.map((feat, i) => (
            <div
              key={feat.title}
              style={{
                padding: '1.75rem',
                borderRadius: '16px',
                background: `${feat.accent}06`,
                border: `1px solid ${feat.accent}16`,
                transition: 'transform 0.28s cubic-bezier(0.22,1,0.36,1), box-shadow 0.28s ease, background 0.28s ease',
                cursor: 'default',
                ...scaleUp(inView, 100 + i * 60),
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = `0 16px 40px ${feat.accent}18`;
                e.currentTarget.style.background = `${feat.accent}10`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = `${feat.accent}06`;
              }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '11px', background: `${feat.accent}14`, border: `1px solid ${feat.accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                {feat.icon}
              </div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'white', marginBottom: '0.5rem' }}>
                {feat.title}
              </div>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.42)', lineHeight: '1.65', margin: 0 }}>
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Browser Mockup ─────────────────────────────────────────────────────── */
function BrowserMockup({ niche, visible }: { niche: NicheTab; visible: boolean }) {
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0px)' : 'translateY(20px)',
      transition: 'opacity 0.45s cubic-bezier(0.22,1,0.36,1), transform 0.45s cubic-bezier(0.22,1,0.36,1)',
      position: visible ? 'relative' : 'absolute',
      top: 0, left: 0, right: 0,
      pointerEvents: visible ? 'auto' : 'none',
    }}>
      <div style={{ borderRadius: '14px', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.06)', background: '#1a1d24' }}>

        {/* Browser chrome */}
        <div style={{ background: '#1e2128', padding: '9px 14px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
            <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#28c840' }} />
          </div>
          <div style={{ flex: 1, background: '#13161c', borderRadius: '6px', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '7px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="rgba(148,217,107,0.55)" /></svg>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{niche.domain}</span>
          </div>
        </div>

        {/* Website content */}
        <div style={{ background: niche.bgColor, fontFamily: 'system-ui, -apple-system, sans-serif', userSelect: 'none' }}>

          {/* Top announcement bar */}
          <div style={{ background: niche.accent, padding: '5px 20px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: 'white', fontWeight: 600 }}>Serving {niche.location} & Surrounding Areas · Free Estimates · Call {niche.phone}</span>
          </div>

          {/* Nav */}
          <div style={{ padding: '11px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${niche.accent}1a`, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Logo placeholder */}
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: niche.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontWeight: 900, fontSize: '13px' }}>{niche.company[0]}</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: '13px', color: 'white', letterSpacing: '-0.02em' }}>{niche.company}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {niche.navItems.map(item => (
                <span key={item} style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 500, cursor: 'pointer' }}>{item}</span>
              ))}
              <button style={{ background: niche.accent, color: 'white', border: 'none', borderRadius: '100px', padding: '5px 12px', fontSize: '9px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>{niche.cta}</button>
            </div>
          </div>

          {/* Hero — split: text left, image placeholder right */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '180px', position: 'relative', overflow: 'hidden' }}>
            {/* Left: text */}
            <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: `linear-gradient(135deg, ${niche.bgColor} 0%, ${niche.accent}14 100%)`, position: 'relative', zIndex: 1 }}>
              {/* Review stars */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
                {[1,2,3,4,5].map(i => <svg key={i} width="9" height="9" viewBox="0 0 24 24" fill={niche.accent}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
                <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.45)', marginLeft: '3px' }}>4.9 · 312 reviews</span>
              </div>
              <h1 style={{ fontWeight: 900, fontSize: '22px', color: 'white', lineHeight: 1.1, letterSpacing: '-0.025em', margin: '0 0 10px', whiteSpace: 'pre-line' }}>{niche.tagline}</h1>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: '0 0 16px', maxWidth: '260px' }}>{niche.subtext}</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ background: niche.accent, color: 'white', border: 'none', borderRadius: '100px', padding: '8px 16px', fontSize: '10px', fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 14px ${niche.accent}45` }}>{niche.cta}</button>
                <button style={{ background: 'transparent', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '100px', padding: '8px 14px', fontSize: '10px', fontWeight: 600, cursor: 'pointer' }}>See Our Work</button>
              </div>
            </div>
            {/* Right: image placeholder */}
            <div style={{ background: `linear-gradient(145deg, ${niche.accent}22 0%, ${niche.accent}08 50%, ${niche.bgColor} 100%)`, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 60% 40%, ${niche.accent}25 0%, transparent 65%)` }} />
              {/* Photo grid placeholder */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', padding: '16px', width: '100%', position: 'relative', zIndex: 1 }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ height: i === 1 ? '88px' : '50px', borderRadius: '8px', background: `${niche.accent}${i === 1 ? '28' : '18'}`, border: `1px solid ${niche.accent}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', gridColumn: i === 1 ? '1 / -1' : 'auto' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" opacity="0.3"><rect x="3" y="3" width="18" height="18" rx="2" stroke="white" strokeWidth="1.5"/><circle cx="8.5" cy="8.5" r="1.5" fill="white"/><path d="M21 15l-5-5L5 21" stroke="white" strokeWidth="1.5"/></svg>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div style={{ background: 'rgba(0,0,0,0.5)', borderTop: `1px solid ${niche.accent}20`, borderBottom: `1px solid ${niche.accent}20`, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
            {niche.stats.map((stat, i) => (
              <div key={i} style={{ padding: '12px 10px', textAlign: 'center', borderRight: i < 3 ? `1px solid ${niche.accent}14` : 'none' }}>
                <div style={{ fontWeight: 800, fontSize: '14px', color: niche.accent, lineHeight: 1, marginBottom: '2px' }}>{stat.value}</div>
                <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.38)', letterSpacing: '0.04em' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Services section */}
          <div style={{ padding: '20px 24px', background: 'rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: '12px' }}>Our Services</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
              {niche.services.map((svc, i) => (
                <div key={i} style={{ padding: '12px', borderRadius: '10px', background: `${niche.accent}0d`, border: `1px solid ${niche.accent}1a` }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '5px', background: `${niche.accent}25`, marginBottom: '7px' }} />
                  <div style={{ fontWeight: 700, fontSize: '10px', color: 'white', marginBottom: '4px' }}>{svc.name}</div>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.5 }}>{svc.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust / certifications bar */}
          <div style={{ padding: '10px 24px', background: 'rgba(0,0,0,0.35)', borderTop: `1px solid ${niche.accent}12`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              {niche.trust.map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <svg width="7" height="7" viewBox="0 0 24 24" fill={niche.accent}><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                  <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.38)', fontWeight: 500 }}>{t}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '100px', background: 'rgba(254,100,98,0.08)', border: '1px solid rgba(254,100,98,0.18)' }}>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#FE6462', display: 'inline-block' }} />
              <span style={{ fontSize: '8px', color: 'rgba(254,100,98,0.75)', fontWeight: 700, letterSpacing: '0.06em' }}>BUILT BY REVCORE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Live iframe tab ────────────────────────────────────────────────────── */
const LIVE_SITES = [
  { id: 'aquatic', label: '✦ Live Site', domain: 'aquaticpoolaz.com', url: 'https://www.aquaticpoolaz.com', accent: '#2ECC8A' },
];

function LiveSiteMockup({ site, visible }: { site: typeof LIVE_SITES[0]; visible: boolean }) {
  const [blocked, setBlocked] = useState(false);
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.45s cubic-bezier(0.22,1,0.36,1), transform 0.45s cubic-bezier(0.22,1,0.36,1)',
      position: visible ? 'relative' : 'absolute',
      top: 0, left: 0, right: 0,
      pointerEvents: visible ? 'auto' : 'none',
    }}>
      <div style={{ borderRadius: '14px', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.06)', background: '#1a1d24' }}>
        {/* Chrome */}
        <div style={{ background: '#1e2128', padding: '9px 14px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
            <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#28c840' }} />
          </div>
          <div style={{ flex: 1, background: '#13161c', borderRadius: '6px', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '7px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="rgba(148,217,107,0.55)" /></svg>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{site.domain}</span>
          </div>
          <a href={site.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0, padding: '3px 8px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
          >Open ↗</a>
        </div>

        {/* iframe or fallback */}
        {!blocked ? (
          <div style={{ position: 'relative', height: '620px', overflow: 'hidden', background: '#fff' }}>
            <iframe
              src={site.url}
              title={site.domain}
              onError={() => setBlocked(true)}
              style={{
                border: 'none',
                width: '1440px',
                height: '900px',
                transform: 'scale(0.72)',
                transformOrigin: 'top left',
                pointerEvents: 'auto',
              }}
            />
          </div>
        ) : (
          <div style={{ height: '500px', background: '#0d1117', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '2rem' }}>🔒</div>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', textAlign: 'center', maxWidth: '320px', lineHeight: 1.6 }}>
              This site has iframe embedding disabled. Visit it directly to see the full experience.
            </p>
            <a href={site.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 22px', borderRadius: '100px', background: `${site.accent}18`, border: `1px solid ${site.accent}40`, color: site.accent, fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>
              Visit {site.domain} ↗
            </a>
          </div>
        )}

        {/* Footer bar */}
        <div style={{ background: '#13161c', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)' }}>Live preview — content loads from {site.domain}</span>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '100px', background: 'rgba(254,100,98,0.08)', border: '1px solid rgba(254,100,98,0.18)' }}>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#FE6462', display: 'inline-block' }} />
            <span style={{ fontSize: '8px', color: 'rgba(254,100,98,0.75)', fontWeight: 700, letterSpacing: '0.06em' }}>REVCORE CLIENT</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Portfolio Section ──────────────────────────────────────────────────── */
function PortfolioSection() {
  const { ref, inView } = useScrollReveal({ threshold: 0.1 });
  // 0 = first live site, 1+ = niche mockups (offset by LIVE_SITES.length)
  const [activeTab, setActiveTab] = useState(0);
  const totalLive = LIVE_SITES.length;

  return (
    <section
      id="portfolio"
      ref={ref as React.Ref<HTMLElement>}
      style={{ padding: '6rem clamp(1.5rem, 6vw, 6rem)', background: '#070b0f', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '400px', background: 'radial-gradient(ellipse, rgba(107,142,254,0.03) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem', ...fadeUp(inView, 0) }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '5px 14px', borderRadius: '100px', background: 'rgba(148,217,107,0.08)', border: '1px solid rgba(148,217,107,0.2)', marginBottom: '1.5rem' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#94D96B' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94D96B', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Portfolio</span>
          </div>
          <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: 'white', lineHeight: 1.12, letterSpacing: '-0.025em', marginBottom: '1rem' }}>
            See What We Build
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', lineHeight: '1.8', maxWidth: '560px', margin: '0 auto', fontSize: '1rem' }}>
            Every site is custom-designed for your brand, your market, and your customers.
          </p>
        </div>

        {/* Tab nav */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '2.5rem', flexWrap: 'wrap' as const, ...fadeUp(inView, 150) }}>
          {/* Live site tabs first */}
          {LIVE_SITES.map((site, i) => (
            <button key={site.id} onClick={() => setActiveTab(i)} style={{
              padding: '8px 22px', borderRadius: '100px',
              border: activeTab === i ? `1px solid ${site.accent}70` : '1px solid rgba(255,255,255,0.12)',
              background: activeTab === i ? `${site.accent}18` : 'rgba(255,255,255,0.05)',
              color: activeTab === i ? site.accent : 'rgba(255,255,255,0.55)',
              fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
            }}>
              {site.label}
            </button>
          ))}
          {/* Mockup tabs */}
          {NICHES.map((niche, i) => (
            <button key={niche.id} onClick={() => setActiveTab(totalLive + i)} style={{
              padding: '8px 22px', borderRadius: '100px',
              border: activeTab === totalLive + i ? `1px solid ${niche.accent}60` : '1px solid rgba(255,255,255,0.1)',
              background: activeTab === totalLive + i ? `${niche.accent}14` : 'rgba(255,255,255,0.04)',
              color: activeTab === totalLive + i ? niche.accent : 'rgba(255,255,255,0.5)',
              fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
            }}>
              {niche.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ position: 'relative', ...scaleUp(inView, 250) }}>
          {LIVE_SITES.map((site, i) => (
            <LiveSiteMockup key={site.id} site={site} visible={activeTab === i} />
          ))}
          {NICHES.map((niche, i) => (
            <BrowserMockup key={niche.id} niche={niche} visible={activeTab === totalLive + i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Growth CTA ─────────────────────────────────────────────────────────── */
function GrowthCTA() {
  const { ref, inView } = useScrollReveal({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      style={{ padding: '8rem clamp(1.5rem, 6vw, 6rem)', background: '#070b0f', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
    >
      <SpaceBackground />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '900px', height: '500px', background: 'radial-gradient(ellipse, rgba(107,142,254,0.05) 0%, rgba(254,100,98,0.02) 45%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '640px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ ...fadeUp(inView, 0), marginBottom: '1.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '5px 16px', borderRadius: '100px', background: 'rgba(254,100,98,0.08)', border: '1px solid rgba(254,100,98,0.22)', color: '#FE6462', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#FE6462', boxShadow: '0 0 8px #FE6462', animation: 'growthCtaDot 2s ease-in-out infinite', display: 'inline-block' }} />
            Get Started
          </span>
        </div>

        <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'white', lineHeight: 1.12, letterSpacing: '-0.025em', marginBottom: '1.25rem', ...fadeUp(inView, 150) }}>
          Ready to Dominate Your Local Market?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.42)', lineHeight: '1.8', marginBottom: '3rem', ...fadeUp(inView, 300) }}>
          We build your website, optimize your Google presence, and set up a review generation system that keeps filling your pipeline.
        </p>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' as const, ...fadeUp(inView, 450) }}>
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ position: 'absolute', inset: '-8px', borderRadius: '100px', border: '1px solid rgba(254,100,98,0.4)', animation: 'growthBtnPulse 2.6s ease-out infinite', pointerEvents: 'none' }} />
            <span style={{ position: 'absolute', inset: '-8px', borderRadius: '100px', border: '1px solid rgba(254,100,98,0.2)', animation: 'growthBtnPulse 2.6s ease-out 1s infinite', pointerEvents: 'none' }} />
            <Link
              href="/contact"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'linear-gradient(135deg, #FE6462 0%, #e84f4d 100%)', color: 'white', padding: '15px 30px', borderRadius: '100px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', boxShadow: '0 0 28px rgba(254,100,98,0.22), 0 4px 16px rgba(254,100,98,0.14)', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(254,100,98,0.32), 0 8px 24px rgba(254,100,98,0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 28px rgba(254,100,98,0.22), 0 4px 16px rgba(254,100,98,0.14)'; }}
            >
              Book a Call
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Growth Hero ────────────────────────────────────────────────────────── */
function GrowthHero() {
  const { ref, inView } = useScrollReveal({ threshold: 0.05 });

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      style={{ background: '#070b0f', paddingTop: '80px', position: 'relative', overflow: 'hidden', minHeight: '92vh', display: 'flex', alignItems: 'center' }}
    >
      <SpaceBackground />

      {/* Radial glow */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '900px', height: '600px', background: 'radial-gradient(ellipse, rgba(107,142,254,0.06) 0%, rgba(254,100,98,0.02) 40%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '6rem clamp(1.5rem, 6vw, 6rem)', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {/* Badge */}
        <div style={{ ...fadeUp(inView, 0), marginBottom: '2rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', borderRadius: '100px', background: 'rgba(107,142,254,0.08)', border: '1px solid rgba(107,142,254,0.22)', color: '#6B8EFE', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#6B8EFE', boxShadow: '0 0 8px #6B8EFE', animation: 'growthHeroDot 2s ease-in-out infinite', display: 'inline-block' }} />
            Website Design + GMB Optimization
          </span>
        </div>

        {/* H1 */}
        <h1
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 'clamp(2.6rem, 6vw, 5rem)',
            fontWeight: 800,
            color: 'white',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem',
            backgroundImage: 'linear-gradient(135deg, #ffffff 30%, rgba(107,142,254,0.85) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            ...fadeUp(inView, 150),
          }}
        >
          Turn Local Searches<br />Into Signed Contracts
        </h1>

        {/* Subtitle */}
        <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', color: 'rgba(255,255,255,0.5)', lineHeight: '1.8', maxWidth: '640px', margin: '0 auto 2.5rem', ...fadeUp(inView, 300) }}>
          A high-performance website and a fully optimized Google presence that puts you in front of local homeowners, day one.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' as const, ...fadeUp(inView, 450) }}>
          <a
            href="#portfolio"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(107,142,254,0.12)', color: '#6B8EFE', border: '1px solid rgba(107,142,254,0.35)', padding: '14px 28px', borderRadius: '100px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', transition: 'all 0.2s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(107,142,254,0.2)'; e.currentTarget.style.borderColor = 'rgba(107,142,254,0.6)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(107,142,254,0.12)'; e.currentTarget.style.borderColor = 'rgba(107,142,254,0.35)'; }}
          >
            See Our Work
          </a>
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ position: 'absolute', inset: '-8px', borderRadius: '100px', border: '1px solid rgba(254,100,98,0.4)', animation: 'growthBtnPulse 2.6s ease-out infinite', pointerEvents: 'none' }} />
            <Link
              href="/contact"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #FE6462 0%, #e84f4d 100%)', color: 'white', padding: '14px 28px', borderRadius: '100px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', boxShadow: '0 4px 20px rgba(254,100,98,0.25)', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(254,100,98,0.35)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(254,100,98,0.25)'; }}
            >
              Book a Call
            </Link>
          </div>
        </div>

        {/* Trust signals */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', marginTop: '4rem', flexWrap: 'wrap' as const, ...fadeUp(inView, 600) }}>
          {[
            { value: '50+', label: 'Sites Launched' },
            { value: '#1', label: 'Local Rankings Achieved' },
            { value: '4.9★', label: 'Avg. Client Rating' },
          ].map((stat) => (
            <div key={stat.value} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '1.4rem', color: 'white', lineHeight: 1.1 }}>{stat.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginTop: '3px', letterSpacing: '0.03em' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function GrowthPage() {
  return (
    <>
      <GrowthHero />
      <GmbSection />
      <WebsiteSection />
      <PortfolioSection />
      <GrowthCTA />

      <style>{`
        @keyframes growthHeroDot {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px #6B8EFE; }
          50%       { opacity: 0.5; box-shadow: 0 0 14px #6B8EFE; }
        }
        @keyframes growthCtaDot {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px #FE6462; }
          50%       { opacity: 0.5; box-shadow: 0 0 14px #FE6462; }
        }
        @keyframes growthBtnPulse {
          0%   { opacity: 0.7; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.9); }
        }
        @media (max-width: 900px) {
          .gmb-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
