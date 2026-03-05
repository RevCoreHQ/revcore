'use client';
import { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface SEOCheck {
  id: string;
  category: 'technical' | 'content' | 'images' | 'social' | 'local';
  title: string;
  status: 'pass' | 'warning' | 'fail';
  current: string;
  recommendation: string;
  impact: 'high' | 'medium' | 'low';
  why: string;
}
interface SEOReport {
  url: string;
  score: number;
  wordCount: number;
  checks: SEOCheck[];
  summary: { pass: number; warning: number; fail: number };
}

// ─── Constants ────────────────────────────────────────────────────────────────
const ACCENT  = '#FE6462';
const GREEN   = '#94D96B';
const BLUE    = '#6B8EFE';
const YELLOW  = '#FEB64A';
const w = (a: number) => `rgba(255,255,255,${a})`;

const STATUS_COLOR = { pass: GREEN, warning: YELLOW, fail: ACCENT };
const STATUS_LABEL = { pass: 'PASS', warning: 'WARNING', fail: 'ISSUE' };
const STATUS_ICON  = { pass: '✓', warning: '!', fail: '✕' };
const IMPACT_COLOR = { high: ACCENT, medium: YELLOW, low: w(0.35) };
const CAT_LABELS   = { technical: 'Technical', content: 'Content', images: 'Images', social: 'Social & Schema', local: 'Local SEO' };

const categories = ['all', 'technical', 'content', 'images', 'local', 'social'] as const;

// ─── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const r = 54, circ = 2 * Math.PI * r;
  const color = score >= 75 ? GREEN : score >= 50 ? YELLOW : ACCENT;
  const dash = (score / 100) * circ;
  return (
    <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
      <svg width={140} height={140} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={70} cy={70} r={r} fill="none" stroke={w(0.06)} strokeWidth={10} />
        <circle
          cx={70} cy={70} r={r} fill="none"
          stroke={color} strokeWidth={10}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${color}80)`, transition: 'stroke-dasharray 1s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontFamily: 'DM Sans', fontWeight: 800, fontSize: '2rem', color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: '0.6rem', color: w(0.4), letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 3 }}>/ 100</span>
      </div>
    </div>
  );
}

// ─── Check Card ───────────────────────────────────────────────────────────────
function CheckCard({ check, expanded, onToggle }: { check: SEOCheck; expanded: boolean; onToggle: () => void }) {
  const sc = STATUS_COLOR[check.status];
  return (
    <div
      onClick={onToggle}
      style={{
        borderRadius: 12, border: `1px solid ${expanded ? sc + '40' : w(0.06)}`,
        background: expanded ? `${sc}08` : w(0.02),
        cursor: 'pointer', overflow: 'hidden',
        transition: 'border-color 0.2s, background 0.2s',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px' }}>
        {/* Status dot */}
        <div style={{
          width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
          background: `${sc}18`, border: `1.5px solid ${sc}60`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.75rem', fontWeight: 800, color: sc,
        }}>
          {STATUS_ICON[check.status]}
        </div>

        {/* Title + current */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <span style={{ fontFamily: 'DM Sans', fontWeight: 700, fontSize: '0.82rem', color: w(0.88) }}>
              {check.title}
            </span>
            <span style={{
              fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em', padding: '1px 7px',
              borderRadius: 100, background: `${sc}18`, color: sc, textTransform: 'uppercase',
            }}>
              {STATUS_LABEL[check.status]}
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: w(0.38), margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {check.current}
          </p>
        </div>

        {/* Impact badge */}
        <span style={{
          fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.07em', padding: '2px 8px',
          borderRadius: 100, border: `1px solid ${IMPACT_COLOR[check.impact]}40`,
          color: IMPACT_COLOR[check.impact], textTransform: 'uppercase', flexShrink: 0,
        }}>
          {check.impact} impact
        </span>

        {/* Chevron */}
        <svg width={14} height={14} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <path d="M3 5l4 4 4-4" stroke={w(0.3)} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Expanded content */}
      <div style={{
        maxHeight: expanded ? '300px' : '0px',
        overflow: 'hidden',
        transition: 'max-height 0.3s ease',
      }}>
        <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${w(0.05)}` }}>
          <div style={{ paddingTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, color: GREEN, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
                Recommendation
              </p>
              <p style={{ fontSize: '0.78rem', color: w(0.65), lineHeight: 1.7, margin: 0 }}>
                {check.recommendation}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, color: BLUE, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
                Why it matters
              </p>
              <p style={{ fontSize: '0.78rem', color: w(0.55), lineHeight: 1.7, margin: 0 }}>
                {check.why}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SEOChecker() {
  const [url, setUrl]           = useState('');
  const [loading, setLoading]   = useState(false);
  const [report, setReport]     = useState<SEOReport | null>(null);
  const [error, setError]       = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter]     = useState<typeof categories[number]>('all');

  async function run() {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setReport(null);
    setExpanded(null);
    try {
      const res = await fetch('/api/seo-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setReport(data);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const filtered = report
    ? filter === 'all' ? report.checks : report.checks.filter(c => c.category === filter)
    : [];

  const issues = report ? report.checks.filter(c => c.status === 'fail') : [];
  const warnings = report ? report.checks.filter(c => c.status === 'warning') : [];

  const scoreColor = report
    ? report.score >= 75 ? GREEN : report.score >= 50 ? YELLOW : ACCENT
    : ACCENT;

  return (
    <div style={{
      background: '#0d1117', borderRadius: 20,
      border: `1px solid ${w(0.07)}`, overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 28px', background: '#111820',
        borderBottom: `1px solid ${w(0.06)}`,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: GREEN, animation: 'pulse-dot 2s ease-in-out infinite' }} />
        <span style={{ fontFamily: 'DM Sans', fontWeight: 800, fontSize: '0.95rem', color: 'white' }}>
          RevCore SEO Analyser
        </span>
        <span style={{ fontSize: '0.68rem', color: w(0.35), background: w(0.05), padding: '2px 10px', borderRadius: 100, marginLeft: 4 }}>
          Powered by RevCore — for client analysis
        </span>
      </div>

      {/* Input */}
      <div style={{ padding: '24px 28px', borderBottom: `1px solid ${w(0.06)}` }}>
        <p style={{ fontSize: '0.75rem', color: w(0.4), marginBottom: 10, letterSpacing: '0.04em' }}>
          Enter a client&apos;s website URL to get a full SEO audit with actionable recommendations
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && run()}
            placeholder="https://clientwebsite.com"
            style={{
              flex: 1, background: w(0.04), border: `1px solid ${w(0.1)}`,
              borderRadius: 10, padding: '11px 16px',
              color: 'white', fontSize: '0.88rem',
              outline: 'none', fontFamily: 'DM Sans, sans-serif',
            }}
          />
          <button
            onClick={run}
            disabled={loading || !url.trim()}
            style={{
              background: loading ? w(0.06) : ACCENT,
              border: 'none', borderRadius: 10,
              color: loading ? w(0.3) : 'white',
              fontFamily: 'DM Sans', fontWeight: 700, fontSize: '0.85rem',
              padding: '11px 24px', cursor: loading ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            {loading ? (
              <>
                <span style={{ display: 'inline-block', width: 14, height: 14, border: `2px solid ${w(0.15)}`, borderTopColor: w(0.5), borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                Analysing…
              </>
            ) : 'Run SEO Audit'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: '16px 28px', background: `${ACCENT}10`, borderBottom: `1px solid ${ACCENT}30` }}>
          <p style={{ color: ACCENT, fontSize: '0.83rem', margin: 0 }}>
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ padding: '48px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 40, height: 40, border: `3px solid ${w(0.08)}`, borderTopColor: ACCENT, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: w(0.45), fontSize: '0.83rem', margin: 0 }}>Fetching and analysing {url}…</p>
        </div>
      )}

      {/* Results */}
      {report && !loading && (
        <div>
          {/* Score bar */}
          <div style={{ padding: '28px 28px 0', display: 'flex', gap: 28, alignItems: 'center', borderBottom: `1px solid ${w(0.06)}`, paddingBottom: 28 }}>
            <ScoreRing score={report.score} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.65rem', color: w(0.35), letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                SEO Health Score — {report.url}
              </p>
              <h3 style={{ fontFamily: 'DM Sans', fontWeight: 800, fontSize: '1.3rem', color: scoreColor, margin: '0 0 12px', lineHeight: 1.1 }}>
                {report.score >= 80 ? 'Strong Foundation' : report.score >= 60 ? 'Room to Grow' : report.score >= 40 ? 'Significant Issues' : 'Critical Problems Found'}
              </h3>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { label: `${report.summary.pass} Passing`, color: GREEN },
                  { label: `${report.summary.warning} Warnings`, color: YELLOW },
                  { label: `${report.summary.fail} Issues`, color: ACCENT },
                ].map(b => (
                  <div key={b.label} style={{
                    padding: '5px 14px', borderRadius: 100,
                    background: `${b.color}15`, border: `1px solid ${b.color}40`,
                    fontSize: '0.72rem', fontWeight: 700, color: b.color,
                  }}>
                    {b.label}
                  </div>
                ))}
              </div>

              {/* Quick wins callout */}
              {issues.length > 0 && (
                <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 10, background: `${ACCENT}10`, border: `1px solid ${ACCENT}25` }}>
                  <p style={{ fontSize: '0.72rem', color: ACCENT, margin: 0, fontWeight: 600 }}>
                    {issues.length} critical issue{issues.length > 1 ? 's' : ''} found:&nbsp;
                    <span style={{ fontWeight: 400, color: w(0.55) }}>
                      {issues.slice(0, 3).map(c => c.title).join(' · ')}{issues.length > 3 ? ` +${issues.length - 3} more` : ''}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Category filter */}
          <div style={{ display: 'flex', gap: 6, padding: '16px 28px', borderBottom: `1px solid ${w(0.05)}`, overflowX: 'auto' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  background: filter === cat ? w(0.1) : 'transparent',
                  border: `1px solid ${filter === cat ? w(0.15) : w(0.07)}`,
                  borderRadius: 8, color: filter === cat ? 'white' : w(0.45),
                  fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.72rem',
                  padding: '5px 14px', cursor: 'pointer', whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                }}
              >
                {cat === 'all' ? 'All Checks' : CAT_LABELS[cat as keyof typeof CAT_LABELS]}
                {cat !== 'all' && (
                  <span style={{ marginLeft: 6, opacity: 0.5 }}>
                    {report.checks.filter(c => c.category === cat).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Checks list */}
          <div style={{ padding: '16px 28px 28px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Issues first, then warnings, then passes */}
            {[...filtered.filter(c => c.status === 'fail'), ...filtered.filter(c => c.status === 'warning'), ...filtered.filter(c => c.status === 'pass')].map(check => (
              <CheckCard
                key={check.id}
                check={check}
                expanded={expanded === check.id}
                onToggle={() => setExpanded(expanded === check.id ? null : check.id)}
              />
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.7); }
        }
      `}</style>
    </div>
  );
}
