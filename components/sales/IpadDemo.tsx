'use client';

import { useState } from 'react';
import { Megaphone, CalendarCheck, BellRing, MapPin, CheckCircle2 } from 'lucide-react';
import IpadMockup from '@/components/iPadMockup';
import { useScrollReveal, fadeUp, stagger } from '@/hooks/useScrollReveal';

const steps = [
  {
    num: 1,
    icon: <Megaphone size={20} />,
    title: 'Build Ad Campaigns',
    desc: 'Campaigns built around your brand, service area, and core services. Hyper-targeted to homeowners who need you.',
    accent: '#FE6462',
  },
  {
    num: 2,
    icon: <CalendarCheck size={20} />,
    title: 'Generate Self-Booked Appointments',
    desc: 'High-intent leads book directly into your Google Calendar. No chasing, no phone tag.',
    accent: '#6B8EFE',
  },
  {
    num: 3,
    icon: <BellRing size={20} />,
    title: 'Automated Appointment Reminders',
    desc: 'Homeowners get SMS reminders so they show up prepared and on time. Zero manual effort.',
    accent: '#94D96B',
  },
];

export default function IpadDemo() {
  const [step, setStep] = useState(0);
  const { ref, inView } = useScrollReveal({ threshold: 0.06 });

  return (
    <section ref={ref as React.Ref<HTMLElement>} style={{ padding: '96px 0', background: '#0A0A0A' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem', ...fadeUp(inView) }}>
          <div className="section-tag" style={{ justifyContent: 'center' }}>See It In Action</div>
          <h2 style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em',
            color: 'white', marginBottom: '1rem',
          }}>
            How we fill your calendar
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '520px', margin: '0 auto', lineHeight: '1.8' }}>
            Click through each step to see exactly how RevCore books qualified appointments for your business.
          </p>
        </div>

        <div className="ipad-demo-layout" style={{ ...fadeUp(inView, 200) }}>
          {/* Left: Steps */}
          <div className="ipad-demo-steps">
            {steps.map((s, i) => (
              <button
                key={i}
                className={`ipad-step${step === i ? ' active' : ''}`}
                onClick={() => setStep(i)}
                style={{
                  '--step-accent': s.accent,
                  ...fadeUp(inView, stagger(i, 200, 100)),
                } as React.CSSProperties}
              >
                <div className="ipad-step-icon">{s.icon}</div>
                <div className="ipad-step-text">
                  <div className="ipad-step-num">Step {s.num}</div>
                  <div className="ipad-step-title">{s.title}</div>
                  <div className="ipad-step-desc">{s.desc}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Right: iPad */}
          <div className="ipad-demo-device">
            <IpadMockup orientation="portrait" width="100%" accentGlow={steps[step].accent}>
              <div className="ipad-slides">
                {/* Slide 1: Campaign Builder */}
                <div className={`ipad-slide${step === 0 ? ' active' : step > 0 ? ' prev' : ''}`}>
                  <div className="ipad-slide-inner">
                    <div className="campaign-builder">
                      <div className="campaign-header">
                        <div className="campaign-logo">RevCore</div>
                        <div className="campaign-title">Campaign Builder</div>
                      </div>
                      <div className="campaign-form">
                        <div className="campaign-field">
                          <label className="campaign-label">Your Brand</label>
                          <div className="campaign-input filled">
                            <span className="campaign-brand-dot" />
                            Premium Roofing Co.
                          </div>
                        </div>
                        <div className="campaign-field">
                          <label className="campaign-label">Service Area</label>
                          <div className="campaign-zips">
                            {['75201','75202','75203','75204','75205'].map(z => (
                              <span key={z} className="campaign-zip"><MapPin size={10} /> {z}</span>
                            ))}
                          </div>
                        </div>
                        <div className="campaign-field">
                          <label className="campaign-label">Core Services</label>
                          <div className="campaign-services">
                            {['Roof Replacement','Storm Damage','Inspections','Gutter Install'].map(s => (
                              <span key={s} className="campaign-service-tag">
                                <CheckCircle2 size={12} /> {s}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="campaign-field">
                          <label className="campaign-label">Targeting</label>
                          <div className="campaign-targeting">
                            <div className="targeting-row"><span className="targeting-label">Homeowners</span><span className="targeting-val">Ages 30–65</span></div>
                            <div className="targeting-row"><span className="targeting-label">Radius</span><span className="targeting-val">25 miles</span></div>
                            <div className="targeting-row"><span className="targeting-label">Platforms</span><span className="targeting-val">Meta + Google</span></div>
                          </div>
                        </div>
                      </div>
                      <div className="campaign-status">
                        <div className="campaign-status-dot" />
                        Campaign ready to launch
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slide 2: Self-Booked Appointments */}
                <div className={`ipad-slide${step === 1 ? ' active' : step > 1 ? ' prev' : ''}`}>
                  <div className="ipad-slide-inner">
                    <div className="appointments-view">
                      <div className="appointments-header">
                        <div className="campaign-logo">Google Calendar</div>
                        <div className="appointments-badge">3 New This Week</div>
                      </div>
                      <div className="appointments-list">
                        {[
                          { name: 'Sarah M.', service: 'Roof Replacement', time: 'Today, 10:00 AM', status: 'Confirmed', intent: true },
                          { name: 'James K.', service: 'Storm Damage Inspect.', time: 'Today, 2:00 PM', status: 'Confirmed', intent: true },
                          { name: 'Michael R.', service: 'Gutter Install', time: 'Tomorrow, 9:00 AM', status: 'Confirmed', intent: true },
                          { name: 'Lisa D.', service: 'Roof Inspection', time: 'Thu, 11:00 AM', status: 'Pending', intent: false },
                        ].map((apt, i) => (
                          <div key={i} className="appointment-card">
                            <div className="appointment-time">{apt.time}</div>
                            <div className="appointment-info">
                              <div className="appointment-name">{apt.name}</div>
                              <div className="appointment-service">{apt.service}</div>
                            </div>
                            <div className="appointment-right">
                              {apt.intent && <span className="intent-badge">High Intent</span>}
                              <span className={`appointment-status ${apt.status.toLowerCase()}`}>{apt.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="appointments-summary">
                        <div className="summary-stat">
                          <span className="summary-num">15</span>
                          <span className="summary-label">Appointments / Mo</span>
                        </div>
                        <div className="summary-stat">
                          <span className="summary-num">92%</span>
                          <span className="summary-label">Show Rate</span>
                        </div>
                        <div className="summary-stat">
                          <span className="summary-num">$167</span>
                          <span className="summary-label">Cost / Appt</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slide 3: Reminders */}
                <div className={`ipad-slide${step === 2 ? ' active' : ''}`}>
                  <div className="ipad-slide-inner">
                    <div className="reminders-view">
                      <div className="appointments-header">
                        <div className="campaign-logo">Automated Reminders</div>
                        <div className="reminder-active-badge">Active</div>
                      </div>
                      <div className="reminder-timeline">
                        <div className="reminder-event">
                          <div className="reminder-event-time">Instantly</div>
                          <div className="reminder-event-dot green" />
                          <div className="reminder-event-card">
                            <div className="reminder-event-type">Booking Confirmation</div>
                            <div className="reminder-event-msg">
                              &ldquo;Thanks for booking with Premium Roofing! Your appointment is confirmed for Thursday at 10 AM.&rdquo;
                            </div>
                            <div className="reminder-event-channel">SMS + Email</div>
                          </div>
                        </div>
                        <div className="reminder-event">
                          <div className="reminder-event-time">24 hrs before</div>
                          <div className="reminder-event-dot blue" />
                          <div className="reminder-event-card">
                            <div className="reminder-event-type">Day-Before Reminder</div>
                            <div className="reminder-event-msg">
                              &ldquo;Hi Sarah! Just a reminder — our estimator Mike will be at your home tomorrow at 10 AM. See you then!&rdquo;
                            </div>
                            <div className="reminder-event-channel">SMS</div>
                          </div>
                        </div>
                        <div className="reminder-event">
                          <div className="reminder-event-time">1 hr before</div>
                          <div className="reminder-event-dot red" />
                          <div className="reminder-event-card">
                            <div className="reminder-event-type">On-the-Way Alert</div>
                            <div className="reminder-event-msg">
                              &ldquo;Our estimator is on the way! See you in about an hour.&rdquo;
                            </div>
                            <div className="reminder-event-channel">SMS</div>
                          </div>
                        </div>
                      </div>
                      <div className="reminder-stats">
                        <span className="reminder-stat-badge">92% show rate</span>
                        <span className="reminder-stat-badge">Zero manual effort</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </IpadMockup>
          </div>
        </div>

        {/* Bottom tagline */}
        <div style={{
          textAlign: 'center', marginTop: '3rem',
          ...fadeUp(inView, 600),
        }}>
          <p style={{
            color: 'rgba(255,255,255,0.5)', fontSize: '1rem', lineHeight: '1.8',
            maxWidth: '560px', margin: '0 auto',
          }}>
            All done automatically. We manage everything —{' '}
            <span style={{ color: '#94D96B', fontWeight: 600 }}>
              you focus on closing and delivering great work.
            </span>
          </p>
        </div>
      </div>

      <style>{`
        .ipad-demo-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 48px;
          align-items: center;
        }

        .ipad-demo-steps {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .ipad-step {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px 24px;
          border-radius: 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          cursor: pointer;
          text-align: left;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          color: white;
          font-family: inherit;
        }

        .ipad-step:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.1);
        }

        .ipad-step.active {
          background: rgba(255,255,255,0.06);
          border-color: var(--step-accent, #FE6462);
          box-shadow: 0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06);
        }

        .ipad-step-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: rgba(255,255,255,0.4);
          transition: all 0.3s;
        }

        .ipad-step.active .ipad-step-icon {
          background: color-mix(in srgb, var(--step-accent) 15%, transparent);
          color: var(--step-accent);
        }

        .ipad-step-num {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.3);
          margin-bottom: 2px;
        }

        .ipad-step.active .ipad-step-num {
          color: var(--step-accent);
        }

        .ipad-step-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          margin-bottom: 4px;
          line-height: 1.3;
        }

        .ipad-step-desc {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.35);
          line-height: 1.6;
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .ipad-step.active .ipad-step-desc {
          max-height: 100px;
          opacity: 1;
          margin-top: 2px;
        }

        .ipad-demo-device {
          position: relative;
          max-width: 340px;
          margin: 0 auto;
        }

        /* iPad slide system */
        .ipad-slides {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .ipad-slide {
          position: absolute;
          inset: 0;
          transform: translateX(100%);
          opacity: 0;
          transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .ipad-slide.active {
          transform: translateX(0);
          opacity: 1;
        }

        .ipad-slide.prev {
          transform: translateX(-100%);
          opacity: 0;
        }

        .ipad-slide-inner {
          width: 100%;
          height: 100%;
          padding: 16px;
          overflow-y: auto;
        }

        /* Campaign Builder */
        .campaign-builder {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .campaign-header {
          text-align: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .campaign-logo {
          font-family: 'DM Sans', sans-serif;
          font-weight: 800;
          font-size: 0.85rem;
          color: #FE6462;
          margin-bottom: 2px;
        }

        .campaign-title {
          font-size: 0.7rem;
          color: rgba(255,255,255,0.4);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .campaign-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
          flex: 1;
        }

        .campaign-field label {
          display: block;
          font-size: 0.65rem;
          font-weight: 700;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 6px;
        }

        .campaign-input.filled {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 0.8rem;
          color: white;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .campaign-brand-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #FE6462;
          flex-shrink: 0;
        }

        .campaign-zips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .campaign-zip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 100px;
          background: rgba(107,142,254,0.12);
          border: 1px solid rgba(107,142,254,0.2);
          font-size: 0.7rem;
          font-weight: 600;
          color: #6B8EFE;
        }

        .campaign-services {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .campaign-service-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: 8px;
          background: rgba(148,217,107,0.08);
          border: 1px solid rgba(148,217,107,0.15);
          font-size: 0.72rem;
          font-weight: 600;
          color: #94D96B;
        }

        .campaign-targeting {
          background: rgba(255,255,255,0.04);
          border-radius: 8px;
          overflow: hidden;
        }

        .targeting-row {
          display: flex;
          justify-content: space-between;
          padding: 7px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          font-size: 0.72rem;
        }

        .targeting-row:last-child { border-bottom: none; }

        .targeting-label {
          color: rgba(255,255,255,0.35);
        }

        .targeting-val {
          color: rgba(255,255,255,0.7);
          font-weight: 600;
        }

        .campaign-status {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          margin-top: 12px;
          border-radius: 10px;
          background: rgba(148,217,107,0.08);
          border: 1px solid rgba(148,217,107,0.15);
          font-size: 0.75rem;
          font-weight: 600;
          color: #94D96B;
        }

        .campaign-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #94D96B;
          animation: pulse-dot 2s ease infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* Appointments View */
        .appointments-view {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .appointments-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .appointments-badge {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 100px;
          background: rgba(107,142,254,0.12);
          color: #6B8EFE;
          border: 1px solid rgba(107,142,254,0.2);
        }

        .appointments-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .appointment-card {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          align-items: center;
        }

        .appointment-time {
          font-size: 0.62rem;
          color: rgba(255,255,255,0.35);
          font-weight: 600;
          white-space: nowrap;
          min-width: 60px;
        }

        .appointment-name {
          font-size: 0.78rem;
          font-weight: 700;
          color: white;
        }

        .appointment-service {
          font-size: 0.65rem;
          color: rgba(255,255,255,0.35);
        }

        .appointment-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }

        .intent-badge {
          font-size: 0.55rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 100px;
          background: rgba(148,217,107,0.12);
          color: #94D96B;
          border: 1px solid rgba(148,217,107,0.2);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .appointment-status {
          font-size: 0.6rem;
          font-weight: 600;
        }

        .appointment-status.confirmed { color: #94D96B; }
        .appointment-status.pending { color: #FEB64A; }

        .appointments-summary {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .summary-stat {
          text-align: center;
        }

        .summary-num {
          display: block;
          font-family: 'DM Sans', sans-serif;
          font-size: 1.1rem;
          font-weight: 800;
          color: white;
        }

        .summary-label {
          font-size: 0.55rem;
          color: rgba(255,255,255,0.3);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Reminders View */
        .reminders-view {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .reminder-active-badge {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 100px;
          background: rgba(148,217,107,0.12);
          color: #94D96B;
          border: 1px solid rgba(148,217,107,0.2);
        }

        .reminder-timeline {
          display: flex;
          flex-direction: column;
          gap: 0;
          flex: 1;
          position: relative;
          padding-left: 80px;
        }

        .reminder-event {
          position: relative;
          padding-bottom: 16px;
        }

        .reminder-event:not(:last-child)::after {
          content: '';
          position: absolute;
          left: -3px;
          top: 26px;
          bottom: 0;
          width: 2px;
          background: rgba(255,255,255,0.06);
        }

        .reminder-event-time {
          position: absolute;
          left: -80px;
          top: 8px;
          font-size: 0.58rem;
          color: rgba(255,255,255,0.3);
          font-weight: 600;
          width: 65px;
          text-align: right;
        }

        .reminder-event-dot {
          position: absolute;
          left: -7px;
          top: 8px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          z-index: 1;
        }

        .reminder-event-dot.green { background: #94D96B; box-shadow: 0 0 8px rgba(148,217,107,0.3); }
        .reminder-event-dot.blue { background: #6B8EFE; box-shadow: 0 0 8px rgba(107,142,254,0.3); }
        .reminder-event-dot.red { background: #FE6462; box-shadow: 0 0 8px rgba(254,100,98,0.3); }

        .reminder-event-card {
          margin-left: 16px;
          padding: 10px 12px;
          border-radius: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
        }

        .reminder-event-type {
          font-size: 0.72rem;
          font-weight: 700;
          color: white;
          margin-bottom: 4px;
        }

        .reminder-event-msg {
          font-size: 0.68rem;
          color: rgba(255,255,255,0.4);
          line-height: 1.5;
          font-style: italic;
          margin-bottom: 6px;
        }

        .reminder-event-channel {
          font-size: 0.58rem;
          font-weight: 700;
          color: rgba(255,255,255,0.25);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .reminder-stats {
          display: flex;
          gap: 8px;
          margin-top: 8px;
          justify-content: center;
        }

        .reminder-stat-badge {
          padding: 5px 12px;
          border-radius: 100px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          font-size: 0.68rem;
          font-weight: 600;
          color: rgba(255,255,255,0.5);
        }

        /* Mobile */
        @media (max-width: 900px) {
          .ipad-demo-layout {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .ipad-demo-device {
            max-width: 280px;
          }
          .ipad-demo-steps {
            order: 2;
          }
          .ipad-demo-device {
            order: 1;
          }
        }
      `}</style>
    </section>
  );
}
