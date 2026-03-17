'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';
import { useScrollReveal, fadeUp, scaleUp, stagger } from '@/hooks/useScrollReveal';

/* ─── Canvas dimensions ────────────────────────────────────────────────────── */
const W = 1000;
const H = 660;

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
    x: 500, y: 330,
    isHub: true,
  },
  {
    id: 'leads',
    number: '01',
    label: 'Lead Generation',
    sub: 'Meta Ads',
    detail: 'Hyper-targeted Meta ad campaigns driving homeowners in your exact service area directly into your CRM pipeline. Every dollar tracked, every lead attributed to its source.',
    bullets: ['Facebook & Instagram ads', 'Custom audience targeting', 'Retargeting campaigns', 'Conversion-optimized landing pages'],
    color: '#FE6462',
    x: 500, y: 62,
  },
  {
    id: 'seo',
    number: '02',
    label: 'SEO / Organic',
    sub: 'Local Dominance',
    detail: 'Long-term organic visibility that compounds month over month, so homeowners in your market find you on Google before they ever see your competitors.',
    bullets: ['Local SEO audit & strategy', 'Google Business optimization', 'Review generation system', 'Keyword & content planning'],
    color: '#6B8EFE',
    x: 878, y: 195,
  },
  {
    id: 'software',
    number: '03',
    label: 'Sales Software',
    sub: 'Quoting + Pitch App',
    detail: 'Two proprietary tools built exclusively for home service trades. Quote on-site, present professionally on iPad, collect e-signatures, and sync every job back to your CRM automatically.',
    bullets: ['On-site quoting tool', 'Custom iPad presentation', 'E-signature close', 'Job pipeline sync'],
    color: '#4FC3F7',
    x: 800, y: 515,
  },
  {
    id: 'automation',
    number: '04',
    label: 'Automation',
    sub: 'Follow-up + Rehash',
    detail: 'Our automation engine runs 24/7, following up on cold quotes, re-engaging old leads through the rehash engine, requesting reviews, and firing appointment reminders. Zero team effort.',
    bullets: ['Quote follow-up sequences', 'Rehash engine (old leads)', 'Review request automation', 'Appointment reminders'],
    color: '#FEB64A',
    x: 200, y: 515,
  },
  {
    id: 'training',
    number: '05',
    label: 'Sales Training',
    sub: 'In-Home Closing',
    detail: 'We train your reps in the field, scripts, objection handling, Good/Better/Best pricing presentations, and how to close at the kitchen table every time. Paired with our tools for maximum close rate.',
    bullets: ['In-home sales scripts', 'Objection handling', 'Good/Better/Best pricing', 'Field performance tracking'],
    color: '#FF8B89',
    x: 122, y: 195,
  },
];

interface Conn {
  from: NodeId;
  to: NodeId;
  color: string;
  dur: number;
  delay: number;
  d: string;
  isRing?: boolean;
}

/* Hub spokes — data flows into CRM */
const HUB_CONNECTIONS: Conn[] = [
  { from: 'leads',      to: 'crm', color: '#FE6462', dur: 2.2, delay: 0.0, d: 'M 500,62 Q 555,200 500,330' },
  { from: 'seo',        to: 'crm', color: '#6B8EFE', dur: 2.5, delay: 0.5, d: 'M 878,195 Q 680,220 500,330' },
  { from: 'software',   to: 'crm', color: '#4FC3F7', dur: 2.4, delay: 1.0, d: 'M 800,515 Q 680,380 500,330' },
  { from: 'automation', to: 'crm', color: '#FEB64A', dur: 2.4, delay: 1.5, d: 'M 200,515 Q 320,380 500,330' },
  { from: 'training',   to: 'crm', color: '#FF8B89', dur: 2.5, delay: 2.0, d: 'M 122,195 Q 320,220 500,330' },
];

