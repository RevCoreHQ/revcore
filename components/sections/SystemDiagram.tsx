'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const W = 1000;
const H = 640;

type NodeId = 'crm' | 'leads' | 'seo' | 'software' | 'automation' | 'training';

interface SystemNode {
  id: NodeId;
  number: string;
  label: string;
  sub: string;
  detail: string;
  bullets: string[];
  color: string;
  x: number;
  y: number;
  isHub?: boolean;
}

const NODES: SystemNode[] = [
  {
    id: 'crm',
    number: '★',
    label: 'RevCore CRM',
    sub: 'Central Hub',
    detail: 'The brain of your entire operation. Every service feeds data back here, giving you one clean dashboard of every lead, every job, every dollar, and every team member in real time.',
    bullets: ['Real-time lead tracking', 'Revenue & source reporting', 'Custom pipeline views', 'Team access & roles'],
    color: '#94D96B',
    x: 500, y: 320,
    isHub: true,
  },
  {
    id: 'leads',
    number: '01',
    label: 'Lead Generation',
    sub: 'Google · Meta · YouTube',
    detail: 'Hyper-targeted paid ad campaigns driving homeowners in your exact service area directly into your CRM pipeline. Every dollar tracked, every lead attributed to its source.',
    bullets: ['Google Search & Display Ads', 'Meta & Instagram campaigns', 'YouTube pre-roll ads', 'Conversion-optimized landing pages'],
    color: '#FE6462',
    x: 500, y: 42,
  },
  {
    id: 'seo',
    number: '02',
    label: 'SEO / Organic',
    sub: 'Local Dominance',
    detail: 'Long-term organic visibility that compounds month over month, so homeowners in your market find you on Google before they ever see your competitors.',
    bullets: ['Local SEO audit & strategy', 'Google Business optimization', 'Review generation system', 'Keyword & content planning'],
    color: '#6B8EFE',
    x: 878, y: 175,
  },
  {
    id: 'software',
    number: '03',
    label: 'Sales Software',
    sub: 'Quoting + Pitch App',
    detail: 'Two proprietary tools built exclusively for home service trades. Quote on-site, present professionally on iPad, collect e-signatures, and sync every job back to your CRM automatically.',
    bullets: ['On-site quoting tool', 'Custom iPad presentation', 'E-signature close', 'Job pipeline sync'],
    color: '#94D96B',
    x: 800, y: 505,
  },
  {
    id: 'automation',
    number: '04',
    label: 'Automation',
    sub: 'Follow-up + Rehash',
    detail: 'Our automation engine runs 24/7, following up on cold quotes, re-engaging old leads through the rehash engine, requesting reviews, and firing appointment reminders. Zero team effort.',
    bullets: ['Quote follow-up sequences', 'Rehash engine (old leads)', 'Review request automation', 'Appointment reminders'],
    color: '#FEB64A',
    x: 200, y: 505,
  },
  {
    id: 'training',
    number: '05',
    label: 'Sales Training',
    sub: 'In-Home Closing',
    detail: 'We train your reps in the field, scripts, objection handling, Good/Better/Best pricing presentations, and how to close at the kitchen table every time. Paired with our tools for maximum close rate.',
    bullets: ['In-home sales scripts', 'Objection handling', 'Good/Better/Best pricing', 'Field performance tracking'],
    color: '#FE6462',
    x: 122, y: 175,
  },
];

interface Conn {
  from: NodeId;
  to: NodeId;
  color: string;
  dur: number;
  delay: number;
  d: string;
}

/* Precomputed quadratic bezier paths — all flowing INTO the CRM hub */
const CONNECTIONS: Conn[] = [
  { from: 'leads',      to: 'crm', color: '#FE6462', dur: 2.2, delay: 0.0, d: 'M 500,42 Q 558,185 500,320' },
  { from: 'seo',        to: 'crm', color: '#6B8EFE', dur: 2.5, delay: 0.5, d: 'M 878,175 Q 682,205 500,320' },
  { from: 'software',   to: 'crm', color: '#94D96B', dur: 2.4, delay: 1.0, d: 'M 800,505 Q 675,365 500,320' },
  { from: 'automation', to: 'crm', color: '#FEB64A', dur: 2.4, delay: 1.5, d: 'M 200,505 Q 325,365 500,320' },
  { from: 'training',   to: 'crm', color: '#FE6462', dur: 2.5, delay: 2.0, d: 'M 122,175 Q 318,205 500,320' },
  /* Outer cross-connections (leads generate → automation follows up; leads & SEO complement) */
  { from: 'leads', to: 'automation', color: '#FEB64A', dur: 3.4, delay: 0.9, d: 'M 500,42 Q 70,270 200,505' },
  { from: 'leads', to: 'seo',        color: '#6B8EFE', dur: 3.0, delay: 1.4, d: 'M 500,42 Q 820,18 878,175' },
];

