'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useScrollReveal, fadeUp, stagger } from '@/hooks/useScrollReveal';

const faqs = [
  {
    question: 'What if I\'m already working with a marketing agency?',
    answer: 'Most contractors who come to us have tried 2–3 agencies. The difference is we don\'t just run ads — we build the entire revenue pipeline: ads, follow-up automation, CRM, sales tools, and training. Everything is connected, so nothing falls through the cracks.',
  },
  {
    question: 'How quickly will I see results?',
    answer: 'Most partners see their first qualified appointments within 7–14 days of launch. The full system (ads + automation + CRM) is typically live in 14 days. Compounding results — higher close rates, bigger tickets — take 60–90 days as your reps get trained and the system optimizes.',
  },
  {
    question: 'What does "exclusive territory" mean?',
    answer: 'We only work with one contractor per trade per market. If you\'re a roofer in Dallas, no other roofer in Dallas can become a RevCore partner. This means we\'re fully aligned with your success — your growth is our growth.',
  },
  {
    question: 'What if I want to cancel?',
    answer: 'There are no long-term contracts. We work on monthly retainers because we believe in earning your business every month. That said, our 91% retention rate speaks to the results. Most partners stay because the ROI is too good to walk away from.',
  },
  {
    question: 'Do I need to use all the services?',
    answer: 'No. You can start with a single service a la carte, or choose a bundle package. Most partners start with lead generation and expand into sales tools and training as they see results. We\'ll recommend what makes sense for your stage.',
  },
  {
    question: 'How is RevCore different from other agencies?',
    answer: 'Three things: (1) We build proprietary software — quoting tools, iPad presentations, automation engines — not just ads. (2) We train your reps to close at higher ticket prices, not just generate leads. (3) We\'re exclusive to your territory. We have skin in the game.',
  },
];

function FAQItem({ faq, index, inView }: { faq: typeof faqs[0]; index: number; inView: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        ...fadeUp(inView, stagger(index, 100, 80)),
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '1.5rem 0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '1rem', background: 'none', border: 'none',
          cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '1.1rem', fontWeight: 600, color: 'white',
          lineHeight: 1.4,
        }}>
          {faq.question}
        </span>
        <ChevronDown
          size={18}
          style={{
            color: 'rgba(255,255,255,0.35)',
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1)',
          }}
        />
      </button>
      <div
        style={{
          maxHeight: open ? '300px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.5s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <p style={{
          color: 'rgba(255,255,255,0.45)',
          fontSize: '0.9rem',
          lineHeight: '1.75',
          paddingBottom: '1.5rem',
        }}>
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const { ref, inView } = useScrollReveal({ threshold: 0.08 });

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      style={{ padding: '96px 0', background: '#000000' }}
    >
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', ...fadeUp(inView) }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '1rem',
          }}>
            <span style={{ width: '20px', height: '1px', background: 'rgba(255,255,255,0.15)' }} />
            FAQ
            <span style={{ width: '20px', height: '1px', background: 'rgba(255,255,255,0.15)' }} />
          </span>
          <h2 style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            fontWeight: 800, color: 'white',
            letterSpacing: '-0.02em', lineHeight: 1.1,
          }}>
            Common questions
          </h2>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