/* Pentagon ring — peer connections between outer nodes */
const RING_CONNECTIONS: Conn[] = [
  { from: 'leads',      to: 'seo',        color: '#A878E0', dur: 3.5, delay: 0.4, d: 'M 500,62 Q 760,20 878,195',        isRing: true },
  { from: 'seo',        to: 'software',   color: '#6B8EFE', dur: 3.8, delay: 1.1, d: 'M 878,195 Q 980,360 800,515',       isRing: true },
  { from: 'software',   to: 'automation', color: '#4FC3F7', dur: 3.6, delay: 0.7, d: 'M 800,515 Q 500,630 200,515',       isRing: true },
  { from: 'automation', to: 'training',   color: '#FEB64A', dur: 3.9, delay: 1.5, d: 'M 200,515 Q 20,360 122,195',        isRing: true },
  { from: 'training',   to: 'leads',      color: '#FF8B89', dur: 3.4, delay: 0.9, d: 'M 122,195 Q 240,20 500,62',         isRing: true },
];

const CONNECTIONS: Conn[] = [...HUB_CONNECTIONS, ...RING_CONNECTIONS];

/* ─── Helpers ───────────────────────────────────────────────────────────────── */
function toLeft(x: number) { return `${(x / W) * 100}%`; }
function toTop(y: number)  { return `${(y / H) * 100}%`; }

function isConnected(conn: Conn, id: NodeId) {
  return conn.from === id || conn.to === id;
}

const OUTER_NODES = NODES.filter(n => !n.isHub);
const HUB_NODE = NODES.find(n => n.isHub)!;

const TRANSITION = '0.4s cubic-bezier(0.22,1,0.36,1)';

