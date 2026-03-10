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
      {/* Booking Modal */}
      {modalOpen && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <style>{`
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
              .vsl-modal-cal  { border-radius: 12px !important; min-height: 100vh !important; }
              .vsl-modal-cal iframe { height: 100vh !important; min-height: 100vh !important; }
            }
          `}</style>
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
                background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10, transition: 'background 0.2s',
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke="#fff" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Left panel */}
            <div
              className="vsl-modal-left"
              style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto' }}
            >
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(254,100,98,0.15)', border: '1px solid rgba(254,100,98,0.3)',
                padding: '8px 16px', borderRadius: 999, marginBottom: 24, width: 'fit-content',
              }}>
                <svg viewBox="0 0 24 24" fill="#FE6462" width="14" height="14">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FE6462', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {modalBadge}
                </span>
              </div>

              <h2 style={{ fontSize: 'clamp(1.75rem,3vw,2.25rem)', fontWeight: 800, lineHeight: 1.15, color: '#fff', marginBottom: 20, fontFamily: 'DM Sans, sans-serif' }}>
                {modalTitle}<br/>
                <span style={{ color: '#FE6462' }}>{modalTitleAccent}</span>
              </h2>

              <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: 32 }}>
                {modalDescription}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32 }}>
                {[
                  { label: 'Quick 15-Min Call',  desc: 'No fluff, no sales pitch. Just real answers to your questions.', color: '#FE6462', check: false },
                  { label: 'Territory Check',    desc: 'Confirm availability for exclusive rights in your city.',          color: '#94D96B', check: true  },
                  { label: 'Zero Obligation',    desc: '100% free strategy call. No pressure, just value.',               color: '#94D96B', check: true  },
                ].map(({ label, desc, color, check }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                      background: `${color}22`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" width="16" height="16">
                        {check ? <path d="M5 13l4 4L19 7"/> : <path d="M13 7l5 5m0 0l-5 5m5-5H6"/>}
                      </svg>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: 4, fontFamily: 'DM Sans, sans-serif' }}>{label}</h4>
                      <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: '#64748b', lineHeight: 1.6, paddingLeft: 16, borderLeft: '2px solid rgba(254,100,98,0.5)' }}>
                {modalTestimonial}
              </p>
            </div>

            {/* Calendar */}
            <div
              className="vsl-modal-cal"
              style={{ background: '#fff', borderRadius: '0 16px 16px 0', overflow: 'auto' }}
            >
              <iframe src={calendarSrc} id={calendarId} style={{ width: '100%', height: '800px', border: 'none', overflow: 'hidden' }} />
            </div>
          </div>
        </div>
      )}

      {/* Page */}
      <div style={{ fontFamily: 'DM Sans, Inter, sans-serif', background: '#fff', minHeight: '100vh', color: '#0A0A0A', WebkitFontSmoothing: 'antialiased' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '32px 24px 24px' }}>
          <img
            src="https://storage.googleapis.com/msgsndr/NYlSya2nYSkSnnXEbY2l/media/69514b24e889d3ac7eb29278.png"
            alt="RevCore"
            style={{ height: 38, width: 'auto' }}
          />
          <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', fontFamily: 'DM Sans, sans-serif' }}>
            <span style={{ color: '#0A0A0A' }}>Rev</span><span style={{ color: '#FE6462' }}>Core</span>
          </span>
        </div>

        {/* Headline block */}
        <section style={{ padding: '8px 24px 32px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: '#6B6B6B', marginBottom: '1rem',
          }}>
            <span style={{ width: 20, height: 2, background: '#FE6462', display: 'block', flexShrink: 0 }} />
            {eyebrow}
            <span style={{ width: 20, height: 2, background: '#FE6462', display: 'block', flexShrink: 0 }} />
          </div>
          <h1 style={{
            fontSize: 'clamp(1.75rem, 4.5vw, 3rem)', fontWeight: 800, lineHeight: 1.1,
            color: '#0A0A0A', maxWidth: 760, margin: '0 auto 16px',
            fontFamily: 'DM Sans, sans-serif', textTransform: 'uppercase',
            letterSpacing: '-0.01em',
          }}>
            {headline}
          </h1>
          <p style={{ fontSize: '1rem', color: '#6B6B6B', maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
            {subheadline}
          </p>
        </section>

        {/* Video — focal point of the page */}
        <section style={{ padding: '0 24px 40px' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <div style={{
              position: 'relative', borderRadius: 12, overflow: 'hidden',
              boxShadow: '0 24px 80px rgba(0,0,0,0.14)',
              border: '1px solid #f0f0f0',
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

        {/* CTA — single action, no noise */}
        <section style={{ padding: '0 24px 80px', textAlign: 'center' }}>
          <p style={{ fontSize: '1rem', color: '#6B6B6B', marginBottom: 24, maxWidth: 440, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            {ctaText}
          </p>

          <div style={{
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}>
            <button
              onClick={() => setModalOpen(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: '#0A0A0A', color: '#fff',
                fontSize: '0.875rem', fontWeight: 700,
                padding: '16px 40px', border: 'none', borderRadius: 100,
                cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em',
                transition: 'background 0.2s, transform 0.2s',
                fontFamily: 'DM Sans, sans-serif',
              }}
              onMouseOver={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#FE6462';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#0A0A0A';
                (e.currentTarget as HTMLButtonElement).style.transform = '';
              }}
            >
              Schedule Your Free Call
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <p style={{ marginTop: 12, fontSize: '0.8rem', color: '#bbb', letterSpacing: '0.02em' }}>
              Free strategy session &mdash; no obligation &mdash; limited territories
            </p>
          </div>
        </section>

        {/* Minimal footer */}
        <footer style={{ borderTop: '1px solid #f0f0f0', padding: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: '#bbb' }}>&copy; 2026 RevCore. All Rights Reserved.</p>
        </footer>
      </div>

      <script src="https://link.msgsndr.com/js/form_embed.js" async />
    </>
  );
}
