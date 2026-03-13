'use client';

import { useState, useEffect, useRef } from 'react';
import SpaceBackground from '@/components/SpaceBackground';
import SystemDiagram from '@/components/sections/SystemDiagram';
import { useScrollReveal, fadeUp, scaleUp, stagger } from '@/hooks/useScrollReveal';
import { Check, ChevronDown } from 'lucide-react';
import {
  packagesData, resultsData, phoneSteps, fbAds, buildFeatures,
  fullScaleExtras, funnelSteps, outcomeCards,
  qualifyQuestions, ppaSteps,
} from '@/components/packages/data';

/* ═══════════════════════════════════════════════════
   SHARED STYLES
   ═══════════════════════════════════════════════════ */
const S = {
  section: { padding: '96px 0', position: 'relative' as const },
  sectionAlt: { padding: '96px 0', position: 'relative' as const, background: '#070b0f' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative' as const, zIndex: 1 },
  eyebrow: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em',
    textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.35)', marginBottom: '1rem',
  },
  h2: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
    fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'white', marginBottom: '1rem',
  },
  sub: { color: 'rgba(255,255,255,0.4)', maxWidth: '700px', margin: '0 auto', lineHeight: 1.8, fontSize: '1rem' },
  accent: '#FE6462',
  card: {
    background: 'linear-gradient(160deg, #13161e 0%, #1a1e2a 50%, #13161e 100%)',
    borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)',
  },
  gridOverlay: {
    position: 'absolute' as const, inset: 0,
    backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
    backgroundSize: '64px 64px', pointerEvents: 'none' as const,
  },
};

