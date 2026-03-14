'use client';

import { useState, useEffect, useRef } from 'react';
import type L from 'leaflet';
import SystemDiagram from '@/components/sections/SystemDiagram';
import { useScrollReveal, fadeUp, scaleUp, stagger } from '@/hooks/useScrollReveal';
import { Check, ChevronDown } from 'lucide-react';
import {
  packagesData, phoneSteps, fbAds, buildFeatures,
  fullScaleExtras, outcomeCards,
  qualifyQuestions, stateMarkets,
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
      <WebsiteDemo />
      <CalendarMockup />
      <SEODemo />
      <SystemDiagram />
      <OutcomeSection />
      <ExclusivitySection />
      <SelectiveSection />
      <PricingSection />
      <ROICalculator />
      <SocialProofStrip />
      <WhatWeBuildSection />
      <style>{`
        @keyframes pkg-focus-glow {
          0%, 100% { box-shadow: 0 0 0 1px var(--pkg-accent, rgba(107,142,254,0.4)), 0 0 60px var(--pkg-accent, rgba(107,142,254,0.2)), 0 20px 60px rgba(0,0,0,0.6); }
          50%       { box-shadow: 0 0 0 1px var(--pkg-accent, rgba(107,142,254,0.5)), 0 0 100px var(--pkg-accent, rgba(107,142,254,0.35)), 0 20px 60px rgba(0,0,0,0.6); }
        }
        .pkg-focused { animation: pkg-focus-glow 2.5s ease-in-out infinite; }
        .pkg-dimmed { pointer-events: none; }
        .pkg-card { user-select: none; }

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
          background: #ffffff;
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
          background: #f8f8f8;
          padding: 12px;
          border-radius: 8px;
        }
        .phone-slide-badge {
          display: inline-block;
          padding: 6px 12px;
          background: rgba(254,100,98,0.1);
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
          color: #1a202c;
        }
        .phone-slide-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
          overflow-y: auto;
          color: #4a5568;
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
          background: #f0f2f5;
          border-bottom: 1px solid #e4e6eb;
        }
        .fb-logo-text {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1877f2;
          letter-spacing: -0.5px;
        }
        .fb-ad-counter {
          font-size: 0.7rem;
          color: #65676b;
          font-weight: 500;
        }
        .fb-post-compact {
          flex: 1;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          border: none;
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
          color: #050505;
        }
        .fb-sponsored-tag {
          font-size: 0.65rem;
          color: #65676b;
        }
        .fb-post-copy {
          padding: 0 12px 6px;
          font-size: 0.85rem;
          color: #050505;
          line-height: 1.4;
        }
        .fb-ad-media {
          flex: 1;
          position: relative;
          background: #000;
          overflow: hidden;
          min-height: 220px;
        }
        .fb-ad-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .fb-ad-media iframe {
          width: 100%;
          height: 100%;
          position: absolute;
          inset: 0;
          border: none;
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
          color: #65676b;
          background: #fff;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .fb-ad-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 6px;
          background: #fff;
        }
        .fb-nav-arrow {
          width: 28px;
          height: 28px;
          border: none;
          background: #e4e6eb;
          border-radius: 50%;
          color: #65676b;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .fb-nav-arrow:hover {
          background: #d8dadf;
          color: #050505;
        }
        .fb-ad-dots {
          display: flex;
          gap: 6px;
        }
        .fb-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #d8dadf;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          padding: 0;
        }
        .fb-dot.active {
          background: #1877f2;
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
          .seo-grid-2 { grid-template-columns: 1fr !important; }
          .cal-phase-tabs { flex-direction: column !important; align-items: stretch !important; }
        }
      `}</style>
    </main>
  );
}

/* ═══════════════════════════════════════════════════
   FUNNEL VISUALIZATION
   Single funnel shown at a time with tab navigation
   Overview → Current → Phase 1 → Phase 2 (widest)
   ═══════════════════════════════════════════════════ */
const funnelData = [
  {
    title: 'Overview',
    subtitle: 'The funnel explained',
    color: '#999999',
    topW: 330, botW: 100,
    people: 6,
    peopleLabel: 'Each person represents potential customers discovering your business. The wider the top of the funnel, the more opportunities flow down into booked jobs and revenue.',
    revenue: 'Revenue',
    layers: ['Digital Presence', 'Systems', 'Appointments', 'Jobs'],
    descriptions: [
      'The channels that put your business in front of homeowners, ads, SEO, website, and referrals. More channels = wider funnel = more opportunities.',
      'The backend infrastructure that catches every lead and moves them toward a booked appointment without you lifting a finger.',
      'Where leads become confirmed, scheduled appointments on your calendar, automatically.',
      'The booked jobs that generate revenue. Everything above this exists to feed this layer.',
    ],
  },
  {
    title: 'Current',
    subtitle: 'Where you are now',
    color: '#FE6462',
    topW: 280, botW: 80,
    people: 3,
    peopleLabel: 'Referrals alone create a ceiling on your growth. You are invisible to the vast majority of homeowners in your market who are actively searching for your service right now.',
    revenue: 'Revenue $',
    layers: ['Referrals Only', 'Call / Text To Set Appt', 'Appointments', 'Jobs'],
    descriptions: [
      'Referrals are great but unpredictable. You have no control over when they come or how many. Your competitors are capturing the customers you never even see.',
      'Every lead requires you to stop what you are doing to answer a call or text back. When you are on a job, leads go cold or call the next contractor.',
      'No automated reminders means no shows eat into your revenue. Manual scheduling creates chaos when volume picks up.',
      'Revenue is capped because the top of the funnel is too narrow. You can only close what comes in, and not enough is coming in.',
    ],
  },
  {
    title: 'Phase 1',
    subtitle: 'Foundation',
    color: '#6B8EFE',
    topW: 420, botW: 120,
    people: 12,
    peopleLabel: 'Paid ads widen the top of your funnel immediately. But without the auto booking system and appointment reminders built first, more leads would just mean more chaos. The foundation has to be in place before you turn on the faucet.',
    revenue: 'Revenue $$',
    layers: ['Referrals + Meta Ads', 'Auto Booking System', 'Appt Reminders', 'Jobs'],
    descriptions: [
      'Meta Ads put you in front of homeowners actively scrolling in your service area. Combined with referrals, you now have a predictable second lead source you control.',
      'This is why we build this BEFORE scaling ads. Without auto booking, more leads just means more missed calls and lost opportunities. The system catches every lead 24/7 so nothing falls through the cracks.',
      'Automated SMS and email reminders are critical infrastructure. Without them, no shows eat 20-30% of your appointments. This has to be in place before you scale.',
      'Consistent pipeline replaces the feast or famine cycle. You are no longer waiting for the phone to ring.',
    ],
  },
  {
    title: 'Phase 2',
    subtitle: 'Full Scale',
    color: '#94D96B',
    topW: 500, botW: 150,
    people: 30,
    peopleLabel: 'Every growth channel is now active and compounding. Paid ads drive immediate traffic, SEO builds long term organic visibility, your website converts visitors 24/7, and referrals keep flowing. Your competitors cannot catch up because you own the digital real estate in your market.',
    revenue: 'Revenue $$$',
    layers: ['Referrals + Paid Ads + Optimized Website + SEO', 'Auto Booking System', 'Appt Reminders', 'Jobs'],
    descriptions: [
      'Every channel compounds. SEO rankings build month over month, paid ads drive immediate traffic, your website converts visitors around the clock, and referrals never stop. This is how you dominate a market.',
      'The system you built in Phase 1 now handles the full volume effortlessly. AI powered follow ups, review requests, and re-engagement campaigns run on autopilot 24/7.',
      'Confirmation rates exceed 90%. The infrastructure you invested in early now pays for itself many times over at this volume.',
      'Maximum job volume with minimal overhead. Your funnel is wide at the top and efficient all the way down. This is what a real growth engine looks like.',
    ],
  },
];


