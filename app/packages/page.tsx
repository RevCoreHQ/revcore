'use client';

import { useState, useEffect, useRef } from 'react';
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
/* Light-first styles matching home page theme */
const S = {
  /* Light sections (default) */
  section: { padding: '96px 0', position: 'relative' as const },
  /* Dark accent sections */
  sectionDark: { padding: '96px 0', position: 'relative' as const, background: '#0A0A0A', color: '#fff' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative' as const, zIndex: 1 },
  /* Light-mode eyebrow */
  eyebrow: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em',
    textTransform: 'uppercase' as const, color: '#6B6B6B', marginBottom: '1rem',
  },
  /* Dark-mode eyebrow */
  eyebrowDark: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em',
    textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.35)', marginBottom: '1rem',
  },
  h2: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
    fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#0A0A0A', marginBottom: '1rem',
  },
  h2Dark: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
    fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'white', marginBottom: '1rem',
  },
  sub: { color: '#6B6B6B', maxWidth: '700px', margin: '0 auto', lineHeight: 1.8, fontSize: '1rem' },
  subDark: { color: 'rgba(255,255,255,0.4)', maxWidth: '700px', margin: '0 auto', lineHeight: 1.8, fontSize: '1rem' },
  accent: '#FE6462',
  card: {
    background: '#ffffff',
    borderRadius: '16px', border: '1px solid #E5E5E5',
  },
  cardDark: {
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
    <main style={{ background: '#F5F5F5', color: '#0A0A0A', position: 'relative', overflow: 'hidden' }}>
      <FunnelVisualization />
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

        /* ── Phone Demo Section ── */
        .phone-demo-container {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 80px;
          align-items: center;
        }
        .phone-steps {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .phone-step {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .phone-step:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.1);
        }
        .phone-step.active {
          background: rgba(254,100,98,0.08);
          border-color: rgba(254,100,98,0.25);
        }
        .phone-step-number {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          font-weight: 700;
          color: rgba(255,255,255,0.4);
          flex-shrink: 0;
          transition: all 0.3s ease;
        }
        .phone-step.active .phone-step-number {
          background: #FE6462;
          color: #fff;
        }
        .phone-step-title {
          font-size: 1.15rem;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 2px;
        }
        .phone-step-desc {
          font-size: 1rem;
          color: rgba(255,255,255,0.4);
        }

        /* Phone Device */
        .phone-device {
          position: relative;
          width: 380px;
          height: 770px;
          margin: 0 auto;
        }
        .phone-frame {
          position: absolute;
          inset: 0;
          background: linear-gradient(145deg, #2a2a3a 0%, #1a1a2a 50%, #151525 100%);
          border-radius: 48px;
          padding: 5px;
          box-shadow:
            0 40px 80px rgba(0,0,0,0.5),
            0 20px 40px rgba(0,0,0,0.4),
            inset 0 1px 2px rgba(255,255,255,0.08);
        }
        .phone-frame::before {
          content: '';
          position: absolute;
          right: -3px;
          top: 140px;
          width: 4px;
          height: 70px;
          background: linear-gradient(180deg, #333 0%, #222 100%);
          border-radius: 0 3px 3px 0;
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.2);
        }
        .phone-frame::after {
          content: '';
          position: absolute;
          left: -3px;
          top: 120px;
          width: 4px;
          height: 35px;
          background: linear-gradient(180deg, #333 0%, #222 100%);
          border-radius: 3px 0 0 3px;
          box-shadow:
            inset 0 1px 1px rgba(255,255,255,0.2),
            0 55px 0 0 #2a2a3a;
        }
        .phone-screen {
          width: 100%;
          height: 100%;
          background: #0A0A0A;
          border-radius: 44px;
          overflow: hidden;
          position: relative;
        }
        .phone-notch {
          position: absolute;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 28px;
          background: #000;
          border-radius: 20px;
          z-index: 10;
          box-shadow: 0 0 0 3px rgba(0,0,0,0.8);
        }
        .phone-notch::before {
          content: '';
          position: absolute;
          right: 18px;
          top: 50%;
          transform: translateY(-50%);
          width: 8px;
          height: 8px;
          background: radial-gradient(circle, #1a3a5c 0%, #0d1f30 60%, #000 100%);
          border-radius: 50%;
          box-shadow: inset 0 0 2px rgba(255,255,255,0.3);
        }
        .phone-screen-content {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        /* Phone Slides */
        .phone-slide {
          position: absolute;
          inset: 0;
          padding: 50px 16px 20px;
          opacity: 0;
          transform: translateX(100%);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
        }
        .phone-slide.active {
          opacity: 1;
          transform: translateX(0);
        }
        .phone-slide.prev {
          transform: translateX(-100%);
        }
        .phone-slide-header {
          text-align: center;
          margin-bottom: 16px;
          background: rgba(255,255,255,0.03);
          padding: 12px;
          border-radius: 8px;
        }
        .phone-slide-badge {
          display: inline-block;
          padding: 6px 12px;
          background: rgba(254,100,98,0.12);
          color: #FE6462;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border-radius: 20px;
          margin-bottom: 8px;
          border: 1px solid rgba(254,100,98,0.2);
        }
        .phone-slide-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #ffffff;
        }
        .phone-slide-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
          overflow-y: auto;
          color: rgba(255,255,255,0.5);
        }

        /* FB Ad Carousel */
        .fb-ad-carousel {
          flex: 1;
          position: relative;
          overflow: hidden;
        }
        .fb-ad-slide {
          display: none;
          flex-direction: column;
          height: 100%;
          animation: fbSlideIn 0.3s ease-out;
        }
        .fb-ad-slide.active { display: flex; }
        @keyframes fbSlideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .fb-feed-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 12px;
          background: rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .fb-logo-text {
          font-size: 1.2rem;
          font-weight: 700;
          color: rgba(255,255,255,0.3);
          letter-spacing: -0.5px;
        }
        .fb-ad-counter {
          font-size: 0.7rem;
          color: rgba(255,255,255,0.4);
          font-weight: 500;
        }
        .fb-post-compact {
          flex: 1;
          background: rgba(255,255,255,0.03);
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .fb-post-top {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
        }
        .fb-avatar-sm {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #ff7a1a, #e65c00);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: 700;
          color: #fff;
        }
        .fb-post-meta-sm {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .fb-page-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: #ffffff;
        }
        .fb-sponsored-tag {
          font-size: 0.65rem;
          color: rgba(255,255,255,0.35);
        }
        .fb-post-copy {
          padding: 0 12px 6px;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.4;
        }
        .fb-ad-media {
          flex: 1;
          position: relative;
          background: #f0f2f5;
          overflow: hidden;
          min-height: 220px;
        }
        .fb-ad-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .ad-type-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          z-index: 2;
        }
        .ad-type-badge.photo {
          background: rgba(255,255,255,0.95);
          color: #1877f2;
        }
        .ad-type-badge.video {
          background: rgba(255, 0, 80, 0.9);
          color: #fff;
        }
        .fb-engagement {
          display: flex;
          justify-content: space-between;
          padding: 6px 12px;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.3);
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .fb-ad-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 6px;
        }
        .fb-nav-arrow {
          width: 28px;
          height: 28px;
          border: none;
          background: rgba(255,255,255,0.08);
          border-radius: 50%;
          color: rgba(255,255,255,0.5);
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .fb-nav-arrow:hover {
          background: rgba(255,255,255,0.15);
          color: #fff;
        }
        .fb-ad-dots {
          display: flex;
          gap: 6px;
        }
        .fb-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          padding: 0;
        }
        .fb-dot.active {
          background: #FE6462;
          transform: scale(1.1);
        }

        /* Qualify Form */
        .qualify-form-container {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .qualify-form-header {
          padding: 12px 16px;
          background: #fff;
          text-align: center;
          border-bottom: 1px solid #e2e8f0;
        }
        .qualify-logo {
          font-size: 0.9rem;
          font-weight: 700;
          color: #ff7a1a;
        }
        .qualify-subtitle {
          font-size: 0.7rem;
          color: #718096;
          margin-top: 2px;
        }
        .qualify-questions {
          flex: 1;
          padding: 12px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .qualify-question {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 10px 12px;
        }
        .qualify-question.answered {
          border-color: rgba(34, 197, 94, 0.3);
          background: rgba(34, 197, 94, 0.02);
        }
        .qualify-question-text {
          font-size: 0.75rem;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 6px;
        }
        .qualify-answer {
          font-size: 0.7rem;
          color: #16a34a;
          font-weight: 500;
        }
        .qualify-options {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .qualify-option {
          font-size: 0.65rem;
          padding: 4px 10px;
          border-radius: 12px;
          background: #f1f5f9;
          color: #64748b;
        }
        .qualify-option.selected {
          background: rgba(34, 197, 94, 0.15);
          color: #16a34a;
          font-weight: 600;
        }
        .qualify-submit-btn {
          margin: 12px;
          padding: 12px;
          background: #ff7a1a;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
        }

        /* Scheduler Calendar */
        .scheduler-container {
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .scheduler-header {
          padding: 12px 16px;
          background: #fff;
          text-align: center;
          border-bottom: 1px solid #e2e8f0;
        }
        .scheduler-logo {
          font-size: 0.9rem;
          font-weight: 700;
          color: #ff7a1a;
        }
        .scheduler-headline {
          font-size: 1rem;
          font-weight: 700;
          color: #1a202c;
          margin: 4px 0;
        }
        .scheduler-subhead {
          font-size: 0.65rem;
          color: #718096;
        }
        .scheduler-calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
          padding: 8px;
          background: #fff;
        }
        .scheduler-day-header {
          text-align: center;
          padding: 4px;
          font-size: 0.6rem;
          font-weight: 600;
          color: #718096;
        }
        .scheduler-day {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          color: #4a5568;
          border-radius: 4px;
          cursor: pointer;
        }
        .scheduler-day.available {
          background: rgba(34, 197, 94, 0.1);
          color: #16a34a;
          font-weight: 600;
        }
        .scheduler-day.selected {
          background: #ff7a1a;
          color: #fff;
        }
        .scheduler-day.past {
          color: #cbd5e0;
        }
        .scheduler-time-slots {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          padding: 10px;
          background: #f8fafc;
        }
        .scheduler-time-slot {
          padding: 8px;
          text-align: center;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 0.7rem;
          color: #4a5568;
          cursor: pointer;
        }
        .scheduler-time-slot.selected {
          background: #ff7a1a;
          border-color: #ff7a1a;
          color: #fff;
        }
        .scheduler-confirm-btn {
          width: calc(100% - 20px);
          margin: 10px;
          padding: 12px;
          background: #ff7a1a;
          border: none;
          border-radius: 8px;
          color: #fff;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
        }

        /* iOS Messages */
        .reminders-preview {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #fff;
          height: 100%;
          border-radius: 12px;
          overflow: hidden;
        }
        .ios-messages-header {
          background: #f8f8f8;
          padding: 12px 16px;
          border-bottom: 1px solid #e5e5e5;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ios-contact-avatar {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #ff7a1a, #e85d04);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 700;
          font-size: 0.85rem;
        }
        .ios-contact-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: #000;
        }
        .ios-contact-label {
          font-size: 0.7rem;
          color: #8e8e93;
        }
        .ios-messages-body {
          flex: 1;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: #fff;
        }
        .ios-message-time {
          text-align: center;
          font-size: 0.65rem;
          color: #8e8e93;
          margin-bottom: 4px;
        }
        .ios-message {
          max-width: 85%;
          padding: 10px 14px;
          border-radius: 18px;
          font-size: 0.8rem;
          line-height: 1.4;
        }
        .ios-message.incoming {
          background: #34c759;
          color: #fff;
          align-self: flex-start;
          border-bottom-left-radius: 4px;
        }
        .ios-message.outgoing {
          background: #e5e5ea;
          color: #000;
          align-self: flex-end;
          border-bottom-right-radius: 4px;
        }
        .ios-delivered {
          font-size: 0.6rem;
          color: #8e8e93;
          text-align: right;
          margin-top: 2px;
        }
        .ios-input-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: #f8f8f8;
          border-top: 1px solid #e5e5e5;
        }
        .ios-input-field {
          flex: 1;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 18px;
          padding: 8px 14px;
          font-size: 0.8rem;
          color: #8e8e93;
        }
        .ios-send-btn {
          width: 28px;
          height: 28px;
          background: #007aff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ios-send-btn svg {
          width: 14px;
          height: 14px;
          fill: #fff;
        }

        /* Phone Nav Dots */
        .phone-nav {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 20px;
        }
        .phone-nav-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          padding: 0;
        }
        .phone-nav-dot.active {
          background: #FE6462;
          width: 24px;
          border-radius: 4px;
        }

        /* Phone Glow */
        .phone-glow {
          position: absolute;
          inset: 10%;
          background: radial-gradient(ellipse, rgba(254,100,98,0.12) 0%, transparent 70%);
          filter: blur(40px);
          pointer-events: none;
          z-index: 0;
        }

        @media (max-width: 900px) {
          .packages-grid-3 { grid-template-columns: 1fr !important; }
          .phone-demo-container { grid-template-columns: 1fr !important; gap: 40px !important; }
          .phone-demo-content { order: 2; }
          .phone-steps { flex-direction: row !important; overflow-x: auto !important; }
          .phone-step { min-width: 200px; }
          .phone-device { width: 300px !important; height: 620px !important; }
          .phone-frame { border-radius: 40px !important; padding: 4px !important; }
          .phone-screen { border-radius: 37px !important; }
          .funnel-layout { flex-direction: column !important; }
          .ppa-grid { grid-template-columns: 1fr !important; }
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
   FUNNEL VISUALIZATION
   Single funnel shown at a time with tab navigation
   Current (skinniest) → Phase 1 → Phase 2 (widest)
   ═══════════════════════════════════════════════════ */
const funnelData = [
  {
    title: 'Current',
    subtitle: 'Where you are now',
    color: '#FE6462',
    topW: 120, botW: 36,
    layers: ['Referrals', 'Call / Text\nTo Set Appt', 'Appointments', 'Jobs'],
  },
  {
    title: 'Phase 1',
    subtitle: 'Foundation',
    color: '#6B8EFE',
    topW: 170, botW: 55,
    layers: ['Referrals +\nPaid Ads', 'Auto Booking\nSystem', 'Appt Reminders', 'Jobs'],
  },
  {
    title: 'Phase 2',
    subtitle: 'Full Scale',
    color: '#94D96B',
    topW: 220, botW: 75,
    layers: ['Referrals + Paid\nAds + Organic', 'Auto Booking\nSystem', 'Appt Reminders', 'Jobs'],
  },
];

/* Generic layer labels shown on the left side */
const layerLabels = ['Digital Presence', 'Systems', 'Appointments', 'Jobs'];

function FunnelVisualization() {
  const [activeIdx, setActiveIdx] = useState(0);
  const { ref, inView } = useScrollReveal({ threshold: 0.08 });

  const cx = 150;
  const vbW = 300;
  const vbH = 300;
  const layerCount = 4;
  const yStart = 20;
  const yEnd = vbH - 20;
  const layerH = (yEnd - yStart) / layerCount;

  const funnel = funnelData[activeIdx];

  const getW = (y: number) => {
    const t = (y - yStart) / (yEnd - yStart);
    return funnel.topW + (funnel.botW - funnel.topW) * t;
  };

  return (
    <section ref={ref as React.Ref<HTMLElement>} style={{ paddingTop: '120px', paddingBottom: '80px', position: 'relative' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', ...fadeUp(inView) }}>
          <div style={S.eyebrow}>Your Growth Path</div>
          <h2 style={S.h2}>From Disconnected to <HL>Fully Automated</HL></h2>
          <p style={S.sub}>See where you are today, and where RevCore takes you.</p>
        </div>

        {/* Tab buttons */}
        <div className="fv-tabs" style={fadeUp(inView, 150)}>
          {funnelData.map((f, i) => (
            <button
              key={i}
              className={`fv-tab${activeIdx === i ? ' active' : ''}`}
              onClick={() => setActiveIdx(i)}
              style={{ '--tab-color': f.color } as React.CSSProperties}
            >
              <span className="fv-tab-dot" />
              <span className="fv-tab-label">{f.title}</span>
              <span className="fv-tab-sub">{f.subtitle}</span>
            </button>
          ))}
        </div>

        {/* Single funnel display */}
        <div className="fv-stage" style={fadeUp(inView, 300)}>
          {/* Left labels */}
          <div className="fv-labels">
            {layerLabels.map((label, i) => (
              <div key={i} className="fv-label" style={{
                height: `${100 / layerCount}%`,
                opacity: inView ? 1 : 0,
                transition: `opacity 0.4s ease ${0.3 + i * 0.1}s`,
              }}>
                {label}
              </div>
            ))}
          </div>

          {/* Funnel SVG */}
          <div className="fv-funnel-container" key={activeIdx}>
            <svg viewBox={`0 0 ${vbW} ${vbH}`} className="fv-funnel-svg">
              <defs>
                <linearGradient id="fvFillActive" x1="0.5" y1="0" x2="0.5" y2="1">
                  <stop offset="0%" stopColor={funnel.color} stopOpacity="0.15" />
                  <stop offset="100%" stopColor={funnel.color} stopOpacity="0.04" />
                </linearGradient>
              </defs>

              {/* Funnel trapezoid */}
              <path
                d={`M${cx - funnel.topW / 2} ${yStart} L${cx + funnel.topW / 2} ${yStart} L${cx + funnel.botW / 2} ${yEnd} L${cx - funnel.botW / 2} ${yEnd} Z`}
                fill="url(#fvFillActive)"
                stroke={funnel.color}
                strokeWidth="2"
                className="fv-trap-anim"
              />

              {/* Section dividers + text */}
              {funnel.layers.map((label, li) => {
                const y1 = yStart + li * layerH;
                const y2 = yStart + (li + 1) * layerH;
                const midY = (y1 + y2) / 2;
                const divW = getW(y1);
                const lines = label.split('\n');

                return (
                  <g key={li} className="fv-layer-anim" style={{ animationDelay: `${li * 80}ms` }}>
                    {li > 0 && (
                      <line
                        x1={cx - divW / 2} y1={y1} x2={cx + divW / 2} y2={y1}
                        stroke={funnel.color} strokeWidth="1" strokeOpacity="0.3"
                      />
                    )}
                    {lines.map((line, lineIdx) => (
                      <text key={lineIdx}
                        x={cx} y={midY + (lineIdx - (lines.length - 1) / 2) * 15}
                        textAnchor="middle" dominantBaseline="central"
                        fill="#0A0A0A" fontSize="12" fontWeight="600"
                        fontFamily="DM Sans, sans-serif"
                      >
                        {line}
                      </text>
                    ))}
                  </g>
                );
              })}

              {/* Animated dots */}
              {[0, 1, 2].map(d => {
                const spread = funnel.topW * 0.2;
                const offset = (d - 1) * spread;
                return (
                  <circle key={`${activeIdx}-${d}`} r="3.5" fill={funnel.color}>
                    <animate attributeName="cy" from={yStart + 8} to={yEnd - 8}
                      dur={`${2.5 + d * 0.3}s`} begin={`${d * 0.6}s`} repeatCount="indefinite" />
                    <animate attributeName="cx"
                      from={`${cx + offset}`}
                      to={`${cx + offset * (funnel.botW / funnel.topW)}`}
                      dur={`${2.5 + d * 0.3}s`} begin={`${d * 0.6}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity"
                      values="0;0.8;0.8;0" keyTimes="0;0.06;0.8;1"
                      dur={`${2.5 + d * 0.3}s`} begin={`${d * 0.6}s`} repeatCount="indefinite" />
                  </circle>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      <style>{`
        .fv-tabs {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 3rem;
        }
        .fv-tab {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 24px;
          border-radius: 100px;
          border: 1px solid #E5E5E5;
          background: #fff;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
          font-family: inherit;
        }
        .fv-tab:hover {
          border-color: var(--tab-color);
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .fv-tab.active {
          border-color: var(--tab-color);
          background: color-mix(in srgb, var(--tab-color) 6%, #fff);
          box-shadow: 0 2px 16px color-mix(in srgb, var(--tab-color) 15%, transparent);
        }
        .fv-tab-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--tab-color);
          opacity: 0.4;
          transition: opacity 0.3s;
        }
        .fv-tab.active .fv-tab-dot {
          opacity: 1;
        }
        .fv-tab-label {
          font-weight: 700;
          font-size: 0.9rem;
          color: #0A0A0A;
        }
        .fv-tab-sub {
          font-size: 0.78rem;
          color: #6B6B6B;
        }

        .fv-stage {
          display: flex;
          align-items: stretch;
          gap: 0;
          max-width: 600px;
          margin: 0 auto;
        }

        .fv-labels {
          display: flex;
          flex-direction: column;
          justify-content: stretch;
          width: 120px;
          flex-shrink: 0;
          padding: 20px 0;
        }
        .fv-label {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 16px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #6B6B6B;
          text-align: right;
          line-height: 1.3;
        }

        .fv-funnel-container {
          flex: 1;
          display: flex;
          justify-content: center;
          animation: fvFadeIn 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .fv-funnel-svg {
          width: 100%;
          max-width: 400px;
          height: auto;
        }

        .fv-trap-anim {
          animation: fvTrapIn 0.6s cubic-bezier(0.22,1,0.36,1);
        }
        .fv-layer-anim {
          animation: fvLayerIn 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes fvFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fvTrapIn {
          from { opacity: 0; transform: scaleY(0.9); }
          to { opacity: 1; transform: scaleY(1); }
        }
        @keyframes fvLayerIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 640px) {
          .fv-tabs {
            flex-direction: column;
            align-items: stretch;
          }
          .fv-tab {
            border-radius: 12px;
          }
          .fv-labels {
            width: 80px;
            font-size: 0.65rem;
          }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   PHONE DEMO
   ═══════════════════════════════════════════════════ */
function PhoneDemo() {
  const [step, setStep] = useState(0);
  const [prevStep, setPrevStep] = useState(-1);
  const [adIdx, setAdIdx] = useState(0);
  const { ref, inView } = useScrollReveal({ threshold: 0.06 });

  const goToStep = (i: number) => {
    setPrevStep(step);
    setStep(i);
  };

  const changeAd = (dir: number) => {
    setAdIdx((prev) => (prev + dir + fbAds.length) % fbAds.length);
  };

  return (
    <section ref={ref as React.Ref<HTMLElement>} style={S.sectionDark}>
      <div style={S.gridOverlay} />
      <div style={S.container}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', ...fadeUp(inView) }}>
          <div style={S.eyebrowDark}>See It In Action</div>
          <h2 style={S.h2Dark}>How We <HL>Fill Your Calendar</HL></h2>
          <p style={S.subDark}>Click through each step to see exactly how it works.</p>
        </div>

        <div className="phone-demo-container" style={fadeUp(inView, 200)}>
          {/* Left: Steps */}
          <div className="phone-demo-content">
            <div className="phone-steps">
              {phoneSteps.map((s, i) => (
                <div
                  key={i}
                  className={`phone-step${step === i ? ' active' : ''}`}
                  onClick={() => goToStep(i)}
                >
                  <div className="phone-step-number">{s.num}</div>
                  <div className="phone-step-text">
                    <div className="phone-step-title">{s.title}</div>
                    <div className="phone-step-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Phone */}
          <div className="phone-device">
            <div className="phone-glow" />
            <div className="phone-frame">
              <div className="phone-screen">
                <div className="phone-notch" />
                <div className="phone-screen-content">
                  {/* Slide 1: FB Ads */}
                  <div className={`phone-slide${step === 0 ? ' active' : step > 0 ? ' prev' : ''}`}>
                    <div className="phone-slide-header">
                      <div className="phone-slide-badge">Step 1</div>
                      <div className="phone-slide-title">Scroll-Stopping Ads</div>
                    </div>
                    <div className="phone-slide-body" style={{ gap: 0 }}>
                      <div className="fb-ad-carousel">
                        {fbAds.map((ad, i) => (
                          <div key={i} className={`fb-ad-slide${adIdx === i ? ' active' : ''}`}>
                            <div className="fb-feed-header">
                              <span className="fb-logo-text">facebook</span>
                              <div className="fb-ad-counter">{i + 1}/{fbAds.length}</div>
                            </div>
                            <div className="fb-post-compact">
                              <div className="fb-post-top">
                                <div className="fb-avatar-sm">{ad.initials}</div>
                                <div className="fb-post-meta-sm">
                                  <span className="fb-page-name">{ad.page}</span>
                                  <span className="fb-sponsored-tag">Sponsored</span>
                                </div>
                              </div>
                              <div className="fb-post-copy">{ad.copy}</div>
                              <div className="fb-ad-media">
                                <div className={`ad-type-badge ${ad.type.toLowerCase().includes('photo') ? 'photo' : 'video'}`}>{ad.type}</div>
                                <img src={ad.img} alt={ad.page} />
                              </div>
                              <div className="fb-engagement">
                                <span className="fb-reactions-mini">{ad.reactions}</span>
                                <span className="fb-comments-mini">{ad.comments}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="fb-ad-nav">
                        <button className="fb-nav-arrow" onClick={() => changeAd(-1)}>&lsaquo;</button>
                        <div className="fb-ad-dots">
                          {fbAds.map((_, i) => (
                            <button key={i} className={`fb-dot${adIdx === i ? ' active' : ''}`} onClick={() => setAdIdx(i)} />
                          ))}
                        </div>
                        <button className="fb-nav-arrow" onClick={() => changeAd(1)}>&rsaquo;</button>
                      </div>
                    </div>
                  </div>

                  {/* Slide 2: Qualify */}
                  <div className={`phone-slide${step === 1 ? ' active' : step > 1 ? ' prev' : ''}`}>
                    <div className="phone-slide-header">
                      <div className="phone-slide-badge">Step 2</div>
                      <div className="phone-slide-title">Qualifying Questions</div>
                    </div>
                    <div className="phone-slide-body">
                      <div className="qualify-form-container">
                        <div className="qualify-form-header">
                          <div className="qualify-logo">RevCore</div>
                          <p className="qualify-subtitle">A few quick questions</p>
                        </div>
                        <div className="qualify-questions">
                          {qualifyQuestions.map((q, i) => (
                            <div key={i} className="qualify-question answered">
                              <div className="qualify-question-text">{q.q}</div>
                              {q.options ? (
                                <div className="qualify-options">
                                  {q.options.map(o => (
                                    <span key={o} className={`qualify-option${o === q.selected ? ' selected' : ''}`}>{o}</span>
                                  ))}
                                </div>
                              ) : (
                                <div className="qualify-answer selected">{q.a}</div>
                              )}
                            </div>
                          ))}
                        </div>
                        <button className="qualify-submit-btn">Continue to Book</button>
                      </div>
                    </div>
                  </div>

                  {/* Slide 3: Calendar */}
                  <div className={`phone-slide${step === 2 ? ' active' : step > 2 ? ' prev' : ''}`}>
                    <div className="phone-slide-header">
                      <div className="phone-slide-badge">Step 3</div>
                      <div className="phone-slide-title">Self-Booking Calendar</div>
                    </div>
                    <div className="phone-slide-body">
                      <div className="scheduler-container">
                        <div className="scheduler-header">
                          <div className="scheduler-logo">RevCore</div>
                          <h3 className="scheduler-headline">Book Your Appointment</h3>
                          <p className="scheduler-subhead">Select a day and time that works for you</p>
                        </div>
                        <div className="scheduler-calendar-grid">
                          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                            <div key={d} className="scheduler-day-header">{d}</div>
                          ))}
                          {[
                            { d: 15, cls: 'past' }, { d: 16, cls: 'past' }, { d: 17, cls: 'past' },
                            { d: 18, cls: 'available' }, { d: 19, cls: 'available selected' }, { d: 20, cls: 'available' }, { d: 21, cls: '' },
                            { d: 22, cls: '' }, { d: 23, cls: 'available' }, { d: 24, cls: 'available' },
                            { d: 25, cls: 'available' }, { d: 26, cls: 'available' }, { d: 27, cls: 'available' }, { d: 28, cls: '' },
                          ].map((day, i) => (
                            <div key={i} className={`scheduler-day ${day.cls}`}>{day.d}</div>
                          ))}
                        </div>
                        <div className="scheduler-time-slots">
                          {['9:00 AM','10:00 AM','11:00 AM','1:00 PM','2:00 PM','3:00 PM'].map((t, i) => (
                            <div key={t} className={`scheduler-time-slot${i === 1 ? ' selected' : ''}`}>{t}</div>
                          ))}
                        </div>
                        <button className="scheduler-confirm-btn">Confirm Appointment</button>
                      </div>
                    </div>
                  </div>

                  {/* Slide 4: Reminders */}
                  <div className={`phone-slide${step === 3 ? ' active' : ''}`}>
                    <div className="phone-slide-header">
                      <div className="phone-slide-badge">Step 4</div>
                      <div className="phone-slide-title">Automatic Reminders</div>
                    </div>
                    <div className="phone-slide-body">
                      <div className="reminders-preview">
                        <div className="ios-messages-header">
                          <div className="ios-contact-avatar">PR</div>
                          <div className="ios-contact-info">
                            <div className="ios-contact-name">Premium Roofing</div>
                            <div className="ios-contact-label">Automated Message</div>
                          </div>
                        </div>
                        <div className="ios-messages-body">
                          <div className="ios-message-time">Yesterday 10:00 AM</div>
                          <div className="ios-message incoming">
                            Hi John! Just a friendly reminder about your roof inspection appointment tomorrow at 10:00 AM. Our estimator Mike will be arriving at your home.
                          </div>
                          <div className="ios-message outgoing">
                            Sounds good, see you then!
                          </div>
                          <div className="ios-delivered">Delivered</div>
                          <div className="ios-message-time">Today 9:00 AM</div>
                          <div className="ios-message incoming">
                            Our estimator is on the way, see you in 1 hour!
                          </div>
                        </div>
                        <div className="ios-input-bar">
                          <div className="ios-input-field">iMessage</div>
                          <div className="ios-send-btn">
                            <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="phone-nav">
              {phoneSteps.map((_, i) => (
                <button key={i} className={`phone-nav-dot${step === i ? ' active' : ''}`} onClick={() => goToStep(i)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
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
              ...S.cardDark, padding: '24px', cursor: 'pointer', transition: 'all 0.3s',
              boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
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
            <div key={i} style={{ ...S.cardDark, padding: '28px', boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
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
    <section ref={ref as React.Ref<HTMLElement>} style={S.sectionDark}>
      <div style={S.gridOverlay} />
      <div style={S.container}>
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', ...fadeUp(inView) }}>
          <div style={S.eyebrowDark}>Market Exclusivity</div>
          <h2 style={S.h2Dark}>While You Build, <HL>They Can&apos;t</HL></h2>
          <p style={S.subDark}>
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
    <section ref={ref as React.Ref<HTMLElement>} id="pricing" style={{ ...S.sectionDark, padding: '96px 0' }}>
      <div style={S.gridOverlay} />
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: 900, height: 500,
        background: 'radial-gradient(ellipse at center, rgba(107,142,254,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={S.container}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem', ...fadeUp(inView) }}>
          <div style={S.eyebrowDark}>
            <span style={{ width: 20, height: 2, background: '#6B8EFE', display: 'block' }} />
            Choose Your Path
            <span style={{ width: 20, height: 2, background: '#6B8EFE', display: 'block' }} />
          </div>
          <h2 style={S.h2Dark}>Growth Packages Built for <HL>Contractors</HL></h2>
          <p style={{ ...S.subDark, marginBottom: '2rem' }}>Three proven systems designed to meet you where you are and take you where you want to go.</p>

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
          <div style={{ ...S.eyebrowDark, color: 'rgba(254,100,98,0.9)' }}>See Your Potential</div>
          <h2 style={S.h2Dark}>System <HL>ROI</HL> Calculator</h2>
          <p style={S.subDark}>Select your package and appointment volume to see your projected net revenue.</p>
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
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0A0A0A' }}>{f.title}</h4>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#6B6B6B', lineHeight: 1.5 }}>{f.desc}</p>
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
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0A0A0A' }}>Additional Growth Tools</h3>
          </div>
          <div className="extras-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {fullScaleExtras.map((e, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.95rem', color: '#0A0A0A' }}>
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
          <div style={{ ...S.eyebrowDark, color: 'rgba(254,100,98,0.9)' }}>Results-First Model</div>
          <h2 style={S.h2Dark}>Pay Per <HL>Qualified Appointment</HL></h2>
          <p style={S.subDark}>Pay only for booked appointments. No retainers. No ad markup.</p>

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
                  <div style={{ fontWeight: 700, color: '#0A0A0A', fontSize: '0.85rem' }}>{s.label}</div>
                  <div style={{ fontSize: '0.7rem', color: '#6B6B6B' }}>{s.sub}</div>
                </div>
              ))}
            </div>
            {/* Arrows */}
            <div style={{ textAlign: 'center', fontSize: '1.5rem', color: 'rgba(0,0,0,0.15)', marginBottom: 16 }}>{'\u2193'} {'\u2193'}</div>
            {/* Stages */}
            {stages.map((s, i) => (
              <div key={i} style={{
                padding: '12px 20px', marginBottom: 4,
                background: `linear-gradient(90deg, rgba(254,100,98,${0.06 + i * 0.04}) 0%, rgba(107,142,254,${0.04 + i * 0.03}) 100%)`,
                borderRadius: 8, textAlign: 'center',
                width: `${100 - i * 8}%`, margin: '0 auto 4px',
                border: '1px solid rgba(0,0,0,0.06)',
              }}>
                <div style={{ fontWeight: 700, color: '#0A0A0A', fontSize: '0.85rem' }}>{s}</div>
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
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0A0A0A', marginBottom: 12 }}>
              We Handle Every Step So You Can Focus on Closing
            </h3>
            <p style={{ color: '#6B6B6B', lineHeight: 1.7, marginBottom: 32 }}>
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
                  <h4 style={{ fontWeight: 700, color: '#0A0A0A', marginBottom: 4 }}>{s.title}</h4>
                  <p style={{ fontSize: '0.9rem', color: '#6B6B6B', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