/* ─── Helpers ───────────────────────────────────────────────────────────────── */
function toLeft(x: number) { return `${(x / W) * 100}%`; }
function toTop(y: number)  { return `${(y / H) * 100}%`; }

function isConnected(conn: Conn, id: NodeId) {
  return conn.from === id || conn.to === id;
}

/* ─── Component ─────────────────────────────────────────────────────────────── */
export default function SystemDiagram() {
  const [active, setActive] = useState<NodeId | null>(null);
  const [hovered, setHovered] = useState<NodeId | null>(null);

  const focusId = hovered ?? active;
  const activeNode = active ? NODES.find(n => n.id === active) : null;

  function toggle(id: NodeId) {
    setActive(prev => (prev === id ? null : id));
  }

  return (
    <section style={{ padding: '100px 0 120px', background: '#070b0f', overflow: 'hidden' }}>
      <div className="container">

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '1rem',
          }}>
            <span style={{ width: '24px', height: '2px', background: '#94D96B', display: 'block' }} />
            Complete System
          </div>
          <h2 style={{
            fontFamily: 'DM Sans, sans-serif', fontWeight: 800,
            fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.1,
            letterSpacing: '-0.03em', color: 'white', marginBottom: '1rem',
          }}>
            You can&apos;t scale without{' '}
            <span style={{
              background: 'linear-gradient(118deg, #FE6462, #FEB64A)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>all of this.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '520px', margin: '0 auto', lineHeight: '1.75', fontSize: '0.9375rem' }}>
            Running ads alone won&apos;t work. Software alone won&apos;t either. Every piece connects, and everything routes back into your CRM.{' '}
            <span style={{ color: 'rgba(255,255,255,0.65)' }}>Click any node to explore.</span>
          </p>
        </div>

        {/* ── Diagram ── */}
        <div style={{ position: 'relative', width: '100%', paddingBottom: `${(H / W) * 100}%` }}>
          <div style={{ position: 'absolute', inset: 0 }}>

            {/* SVG layer */}
            <svg
              viewBox={`0 0 ${W} ${H}`}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Path defs for animateMotion mpath references */}
                {CONNECTIONS.map((c, i) => (
                  <path key={i} id={`sp-${i}`} d={c.d} />
                ))}
                {/* Radial glow filter */}
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="glow-strong">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* ── Radar pulses on CRM ── */}
              {[0, 0.7, 1.4].map((d, i) => (
                <g key={i}>
                  <circle cx={500} cy={320} r="2" fill="none" stroke="#94D96B" strokeWidth="1.2">
                    <animate attributeName="r"       values="28;90"  dur="2.1s" begin={`${d}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0"  dur="2.1s" begin={`${d}s`} repeatCount="indefinite" />
                  </circle>
                </g>
              ))}

              {/* ── Connection lines ── */}
              {CONNECTIONS.map((c, i) => {
                const dimmed = focusId && !isConnected(c, focusId);
                const bright = focusId && isConnected(c, focusId);
                return (
                  <g key={i}>
                    {/* Base glow line (blurred, thick) */}
                    <use
                      href={`#sp-${i}`}
                      fill="none"
                      stroke={c.color}
                      strokeWidth={bright ? 5 : 2}
                      opacity={dimmed ? 0.04 : bright ? 0.18 : 0.09}
                      filter={bright ? 'url(#glow)' : undefined}
                      style={{ transition: 'opacity 0.4s ease, stroke-width 0.4s ease' }}
                    />
                    {/* Dashed animated line */}
                    <use
                      href={`#sp-${i}`}
                      fill="none"
                      stroke={c.color}
                      strokeWidth={bright ? 2 : 1.2}
                      strokeDasharray="7 8"
                      opacity={dimmed ? 0.06 : bright ? 0.85 : 0.32}
                      style={{
                        animation: `dash-flow-${i} ${bright ? 0.8 : 1.4}s linear infinite`,
                        transition: 'opacity 0.4s ease, stroke-width 0.4s ease',
                      }}
                    />
                  </g>
                );
              })}

              {/* ── Travelling dots ── */}
              {CONNECTIONS.map((c, i) => {
                const dimmed = focusId && !isConnected(c, focusId);
                const bright = focusId && isConnected(c, focusId);
                return (
                  <g key={i}>
                    {/* Glow halo around dot */}
                    <circle
                      r={bright ? 7 : 4}
                      fill={c.color}
                      opacity={dimmed ? 0.05 : bright ? 0.25 : 0.12}
                      filter="url(#glow)"
                      style={{ transition: 'opacity 0.4s ease, r 0.4s ease' }}
                    >
                      <animateMotion dur={`${bright ? c.dur * 0.6 : c.dur}s`} repeatCount="indefinite" begin={`${c.delay}s`}>
                        <mpath href={`#sp-${i}`} />
                      </animateMotion>
                    </circle>
                    {/* Solid dot */}
                    <circle
                      r={bright ? 4.5 : 3}
                      fill={c.color}
                      opacity={dimmed ? 0.08 : bright ? 1 : 0.75}
                      filter={bright ? 'url(#glow)' : undefined}
                      style={{ transition: 'opacity 0.4s ease' }}
                    >
                      <animateMotion dur={`${bright ? c.dur * 0.6 : c.dur}s`} repeatCount="indefinite" begin={`${c.delay}s`}>
                        <mpath href={`#sp-${i}`} />
                      </animateMotion>
                    </circle>
                  </g>
                );
              })}

              {/* ── Node background glows (rendered in SVG for blur) ── */}
              {NODES.map(node => {
                const isFocus = focusId === node.id;
                const isActive = active === node.id;
                return (
                  <circle
                    key={node.id}
                    cx={node.x}
                    cy={node.y}
                    r={node.isHub ? 68 : 48}
                    fill={node.color}
                    opacity={isFocus ? 0.18 : isActive ? 0.12 : 0.04}
                    filter="url(#glow-strong)"
                    style={{ transition: 'opacity 0.35s ease, r 0.35s ease', pointerEvents: 'none' }}
                  />
                );
              })}
            </svg>

            {/* ── HTML Nodes ── */}
            {NODES.map(node => {
              const isActiveNode = active === node.id;
              const isHoveredNode = hovered === node.id;
              const dimmed = focusId && focusId !== node.id && active !== node.id;

              return (
                <button
                  key={node.id}
                  onClick={() => toggle(node.id)}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    position: 'absolute',
                    left: toLeft(node.x),
                    top: toTop(node.y),
                    transform: `translate(-50%, -50%) scale(${isActiveNode || isHoveredNode ? 1.08 : 1})`,
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease',
                    opacity: dimmed ? 0.35 : 1,
                    zIndex: isActiveNode ? 10 : 2,
                  }}
                  aria-label={`${node.label} — click for details`}
                >
                  <div style={{
                    width: node.isHub ? '164px' : '142px',
                    borderRadius: node.isHub ? '20px' : '16px',
                    background: isActiveNode
                      ? `linear-gradient(135deg, ${node.color}18, ${node.color}08)`
                      : 'rgba(10,14,20,0.92)',
                    border: `1.5px solid ${isActiveNode || isHoveredNode ? node.color : `${node.color}30`}`,
                    padding: node.isHub ? '1.25rem 1.1rem' : '0.9rem 1rem',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    boxShadow: isActiveNode
                      ? `0 0 0 3px ${node.color}28, 0 16px 48px ${node.color}20`
                      : isHoveredNode
                        ? `0 0 0 2px ${node.color}22, 0 8px 32px rgba(0,0,0,0.4)`
                        : '0 4px 24px rgba(0,0,0,0.3)',
                    transition: 'all 0.3s ease',
                    textAlign: 'left',
                  }}>
                    <div style={{
                      fontSize: node.isHub ? '0.65rem' : '0.6rem',
                      fontWeight: 700, letterSpacing: '0.1em',
                      color: node.color, marginBottom: node.isHub ? '6px' : '4px',
                      display: 'flex', alignItems: 'center', gap: '5px',
                    }}>
                      <span style={{
                        width: node.isHub ? '6px' : '5px',
                        height: node.isHub ? '6px' : '5px',
                        borderRadius: '50%',
                        background: node.color,
                        display: 'inline-block',
                        boxShadow: `0 0 6px ${node.color}`,
                        animation: node.isHub ? 'pulse-dot 1.8s ease-in-out infinite' : undefined,
                      }} />
                      {node.number}
                    </div>
                    <div style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontWeight: 800,
                      fontSize: node.isHub ? '0.95rem' : '0.82rem',
                      color: 'white',
                      lineHeight: 1.2,
                      marginBottom: '3px',
                    }}>
                      {node.label}
                    </div>
                    <div style={{
                      fontSize: node.isHub ? '0.7rem' : '0.65rem',
                      color: 'rgba(255,255,255,0.38)',
                      fontWeight: 500,
                    }}>
                      {node.sub}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Detail panel ── */}
        <div style={{
          marginTop: '2.5rem',
          opacity: activeNode ? 1 : 0,
          transform: activeNode ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.4s cubic-bezier(0.22,1,0.36,1), transform 0.4s cubic-bezier(0.22,1,0.36,1)',
          pointerEvents: activeNode ? 'auto' : 'none',
        }}>
          {activeNode && (
            <div style={{
              borderRadius: '20px',
              background: `linear-gradient(135deg, ${activeNode.color}0c 0%, rgba(7,11,15,0.95) 60%)`,
              border: `1px solid ${activeNode.color}28`,
              padding: '2.5rem',
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: '2.5rem',
              alignItems: 'start',
              backdropFilter: 'blur(12px)',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                  <span style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: activeNode.color, boxShadow: `0 0 10px ${activeNode.color}`,
                    flexShrink: 0, display: 'block',
                  }} />
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: activeNode.color, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    {activeNode.number} · {activeNode.sub}
                  </span>
                </div>
                <h3 style={{
                  fontFamily: 'DM Sans, sans-serif', fontWeight: 800,
                  fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', color: 'white',
                  lineHeight: 1.15, marginBottom: '0.875rem',
                }}>
                  {activeNode.label}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: '1.75', fontSize: '0.9375rem', maxWidth: '540px' }}>
                  {activeNode.detail}
                </p>
              </div>
              <div style={{ minWidth: '220px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.25rem' }}>
                  {activeNode.bullets.map(b => (
                    <div key={b} style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '8px 14px', borderRadius: '8px',
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${activeNode.color}18`,
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: activeNode.color, flexShrink: 0 }} />
                      <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{b}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link href="/contact" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    background: activeNode.color, color: '#0A0A0A',
                    padding: '9px 18px', borderRadius: '100px',
                    fontWeight: 700, fontSize: '0.8rem', textDecoration: 'none',
                    flexShrink: 0,
                  }}>
                    Learn more <ArrowRight size={13} />
                  </Link>
                  <button
                    onClick={() => setActive(null)}
                    style={{
                      background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.5)', borderRadius: '100px',
                      padding: '9px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center',
                    }}
                    aria-label="Close detail"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hint when nothing selected */}
        <div style={{
          textAlign: 'center', marginTop: '1.5rem',
          opacity: activeNode ? 0 : 0.4,
          transition: 'opacity 0.35s ease',
          fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.05em',
          pointerEvents: 'none',
        }}>
          ↑ click any node above to explore
        </div>
      </div>

      {/* ── Keyframe styles ── */}
      <style>{`
        /* Dash-flow animations — one per connection for independent timing */
        ${CONNECTIONS.map((c, i) => `
          @keyframes dash-flow-${i} {
            to { stroke-dashoffset: -15; }
          }
        `).join('')}

        /* CRM dot pulse */
        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 6px #94D96B; }
          50% { box-shadow: 0 0 14px #94D96B, 0 0 24px #94D96B88; }
        }

        @media (max-width: 768px) {
          /* On mobile, diagram scales down — nodes may overlap. Hide diagram, show list. */
          .sysdiag-mobile-hide { display: none !important; }
        }
      `}</style>
    </section>
  );
}
