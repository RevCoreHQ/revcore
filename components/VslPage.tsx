'use client';

import { useState, useEffect } from 'react';
import SpaceBackground from '@/components/SpaceBackground';

interface VslPageProps {
  eyebrow: string;
  headline: string;
  subheadline: string;
  mainVideoLoomId: string;
  ctaText: string;
  modalBadge: string;
  modalTitle: string;
  modalTitleAccent: string;
  modalDescription: string;
  modalTestimonial: string;
  calendarSrc: string;
  calendarId: string;
  ctaDelaySecs?: number;
}

const TESTIMONIAL_IMAGES = [
  'https://storage.googleapis.com/msgsndr/NYlSya2nYSkSnnXEbY2l/media/6980621966e7ca7614dff335.png',
  'https://storage.googleapis.com/msgsndr/NYlSya2nYSkSnnXEbY2l/media/698062191fd827dd079d4152.png',
  'https://storage.googleapis.com/msgsndr/NYlSya2nYSkSnnXEbY2l/media/6980621966e7cadd3ddff334.png',
  'https://storage.googleapis.com/msgsndr/NYlSya2nYSkSnnXEbY2l/media/69806219f7a877689f2b855c.png',
  'https://storage.googleapis.com/msgsndr/NYlSya2nYSkSnnXEbY2l/media/6980628c1311f68508a1d1e7.png',
  'https://storage.googleapis.com/msgsndr/NYlSya2nYSkSnnXEbY2l/media/698066a8f7a877958f2d3b15.png',
];

const VIDEO_TESTIMONIAL_IDS = [
  '2020008bae3241dbbdfdf0c032dd17e5',
  '6460106c46874c1190bd1d71d4df8241',
];

