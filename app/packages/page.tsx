'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type L from 'leaflet';
import SystemDiagram from '@/components/sections/SystemDiagram';
import SpaceBackground from '@/components/SpaceBackground';
import IpadMockup from '@/components/iPadMockup';
import QuotingApp from '@/components/QuotingApp';
import PitchApp from '@/components/PitchApp';
import { useScrollReveal, fadeUp, scaleUp, stagger } from '@/hooks/useScrollReveal';
import { Check, CheckCircle, ChevronDown } from 'lucide-react';
import {
  packagesData, phoneSteps, fbAds,
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
  sectionDark: { padding: '96px 0', position: 'relative' as const, background: '#0A0A0A', color: '#fff', overflow: 'hidden' as const },
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
  lightPattern: {
    position: 'absolute' as const, inset: 0,
    backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.045) 1px, transparent 1px)',
    backgroundSize: '24px 24px', pointerEvents: 'none' as const, zIndex: 0,
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
      <SoftwareSection />
      <SystemDiagram />
      <ExclusivitySection />
      <SelectiveSection />
      <PricingSection />
      <ROICalculator />
      <SocialProofStrip />
      <style>{`
        .pkg-card { user-select: none; }
        .pkg-card:hover {
          transform: translateY(-6px) !important;
          border-color: var(--pkg-accent-border, rgba(255,255,255,0.15)) !important;
          box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 30px var(--pkg-accent-glow, rgba(107,142,254,0.06)), inset 0 1px 0 rgba(255,255,255,0.08) !important;
        }
        @keyframes pkgModalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pkgModalScaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        /* ── Software Demo Overlay ── */
        @keyframes demoPulseA {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.35); opacity: 0; }
        }
        @keyframes demoBackdropIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes demoIpadIn { from { opacity: 0; transform: scale(0.87) translateY(22px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes demoStepIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes demoFadeUp { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes demoDot { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

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
          background: linear-gradient(145deg, #e8854a 0%, #d4713a 50%, #c0622e 100%);
          border-radius: 48px;
          padding: 5px;
          box-shadow:
            0 40px 80px rgba(0,0,0,0.5),
            0 20px 40px rgba(0,0,0,0.4),
            inset 0 1px 2px rgba(255,255,255,0.25);
        }
        .phone-frame::before {
          content: '';
          position: absolute;
          right: -3px;
          top: 140px;
          width: 4px;
          height: 70px;
          background: linear-gradient(180deg, #d4713a 0%, #b85a28 100%);
          border-radius: 0 3px 3px 0;
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.3);
        }
        .phone-frame::after {
          content: '';
          position: absolute;
          left: -3px;
          top: 120px;
          width: 4px;
          height: 35px;
          background: linear-gradient(180deg, #d4713a 0%, #b85a28 100%);
          border-radius: 3px 0 0 3px;
          box-shadow:
            inset 0 1px 1px rgba(255,255,255,0.3),
            0 55px 0 0 #d4713a;
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
          padding: 0;
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

        /* iOS Home Indicator */
        .phone-home-indicator {
          position: absolute;
          bottom: 6px;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 4px;
          background: rgba(0,0,0,0.2);
          border-radius: 4px;
          z-index: 20;
        }

        /* FB Feed Layout */
        .fb-feed-wrapper {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #f0f2f5;
          overflow: hidden;
        }
        .fb-feed-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 12px;
          background: #fff;
          border-bottom: 1px solid #e4e6eb;
        }
        .fb-feed-topbar-logo {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1877f2;
          letter-spacing: -0.5px;
        }
        .fb-feed-topbar-icons {
          display: flex;
          gap: 6px;
        }
        .fb-feed-topbar-icon {
          width: 28px;
          height: 28px;
          background: #e4e6eb;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .fb-feed-topbar-icon svg {
          width: 14px;
          height: 14px;
          fill: #050505;
        }
        .fb-create-post {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: #fff;
          border-bottom: 1px solid #e4e6eb;
        }
        .fb-create-avatar {
          width: 28px;
          height: 28px;
          background: #e4e6eb;
          border-radius: 50%;
        }
        .fb-create-input {
          flex: 1;
          padding: 6px 12px;
          background: #f0f2f5;
          border-radius: 20px;
          font-size: 0.72rem;
          color: #65676b;
        }
        .fb-stories-bar {
          display: flex;
          gap: 6px;
          padding: 8px 12px;
          background: #fff;
          border-bottom: 6px solid #f0f2f5;
          overflow: hidden;
        }
        .fb-story-item {
          width: 62px;
          height: 90px;
          border-radius: 10px;
          overflow: hidden;
          position: relative;
          flex-shrink: 0;
        }
        .fb-story-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .fb-story-item .fb-story-name {
          position: absolute;
          bottom: 4px;
          left: 4px;
          right: 4px;
          font-size: 0.5rem;
          color: #fff;
          font-weight: 600;
          text-shadow: 0 1px 2px rgba(0,0,0,0.6);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .fb-story-create {
          background: #f0f2f5;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          border: 1px solid #e4e6eb;
        }
        .fb-story-create-icon {
          width: 22px;
          height: 22px;
          background: #1877f2;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 0.8rem;
          font-weight: 700;
        }
        .fb-story-create-text {
          font-size: 0.45rem;
          color: #65676b;
          font-weight: 600;
        }

        /* FB Ad Carousel */
        .fb-ad-carousel {
          flex: 1;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
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
          font-size: 0.82rem;
          color: #050505;
          line-height: 1.35;
        }
        .fb-ad-media {
          position: relative;
          background: #000;
          overflow: hidden;
          aspect-ratio: 4/3;
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
          padding: 4px 12px;
          font-size: 0.72rem;
          color: #65676b;
          background: #fff;
        }
        .fb-action-bar {
          display: flex;
          justify-content: space-around;
          padding: 4px 0;
          border-top: 1px solid #e4e6eb;
          border-bottom: 1px solid #e4e6eb;
          background: #fff;
        }
        .fb-action-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          color: #65676b;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: default;
        }
        .fb-action-btn svg {
          width: 14px;
          height: 14px;
          fill: #65676b;
        }
        .fb-ad-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 4px;
          background: #fff;
        }
        .fb-nav-arrow {
          width: 24px;
          height: 24px;
          border: none;
          background: #e4e6eb;
          border-radius: 50%;
          color: #65676b;
          font-size: 1rem;
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
          gap: 5px;
        }
        .fb-dot {
          width: 7px;
          height: 7px;
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
   Overview → Current → Paid Ads → Paid Ads + Organic (widest)
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
    title: 'Paid Ads',
    subtitle: 'Immediate Lead Flow',
    color: '#6B8EFE',
    topW: 420, botW: 120,
    people: 12,
    peopleLabel: 'Paid ads widen the top of your funnel immediately. Combined with auto booking and appointment reminders, every lead is captured and confirmed automatically.',
    revenue: 'Revenue $$',
    layers: ['Referrals + Paid Ads', 'Auto Booking System', 'Appt Reminders', 'Jobs'],
    descriptions: [
      'Paid ads put you in front of homeowners actively scrolling in your service area. Combined with referrals, you now have a predictable second lead source you control.',
      'Without auto booking, more leads just means more missed calls and lost opportunities. The system catches every lead 24/7 so nothing falls through the cracks.',
      'Automated SMS and email reminders are critical infrastructure. Without them, no shows eat 20-30% of your appointments. This has to be in place before you scale.',
      'Consistent pipeline replaces the feast or famine cycle. You are no longer waiting for the phone to ring.',
    ],
  },
  {
    title: 'Paid Ads + Organic',
    subtitle: 'Full Scale',
    color: '#94D96B',
    topW: 500, botW: 150,
    people: 30,
    peopleLabel: 'Every growth channel is now active and compounding. Paid ads drive immediate traffic, SEO builds long term organic visibility, your website converts visitors 24/7, and referrals keep flowing. Your competitors cannot catch up because you own the digital real estate in your market.',
    revenue: 'Revenue $$$',
    layers: ['Referrals + Paid Ads + Optimized Website + SEO', 'Auto Booking System', 'Appt Reminders', 'Jobs'],
    descriptions: [
      'Every channel compounds. SEO rankings build month over month, paid ads drive immediate traffic, your website converts visitors around the clock, and referrals never stop. This is how you dominate a market.',
      'The full system handles volume effortlessly. Automated follow ups, review requests, and re-engagement campaigns run on autopilot 24/7.',
      'Confirmation rates exceed 90%. The infrastructure pays for itself many times over at this volume.',
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
      <div style={S.lightPattern} />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
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

              {/* Expanding arrows on Paid Ads & Paid Ads + Organic */}
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
          max-width: 1200px;
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
          width: 420px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          padding: 20px 0 20px 40px;
        }
        .fv-right-content {
          animation: fvFadeIn 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .fv-right-label {
          font-size: 1.2rem;
          font-weight: 800;
          margin-bottom: 12px;
        }
        .fv-right-desc {
          font-size: 1.1rem;
          line-height: 1.7;
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
      <SpaceBackground opacity={0.25} />
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
                  {/* Slide 1: FB Ads Feed */}
                  <div className={`phone-slide${step === 0 ? ' active' : step > 0 ? ' prev' : ''}`}>
                    <div className="fb-feed-wrapper">
                      {/* Top bar */}
                      <div className="fb-feed-topbar">
                        <span className="fb-feed-topbar-logo">facebook</span>
                        <div className="fb-feed-topbar-icons">
                          <div className="fb-feed-topbar-icon"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg></div>
                          <div className="fb-feed-topbar-icon"><svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg></div>
                        </div>
                      </div>

                      {/* Create post */}
                      <div className="fb-create-post">
                        <div className="fb-create-avatar" />
                        <div className="fb-create-input">What&apos;s on your mind?</div>
                      </div>

                      {/* Stories */}
                      <div className="fb-stories-bar">
                        <div className="fb-story-item fb-story-create">
                          <div className="fb-story-create-icon">+</div>
                          <span className="fb-story-create-text">Create</span>
                        </div>
                        <div className="fb-story-item" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}><span className="fb-story-name">Mike R.</span></div>
                        <div className="fb-story-item" style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)' }}><span className="fb-story-name">Sarah K.</span></div>
                        <div className="fb-story-item" style={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)' }}><span className="fb-story-name">Tom B.</span></div>
                        <div className="fb-story-item" style={{ background: 'linear-gradient(135deg, #43e97b, #38f9d7)' }}><span className="fb-story-name">Lisa M.</span></div>
                      </div>

                      {/* Ad in feed */}
                      <div className="fb-ad-carousel">
                        {fbAds.map((ad, i) => (
                          <div key={i} className={`fb-ad-slide${adIdx === i ? ' active' : ''}`}>
                            <div className="fb-post-compact">
                              <div className="fb-post-top">
                                <div className="fb-avatar-sm">{ad.initials}</div>
                                <div className="fb-post-meta-sm">
                                  <span className="fb-page-name">{ad.page}</span>
                                  <span className="fb-sponsored-tag">Sponsored · <svg viewBox="0 0 16 16" style={{ width: 10, height: 10, fill: '#65676b', verticalAlign: 'middle' }}><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm0 14.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"/></svg></span>
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
                              <div className="fb-action-bar">
                                <span className="fb-action-btn"><svg viewBox="0 0 24 24"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>Like</span>
                                <span className="fb-action-btn"><svg viewBox="0 0 24 24"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/></svg>Comment</span>
                                <span className="fb-action-btn"><svg viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>Share</span>
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
                    <div className="phone-slide-body">
                      <div className="reminders-preview">
                        <div className="ios-messages-header">
                          <div className="ios-contact-avatar">PR</div>
                          <div className="ios-contact-info">
                            <div className="ios-contact-name">Premier Remodeling</div>
                            <div className="ios-contact-label">Automated Message</div>
                          </div>
                        </div>
                        <div className="ios-messages-body">
                          <div className="ios-message-time">Yesterday 10:00 AM</div>
                          <div className="ios-message incoming">
                            Hi John! Just a friendly reminder about your kitchen consultation appointment tomorrow at 10:00 AM. Our estimator Mike will be arriving at your home.
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
            <div className="phone-home-indicator" />
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
      <div style={S.lightPattern} />
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
      <SpaceBackground opacity={0.25} />
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
      3:  [{ time: '9:00 AM',  name: 'Mike Johnson',   phone: '(602) 555-0147', email: 'mjohnson84@gmail.com',    address: '4521 W Olive Ave, Glendale AZ 85302',    service: 'Kitchen Consultation' }],
      13: [{ time: '10:30 AM', name: 'Sarah Williams', phone: '(480) 555-0293', email: 'swilliams@yahoo.com',     address: '1832 E Camelback Rd, Phoenix AZ 85016',   service: 'Bathroom Estimate' }],
      18: [{ time: '2:00 PM',  name: 'Tom Anderson',   phone: '(623) 555-0185', email: 'tanderson@hotmail.com',    address: '7744 N 12th St, Phoenix AZ 85020',        service: 'Full Remodel Estimate' }],
      27: [{ time: '11:00 AM', name: 'Lisa Chen',      phone: '(602) 555-0321', email: 'lisachen99@gmail.com',     address: '2910 S Mill Ave, Tempe AZ 85282',         service: 'Design Consultation' }],
    },
  },
  {
    name: 'Paid Ads', color: '#6B8EFE', subtitle: 'Ads + Auto Booking',
    description: 'Paid ads and auto booking fill your weeks consistently. No more feast or famine.',
    appts: {
      1:  [{ time: '11:00 AM', name: 'David Martinez',   phone: '(602) 555-0412', email: 'dmartinez@gmail.com',      address: '3847 W Thunderbird Rd, Phoenix AZ 85053', service: 'Kitchen Remodel' }],
      3:  [{ time: '10:00 AM', name: 'Jennifer Thompson', phone: '(480) 555-0538', email: 'jthompson22@outlook.com', address: '9201 E Indian Bend Rd, Scottsdale AZ 85250', service: 'Full Home Renovation' }],
      5:  [{ time: '1:00 PM',  name: 'Marcus Garcia',    phone: '(623) 555-0619', email: 'mgarcia@yahoo.com',        address: '5520 W Peoria Ave, Glendale AZ 85302',   service: 'Flooring Installation' }],
      8:  [{ time: '9:00 AM',  name: 'Rachel Robinson',  phone: '(602) 555-0724', email: 'rrobinson@gmail.com',      address: '2215 N 44th St, Phoenix AZ 85008',        service: 'Bathroom Renovation' }],
      11: [{ time: '3:30 PM',  name: 'Chris Mitchell',   phone: '(480) 555-0837', email: 'cmitchell@hotmail.com',    address: '6630 E Baseline Rd, Mesa AZ 85206',       service: 'Design Consultation' }],
      14: [{ time: '9:30 AM',  name: 'Amanda Davis',     phone: '(623) 555-0941', email: 'adavis17@gmail.com',       address: '14220 N 59th Ave, Glendale AZ 85306',     service: 'Countertop Replacement' }],
      17: [{ time: '8:00 AM',  name: 'Nicole Moore',     phone: '(480) 555-1168', email: 'nmoore@yahoo.com',         address: '1450 S Dobson Rd, Mesa AZ 85202',         service: 'Full Home Renovation' }],
      19: [{ time: '3:00 PM',  name: 'Kevin Taylor',     phone: '(623) 555-1274', email: 'ktaylor55@gmail.com',      address: '8821 W Maryland Ave, Glendale AZ 85305',  service: 'Cabinet Refacing' }],
      22: [{ time: '10:00 AM', name: 'Ashley Jackson',   phone: '(602) 555-1389', email: 'ajackson@gmail.com',       address: '4102 N 24th St, Phoenix AZ 85016',        service: 'Kitchen Consultation' }],
      24: [{ time: '1:30 PM',  name: 'Megan Harris',     phone: '(623) 555-1507', email: 'mharris@outlook.com',      address: '10432 W Camelback Rd, Phoenix AZ 85037',  service: 'Tile Installation' }],
      27: [{ time: '11:00 AM', name: 'Ryan Martin',      phone: '(602) 555-1618', email: 'rmartin@gmail.com',        address: '2750 W Guadalupe Rd, Chandler AZ 85224',  service: 'Bathroom Estimate' }],
      29: [{ time: '2:00 PM',  name: 'Stephanie Lee',    phone: '(480) 555-1723', email: 'slee@yahoo.com',           address: '5580 E Broadway Rd, Mesa AZ 85206',       service: 'Full Home Renovation' }],
      31: [{ time: '10:30 AM', name: 'Jake Walker',      phone: '(623) 555-1834', email: 'jwalker@gmail.com',        address: '6890 W Bethany Home Rd, Glendale AZ 85303', service: 'Interior Painting' }],
    },
  },
  {
    name: 'Paid Ads + Organic', color: '#94D96B', subtitle: 'Full Scale',
    description: 'Every growth channel compounding. Your month is booked out weeks in advance.',
    appts: {
      1:  [
        { time: '10:00 AM', name: 'Maria Young',       phone: '(602) 555-2001', email: 'myoung@gmail.com',        address: '3920 W Indian School Rd, Phoenix AZ 85019', service: 'Full Home Renovation' },
        { time: '2:30 PM',  name: 'Carlos King',        phone: '(480) 555-2002', email: 'cking@outlook.com',       address: '8450 E McDowell Rd, Scottsdale AZ 85257',   service: 'Kitchen Consultation' },
      ],
      2:  [{ time: '9:00 AM',  name: 'Derek Wright',       phone: '(623) 555-2003', email: 'dwright@yahoo.com',       address: '11240 N 43rd Ave, Glendale AZ 85304',       service: 'Design Consultation' }],
      3:  [
        { time: '8:30 AM',  name: 'Tyler Lopez',        phone: '(602) 555-2004', email: 'tlopez@gmail.com',        address: '2515 E Thomas Rd, Phoenix AZ 85016',        service: 'Flooring Installation' },
        { time: '3:00 PM',  name: 'Emily Hill',         phone: '(480) 555-2005', email: 'ehill@gmail.com',         address: '4710 S Rural Rd, Tempe AZ 85282',           service: 'Bathroom Renovation' },
      ],
      5:  [
        { time: '8:00 AM',  name: 'Nathan Scott',       phone: '(623) 555-2006', email: 'nscott@hotmail.com',      address: '7330 W Glendale Ave, Glendale AZ 85303',    service: 'Cabinet Refacing' },
        { time: '1:00 PM',  name: 'Angela Green',       phone: '(602) 555-2007', email: 'agreen@gmail.com',        address: '5060 N 19th Ave, Phoenix AZ 85015',         service: 'Countertop Replacement' },
      ],
      7:  [
        { time: '9:30 AM',  name: 'Roberto Adams',      phone: '(480) 555-2008', email: 'radams@outlook.com',      address: '1825 E Guadalupe Rd, Gilbert AZ 85234',     service: 'Tile Installation' },
        { time: '2:00 PM',  name: 'Jessica Baker',      phone: '(623) 555-2009', email: 'jbaker@gmail.com',        address: '9540 W Northern Ave, Glendale AZ 85305',    service: 'Full Home Renovation' },
      ],
      8:  [{ time: '11:00 AM', name: 'Samantha Carter',    phone: '(480) 555-2011', email: 'scarter@gmail.com',       address: '6215 E Southern Ave, Mesa AZ 85206',        service: 'Design Consultation' }],
      9:  [
        { time: '8:00 AM',  name: 'Daniel Perez',       phone: '(623) 555-2012', email: 'dperez@hotmail.com',      address: '13450 W Camelback Rd, Litchfield Park AZ 85340', service: 'Kitchen Remodel' },
        { time: '3:30 PM',  name: 'Heather Campbell',   phone: '(602) 555-2013', email: 'hcampbell@gmail.com',     address: '4890 E McDowell Rd, Phoenix AZ 85008',      service: 'Outdoor Living Space' },
      ],
      11: [{ time: '10:00 AM', name: 'Justin Rivera',      phone: '(480) 555-2014', email: 'jrivera@outlook.com',     address: '2340 S Alma School Rd, Mesa AZ 85210',      service: 'Interior Painting' }],
      12: [
        { time: '9:00 AM',  name: 'Laura Ramirez',      phone: '(623) 555-2015', email: 'lramirez@yahoo.com',     address: '8760 W Olive Ave, Peoria AZ 85345',         service: 'Bathroom Renovation' },
        { time: '1:00 PM',  name: 'Anthony Torres',     phone: '(602) 555-2016', email: 'atorres@gmail.com',       address: '1590 N Central Ave, Phoenix AZ 85004',      service: 'Full Home Renovation' },
      ],
      14: [{ time: '10:30 AM', name: 'Crystal Brooks',     phone: '(480) 555-2017', email: 'cbrooks@hotmail.com',     address: '7720 E Baseline Rd, Mesa AZ 85209',         service: 'Countertop Replacement' }],
      15: [
        { time: '8:30 AM',  name: 'Brandon Cox',        phone: '(623) 555-2018', email: 'bcox@gmail.com',         address: '5230 W Thunderbird Rd, Glendale AZ 85306',  service: 'Cabinet Refacing' },
        { time: '2:00 PM',  name: 'Tiffany Ward',       phone: '(602) 555-2019', email: 'tward@outlook.com',      address: '3670 E Camelback Rd, Phoenix AZ 85018',     service: 'Kitchen Consultation' },
      ],
      17: [
        { time: '8:00 AM',  name: 'Eric Sanders',       phone: '(480) 555-2020', email: 'esanders@gmail.com',      address: '9120 E Indian Bend Rd, Scottsdale AZ 85250', service: 'Flooring Installation' },
        { time: '2:00 PM',  name: 'Michelle Peterson',  phone: '(623) 555-2021', email: 'mpeterson@yahoo.com',     address: '10820 N 43rd Ave, Glendale AZ 85304',       service: 'Design Consultation' },
      ],
      19: [
        { time: '10:00 AM', name: 'Vanessa Collins',    phone: '(480) 555-2023', email: 'vcollins@hotmail.com',    address: '5840 S Kyrene Rd, Tempe AZ 85283',          service: 'Full Home Renovation' },
        { time: '3:00 PM',  name: 'Randy Stewart',      phone: '(623) 555-2024', email: 'rstewart@gmail.com',      address: '7190 W Peoria Ave, Peoria AZ 85345',        service: 'Tile Installation' },
      ],
      20: [{ time: '11:30 AM', name: 'Kimberly Reed',    phone: '(602) 555-2025', email: 'kreed@outlook.com',      address: '4330 N 7th Ave, Phoenix AZ 85013',          service: 'Countertop Replacement' }],
      22: [
        { time: '9:00 AM',  name: 'Sean Murphy',        phone: '(480) 555-2026', email: 'smurphy@gmail.com',       address: '1870 E University Dr, Mesa AZ 85203',       service: 'Kitchen Remodel' },
        { time: '1:30 PM',  name: 'Diana Foster',       phone: '(623) 555-2027', email: 'dfoster@yahoo.com',       address: '12340 W Indian School Rd, Avondale AZ 85392', service: 'Bathroom Estimate' },
      ],
      23: [{ time: '8:00 AM',  name: 'Phillip Gonzalez', phone: '(602) 555-2028', email: 'pgonzalez@gmail.com',    address: '6050 S 48th St, Phoenix AZ 85042',          service: 'Interior Painting' }],
      25: [
        { time: '8:30 AM',  name: 'Victor Morales',     phone: '(623) 555-2030', email: 'vmorales@gmail.com',      address: '4210 W Greenway Rd, Glendale AZ 85306',     service: 'Full Home Renovation' },
        { time: '2:30 PM',  name: 'Amy Richardson',     phone: '(602) 555-2031', email: 'arichardson@outlook.com', address: '1720 N 32nd St, Phoenix AZ 85008',          service: 'Outdoor Living Space' },
      ],
      26: [
        { time: '9:00 AM',  name: 'Greg Howard',        phone: '(480) 555-2032', email: 'ghoward@yahoo.com',       address: '5560 E Broadway Rd, Mesa AZ 85206',         service: 'Bathroom Renovation' },
        { time: '1:00 PM',  name: 'Monica Simmons',     phone: '(623) 555-2033', email: 'msimmons@gmail.com',      address: '9870 W Northern Ave, Peoria AZ 85345',      service: 'Design Consultation' },
      ],
      28: [
        { time: '10:00 AM', name: 'Keith Patterson',    phone: '(602) 555-2034', email: 'kpatterson@gmail.com',   address: '3140 E Thomas Rd, Phoenix AZ 85016',        service: 'Kitchen Consultation' },
        { time: '3:00 PM',  name: 'Shannon Price',      phone: '(480) 555-2035', email: 'sprice@hotmail.com',      address: '6440 S Rural Rd, Tempe AZ 85283',           service: 'Full Home Renovation' },
      ],
      29: [{ time: '11:00 AM', name: 'Derrick Russell',    phone: '(623) 555-2036', email: 'drussell@gmail.com',      address: '11550 W Glendale Ave, Glendale AZ 85307',   service: 'Flooring Installation' }],
      30: [
        { time: '9:00 AM',  name: 'Marcus Griffin',     phone: '(480) 555-2038', email: 'mgriffin@gmail.com',      address: '7610 E Baseline Rd, Mesa AZ 85209',         service: 'Countertop Replacement' },
        { time: '2:00 PM',  name: 'Alicia Diaz',        phone: '(623) 555-2039', email: 'adiaz@yahoo.com',         address: '4520 W Camelback Rd, Phoenix AZ 85031',     service: 'Tile Installation' },
      ],
      31: [{ time: '8:30 AM',  name: 'Wayne Henderson',  phone: '(602) 555-2040', email: 'whenderson@gmail.com',   address: '1350 N Central Ave, Phoenix AZ 85004',      service: 'Interior Painting' }],
    },
  },
];

function CalendarMockup() {
  const [phase, setPhase] = useState(0);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const { ref, inView } = useScrollReveal({ threshold: 0.08 });
  const p = calendarPhases[phase];

  const daysInMonth = 31;
  const startDay = 0; // March 2026 starts on Sunday
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) calendarDays.push(null);
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
  const selectedDayOfWeek = selectedDay !== null ? DAY_LABELS[(selectedDay - 1 + startDay) % 7] : '';

  // All appointments show as red
  const eventColor = '#e67c73';

  return (
    <section ref={ref as React.Ref<HTMLElement>} style={S.sectionDark}>
      <SpaceBackground opacity={0.25} />
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

        <div style={{ maxWidth: '960px', margin: '0 auto', ...fadeUp(inView, 300) }}>
          {/* Google Calendar Card */}
          <div style={{
            background: '#ffffff', borderRadius: '12px', overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
            border: '1px solid #dadce0',
          }}>
            {/* Google Calendar Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', borderBottom: '1px solid #dadce0',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Hamburger menu */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#5f6368"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
                {/* Google Calendar logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" fill="#fff" stroke="#4285f4" strokeWidth="1.5"/>
                    <rect x="3" y="3" width="18" height="6" rx="2" fill="#4285f4"/>
                    <text x="12" y="18" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#4285f4">31</text>
                  </svg>
                  <span style={{ fontSize: '1.1rem', fontWeight: 400, color: '#3c4043' }}>Calendar</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Nav arrows */}
                <div style={{ display: 'flex', gap: '2px' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#5f6368"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
                  </div>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#5f6368"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                  </div>
                </div>
                <span style={{ fontSize: '1.15rem', fontWeight: 400, color: '#3c4043' }}>March 2026</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  padding: '6px 14px', borderRadius: '4px', border: '1px solid #dadce0',
                  fontSize: '0.8rem', fontWeight: 500, color: '#3c4043', cursor: 'pointer',
                }}>Month</div>
                {/* Settings gear */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#5f6368"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
              </div>
            </div>

            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid #dadce0' }}>
              {dayNames.map(d => (
                <div key={d} style={{
                  textAlign: 'center', padding: '8px 0',
                  fontSize: '0.68rem', fontWeight: 500, color: '#70757a',
                  letterSpacing: '0.02em',
                }}>{d}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {calendarDays.map((day, i) => {
                const dayAppts = day !== null ? (p.appts[day] || []) : [];
                const hasAppt = dayAppts.length > 0;
                const isSelected = day !== null && selectedDay === day;
                const isToday = day === 15;
                const row = Math.floor(i / 7);
                const isLastRow = row === Math.floor((calendarDays.length - 1) / 7);
                return (
                  <div
                    key={i}
                    onClick={() => handleDayClick(day)}
                    style={{
                      minHeight: '96px', padding: '2px 4px',
                      borderRight: (i + 1) % 7 !== 0 ? '1px solid #dadce0' : 'none',
                      borderBottom: !isLastRow ? '1px solid #dadce0' : 'none',
                      background: isSelected ? '#e8f0fe' : '#fff',
                      cursor: hasAppt ? 'pointer' : 'default',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    {day !== null && (
                      <>
                        <div style={{
                          width: 24, height: 24, borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          margin: '2px auto 2px',
                          background: isToday ? '#1a73e8' : 'transparent',
                          color: isToday ? '#fff' : '#3c4043',
                          fontSize: '0.75rem', fontWeight: isToday ? 600 : 400,
                        }}>{day}</div>
                        {dayAppts.map((appt, ai) => (
                          <div key={ai} style={{
                            background: eventColor,
                            color: '#fff', fontSize: '0.6rem', fontWeight: 500,
                            padding: '2px 4px', borderRadius: '3px', marginBottom: '1px',
                            overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                            lineHeight: 1.4,
                          }}>
                            {appt.time.replace(':00', '').replace(' AM', 'a').replace(' PM', 'p')} {appt.name.split(' ')[0]}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Appointment detail panel */}
          {selectedDay !== null && selectedAppts.length > 0 && (
            <div style={{
              marginTop: '16px', background: '#ffffff', borderRadius: '12px',
              border: '1px solid #dadce0', overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
              animation: 'calDetailIn 0.3s ease-out',
            }}>
              <div style={{
                padding: '16px 20px', borderBottom: '1px solid #dadce0',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div style={{ fontSize: '1rem', fontWeight: 500, color: '#3c4043' }}>
                  {selectedDayOfWeek}, March {selectedDay}, 2026
                </div>
                <div style={{
                  fontSize: '0.75rem', fontWeight: 500, color: '#1a73e8',
                  padding: '4px 12px', borderRadius: '4px', background: '#e8f0fe',
                }}>
                  {selectedAppts.length} event{selectedAppts.length > 1 ? 's' : ''}
                </div>
              </div>

              <div style={{ padding: '12px 20px' }}>
                {selectedAppts.map((appt, ai) => (
                    <div key={ai} style={{
                      display: 'flex', gap: '14px', padding: '14px 0',
                      borderBottom: ai < selectedAppts.length - 1 ? '1px solid #e8eaed' : 'none',
                    }}>
                      {/* Color bar */}
                      <div style={{ width: 4, borderRadius: 2, background: eventColor, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                          <div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 500, color: '#3c4043' }}>{appt.service}</div>
                            <div style={{ fontSize: '0.8rem', color: '#70757a', marginTop: 2 }}>{appt.time}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 6 }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: '50%', background: eventColor,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.6rem', fontWeight: 600, color: '#fff', flexShrink: 0,
                          }}>
                            {appt.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span style={{ fontSize: '0.85rem', color: '#3c4043' }}>{appt.name}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#5f6368"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                            <span style={{ fontSize: '0.78rem', color: '#5f6368' }}>{appt.phone}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#5f6368"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                            <span style={{ fontSize: '0.78rem', color: '#5f6368' }}>{appt.email}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#5f6368" style={{ flexShrink: 0, marginTop: 1 }}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>
                            <span style={{ fontSize: '0.78rem', color: '#5f6368' }}>{appt.address}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          )}

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
      <span style={{ flex: 1, fontSize: '0.9rem', color: '#202124' }}>remodeling contractor near me</span>
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

/* ── SEO Phase Data ── */
const seoPhases = [
  { month: 0, label: 'Before RevCore', tagline: 'Buried on page 3', color: '#d93025', page: 3, yourPos: -1, reviews: 0, stars: 0, showMaps: false, mapsPos: -1, gmbOpacity: 0 },
  { month: 1, label: 'Month 1', tagline: 'Google Business optimized', color: '#ea4335', page: 1, yourPos: 5, reviews: 3, stars: 4.0, showMaps: false, mapsPos: -1, gmbOpacity: 1 },
  { month: 2, label: 'Month 2', tagline: 'Climbing the ranks', color: '#e8710a', page: 1, yourPos: 4, reviews: 8, stars: 4.2, showMaps: false, mapsPos: -1, gmbOpacity: 1 },
  { month: 3, label: 'Month 3', tagline: 'Getting traction', color: '#f9ab00', page: 1, yourPos: 3, reviews: 14, stars: 4.4, showMaps: true, mapsPos: 3, gmbOpacity: 1 },
  { month: 4, label: 'Month 4', tagline: 'Building authority', color: '#1e8e3e', page: 1, yourPos: 3, reviews: 21, stars: 4.5, showMaps: true, mapsPos: 3, gmbOpacity: 1 },
  { month: 5, label: 'Month 5', tagline: 'Dominating search', color: '#1a73e8', page: 1, yourPos: 2, reviews: 30, stars: 4.7, showMaps: true, mapsPos: 2, gmbOpacity: 1 },
  { month: 6, label: 'Month 6', tagline: 'Top 3 in your market', color: '#16a34a', page: 1, yourPos: 1, reviews: 38, stars: 4.8, showMaps: true, mapsPos: 1, gmbOpacity: 1 },
];

const seoCompetitors = [
  { id: 'competitor', favicon: 'CR', name: 'Competitor Remodeling Co', url: 'www.competitor-remodeling.com › services', title: 'Competitor Remodeling Co - Professional Kitchen & Bath Renovation', desc: 'Trusted remodeling contractor with 15+ years of experience. We offer free consultations, custom designs, and full home renovations.', stars: 4.2, reviews: 43 },
  { id: 'another', favicon: 'AR', name: 'Another Remodeling LLC', url: 'www.another-remodeler.com › about', title: 'Another Remodeling LLC - Licensed & Insured Contractors', desc: 'Family-owned remodeling company serving residential clients. BBB accredited. Financing available on all projects.', stars: 3.8, reviews: 19 },
  { id: 'bigbox', favicon: 'BB', name: 'BigBox Remodeling Solutions', url: 'www.bigbox-remodeling.com › local', title: 'BigBox Remodeling Solutions - Affordable Home Renovation', desc: 'Affordable home renovation and remodeling services. Free estimates within 24 hours. Satisfaction guaranteed.', stars: 3.5, reviews: 8 },
  { id: 'homeadvisor', favicon: 'HA', name: 'HomeAdvisor Remodeling', url: 'www.homeadvisor.com › remodeling › phoenix', title: 'Top 10 Remodeling Contractors in Phoenix - HomeAdvisor', desc: 'Find the best remodeling contractors in Phoenix. Read reviews, compare quotes, and hire the right pro for your project.', stars: 0, reviews: 0 },
];

function SEODemo() {
  const { ref, inView } = useScrollReveal({ threshold: 0.08 });
  const [month, setMonth] = useState(0);
  const [displayReviews, setDisplayReviews] = useState(0);
  const [displayStars, setDisplayStars] = useState(0);

  const phase = seoPhases[month];

  // Smooth review/star counter interpolation
  useEffect(() => {
    const target = seoPhases[month];
    const startReviews = displayReviews;
    const startStars = displayStars;
    const duration = 800;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setDisplayReviews(Math.round(startReviews + (target.reviews - startReviews) * ease));
      setDisplayStars(parseFloat((startStars + (target.stars - startStars) * ease).toFixed(1)));
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  // Build organic results order based on current month
  const getOrganicResults = () => {
    const premier = {
      id: 'premier', favicon: 'PR', name: 'Premier Remodeling Co',
      url: 'www.premier-remodeling.com › services › phoenix',
      title: 'Premier Remodeling Co - #1 Rated Remodeling Contractor in Phoenix',
      desc: '5-star rated remodeling contractor serving Phoenix, Scottsdale, and the East Valley. Free consultations, detailed estimates, and financing available.',
      stars: displayStars, reviews: displayReviews, isPremier: true,
    };
    if (phase.page === 3) {
      return seoCompetitors.map(c => ({ ...c, isPremier: false }));
    }
    const pos = phase.yourPos;
    const others = seoCompetitors.slice(0, 4);
    const result: any[] = [];
    let ci = 0;
    for (let i = 1; i <= 5; i++) {
      if (i === pos) result.push(premier);
      else if (ci < others.length) { result.push({ ...others[ci], isPremier: false }); ci++; }
    }
    return result;
  };

  // Maps pack entries
  const getMapsEntries = () => {
    const premier = { favicon: 'PR', name: 'Premier Remodeling Co', stars: displayStars, reviews: displayReviews, location: 'Phoenix, AZ', isPremier: true };
    const comps = [
      { favicon: 'CR', name: 'Competitor Remodeling Co', stars: 4.2, reviews: 43, location: 'Phoenix, AZ', isPremier: false },
      { favicon: 'AR', name: 'Another Remodeling LLC', stars: 3.8, reviews: 19, location: 'Glendale, AZ', isPremier: false },
    ];
    if (phase.mapsPos === 1) return [premier, comps[0], comps[1]];
    if (phase.mapsPos === 2) return [comps[0], premier, comps[1]];
    return [comps[0], comps[1], premier];
  };

  const cardBorderColor = month >= 5 ? 'rgba(148,217,107,0.35)' : '#E5E5E5';
  const cardShadow = month >= 5 ? '0 8px 40px rgba(148,217,107,0.1)' : '0 2px 12px rgba(0,0,0,0.06)';

  return (
    <section ref={ref as React.Ref<HTMLElement>} style={S.section}>
      <div style={S.lightPattern} />
      <div style={S.container}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem', ...fadeUp(inView) }}>
          <div style={S.eyebrow}>Search Visibility</div>
          <h2 style={S.h2}>From Invisible to <HL>Unavoidable</HL></h2>
          <p style={S.sub}>Watch your business climb from page 3 to the top 3 in 6 months.</p>
        </div>

        {/* ─── Timeline Steps ─── */}
        <div style={{
          display: 'flex', alignItems: 'center',
          maxWidth: '700px', margin: '0 auto 1.5rem',
          ...fadeUp(inView, 200),
        }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative' }}>
            <div style={{
              position: 'absolute', top: '50%', left: '6px', right: '6px', height: '2px',
              background: '#e0e0e0', transform: 'translateY(-50%)',
            }} />
            <div style={{
              position: 'absolute', top: '50%', left: '6px', height: '2px',
              width: `${(month / 6) * 100}%`,
              background: 'linear-gradient(90deg, #FE6462, #6B8EFE, #16a34a)',
              transform: 'translateY(-50%)',
              transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', position: 'relative' }}>
              {seoPhases.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setMonth(i)}
                  style={{
                    width: i === month ? 28 : 12,
                    height: 12,
                    borderRadius: i === month ? 6 : '50%',
                    border: 'none',
                    background: i <= month ? p.color : '#d0d0d0',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    padding: 0,
                  }}
                  title={`${p.label}: ${p.tagline}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Month label */}
        <div style={{ textAlign: 'center', marginBottom: '1.2rem', ...fadeUp(inView, 300) }}>
          <span style={{
            fontSize: '0.9rem', fontWeight: 700,
            color: phase.color,
            transition: 'color 0.6s ease',
          }}>{phase.label}</span>
          <span style={{ fontSize: '0.82rem', color: '#70757a', marginLeft: 8 }}>{phase.tagline}</span>
          {displayReviews > 0 && (
            <span style={{ fontSize: '0.78rem', color: '#5f6368', marginLeft: 12 }}>
              {displayStars} ★ · {displayReviews} reviews
            </span>
          )}
        </div>

        {/* ─── Google Search Card with arrows ─── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          maxWidth: '1160px', margin: '0 auto',
          ...fadeUp(inView, 400),
        }}>
          {/* Left arrow */}
          <button
            onClick={() => setMonth(m => Math.max(0, m - 1))}
            style={{
              width: 36, height: 36, borderRadius: '50%', border: '1px solid #e0e0e0',
              background: '#fff', cursor: month > 0 ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, opacity: month > 0 ? 0.7 : 0.25,
              transition: 'opacity 0.3s ease',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>

        <div style={{
          ...S.card, overflow: 'hidden',
          flex: 1,
          border: `1px solid ${cardBorderColor}`,
          boxShadow: cardShadow,
          transition: 'border-color 0.8s ease, box-shadow 0.8s ease',
        }}>
          <div style={{ background: '#fff' }}>
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

            <div style={{ display: 'flex', gap: '0', height: '520px', overflow: 'hidden' }}>
              {/* Left — search results */}
              <div style={{ flex: 1, padding: '4px 20px 16px', overflow: 'hidden' }}>
                <div style={{ fontSize: '0.72rem', color: '#70757a', padding: '8px 0' }}>About 2,340,000 results (0.42 seconds)</div>

                {/* Sponsored ad — fades out after month 1 */}
                <div style={{
                  maxHeight: month <= 1 ? '120px' : '0',
                  opacity: month <= 1 ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 0.6s ease, opacity 0.4s ease',
                }}>
                  <div style={{ padding: '10px 0', borderBottom: '1px solid #ebebeb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#202124', background: '#f1f3f4', padding: '2px 6px', borderRadius: '3px', border: '1px solid #dadce0' }}>Sponsored</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', fontWeight: 700, color: '#1a73e8' }}>AR</div>
                      <div style={{ fontSize: '0.72rem', color: '#202124' }}>www.acme-remodeling-ads.com</div>
                    </div>
                    <div style={{ fontSize: '1rem', color: '#1a0dab', marginBottom: '3px', cursor: 'pointer' }}>Acme Remodeling - Get A Free Quote Today</div>
                    <div style={{ fontSize: '0.8rem', color: '#4d5156', lineHeight: 1.45 }}>Top rated remodeling company. Call now for a free estimate.</div>
                  </div>
                </div>

                {/* Google Maps 3-Pack — slides in at month 3 */}
                <div style={{
                  maxHeight: phase.showMaps ? '400px' : '0',
                  opacity: phase.showMaps ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease',
                }}>
                  <div style={{
                    padding: '14px', borderRadius: '12px', marginBottom: '6px',
                    background: '#fff', border: '1px solid #dadce0',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #ebebeb' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#34a853"/><circle cx="12" cy="9" r="2.5" fill="#fff"/></svg>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#202124' }}>Places</span>
                    </div>
                    {getMapsEntries().map((entry, i) => (
                      <div key={entry.name} style={{
                        display: 'flex', alignItems: 'flex-start', gap: '10px',
                        padding: entry.isPremier ? '10px' : '8px 10px',
                        borderRadius: entry.isPremier ? '8px' : '0',
                        marginBottom: i < 2 ? '6px' : '0',
                        background: entry.isPremier ? 'rgba(148,217,107,0.06)' : 'transparent',
                        border: entry.isPremier ? '1px solid rgba(148,217,107,0.2)' : '1px solid transparent',
                        opacity: entry.isPremier ? 1 : 0.6,
                        transition: 'all 0.6s ease',
                      }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          background: entry.isPremier ? 'linear-gradient(135deg, #ff7a1a, #e85d04)' : '#e8eaed',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.55rem', fontWeight: 700,
                          color: entry.isPremier ? '#fff' : '#5f6368', flexShrink: 0,
                        }}>{entry.favicon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: entry.isPremier ? '0.88rem' : '0.85rem', fontWeight: 600, color: '#1a0dab' }}>{entry.name}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '2px 0' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#202124' }}>{entry.isPremier ? displayStars : entry.stars}</span>
                            <div style={{ display: 'flex', gap: '0px' }}>
                              {[1,2,3,4,5].map(s => (
                                <svg key={s} width="11" height="11" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={s <= Math.round(entry.isPremier ? displayStars : entry.stars) ? '#fbbc04' : '#dadce0'}/></svg>
                              ))}
                            </div>
                            <span style={{ fontSize: '0.68rem', color: '#70757a' }}>({entry.isPremier ? displayReviews : entry.reviews})</span>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#70757a' }}>Remodeling contractor · {entry.location}</div>
                          {entry.isPremier && <div style={{ fontSize: '0.72rem', color: '#70757a' }}>Open · Closes 6 PM</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Organic results */}
                {getOrganicResults().map((r: any, i: number) => (
                  <div key={r.id}>
                    <div style={{
                      padding: '14px 0',
                      opacity: r.isPremier ? 1 : (phase.page === 3 ? 1 : 0.7),
                      borderLeft: r.isPremier ? '3px solid #94D96B' : '3px solid transparent',
                      paddingLeft: r.isPremier ? '12px' : '0',
                      transition: 'all 0.6s ease',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <div style={{
                          width: '26px', height: '26px', borderRadius: '50%',
                          background: r.isPremier ? 'linear-gradient(135deg, #ff7a1a, #e85d04)' : '#f1f3f4',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.6rem', fontWeight: 700,
                          color: r.isPremier ? '#fff' : '#5f6368', flexShrink: 0,
                        }}>{r.favicon}</div>
                        <div>
                          <div style={{ fontSize: '0.72rem', color: '#202124', lineHeight: 1.2 }}>{r.url}</div>
                          <div style={{ fontSize: '0.65rem', color: '#4d5156' }}>{r.url.split(' › ')[0]}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: '1.05rem', color: '#1a0dab', marginBottom: '4px', lineHeight: 1.3, cursor: 'pointer' }}>{r.title}</div>
                      <div style={{ fontSize: '0.82rem', color: '#4d5156', lineHeight: 1.5 }}>{r.desc}</div>
                      {r.isPremier && displayReviews > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                          <div style={{ display: 'flex', gap: '0px' }}>
                            {[1,2,3,4,5].map(s => (
                              <svg key={s} width="12" height="12" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={s <= Math.round(displayStars) ? '#fbbc04' : '#dadce0'}/></svg>
                            ))}
                          </div>
                          <span style={{ fontSize: '0.75rem', color: '#70757a' }}>{displayStars} ({displayReviews} reviews)</span>
                        </div>
                      )}
                    </div>
                    {i < getOrganicResults().length - 1 && <div style={{ borderBottom: '1px solid #ebebeb' }} />}
                  </div>
                ))}

                {/* Pagination — visible only at month 0-1 */}
                <div style={{
                  maxHeight: month <= 1 ? '60px' : '0',
                  opacity: month <= 1 ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 0.6s ease, opacity 0.4s ease',
                }}>
                  <div style={{ padding: '14px 0 8px', textAlign: 'center' }}>
                    {phase.page === 3 && (
                      <span style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic', display: 'block', marginBottom: '8px' }}>
                        Your business... somewhere on page 3
                      </span>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <span key={n} style={{
                          width: '28px', height: '28px', borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.75rem', fontWeight: 500,
                          background: (phase.page === 3 && n === 3) ? '#FE646215' : (phase.page === 1 && n === 1) ? '#e8f0fe' : 'transparent',
                          color: (phase.page === 3 && n === 3) ? '#FE6462' : (n === 1) ? '#1a73e8' : '#70757a',
                          border: (phase.page === 3 && n === 3) ? '1px solid #FE646230' : 'none',
                          cursor: 'pointer',
                        }}>{n}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — GMB Knowledge Panel (slides in) */}
              <div style={{
                width: phase.gmbOpacity > 0 ? '260px' : '0',
                opacity: phase.gmbOpacity,
                overflow: 'hidden',
                flexShrink: 0,
                borderLeft: phase.gmbOpacity > 0 ? '1px solid #ebebeb' : 'none',
                transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease, border-left 0.4s ease',
              }}>
                <div style={{ width: '260px', padding: '12px' }}>
                  <div style={{
                    border: '1px solid #dadce0', borderRadius: '12px', overflow: 'hidden',
                    background: '#fff',
                  }}>
                    <div style={{
                      height: 80, overflow: 'hidden', position: 'relative',
                    }}>
                      <img src="https://assets.cdn.filesafe.space/NYlSya2nYSkSnnXEbY2l/media/69b640f15b89c73d7c929733.png" alt="Premier Remodeling" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      <img src="https://assets.cdn.filesafe.space/NYlSya2nYSkSnnXEbY2l/media/69b641aaeaf081306e71256e.png" alt="Premier Remodeling Logo" style={{ position: 'absolute', bottom: 8, left: 12, height: 28, width: 'auto' }} />
                    </div>

                    <div style={{ padding: '16px' }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#202124', marginBottom: 4 }}>Premier Remodeling Co</div>
                      <div style={{ fontSize: '0.78rem', color: '#70757a', marginBottom: 8 }}>Remodeling contractor</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: 12 }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#202124' }}>{displayStars}</span>
                        <div style={{ display: 'flex' }}>
                          {[1,2,3,4,5].map(s => (
                            <svg key={s} width="14" height="14" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={s <= Math.round(displayStars) ? '#fbbc04' : '#dadce0'}/></svg>
                          ))}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#1a73e8' }}>{displayReviews} reviews</span>
                      </div>

                      <div style={{ borderTop: '1px solid #ebebeb', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#70757a"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>
                          <span style={{ fontSize: '0.78rem', color: '#202124' }}>Phoenix, AZ</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#70757a"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>
                          <span style={{ fontSize: '0.78rem', color: '#188038', fontWeight: 500 }}>Open · Closes 6 PM</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#70757a"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                          <span style={{ fontSize: '0.78rem', color: '#1a73e8' }}>(602) 555-0100</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#70757a"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96z"/></svg>
                          <span style={{ fontSize: '0.78rem', color: '#1a73e8' }}>premier-remodeling.com</span>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 14 }}>
                        {['Call', 'Directions', 'Website'].map(action => (
                          <div key={action} style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                            padding: '10px 4px', borderRadius: 8,
                            background: '#f1f3f4',
                            color: '#1a73e8',
                            fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer',
                          }}>
                            {action === 'Call' && <svg width="16" height="16" viewBox="0 0 24 24" fill="#1a73e8"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>}
                            {action === 'Directions' && <svg width="16" height="16" viewBox="0 0 24 24" fill="#1a73e8"><path d="M21.71 11.29l-9-9a.996.996 0 0 0-1.41 0l-9 9a.996.996 0 0 0 0 1.41l9 9c.39.39 1.02.39 1.41 0l9-9a.996.996 0 0 0 0-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z"/></svg>}
                            {action === 'Website' && <svg width="16" height="16" viewBox="0 0 24 24" fill="#1a73e8"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 0 1 5.08 16z"/></svg>}
                            {action}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

          {/* Right arrow */}
          <button
            onClick={() => setMonth(m => Math.min(6, m + 1))}
            style={{
              width: 36, height: 36, borderRadius: '50%', border: '1px solid #e0e0e0',
              background: '#fff', cursor: month < 6 ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, opacity: month < 6 ? 0.7 : 0.25,
              transition: 'opacity 0.3s ease',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════════════
   SOFTWARE SECTION — Two tools, Watch Demo
   ═══════════════════════════════════════════════════ */
const swQuotingFeatures = [
  'On-site quote generation',
  'Job tracking pipeline',
  'Automated follow-up sequences',
  'Review request automation',
  'Good / Better / Best options',
  'E-signature collection',
];
const swPitchFeatures = [
  'Trade-specific slide decks',
  'Before & after comparisons',
  'Financing option display',
  'Works offline on iPad',
  'Built-in social proof',
  'E-signature close',
];

type SwDemoStep = { tag: string; title: string; desc: string; bullets: string[] };
const PKG_QUOTING_STEPS: (SwDemoStep & { tab: 'dashboard' | 'quote' | 'jobs' | 'followup' })[] = [
  { tab: 'dashboard', tag: 'Live Dashboard', title: 'Every metric,\nat a glance.', desc: 'Revenue, open quotes, follow-ups, and new reviews updated in real time.', bullets: ['$89.3K tracked this month', '12 open quotes monitored', '7 follow-ups queued automatically'] },
  { tab: 'quote', tag: 'Quote Builder', title: 'Quote built\nbefore you leave.', desc: 'Add line items from your pre-built catalog, adjust quantities, and fire off a professional quote at the door.', bullets: ['Pre-loaded pricing catalog', 'Live total calculation', 'One-tap send via SMS or email'] },
  { tab: 'jobs', tag: 'Job Pipeline', title: 'Every job,\nevery status.', desc: 'See every active quote with its current status and dollar value.', bullets: ['Color-coded job statuses', 'Dollar value at a glance', 'Tap any job to act instantly'] },
  { tab: 'followup', tag: 'Automation', title: 'Follow-ups that\nrun while you sleep.', desc: 'When a quote goes cold, timed SMS and email sequences fire automatically.', bullets: ['Multi-touch: 24h, 72h, 7-day triggers', 'Auto-fires on quote status change', 'Progress tracked per contact'] },
];
const PKG_PITCH_STEPS: (SwDemoStep & { slide: number })[] = [
  { slide: 0, tag: 'Brand Intro', title: 'Walk in with\na presentation.', desc: 'Open with a branded, customer-personalized intro before you say a word.', bullets: ['Personalized per customer name', 'Your logo, brand, and photos', 'Credibility built on slide one'] },
  { slide: 2, tag: 'Your Process', title: 'Show them exactly\nwhat happens.', desc: 'A clear 4-step walkthrough eliminates objections before they\'re asked.', bullets: ['Step-by-step visual timeline', 'Removes friction and uncertainty', 'Sets professional expectations early'] },
  { slide: 7, tag: 'Project Gallery', title: 'Proof they\ncan see.', desc: 'Six project photos built right into the presentation.', bullets: ['Full-bleed project photos', 'Labeled by service type', 'Always current from your portfolio'] },
  { slide: 6, tag: 'Pricing Tiers', title: 'Good, Better,\nBest pricing.', desc: 'Present three tiers so the customer picks a level, not whether to buy.', bullets: ['Interactive tier selection', 'Monthly pricing displayed clearly', 'No long-term contract messaging'] },
  { slide: 9, tag: 'E-Signature', title: 'Close the deal\non the spot.', desc: 'The final slide collects a digital signature and submits the contract.', bullets: ['Tap-to-sign on the iPad', 'Full contract summary visible', 'Instant confirmation sent'] },
];

function SwWatchDemoBtn({ onClick, accent }: { onClick: () => void; accent: string }) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginTop: '1.25rem' }}>
      <span style={{ position: 'absolute', inset: '-6px', borderRadius: '100px', border: `1px solid ${accent}55`, animation: 'demoPulseA 2.6s ease-out infinite', pointerEvents: 'none' }} />
      <span style={{ position: 'absolute', inset: '-6px', borderRadius: '100px', border: `1px solid ${accent}35`, animation: 'demoPulseA 2.6s ease-out 1s infinite', pointerEvents: 'none' }} />
      <button
        onClick={onClick}
        style={{
          position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '9px 18px', borderRadius: '100px', background: 'transparent',
          border: `1.5px solid ${accent}45`, color: accent, fontSize: '0.8rem',
          fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          letterSpacing: '0.01em', transition: 'all 0.25s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = `${accent}12`; e.currentTarget.style.borderColor = `${accent}80`; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = `${accent}45`; }}
      >
        <span style={{
          width: '20px', height: '20px', borderRadius: '50%',
          background: `${accent}20`, border: `1px solid ${accent}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="6" height="8" viewBox="0 0 7 9" fill="none"><path d="M1 1l5 3.5L1 8V1z" fill={accent} /></svg>
        </span>
        Watch Demo
      </button>
    </div>
  );
}

function SoftwareSection() {
  const { ref, inView } = useScrollReveal({ threshold: 0.06 });

  /* Demo overlay state */
  const [demoMode, setDemoMode] = useState<'quoting' | 'pitch' | null>(null);
  const [demoStep, setDemoStep] = useState(0);
  const [activityTs, setActivityTs] = useState(0);

  /* Lock body scroll when demo open */
  useEffect(() => {
    document.body.style.overflow = demoMode ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [demoMode]);

  /* Keyboard nav */
  useEffect(() => {
    if (!demoMode) return;
    const steps = demoMode === 'quoting' ? PKG_QUOTING_STEPS : PKG_PITCH_STEPS;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setDemoMode(null); setDemoStep(0); }
      if (e.key === 'ArrowRight' && demoStep < steps.length - 1) setDemoStep(demoStep + 1);
      if (e.key === 'ArrowLeft' && demoStep > 0) setDemoStep(demoStep - 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [demoMode, demoStep]);

  /* Auto-advance after 5.5s idle */
  useEffect(() => {
    if (!demoMode) return;
    const steps = demoMode === 'quoting' ? PKG_QUOTING_STEPS : PKG_PITCH_STEPS;
    const t = setTimeout(() => {
      setDemoStep(s => s < steps.length - 1 ? s + 1 : 0);
    }, 5500);
    return () => clearTimeout(t);
  }, [demoMode, demoStep, activityTs]);

  const openDemo = (mode: 'quoting' | 'pitch') => { setDemoStep(0); setDemoMode(mode); };
  const closeDemo = () => { setDemoMode(null); setDemoStep(0); };

  /* Build text panel for demo overlay */
  const renderTextPanel = (steps: SwDemoStep[], accent: string) => {
    const s = demoStep;
    return (
      <div style={{ flex: '0 0 36%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2.5rem 3rem', position: 'relative', zIndex: 10, animation: 'demoFadeUp 0.5s ease 0.2s both' }}>
        <div key={s} style={{ animation: 'demoStepIn 0.38s cubic-bezier(0.22,1,0.36,1) both' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '100px', background: `${accent}14`, border: `1px solid ${accent}28`, marginBottom: '1.5rem' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent }} />
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: accent, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>{steps[s].tag}</span>
          </div>
          <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.2)', fontWeight: 600, letterSpacing: '0.12em', marginBottom: '0.6rem', textTransform: 'uppercase' as const }}>
            {String(s + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
          </div>
          <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(1.7rem, 2.4vw, 2.2rem)', fontWeight: 800, color: 'white', lineHeight: 1.12, letterSpacing: '-0.03em', margin: '0 0 1rem', whiteSpace: 'pre-line' as const }}>
            {steps[s].title}
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.42)', lineHeight: '1.75', margin: '0 0 1.75rem' }}>
            {steps[s].desc}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px', marginBottom: '2.5rem' }}>
            {steps[s].bullets.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: `${accent}14`, border: `1px solid ${accent}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="8" height="7" viewBox="0 0 8 7" fill="none"><path d="M1.5 3.5L3.2 5.2L6.5 1.8" stroke={accent} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{b}</span>
              </div>
            ))}
          </div>
          {/* Navigation dots + arrows */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {steps.map((_, i) => (
                <button key={i} onClick={() => { setDemoStep(i); setActivityTs(Date.now()); }} style={{ width: i === s ? '22px' : '6px', height: '6px', borderRadius: '100px', background: i === s ? accent : 'rgba(255,255,255,0.18)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)' }} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => { if (s > 0) { setDemoStep(s - 1); setActivityTs(Date.now()); } }} disabled={s === 0} style={{ width: '36px', height: '36px', borderRadius: '50%', background: s === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: s === 0 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.65)', cursor: s === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', fontSize: '1rem' }}>&#8592;</button>
              <button onClick={() => { if (s < steps.length - 1) { setDemoStep(s + 1); setActivityTs(Date.now()); } }} disabled={s === steps.length - 1} style={{ width: '36px', height: '36px', borderRadius: '50%', background: s === steps.length - 1 ? 'rgba(255,255,255,0.04)' : `${accent}20`, border: `1px solid ${s === steps.length - 1 ? 'rgba(255,255,255,0.1)' : accent + '40'}`, color: s === steps.length - 1 ? 'rgba(255,255,255,0.18)' : accent, cursor: s === steps.length - 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', fontSize: '1rem' }}>&#8594;</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const demoAccent = demoMode === 'quoting' ? '#94D96B' : '#6B8EFE';
  const demoSteps: SwDemoStep[] = demoMode === 'quoting' ? PKG_QUOTING_STEPS : PKG_PITCH_STEPS;

  return (
    <>
      <section ref={ref as React.Ref<HTMLElement>} style={{ ...S.sectionDark, padding: '120px 0' }}>
        <SpaceBackground opacity={0.25} />
        <div style={S.container}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '4rem', ...fadeUp(inView) }}>
            <div style={S.eyebrowDark}>RevCore Software</div>
            <h2 style={S.h2Dark}>Two Tools. Built to <HL>Close More Jobs</HL>.</h2>
            <p style={S.subDark}>
              Purpose-built for home service contractors. Quote faster, present better, automate everything.
            </p>
          </div>

          {/* iPads side by side */}
          <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
            gap: '3rem', marginBottom: '3.5rem', flexWrap: 'wrap' as const,
          }}>
            {/* Left — Quoting */}
            <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', ...scaleUp(inView, 150) }}>
              <IpadMockup tilt={-4} width={480} accentGlow="rgba(148,217,107,0.5)">
                <QuotingApp />
              </IpadMockup>
              <SwWatchDemoBtn onClick={() => openDemo('quoting')} accent="#94D96B" />
            </div>

            {/* Right — Pitch */}
            <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', ...scaleUp(inView, 320) }}>
              <IpadMockup tilt={4} width={480} accentGlow="rgba(107,142,254,0.5)">
                <PitchApp />
              </IpadMockup>
              <SwWatchDemoBtn onClick={() => openDemo('pitch')} accent="#6B8EFE" />
            </div>
          </div>

          {/* Feature cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Quoting card */}
            <div style={{
              borderRadius: '20px', background: '#0f1a10',
              border: '1px solid rgba(148,217,107,0.12)', padding: '2rem',
              ...fadeUp(inView, 450),
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#94D96B' }} />
                <span style={{ color: '#94D96B', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em' }}>QUOTING SOFTWARE</span>
              </div>
              <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.25rem', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: '0.5rem' }}>
                Quote, track &amp; follow up, all in one place.
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.4)', lineHeight: '1.65', marginBottom: '1.25rem' }}>
                Generate accurate proposals on-site, track every job, and let automated sequences handle follow-ups.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {swQuotingFeatures.map((f) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={12} color="#94D96B" />
                    <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pitch card */}
            <div style={{
              borderRadius: '20px', background: '#0f1020',
              border: '1px solid rgba(107,142,254,0.12)', padding: '2rem',
              ...fadeUp(inView, 580),
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6B8EFE' }} />
                <span style={{ color: '#6B8EFE', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em' }}>PRESENTATION SOFTWARE</span>
              </div>
              <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.25rem', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: '0.5rem' }}>
                Close at the kitchen table. Every time.
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.4)', lineHeight: '1.65', marginBottom: '1.25rem' }}>
                A trade-specific iPad presentation that builds trust and collects e-signatures before you leave.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {swPitchFeatures.map((f) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={12} color="#6B8EFE" />
                    <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Demo overlay portal */}
      {demoMode && typeof document !== 'undefined' && createPortal(
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', background: 'rgba(4,7,11,0.94)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)', animation: 'demoBackdropIn 0.3s ease both' }}
          onMouseMove={() => setActivityTs(Date.now())}
          onClick={(e) => e.target === e.currentTarget && closeDemo()}
        >
          {/* Top bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', animation: 'demoFadeUp 0.4s ease 0.2s both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: demoAccent, display: 'block', animation: 'demoDot 2s ease-in-out infinite' }} />
              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Interactive Demo</span>
            </div>
            <button
              onClick={closeDemo}
              style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', transition: 'all 0.15s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
            >&#10005;</button>
          </div>

          {/* Content panels */}
          <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', maxWidth: '1380px', margin: '0 auto', padding: '72px 2rem 2rem' }} onClick={(e) => e.stopPropagation()}>
            {demoMode === 'quoting' ? (
              <>
                <div style={{ flex: '0 0 64%', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', padding: '2rem', animation: 'demoIpadIn 0.55s cubic-bezier(0.22,1,0.36,1) both' }}>
                  <div style={{ width: '100%', maxWidth: '700px' }}>
                    <IpadMockup width="100%" accentGlow="rgba(148,217,107,0.6)">
                      <QuotingApp controlledTab={PKG_QUOTING_STEPS[demoStep]?.tab ?? 'dashboard'} />
                    </IpadMockup>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '1.25rem', padding: '6px 14px', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', animation: 'demoFadeUp 0.5s ease 1.2s both' }}>
                    <span style={{ fontSize: '0.67rem', color: 'rgba(255,255,255,0.35)', fontWeight: 500, letterSpacing: '0.04em' }}>Live &amp; interactive — click around</span>
                  </div>
                </div>
                {renderTextPanel(PKG_QUOTING_STEPS, '#94D96B')}
              </>
            ) : (
              <>
                {renderTextPanel(PKG_PITCH_STEPS, '#6B8EFE')}
                <div style={{ flex: '0 0 64%', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', padding: '2rem', animation: 'demoIpadIn 0.55s cubic-bezier(0.22,1,0.36,1) both' }}>
                  <div style={{ width: '100%', maxWidth: '700px' }}>
                    <IpadMockup width="100%" accentGlow="rgba(107,142,254,0.6)">
                      <PitchApp controlledSlide={PKG_PITCH_STEPS[demoStep]?.slide ?? 0} />
                    </IpadMockup>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '1.25rem', padding: '6px 14px', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', animation: 'demoFadeUp 0.5s ease 1.2s both' }}>
                    <span style={{ fontSize: '0.67rem', color: 'rgba(255,255,255,0.35)', fontWeight: 500, letterSpacing: '0.04em' }}>Live &amp; interactive — click around</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
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
      <div style={S.lightPattern} />
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
  const [expandedPkg, setExpandedPkg] = useState<string | null>(null);
  const { ref, inView } = useScrollReveal({ threshold: 0.06 });

  const fmtPrice = (monthly: number) => {
    const p = isQuarterly ? Math.round(monthly * 0.9) : monthly;
    return '$' + p.toLocaleString();
  };

  const handleCardClick = (pkgId: string) => {
    setFocusedPkg(prev => prev === pkgId ? null : pkgId);
  };

  const handleCardDoubleClick = (e: React.MouseEvent, pkgId: string) => {
    e.stopPropagation();
    setExpandedPkg(pkgId);
  };

  // Close modal on Escape
  useEffect(() => {
    if (!expandedPkg) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setExpandedPkg(null); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [expandedPkg]);

  const isLaunchpad = (id: string) => id === 'launchpad';

  // Mini calendar appointment data per tier
  const getMiniCalendarAppts = (pkgId: string) => {
    if (pkgId === 'launchpad') return [2, 5, 8, 11, 13, 16, 18, 20, 22, 24, 26, 28, 30, 31, 7];
    if (pkgId === 'growth') return [1, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19, 20, 22, 23, 25, 26, 28, 29, 31, 4];
    return [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 14, 15, 16, 17, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 4, 9, 13, 18];
  };

  return (
    <section ref={ref as React.Ref<HTMLElement>} id="pricing" style={{ ...S.sectionDark, padding: '120px 0' }}>
      <SpaceBackground opacity={0.3} />
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
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '16px', alignItems: 'stretch',
        }}>
          {packagesData.map((pkg, i) => {
            const isFocused = focusedPkg === pkg.id;
            const hasAnyFocus = focusedPkg !== null;
            const isOtherFocused = hasAnyFocus && !isFocused;
            const isRecommended = pkg.id === 'growth';

            return (
              <div
                key={pkg.id}
                onClick={() => handleCardClick(pkg.id)}
                onDoubleClick={(e) => handleCardDoubleClick(e, pkg.id)}
                className={`pkg-card${isFocused ? ' pkg-focused' : ''}`}
                style={{
                  borderRadius: 24,
                  background: `linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`,
                  border: `1px solid ${isFocused ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)'}`,
                  overflow: 'hidden', position: 'relative',
                  display: 'flex', flexDirection: 'column' as const,
                  zIndex: isFocused ? 10 : 1,
                  opacity: isOtherFocused ? 0.5 : 1,
                  boxShadow: isFocused
                    ? `0 0 0 1px rgba(255,255,255,0.1), 0 24px 60px rgba(0,0,0,0.5), 0 0 40px ${pkg.accent}10, inset 0 1px 0 rgba(255,255,255,0.08)`
                    : `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)`,
                  transition: 'transform 0.45s cubic-bezier(0.22,1,0.36,1), opacity 0.35s ease, box-shadow 0.45s ease, border-color 0.35s ease',
                  cursor: 'pointer',
                  backdropFilter: 'blur(40px)',
                  WebkitBackdropFilter: 'blur(40px)',
                  ...scaleUp(inView, stagger(i, 200, 150)),
                  ['--pkg-accent' as string]: pkg.accent,
                  ['--pkg-accent-border' as string]: `${pkg.accent}35`,
                  ['--pkg-accent-glow' as string]: `${pkg.accent}12`,
                }}
              >
                {/* Top accent gradient bar */}
                <div style={{
                  height: 2,
                  background: `linear-gradient(90deg, transparent 0%, ${pkg.accent}80 30%, ${pkg.accent} 50%, ${pkg.accent}80 70%, transparent 100%)`,
                  opacity: isFocused ? 1 : 0.6,
                  transition: 'opacity 0.35s ease',
                }} />

                {/* Glass sheen + accent radial glow */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  background: `linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 35%), radial-gradient(ellipse at 50% 0%, ${pkg.accent}08 0%, transparent 60%)`,
                  pointerEvents: 'none', zIndex: 0, borderRadius: 24,
                }} />

                {/* Badge */}
                {isRecommended ? (
                  <div style={{
                    position: 'absolute', top: 24, right: 24,
                    background: pkg.accent,
                    color: 'white', fontSize: '0.65rem', fontWeight: 700,
                    padding: '5px 14px', borderRadius: 100,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    zIndex: 2,
                  }}>Recommended</div>
                ) : (
                  <div style={{
                    position: 'absolute', top: 24, right: 24,
                    border: `1px solid rgba(255,255,255,0.08)`, color: 'rgba(255,255,255,0.3)',
                    fontSize: '0.65rem', fontWeight: 600,
                    padding: '5px 14px', borderRadius: 100,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    zIndex: 2,
                  }}>{pkg.badge}</div>
                )}

                {/* Content */}
                <div style={{ padding: '2.25rem 2.25rem 1.5rem', position: 'relative', zIndex: 1 }}>
                  <h3 style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '1.6rem',
                      fontWeight: 800,
                      color: 'white',
                      marginBottom: '0.5rem', userSelect: 'none',
                    }}
                  >{pkg.name}</h3>
                  <p style={{
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '0.95rem',
                    lineHeight: 1.5, marginBottom: '1.75rem',
                  }}>{pkg.tagline}</p>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                    <span style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '3rem',
                      fontWeight: 800, letterSpacing: '-0.03em',
                      background: `linear-gradient(135deg, #fff 40%, ${pkg.accent}90)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                      {fmtPrice(pkg.priceMonthly)}
                    </span>
                    {pkg.id !== 'launchpad' && (
                      <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.25)' }}>/mo</span>
                    )}
                  </div>

                  {isQuarterly ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.3)' }}>billed {pkg.quarterlyTotal}</span>
                      <span style={{
                        fontSize: '0.78rem', fontWeight: 700, color: '#94D96B',
                        background: 'rgba(148,217,107,0.08)', border: '1px solid rgba(148,217,107,0.12)',
                        padding: '3px 10px', borderRadius: 100,
                      }}>save {pkg.quarterlySave}</span>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>{pkg.noteMonthly}</span>
                  )}
                </div>

                {/* Divider */}
                <div style={{ margin: '0 2.25rem', height: 1, background: `linear-gradient(90deg, transparent, ${pkg.accent}20, transparent)` }} />

                {/* Features */}
                <div style={{ padding: '0 2.25rem 1.5rem', position: 'relative', zIndex: 1 }}>
                  <p style={{
                    fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.2)', margin: '1.25rem 0 1rem',
                  }}>
                    {pkg.featuresTitle || "What's included"}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {pkg.heroFeatures.map((f, fi) => (
                      <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 0' }}>
                        <Check size={14} style={{ color: pkg.accent, flexShrink: 0 }} />
                        <span style={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: 'rgba(255,255,255,0.8)',
                        }}>{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* Loss framing for Launchpad */}
                  {isLaunchpad(pkg.id) && (
                    <div style={{
                      marginTop: 14, padding: '10px 14px', borderRadius: 10,
                      background: 'rgba(232,128,126,0.04)', border: '1px solid rgba(232,128,126,0.10)',
                    }}>
                      <span style={{ fontSize: '0.85rem', color: 'rgba(232,128,126,0.55)', fontWeight: 500 }}>
                        Does not include website, SEO, or sales tools
                      </span>
                    </div>
                  )}

                  {pkg.moreFeatures.length > 0 && (
                  <button onClick={(e) => { e.stopPropagation(); setExpanded(p => ({ ...p, [pkg.id]: !p[pkg.id] })); }} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem', fontWeight: 600,
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
                          <span style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.45)' }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div style={{ padding: '1.25rem 2.25rem 2.25rem', marginTop: 'auto', position: 'relative', zIndex: 1 }}>
                  <button onClick={(e) => e.stopPropagation()} style={{
                    width: '100%',
                    padding: 16,
                    borderRadius: 12,
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: isRecommended ? 'none' : `1px solid ${pkg.accent}25`,
                    background: isRecommended
                      ? `linear-gradient(135deg, ${pkg.accent}, ${pkg.accent}cc)`
                      : `linear-gradient(135deg, ${pkg.accent}12, ${pkg.accent}08)`,
                    color: isRecommended ? 'white' : `rgba(255,255,255,0.7)`,
                    transition: 'all 0.3s ease',
                    letterSpacing: '0.02em',
                    boxShadow: isRecommended ? `0 4px 20px ${pkg.accent}30` : 'none',
                  }}>Claim Your Market</button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* ─── Package Visual Demo Modal ─── */}
      {expandedPkg && (() => {
        const pkg = packagesData.find(p => p.id === expandedPkg)!;
        const apptDays = getMiniCalendarAppts(expandedPkg);
        const showWebsite = expandedPkg === 'growth' || expandedPkg === 'full';
        const showGMB = expandedPkg === 'full';
        const showSoftware = expandedPkg === 'full';

        return (
          <div
            onClick={() => setExpandedPkg(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'pkgModalFadeIn 0.3s ease',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '92vw', maxWidth: expandedPkg === 'launchpad' ? '560px' : expandedPkg === 'growth' ? '900px' : '1280px',
                maxHeight: '90vh', overflowY: 'auto',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 24,
                backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
                position: 'relative',
                animation: 'pkgModalScaleIn 0.3s ease',
              }}
            >
              {/* Accent top bar */}
              <div style={{
                height: 3,
                background: `linear-gradient(90deg, transparent, ${pkg.accent}, transparent)`,
                borderRadius: '24px 24px 0 0',
              }} />

              {/* Close button */}
              <button
                onClick={() => setExpandedPkg(null)}
                style={{
                  position: 'absolute', top: 20, right: 20, zIndex: 10,
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.5)', fontSize: '1rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >✕</button>

              {/* Header */}
              <div style={{ padding: '2rem 2.5rem 1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{
                    fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const,
                    padding: '4px 12px', borderRadius: 100,
                    background: `${pkg.accent}15`, color: pkg.accent,
                    border: `1px solid ${pkg.accent}25`,
                  }}>{pkg.badge}</span>
                </div>
                <h3 style={{
                  fontFamily: 'DM Sans, sans-serif', fontSize: '1.8rem', fontWeight: 800,
                  color: 'white', marginBottom: 6,
                }}>{pkg.name}</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.95rem', marginBottom: 8 }}>{pkg.tagline}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' as const }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{
                      fontFamily: 'DM Sans, sans-serif', fontSize: '2rem', fontWeight: 800,
                      background: `linear-gradient(135deg, #fff 40%, ${pkg.accent}90)`,
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>{fmtPrice(pkg.priceMonthly)}</span>
                    {pkg.id !== 'launchpad' && <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.25)' }}>/mo</span>}
                  </div>
                  {showSoftware && (
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const,
                      padding: '5px 14px', borderRadius: 100,
                      background: `${pkg.accent}12`, color: pkg.accent,
                      border: `1px solid ${pkg.accent}20`,
                    }}>Includes full tech &amp; automation stack</span>
                  )}
                </div>
              </div>

              <div style={{ margin: '0 2.5rem', height: 1, background: `linear-gradient(90deg, transparent, ${pkg.accent}25, transparent)` }} />

              {/* Visual demos */}
              <div style={{
                padding: '1.5rem 2.5rem 2rem',
                display: 'flex', gap: 20, flexWrap: 'wrap' as const,
                justifyContent: expandedPkg === 'launchpad' ? 'center' : 'flex-start',
              }}>

                {/* ── Mini Calendar ── */}
                <div style={{ flex: showSoftware ? '1 1 calc(33.3% - 14px)' : '1', minWidth: showSoftware ? 200 : 0 }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>
                    Appointment Volume
                  </div>
                  <div style={{
                    background: '#fff', borderRadius: 12, overflow: 'hidden',
                    border: `1px solid ${pkg.accent}20`,
                  }}>
                    <div style={{ padding: '10px 14px', borderBottom: '1px solid #ebebeb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#202124' }}>March 2026</span>
                      <span style={{ fontSize: '0.65rem', color: '#70757a' }}>{apptDays.length} appointments</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid #f0f0f0' }}>
                      {['S','M','T','W','T','F','S'].map((d, di) => (
                        <div key={di} style={{ padding: '6px 0', textAlign: 'center', fontSize: '0.6rem', fontWeight: 600, color: '#70757a' }}>{d}</div>
                      ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                      {Array.from({ length: 31 }, (_, idx) => {
                        const day = idx + 1;
                        const hasAppt = apptDays.includes(day);
                        return (
                          <div key={day} style={{
                            padding: '4px 2px', minHeight: 32,
                            borderRight: (idx + 1) % 7 === 0 ? 'none' : '1px solid #f5f5f5',
                            borderBottom: '1px solid #f5f5f5',
                          }}>
                            <div style={{ fontSize: '0.6rem', color: '#202124', textAlign: 'center', marginBottom: 2 }}>{day}</div>
                            {hasAppt && <div style={{ height: 4, borderRadius: 2, margin: '0 2px', background: '#e67c73' }} />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* ── Mini Website ── */}
                {showWebsite && (
                  <div style={{ flex: showSoftware ? '1 1 calc(33.3% - 14px)' : '1', minWidth: showSoftware ? 200 : 0 }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>
                      Your Website
                    </div>
                    <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${pkg.accent}20` }}>
                      <div style={{ background: '#1e2128', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f57' }} />
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#febc2e' }} />
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#28c840' }} />
                        </div>
                        <div style={{
                          flex: 1, background: '#13161c', borderRadius: 5, padding: '4px 10px',
                          fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}>premier-remodeling.com</div>
                      </div>
                      <div style={{
                        height: 220, background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
                        display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center',
                        padding: 24, textAlign: 'center' as const,
                      }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #ff7a1a, #e85d04)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.65rem', fontWeight: 800, color: '#fff', marginBottom: 12,
                        }}>PR</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: 6, lineHeight: 1.2 }}>
                          Premier Remodeling Co
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginBottom: 14 }}>
                          Phoenix&apos;s Top Kitchen &amp; Bath Remodeler
                        </div>
                        <div style={{
                          padding: '8px 20px', borderRadius: 8,
                          background: `linear-gradient(135deg, ${pkg.accent}, ${pkg.accent}cc)`,
                          fontSize: '0.72rem', fontWeight: 700, color: '#fff',
                        }}>Get Free Estimate</div>
                        <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
                          {['Kitchen', 'Bathroom', 'Full Home'].map(s => (
                            <div key={s} style={{
                              padding: '4px 10px', borderRadius: 6,
                              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                              fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)',
                            }}>{s}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Mini GMB Panel ── */}
                {showGMB && (
                  <div style={{ flex: '1 1 calc(33.3% - 14px)', minWidth: 200 }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>
                      Google Business Profile
                    </div>
                    <div style={{ borderRadius: 12, overflow: 'hidden', background: '#fff', border: `1px solid ${pkg.accent}20` }}>
                      <div style={{
                        height: 64, overflow: 'hidden', position: 'relative',
                      }}>
                        <img src="https://assets.cdn.filesafe.space/NYlSya2nYSkSnnXEbY2l/media/69b640f15b89c73d7c929733.png" alt="Premier Remodeling" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        <img src="https://assets.cdn.filesafe.space/NYlSya2nYSkSnnXEbY2l/media/69b641aaeaf081306e71256e.png" alt="Logo" style={{ position: 'absolute', bottom: 6, left: 10, height: 22, width: 'auto' }} />
                      </div>
                      <div style={{ padding: '14px' }}>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#202124', marginBottom: 3 }}>Premier Remodeling Co</div>
                        <div style={{ fontSize: '0.72rem', color: '#70757a', marginBottom: 6 }}>Remodeling contractor</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#202124' }}>4.8</span>
                          <div style={{ display: 'flex' }}>
                            {[1,2,3,4,5].map(s => (
                              <svg key={s} width="12" height="12" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={s <= 4 ? '#fbbc04' : '#dadce0'}/></svg>
                            ))}
                          </div>
                          <span style={{ fontSize: '0.68rem', color: '#1a73e8' }}>38 reviews</span>
                        </div>
                        <div style={{ borderTop: '1px solid #ebebeb', paddingTop: 10, display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="#70757a"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>
                            <span style={{ fontSize: '0.72rem', color: '#202124' }}>Phoenix, AZ</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="#70757a"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>
                            <span style={{ fontSize: '0.72rem', color: '#188038', fontWeight: 500 }}>Open · Closes 6 PM</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="#70757a"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                            <span style={{ fontSize: '0.72rem', color: '#1a73e8' }}>(602) 555-0100</span>
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginTop: 12 }}>
                          {['Call', 'Directions', 'Website'].map(action => (
                            <div key={action} style={{
                              display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 3,
                              padding: '8px 4px', borderRadius: 6,
                              background: '#f1f3f4', color: '#1a73e8',
                              fontSize: '0.6rem', fontWeight: 600,
                            }}>{action}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Sales Software ── */}
                {showSoftware && (
                  <div style={{ flex: '1 1 calc(50% - 10px)', minWidth: 200 }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>
                      Sales Software
                    </div>
                    <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${pkg.accent}20` }}>
                      <div style={{ background: '#1e2128', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f57' }} />
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#febc2e' }} />
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#28c840' }} />
                        </div>
                        <div style={{
                          flex: 1, background: '#13161c', borderRadius: 5, padding: '4px 10px',
                          fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}>app.revcore.io/pipeline</div>
                      </div>
                      <div style={{
                        height: 200, background: '#13161c', padding: '16px',
                        display: 'flex', flexDirection: 'column' as const, gap: 12,
                      }}>
                        {/* Pipeline header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>Sales Pipeline</span>
                          <span style={{ fontSize: '0.6rem', color: '#94D96B', fontWeight: 600 }}>$142k in pipeline</span>
                        </div>
                        {/* Pipeline columns */}
                        <div style={{ display: 'flex', gap: 8, flex: 1 }}>
                          {[
                            { label: 'New Lead', count: 8, color: '#6B8EFE' },
                            { label: 'Quoted', count: 5, color: '#f9ab00' },
                            { label: 'Follow Up', count: 3, color: '#e8710a' },
                            { label: 'Closed Won', count: 6, color: '#94D96B' },
                          ].map(col => (
                            <div key={col.label} style={{
                              flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: 8,
                              padding: '8px 6px', display: 'flex', flexDirection: 'column' as const, gap: 4,
                              border: '1px solid rgba(255,255,255,0.05)',
                            }}>
                              <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textAlign: 'center' as const }}>{col.label}</div>
                              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: col.color, textAlign: 'center' as const }}>{col.count}</div>
                              {Array.from({ length: Math.min(col.count, 3) }, (_, j) => (
                                <div key={j} style={{
                                  height: 6, borderRadius: 3, background: `${col.color}30`,
                                  margin: '0 2px',
                                }} />
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Quoting Software ── */}
                {showSoftware && (
                  <div style={{ flex: '1 1 calc(50% - 10px)', minWidth: 200 }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>
                      Quoting Software
                    </div>
                    <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${pkg.accent}20` }}>
                      <div style={{ background: '#1e2128', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f57' }} />
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#febc2e' }} />
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#28c840' }} />
                        </div>
                        <div style={{
                          flex: 1, background: '#13161c', borderRadius: 5, padding: '4px 10px',
                          fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}>app.revcore.io/quotes</div>
                      </div>
                      <div style={{
                        height: 200, background: '#13161c', padding: '16px',
                        display: 'flex', flexDirection: 'column' as const, gap: 10,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>Quote Builder</span>
                          <span style={{
                            fontSize: '0.55rem', fontWeight: 700, padding: '3px 8px', borderRadius: 100,
                            background: '#94D96B20', color: '#94D96B', border: '1px solid #94D96B30',
                          }}>SENT</span>
                        </div>
                        {/* Quote preview */}
                        <div style={{
                          background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 12,
                          border: '1px solid rgba(255,255,255,0.05)', flex: 1,
                          display: 'flex', flexDirection: 'column' as const, gap: 8,
                        }}>
                          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Kitchen Remodel — Johnson Residence</div>
                          {[
                            { item: 'Demo & removal', price: '$2,800' },
                            { item: 'Custom cabinetry', price: '$8,400' },
                            { item: 'Countertops (granite)', price: '$4,200' },
                            { item: 'Labor & install', price: '$6,100' },
                          ].map(line => (
                            <div key={line.item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>{line.item}</span>
                              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{line.price}</span>
                            </div>
                          ))}
                          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 6, display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.72rem', color: '#fff', fontWeight: 700 }}>Total</span>
                            <span style={{ fontSize: '0.72rem', color: '#94D96B', fontWeight: 800 }}>$21,500</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div style={{ padding: '0 2.5rem 2rem' }}>
                <button style={{
                  width: '100%', padding: 16, borderRadius: 12,
                  fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', border: 'none',
                  background: `linear-gradient(135deg, ${pkg.accent}, ${pkg.accent}cc)`,
                  color: 'white', letterSpacing: '0.02em',
                  boxShadow: `0 4px 20px ${pkg.accent}30`,
                  transition: 'all 0.3s ease',
                }}>Claim Your Market</button>
              </div>
            </div>
          </div>
        );
      })()}
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
    <section ref={ref as React.Ref<HTMLElement>} style={{ ...S.section, padding: '96px 0' }}>
      <div style={S.lightPattern} />
      <div style={{ ...S.container, maxWidth: 900 }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', ...fadeUp(inView) }}>
          <div style={{ ...S.eyebrow, color: 'rgba(254,100,98,0.9)' }}>See Your Potential</div>
          <h2 style={S.h2}>System <HL>ROI</HL> Calculator</h2>
          <p style={S.sub}>Select your package and appointment volume to see your projected net revenue.</p>
        </div>

        <div style={{
          background: '#ffffff', border: '1px solid #E5E5E5',
          borderRadius: 20, padding: 40, ...fadeUp(inView, 200),
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}>
          {/* Package Selection */}
          <div style={{ marginBottom: 32 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#6B6B6B', marginBottom: 12, fontWeight: 600 }}>Select Package</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {(['core', 'full'] as const).map(p => (
                <button key={p} onClick={() => setPkg(p)} style={{
                  padding: '16px 12px', borderRadius: 10, fontWeight: 600, fontSize: '0.9rem',
                  cursor: 'pointer', transition: 'all 0.2s', color: '#0A0A0A', border: 'none',
                  background: pkg === p ? 'rgba(254,100,98,0.08)' : '#F5F5F5',
                  outline: pkg === p ? '2px solid #FE6462' : '2px solid #E5E5E5',
                }}>{p === 'core' ? 'Growth Partner' : 'Full Scale Partner'}</button>
              ))}
            </div>
          </div>

          {/* Appointments */}
          <div style={{ marginBottom: 32 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#6B6B6B', marginBottom: 12, fontWeight: 600 }}>Appointments Per Month</label>
            <div className="roi-appts-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {[{ a: 20, ad: '$1,500' }, { a: 40, ad: '$3,000' }, { a: 60, ad: '$4,500' }, { a: 80, ad: '$6,000' }].map(o => (
                <button key={o.a} onClick={() => setAppts(o.a)} style={{
                  padding: '16px 12px', borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s',
                  textAlign: 'center', color: '#0A0A0A', border: 'none',
                  background: appts === o.a ? 'rgba(254,100,98,0.08)' : '#F5F5F5',
                  outline: appts === o.a ? '2px solid #FE6462' : '2px solid #E5E5E5',
                }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{o.a} Appts</div>
                  <div style={{ fontSize: '0.8rem', color: '#6B6B6B', marginTop: 4 }}>~{o.ad}/mo ads</div>
                </button>
              ))}
            </div>
          </div>

          {/* Inputs */}
          <div className="roi-inputs-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#6B6B6B', marginBottom: 8, fontWeight: 600 }}>Average Job Value</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#6B6B6B' }}>$</span>
                <input type="number" value={jobValue} onChange={e => setJobValue(+e.target.value)} style={{
                  width: '100%', padding: '16px 16px 16px 32px',
                  background: '#F5F5F5', border: '1px solid #E5E5E5',
                  borderRadius: 10, color: '#0A0A0A', fontSize: '1.1rem', fontWeight: 600,
                }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#6B6B6B', marginBottom: 8, fontWeight: 600 }}>Your Close Rate</label>
              <div style={{ position: 'relative' }}>
                <input type="number" value={closeRate} min={1} max={100} onChange={e => setCloseRate(+e.target.value)} style={{
                  width: '100%', padding: '16px', paddingRight: 40,
                  background: '#F5F5F5', border: '1px solid #E5E5E5',
                  borderRadius: 10, color: '#0A0A0A', fontSize: '1.1rem', fontWeight: 600,
                }} />
                <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: '#6B6B6B' }}>%</span>
              </div>
            </div>
          </div>

          {/* Result */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(254,100,98,0.06) 0%, rgba(254,100,98,0.02) 100%)',
            border: '1px solid rgba(254,100,98,0.15)', borderRadius: 16, padding: 32, textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.85rem', color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
              Net Monthly Revenue After Investment
            </div>
            <div style={{ fontSize: '3.5rem', fontWeight: 800, color: '#0A0A0A', lineHeight: 1 }}>
              ${net.toLocaleString()}
            </div>
            <div style={{ fontSize: '1rem', color: '#6B6B6B', marginTop: 12 }}>
              {appts} appointments × {closeRate}% close rate × ${jobValue.toLocaleString()} = ${gross.toLocaleString()} gross
            </div>
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '0.9rem', color: '#6B6B6B' }}>
                Investment: ${pkgCost.toLocaleString()}/mo + ${adSpend.toLocaleString()}/mo ad spend
              </div>
            </div>
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#6B6B6B', marginTop: 24 }}>
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
    <section ref={ref as React.Ref<HTMLElement>} style={{ padding: '48px 0', background: '#F5F5F5', position: 'relative' as const }}>
      <div style={S.lightPattern} />
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


