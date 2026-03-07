'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useScrollReveal, fadeUp, slideFromLeft, slideFromRight } from '@/hooks/useScrollReveal';
import SpaceBackground from '@/components/SpaceBackground';
import AnimatedText from '@/components/AnimatedText';

const services = [
  {
    id: 'leads',
    number: '01',
    title: 'Lead Generation',
    description: 'We build and run paid ad campaigns on Google, Meta, and YouTube, hyper-targeted to homeowners in your service area. Every dollar tracked, every lead routed directly into your CRM.',
    deliverables: ['Google Ads Management', 'Meta & Instagram Ads', 'Geo-targeted Campaigns', 'Landing Page Build', 'Lead Tracking & Reporting'],
    color: '#1a0a0a',
    accent: '#FE6462',
  },
  {
    id: 'organic',
    number: '02',
    title: 'Organic Growth & SEO',
    description: 'Long-term visibility that compounds over time. We handle local SEO, Google Business optimization, and content strategy so homeowners find you before they find your competitors.',
    deliverables: ['Local SEO Audit', 'Google Business Profile', 'Keyword Strategy', 'Content Planning', 'Review Generation'],
    color: '#0a0f1a',
    accent: '#6B8EFE',
  },
  {
    id: 'automation',
    number: '03',
    title: 'Proprietary Automation',
    description: 'From quote follow-ups to review requests to rehash campaigns on old leads, our automation engine runs 24/7 without your team touching anything. Built specifically for home service sales cycles.',
    deliverables: ['Follow-Up Sequences', 'Rehash Engine', 'Review Request Automation', 'Appointment Reminders', 'Lead Nurture Flows'],
    color: '#0a1a0a',
    accent: '#94D96B',
  },
  {
    id: 'training',
    number: '04',
    title: 'In-Home Sales Training',
    description: 'We train your reps in the field, scripts, objection handling, how to present options, and how to close at the kitchen table. Paired with our software, your team closes more, at higher tickets.',
    deliverables: ['In-Home Sales Scripts', 'Objection Handling', 'Good / Better / Best Pricing', 'Role-Play Sessions', 'Performance Tracking'],
    color: '#1a150a',
    accent: '#FEB64A',
  },
  {
    id: 'software',
    number: '05',
    title: 'Proprietary Sales Software',
    description: 'Two tools built in-house: a quoting platform that generates proposals on-site and tracks every job, and a custom iPad presentation that builds trust and collects e-signatures before you leave the driveway.',
    deliverables: ['Quoting Software', 'iPad Presentation App', 'E-Signature Collection', 'Job Pipeline Tracking', 'Automated Follow-Up'],
    color: '#0f1a10',
    accent: '#94D96B',
  },
  {
    id: 'crm',
    number: '06',
    title: 'CRM & Reporting',
    description: 'Your centralized command center. Website leads, paid ads, follow-up sequences, and your rehash engine all route into one clean CRM. Instead of 3–4 platforms, you have one dashboard that shows you every lead, every touchpoint, and every dollar.',
    deliverables: ['Custom CRM Build', 'Pipeline Configuration', 'Lead Source Tracking', 'Revenue Reporting', 'Team Access & Roles'],
    color: '#1a1a0a',
    accent: '#FEB64A',
  },
];

