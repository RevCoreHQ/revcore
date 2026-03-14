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
      <OutcomeSection />
      <SystemDiagram />
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
   Overview → Current → Phase 1 → Phase 2 (widest)
   ═══════════════════════════════════════════════════ */
const funnelData = [
  {
    title: 'Overview',
    subtitle: 'The funnel explained',
    color: '#999999',
    topW: 330, botW: 100,
    people: 6,
    peopleLabel: 'These represent the potential customers entering your funnel. The wider the top, the more people discover your business.',
    revenue: 'Revenue',
    layers: ['Digital Presence', 'Systems', 'Appointments', 'Jobs'],
    descriptions: [
      'How potential customers find you online, your website, ads, search rankings, and social media presence.',
      'The tools and automations that capture, organize, and follow up with incoming leads.',
      'How leads get converted into scheduled, confirmed appointments on your calendar.',
      'The booked jobs that generate revenue, the bottom line of your funnel.',
    ],
  },
  {
    title: 'Current',
    subtitle: 'Where you are now',
    color: '#FE6462',
    topW: 280, botW: 80,
    people: 3,
    peopleLabel: 'Only 3 people per month are finding your business, all through word of mouth. No online presence means most potential customers never know you exist.',
    revenue: 'Revenue $',
    layers: ['Referrals Only', 'Call / Text To Set Appt', 'Appointments', 'Jobs'],
    descriptions: [
      'You rely entirely on word of mouth. No ads, no SEO, no website traffic, inconsistent lead flow.',
      'Every lead requires a manual phone call or text. Leads slip through the cracks when you\'re busy on a job.',
      'Scheduling is manual. No shows are frequent. No automated reminders or confirmations.',
      'Fewer jobs because the top of your funnel is narrow and every step leaks potential customers.',
    ],
  },
  {
    title: 'Phase 1',
    subtitle: 'Foundation',
    color: '#6B8EFE',
    topW: 420, botW: 120,
    people: 12,
    peopleLabel: '12 people per month now find your business through referrals and targeted Meta Ads. That\'s 3x more visibility than before.',
    revenue: 'Revenue $$',
    layers: ['Referrals + Meta Ads', 'Auto Booking System', 'Appt Reminders', 'Jobs'],
    descriptions: [
      'Meta ads target your service area. Referrals keep flowing, now you have two lead sources.',
      'Leads land on your website and self book appointments. CRM captures every inquiry automatically.',
      'Automated SMS & email reminders reduce no shows. Calendar stays organized without manual effort.',
      'More appointments mean more jobs. Consistent pipeline replaces the feast or famine cycle.',
    ],
  },
  {
    title: 'Phase 2',
    subtitle: 'Full Scale',
    color: '#94D96B',
    topW: 500, botW: 150,
    people: 20,
    peopleLabel: '20+ people per month discover your business through referrals, Meta Ads, and organic SEO. You\'re now visible across every channel in your market.',
    revenue: 'Revenue $$$',
    layers: ['Referrals + Paid Ads + Optimized Website + SEO', 'Auto Booking System', 'Appt Reminders', 'Jobs'],
    descriptions: [
      'SEO, Google Business, and content marketing compound with Meta ads. You dominate your local market across every channel.',
      'AI powered follow ups, review requests, and re-engagement campaigns run on autopilot 24/7.',
      'Smart scheduling optimizes routes and availability. Confirmation rates exceed 90%.',
      'Maximum job volume with minimal overhead. Your funnel is wide at the top and efficient all the way down.',
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
                  const cols = Math.min(funnel.people || 1, 10);
                  const rows = Math.ceil((funnel.people || 1) / cols);
                  const row = Math.floor(pi / cols);
                  const col = pi % cols;
                  const colsInRow = row < rows - 1 ? cols : (funnel.people || 1) - row * cols;
                  const spacing = 22;
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
                                    style={{ width: '100%', height: '180px', border: 'none' }}
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
          gridTemplateColumns: '0.92fr 1.08fr 1.08fr',
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

                  <button onClick={(e) => { e.stopPropagation(); setExpanded(p => ({ ...p, [pkg.id]: !p[pkg.id] })); }} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', fontWeight: 600,
                    marginTop: 14, padding: 0, fontFamily: 'DM Sans, sans-serif',
                  }}>
                    <ChevronDown size={14} style={{ transform: expanded[pkg.id] ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                    {expanded[pkg.id] ? 'Show less' : `See all ${pkg.heroFeatures.length + pkg.moreFeatures.length} features`}
                  </button>

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