/* ─── Component ─────────────────────────────────────────────────────────────── */
export default function SystemDiagram() {
  const [active, setActive] = useState<NodeId | null>(null);
  const [hovered, setHovered] = useState<NodeId | null>(null);
  const { ref, inView } = useScrollReveal({ threshold: 0.1 });

  const focusId = hovered ?? active;
  const activeNode = active ? NODES.find(n => n.id === active) : null;

  function toggle(id: NodeId) {
    setActive(prev => (prev === id ? null : id));
  }

  return (
    <section ref={ref as React.Ref<HTMLElement>} style={{ padding: '100px 0 120px', background: '#F5F5F5', overflow: 'hidden', position: 'relative' }}>
      {/* Light dot pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.045) 1px, transparent 1px)',
        backgroundSize: '24px 24px', pointerEvents: 'none', zIndex: 0,
      }} />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem', ...fadeUp(inView) }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: '#6B6B6B', marginBottom: '1rem',
          }}>
            <span style={{ width: '24px', height: '2px', background: '#94D96B', display: 'block' }} />
            Complete System
          </div>
          <h2 style={{
            fontFamily: 'DM Sans, sans-serif', fontWeight: 800,
            fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.1,
            letterSpacing: '-0.03em', color: '#0A0A0A', marginBottom: '1rem',
          }}>
            Everything works as{' '}
            <span style={{
              background: 'linear-gradient(118deg, #94D96B, #4FC3F7)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>one system.</span>
          </h2>
          <p style={{ color: '#6B6B6B', maxWidth: '520px', margin: '0 auto', lineHeight: '1.75', fontSize: '0.9375rem' }}>
            Every service feeds data to your CRM. Every tool talks to every other.{' '}
            <span style={{ color: '#0A0A0A', fontWeight: 600 }}>Click any node to explore.</span>
          </p>
        </div>

        {/* ── Diagram ── */}
        <div className="sysdiag-diagram" style={{ position: 'relative', width: '100%', paddingBottom: `${(H / W) * 100}%` }}>
          <div style={{ position: 'absolute', inset: 0 }}>

            {/* SVG layer — connections only */}
            <svg
              className="sysdiag-svg"
              viewBox={`0 0 ${W} ${H}`}
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible',
                opacity: inView ? 1 : 0,
                transition: `opacity 1.2s ease 400ms`,
              }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Connection path defs */}
                {CONNECTIONS.map((c, i) => (
                  <path key={i} id={`sp-${i}`} d={c.d} />
                ))}
                {/* Lightweight glow */}
                <filter id="dot-glow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* ── CRM radar pulses ── */}
              {[0, 0.8, 1.6].map((d, i) => (
                <circle key={i} cx={HUB_NODE.x} cy={HUB_NODE.y} r="2" fill="none" stroke="#94D96B" strokeWidth="1">
                  <animate attributeName="r"       values="30;100" dur="2.4s" begin={`${d}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.15;0" dur="2.4s" begin={`${d}s`} repeatCount="indefinite" />
                </circle>
              ))}

              {/* ── Connection lines ── */}
              {CONNECTIONS.map((c, i) => {
                const dimmed = focusId && !isConnected(c, focusId);
                const bright = focusId && isConnected(c, focusId);
                const baseOpacity = c.isRing ? 0.15 : 0.2;
                return (
                  <g key={i}>
                    {/* Base line */}
                    <use
                      href={`#sp-${i}`}
                      fill="none"
                      stroke={c.color}
                      strokeWidth={bright ? 3 : 2}
                      opacity={dimmed ? 0.05 : bright ? 0.4 : baseOpacity}
                      style={{ transition: `opacity ${TRANSITION}, stroke-width ${TRANSITION}` }}
                    />
                    {/* Animated dash */}
                    <use
                      href={`#sp-${i}`}
                      fill="none"
                      stroke={c.color}
                      strokeWidth={bright ? 2.5 : 1.5}
                      strokeDasharray={c.isRing ? '4 10' : '6 8'}
                      opacity={dimmed ? 0.06 : bright ? 0.9 : (c.isRing ? 0.3 : 0.45)}
                      style={{
                        animation: `dash-flow-${i} ${bright ? (c.dur * 0.55) : c.dur}s linear infinite`,
                        transition: `opacity ${TRANSITION}, stroke-width ${TRANSITION}`,
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
                    {/* Glow halo */}
                    <circle
                      r={bright ? 7 : 4}
                      fill={c.color}
                      opacity={dimmed ? 0.05 : bright ? 0.4 : 0.2}
                      filter="url(#dot-glow)"
                    >
                      <animateMotion dur={`${bright ? c.dur * 0.55 : c.dur}s`} repeatCount="indefinite" begin={`${c.delay}s`}>
                        <mpath href={`#sp-${i}`} />
                      </animateMotion>
                    </circle>
                    {/* Core dot */}
                    <circle
                      r={bright ? 3.5 : (c.isRing ? 2.5 : 3)}
                      fill={c.color}
                      opacity={dimmed ? 0.08 : bright ? 1 : (c.isRing ? 0.7 : 0.85)}
                    >
                      <animateMotion dur={`${bright ? c.dur * 0.55 : c.dur}s`} repeatCount="indefinite" begin={`${c.delay}s`}>
                        <mpath href={`#sp-${i}`} />
                      </animateMotion>
                    </circle>
                  </g>
                );
              })}
            </svg>

            {/* ── Card nodes ── */}
            {/* CRM Hub */}
            <button
              className="sysdiag-card sysdiag-hub"
              onClick={() => toggle(HUB_NODE.id)}
              onMouseEnter={() => setHovered(HUB_NODE.id)}
              onMouseLeave={() => setHovered(null)}
              aria-label={`${HUB_NODE.label}, click for details`}
              style={{
                position: 'absolute',
                left: toLeft(HUB_NODE.x),
                top: toTop(HUB_NODE.y),
                transform: `translate(-50%, -50%)`,
                width: '180px',
                background: '#fff',
                borderRadius: '20px',
                border: `1px solid ${focusId === 'crm' ? '#94D96B40' : '#E8E8E8'}`,
                boxShadow: focusId === 'crm'
                  ? `0 12px 36px rgba(0,0,0,0.08), 0 0 0 1px #94D96B18`
                  : '0 2px 12px rgba(0,0,0,0.04)',
                padding: '20px 16px 16px',
                textAlign: 'center',
                cursor: 'pointer',
                opacity: focusId && focusId !== 'crm' ? 0.4 : 1,
                transition: `all ${TRANSITION}`,
                zIndex: active === 'crm' ? 10 : 3,
                ...scaleUp(inView, 200),
              }}
            >
              {/* Accent bar */}
              <div style={{
                position: 'absolute', top: 0, left: '25%', right: '25%', height: '3px',
                borderRadius: '0 0 4px 4px',
                background: HUB_NODE.color,
                opacity: focusId === 'crm' ? 1 : 0.6,
                transition: `opacity ${TRANSITION}`,
              }} />
              {/* Badge */}
              <div style={{
                width: '38px', height: '38px', borderRadius: '50%', margin: '0 auto 10px',
                background: '#94D96B12', border: '1px solid #94D96B25',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.85rem', fontWeight: 700, color: '#94D96B',
              }}>★</div>
              {/* Label */}
              <div style={{
                fontFamily: 'DM Sans, sans-serif', fontWeight: 700,
                fontSize: '0.92rem', color: '#0A0A0A',
                lineHeight: 1.25, letterSpacing: '-0.01em',
              }}>
                {HUB_NODE.label}
              </div>
              {/* Subtitle */}
              <div style={{
                fontSize: '0.68rem', color: '#94D96B',
                fontWeight: 600, marginTop: '3px',
              }}>
                {HUB_NODE.sub}
              </div>
            </button>

            {/* Outer nodes */}
            {OUTER_NODES.map((node, i) => {
              const isFocused = focusId === node.id;
              const dimmed = focusId && focusId !== node.id;

              return (
                <button
                  key={node.id}
                  className="sysdiag-card"
                  onClick={() => toggle(node.id)}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                  aria-label={`${node.label}, click for details`}
                  style={{
                    position: 'absolute',
                    left: toLeft(node.x),
                    top: toTop(node.y),
                    transform: `translate(-50%, -50%)`,
                    width: '150px',
                    background: '#fff',
                    borderRadius: '18px',
                    border: `1px solid ${isFocused ? node.color + '40' : '#E8E8E8'}`,
                    boxShadow: isFocused
                      ? `0 12px 36px rgba(0,0,0,0.08), 0 0 0 1px ${node.color}18`
                      : '0 2px 12px rgba(0,0,0,0.04)',
                    padding: '16px 14px 14px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    opacity: dimmed ? 0.4 : 1,
                    transition: `all ${TRANSITION}`,
                    zIndex: active === node.id ? 10 : 2,
                    ...scaleUp(inView, stagger(i, 400, 120)),
                  }}
                >
                  {/* Accent bar */}
                  <div style={{
                    position: 'absolute', top: 0, left: '25%', right: '25%', height: '3px',
                    borderRadius: '0 0 4px 4px',
                    background: node.color,
                    opacity: isFocused ? 1 : 0.5,
                    transition: `opacity ${TRANSITION}`,
                  }} />
                  {/* Number badge */}
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '50%', margin: '0 auto 8px',
                    background: node.color + '12', border: `1px solid ${node.color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.72rem', fontWeight: 700, color: node.color,
                  }}>
                    {node.number}
                  </div>
                  {/* Label */}
                  <div style={{
                    fontFamily: 'DM Sans, sans-serif', fontWeight: 700,
                    fontSize: '0.82rem', color: '#0A0A0A',
                    lineHeight: 1.25, letterSpacing: '-0.01em',
                  }}>
                    {node.label}
                  </div>
                  {/* Subtitle */}
                  <div style={{
                    fontSize: '0.65rem', color: node.color,
                    fontWeight: 600, marginTop: '3px',
                  }}>
                    {node.sub}
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
          transition: `opacity ${TRANSITION}, transform ${TRANSITION}`,
          pointerEvents: activeNode ? 'auto' : 'none',
        }}>
          {activeNode && (
            <div className="sysdiag-detail" style={{
              borderRadius: '20px',
              background: `linear-gradient(135deg, ${activeNode.color}0a 0%, #ffffff 60%)`,
              border: `1px solid ${activeNode.color}25`,
              padding: '2.5rem',
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: '2.5rem',
              alignItems: 'start',
              boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                  <span style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: activeNode.color,
                    boxShadow: `0 0 12px ${activeNode.color}`,
                    flexShrink: 0, display: 'block',
                    animation: 'pulse-dot-panel 1.8s ease-in-out infinite',
                  }} />
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: activeNode.color, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    {activeNode.number} · {activeNode.sub}
                  </span>
                </div>
                <h3 style={{
                  fontFamily: 'DM Sans, sans-serif', fontWeight: 800,
                  fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', color: '#0A0A0A',
                  lineHeight: 1.15, marginBottom: '0.875rem',
                }}>
                  {activeNode.label}
                </h3>
                <p style={{ color: '#6B6B6B', lineHeight: '1.75', fontSize: '0.9375rem', maxWidth: '540px' }}>
                  {activeNode.detail}
                </p>
              </div>
              <div style={{ minWidth: '220px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.25rem' }}>
                  {activeNode.bullets.map(b => (
                    <div key={b} style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '8px 14px', borderRadius: '8px',
                      background: `${activeNode.color}08`,
                      border: `1px solid ${activeNode.color}15`,
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: activeNode.color, flexShrink: 0 }} />
                      <span style={{ fontSize: '0.8rem', color: '#444', fontWeight: 500 }}>{b}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link href="/contact" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    background: activeNode.color, color: '#fff',
                    padding: '9px 18px', borderRadius: '100px',
                    fontWeight: 700, fontSize: '0.8rem', textDecoration: 'none', flexShrink: 0,
                  }}>
                    Learn more <ArrowRight size={13} />
                  </Link>
                  <button
                    onClick={() => setActive(null)}
                    style={{
                      background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)',
                      color: '#6B6B6B', borderRadius: '100px',
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

        {/* Hint */}
        <div style={{
          textAlign: 'center', marginTop: '1.5rem',
          opacity: activeNode ? 0 : 0.5,
          transition: `opacity 0.35s ease`,
          fontSize: '0.78rem', color: '#6B6B6B',
          letterSpacing: '0.05em', pointerEvents: 'none',
          ...fadeUp(inView, 1100),
        }}>
          ↑ click any node above to explore
        </div>
      </div>

      <style>{`
        ${CONNECTIONS.map((_c, i) => `
          @keyframes dash-flow-${i} {
            to { stroke-dashoffset: -15; }
          }
        `).join('')}

        @keyframes pulse-dot-panel {
          0%, 100% { box-shadow: 0 0 6px currentColor; }
          50% { box-shadow: 0 0 16px currentColor, 0 0 28px currentColor; }
        }

        .sysdiag-card {
          font-family: inherit;
        }
        .sysdiag-card:hover {
          transform: translate(-50%, -50%) translateY(-6px) !important;
          box-shadow: 0 16px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04) !important;
        }

        @media (max-width: 768px) {
          .sysdiag-svg { display: none !important; }
          .sysdiag-diagram {
            padding-bottom: 0 !important;
          }
          .sysdiag-card {
            position: relative !important;
            left: auto !important;
            top: auto !important;
            transform: none !important;
            width: 100% !important;
            margin-bottom: 12px;
          }
          .sysdiag-card:hover {
            transform: translateY(-4px) !important;
          }
          .sysdiag-hub { order: -1; }
          .sysdiag-diagram > div {
            display: flex;
            flex-direction: column;
            gap: 12px;
            position: relative !important;
          }
          .sysdiag-detail {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