function ServiceCard({ service, inView, index }: { service: typeof services[0]; inView: boolean; index: number }) {
  const isEven = index % 2 === 0;
  const anim = isEven ? slideFromLeft(inView, index * 60) : slideFromRight(inView, index * 60);
  return (
    <div
      id={service.id}
      style={{
        borderRadius: '20px',
        overflow: 'hidden',
        border: `1px solid ${service.accent}18`,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        ...anim,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `${anim.transform ?? ''} translateY(-5px)`;
        e.currentTarget.style.boxShadow = `0 24px 60px ${service.accent}14`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = anim.transform ?? '';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', minHeight: '300px' }}>
        {/* Dark panel */}
        <div style={{ background: service.color, padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.68rem', color: service.accent, fontWeight: 700, letterSpacing: '0.12em', opacity: 0.7 }}>{service.number}</span>
          <div>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: service.accent, marginBottom: '1rem' }} />
            <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 800, color: 'white', lineHeight: 1.1 }}>
              {service.title}
            </h2>
          </div>
        </div>

        {/* Content panel */}
        <div style={{ padding: '2.5rem', background: '#fafafa', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <p style={{ color: 'var(--color-gray)', lineHeight: '1.8', fontSize: '0.9375rem', marginBottom: '1.75rem' }}>
            {service.description}
          </p>
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-gray)', marginBottom: '0.6rem' }}>
              What&apos;s included
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
              {service.deliverables.map((d) => (
                <span key={d} style={{
                  padding: '4px 12px', borderRadius: '100px',
                  background: 'white', fontSize: '0.78rem', fontWeight: 500,
                  border: `1px solid ${service.accent}30`, color: '#333',
                }}>
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const heroSection = useScrollReveal({ threshold: 0.1 });
  const cardsSection = useScrollReveal({ threshold: 0.04 });
  const crmSection = useScrollReveal({ threshold: 0.15 });

  return (
    <>
      {/* ── Hero card ── */}
      <section style={{ background: '#ffffff', paddingTop: '80px' }}>
        <div style={{
          margin: '12px', borderRadius: '24px', overflow: 'hidden',
          position: 'relative', height: '48vh', minHeight: '360px', background: '#0d1117',
        }}>
          <div style={{
            position: 'absolute', inset: '-10% 0',
            backgroundImage: 'url(https://assets.cdn.filesafe.space/NYlSya2nYSkSnnXEbY2l/media/69a9c640cc83074a8516f0d7.png)',
            backgroundSize: 'cover', backgroundPosition: 'center top',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 45%, rgba(0,0,0,0.65) 100%)',
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
              Services
            </div>
            <span style={{
              fontFamily: 'DM Sans, sans-serif', fontWeight: 800,
              fontSize: 'clamp(3rem, 9vw, 7rem)', lineHeight: 0.9, letterSpacing: '-0.04em',
              color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.72)', display: 'block',
            }}>What we</span>
            <span style={{
              fontFamily: 'DM Sans, sans-serif', fontWeight: 800,
              fontSize: 'clamp(2.25rem, 6.5vw, 5rem)', lineHeight: 0.95, letterSpacing: '-0.04em',
              background: 'linear-gradient(118deg, #ffffff 0%, #FE6462 22%, #ff9e9d 45%, #ffffff 60%, #FE6462 78%, #ff9e9d 90%, #ffffff 100%)',
              backgroundSize: '300% auto',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              display: 'block', marginTop: '0.1em',
              animation: 'doBestShimmer 5s linear infinite',
            }}>do best.</span>
          </div>
        </div>
      </section>

      {/* ── Intro line ── */}
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
              Every service we offer is built to work together. Your ads feed leads into your CRM. Your automation follows them up. Your software closes them. Your CRM tracks it all. One point of contact. Zero gaps.
            </p>
          </div>
        </div>
      </section>

      {/* ── Service cards ── */}
      <section ref={cardsSection.ref as React.Ref<HTMLElement>} style={{ paddingBottom: '80px', background: '#ffffff' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {services.map((service, i) => (
              <ServiceCard key={service.id} service={service} inView={cardsSection.inView} index={i} />
            ))}
          </div>
        </div>
      </section>

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
                { label: 'Website → CRM', color: '#94D96B' },
                { label: 'Paid Ads → CRM', color: '#6B8EFE' },
                { label: 'Follow-Up Engine → CRM', color: '#FEB64A' },
                { label: 'Rehash Automation → CRM', color: '#FE6462' },
                { label: 'Sales Software → CRM', color: '#94D96B' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes doBestShimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 300% center; }
        }
        @media (max-width: 768px) {
          h1 { white-space: normal !important; font-size: clamp(2rem, 10vw, 3rem) !important; }
          div[style*="grid-template-columns: 1fr 1.4fr"],
          div[style*="grid-template-columns: 1fr 1fr"],
          div[style*="grid-template-columns: 1fr auto"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