export default function VslPage(props: VslPageProps) {
  const {
    eyebrow, headline, subheadline, mainVideoLoomId,
    ctaText,
    modalBadge, modalTitle, modalTitleAccent, modalDescription,
    modalTestimonial, calendarSrc, calendarId,
    ctaDelaySecs = 0,
  } = props;

  const [modalOpen, setModalOpen] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(ctaDelaySecs === 0);

  useEffect(() => {
    if (ctaDelaySecs > 0) {
      const t = setTimeout(() => setCtaVisible(true), ctaDelaySecs * 1000);
      return () => clearTimeout(t);
    }
  }, [ctaDelaySecs]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        .vsl-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background-color: #ffffff;
          color: #0A0A0A;
          padding: 14px 32px;
          border-radius: 100px;
          font-size: 0.875rem;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.2s ease;
          letter-spacing: 0.02em;
        }
        .vsl-btn:hover {
          background-color: #FE6462;
          color: #ffffff;
          transform: translateY(-2px);
        }
        .vsl-section-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          margin-bottom: 1.25rem;
          font-family: 'DM Sans', sans-serif;
        }
        .vsl-section-tag::before {
          content: '';
          width: 24px;
          height: 2px;
          background-color: #FE6462;
          display: block;
          flex-shrink: 0;
        }
        .vsl-testimonial-card {
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.07);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .vsl-testimonial-card:hover {
          transform: scale(1.02);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4);
        }
        @keyframes vslModalIn {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @media (max-width: 900px) {
          .vsl-modal-grid { grid-template-columns: 1fr !important; height: 98vh !important; }
          .vsl-modal-left { display: none !important; }
          .vsl-modal-cal  { border-radius: 16px !important; }
          .vsl-proof-grid { grid-template-columns: 1fr !important; }
          .vsl-video-testimonials { flex-direction: column !important; align-items: center !important; }
          .vsl-featured-grid { grid-template-columns: 1fr !important; }
          .vsl-featured-grid > div:first-child { max-height: 500px; }
        }
        @media (max-width: 600px) {
          .vsl-modal-grid { height: 100vh !important; border-radius: 12px !important; max-width: 100vw !important; }
          .vsl-modal-cal  { border-radius: 12px !important; }
          .vsl-modal-cal iframe { height: 100vh !important; min-height: 100vh !important; }
          .vsl-proof-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @keyframes vslFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .vsl-fade-up { animation: vslFadeUp 0.55s ease forwards; }
      `}</style>

      {/* Booking Modal */}
      {modalOpen && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.88)',
            backdropFilter: 'blur(10px)',
            zIndex: 10000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            className="vsl-modal-grid"
            style={{
              background: '#0d1117', borderRadius: 16,
              maxWidth: 1000, width: '100%', height: '80vh',
              overflow: 'hidden',
              display: 'grid', gridTemplateColumns: '340px 1fr',
              position: 'relative',
              border: '1px solid rgba(255,255,255,0.07)',
              animation: 'vslModalIn 0.35s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <button
              onClick={() => setModalOpen(false)}
              style={{
                position: 'absolute', top: 16, right: 16,
                width: 36, height: 36,
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '50%', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="#fff" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div className="vsl-modal-left" style={{ padding: '40px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(254,100,98,0.12)', border: '1px solid rgba(254,100,98,0.25)',
                padding: '6px 14px', borderRadius: 999, marginBottom: 28, width: 'fit-content',
              }}>
                <svg viewBox="0 0 24 24" fill="#FE6462" width="12" height="12">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#FE6462', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'DM Sans, sans-serif' }}>
                  {modalBadge}
                </span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.6rem,2.5vw,2rem)', fontWeight: 800, lineHeight: 1.15, color: '#fff', marginBottom: 16, fontFamily: 'DM Sans, sans-serif' }}>
                {modalTitle}<br/><span style={{ color: '#FE6462' }}>{modalTitleAccent}</span>
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 32, fontFamily: 'DM Sans, sans-serif' }}>
                {modalDescription}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
                {[
                  { label: 'Quick 15-Min Call',  desc: 'No fluff. Just real answers to your questions.',         color: '#FE6462', check: false },
                  { label: 'Territory Check',    desc: 'Confirm exclusive rights are available in your market.', color: '#94D96B', check: true  },
                  { label: 'Zero Obligation',    desc: '100% free strategy call. No pressure, just value.',      color: '#94D96B', check: true  },
                ].map(({ label, desc, color, check }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, marginTop: 1, background: `${color}1a`, border: `1px solid ${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" width="13" height="13">
                        {check ? <path d="M5 13l4 4L19 7"/> : <path d="M13 7l5 5m0 0l-5 5m5-5H6"/>}
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff', marginBottom: 2, fontFamily: 'DM Sans, sans-serif' }}>{label}</p>
                      <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.32)', lineHeight: 1.5, fontFamily: 'DM Sans, sans-serif' }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.28)', lineHeight: 1.6, paddingLeft: 14, borderLeft: '2px solid rgba(254,100,98,0.4)', fontFamily: 'DM Sans, sans-serif' }}>
                {modalTestimonial}
              </p>
            </div>

            <div className="vsl-modal-cal" style={{ background: '#fff', borderRadius: '0 16px 16px 0', overflow: 'auto' }}>
              <iframe src={calendarSrc} id={calendarId} style={{ width: '100%', height: '800px', border: 'none', overflow: 'hidden' }} />
            </div>
          </div>
        </div>
      )}

      {/* Page */}
      <div style={{ fontFamily: 'DM Sans, Inter, sans-serif', background: '#070b0f', minHeight: '100vh', color: '#ffffff', WebkitFontSmoothing: 'antialiased', position: 'relative', overflow: 'hidden' }}>

        {/* Stars background */}
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <SpaceBackground opacity={0.55} fixed />
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>

          {/* Header */}
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 24px', backdropFilter: 'blur(8px)', background: 'rgba(7,11,15,0.6)' }}>
            <div style={{ maxWidth: 900, margin: '0 auto', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <img
                src="https://assets.cdn.filesafe.space/NYlSya2nYSkSnnXEbY2l/media/69a9af9fb003fa7bb8bb92ee.png"
                alt="RevCore"
                style={{ height: 28, width: 'auto', filter: 'brightness(0) invert(1)' }}
              />
              <span style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.02em', fontFamily: 'DM Sans, sans-serif', color: '#ffffff' }}>
                Rev<span style={{ color: '#FE6462' }}>Core</span>
              </span>
            </div>
          </div>

          {/* Headline */}
          <section className="vsl-fade-up" style={{ padding: '60px 24px 36px', textAlign: 'center' }}>
            <span className="vsl-section-tag">{eyebrow}</span>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, lineHeight: 1.1, color: '#ffffff', maxWidth: 720, margin: '0 auto 16px', fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.02em' }}>
              {headline}
            </h1>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
              {subheadline}
            </p>
          </section>

          {/* Video */}
          <section style={{ padding: '0 24px 44px' }}>
            <div style={{ maxWidth: 860, margin: '0 auto' }}>
              <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', boxShadow: '0 32px 100px rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ position: 'relative', paddingBottom: '57.6%', height: 0 }}>
                  <iframe
                    src={`https://www.loom.com/embed/${mainVideoLoomId}`}
                    allowFullScreen
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Mid CTA */}
          <section style={{ padding: '0 24px 80px', textAlign: 'center' }}>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.45)', marginBottom: 28, maxWidth: 440, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
              {ctaText}
            </p>
            <div style={{ opacity: ctaVisible ? 1 : 0, transform: ctaVisible ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}>
              <button className="vsl-btn" onClick={() => setModalOpen(true)}>
                Schedule Your Free Call
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <p style={{ marginTop: 12, fontSize: '0.8rem', color: 'rgba(255,255,255,0.25)' }}>
                Free strategy session &nbsp;&middot;&nbsp; No obligation &nbsp;&middot;&nbsp; Limited territories
              </p>
            </div>
          </section>

          {/* Social Proof */}
          <section style={{ padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <span className="vsl-section-tag">Client Results</span>
                <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, color: '#ffffff', fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.02em' }}>
                  What Contractors Are Saying
                </h2>
              </div>

              {/* Screenshot grid */}
              <div className="vsl-proof-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 16 }}>
                {TESTIMONIAL_IMAGES.slice(0, 3).map((src, i) => (
                  <div key={i} className="vsl-testimonial-card">
                    <img src={src} alt="Client result" style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </div>
                ))}
              </div>
              <div className="vsl-proof-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 48 }}>
                {TESTIMONIAL_IMAGES.slice(3).map((src, i) => (
                  <div key={i} className="vsl-testimonial-card">
                    <img src={src} alt="Client result" style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </div>
                ))}
              </div>

              {/* ── Featured Video Testimonial — Aquatic Pools ── */}
              <div style={{
                borderRadius: 20, overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                marginBottom: 48,
              }}>
                <div className="vsl-featured-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                  {/* Video side */}
                  <div style={{ position: 'relative', background: '#000' }}>
                    <div style={{ position: 'relative', paddingBottom: '177.78%', height: 0 }}>
                      <iframe
                        src="https://www.loom.com/embed/f56aca282489411496eb44f81f60a6f0"
                        frameBorder="0"
                        allowFullScreen
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                      />
                    </div>
                  </div>

                  {/* Details side */}
                  <div style={{ padding: '40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    {/* Logo + badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                      <img
                        src="https://assets.cdn.filesafe.space/RAmAO69TYtGlSS2rVnm9/media/69a5e65c9c149958e1420465.png"
                        alt="Aquatic Pool & Spa"
                        style={{ height: 48, width: 'auto', borderRadius: 8 }}
                      />
                      <div>
                        <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: '#fff', lineHeight: 1.2 }}>Aquatic Pool & Spa</div>
                        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', fontWeight: 500, marginTop: 2 }}>Phoenix, Arizona</div>
                      </div>
                    </div>

                    {/* Pull quote */}
                    <div style={{ position: 'relative', marginBottom: 28 }}>
                      <div style={{ position: 'absolute', top: -8, left: -4, fontSize: '3rem', color: 'rgba(254,100,98,0.2)', fontFamily: 'Georgia, serif', lineHeight: 1 }}>&ldquo;</div>
                      <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, fontStyle: 'italic', paddingLeft: 20, fontFamily: 'DM Sans, sans-serif' }}>
                        He pretty much has 10x&apos;d our calls since we had him on board. Now we&apos;re coming up with different ideas to put more staff in place just because of the amount of new customers and new projects.
                      </p>
                    </div>

                    {/* Key results */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 10,
                        background: 'rgba(254,100,98,0.08)', border: '1px solid rgba(254,100,98,0.2)',
                        padding: '10px 18px', borderRadius: 100,
                      }}>
                        <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="#FE6462" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                          <polyline points="17 6 23 6 23 12" />
                        </svg>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FE6462', fontFamily: 'DM Sans, sans-serif' }}>12x Increase in Booked Qualified Appointments</span>
                      </div>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 10,
                        background: 'rgba(148,217,107,0.08)', border: '1px solid rgba(148,217,107,0.2)',
                        padding: '10px 18px', borderRadius: 100,
                      }}>
                        <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="#94D96B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94D96B', fontFamily: 'DM Sans, sans-serif' }}>$64K Closed on First Estimate</span>
                      </div>
                    </div>

                    {/* Services used */}
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 10, fontFamily: 'DM Sans, sans-serif' }}>
                        Active RevCore Services
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {['Custom Website', 'Paid Meta Ads', 'SEO Optimization', 'GMB Optimization', 'Sales Software', 'CRM & Automation'].map(svc => (
                          <span key={svc} style={{
                            fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.55)',
                            padding: '5px 12px', borderRadius: 100,
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                            fontFamily: 'DM Sans, sans-serif',
                          }}>
                            {svc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Portrait video testimonials */}
              <div className="vsl-video-testimonials" style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
                {VIDEO_TESTIMONIAL_IDS.map((id) => (
                  <div key={id} style={{ maxWidth: 300, width: '100%', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 16px 60px rgba(0,0,0,0.5)', background: '#000', position: 'relative', aspectRatio: '9/16' }}>
                    <div style={{ position: 'relative', paddingBottom: '177.78%', height: 0 }}>
                      <iframe
                        src={`https://www.loom.com/embed/${id}`}
                        allowFullScreen
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Bottom CTA */}
          <section style={{ padding: '96px 24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ maxWidth: 640, margin: '0 auto' }}>
              <span className="vsl-section-tag">Don&rsquo;t Wait</span>
              <h2 style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', fontWeight: 800, color: '#ffffff', marginBottom: 20, lineHeight: 1.1, fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.02em' }}>
                Ready to Scale Your Business?
              </h2>
              <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.45)', marginBottom: 36, lineHeight: 1.7 }}>
                Book your free 15-minute strategy call and discover how to add 7 figures to your annual revenue with exclusive qualified appointments in your territory.
              </p>
              <button className="vsl-btn" onClick={() => setModalOpen(true)}>
                Schedule Your Call Now
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <p style={{ marginTop: 12, fontSize: '0.8rem', color: 'rgba(255,255,255,0.2)' }}>Limited territories available</p>

              <div style={{ marginTop: 48, paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.25)', marginBottom: 12 }}>Want to learn more about what we do?</p>
                <a href="https://www.revcorehq.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.02em', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: 2, transition: 'color 0.2s, border-color 0.2s' }}
                  onMouseOver={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#FE6462'; (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = '#FE6462'; }}
                  onMouseOut={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)'; (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = 'rgba(255,255,255,0.2)'; }}
                >
                  Visit revcorehq.com &rarr;
                </a>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '28px 24px', textAlign: 'center', background: 'rgba(0,0,0,0.2)' }}>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.18)' }}>&copy; 2026 RevCore. All Rights Reserved.</p>
          </div>

        </div>
      </div>

      <script src="https://link.msgsndr.com/js/form_embed.js" async />
    </>
  );
}
