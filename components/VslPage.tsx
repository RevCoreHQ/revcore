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
  /** Seconds before CTA button appears. 0 = show immediately. */
  ctaDelaySecs?: number;
}

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
          background-color: #0A0A0A;
          color: #ffffff;
          padding: 14px 32px;
          border-radius: 100px;
          font-size: 0.875rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.2s ease;
          letter-spacing: 0.02em;
        }
        .vsl-btn:hover {
          background-color: #FE6462;
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
          color: #6B6B6B;
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
        @keyframes vslModalIn {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @media (max-width: 900px) {
          .vsl-modal-grid { grid-template-columns: 1fr !important; height: 98vh !important; }
          .vsl-modal-left { display: none !important; }
          .vsl-modal-cal  { border-radius: 16px !important; }
        }
        @media (max-width: 600px) {
          .vsl-modal-grid { height: 100vh !important; border-radius: 12px !important; max-width: 100vw !important; }
          .vsl-modal-cal  { border-radius: 12px !important; }
          .vsl-modal-cal iframe { height: 100vh !important; min-height: 100vh !important; }
        }
        @keyframes vslFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .vsl-fade-up { animation: vslFadeUp 0.5s ease forwards; }
      `}</style>

      {/* Booking Modal */}
      {modalOpen && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            className="vsl-modal-grid"
            style={{
              background: '#0A0A0A', borderRadius: 16,
              maxWidth: 1000, width: '100%', height: '80vh',
              overflow: 'hidden',
              display: 'grid', gridTemplateColumns: '340px 1fr',
              position: 'relative',
              animation: 'vslModalIn 0.35s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <button
              onClick={() => setModalOpen(false)}
              style={{
                position: 'absolute', top: 16, right: 16,
                width: 36, height: 36,
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '50%', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10, transition: 'background 0.2s',
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="#fff" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Left panel */}
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
                {modalTitle}<br/>
                <span style={{ color: '#FE6462' }}>{modalTitleAccent}</span>
              </h2>

              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: 32, fontFamily: 'DM Sans, sans-serif' }}>
                {modalDescription}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
                {[
                  { label: 'Quick 15-Min Call',  desc: 'No fluff. Just real answers to your questions.',         color: '#FE6462', check: false },
                  { label: 'Territory Check',    desc: 'Confirm exclusive rights are available in your market.', color: '#94D96B', check: true  },
                  { label: 'Zero Obligation',    desc: '100% free strategy call. No pressure, just value.',      color: '#94D96B', check: true  },
                ].map(({ label, desc, color, check }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                      background: `${color}1a`, border: `1px solid ${color}33`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" width="13" height="13">
                        {check ? <path d="M5 13l4 4L19 7"/> : <path d="M13 7l5 5m0 0l-5 5m5-5H6"/>}
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff', marginBottom: 2, fontFamily: 'DM Sans, sans-serif' }}>{label}</p>
                      <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.5, fontFamily: 'DM Sans, sans-serif' }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.3)', lineHeight: 1.6, paddingLeft: 14, borderLeft: '2px solid rgba(254,100,98,0.4)', fontFamily: 'DM Sans, sans-serif' }}>
                {modalTestimonial}
              </p>
            </div>

            {/* Calendar */}
            <div className="vsl-modal-cal" style={{ background: '#fff', borderRadius: '0 16px 16px 0', overflow: 'auto' }}>
              <iframe src={calendarSrc} id={calendarId} style={{ width: '100%', height: '800px', border: 'none', overflow: 'hidden' }} />
            </div>
          </div>
        </div>
      )}

      {/* Page */}
      <div style={{ fontFamily: 'DM Sans, Inter, sans-serif', background: '#ffffff', minHeight: '100vh', color: '#0A0A0A', WebkitFontSmoothing: 'antialiased' }}>

        {/* Header bar */}
        <div style={{ borderBottom: '1px solid #f0f0f0', padding: '0 24px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src="https://assets.cdn.filesafe.space/NYlSya2nYSkSnnXEbY2l/media/69a9af9fb003fa7bb8bb92ee.png"
              alt="RevCore"
              style={{ height: 30, width: 'auto' }}
            />
          </div>
        </div>

        {/* Headline block */}
        <section className="vsl-fade-up" style={{ padding: '56px 24px 32px', textAlign: 'center' }}>
          <span className="vsl-section-tag">{eyebrow}</span>
          <h1 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, lineHeight: 1.1,
            color: '#0A0A0A', maxWidth: 720, margin: '0 auto 16px',
            fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.02em',
          }}>
            {headline}
          </h1>
          <p style={{ fontSize: '1rem', color: '#6B6B6B', maxWidth: 480, margin: '0 auto', lineHeight: 1.6, fontFamily: 'DM Sans, sans-serif' }}>
            {subheadline}
          </p>
        </section>

        {/* Video */}
        <section style={{ padding: '0 24px 40px' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <div style={{
              position: 'relative', borderRadius: 16, overflow: 'hidden',
              boxShadow: '0 20px 80px rgba(0,0,0,0.10)',
              border: '1px solid #ebebeb',
            }}>
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

        {/* CTA */}
        <section style={{ padding: '0 24px 80px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.95rem', color: '#6B6B6B', marginBottom: 24, maxWidth: 440, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6, fontFamily: 'DM Sans, sans-serif' }}>
            {ctaText}
          </p>

          <div style={{
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}>
            <button className="vsl-btn" onClick={() => setModalOpen(true)}>
              Schedule Your Free Call
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <p style={{ marginTop: 12, fontSize: '0.8rem', color: '#bbb', fontFamily: 'DM Sans, sans-serif' }}>
              Free strategy session &nbsp;&middot;&nbsp; No obligation &nbsp;&middot;&nbsp; Limited territories
            </p>
          </div>
        </section>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #f0f0f0', padding: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: '#ccc', fontFamily: 'DM Sans, sans-serif' }}>&copy; 2026 RevCore. All Rights Reserved.</p>
        </div>
      </div>

      <script src="https://link.msgsndr.com/js/form_embed.js" async />
    </>
  );
}
