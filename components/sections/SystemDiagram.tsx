'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';

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
  highlight: string;    // bright highlight for gradient
  darkColor: string;    // dark edge for gradient
  ringColor: string;    // ring stripe color
  x: number;
  y: number;
  r: number;            // SVG radius
  ringRx: number;       // ring ellipse x-radius
  ringRy: number;       // ring ellipse y-radius
  ringTilt: number;     // ring tilt in degrees
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
    highlight: '#e4ffd0',
    darkColor: '#1a4009',
    ringColor: '#a8e87a',
    x: 500, y: 330, r: 52,
    ringRx: 100, ringRy: 20,
    ringTilt: 0,
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
    highlight: '#ffd8d4',
    darkColor: '#3d0909',
    ringColor: '#ff9e9c',
    x: 500, y: 52, r: 34,
    ringRx: 62, ringRy: 12,
    ringTilt: -8,
  },
  {
    id: 'seo',
    number: '02',
    label: 'SEO / Organic',
    sub: 'Local Dominance',
    detail: 'Long-term organic visibility that compounds month over month, so homeowners in your market find you on Google before they ever see your competitors.',
    bullets: ['Local SEO audit & strategy', 'Google Business optimization', 'Review generation system', 'Keyword & content planning'],
    color: '#6B8EFE',
    highlight: '#d0daff',
    darkColor: '#09093d',
    ringColor: '#9aaeff',
    x: 878, y: 185, r: 34,
    ringRx: 62, ringRy: 12,
    ringTilt: 25,
  },
  {
    id: 'software',
    number: '03',
    label: 'Sales Software',
    sub: 'Quoting + Pitch App',
    detail: 'Two proprietary tools built exclusively for home service trades. Quote on-site, present professionally on iPad, collect e-signatures, and sync every job back to your CRM automatically.',
    bullets: ['On-site quoting tool', 'Custom iPad presentation', 'E-signature close', 'Job pipeline sync'],
    color: '#4FC3F7',
    highlight: '#ccf4ff',
    darkColor: '#083a4d',
    ringColor: '#86d8fc',
    x: 800, y: 515, r: 34,
    ringRx: 62, ringRy: 12,
    ringTilt: -20,
  },
  {
    id: 'automation',
    number: '04',
    label: 'Automation',
    sub: 'Follow-up + Rehash',
    detail: 'Our automation engine runs 24/7, following up on cold quotes, re-engaging old leads through the rehash engine, requesting reviews, and firing appointment reminders. Zero team effort.',
    bullets: ['Quote follow-up sequences', 'Rehash engine (old leads)', 'Review request automation', 'Appointment reminders'],
    color: '#FEB64A',
    highlight: '#ffeacc',
    darkColor: '#3d2309',
    ringColor: '#ffd28a',
    x: 200, y: 515, r: 34,
    ringRx: 62, ringRy: 12,
    ringTilt: 20,
  },
  {
    id: 'training',
    number: '05',
    label: 'Sales Training',
    sub: 'In-Home Closing',
    detail: 'We train your reps in the field, scripts, objection handling, Good/Better/Best pricing presentations, and how to close at the kitchen table every time. Paired with our tools for maximum close rate.',
    bullets: ['In-home sales scripts', 'Objection handling', 'Good/Better/Best pricing', 'Field performance tracking'],
    color: '#FF8B89',
    highlight: '#ffd4d2',
    darkColor: '#3d0910',
    ringColor: '#ffb8b6',
    x: 122, y: 185, r: 34,
    ringRx: 62, ringRy: 12,
    ringTilt: -25,
  },
];

interface Conn {
  from: NodeId;
  to: NodeId;
  color: string;
  dur: number;
  delay: number;
  d: string;
  isRing?: boolean;   // outer pentagon connection (dimmer)
}

/* Hub spokes — data flows into CRM */
const HUB_CONNECTIONS: Conn[] = [
  { from: 'leads',      to: 'crm', color: '#FE6462', dur: 2.2, delay: 0.0, d: 'M 500,52 Q 558,195 500,330' },
  { from: 'seo',        to: 'crm', color: '#6B8EFE', dur: 2.5, delay: 0.5, d: 'M 878,185 Q 680,215 500,330' },
  { from: 'software',   to: 'crm', color: '#4FC3F7', dur: 2.4, delay: 1.0, d: 'M 800,515 Q 680,380 500,330' },
  { from: 'automation', to: 'crm', color: '#FEB64A', dur: 2.4, delay: 1.5, d: 'M 200,515 Q 320,380 500,330' },
  { from: 'training',   to: 'crm', color: '#FF8B89', dur: 2.5, delay: 2.0, d: 'M 122,185 Q 320,215 500,330' },
];

