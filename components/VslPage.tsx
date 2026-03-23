'use client';

import { useState, useEffect } from 'react';

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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .vsl-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: linear-gradient(180deg, #EE3030 0%, #C92020 100%);
          color: #ffffff;
          padding: 20px 48px;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 800;
          font-family: 'Inter', sans-serif;
          border: none;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          letter-spacing: 0.02em;
          box-shadow: 0 4px 20px rgba(238,48,48,0.3);
          text-transform: uppercase;
        }
        .vsl-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(238,48,48,0.45);
        }
        .vsl-testimonial-card {
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #E4EAF0;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          background: #fff;
        }
        .vsl-testimonial-card:hover {
          transform: scale(1.02);
          box-shadow: 0 12px 40px rgba(27,43,64,0.12);
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
          .vsl-hero-h1 { font-size: 2.8rem !important; }
        }
        @media (max-width: 600px) {
          .vsl-modal-grid { height: 100vh !important; border-radius: 12px !important; max-width: 100vw !important; }
          .vsl-modal-cal  { border-radius: 12px !important; }
          .vsl-modal-cal iframe { height: 100vh !important; min-height: 100vh !important; }
          .vsl-proof-grid { grid-template-columns: 1fr 1fr !important; }
          .vsl-hero-h1 { font-size: 2rem !important; }
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
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(10px)',
            zIndex: 10000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            className="vsl-modal-grid"
            style={{
              background: '#1B2B40', borderRadius: 16,
              maxWidth: 1000, width: '100%', height: '80vh',
              overflow: 'hidden',
              display: 'grid', gridTemplateColumns: '340px 1fr',
              position: 'relative',
              border: '1px solid rgba(255,255,255,0.1)',
              animation: 'vslModalIn 0.35s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <button
              onClick={() => setModalOpen(false)}
              style={{
                position: 'absolute', top: 16, right: 16,
                width: 36, height: 36,
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '50%', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="#fff" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div className="vsl-modal-left" style={{ padding: '40px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(238,48,48,0.12)', border: '1px solid rgba(238,48,48,0.25)',
                padding: '6px 14px', borderRadius: 999, marginBottom: 28, width: 'fit-content',
              }}>
                <svg viewBox="0 0 24 24" fill="#EE3030" width="12" height="12">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#EE3030', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'Inter, sans-serif' }}>
                  {modalBadge}
                </span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.6rem,2.5vw,2rem)', fontWeight: 800, lineHeight: 1.15, color: '#fff', marginBottom: 16, fontFamily: 'Inter, sans-serif' }}>
                {modalTitle}<br/><span style={{ color: '#17AF84' }}>{modalTitleAccent}</span>
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 32, fontFamily: 'Inter, sans-serif' }}>
                {modalDescription}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
                {[
                  { label: 'Quick 15-Min Call',  desc: 'No fluff. Just real answers to your questions.',         color: '#EE3030', check: false },
                  { label: 'Territory Check',    desc: 'Confirm exclusive rights are available in your market.', color: '#17AF84', check: true  },
                  { label: 'Zero Obligation',    desc: '100% free strategy call. No pressure, just value.',      color: '#17AF84', check: true  },
                ].map(({ label, desc, color, check }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, marginTop: 1, background: `${color}1a`, border: `1px solid ${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" width="13" height="13">
                        {check ? <path d="M5 13l4 4L19 7"/> : <path d="M13 7l5 5m0 0l-5 5m5-5H6"/>}
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff', marginBottom: 2, fontFamily: 'Inter, sans-serif' }}>{label}</p>
                      <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5, fontFamily: 'Inter, sans-serif' }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.35)', lineHeight: 1.6, paddingLeft: 14, borderLeft: '2px solid rgba(238,48,48,0.4)', fontFamily: 'Inter, sans-serif' }}>
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
      <div style={{ fontFamily: 'Inter, sans-serif', background: '#ffffff', minHeight: '100vh', color: '#000', WebkitFontSmoothing: 'antialiased', position: 'relative', overflow: 'hidden' }}>

        <div style={{ position: 'relative', zIndex: 1 }}>

          {/* Dark urgency bar */}
          <div style={{ background: '#333', padding: '12px 24px', textAlign: 'center' }}>
            <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff', letterSpacing: '0.04em', fontFamily: 'Inter, sans-serif', margin: 0 }}>
              <span style={{ color: '#EE3030', fontWeight: 700 }}>&#9679;</span>
              &nbsp;&nbsp;Only onboarding <strong>3 more clients</strong> for {(() => { const q = Math.ceil((new Date().getMonth() + 1) / 3); return `Q${q} ${new Date().getFullYear()}`; })()}
            </p>
          </div>

          {/* Header */}
          <div style={{ padding: '0 24px', background: '#ffffff', borderBottom: '1px solid #eee' }}>
            <div style={{ maxWidth: 1000, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <img
                src="https://assets.cdn.filesafe.space/NYlSya2nYSkSnnXEbY2l/media/69a9af9fb003fa7bb8bb92ee.png"
                alt="RevCore"
                style={{ height: 26, width: 'auto', filter: 'brightness(0)' }}
              />
              <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', fontFamily: 'Inter, sans-serif', color: '#000' }}>
                Rev<span style={{ color: '#EE3030' }}>Core</span>
              </span>
            </div>
          </div>

          {/* Hero — Eyebrow + Massive Headline */}
          <section className="vsl-fade-up" style={{ padding: '80px 24px 40px', textAlign: 'center' }}>
            <p style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: '1.05rem', fontWeight: 600, color: '#17AF84', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 20, fontFamily: 'Inter, sans-serif' }}>
              <img
                src="https://assets.cdn.filesafe.space/NYlSya2nYSkSnnXEbY2l/media/69a9af9fb003fa7bb8bb92ee.png"
                alt=""
                style={{ height: 18, width: 'auto', filter: 'brightness(0) saturate(100%) invert(56%) sepia(62%) saturate(487%) hue-rotate(109deg) brightness(96%) contrast(91%)' }}
              />
              RevCore Presents...
            </p>
            <h1 className="vsl-hero-h1" style={{ fontSize: 'clamp(2.8rem, 6.5vw, 4.5rem)', fontWeight: 700, lineHeight: 1.12, color: '#222', maxWidth: 1000, margin: '0 auto 28px', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
              {headline}
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>
              {subheadline}
            </p>
          </section>

          {/* Video */}
          <section style={{ padding: '12px 16px 48px' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, background: '#000' }}>
                <iframe
                  src={`https://www.loom.com/embed/${mainVideoLoomId}`}
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                />
              </div>
            </div>
          </section>

          {/* CTA right below video */}
          <section style={{ padding: '0 24px 64px', textAlign: 'center' }}>
            <div style={{ opacity: ctaVisible ? 1 : 0, transform: ctaVisible ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}>
              <button className="vsl-btn" onClick={() => setModalOpen(true)}>
                Schedule Your Free Strategy Call
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <p style={{ marginTop: 14, fontSize: '0.82rem', color: '#999' }}>
                Free &nbsp;&middot;&nbsp; No obligation &nbsp;&middot;&nbsp; Limited territories available
              </p>
            </div>
          </section>

          {/* Divider line */}
          <div style={{ maxWidth: 1100, margin: '0 auto', borderTop: '1px solid #eee' }} />

          {/* Weekly Client Spotlight */}
          <section style={{ padding: '64px 24px 60px' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>

              {/* Spotlight header */}
              <div style={{ textAlign: 'center', marginBottom: 36 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(238,48,48,0.06)', border: '1px solid rgba(238,48,48,0.12)', padding: '8px 20px', borderRadius: 100, marginBottom: 16 }}>
                  <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="#EE3030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#EE3030', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'Inter, sans-serif' }}>Weekly Client Spotlight</span>
                </div>
                <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: '#222', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em', marginBottom: 10 }}>
                  See What&rsquo;s Possible With RevCore
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#888', maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
                  Every week we feature a client who&rsquo;s winning with RevCore. Here&rsquo;s this week&rsquo;s spotlight.
                </p>
              </div>

              {/* Featured testimonial card */}
              <div style={{
                borderRadius: 12, overflow: 'hidden',
                background: '#f9f9f9',
                border: '1px solid #eee',
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                      <img
                        src="https://assets.cdn.filesafe.space/RAmAO69TYtGlSS2rVnm9/media/69a5e65c9c149958e1420465.png"
                        alt="Aquatic Pool & Spa"
                        style={{ height: 48, width: 'auto', borderRadius: 8 }}
                      />
                      <div>
                        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: '#000', lineHeight: 1.2 }}>Aquatic Pool &amp; Spa</div>
                        <div style={{ fontSize: '0.75rem', color: '#999', fontWeight: 500, marginTop: 2 }}>Phoenix, Arizona</div>
                      </div>
                    </div>

                    <div style={{ position: 'relative', marginBottom: 28 }}>
                      <div style={{ position: 'absolute', top: -8, left: -4, fontSize: '3rem', color: 'rgba(0,0,0,0.06)', fontFamily: 'Georgia, serif', lineHeight: 1 }}>&ldquo;</div>
                      <p style={{ fontSize: '1.05rem', color: '#555', lineHeight: 1.7, fontStyle: 'italic', paddingLeft: 20, fontFamily: 'Inter, sans-serif' }}>
                        He pretty much has 10x&apos;d our calls since we had him on board. Now we&apos;re coming up with different ideas to put more staff in place just because of the amount of new customers and new projects.
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(238,48,48,0.06)', border: '1px solid rgba(238,48,48,0.15)', padding: '10px 18px', borderRadius: 100 }}>
                        <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="#EE3030" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#EE3030', fontFamily: 'Inter, sans-serif' }}>12x Booked Qualified Appointments</span>
                      </div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(23,175,132,0.06)', border: '1px solid rgba(23,175,132,0.15)', padding: '10px 18px', borderRadius: 100 }}>
                        <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="#17AF84" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#17AF84', fontFamily: 'Inter, sans-serif' }}>$64K Closed on First Estimate</span>
                      </div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(23,175,132,0.06)', border: '1px solid rgba(23,175,132,0.15)', padding: '10px 18px', borderRadius: 100 }}>
                        <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="#17AF84" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#17AF84', fontFamily: 'Inter, sans-serif' }}>6 Figures Added in First 90 Days</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                      {['Hired a full-time sales representative', 'Expanding production team', 'Now offering custom landscaping services'].map(item => (
                        <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="#17AF84" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', fontFamily: 'Inter, sans-serif' }}>{item}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', marginBottom: 10, fontFamily: 'Inter, sans-serif' }}>Active RevCore Services</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {['Custom Website', 'Paid Meta Ads', 'SEO Optimization', 'GMB Optimization', 'Sales Software', 'CRM & Automation'].map(svc => (
                          <span key={svc} style={{ fontSize: '0.7rem', fontWeight: 600, color: '#666', padding: '5px 12px', borderRadius: 100, background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', fontFamily: 'Inter, sans-serif' }}>{svc}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Mid CTA */}
          <section style={{ padding: '0 24px 80px', textAlign: 'center' }}>
            <p style={{ fontSize: '1rem', color: '#666', marginBottom: 28, maxWidth: 460, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
              {ctaText}
            </p>
            <div style={{ opacity: ctaVisible ? 1 : 0, transform: ctaVisible ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}>
              <button className="vsl-btn" onClick={() => setModalOpen(true)}>
                Schedule Your Free Call
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </section>

          {/* Social Proof */}
          <section style={{ padding: '80px 24px', borderTop: '1px solid #eee', background: '#f7f7f7' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#17AF84', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 12, fontFamily: 'Inter, sans-serif' }}>Client Results</p>
                <h2 style={{ fontSize: 'clamp(1.5rem,3.5vw,2.4rem)', fontWeight: 700, color: '#222', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em' }}>
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

              {/* Featured Video Testimonial label */}
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #eee', padding: '6px 16px', borderRadius: 100 }}>
                  <svg viewBox="0 0 24 24" fill="none" width="12" height="12" stroke="#EE3030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Inter, sans-serif' }}>Featured Video Testimonial</span>
                </div>
              </div>

              {/* Featured Video Testimonial — Aquatic Pools */}
              <div style={{
                borderRadius: 12, overflow: 'hidden',
                background: '#ffffff',
                border: '1px solid #eee',
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                      <img
                        src="https://assets.cdn.filesafe.space/RAmAO69TYtGlSS2rVnm9/media/69a5e65c9c149958e1420465.png"
                        alt="Aquatic Pool & Spa"
                        style={{ height: 48, width: 'auto', borderRadius: 8 }}
                      />
                      <div>
                        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: '#000', lineHeight: 1.2 }}>Aquatic Pool &amp; Spa</div>
                        <div style={{ fontSize: '0.75rem', color: '#999', fontWeight: 500, marginTop: 2 }}>Phoenix, Arizona</div>
                      </div>
                    </div>

                    <div style={{ position: 'relative', marginBottom: 28 }}>
                      <div style={{ position: 'absolute', top: -8, left: -4, fontSize: '3rem', color: 'rgba(0,0,0,0.06)', fontFamily: 'Georgia, serif', lineHeight: 1 }}>&ldquo;</div>
                      <p style={{ fontSize: '1.05rem', color: '#555', lineHeight: 1.7, fontStyle: 'italic', paddingLeft: 20, fontFamily: 'Inter, sans-serif' }}>
                        He pretty much has 10x&apos;d our calls since we had him on board. Now we&apos;re coming up with different ideas to put more staff in place just because of the amount of new customers and new projects.
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(238,48,48,0.06)', border: '1px solid rgba(238,48,48,0.15)', padding: '10px 18px', borderRadius: 100 }}>
                        <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="#EE3030" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#EE3030', fontFamily: 'Inter, sans-serif' }}>12x Booked Qualified Appointments</span>
                      </div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(23,175,132,0.06)', border: '1px solid rgba(23,175,132,0.15)', padding: '10px 18px', borderRadius: 100 }}>
                        <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="#17AF84" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#17AF84', fontFamily: 'Inter, sans-serif' }}>$64K Closed on First Estimate</span>
                      </div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(23,175,132,0.06)', border: '1px solid rgba(23,175,132,0.15)', padding: '10px 18px', borderRadius: 100 }}>
                        <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="#17AF84" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#17AF84', fontFamily: 'Inter, sans-serif' }}>6 Figures Added in First 90 Days</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                      {['Hired a full-time sales representative', 'Expanding production team', 'Now offering custom landscaping services'].map(item => (
                        <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="#17AF84" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', fontFamily: 'Inter, sans-serif' }}>{item}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', marginBottom: 10, fontFamily: 'Inter, sans-serif' }}>Active RevCore Services</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {['Custom Website', 'Paid Meta Ads', 'SEO Optimization', 'GMB Optimization', 'Sales Software', 'CRM & Automation'].map(svc => (
                          <span key={svc} style={{ fontSize: '0.7rem', fontWeight: 600, color: '#666', padding: '5px 12px', borderRadius: 100, background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', fontFamily: 'Inter, sans-serif' }}>{svc}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Portrait video testimonials */}
              <div className="vsl-video-testimonials" style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
                {VIDEO_TESTIMONIAL_IDS.map((id) => (
                  <div key={id} style={{ maxWidth: 300, width: '100%', borderRadius: 8, overflow: 'hidden', border: '1px solid #eee', background: '#000', position: 'relative', aspectRatio: '9/16' }}>
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

          {/* Bottom CTA — dark section */}
          <section style={{ padding: '96px 24px', textAlign: 'center', background: '#111' }}>
            <div style={{ maxWidth: 640, margin: '0 auto' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#EE3030', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 16, fontFamily: 'Inter, sans-serif' }}>Don&rsquo;t Wait</p>
              <h2 style={{ fontSize: 'clamp(1.75rem,4.5vw,2.8rem)', fontWeight: 700, color: '#ffffff', marginBottom: 20, lineHeight: 1.12, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                Ready to Scale Your Business?
              </h2>
              <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', marginBottom: 40, lineHeight: 1.7 }}>
                Book your free 15-minute strategy call and discover how to add 7 figures to your annual revenue with exclusive qualified appointments in your territory.
              </p>
              <button className="vsl-btn" onClick={() => setModalOpen(true)}>
                Schedule Your Call Now
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <p style={{ marginTop: 14, fontSize: '0.82rem', color: 'rgba(255,255,255,0.3)' }}>Limited territories available</p>

              <div style={{ marginTop: 56, paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.35)', marginBottom: 14 }}>Want to learn more about what we do?</p>
                <a href="https://www.revcorehq.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#EE3030', textDecoration: 'none', fontFamily: 'Inter, sans-serif', letterSpacing: '0.02em', transition: 'opacity 0.2s' }}
                  onMouseOver={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.7'; }}
                  onMouseOut={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
                >
                  Visit revcorehq.com &rarr;
                </a>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div style={{ padding: '28px 24px', textAlign: 'center', background: '#0a0a0a' }}>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'Inter, sans-serif' }}>&copy; 2026 RevCore. All Rights Reserved.</p>
          </div>

        </div>
      </div>

      <script src="https://link.msgsndr.com/js/form_embed.js" async />
    </>
  );
}