const HL = ({ children }: { children: React.ReactNode }) => (
  <span style={{ background: 'linear-gradient(135deg, #FE6462, #6B8EFE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{children}</span>
);

/* ═══════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════ */
export default function PackagesPage() {
  return (
    <main style={{ background: '#0A0A0A', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <SpaceBackground opacity={0.6} fixed />
      <Hero />
      <PhoneDemo />
      <OutcomeSection />
      <SystemDiagram />
      <ResultsSection />
      <ExclusivitySection />
      <PricingSection />
      <ROICalculator />
      <WhatWeBuildSection />
      <PPASection />
      <FunnelSection />
      <style>{`
        @keyframes pkg-glow-pulse {
          0%, 100% { box-shadow: 0 0 0 1px rgba(107,142,254,0.2), 0 -8px 160px 0px rgba(107,142,254,0.28), 0 20px 60px rgba(0,0,0,0.6); }
          50%       { box-shadow: 0 0 0 1px rgba(107,142,254,0.35), 0 -8px 200px 0px rgba(107,142,254,0.42), 0 20px 60px rgba(0,0,0,0.6); }
        }
        .pkg-highlight { animation: pkg-glow-pulse 3s ease-in-out infinite; }
        .pkg-highlight:hover { transform: scale(1.055) !important; }
        @media (max-width: 900px) {
          .packages-grid-3 { grid-template-columns: 1fr !important; }
          .phone-demo-layout { flex-direction: column !important; }
          .funnel-layout { flex-direction: column !important; }
          .ppa-grid { grid-template-columns: 1fr !important; }
          .iphone-device { width: 280px !important; height: 570px !important; }
          .iphone-device > div:first-child { border-radius: 38px !important; padding: 4px !important; }
          .iphone-device > div:first-child > :nth-child(4) { border-radius: 35px !important; }
        }
        @media (max-width: 768px) {
          .results-grid-6 { grid-template-columns: 1fr !important; }
          .features-grid-3 { grid-template-columns: 1fr !important; }
          .extras-grid-3 { grid-template-columns: 1fr !important; }
          .roi-inputs-2 { grid-template-columns: 1fr !important; }
          .roi-appts-4 { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </main>
  );
}

/* ═══════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════ */
function Hero() {
  const { ref, inView } = useScrollReveal({ threshold: 0.1 });
  return (
    <section ref={ref as React.Ref<HTMLElement>} style={{ paddingTop: '160px', paddingBottom: '80px', textAlign: 'center', position: 'relative' }}>
      <div style={S.container}>
        <div style={fadeUp(inView)}>
          <div style={S.eyebrow}>
            <span style={{ width: 20, height: 2, background: S.accent, display: 'block' }} />
            The Complete Marketing System for Contractors
            <span style={{ width: 20, height: 2, background: S.accent, display: 'block' }} />
          </div>
          <h1 style={{ ...S.h2, fontSize: 'clamp(2.25rem, 5vw, 3.75rem)', marginBottom: '1.5rem' }}>
            Stop Chasing Leads.<br />
            <HL>Start Dominating Your Market.</HL>
          </h1>
          <p style={{ ...S.sub, maxWidth: '680px', fontSize: '1.1rem' }}>
            We build complete revenue engines for contractors — the same systems that grow businesses from $1M to $10M, and $10M to $50M annually.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   PHONE DEMO
   ═══════════════════════════════════════════════════ */
function PhoneDemo() {
  const [step, setStep] = useState(0);
  const [adIdx, setAdIdx] = useState(0);
  const { ref, inView } = useScrollReveal({ threshold: 0.06 });

  return (
    <section ref={ref as React.Ref<HTMLElement>} style={S.sectionAlt}>
      <div style={S.gridOverlay} />
      <div style={S.container}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', ...fadeUp(inView) }}>
          <div style={S.eyebrow}>See It In Action</div>
          <h2 style={S.h2}>How We <HL>Fill Your Calendar</HL></h2>
          <p style={S.sub}>Click through each step to see exactly how it works.</p>
        </div>

        <div className="phone-demo-layout" style={{ display: 'flex', gap: '48px', alignItems: 'center', ...fadeUp(inView, 200) }}>
          {/* Steps */}
          <div style={{ flex: '0 0 280px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {phoneSteps.map((s, i) => (
              <button key={i} onClick={() => setStep(i)} style={{
                display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px',
                borderRadius: '12px', border: 'none', cursor: 'pointer', textAlign: 'left',
                background: step === i ? 'rgba(254,100,98,0.08)' : 'rgba(255,255,255,0.04)',
                borderLeft: step === i ? '3px solid #FE6462' : '3px solid transparent',
                transition: 'all 0.2s',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 700,
                  background: step === i ? '#FE6462' : 'rgba(255,255,255,0.08)',
                  color: step === i ? '#fff' : 'rgba(255,255,255,0.4)',
                }}>{s.num}</div>
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{s.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{s.desc}</div>
                </div>
              </button>
            ))}
          </div>

          {/* iPhone Mockup */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div className="iphone-device" style={{ position: 'relative', width: 340, height: 700 }}>
              {/* Frame */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(145deg, #2a2a3a 0%, #1a1a2a 50%, #151525 100%)',
                borderRadius: 48, padding: 5,
                boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 20px 40px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.08), inset 0 -1px 2px rgba(0,0,0,0.3)',
              }}>
                {/* Side button right */}
                <div style={{
                  position: 'absolute', right: -3, top: 140, width: 4, height: 70,
                  background: 'linear-gradient(180deg, #333 0%, #222 100%)',
                  borderRadius: '0 3px 3px 0',
                  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1)',
                }} />
                {/* Side buttons left */}
                <div style={{
                  position: 'absolute', left: -3, top: 120, width: 4, height: 35,
                  background: 'linear-gradient(180deg, #333 0%, #222 100%)',
                  borderRadius: '3px 0 0 3px',
                  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1)',
                }} />
                <div style={{
                  position: 'absolute', left: -3, top: 175, width: 4, height: 35,
                  background: 'linear-gradient(180deg, #333 0%, #222 100%)',
                  borderRadius: '3px 0 0 3px',
                  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1)',
                }} />

                {/* Screen */}
                <div style={{
                  width: '100%', height: '100%',
                  background: '#0A0A0A', borderRadius: 44, overflow: 'hidden', position: 'relative',
                }}>
                  {/* Dynamic Island */}
                  <div style={{
                    position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
                    width: 100, height: 28, background: '#000', borderRadius: 20, zIndex: 10,
                    boxShadow: '0 0 0 3px rgba(0,0,0,0.8)',
                  }}>
                    <div style={{
                      position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)',
                      width: 8, height: 8, borderRadius: '50%',
                      background: 'radial-gradient(circle, #1a3a5c 0%, #0d1f30 60%, #000 100%)',
                      boxShadow: 'inset 0 0 2px rgba(255,255,255,0.3)',
                    }} />
                  </div>

                  {/* Content area */}
                  <div style={{ paddingTop: 52, height: '100%', overflowY: 'auto' }}>
                    {/* Slide Header */}
                    <div style={{ padding: '8px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                      <span style={{
                        display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: '0.65rem', fontWeight: 700,
                        background: 'rgba(254,100,98,0.12)', color: '#FE6462', border: '1px solid rgba(254,100,98,0.2)',
                      }}>Step {step + 1}</span>
                      <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', marginTop: 6 }}>
                        {['Target Your Service Area', 'Scroll-Stopping Ads', 'Qualifying Questions', 'Self-Booking Calendar', 'Automatic Reminders'][step]}
                      </div>
                    </div>

                    {/* Slide Content */}
                    <div style={{ padding: 14 }}>
                      {step === 0 && <SlideTarget />}
                      {step === 1 && <SlideAds adIdx={adIdx} setAdIdx={setAdIdx} />}
                      {step === 2 && <SlideQualify />}
                      {step === 3 && <SlideCalendar />}
                      {step === 4 && <SlideReminders />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation dots */}
              <div style={{ position: 'absolute', bottom: -28, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
                {phoneSteps.map((_, i) => (
                  <button key={i} onClick={() => setStep(i)} style={{
                    width: 8, height: 8, borderRadius: '50%', border: 'none', cursor: 'pointer',
                    background: i === step ? '#FE6462' : 'rgba(255,255,255,0.2)',
                    transition: 'background 0.2s',
                  }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SlideTarget() {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{
        height: 260, background: 'linear-gradient(135deg, #0d1117, #161b22)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
      }}>
        {/* Stylized map visualization */}
        <div style={{ position: 'relative', width: '80%', height: '80%' }}>
          {[
            { x: '20%', y: '30%', size: 60, color: 'rgba(254,100,98,0.3)' },
            { x: '50%', y: '20%', size: 80, color: 'rgba(254,100,98,0.2)' },
            { x: '70%', y: '50%', size: 50, color: 'rgba(254,100,98,0.25)' },
            { x: '35%', y: '60%', size: 70, color: 'rgba(254,100,98,0.35)' },
            { x: '60%', y: '75%', size: 45, color: 'rgba(107,142,254,0.2)' },
          ].map((z, i) => (
            <div key={i} style={{
              position: 'absolute', left: z.x, top: z.y,
              width: z.size, height: z.size, borderRadius: '50%',
              background: z.color, border: `1px solid ${z.color.replace(/[\d.]+\)/, '0.5)')}`,
              transform: 'translate(-50%, -50%)',
            }} />
          ))}
          <div style={{ position: 'absolute', left: '35%', top: '45%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Tampa, FL</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', padding: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(254,100,98,0.5)' }} /> Include
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(107,142,254,0.5)' }} /> Exclude
        </div>
      </div>
    </div>
  );
}

function SlideAds({ adIdx, setAdIdx }: { adIdx: number; setAdIdx: (n: number) => void }) {
  const ad = fbAds[adIdx];
  return (
    <div>
      <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px 8px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', fontWeight: 700 }}>facebook</span>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>{adIdx + 1}/4</span>
      </div>
      <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '0 0 8px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(254,100,98,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', fontWeight: 700, color: '#FE6462' }}>{ad.initials}</div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff' }}>{ad.page}</div>
            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)' }}>Sponsored</div>
          </div>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', lineHeight: 1.4 }}>{ad.copy}</p>
        <div style={{ borderRadius: '8px', overflow: 'hidden', position: 'relative', marginBottom: '8px' }}>
          <span style={{ position: 'absolute', top: 6, left: 6, padding: '2px 8px', borderRadius: '4px', fontSize: '0.55rem', fontWeight: 700, background: 'rgba(0,0,0,0.6)', color: '#fff' }}>{ad.type}</span>
          <img src={ad.img} alt={ad.page} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>
          <span>{ad.reactions}</span><span>{ad.comments}</span>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '10px' }}>
        {fbAds.map((_, i) => (
          <button key={i} onClick={() => setAdIdx(i)} style={{
            width: 8, height: 8, borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: i === adIdx ? '#FE6462' : 'rgba(255,255,255,0.2)',
          }} />
        ))}
      </div>
    </div>
  );
}

function SlideQualify() {
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <div style={{ fontWeight: 700, color: '#FE6462', fontSize: '0.85rem' }}>RevCore</div>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>A few quick questions</div>
      </div>
      {qualifyQuestions.map((q, i) => (
        <div key={i} style={{ marginBottom: '10px', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '2px solid rgba(254,100,98,0.3)' }}>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>{q.q}</div>
          {q.options ? (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {q.options.map(o => (
                <span key={o} style={{
                  padding: '3px 10px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 600,
                  background: o === q.selected ? 'rgba(254,100,98,0.15)' : 'rgba(255,255,255,0.05)',
                  color: o === q.selected ? '#FE6462' : 'rgba(255,255,255,0.4)',
                  border: `1px solid ${o === q.selected ? 'rgba(254,100,98,0.3)' : 'rgba(255,255,255,0.08)'}`,
                }}>{o}</span>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#FE6462' }}>{q.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function SlideCalendar() {
  const days = [
    { d: 15, past: true }, { d: 16, past: true }, { d: 17, past: true },
    { d: 18, avail: true }, { d: 19, avail: true, selected: true }, { d: 20, avail: true }, { d: 21 },
    { d: 22 }, { d: 23, avail: true }, { d: 24, avail: true },
    { d: 25, avail: true }, { d: 26, avail: true }, { d: 27, avail: true }, { d: 28 },
  ];
  const times = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'];
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <div style={{ fontWeight: 700, color: '#FE6462', fontSize: '0.8rem' }}>RevCore</div>
        <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.85rem' }}>Book Your Appointment</div>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>Select a day and time</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '12px' }}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', padding: '4px 0' }}>{d}</div>
        ))}
        {days.map((d, i) => (
          <div key={i} style={{
            textAlign: 'center', padding: '6px 0', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600,
            color: d.past ? 'rgba(255,255,255,0.15)' : d.selected ? '#fff' : d.avail ? '#FE6462' : 'rgba(255,255,255,0.3)',
            background: d.selected ? '#FE6462' : d.avail ? 'rgba(254,100,98,0.08)' : 'transparent',
          }}>{d.d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '12px' }}>
        {times.map((t, i) => (
          <div key={t} style={{
            textAlign: 'center', padding: '8px 0', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer',
            background: i === 1 ? '#FE6462' : 'rgba(255,255,255,0.05)',
            color: i === 1 ? '#fff' : 'rgba(255,255,255,0.5)',
            border: `1px solid ${i === 1 ? '#FE6462' : 'rgba(255,255,255,0.08)'}`,
          }}>{t}</div>
        ))}
      </div>
      <button style={{
        width: '100%', padding: '10px', borderRadius: '8px', border: 'none',
        background: '#FE6462', color: '#fff', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
      }}>Confirm Appointment</button>
    </div>
  );
}

function SlideReminders() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(254,100,98,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700, color: '#FE6462' }}>PR</div>
        <div>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.8rem' }}>Premium Roofing</div>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>Automated Message</div>
        </div>
      </div>
      <div style={{ padding: '12px' }}>
        <div style={{ textAlign: 'center', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginBottom: '8px' }}>Yesterday 10:00 AM</div>
        <div style={{ background: 'rgba(255,255,255,0.06)', padding: '10px 12px', borderRadius: '14px 14px 14px 4px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, marginBottom: '8px', maxWidth: '85%' }}>
          Hi John! Just a friendly reminder about your roof inspection appointment tomorrow at 10:00 AM. Our estimator Mike will be arriving at your home.
        </div>
        <div style={{ background: '#FE6462', padding: '10px 12px', borderRadius: '14px 14px 4px 14px', fontSize: '0.72rem', color: '#fff', lineHeight: 1.5, marginBottom: '4px', maxWidth: '75%', marginLeft: 'auto' }}>
          Sounds good, see you then!
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', marginBottom: '12px' }}>Delivered</div>
        <div style={{ textAlign: 'center', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginBottom: '8px' }}>Today 9:00 AM</div>
        <div style={{ background: 'rgba(255,255,255,0.06)', padding: '10px 12px', borderRadius: '14px 14px 14px 4px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, maxWidth: '85%' }}>
          Our estimator is on the way, see you in 1 hour!
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   OUTCOME SECTION
   ═══════════════════════════════════════════════════ */
function OutcomeSection() {
  const { ref, inView } = useScrollReveal({ threshold: 0.08 });
  return (
    <section ref={ref as React.Ref<HTMLElement>} style={S.section}>
      <div style={S.container}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', ...fadeUp(inView) }}>
          <h2 style={S.h2}>Consistently Booked. <HL>Qualified Appointments.</HL></h2>
          <p style={S.sub}>This is what your business looks like with RevCore.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', ...fadeUp(inView, 200) }} className="packages-grid-3">
          {outcomeCards.map((card, i) => (
            <div key={i} style={{
              ...S.card, padding: '24px', cursor: 'pointer', transition: 'all 0.3s',
              boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(254,100,98,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {card.icon === 'calendar' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FE6462" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>}
                  {card.icon === 'chat' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B8EFE" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>}
                  {card.icon === 'refresh' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94D96B" strokeWidth="2"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>}
                </div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>{card.title}</div>
              </div>
              {/* Card preview content */}
              {card.appointments && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginBottom: '8px' }}>
                    <span>January 2026</span>
                  </div>
                  {card.appointments.map((a, j) => (
                    <div key={j} style={{ display: 'flex', gap: '10px', padding: '8px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', width: '60px' }}>{a.time}</span>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>{a.name}</span>
                    </div>
                  ))}
                </div>
              )}
              {card.conversations && (
                <div>
                  {card.conversations.slice(0, 4).map((c, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: '6px', background: c.unread ? 'rgba(255,255,255,0.03)' : 'transparent', marginBottom: '2px' }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(107,142,254,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', fontWeight: 700, color: '#6B8EFE', flexShrink: 0 }}>{c.initials}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {c.name}
                          {c.badge && <span style={{ fontSize: '0.5rem', padding: '1px 6px', borderRadius: '10px', background: 'rgba(148,217,107,0.15)', color: '#94D96B' }}>{c.badge}</span>}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.preview}</div>
                      </div>
                      <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>{c.time}</span>
                    </div>
                  ))}
                </div>
              )}
              {card.rehash && (
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>{card.rehash.label}</span><br />
                    <span style={{ fontSize: '0.65rem', color: 'rgba(148,217,107,0.8)' }}>{card.rehash.context}</span>
                  </div>
                  {card.rehash.messages.map((m, j) => (
                    <div key={j} style={{
                      padding: '8px 12px', borderRadius: m.dir === 'out' ? '10px 10px 10px 4px' : '10px 10px 4px 10px',
                      background: m.dir === 'out' ? 'rgba(254,100,98,0.1)' : 'rgba(148,217,107,0.1)',
                      fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4, marginBottom: '6px',
                      maxWidth: '90%', marginLeft: m.dir === 'in' ? 'auto' : '0',
                    }}>{m.text}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* EcosystemSection replaced by <SystemDiagram /> component */

/* ═══════════════════════════════════════════════════
   RESULTS SECTION
   ═══════════════════════════════════════════════════ */
function ResultsSection() {
  const { ref, inView } = useScrollReveal({ threshold: 0.08 });
  return (
    <section ref={ref as React.Ref<HTMLElement>} style={S.section}>
      <div style={S.container}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', ...fadeUp(inView) }}>
          <div style={S.eyebrow}>Real Results</div>
          <h2 style={S.h2}>What Contractors Are <HL>Actually Seeing</HL></h2>
          <p style={S.sub}>These are real numbers from contractors using our system.</p>
        </div>
        <div className="results-grid-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', ...fadeUp(inView, 200) }}>
          {resultsData.map((r, i) => (
            <div key={i} style={{ ...S.card, padding: '28px', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <img src={r.logo} alt={r.name} style={{ width: 56, height: 56, borderRadius: '10px', objectFit: 'contain', background: '#fff' }} />
                <div>
                  <div style={{ fontWeight: 700, color: '#fff' }}>{r.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>{r.location}</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Before</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>{r.before}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{r.unit}</div>
                </div>
                <div style={{ color: S.accent, fontSize: '1.3rem' }}>\u2192</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>After</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: S.accent }}>{r.after}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{r.unit}</div>
                </div>
              </div>
              <div style={{ background: 'rgba(254,100,98,0.08)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                <span style={{ fontWeight: 600, color: S.accent }}>{r.increase} increase</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   EXCLUSIVITY
   ═══════════════════════════════════════════════════ */
function ExclusivitySection() {
  const { ref, inView } = useScrollReveal({ threshold: 0.08 });
  return (
    <section ref={ref as React.Ref<HTMLElement>} style={S.sectionAlt}>
      <div style={S.gridOverlay} />
      <div style={S.container}>
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', ...fadeUp(inView) }}>
          <div style={S.eyebrow}>Market Exclusivity</div>
          <h2 style={S.h2}>While You Build, <HL>They Can&apos;t</HL></h2>
          <p style={S.sub}>
            Your competitors can&apos;t access RevCore in your market. While you&apos;re building SEO authority, reactivating your database, and training your team — they&apos;re stuck buying shared leads. That gap only widens.
          </p>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '24px', marginTop: '2rem',
            padding: '14px 28px', borderRadius: '12px',
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FE6462' }} />
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Claimed</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#94D96B' }} />
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Still Open</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   PRICING
   ═══════════════════════════════════════════════════ */
function PricingSection() {
  const [isQuarterly, setIsQuarterly] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const { ref, inView } = useScrollReveal({ threshold: 0.06 });

  const fmtPrice = (monthly: number) => {
    const p = isQuarterly ? Math.round(monthly * 0.9) : monthly;
    return '$' + p.toLocaleString();
  };

  return (
    <section ref={ref as React.Ref<HTMLElement>} id="pricing" style={{ ...S.sectionAlt, padding: '96px 0' }}>
      <div style={S.gridOverlay} />
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: 900, height: 500,
        background: 'radial-gradient(ellipse at center, rgba(107,142,254,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={S.container}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem', ...fadeUp(inView) }}>
          <div style={S.eyebrow}>
            <span style={{ width: 20, height: 2, background: '#6B8EFE', display: 'block' }} />
            Choose Your Path
            <span style={{ width: 20, height: 2, background: '#6B8EFE', display: 'block' }} />
          </div>
          <h2 style={S.h2}>Growth Packages Built for <HL>Contractors</HL></h2>
          <p style={{ ...S.sub, marginBottom: '2rem' }}>Three proven systems designed to meet you where you are and take you where you want to go.</p>

          {/* Billing Toggle */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, padding: 4, gap: 2,
            }}>
              <button onClick={() => setIsQuarterly(false)} style={{
                padding: '8px 22px', borderRadius: 100, border: 'none', cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.875rem',
                background: !isQuarterly ? 'white' : 'transparent',
                color: !isQuarterly ? '#0A0A0A' : 'rgba(255,255,255,0.45)', transition: 'all 0.2s',
              }}>Monthly</button>
              <button onClick={() => setIsQuarterly(true)} style={{
                padding: '8px 22px', borderRadius: 100, border: 'none', cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.875rem',
                background: isQuarterly ? 'white' : 'transparent',
                color: isQuarterly ? '#0A0A0A' : 'rgba(255,255,255,0.45)', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                Quarterly
                <span style={{
                  background: '#94D96B', color: '#0a0a0a', fontSize: '0.6rem', fontWeight: 800,
                  padding: '2px 7px', borderRadius: 100, letterSpacing: '0.05em',
                }}>SAVE 10%</span>
              </button>
            </div>
          </div>
        </div>

        {/* Package Cards */}
        <div className="packages-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', alignItems: 'center' }}>
          {packagesData.map((pkg, i) => (
            <div key={pkg.id} className={pkg.highlight ? 'pkg-highlight' : ''} style={{
              borderRadius: 20,
              background: 'linear-gradient(160deg, #13161e 0%, #1a1e2a 50%, #13161e 100%)',
              border: `1px solid ${pkg.accent}30`,
              overflow: 'hidden', position: 'relative',
              transform: pkg.highlight ? 'scale(1.045)' : 'scale(1)',
              zIndex: pkg.highlight ? 2 : 1,
              boxShadow: pkg.highlight
                ? `0 0 0 1px ${pkg.accent}20, 0 -8px 160px 0px ${pkg.accent}28, 0 20px 60px rgba(0,0,0,0.6)`
                : '0 4px 24px rgba(0,0,0,0.5)',
              transition: 'transform 0.3s ease',
              ...scaleUp(inView, stagger(i, 200, 150)),
            }}>
              {/* Accent Bar */}
              <div style={{
                height: 3,
                background: `linear-gradient(90deg, transparent 0%, ${pkg.accent} 40%, ${pkg.accent} 60%, transparent 100%)`,
                opacity: pkg.highlight ? 1 : 0.5,
              }} />

              {/* Badge */}
              {pkg.highlight && (
                <div style={{
                  position: 'absolute', top: 19, right: 16,
                  background: `linear-gradient(135deg, ${pkg.accent}ee, ${pkg.accent}99)`,
                  color: 'white', fontSize: '0.62rem', fontWeight: 800,
                  padding: '4px 12px', borderRadius: 100,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  boxShadow: `0 2px 12px ${pkg.accent}50`,
                }}>{pkg.badge}</div>
              )}
              {!pkg.highlight && (
                <div style={{
                  position: 'absolute', top: 19, right: 16,
                  border: `1px solid ${pkg.accent}40`, color: pkg.accent,
                  fontSize: '0.62rem', fontWeight: 800,
                  padding: '4px 12px', borderRadius: 100,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                }}>{pkg.badge}</div>
              )}

              {/* Content */}
              <div style={{ padding: '1.75rem 1.75rem 1.25rem' }}>
                <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.2rem', fontWeight: 800, color: 'white', marginBottom: '0.3rem' }}>{pkg.name}</h3>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>{pkg.tagline}</p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 2 }}>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'white' }}>
                    {fmtPrice(pkg.priceMonthly)}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.28)' }}>/mo</span>
                </div>

                {isQuarterly ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>billed {pkg.quarterlyTotal}</span>
                    <span style={{
                      fontSize: '0.68rem', fontWeight: 700, color: '#94D96B',
                      background: 'rgba(148,217,107,0.12)', border: '1px solid rgba(148,217,107,0.2)',
                      padding: '2px 8px', borderRadius: 100,
                    }}>save {pkg.quarterlySave}</span>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.75rem', color: pkg.accent, fontWeight: 600 }}>{pkg.noteMonthly}</span>
                )}
              </div>

              {/* Features */}
              <div style={{ padding: '0 1.75rem 1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', margin: '1rem 0 0.75rem' }}>
                  {pkg.featuresTitle || "What's included"}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {pkg.heroFeatures.map((f, fi) => (
                    <div key={fi} style={{
                      background: `${pkg.accent}0e`, border: `1px solid ${pkg.accent}20`,
                      borderLeft: `3px solid ${pkg.accent}`, borderRadius: 8, padding: '9px 12px',
                    }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.88)' }}>{f}</div>
                    </div>
                  ))}
                </div>

                <button onClick={() => setExpanded(p => ({ ...p, [pkg.id]: !p[pkg.id] }))} style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', fontWeight: 600,
                  marginTop: 10, padding: 0, fontFamily: 'DM Sans, sans-serif',
                }}>
                  <ChevronDown size={13} style={{ transform: expanded[pkg.id] ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                  {expanded[pkg.id] ? 'Show less' : `See all ${pkg.heroFeatures.length + pkg.moreFeatures.length} features`}
                </button>

                {expanded[pkg.id] && (
                  <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {pkg.moreFeatures.map((f, fi) => (
                      <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Check size={12} style={{ color: pkg.accent, flexShrink: 0 }} />
                        <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CTA */}
              <div style={{ padding: '1rem 1.75rem 1.75rem' }}>
                <button style={{
                  width: '100%', padding: 13, borderRadius: 100, fontSize: '0.875rem', fontWeight: 700,
                  cursor: 'pointer', border: 'none',
                  background: pkg.highlight ? `linear-gradient(135deg, ${pkg.accent}dd 0%, ${pkg.accent}99 100%)` : `${pkg.accent}18`,
                  color: 'white', transition: 'opacity 0.2s, transform 0.2s',
                  boxShadow: pkg.highlight ? `0 4px 24px ${pkg.accent}45` : 'none',
                }}>Get Started</button>
              </div>
            </div>
          ))}
        </div>

        {/* 30-Day Guarantee */}
        <div style={{ textAlign: 'center', marginTop: '3rem', ...fadeUp(inView, 600) }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(148,217,107,0.08)', border: '1px solid rgba(148,217,107,0.15)',
            borderRadius: 100, padding: '8px 20px',
          }}>
            <span style={{ fontSize: '1rem' }}>🛡️</span>
            <span style={{ color: '#94D96B', fontSize: '0.8rem', fontWeight: 700 }}>30-Day Performance Guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   ROI CALCULATOR
   ═══════════════════════════════════════════════════ */
function ROICalculator() {
  const [pkg, setPkg] = useState<'core' | 'full'>('core');
  const [appts, setAppts] = useState(20);
  const [jobValue, setJobValue] = useState(18000);
  const [closeRate, setCloseRate] = useState(35);
  const { ref, inView } = useScrollReveal({ threshold: 0.08 });

  const adSpend = appts <= 20 ? 1500 : appts <= 40 ? 3000 : appts <= 60 ? 4500 : 6000;
  const pkgCost = pkg === 'core' ? 3497 : 4997;
  const gross = Math.round(appts * (closeRate / 100) * jobValue);
  const net = gross - pkgCost - adSpend;

  return (
    <section ref={ref as React.Ref<HTMLElement>} style={{ padding: '96px 0', background: 'linear-gradient(180deg, #1a1a2e 0%, #16162a 100%)' }}>
      <div style={{ ...S.container, maxWidth: 900 }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', ...fadeUp(inView) }}>
          <div style={{ ...S.eyebrow, color: 'rgba(254,100,98,0.9)' }}>See Your Potential</div>
          <h2 style={S.h2}>System <HL>ROI</HL> Calculator</h2>
          <p style={S.sub}>Select your package and appointment volume to see your projected net revenue.</p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 20, padding: 40, ...fadeUp(inView, 200),
        }}>
          {/* Package Selection */}
          <div style={{ marginBottom: 32 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: 12 }}>Select Package</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {(['core', 'full'] as const).map(p => (
                <button key={p} onClick={() => setPkg(p)} style={{
                  padding: '16px 12px', borderRadius: 10, fontWeight: 600, fontSize: '0.9rem',
                  cursor: 'pointer', transition: 'all 0.2s', color: '#fff', border: 'none',
                  background: pkg === p ? 'rgba(254,100,98,0.2)' : 'rgba(255,255,255,0.1)',
                  outline: pkg === p ? '2px solid #FE6462' : '2px solid rgba(255,255,255,0.2)',
                }}>{p === 'core' ? 'Growth Engine' : 'Full Scale Partner'}</button>
              ))}
            </div>
          </div>

          {/* Appointments */}
          <div style={{ marginBottom: 32 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: 12 }}>Appointments Per Month</label>
            <div className="roi-appts-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {[{ a: 20, ad: '$1,500' }, { a: 40, ad: '$3,000' }, { a: 60, ad: '$4,500' }, { a: 80, ad: '$6,000' }].map(o => (
                <button key={o.a} onClick={() => setAppts(o.a)} style={{
                  padding: '16px 12px', borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s',
                  textAlign: 'center', color: '#fff', border: 'none',
                  background: appts === o.a ? 'rgba(254,100,98,0.2)' : 'rgba(255,255,255,0.1)',
                  outline: appts === o.a ? '2px solid #FE6462' : '2px solid rgba(255,255,255,0.2)',
                }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{o.a} Appts</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>~{o.ad}/mo ads</div>
                </button>
              ))}
            </div>
          </div>

          {/* Inputs */}
          <div className="roi-inputs-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>Average Job Value</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' }}>$</span>
                <input type="number" value={jobValue} onChange={e => setJobValue(+e.target.value)} style={{
                  width: '100%', padding: '16px 16px 16px 32px',
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 10, color: '#fff', fontSize: '1.1rem', fontWeight: 600,
                }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>Your Close Rate</label>
              <div style={{ position: 'relative' }}>
                <input type="number" value={closeRate} min={1} max={100} onChange={e => setCloseRate(+e.target.value)} style={{
                  width: '100%', padding: '16px', paddingRight: 40,
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 10, color: '#fff', fontSize: '1.1rem', fontWeight: 600,
                }} />
                <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' }}>%</span>
              </div>
            </div>
          </div>

          {/* Result */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(254,100,98,0.15) 0%, rgba(254,100,98,0.05) 100%)',
            border: '1px solid rgba(254,100,98,0.3)', borderRadius: 16, padding: 32, textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
              Net Monthly Revenue After Investment
            </div>
            <div style={{ fontSize: '3.5rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
              ${net.toLocaleString()}
            </div>
            <div style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', marginTop: 12 }}>
              {appts} appointments × {closeRate}% close rate × ${jobValue.toLocaleString()} = ${gross.toLocaleString()} gross
            </div>
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                Investment: ${pkgCost.toLocaleString()}/mo + ${adSpend.toLocaleString()}/mo ad spend
              </div>
            </div>
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: 24 }}>
            Results vary based on market, competition, and execution.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   WHAT WE BUILD
   ═══════════════════════════════════════════════════ */
function WhatWeBuildSection() {
  const { ref, inView } = useScrollReveal({ threshold: 0.08 });
  return (
    <section ref={ref as React.Ref<HTMLElement>} style={S.section}>
      <div style={S.container}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', ...fadeUp(inView) }}>
          <div style={S.eyebrow}>Everything You Need</div>
          <h2 style={S.h2}>Your Complete <HL>Revenue Engine</HL></h2>
          <p style={S.sub}>Every piece of the system working together to generate leads, book appointments, and grow your business.</p>
        </div>

        <div className="features-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, ...fadeUp(inView, 200) }}>
          {buildFeatures.map((f, i) => (
            <div key={i} style={{
              ...S.card, padding: 24, cursor: 'pointer', transition: 'all 0.3s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, background: f.color, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>{f.emoji}</div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{f.title}</h4>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Full Scale Partner Extras */}
        <div style={{
          marginTop: '4rem', padding: 32,
          background: 'linear-gradient(135deg, rgba(168,85,247,0.05) 0%, rgba(107,142,254,0.05) 100%)',
          borderRadius: 16, border: '1px solid rgba(168,85,247,0.2)',
          ...fadeUp(inView, 400),
        }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <span style={{
              display: 'inline-block', padding: '6px 16px',
              background: 'linear-gradient(135deg, #a855f7, #4f8fff)',
              color: '#fff', fontSize: '0.75rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: 20, marginBottom: 12,
            }}>Full Scale Partner Only</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>Additional Growth Tools</h3>
          </div>
          <div className="extras-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {fullScaleExtras.map((e, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.95rem', color: '#fff' }}>
                <span style={{ color: '#a855f7' }}>✓</span> {e}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   PPA SECTION
   ═══════════════════════════════════════════════════ */
function PPASection() {
  const [open, setOpen] = useState(false);
  const { ref, inView } = useScrollReveal({ threshold: 0.08 });

  return (
    <section ref={ref as React.Ref<HTMLElement>} style={{ padding: '96px 0', background: 'linear-gradient(180deg, #1a1a2e 0%, #16162a 100%)' }}>
      <div style={{ ...S.container, maxWidth: 1000 }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', ...fadeUp(inView) }}>
          <div style={{ ...S.eyebrow, color: 'rgba(254,100,98,0.9)' }}>Results-First Model</div>
          <h2 style={S.h2}>Pay Per <HL>Qualified Appointment</HL></h2>
          <p style={S.sub}>Pay only for booked appointments. No retainers. No ad markup.</p>

          <button onClick={() => setOpen(!open)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            marginTop: 24, padding: '12px 24px',
            background: 'rgba(254,100,98,0.15)', border: '1px solid rgba(254,100,98,0.4)',
            borderRadius: 50, color: S.accent, fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer',
          }}>
            {open ? 'Hide Details' : 'See How It Works'}
            <ChevronDown size={16} style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }} />
          </button>
        </div>

        {open && (
          <div style={{ ...fadeUp(true, 0) }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                display: 'inline-block', padding: '10px 20px',
                background: 'linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(34,197,94,0.1) 100%)',
                border: '1px solid rgba(34,197,94,0.4)', borderRadius: 50,
                fontSize: '0.9rem', fontWeight: 600, color: '#22c55e',
              }}>Limited Offer: We Fund Your First Month&apos;s Ad Spend</div>
            </div>

            <div className="ppa-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
              {/* How It Works */}
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: 24 }}>How It Works</h3>
                {ppaSteps.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                      background: 'rgba(254,100,98,0.2)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, color: S.accent,
                    }}>{i + 1}</div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff', marginBottom: 4 }}>{s.title}</div>
                      <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 24, padding: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 8, borderLeft: `3px solid ${S.accent}` }}>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                    <strong style={{ color: '#fff' }}>Why this works:</strong> You control the ad spend, we deliver the results. No hidden fees, no markups.
                  </div>
                </div>
              </div>

              {/* Pricing Card */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 28,
                textAlign: 'center', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: 16, right: -35,
                  background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                  color: '#fff', fontSize: '0.7rem', fontWeight: 700,
                  padding: '6px 40px', transform: 'rotate(45deg)',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>Trial</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: S.accent, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
                  Performance-Based Pricing
                </div>
                <div style={{
                  textAlign: 'left', padding: 14, marginBottom: 12,
                  background: 'rgba(254,100,98,0.15)', borderRadius: 12,
                  border: '1px solid rgba(254,100,98,0.3)',
                }}>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                    Monthly — 15 Appointments
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>$2,500</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>$167 per appointment + ad spend</div>
                </div>
                <div style={{ textAlign: 'left', marginBottom: 16 }}>
                  {['No retainers', 'No ad markup', 'Cancel anytime'].map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)' }}>
                      <span style={{ color: '#22c55e' }}>✓</span> {f}
                    </div>
                  ))}
                </div>
                <div style={{
                  textAlign: 'left', padding: 14,
                  background: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 100%)',
                  border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12,
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                    Limited Time Trial
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>We fund your first month&apos;s ad spend</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>Start risk-free, we cover the ads while you see the results.</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   FUNNEL SECTION
   ═══════════════════════════════════════════════════ */
function FunnelSection() {
  const { ref, inView } = useScrollReveal({ threshold: 0.08 });
  const stages = ['Awareness', 'Interest', 'Qualification', 'Reminders', 'Appointment'];

  return (
    <section ref={ref as React.Ref<HTMLElement>} style={S.section}>
      <div style={S.container}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', ...fadeUp(inView) }}>
          <div style={S.eyebrow}>How It Works</div>
          <h2 style={S.h2}>Your <HL>Marketing Funnel</HL> Explained</h2>
          <p style={S.sub}>From first impression to booked appointment, here&apos;s how we fill your calendar.</p>
        </div>

        <div className="funnel-layout" style={{ display: 'flex', gap: 48, alignItems: 'flex-start', ...fadeUp(inView, 200) }}>
          {/* Funnel Visual */}
          <div style={{ flex: '0 0 320px' }}>
            {/* Sources */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 24 }}>
              {[
                { icon: '\uD83C\uDFAF', label: 'SEO & Website', sub: 'High intent, organic' },
                { icon: '\uD83D\uDCE2', label: 'Paid Ads', sub: 'Fast, scalable reach' },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.85rem' }}>{s.label}</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>{s.sub}</div>
                </div>
              ))}
            </div>
            {/* Arrows */}
            <div style={{ textAlign: 'center', fontSize: '1.5rem', color: 'rgba(255,255,255,0.2)', marginBottom: 16 }}>\u2193 \u2193</div>
            {/* Stages */}
            {stages.map((s, i) => (
              <div key={i} style={{
                padding: '12px 20px', marginBottom: 4,
                background: `linear-gradient(90deg, rgba(254,100,98,${0.06 + i * 0.04}) 0%, rgba(107,142,254,${0.04 + i * 0.03}) 100%)`,
                borderRadius: 8, textAlign: 'center',
                width: `${100 - i * 8}%`, margin: '0 auto 4px',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.85rem' }}>{s}</div>
              </div>
            ))}
            {/* Result */}
            <div style={{
              width: '40%', margin: '12px auto 0', padding: '12px 16px', borderRadius: 8,
              background: 'rgba(148,217,107,0.1)', border: '1px solid rgba(148,217,107,0.3)',
              textAlign: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94D96B" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                <span style={{ fontWeight: 700, color: '#94D96B', fontSize: '0.85rem' }}>New Project</span>
              </div>
            </div>
          </div>

          {/* Funnel Info */}
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: 12 }}>
              We Handle Every Step So You Can Focus on Closing
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 32 }}>
              Most contractors only focus on getting leads. We build the entire system — from first impression to appointment confirmation.
            </p>
            {funnelSteps.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(254,100,98,0.1)', border: '1px solid rgba(254,100,98,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, color: S.accent, fontSize: '0.85rem',
                }}>{s.num}</div>
                <div>
                  <h4 style={{ fontWeight: 700, color: '#fff', marginBottom: 4 }}>{s.title}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