/* Pentagon ring — peer connections between outer nodes */
const RING_CONNECTIONS: Conn[] = [
  { from: 'leads',      to: 'seo',        color: '#A878E0', dur: 3.5, delay: 0.4, d: 'M 500,52 Q 760,10 878,185',        isRing: true },
  { from: 'seo',        to: 'software',   color: '#6B8EFE', dur: 3.8, delay: 1.1, d: 'M 878,185 Q 980,355 800,515',       isRing: true },
  { from: 'software',   to: 'automation', color: '#4FC3F7', dur: 3.6, delay: 0.7, d: 'M 800,515 Q 500,625 200,515',       isRing: true },
  { from: 'automation', to: 'training',   color: '#FEB64A', dur: 3.9, delay: 1.5, d: 'M 200,515 Q 20,355 122,185',        isRing: true },
  { from: 'training',   to: 'leads',      color: '#FF8B89', dur: 3.4, delay: 0.9, d: 'M 122,185 Q 240,10 500,52',         isRing: true },
];

const CONNECTIONS: Conn[] = [...HUB_CONNECTIONS, ...RING_CONNECTIONS];

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
    <section style={{ padding: '100px 0 120px', background: '#F5F5F5', overflow: 'hidden', position: 'relative' }}>
      {/* Light dot pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.045) 1px, transparent 1px)',
        backgroundSize: '24px 24px', pointerEvents: 'none', zIndex: 0,
      }} />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
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
            You can&apos;t scale without{' '}
            <span style={{
              background: 'linear-gradient(118deg, #FE6462, #FEB64A)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>all of this.</span>
          </h2>
          <p style={{ color: '#6B6B6B', maxWidth: '520px', margin: '0 auto', lineHeight: '1.75', fontSize: '0.9375rem' }}>
            Every node feeds the center. Every system talks to every other.{' '}
            <span style={{ color: '#0A0A0A', fontWeight: 600 }}>Click any planet to explore.</span>
          </p>
        </div>

        {/* ── Diagram ── */}
        <div style={{ position: 'relative', width: '100%', paddingBottom: `${(H / W) * 100}%` }}>
          <div style={{ position: 'absolute', inset: 0 }}>

            {/* SVG layer — connections + planet visuals */}
            <svg
              viewBox={`0 0 ${W} ${H}`}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Connection path defs */}
                {CONNECTIONS.map((c, i) => (
                  <path key={i} id={`sp-${i}`} d={c.d} />
                ))}

                {/* Planet radial gradients */}
                {NODES.map(n => (
                  <radialGradient key={n.id} id={`pg-${n.id}`} cx="36%" cy="28%" r="72%" fx="36%" fy="28%">
                    <stop offset="0%"   stopColor={n.highlight}  stopOpacity="0.9" />
                    <stop offset="28%"  stopColor={n.color}      stopOpacity="1" />
                    <stop offset="80%"  stopColor={n.darkColor}  stopOpacity="1" />
                    <stop offset="100%" stopColor={n.darkColor}  stopOpacity="1" />
                  </radialGradient>
                ))}

                {/* Second band gradient for surface detail */}
                {NODES.map(n => (
                  <radialGradient key={n.id} id={`ps-${n.id}`} cx="60%" cy="65%" r="55%">
                    <stop offset="0%"   stopColor={n.darkColor} stopOpacity="0.5" />
                    <stop offset="100%" stopColor={n.darkColor} stopOpacity="0" />
                  </radialGradient>
                ))}

                {/* Ring half-clip paths */}
                {NODES.map(n => (
                  <g key={n.id}>
                    <clipPath id={`ring-back-${n.id}`}>
                      <rect x={n.x - 200} y={n.y - 200} width="400" height="200" />
                    </clipPath>
                    <clipPath id={`ring-front-${n.id}`}>
                      <rect x={n.x - 200} y={n.y} width="400" height="200" />
                    </clipPath>
                  </g>
                ))}

                {/* Glow filters */}
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="glow-strong">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="planet-shadow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* ── Radar pulses on CRM hub ── */}
              {[0, 0.8, 1.6].map((d, i) => (
                <circle key={i} cx={500} cy={330} r="2" fill="none" stroke="#94D96B" strokeWidth="1">
                  <animate attributeName="r"       values="55;150" dur="2.4s" begin={`${d}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.35;0" dur="2.4s" begin={`${d}s`} repeatCount="indefinite" />
                </circle>
              ))}

              {/* ── Connection lines ── */}
              {CONNECTIONS.map((c, i) => {
                const dimmed = focusId && !isConnected(c, focusId);
                const bright = focusId && isConnected(c, focusId);
                const baseOpacity = c.isRing ? 0.08 : 0.12;
                const dashOpacity = c.isRing ? 0.25 : 0.35;
                return (
                  <g key={i}>
                    {/* Glow line */}
                    <use
                      href={`#sp-${i}`}
                      fill="none"
                      stroke={c.color}
                      strokeWidth={bright ? 5 : c.isRing ? 1.5 : 2}
                      opacity={dimmed ? 0.04 : bright ? 0.25 : baseOpacity}
                      filter={bright ? 'url(#glow)' : undefined}
                      style={{ transition: 'opacity 0.4s ease, stroke-width 0.4s ease' }}
                    />
                    {/* Animated dash */}
                    <use
                      href={`#sp-${i}`}
                      fill="none"
                      stroke={c.color}
                      strokeWidth={bright ? 2 : 1}
                      strokeDasharray={c.isRing ? '4 12' : '6 9'}
                      opacity={dimmed ? 0.06 : bright ? 0.9 : dashOpacity}
                      style={{
                        animation: `dash-flow-${i} ${bright ? (c.dur * 0.55) : c.dur}s linear infinite`,
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
                const baseR = c.isRing ? 2.5 : 3;
                return (
                  <g key={i}>
                    <circle
                      r={bright ? 7 : baseR + 2}
                      fill={c.color}
                      opacity={dimmed ? 0.06 : bright ? 0.35 : 0.15}
                      filter="url(#glow)"
                    >
                      <animateMotion dur={`${bright ? c.dur * 0.55 : c.dur}s`} repeatCount="indefinite" begin={`${c.delay}s`}>
                        <mpath href={`#sp-${i}`} />
                      </animateMotion>
                    </circle>
                    <circle
                      r={bright ? 4.5 : baseR}
                      fill={c.color}
                      opacity={dimmed ? 0.08 : bright ? 1 : (c.isRing ? 0.6 : 0.8)}
                      filter={bright ? 'url(#glow)' : undefined}
                    >
                      <animateMotion dur={`${bright ? c.dur * 0.55 : c.dur}s`} repeatCount="indefinite" begin={`${c.delay}s`}>
                        <mpath href={`#sp-${i}`} />
                      </animateMotion>
                    </circle>
                  </g>
                );
              })}

              {/* ── Planets (atmosphere → ring-back → body → ring-front → highlight) ── */}
              {NODES.map(node => {
                const isFocus = focusId === node.id;
                const r = node.r;
                const rx = node.ringRx;
                const ry = node.ringRy;
                const tx = node.x;
                const ty = node.y;
                const tilt = node.ringTilt;
                const glowScale = isFocus ? 1.4 : 1;

                return (
                  <g key={node.id} style={{ transition: 'opacity 0.35s ease' }}
                    opacity={focusId && focusId !== node.id ? 0.38 : 1}
                  >
                    {/* Outer atmospheric haze */}
                    <circle cx={tx} cy={ty} r={r * 2.6 * glowScale} fill={node.color} opacity={isFocus ? 0.14 : 0.06} filter="url(#glow-strong)" style={{ transition: 'all 0.35s ease' }} />

                    {/* Mid glow */}
                    <circle cx={tx} cy={ty} r={r * 1.7} fill={node.color} opacity={isFocus ? 0.22 : 0.1} filter="url(#glow)" style={{ transition: 'all 0.35s ease' }} />

                    {/* Ring back half (behind planet) */}
                    <g transform={`rotate(${tilt}, ${tx}, ${ty})`}>
                      <ellipse cx={tx} cy={ty} rx={rx} ry={ry}
                        stroke={node.ringColor} strokeWidth={node.isHub ? 2 : 1.5}
                        fill="none" opacity={isFocus ? 0.45 : 0.25}
                        clipPath={`url(#ring-back-${node.id})`}
                        style={{ transition: 'opacity 0.35s ease' }}
                      />
                      {node.isHub && (
                        <ellipse cx={tx} cy={ty} rx={rx * 1.35} ry={ry * 1.4}
                          stroke={node.ringColor} strokeWidth="1"
                          fill="none" opacity={isFocus ? 0.3 : 0.15}
                          clipPath={`url(#ring-back-${node.id})`}
                          style={{ transition: 'opacity 0.35s ease' }}
                        />
                      )}
                    </g>

                    {/* Planet body — base gradient */}
                    <circle cx={tx} cy={ty} r={r}
                      fill={`url(#pg-${node.id})`}
                      style={{ transition: 'r 0.35s ease' }}
                    />

                    {/* Surface shadow band (dark side) */}
                    <circle cx={tx} cy={ty} r={r}
                      fill={`url(#ps-${node.id})`}
                      style={{ transition: 'r 0.35s ease' }}
                    />

                    {/* Limb darkening ring */}
                    <circle cx={tx} cy={ty} r={r}
                      fill="none"
                      stroke={node.darkColor}
                      strokeWidth={r * 0.22}
                      opacity="0.55"
                      style={{ transition: 'r 0.35s ease' }}
                    />

                    {/* Specular highlight (top-left) */}
                    <ellipse
                      cx={tx - r * 0.25} cy={ty - r * 0.28}
                      rx={r * 0.38} ry={r * 0.28}
                      fill="white" opacity="0.18"
                    />
                    <circle
                      cx={tx - r * 0.3} cy={ty - r * 0.32}
                      r={r * 0.14}
                      fill="white" opacity="0.35"
                    />

                    {/* Ring front half (in front of planet) */}
                    <g transform={`rotate(${tilt}, ${tx}, ${ty})`}>
                      <ellipse cx={tx} cy={ty} rx={rx} ry={ry}
                        stroke={node.ringColor} strokeWidth={node.isHub ? 2.5 : 2}
                        fill="none" opacity={isFocus ? 0.75 : 0.5}
                        clipPath={`url(#ring-front-${node.id})`}
                        style={{ transition: 'opacity 0.35s ease' }}
                      />
                      {node.isHub && (
                        <ellipse cx={tx} cy={ty} rx={rx * 1.35} ry={ry * 1.4}
                          stroke={node.ringColor} strokeWidth="1.5"
                          fill="none" opacity={isFocus ? 0.45 : 0.25}
                          clipPath={`url(#ring-front-${node.id})`}
                          style={{ transition: 'opacity 0.35s ease' }}
                        />
                      )}
                    </g>

                    {/* Active ring pulse */}
                    {isFocus && (
                      <>
                        <circle cx={tx} cy={ty} r={r + 4} fill="none" stroke={node.color} strokeWidth="1.5" opacity="0.4">
                          <animate attributeName="r" values={`${r + 4};${r + 26}`} dur="1.4s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.4;0" dur="1.4s" repeatCount="indefinite" />
                        </circle>
                        <circle cx={tx} cy={ty} r={r + 4} fill="none" stroke={node.color} strokeWidth="1" opacity="0.25">
                          <animate attributeName="r" values={`${r + 4};${r + 26}`} dur="1.4s" begin="0.5s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.25;0" dur="1.4s" begin="0.5s" repeatCount="indefinite" />
                        </circle>
                      </>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* ── HTML node buttons + labels ── */}
            {NODES.map(node => {
              const isActiveNode = active === node.id;
              const isHoveredNode = hovered === node.id;
              const dimmed = focusId && focusId !== node.id;
              const btnSize = node.isHub ? 116 : 80;

              return (
                <button
                  key={node.id}
                  onClick={() => toggle(node.id)}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                  aria-label={`${node.label} — click for details`}
                  style={{
                    position: 'absolute',
                    left: toLeft(node.x),
                    top: toTop(node.y),
                    transform: `translate(-50%, -50%) scale(${isActiveNode || isHoveredNode ? 1.1 : 1})`,
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease',
                    opacity: dimmed ? 0.38 : 1,
                    zIndex: isActiveNode ? 10 : 2,
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                  }}
                >
                  {/* Transparent circle hitbox */}
                  <div style={{ width: `${btnSize}px`, height: `${btnSize}px`, borderRadius: '50%' }} />

                  {/* Label below planet */}
                  <div style={{
                    marginTop: '6px',
                    textAlign: 'center',
                    pointerEvents: 'none',
                  }}>
                    <div style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontWeight: 700,
                      fontSize: node.isHub ? '0.88rem' : '0.76rem',
                      color: isActiveNode || isHoveredNode ? '#0A0A0A' : '#333',
                      lineHeight: 1.25,
                      letterSpacing: '-0.01em',
                      transition: 'color 0.2s ease',
                      whiteSpace: 'nowrap',
                    }}>
                      {node.label}
                    </div>
                    <div style={{
                      fontSize: node.isHub ? '0.68rem' : '0.62rem',
                      color: node.color,
                      fontWeight: 600,
                      marginTop: '2px',
                      transition: 'color 0.2s ease',
                      whiteSpace: 'nowrap',
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
          transition: 'opacity 0.35s ease',
          fontSize: '0.78rem', color: '#6B6B6B',
          letterSpacing: '0.05em', pointerEvents: 'none',
        }}>
          ↑ click any planet above to explore
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

        @media (max-width: 768px) {
          .sysdiag-mobile-hide { display: none !important; }
        }
      `}</style>
    </section>
  );
}