function FunnelVisualization() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);
  const { ref, inView } = useScrollReveal({ threshold: 0.08 });

  const cx = 300;
  const vbW = 600;
  const vbH = 640;
  const layerCount = 4;
  const yStart = 74;
  const yEnd = vbH - 54;

  const funnel = funnelData[activeIdx];

  /* Compute layer heights — hovered layer expands, others shrink */
  const baseH = (yEnd - yStart) / layerCount;
  const expandedH = baseH * 1.45;
  const shrunkH = selectedLayer !== null ? (yEnd - yStart - expandedH) / (layerCount - 1) : baseH;

  const getLayerY = (li: number) => {
    let y = yStart;
    for (let i = 0; i < li; i++) {
      y += (selectedLayer === i ? expandedH : shrunkH);
    }
    return y;
  };

  const getW = (y: number) => {
    const t = (y - yStart) / (yEnd - yStart);
    return funnel.topW + (funnel.botW - funnel.topW) * t;
  };

  return (
    <section ref={ref as React.Ref<HTMLElement>} style={{ paddingTop: '100px', paddingBottom: '100px', position: 'relative' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', ...fadeUp(inView) }}>
          <div style={S.eyebrow}>Your Growth Path</div>
          <h2 style={S.h2}>The Game Changed. <HL>Most Contractors Haven&apos;t.</HL></h2>
          <p style={S.sub}>See where you are today, and where RevCore takes you.</p>
        </div>

        {/* Step cards */}
        <div className="fv-steps" style={fadeUp(inView, 150)}>
          {funnelData.map((f, i) => (
            <button
              key={i}
              className={`fv-step${activeIdx === i ? ' active' : ''}`}
              onClick={() => { setActiveIdx(i); setSelectedLayer(null); }}
              style={{ '--step-color': f.color } as React.CSSProperties}
            >
              <div className="fv-step-num">{i + 1}</div>
              <div className="fv-step-text">
                <div className="fv-step-title">{f.title}</div>
                <div className="fv-step-sub">{f.subtitle}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Funnel + right detail panel */}
        <div className="fv-stage" style={fadeUp(inView, 300)}>
          {/* Funnel SVG */}
          <div className="fv-funnel-container">
            <svg viewBox={`0 0 ${vbW} ${vbH}`} className="fv-funnel-svg">
              <defs>
                <linearGradient id="fvFillActive" x1="0.5" y1="0" x2="0.5" y2="1">
                  <stop offset="0%" stopColor={funnel.color} stopOpacity="0.18" style={{ transition: 'stop-color 0.6s ease' }} />
                  <stop offset="100%" stopColor={funnel.color} stopOpacity="0.04" style={{ transition: 'stop-color 0.6s ease' }} />
                </linearGradient>
              </defs>

              {/* People icons above funnel */}
              <g style={{ cursor: 'pointer' }} onClick={() => setSelectedLayer(prev => prev === -1 ? null : -1)}>
                <title>{funnel.peopleLabel}</title>
                {Array.from({ length: Math.max(...funnelData.map(f => f.people)) }).map((_, pi) => {
                  const visible = pi < funnel.people;
                  const cols = Math.min(funnel.people || 1, 15);
                  const rows = Math.ceil((funnel.people || 1) / cols);
                  const row = Math.floor(pi / cols);
                  const col = pi % cols;
                  const colsInRow = row < rows - 1 ? cols : (funnel.people || 1) - row * cols;
                  const spacing = 30;
                  const startX = cx - ((colsInRow - 1) * spacing) / 2;
                  const px = visible ? startX + col * spacing : cx;
                  const py = visible ? 18 + row * 28 : 18;
                  return (
                    <g key={`p-${pi}`} style={{ transition: 'opacity 0.5s ease, transform 0.5s ease', opacity: visible ? 1 : 0 }}>
                      <circle cx={px} cy={py} r="5" fill={funnel.color} fillOpacity="0.7" style={{ transition: 'cx 0.6s ease, cy 0.6s ease, fill 0.6s ease' }} />
                      <circle cx={px} cy={py - 8} r="3.2" fill={funnel.color} fillOpacity="0.7" style={{ transition: 'cx 0.6s ease, cy 0.6s ease, fill 0.6s ease' }} />
                    </g>
                  );
                })}
              </g>

              {/* Full trapezoid outline */}
              <path
                d={`M${cx - funnel.topW / 2} ${yStart} L${cx + funnel.topW / 2} ${yStart} L${cx + funnel.botW / 2} ${yEnd} L${cx - funnel.botW / 2} ${yEnd} Z`}
                fill="url(#fvFillActive)"
                stroke={funnel.color}
                strokeWidth="2"
                strokeOpacity="0.3"
                style={{ transition: 'd 0.6s ease, stroke 0.6s ease' }}
              />

              {/* Expanding arrows on Phase 1 & Phase 2 */}
              <g style={{ transition: 'opacity 0.4s ease', opacity: activeIdx >= 2 ? 1 : 0 }}>
                <g className="fv-arrow-left">
                  <polyline
                    points={`${cx - funnel.topW / 2 - 6},${yStart + 18} ${cx - funnel.topW / 2 - 18},${yStart + 10} ${cx - funnel.topW / 2 - 6},${yStart + 2}`}
                    fill="none" stroke={funnel.color} strokeWidth="2.5" strokeOpacity="0.45" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transition: 'all 0.6s ease' }}
                  />
                </g>
                <g className="fv-arrow-right">
                  <polyline
                    points={`${cx + funnel.topW / 2 + 6},${yStart + 18} ${cx + funnel.topW / 2 + 18},${yStart + 10} ${cx + funnel.topW / 2 + 6},${yStart + 2}`}
                    fill="none" stroke={funnel.color} strokeWidth="2.5" strokeOpacity="0.45" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transition: 'all 0.6s ease' }}
                  />
                </g>
              </g>

              {/* Interactive layers */}
              {funnelData[0].layers.map((_, li) => {
                const label = funnel.layers[li];
                const y1 = getLayerY(li);
                const y2 = getLayerY(li + 1 > layerCount - 1 ? layerCount : li + 1);
                const actualY2 = li === layerCount - 1 ? yEnd : y2;
                const midY = (y1 + actualY2) / 2;
                const w1 = getW(y1);
                const w2 = getW(actualY2);
                const isHovered = selectedLayer === li;
                const isDimmed = selectedLayer !== null && selectedLayer !== li;

                return (
                  <g
                    key={li}
                    style={{
                      cursor: 'pointer',
                      transition: 'opacity 0.3s ease',
                      opacity: isDimmed ? 0.35 : 1,
                    }}
                    onClick={() => setSelectedLayer(prev => prev === li ? null : li)}
                  >
                    {/* Layer fill */}
                    <path
                      d={`M${cx - w1 / 2} ${y1} L${cx + w1 / 2} ${y1} L${cx + w2 / 2} ${actualY2} L${cx - w2 / 2} ${actualY2} Z`}
                      fill={funnel.color}
                      fillOpacity={isHovered ? 0.2 : 0.0}
                      stroke="none"
                      style={{ transition: 'd 0.6s ease, fill 0.6s ease, fill-opacity 0.3s ease' }}
                    />

                    {/* Divider line */}
                    {li > 0 && (
                      <line
                        x1={cx - w1 / 2} y1={y1} x2={cx + w1 / 2} y2={y1}
                        stroke={funnel.color} strokeWidth="1" strokeOpacity="0.3"
                        style={{ transition: 'x1 0.6s ease, x2 0.6s ease, y1 0.6s ease, y2 0.6s ease, stroke 0.6s ease' }}
                      />
                    )}

                    {/* Layer text */}
                    <text
                      x={cx} y={midY}
                      textAnchor="middle" dominantBaseline="central"
                      fill="#0A0A0A" fontSize={isHovered ? '18' : '16'} fontWeight="600"
                      fontFamily="DM Sans, sans-serif"
                      style={{ transition: 'y 0.6s ease, font-size 0.3s ease' }}
                    >
                      {label}
                    </text>
                  </g>
                );
              })}

              {/* Revenue label below funnel */}
              <text
                x={cx} y={yEnd + 20}
                textAnchor="middle" dominantBaseline="central"
                fill="#0A0A0A" fontSize="16" fontWeight="700"
                fontFamily="DM Sans, sans-serif"
              >
                {funnel.revenue}
              </text>
            </svg>
          </div>

          {/* Right detail panel — only shows on click */}
          <div className="fv-right-panel">
            {selectedLayer !== null ? (
              <div className="fv-right-content" key={`${activeIdx}-${selectedLayer}`}>
                <div className="fv-right-label" style={{ color: funnel.color }}>
                  {selectedLayer === -1 ? 'Impressions' : funnel.layers[selectedLayer]}
                </div>
                <p className="fv-right-desc">
                  {selectedLayer === -1 ? funnel.peopleLabel : funnel.descriptions[selectedLayer]}
                </p>
              </div>
            ) : (
              <div className="fv-right-hint">
                Click a section of the funnel to learn more
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .fv-steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 3rem;
        }
        .fv-step {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 20px;
          border-radius: 14px;
          border: 1px solid #E5E5E5;
          background: #fff;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
          font-family: inherit;
          text-align: left;
          border-left: 3px solid transparent;
        }
        .fv-step:hover {
          border-color: #E5E5E5;
          border-left-color: var(--step-color);
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
        }
        .fv-step.active {
          border-color: color-mix(in srgb, var(--step-color) 30%, #E5E5E5);
          border-left-color: var(--step-color);
          background: color-mix(in srgb, var(--step-color) 4%, #fff);
          box-shadow: 0 4px 20px color-mix(in srgb, var(--step-color) 12%, transparent);
        }
        .fv-step-num {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #F0F0F0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.85rem;
          color: #999;
          flex-shrink: 0;
          transition: all 0.3s;
        }
        .fv-step.active .fv-step-num {
          background: var(--step-color);
          color: #fff;
        }
        .fv-step-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .fv-step-title {
          font-weight: 700;
          font-size: 1rem;
          color: #0A0A0A;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .fv-step-sub {
          font-size: 0.8rem;
          color: #6B6B6B;
        }

        .fv-stage {
          display: flex;
          align-items: stretch;
          gap: 0;
          max-width: 1100px;
          margin: 0 auto;
        }

        .fv-funnel-container {
          flex: 1;
          display: flex;
          justify-content: center;
        }
        .fv-funnel-svg {
          width: 100%;
          max-width: 750px;
          height: auto;
        }

        .fv-right-panel {
          width: 320px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          padding: 20px 0 20px 40px;
        }
        .fv-right-content {
          animation: fvFadeIn 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .fv-right-label {
          font-size: 1.15rem;
          font-weight: 800;
          margin-bottom: 10px;
        }
        .fv-right-desc {
          font-size: 1.05rem;
          line-height: 1.65;
          color: #444;
          margin: 0;
        }
        .fv-right-hint {
          font-size: 0.9rem;
          color: #aaa;
          font-style: italic;
        }

        .fv-trap-anim {
          animation: fvTrapIn 0.6s cubic-bezier(0.22,1,0.36,1);
        }
        .fv-layer-anim {
          animation: fvLayerIn 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
        .fv-person-anim {
          animation: fvPersonIn 0.4s cubic-bezier(0.22,1,0.36,1) both;
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
        @keyframes fvPersonIn {
          from { opacity: 0; transform: scale(0) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .fv-arrow-left {
          animation: fvArrowLeft 1.8s ease-in-out infinite;
        }
        .fv-arrow-right {
          animation: fvArrowRight 1.8s ease-in-out infinite;
        }
        @keyframes fvArrowLeft {
          0%, 100% { transform: translate(0, 0); opacity: 0.4; }
          50% { transform: translate(-4px, -2px); opacity: 0.8; }
        }
        @keyframes fvArrowRight {
          0%, 100% { transform: translate(0, 0); opacity: 0.4; }
          50% { transform: translate(4px, -2px); opacity: 0.8; }
        }

        @media (max-width: 900px) {
          .fv-steps {
            grid-template-columns: repeat(2, 1fr);
          }
          .fv-right-panel {
            display: none;
          }
        }
        @media (max-width: 640px) {
          .fv-steps {
            grid-template-columns: 1fr;
          }
          .fv-step {
            border-radius: 12px;
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
                              <div className={`fb-ad-media${(ad as Record<string, unknown>).wistiaId ? ' video' : ''}`}>
                                <div className={`ad-type-badge ${ad.type.toLowerCase().includes('photo') ? 'photo' : 'video'}`}>{ad.type}</div>
                                {(ad as Record<string, unknown>).wistiaId ? (
                                  <iframe
                                    src={`https://fast.wistia.net/embed/iframe/${(ad as Record<string, unknown>).wistiaId}?autoPlay=${adIdx === i ? 'true' : 'false'}&muted=true&loop=true&controlsVisibleOnLoad=false&playButton=false`}
                                    allow="autoplay; fullscreen"
                                  />
                                ) : (
                                  <img src={ad.img} alt={ad.page} />
                                )}
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
   WEBSITE DEMO — live site in browser frame
   ═══════════════════════════════════════════════════ */
const DEMO_SITES = [
  { url: 'https://www.aquaticpoolaz.com', domain: 'aquaticpoolaz.com' },
  { url: 'https://timberlinefallsut.com', domain: 'timberlinefallsut.com' },
  { url: 'https://tomron-construction.vercel.app', domain: 'tomron-construction.vercel.app' },
  { url: 'https://rnr-stoneworks.vercel.app', domain: 'rnr-stoneworks.vercel.app' },
];

function WebsiteDemo() {
  const { ref, inView } = useScrollReveal({ threshold: 0.06 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.65);
  const [blocked, setBlocked] = useState<Record<number, boolean>>({});
  const [activeIdx, setActiveIdx] = useState(0);
  const IFRAME_W = 1440;
  const IFRAME_H = 900;
  const site = DEMO_SITES[activeIdx];

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setScale(containerRef.current.offsetWidth / IFRAME_W);
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const goPrev = () => setActiveIdx((p) => (p - 1 + DEMO_SITES.length) % DEMO_SITES.length);
  const goNext = () => setActiveIdx((p) => (p + 1) % DEMO_SITES.length);

  const arrowBtn = (direction: 'left' | 'right', onClick: () => void): React.CSSProperties & Record<string, string> => ({
    position: 'absolute' as const,
    top: '50%',
    [direction === 'left' ? 'left' : 'right']: '-52px',
    transform: 'translateY(-50%)',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '1px solid rgba(0,0,0,0.1)',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    transition: 'all 0.2s',
    color: '#333',
    fontSize: '14px',
  });

  return (
    <section ref={ref as React.Ref<HTMLElement>} style={S.section}>
      <div style={S.container}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', ...fadeUp(inView) }}>
          <div style={S.eyebrow}>Website Preview</div>
          <h2 style={S.h2}>Websites That <HL>Convert</HL></h2>
          <p style={S.sub}>See real RevCore client websites, built to turn visitors into booked appointments.</p>
        </div>

        <div style={{ ...fadeUp(inView, 200), maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
          {/* Left arrow */}
          <div onClick={goPrev} style={arrowBtn('left', goPrev) as React.CSSProperties} className="wd-arrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </div>

          {/* Right arrow */}
          <div onClick={goNext} style={arrowBtn('right', goNext) as React.CSSProperties} className="wd-arrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
          </div>

          <div style={{ borderRadius: '14px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)', background: '#1a1d24' }}>

            {/* Browser chrome */}
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
              <a href={site.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0, padding: '3px 8px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                Open ↗
              </a>
            </div>

            {/* iframe or fallback */}
            {!blocked[activeIdx] ? (
              <div ref={containerRef} style={{ position: 'relative', overflow: 'hidden', background: '#fff', height: `${IFRAME_H * scale}px` }}>
                <iframe
                  key={activeIdx}
                  src={site.url}
                  title={site.domain}
                  onError={() => setBlocked((b) => ({ ...b, [activeIdx]: true }))}
                  style={{
                    border: 'none',
                    width: `${IFRAME_W}px`,
                    height: `${IFRAME_H}px`,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    pointerEvents: 'auto',
                  }}
                />
              </div>
            ) : (
              <div style={{ height: '400px', background: '#0d1117', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', textAlign: 'center', maxWidth: '320px', lineHeight: 1.6 }}>
                  This site has iframe embedding disabled. Visit it directly to see the full experience.
                </p>
                <a href={site.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 22px', borderRadius: '100px', background: 'rgba(46,204,138,0.1)', border: '1px solid rgba(46,204,138,0.3)', color: '#2ECC8A', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>
                  Visit {site.domain} ↗
                </a>
              </div>
            )}

            {/* Footer bar */}
            <div style={{ background: '#13161c', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)' }}>Live preview, content loads from {site.domain}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Dot indicators */}
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  {DEMO_SITES.map((_, i) => (
                    <div
                      key={i}
                      onClick={() => setActiveIdx(i)}
                      style={{
                        width: i === activeIdx ? '16px' : '5px',
                        height: '5px',
                        borderRadius: '100px',
                        background: i === activeIdx ? '#FE6462' : 'rgba(255,255,255,0.15)',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                      }}
                    />
                  ))}
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '100px', background: 'rgba(254,100,98,0.08)', border: '1px solid rgba(254,100,98,0.18)' }}>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#FE6462', display: 'inline-block' }} />
                  <span style={{ fontSize: '8px', color: 'rgba(254,100,98,0.75)', fontWeight: 700, letterSpacing: '0.06em' }}>REVCORE CLIENT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .wd-arrow:hover { background: #f5f5f5 !important; border-color: rgba(0,0,0,0.15) !important; }
        @media (max-width: 1100px) {
          .wd-arrow { display: none !important; }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   OUTCOME SECTION
   ═══════════════════════════════════════════════════ */
function OutcomeSection() {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const { ref, inView } = useScrollReveal({ threshold: 0.08 });
  return (
    <section ref={ref as React.Ref<HTMLElement>} style={S.section}>
      <div style={S.container}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', ...fadeUp(inView) }}>
          <h2 style={S.h2}>This Is What Happens When Your Funnel <HL>Actually Works</HL></h2>
          <p style={S.sub}>This is what your business looks like with RevCore.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', ...fadeUp(inView, 200) }} className="packages-grid-3">
          {outcomeCards.map((card, i) => {
            const isActive = activeCard === i;
            const hasActive = activeCard !== null;
            const accentColor = card.icon === 'calendar' ? '#FE6462' : card.icon === 'chat' ? '#6B8EFE' : '#94D96B';
            return (
            <div key={i} onClick={() => setActiveCard(prev => prev === i ? null : i)} style={{
              ...S.cardDark, padding: '24px', cursor: 'pointer',
              transform: isActive ? 'scale(1.05)' : 'scale(1)',
              opacity: hasActive && !isActive ? 0.45 : 1,
              boxShadow: isActive
                ? `0 0 0 1px ${accentColor}50, 0 0 60px ${accentColor}20, 0 16px 48px rgba(0,0,0,0.4)`
                : '0 4px 24px rgba(0,0,0,0.15)',
              zIndex: isActive ? 10 : 1,
              position: 'relative' as const,
              transition: 'all 0.45s cubic-bezier(0.22,1,0.36,1)',
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
                  {card.conversations.slice(0, isActive ? card.conversations.length : 4).map((c, j) => (
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
          );
          })}
        </div>
      </div>
    </section>
  );
}

/* EcosystemSection replaced by <SystemDiagram /> component */


/* ═══════════════════════════════════════════════════
   EXCLUSIVITY — Leaflet map with state pins
   ═══════════════════════════════════════════════════ */
function ExclusivitySection() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const { ref, inView } = useScrollReveal({ threshold: 0.08 });

  useEffect(() => {
    if (!inView || !mapRef.current || mapInstanceRef.current) return;
    import('leaflet').then((L) => {
      const map = L.map(mapRef.current!, {
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: true,
        doubleClickZoom: false,
        attributionControl: false,
      }).setView([39.8, -98.5], 4);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
      }).addTo(map);

      stateMarkets.forEach((state) => {
        const color = state.claimed ? '#FE6462' : '#94D96B';
        const svgHtml = `<svg width="20" height="24" viewBox="0 0 20 26" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 0C4.5 0 0 4.5 0 10c0 7.5 10 16 10 16s10-8.5 10-16c0-5.5-4.5-10-10-10z" fill="${color}"/>
          <circle cx="10" cy="10" r="4" fill="#fff" fill-opacity="0.9"/>
        </svg>`;
        const icon = L.divIcon({
          html: svgHtml,
          className: 'excl-pin',
          iconSize: [20, 24],
          iconAnchor: [10, 24],
        });
        const marker = L.marker([state.lat, state.lng], { icon }).addTo(map);
        marker.bindTooltip(
          `<strong>${state.state}</strong><br/><span style="color:${color};font-weight:700">${state.claimed ? 'CLAIMED' : 'AVAILABLE'}</span>`,
          { direction: 'top', offset: [0, -20] }
        );
      });

      mapInstanceRef.current = map;
      setTimeout(() => map.invalidateSize(), 200);
    });
  }, [inView]);

  return (
    <section ref={ref as React.Ref<HTMLElement>} style={{ ...S.sectionDark, padding: '100px 0' }}>
      <div style={S.gridOverlay} />
      <div style={S.container}>
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', ...fadeUp(inView) }}>
          <div style={S.eyebrowDark}>Market Exclusivity</div>
          <h2 style={{ ...S.h2Dark, fontSize: '2.8rem' }}>While You Build, <HL>They Can&apos;t</HL></h2>
          <p style={{ ...S.subDark, fontSize: '1.1rem', lineHeight: 1.7 }}>
            Your competitors can&apos;t access RevCore in your market. While you&apos;re building SEO authority, reactivating your database, and training your team, they&apos;re stuck buying shared leads. That gap only widens.
          </p>
        </div>

        <div style={{ maxWidth: '900px', margin: '3rem auto 0', ...fadeUp(inView, 200) }}>
          <div
            ref={mapRef}
            style={{
              width: '100%', height: '450px', borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden',
            }}
          />

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '24px',
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
      </div>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>{`
        .excl-pin { background: transparent !important; border: none !important; }
        .leaflet-tooltip { font-family: 'DM Sans', sans-serif; font-size: 0.8rem; padding: 6px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: rgba(10,10,10,0.95); color: #fff; }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   CALENDAR MOCKUP — appointment density per phase
   ═══════════════════════════════════════════════════ */
/* March 2026: 1=Sun, 2=Mon, 3=Tue … 7=Sat, 8=Sun … */
const DAY_LABELS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

interface CalAppt { time: string; name: string; phone: string; email: string; address: string; service: string }
interface CalPhase { name: string; color: string; subtitle: string; appts: Record<number, CalAppt[]>; description: string }

const calendarPhases: CalPhase[] = [
  {
    name: 'Current', color: '#FE6462', subtitle: 'Referrals only',
    description: 'A handful of referrals trickle in. Unpredictable gaps leave your crew sitting idle.',
    appts: {
      5:  [{ time: '9:00 AM',  name: 'Mike Johnson',   phone: '(602) 555-0147', email: 'mjohnson84@gmail.com',    address: '4521 W Olive Ave, Glendale AZ 85302',    service: 'Roof Inspection' }],
      11: [{ time: '10:30 AM', name: 'Sarah Williams', phone: '(480) 555-0293', email: 'swilliams@yahoo.com',     address: '1832 E Camelback Rd, Phoenix AZ 85016',   service: 'Leak Repair' }],
      19: [{ time: '2:00 PM',  name: 'Tom Anderson',   phone: '(623) 555-0185', email: 'tanderson@hotmail.com',    address: '7744 N 12th St, Phoenix AZ 85020',        service: 'Full Replacement Estimate' }],
      26: [{ time: '11:00 AM', name: 'Lisa Chen',      phone: '(602) 555-0321', email: 'lisachen99@gmail.com',     address: '2910 S Mill Ave, Tempe AZ 85282',         service: 'Storm Damage Assessment' }],
    },
  },
  {
    name: 'Phase 1', color: '#6B8EFE', subtitle: 'Ads + Auto Booking',
    description: 'Paid ads and auto booking fill your weeks consistently. No more feast or famine.',
    appts: {
      2:  [{ time: '8:30 AM',  name: 'David Martinez',   phone: '(602) 555-0412', email: 'dmartinez@gmail.com',      address: '3847 W Thunderbird Rd, Phoenix AZ 85053', service: 'Roof Inspection' }],
      4:  [{ time: '10:00 AM', name: 'Jennifer Thompson', phone: '(480) 555-0538', email: 'jthompson22@outlook.com', address: '9201 E Indian Bend Rd, Scottsdale AZ 85250', service: 'Full Replacement Estimate' }],
      6:  [{ time: '1:00 PM',  name: 'Marcus Garcia',    phone: '(623) 555-0619', email: 'mgarcia@yahoo.com',        address: '5520 W Peoria Ave, Glendale AZ 85302',   service: 'Shingle Repair' }],
      7:  [{ time: '9:00 AM',  name: 'Rachel Robinson',  phone: '(602) 555-0724', email: 'rrobinson@gmail.com',      address: '2215 N 44th St, Phoenix AZ 85008',        service: 'Gutter Installation' }],
      10: [{ time: '11:30 AM', name: 'Chris Mitchell',   phone: '(480) 555-0837', email: 'cmitchell@hotmail.com',    address: '6630 E Baseline Rd, Mesa AZ 85206',       service: 'Storm Damage Assessment' }],
      12: [{ time: '9:30 AM',  name: 'Amanda Davis',     phone: '(623) 555-0941', email: 'adavis17@gmail.com',       address: '14220 N 59th Ave, Glendale AZ 85306',     service: 'Leak Repair' }],
      16: [{ time: '8:00 AM',  name: 'Nicole Moore',     phone: '(480) 555-1168', email: 'nmoore@yahoo.com',         address: '1450 S Dobson Rd, Mesa AZ 85202',         service: 'Full Replacement Estimate' }],
      18: [{ time: '3:00 PM',  name: 'Kevin Taylor',     phone: '(623) 555-1274', email: 'ktaylor55@gmail.com',      address: '8821 W Maryland Ave, Glendale AZ 85305',  service: 'Insurance Claim Inspection' }],
      20: [{ time: '10:00 AM', name: 'Ashley Jackson',   phone: '(602) 555-1389', email: 'ajackson@gmail.com',       address: '4102 N 24th St, Phoenix AZ 85016',        service: 'Roof Inspection' }],
      24: [{ time: '1:30 PM',  name: 'Megan Harris',     phone: '(623) 555-1507', email: 'mharris@outlook.com',      address: '10432 W Camelback Rd, Phoenix AZ 85037',  service: 'Chimney Flashing Repair' }],
      25: [{ time: '11:00 AM', name: 'Ryan Martin',      phone: '(602) 555-1618', email: 'rmartin@gmail.com',        address: '2750 W Guadalupe Rd, Chandler AZ 85224',  service: 'Storm Damage Assessment' }],
      27: [{ time: '2:00 PM',  name: 'Stephanie Lee',    phone: '(480) 555-1723', email: 'slee@yahoo.com',           address: '5580 E Broadway Rd, Mesa AZ 85206',       service: 'Full Replacement Estimate' }],
      30: [{ time: '10:30 AM', name: 'Jake Walker',      phone: '(623) 555-1834', email: 'jwalker@gmail.com',        address: '6890 W Bethany Home Rd, Glendale AZ 85303', service: 'Roof Maintenance' }],
    },
  },
  {
    name: 'Phase 2', color: '#94D96B', subtitle: 'Full Scale',
    description: 'Every growth channel compounding. Your month is booked out weeks in advance.',
    appts: {
      2:  [
        { time: '8:00 AM',  name: 'Maria Young',       phone: '(602) 555-2001', email: 'myoung@gmail.com',        address: '3920 W Indian School Rd, Phoenix AZ 85019', service: 'Full Replacement Estimate' },
        { time: '1:30 PM',  name: 'Carlos King',        phone: '(480) 555-2002', email: 'cking@outlook.com',       address: '8450 E McDowell Rd, Scottsdale AZ 85257',   service: 'Roof Inspection' },
      ],
      3:  [
        { time: '9:00 AM',  name: 'Derek Wright',       phone: '(623) 555-2003', email: 'dwright@yahoo.com',       address: '11240 N 43rd Ave, Glendale AZ 85304',       service: 'Storm Damage Assessment' },
        { time: '3:00 PM',  name: 'Tyler Lopez',        phone: '(602) 555-2004', email: 'tlopez@gmail.com',        address: '2515 E Thomas Rd, Phoenix AZ 85016',        service: 'Shingle Repair' },
      ],
      4:  [{ time: '10:00 AM', name: 'Emily Hill',       phone: '(480) 555-2005', email: 'ehill@gmail.com',        address: '4710 S Rural Rd, Tempe AZ 85282',           service: 'Gutter Installation' }],
      5:  [
        { time: '8:30 AM',  name: 'Nathan Scott',       phone: '(623) 555-2006', email: 'nscott@hotmail.com',      address: '7330 W Glendale Ave, Glendale AZ 85303',    service: 'Insurance Claim Inspection' },
        { time: '2:00 PM',  name: 'Angela Green',       phone: '(602) 555-2007', email: 'agreen@gmail.com',        address: '5060 N 19th Ave, Phoenix AZ 85015',         service: 'Leak Repair' },
      ],
      6:  [
        { time: '9:30 AM',  name: 'Roberto Adams',      phone: '(480) 555-2008', email: 'radams@outlook.com',      address: '1825 E Guadalupe Rd, Gilbert AZ 85234',     service: 'Tile Roof Repair' },
        { time: '1:00 PM',  name: 'Jessica Baker',      phone: '(623) 555-2009', email: 'jbaker@gmail.com',        address: '9540 W Northern Ave, Glendale AZ 85305',    service: 'Full Replacement Estimate' },
      ],
      9:  [
        { time: '8:00 AM',  name: 'Samantha Carter',    phone: '(480) 555-2011', email: 'scarter@gmail.com',       address: '6215 E Southern Ave, Mesa AZ 85206',        service: 'Storm Damage Assessment' },
        { time: '2:30 PM',  name: 'Daniel Perez',       phone: '(623) 555-2012', email: 'dperez@hotmail.com',      address: '13450 W Camelback Rd, Litchfield Park AZ 85340', service: 'Roof Inspection' },
      ],
      10: [
        { time: '10:00 AM', name: 'Heather Campbell',   phone: '(602) 555-2013', email: 'hcampbell@gmail.com',     address: '4890 E McDowell Rd, Phoenix AZ 85008',      service: 'Skylight Repair' },
        { time: '3:30 PM',  name: 'Justin Rivera',      phone: '(480) 555-2014', email: 'jrivera@outlook.com',     address: '2340 S Alma School Rd, Mesa AZ 85210',      service: 'Chimney Flashing Repair' },
      ],
      11: [{ time: '11:00 AM', name: 'Laura Ramirez',    phone: '(623) 555-2015', email: 'lramirez@yahoo.com',     address: '8760 W Olive Ave, Peoria AZ 85345',         service: 'Gutter Installation' }],
      12: [
        { time: '9:00 AM',  name: 'Anthony Torres',     phone: '(602) 555-2016', email: 'atorres@gmail.com',       address: '1590 N Central Ave, Phoenix AZ 85004',      service: 'Full Replacement Estimate' },
        { time: '1:00 PM',  name: 'Crystal Brooks',     phone: '(480) 555-2017', email: 'cbrooks@hotmail.com',     address: '7720 E Baseline Rd, Mesa AZ 85209',         service: 'Leak Repair' },
      ],
      13: [{ time: '10:30 AM', name: 'Brandon Cox',      phone: '(623) 555-2018', email: 'bcox@gmail.com',         address: '5230 W Thunderbird Rd, Glendale AZ 85306',  service: 'Insurance Claim Inspection' }],
      14: [{ time: '8:30 AM',  name: 'Tiffany Ward',     phone: '(602) 555-2019', email: 'tward@outlook.com',      address: '3670 E Camelback Rd, Phoenix AZ 85018',     service: 'Roof Inspection' }],
      16: [
        { time: '8:00 AM',  name: 'Eric Sanders',       phone: '(480) 555-2020', email: 'esanders@gmail.com',      address: '9120 E Indian Bend Rd, Scottsdale AZ 85250', service: 'Flat Roof Estimate' },
        { time: '2:00 PM',  name: 'Michelle Peterson',  phone: '(623) 555-2021', email: 'mpeterson@yahoo.com',     address: '10820 N 43rd Ave, Glendale AZ 85304',       service: 'Storm Damage Assessment' },
      ],
      18: [
        { time: '10:00 AM', name: 'Vanessa Collins',    phone: '(480) 555-2023', email: 'vcollins@hotmail.com',    address: '5840 S Kyrene Rd, Tempe AZ 85283',          service: 'Full Replacement Estimate' },
        { time: '3:00 PM',  name: 'Randy Stewart',      phone: '(623) 555-2024', email: 'rstewart@gmail.com',      address: '7190 W Peoria Ave, Peoria AZ 85345',        service: 'Tile Roof Repair' },
      ],
      19: [{ time: '11:30 AM', name: 'Kimberly Reed',    phone: '(602) 555-2025', email: 'kreed@outlook.com',      address: '4330 N 7th Ave, Phoenix AZ 85013',          service: 'Leak Repair' }],
      20: [
        { time: '8:00 AM',  name: 'Sean Murphy',        phone: '(480) 555-2026', email: 'smurphy@gmail.com',       address: '1870 E University Dr, Mesa AZ 85203',       service: 'Insurance Claim Inspection' },
        { time: '1:30 PM',  name: 'Diana Foster',       phone: '(623) 555-2027', email: 'dfoster@yahoo.com',       address: '12340 W Indian School Rd, Avondale AZ 85392', service: 'Roof Inspection' },
      ],
      21: [{ time: '9:00 AM',  name: 'Phillip Gonzalez', phone: '(602) 555-2028', email: 'pgonzalez@gmail.com',    address: '6050 S 48th St, Phoenix AZ 85042',          service: 'Gutter Installation' }],
      24: [
        { time: '8:30 AM',  name: 'Victor Morales',     phone: '(623) 555-2030', email: 'vmorales@gmail.com',      address: '4210 W Greenway Rd, Glendale AZ 85306',     service: 'Full Replacement Estimate' },
        { time: '2:30 PM',  name: 'Amy Richardson',     phone: '(602) 555-2031', email: 'arichardson@outlook.com', address: '1720 N 32nd St, Phoenix AZ 85008',          service: 'Storm Damage Assessment' },
      ],
      25: [
        { time: '9:00 AM',  name: 'Greg Howard',        phone: '(480) 555-2032', email: 'ghoward@yahoo.com',       address: '5560 E Broadway Rd, Mesa AZ 85206',         service: 'Chimney Flashing Repair' },
        { time: '1:00 PM',  name: 'Monica Simmons',     phone: '(623) 555-2033', email: 'msimmons@gmail.com',      address: '9870 W Northern Ave, Peoria AZ 85345',      service: 'Skylight Repair' },
      ],
      26: [{ time: '11:00 AM', name: 'Keith Patterson',  phone: '(602) 555-2034', email: 'kpatterson@gmail.com',   address: '3140 E Thomas Rd, Phoenix AZ 85016',        service: 'Roof Inspection' }],
      27: [
        { time: '8:00 AM',  name: 'Shannon Price',      phone: '(480) 555-2035', email: 'sprice@hotmail.com',      address: '6440 S Rural Rd, Tempe AZ 85283',           service: 'Full Replacement Estimate' },
        { time: '3:00 PM',  name: 'Derrick Russell',    phone: '(623) 555-2036', email: 'drussell@gmail.com',      address: '11550 W Glendale Ave, Glendale AZ 85307',   service: 'Leak Repair' },
      ],
      28: [{ time: '10:30 AM', name: 'Brittany Powell',  phone: '(602) 555-2037', email: 'bpowell@outlook.com',    address: '2880 N 44th St, Phoenix AZ 85008',          service: 'Insurance Claim Inspection' }],
      30: [
        { time: '9:00 AM',  name: 'Marcus Griffin',     phone: '(480) 555-2038', email: 'mgriffin@gmail.com',      address: '7610 E Baseline Rd, Mesa AZ 85209',         service: 'Storm Damage Assessment' },
        { time: '2:00 PM',  name: 'Alicia Diaz',        phone: '(623) 555-2039', email: 'adiaz@yahoo.com',         address: '4520 W Camelback Rd, Phoenix AZ 85031',     service: 'Tile Roof Repair' },
      ],
      31: [{ time: '8:30 AM',  name: 'Wayne Henderson',  phone: '(602) 555-2040', email: 'whenderson@gmail.com',   address: '1350 N Central Ave, Phoenix AZ 85004',      service: 'Roof Maintenance' }],
    },
  },
];

function CalendarMockup() {
  const [phase, setPhase] = useState(0);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const { ref, inView } = useScrollReveal({ threshold: 0.08 });
  const p = calendarPhases[phase];

  const daysInMonth = 31;
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const calendarDays: (number | null)[] = [];
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);
  while (calendarDays.length % 7 !== 0) calendarDays.push(null);

  const handlePhaseChange = (i: number) => {
    setPhase(i);
    setSelectedDay(null);
  };

  const handleDayClick = (day: number | null) => {
    if (day === null || !p.appts[day]) return;
    setSelectedDay(prev => prev === day ? null : day);
  };

  const selectedAppts = selectedDay !== null ? (p.appts[selectedDay] || []) : [];
  const selectedDayOfWeek = selectedDay !== null ? DAY_LABELS[(selectedDay - 1) % 7] : '';

  return (
    <section ref={ref as React.Ref<HTMLElement>} style={S.sectionDark}>
      <div style={S.gridOverlay} />
      <div style={S.container}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', ...fadeUp(inView) }}>
          <div style={S.eyebrowDark}>Appointment Volume</div>
          <h2 style={S.h2Dark}>Watch Your Calendar <HL>Fill Up</HL></h2>
          <p style={S.subDark}>Click each phase to see how your monthly appointments grow. Tap a day to view details.</p>
        </div>

        {/* Phase tabs */}
        <div className="cal-phase-tabs" style={{
          display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '2.5rem',
          ...fadeUp(inView, 150),
        }}>
          {calendarPhases.map((cp, i) => (
            <button
              key={i}
              onClick={() => handlePhaseChange(i)}
              style={{
                padding: '12px 24px', borderRadius: '12px', border: 'none',
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                fontWeight: 700, fontSize: '0.9rem',
                background: phase === i ? `${cp.color}20` : 'rgba(255,255,255,0.05)',
                color: phase === i ? cp.color : 'rgba(255,255,255,0.4)',
                outline: phase === i ? `2px solid ${cp.color}60` : '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.3s ease',
              }}
            >
              {cp.name}
            </button>
          ))}
        </div>

        <div style={{ maxWidth: '700px', margin: '0 auto', ...fadeUp(inView, 300) }}>
          {/* Calendar Card */}
          <div style={{
            ...S.cardDark, padding: '32px', overflow: 'hidden',
            border: `1px solid ${p.color}25`,
            transition: 'border-color 0.4s ease',
          }}>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>March 2026</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{p.subtitle}</div>
            </div>

            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
              {dayNames.map(d => (
                <div key={d} style={{
                  textAlign: 'center', padding: '8px 0',
                  fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)',
                  textTransform: 'uppercase' as const, letterSpacing: '0.08em',
                }}>{d}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
              {calendarDays.map((day, i) => {
                const dayAppts = day !== null ? (p.appts[day] || []) : [];
                const hasAppt = dayAppts.length > 0;
                const isSunday = i % 7 === 0;
                const isSaturday = i % 7 === 6;
                const isSelected = day !== null && selectedDay === day;
                const dotCount = Math.min(dayAppts.length, 3);
                return (
                  <div
                    key={i}
                    onClick={() => handleDayClick(day)}
                    style={{
                      aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: '10px', position: 'relative' as const,
                      background: isSelected ? `${p.color}30` : hasAppt ? `${p.color}18` : 'rgba(255,255,255,0.02)',
                      border: isSelected ? `2px solid ${p.color}` : hasAppt ? `1px solid ${p.color}30` : '1px solid rgba(255,255,255,0.04)',
                      transition: 'all 0.3s ease',
                      cursor: hasAppt ? 'pointer' : 'default',
                    }}
                  >
                    {day !== null && (
                      <>
                        <span style={{
                          fontSize: '0.85rem', fontWeight: hasAppt ? 700 : 500,
                          color: isSelected ? '#fff' : hasAppt ? p.color : isSunday || isSaturday ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.5)',
                          transition: 'color 0.3s ease',
                        }}>{day}</span>
                        {hasAppt && (
                          <div style={{
                            position: 'absolute' as const, bottom: '3px', left: '50%', transform: 'translateX(-50%)',
                            display: 'flex', gap: '2px',
                          }}>
                            {Array.from({ length: dotCount }).map((_, di) => (
                              <div key={di} style={{
                                width: '4px', height: '4px', borderRadius: '50%',
                                background: isSelected ? '#fff' : p.color, transition: 'background 0.3s ease',
                              }} />
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Appointment detail panel */}
            {selectedDay !== null && selectedAppts.length > 0 && (
              <div style={{
                marginTop: '20px', paddingTop: '20px',
                borderTop: `1px solid ${p.color}20`,
                animation: 'calDetailIn 0.3s ease-out',
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: '14px',
                }}>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                    {selectedDayOfWeek}, March {selectedDay}
                  </div>
                  <div style={{
                    fontSize: '0.75rem', fontWeight: 600, color: p.color,
                    padding: '3px 10px', borderRadius: '6px', background: `${p.color}15`,
                  }}>
                    {selectedAppts.length} appt{selectedAppts.length > 1 ? 's' : ''}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedAppts.map((appt, ai) => (
                    <div key={ai} style={{
                      padding: '16px', borderRadius: '12px',
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '34px', height: '34px', borderRadius: '50%',
                            background: `${p.color}20`, border: `1px solid ${p.color}30`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.7rem', fontWeight: 700, color: p.color, flexShrink: 0,
                          }}>
                            {appt.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{appt.name}</div>
                            <div style={{ fontSize: '0.75rem', color: p.color, fontWeight: 600 }}>{appt.service}</div>
                          </div>
                        </div>
                        <div style={{
                          fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)',
                          padding: '4px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)',
                        }}>
                          {appt.time}
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                          <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)' }}>{appt.phone}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                          <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)' }}>{appt.email}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', gridColumn: '1 / -1' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                          <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)' }}>{appt.address}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div style={{
            textAlign: 'center', marginTop: '1.5rem',
            fontSize: '1rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6,
          }}>
            {p.description}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes calDetailIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}


/* ═══════════════════════════════════════════════════
   SEO DEMO — before/after Google search mockups
   ═══════════════════════════════════════════════════ */
function GoogleSearchBar() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '10px 16px', borderRadius: '24px',
      border: '1px solid #dfe1e5', background: '#fff',
      boxShadow: '0 2px 5px rgba(32,33,36,0.1)',
      margin: '0 20px',
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="#4285f4"/></svg>
      <span style={{ flex: 1, fontSize: '0.9rem', color: '#202124' }}>roofing contractor near me</span>
      <svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 15c1.66 0 2.99-1.34 2.99-3L15 6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 15 6.7 12H5c0 3.41 2.72 6.23 6 6.72V22h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" fill="#4285f4"/></svg>
    </div>
  );
}

function GoogleTabs() {
  return (
    <div style={{
      display: 'flex', gap: '0', padding: '0 20px',
      borderBottom: '1px solid #ebebeb', marginTop: '6px',
    }}>
      {['All', 'Maps', 'Images', 'Videos', 'Shopping'].map((tab, i) => (
        <span key={tab} style={{
          padding: '8px 16px', fontSize: '0.78rem', color: i === 0 ? '#1a73e8' : '#70757a',
          fontWeight: i === 0 ? 600 : 400,
          borderBottom: i === 0 ? '3px solid #1a73e8' : '3px solid transparent',
          cursor: 'pointer',
        }}>{tab}</span>
      ))}
    </div>
  );
}

function GoogleResult({ url, favicon, title, desc, dimmed }: { url: string; favicon: string; title: string; desc: string; dimmed?: boolean }) {
  return (
    <div style={{ padding: '14px 0', opacity: dimmed ? 0.45 : 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <div style={{
          width: '26px', height: '26px', borderRadius: '50%', background: '#f1f3f4',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.6rem', fontWeight: 700, color: '#5f6368', flexShrink: 0,
        }}>{favicon}</div>
        <div>
          <div style={{ fontSize: '0.72rem', color: '#202124', lineHeight: 1.2 }}>{url}</div>
          <div style={{ fontSize: '0.65rem', color: '#4d5156' }}>{url.split(' › ')[0]}</div>
        </div>
      </div>
      <div style={{ fontSize: '1.05rem', color: '#1a0dab', marginBottom: '4px', lineHeight: 1.3, cursor: 'pointer' }}>{title}</div>
      <div style={{ fontSize: '0.82rem', color: '#4d5156', lineHeight: 1.5 }}>{desc}</div>
    </div>
  );
}

function SEODemo() {
  const { ref, inView } = useScrollReveal({ threshold: 0.08 });

  return (
    <section ref={ref as React.Ref<HTMLElement>} style={S.section}>
      <div style={S.container}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', ...fadeUp(inView) }}>
          <div style={S.eyebrow}>Search Visibility</div>
          <h2 style={S.h2}>From Invisible to <HL>Unavoidable</HL></h2>
          <p style={S.sub}>When homeowners search for your service, your business needs to be the first thing they see.</p>
        </div>

        <div className="seo-grid-2" style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px',
          maxWidth: '1100px', margin: '0 auto',
          ...fadeUp(inView, 200),
        }}>
          {/* ─── BEFORE ─── */}
          <div style={{ ...S.card, overflow: 'hidden' }}>
            <div style={{
              padding: '10px 16px', background: '#fafafa',
              borderBottom: '1px solid #E5E5E5',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#d93025' }}>Before RevCore</span>
              <span style={{ fontSize: '0.65rem', color: '#999', fontWeight: 600 }}>Page 3</span>
            </div>

            <div style={{ background: '#fff', paddingBottom: '8px' }}>
              {/* Google header */}
              <div style={{ padding: '16px 20px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                  <svg width="74" height="24" viewBox="0 0 272 92" xmlns="http://www.w3.org/2000/svg">
                    <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#ea4335"/>
                    <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#fbbc05"/>
                    <path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" fill="#4285f4"/>
                    <path d="M225 3v65h-9.5V3h9.5z" fill="#34a853"/>
                    <path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.96 0-11.84 4.37-11.59 12.93z" fill="#ea4335"/>
                    <path d="M35.29 41.19V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49-.21z" fill="#4285f4"/>
                  </svg>
                </div>
              </div>
              <GoogleSearchBar />
              <GoogleTabs />

              <div style={{ padding: '4px 20px 0' }}>
                <div style={{ fontSize: '0.72rem', color: '#70757a', padding: '8px 0' }}>About 2,340,000 results (0.42 seconds)</div>

                {/* Sponsored ad */}
                <div style={{ padding: '10px 0', borderBottom: '1px solid #ebebeb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#202124', background: '#f1f3f4', padding: '2px 6px', borderRadius: '3px', border: '1px solid #dadce0' }}>Sponsored</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', fontWeight: 700, color: '#1a73e8' }}>AR</div>
                    <div style={{ fontSize: '0.72rem', color: '#202124' }}>www.acme-roofing-ads.com</div>
                  </div>
                  <div style={{ fontSize: '1rem', color: '#1a0dab', marginBottom: '3px', cursor: 'pointer' }}>Acme Roofing - Get A Free Quote Today</div>
                  <div style={{ fontSize: '0.8rem', color: '#4d5156', lineHeight: 1.45 }}>Top rated roofing company. Call now for a free estimate. Licensed &amp; insured. Serving the greater metro area.</div>
                </div>

                <GoogleResult
                  url="www.competitor-roofers.com › services"
                  favicon="CR"
                  title="Competitor Roofing Co - Professional Roof Repair & Replacement"
                  desc="Trusted roofing contractor with 15+ years of experience. We offer free inspections, emergency repairs, and full roof replacements. Call today for your estimate."
                />
                <div style={{ borderBottom: '1px solid #ebebeb' }} />
                <GoogleResult
                  url="www.another-roofer.com › about"
                  favicon="AR"
                  title="Another Roofing LLC - Licensed & Insured Contractors"
                  desc="Family-owned roofing company serving residential and commercial clients. BBB accredited. Financing available on all projects."
                />
                <div style={{ borderBottom: '1px solid #ebebeb' }} />
                <GoogleResult
                  url="www.bigbox-roofing.com › local"
                  favicon="BB"
                  title="BigBox Roofing Solutions - Affordable Roof Repair"
                  desc="Affordable roof repair and replacement services. Free estimates within 24 hours. Satisfaction guaranteed on all work."
                  dimmed
                />

                {/* Your listing buried notice */}
                <div style={{ padding: '18px 12px 8px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic' }}>
                    Your business... somewhere on page 3
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '10px' }}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <span key={n} style={{
                        width: '28px', height: '28px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.75rem', fontWeight: 500,
                        background: n === 3 ? '#FE646215' : 'transparent',
                        color: n === 1 ? '#1a73e8' : n === 3 ? '#FE6462' : '#70757a',
                        border: n === 3 ? '1px solid #FE646230' : 'none',
                        cursor: 'pointer',
                      }}>{n}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── AFTER ─── */}
          <div style={{
            ...S.card, overflow: 'hidden',
            border: '1px solid rgba(148,217,107,0.25)',
            boxShadow: '0 8px 40px rgba(148,217,107,0.08)',
          }}>
            <div style={{
              padding: '10px 16px', background: 'rgba(148,217,107,0.06)',
              borderBottom: '1px solid rgba(148,217,107,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16a34a' }}>After RevCore</span>
              <span style={{ fontSize: '0.65rem', color: '#16a34a', fontWeight: 600 }}>#1 in Maps + Organic</span>
            </div>

            <div style={{ background: '#fff', paddingBottom: '8px' }}>
              {/* Google header */}
              <div style={{ padding: '16px 20px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                  <svg width="74" height="24" viewBox="0 0 272 92" xmlns="http://www.w3.org/2000/svg">
                    <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#ea4335"/>
                    <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#fbbc05"/>
                    <path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" fill="#4285f4"/>
                    <path d="M225 3v65h-9.5V3h9.5z" fill="#34a853"/>
                    <path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.96 0-11.84 4.37-11.59 12.93z" fill="#ea4335"/>
                    <path d="M35.29 41.19V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49-.21z" fill="#4285f4"/>
                  </svg>
                </div>
              </div>
              <GoogleSearchBar />
              <GoogleTabs />

              <div style={{ padding: '4px 20px 0' }}>
                <div style={{ fontSize: '0.72rem', color: '#70757a', padding: '8px 0' }}>About 2,340,000 results (0.38 seconds)</div>

                {/* Google Maps 3-Pack */}
                <div style={{
                  padding: '14px', borderRadius: '12px', marginBottom: '6px',
                  background: '#fff', border: '1px solid #dadce0',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #ebebeb' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#34a853"/><circle cx="12" cy="9" r="2.5" fill="#fff"/></svg>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#202124' }}>Places</span>
                  </div>

                  {/* #1 — Your business */}
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                    padding: '10px', borderRadius: '8px', marginBottom: '6px',
                    background: 'rgba(148,217,107,0.06)', border: '1px solid rgba(148,217,107,0.2)',
                  }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ff7a1a, #e85d04)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.55rem', fontWeight: 700, color: '#fff', flexShrink: 0,
                    }}>PR</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1a0dab' }}>Premium Roofing Co</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '2px 0' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#202124' }}>4.9</span>
                        <div style={{ display: 'flex', gap: '0px' }}>
                          {[1,2,3,4,5].map(s => (
                            <svg key={s} width="12" height="12" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#fbbc04"/></svg>
                          ))}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#70757a' }}>(127)</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#70757a' }}>Roofing contractor · Phoenix, AZ</div>
                      <div style={{ fontSize: '0.72rem', color: '#70757a' }}>Open · Closes 6 PM</div>
                    </div>
                  </div>

                  {/* #2 — Competitor */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px 10px', opacity: 0.6 }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e8eaed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', fontWeight: 700, color: '#5f6368', flexShrink: 0 }}>CR</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a0dab' }}>Competitor Roofing Co</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '2px 0' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#202124' }}>4.2</span>
                        <div style={{ display: 'flex' }}>{[1,2,3,4].map(s => <svg key={s} width="11" height="11" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#fbbc04"/></svg>)}<svg width="11" height="11" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#dadce0"/></svg></div>
                        <span style={{ fontSize: '0.68rem', color: '#70757a' }}>(43)</span>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#70757a' }}>Roofing contractor · Phoenix, AZ</div>
                    </div>
                  </div>

                  {/* #3 — Another */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px 10px', opacity: 0.5 }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e8eaed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', fontWeight: 700, color: '#5f6368', flexShrink: 0 }}>AR</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a0dab' }}>Another Roofing LLC</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '2px 0' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#202124' }}>3.8</span>
                        <div style={{ display: 'flex' }}>{[1,2,3,4].map(s => <svg key={s} width="11" height="11" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={s <= 3 ? '#fbbc04' : '#dadce0'}/></svg>)}<svg width="11" height="11" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#dadce0"/></svg></div>
                        <span style={{ fontSize: '0.68rem', color: '#70757a' }}>(19)</span>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#70757a' }}>Roofing contractor · Glendale, AZ</div>
                    </div>
                  </div>
                </div>

                {/* Organic #1 — Your site */}
                <GoogleResult
                  url="www.premium-roofing.com › services › phoenix"
                  favicon="PR"
                  title="Premium Roofing Co - #1 Rated Roofing Contractor in Phoenix"
                  desc="5-star rated roofing contractor serving Phoenix, Scottsdale, and the East Valley. Free inspections, same-day estimates, and financing available. Book online 24/7."
                />
                <div style={{ borderBottom: '1px solid #ebebeb' }} />
                <GoogleResult
                  url="www.competitor-roofers.com › services"
                  favicon="CR"
                  title="Competitor Roofing Co - Free Estimates"
                  desc="Professional roofing services for your area. Licensed and insured contractor."
                  dimmed
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════════════
   SELECTIVE — "Who This Isn't For" takeaway
   ═══════════════════════════════════════════════════ */
function SelectiveSection() {
  const { ref, inView } = useScrollReveal({ threshold: 0.08 });
  const disqualifiers = [
    { text: "You're looking for the cheapest option", detail: "We're a growth partner, not a discount vendor." },
    { text: "You don't follow up on leads", detail: 'We bring them in. You have to close them.' },
    { text: "You're not ready to grow", detail: 'Our system creates demand. You need the capacity to meet it.' },
  ];
  return (
    <section ref={ref as React.Ref<HTMLElement>} style={S.section}>
      <div style={S.container}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', ...fadeUp(inView) }}>
          <div style={S.eyebrow}>
            <span style={{ width: 20, height: 2, background: '#FE6462', display: 'block' }} />
            Fair Warning
            <span style={{ width: 20, height: 2, background: '#FE6462', display: 'block' }} />
          </div>
          <h2 style={S.h2}>This Isn&apos;t for <HL>Everyone</HL></h2>
          <p style={{ ...S.sub, marginBottom: '2.5rem' }}>We&apos;re selective about who we work with. RevCore is built for contractors who are serious about growth, not tire-kickers.</p>
        </div>

        <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px', ...fadeUp(inView, 200) }}>
          {disqualifiers.map((d, i) => (
            <div key={i} style={{
              ...S.card, padding: '20px 24px', display: 'flex', alignItems: 'flex-start', gap: '16px',
              ...scaleUp(inView, stagger(i, 200, 120)),
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: 'rgba(254,100,98,0.08)', border: '1px solid rgba(254,100,98,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#FE6462', fontWeight: 800, fontSize: '0.85rem',
              }}>✕</div>
              <div>
                <div style={{ fontWeight: 700, color: '#0A0A0A', fontSize: '0.95rem', marginBottom: '4px' }}>{d.text}</div>
                <div style={{ color: '#6B6B6B', fontSize: '0.85rem', lineHeight: 1.5 }}>{d.detail}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem', ...fadeUp(inView, 400) }}>
          <p style={{ color: '#6B6B6B', fontSize: '0.9rem', fontStyle: 'italic' }}>
            Still here? Good. You&apos;re exactly who we built this for.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   PRICING — click to enlarge, double-click title to dim
   ═══════════════════════════════════════════════════ */
function PricingSection() {
  const [isQuarterly, setIsQuarterly] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [focusedPkg, setFocusedPkg] = useState<string | null>(null);
  const [dimmedPkgs, setDimmedPkgs] = useState<Record<string, boolean>>({});
  const { ref, inView } = useScrollReveal({ threshold: 0.06 });

  const fmtPrice = (monthly: number) => {
    const p = isQuarterly ? Math.round(monthly * 0.9) : monthly;
    return '$' + p.toLocaleString();
  };

  const handleCardClick = (pkgId: string) => {
    if (dimmedPkgs[pkgId]) return;
    setFocusedPkg(prev => prev === pkgId ? null : pkgId);
  };

  const handleTitleDoubleClick = (e: React.MouseEvent, pkgId: string) => {
    e.stopPropagation();
    setDimmedPkgs(prev => ({ ...prev, [pkgId]: !prev[pkgId] }));
    if (focusedPkg === pkgId) setFocusedPkg(null);
  };

  const isLaunchpad = (id: string) => id === 'launchpad';

  return (
    <section ref={ref as React.Ref<HTMLElement>} id="pricing" style={{ ...S.sectionDark, padding: '120px 0' }}>
      <div style={S.gridOverlay} />
      <div style={{
        position: 'absolute', top: '25%', left: '55%', transform: 'translateX(-50%)',
        width: 1000, height: 600,
        background: 'radial-gradient(ellipse at center, rgba(107,142,254,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem', ...fadeUp(inView) }}>
          <div style={S.eyebrowDark}>
            <span style={{ width: 20, height: 2, background: '#6B8EFE', display: 'block' }} />
            Choose Your Path
            <span style={{ width: 20, height: 2, background: '#6B8EFE', display: 'block' }} />
          </div>
          <h2 style={{ ...S.h2Dark, fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Growth Packages Built for <HL>Contractors</HL></h2>
          <p style={{ ...S.subDark, fontSize: '1.1rem', marginBottom: '2rem' }}>Three proven systems designed to meet you where you are and take you where you want to go.</p>

          {/* Billing Toggle */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, padding: 4, gap: 2,
            }}>
              <button onClick={() => setIsQuarterly(false)} style={{
                padding: '10px 26px', borderRadius: 100, border: 'none', cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.95rem',
                background: !isQuarterly ? 'white' : 'transparent',
                color: !isQuarterly ? '#0A0A0A' : 'rgba(255,255,255,0.45)', transition: 'all 0.2s',
              }}>Monthly</button>
              <button onClick={() => setIsQuarterly(true)} style={{
                padding: '10px 26px', borderRadius: 100, border: 'none', cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.95rem',
                background: isQuarterly ? 'white' : 'transparent',
                color: isQuarterly ? '#0A0A0A' : 'rgba(255,255,255,0.45)', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                Quarterly
                <span style={{
                  background: '#94D96B', color: '#0a0a0a', fontSize: '0.65rem', fontWeight: 800,
                  padding: '3px 9px', borderRadius: 100, letterSpacing: '0.05em',
                }}>SAVE 10%</span>
              </button>
            </div>
          </div>
        </div>

        {/* Package Cards */}
        <div className="packages-grid-3" style={{
          display: 'grid',
          gridTemplateColumns: '0.95fr 1.06fr 1.06fr',
          gap: '20px', alignItems: 'stretch',
        }}>
          {packagesData.map((pkg, i) => {
            const isFocused = focusedPkg === pkg.id;
            const isDimmed = dimmedPkgs[pkg.id];
            const hasAnyFocus = focusedPkg !== null;
            const isOtherFocused = hasAnyFocus && !isFocused;
            const muted = isLaunchpad(pkg.id) && !isFocused;
            const promoted = !isLaunchpad(pkg.id);

            return (
              <div
                key={pkg.id}
                onClick={() => handleCardClick(pkg.id)}
                className={`pkg-card${isFocused ? ' pkg-focused' : ''}${isDimmed ? ' pkg-dimmed' : ''}`}
                style={{
                  borderRadius: 24,
                  background: muted
                    ? 'linear-gradient(160deg, #10121a 0%, #14171f 50%, #10121a 100%)'
                    : 'linear-gradient(160deg, #13161e 0%, #1a1e2a 50%, #13161e 100%)',
                  border: `1px solid ${isFocused ? pkg.accent + '60' : muted ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)'}`,
                  overflow: 'hidden', position: 'relative',
                  display: 'flex', flexDirection: 'column' as const,
                  transform: isFocused ? 'scale(1.06)' : isDimmed ? 'scale(0.96)' : 'scale(1)',
                  zIndex: isFocused ? 10 : 1,
                  opacity: isDimmed ? 0.25 : isOtherFocused ? 0.4 : muted ? 0.85 : 1,
                  filter: isDimmed ? 'grayscale(1)' : 'none',
                  boxShadow: isFocused
                    ? `0 0 0 1px ${pkg.accent}50, 0 0 60px ${pkg.accent}25, 0 24px 48px rgba(0,0,0,0.5)`
                    : promoted && !hasAnyFocus
                      ? `0 0 0 1px ${pkg.accent}15, 0 8px 40px rgba(0,0,0,0.5)`
                      : '0 2px 16px rgba(0,0,0,0.3)',
                  transition: 'transform 0.45s cubic-bezier(0.22,1,0.36,1), opacity 0.35s ease, box-shadow 0.45s ease, border-color 0.35s ease, filter 0.35s ease',
                  cursor: isDimmed ? 'default' : 'pointer',
                  ...scaleUp(inView, stagger(i, 200, 150)),
                }}
              >
                {/* Accent Bar */}
                <div style={{
                  height: promoted ? 4 : 2,
                  background: `linear-gradient(90deg, transparent 0%, ${pkg.accent} 40%, ${pkg.accent} 60%, transparent 100%)`,
                  opacity: isFocused ? 1 : promoted ? 0.7 : 0.25,
                  transition: 'opacity 0.35s ease',
                }} />

                {/* Badge */}
                {promoted ? (
                  <div style={{
                    position: 'absolute', top: 22, right: 20,
                    background: `linear-gradient(135deg, ${pkg.accent}ee, ${pkg.accent}99)`,
                    color: 'white', fontSize: '0.7rem', fontWeight: 800,
                    padding: '5px 14px', borderRadius: 100,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    boxShadow: `0 2px 12px ${pkg.accent}40`,
                    transition: 'all 0.3s',
                  }}>{pkg.id === 'growth' ? 'Recommended' : pkg.badge}</div>
                ) : (
                  <div style={{
                    position: 'absolute', top: 22, right: 20,
                    border: `1px solid rgba(255,255,255,0.15)`, color: 'rgba(255,255,255,0.35)',
                    fontSize: '0.65rem', fontWeight: 700,
                    padding: '4px 12px', borderRadius: 100,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                  }}>{pkg.badge}</div>
                )}

                {/* Content */}
                <div style={{ padding: promoted ? '2.5rem 2.5rem 1.5rem' : '2rem 2rem 1.5rem' }}>
                  <h3
                    onDoubleClick={(e) => handleTitleDoubleClick(e, pkg.id)}
                    style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: promoted ? '1.6rem' : '1.4rem',
                      fontWeight: 800,
                      color: muted ? 'rgba(255,255,255,0.85)' : 'white',
                      marginBottom: '0.4rem', userSelect: 'none',
                      cursor: 'pointer',
                    }}
                  >{pkg.name}</h3>
                  <p style={{
                    color: muted ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.4)',
                    fontSize: promoted ? '0.95rem' : '0.85rem',
                    lineHeight: 1.5, marginBottom: '1.5rem',
                  }}>{pkg.tagline}</p>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                    <span style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: promoted ? '3.2rem' : '2.8rem',
                      fontWeight: 800, letterSpacing: '-0.03em',
                      color: muted ? 'rgba(255,255,255,0.75)' : 'white',
                    }}>
                      {fmtPrice(pkg.priceMonthly)}
                    </span>
                    {pkg.id !== 'launchpad' && (
                      <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.28)' }}>/mo</span>
                    )}
                  </div>

                  {isQuarterly ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)' }}>billed {pkg.quarterlyTotal}</span>
                      <span style={{
                        fontSize: '0.72rem', fontWeight: 700, color: '#94D96B',
                        background: 'rgba(148,217,107,0.12)', border: '1px solid rgba(148,217,107,0.2)',
                        padding: '3px 10px', borderRadius: 100,
                      }}>save {pkg.quarterlySave}</span>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{pkg.noteMonthly}</span>
                  )}
                </div>

                {/* Features */}
                <div style={{ padding: promoted ? '0 2.5rem 1.5rem' : '0 2rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{
                    fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.22)', margin: '1.25rem 0 1rem',
                  }}>
                    {pkg.featuresTitle || "What's included"}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {pkg.heroFeatures.map((f, fi) => (
                      <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 0' }}>
                        <Check size={promoted ? 18 : 15} style={{ color: pkg.accent, flexShrink: 0 }} />
                        <span style={{
                          fontSize: promoted ? '1.05rem' : '0.9rem',
                          fontWeight: 600,
                          color: muted ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.88)',
                        }}>{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* Loss framing for Launchpad */}
                  {isLaunchpad(pkg.id) && (
                    <div style={{
                      marginTop: 14, padding: '10px 14px', borderRadius: 10,
                      background: 'rgba(254,100,98,0.06)', border: '1px solid rgba(254,100,98,0.12)',
                    }}>
                      <span style={{ fontSize: '0.8rem', color: 'rgba(254,100,98,0.7)', fontWeight: 500 }}>
                        Does not include website, SEO, or sales tools
                      </span>
                    </div>
                  )}

                  {pkg.moreFeatures.length > 0 && (
                  <button onClick={(e) => { e.stopPropagation(); setExpanded(p => ({ ...p, [pkg.id]: !p[pkg.id] })); }} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', fontWeight: 600,
                    marginTop: 14, padding: 0, fontFamily: 'DM Sans, sans-serif',
                  }}>
                    <ChevronDown size={14} style={{ transform: expanded[pkg.id] ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                    {expanded[pkg.id] ? 'Show less' : `See all ${pkg.heroFeatures.length + pkg.moreFeatures.length} features`}
                  </button>
                  )}

                  {expanded[pkg.id] && (
                    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {pkg.moreFeatures.map((f, fi) => (
                        <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Check size={14} style={{ color: pkg.accent, flexShrink: 0 }} />
                          <span style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.5)' }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div style={{ padding: promoted ? '1.25rem 2.5rem 2.5rem' : '1rem 2rem 2rem', marginTop: 'auto' }}>
                  <button onClick={(e) => e.stopPropagation()} style={{
                    width: '100%',
                    padding: promoted ? 18 : 14,
                    borderRadius: 100,
                    fontSize: promoted ? '1.05rem' : '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: promoted ? 'none' : `1px solid ${pkg.accent}30`,
                    background: promoted
                      ? `linear-gradient(135deg, ${pkg.accent}dd 0%, ${pkg.accent}99 100%)`
                      : isFocused
                        ? `linear-gradient(135deg, ${pkg.accent}dd 0%, ${pkg.accent}99 100%)`
                        : 'transparent',
                    color: 'white',
                    transition: 'all 0.35s ease',
                    boxShadow: promoted ? `0 4px 24px ${pkg.accent}35` : isFocused ? `0 4px 24px ${pkg.accent}40` : 'none',
                  }}>Claim Your Market</button>
                </div>
              </div>
            );
          })}
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
   SOCIAL PROOF STRIP
   ═══════════════════════════════════════════════════ */
function SocialProofStrip() {
  const { ref, inView } = useScrollReveal({ threshold: 0.2 });
  const stats = [
    { value: '12+', label: 'Markets Claimed' },
    { value: '1,400+', label: 'Appointments Booked' },
    { value: '97%', label: 'Client Retention' },
  ];
  return (
    <section ref={ref as React.Ref<HTMLElement>} style={{ padding: '48px 0', background: '#F5F5F5' }}>
      <div style={{ ...S.container, ...fadeUp(inView) }}>
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '48px', flexWrap: 'wrap',
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', ...scaleUp(inView, stagger(i, 0, 120)) }}>
              <div style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: '2rem', fontWeight: 800,
                color: '#0A0A0A', letterSpacing: '-0.02em',
              }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: '#6B6B6B', fontWeight: 500, letterSpacing: '0.02em' }}>{s.label}</div>
            </div>
          ))}
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

