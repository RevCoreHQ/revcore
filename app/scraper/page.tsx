'use client';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import SpaceBackground from '@/components/SpaceBackground';

/* ─────────── Types ─────────── */
interface ScrapedBusiness {
  businessName: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  city: string;
  state: string;
  rating: number;
  reviews: number;
  category: string;
  placeId: string;
  googleUrl: string;
  lat: number;
  lng: number;
  claimStatus: string;
  permanentlyClosed: boolean;
  openingHours: Record<string, string> | null;
  additionalInfo: Record<string, unknown> | null;
}

interface ScrapeHistoryEntry {
  id: string;
  query: string;
  location: string;
  date: string;
  count: number;
  results: ScrapedBusiness[];
}

type SortField = 'businessName' | 'phone' | 'email' | 'website' | 'city' | 'state' | 'rating' | 'reviews' | 'category';
type SortDir = 'asc' | 'desc';
type ExportFormat = 'csv' | 'json' | 'excel';
type ViewMode = 'table' | 'cards';

/* ─────────── Constants ─────────── */
const TRADES = [
  'Roofers', 'HVAC Contractors', 'Plumbers', 'Electricians', 'General Contractors',
  'Painters', 'Landscapers', 'Concrete Contractors', 'Fencing Contractors', 'Flooring Contractors',
  'Kitchen Remodelers', 'Bathroom Remodelers', 'Home Remodelers', 'Window Installers', 'Door Installers',
  'Siding Contractors', 'Gutter Installers', 'Deck Builders', 'Patio Builders', 'Pool Builders',
  'Solar Installers', 'Insulation Contractors', 'Drywall Contractors', 'Foundation Repair',
  'Waterproofing Contractors', 'Tree Services', 'Pest Control', 'Garage Door Services',
  'Pressure Washing', 'Chimney Services', 'Septic Services', 'Well Drilling', 'Excavation Contractors',
  'Masonry Contractors', 'Tile Contractors', 'Cabinet Makers', 'Countertop Installers',
  'Hardwood Floor Installers', 'Carpet Installers', 'Stucco Contractors', 'Iron Work',
  'Glass & Mirror', 'Awning Installers', 'Carpenters', 'Demolition Contractors',
];

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida',
  'Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine',
  'Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska',
  'Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota',
  'Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming',
];

const TABLE_COLS: { key: SortField; label: string; w: string }[] = [
  { key: 'businessName', label: 'Business Name', w: '22%' },
  { key: 'phone', label: 'Phone', w: '12%' },
  { key: 'email', label: 'Email', w: '16%' },
  { key: 'website', label: 'Website', w: '14%' },
  { key: 'city', label: 'City', w: '10%' },
  { key: 'state', label: 'State', w: '6%' },
  { key: 'rating', label: 'Rating', w: '7%' },
  { key: 'reviews', label: 'Reviews', w: '7%' },
  { key: 'category', label: 'Category', w: '6%' },
];

/* ─────────── Styles ─────────── */
const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px',
  backdropFilter: 'blur(20px)',
};

const inp: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '10px',
  color: '#fff',
  fontSize: '0.9rem',
  fontFamily: 'DM Sans, sans-serif',
  outline: 'none',
  transition: 'border 0.2s, box-shadow 0.2s',
};

const lbl: React.CSSProperties = {
  display: 'block',
  marginBottom: '6px',
  fontSize: '0.78rem',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.5)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  fontFamily: 'DM Sans, sans-serif',
};

const btn = (variant: 'primary' | 'secondary' | 'ghost' = 'primary'): React.CSSProperties => ({
  padding: variant === 'ghost' ? '8px 14px' : '12px 24px',
  borderRadius: '10px',
  border: variant === 'primary' ? 'none' : '1px solid rgba(255,255,255,0.15)',
  background: variant === 'primary' ? 'linear-gradient(135deg, #FE6462 0%, #ff4a48 100%)'
    : variant === 'secondary' ? 'rgba(255,255,255,0.06)' : 'transparent',
  color: '#fff',
  fontSize: variant === 'ghost' ? '0.8rem' : '0.9rem',
  fontWeight: 600,
  fontFamily: 'DM Sans, sans-serif',
  cursor: 'pointer',
  transition: 'all 0.2s',
  whiteSpace: 'nowrap',
});

const thStyle: React.CSSProperties = {
  padding: '12px 14px',
  textAlign: 'left',
  fontSize: '0.75rem',
  fontWeight: 700,
  color: 'rgba(255,255,255,0.45)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
  cursor: 'pointer',
  userSelect: 'none',
  fontFamily: 'DM Sans, sans-serif',
  whiteSpace: 'nowrap',
};

const tdStyle: React.CSSProperties = {
  padding: '11px 14px',
  fontSize: '0.85rem',
  color: 'rgba(255,255,255,0.8)',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
  fontFamily: 'DM Sans, sans-serif',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const badge = (color: string): React.CSSProperties => ({
  display: 'inline-block',
  padding: '3px 10px',
  borderRadius: '100px',
  fontSize: '0.72rem',
  fontWeight: 600,
  background: `${color}18`,
  color,
  fontFamily: 'DM Sans, sans-serif',
});

/* ─────────── Helpers ─────────── */
const uid = () => Math.random().toString(36).slice(2, 10);

function useAnimatedCount(target: number, duration = 1200): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) { setVal(0); return; }
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return val;
}

function loadHistory(): ScrapeHistoryEntry[] {
  try { return JSON.parse(localStorage.getItem('rcScraperHistory') || '[]'); } catch { return []; }
}
function saveHistory(h: ScrapeHistoryEntry[]) {
  localStorage.setItem('rcScraperHistory', JSON.stringify(h.slice(0, 20)));
}

/* ─────────── KPI Card ─────────── */
function KpiCard({ label, value, icon, color = '#FE6462' }: { label: string; value: string | number; icon: string; color?: string }) {
  const numVal = typeof value === 'number' ? value : parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
  const animated = useAnimatedCount(numVal);
  const display = typeof value === 'number' ? animated.toLocaleString()
    : value.startsWith('$') ? '$' + animated.toLocaleString()
    : value.includes('%') ? animated + '%'
    : value.includes('.') ? (animated / 10).toFixed(1)
    : animated.toLocaleString();

  return (
    <div style={{
      ...glass,
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flex: '1 1 160px',
      minWidth: '160px',
    }}>
      <div style={{
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        background: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.3rem',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.1 }}>
          {display}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'DM Sans, sans-serif', marginTop: '2px' }}>
          {label}
        </div>
      </div>
    </div>
  );
}

/* ─────────── Detail Panel ─────────── */
function DetailPanel({ biz, onClose }: { biz: ScrapedBusiness; onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '480px',
      maxWidth: '100vw',
      background: 'rgba(7,11,15,0.98)',
      borderLeft: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(30px)',
      zIndex: 1100,
      overflowY: 'auto',
      padding: '0',
      fontFamily: 'DM Sans, sans-serif',
      animation: 'slideInRight 0.3s ease',
    }}>
      <div style={{
        padding: '24px 28px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
            {biz.businessName}
          </h2>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>
            {biz.category}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: '#fff',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          &times;
        </button>
      </div>

      <div style={{ padding: '24px 28px' }}>
        {/* Rating */}
        <div style={{ ...glass, padding: '18px 20px', marginBottom: '16px', display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#FE6462' }}>
              {biz.rating > 0 ? biz.rating.toFixed(1) : '—'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Rating</div>
          </div>
          <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fff' }}>
              {biz.reviews > 0 ? biz.reviews.toLocaleString() : '—'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Reviews</div>
          </div>
          {biz.claimStatus && (
            <>
              <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.08)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={badge(biz.claimStatus === 'claimed' ? '#4ade80' : '#f59e0b')}>
                  {biz.claimStatus}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Contact Info */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ ...lbl, marginBottom: '12px', fontSize: '0.7rem' }}>Contact Information</div>
          {[
            { icon: '\u260E', label: 'Phone', value: biz.phone, href: biz.phone ? `tel:${biz.phone}` : '' },
            { icon: '\u2709', label: 'Email', value: biz.email, href: biz.email ? `mailto:${biz.email}` : '' },
            { icon: '\uD83C\uDF10', label: 'Website', value: biz.website, href: biz.website },
            { icon: '\uD83D\uDCCD', label: 'Address', value: biz.address, href: '' },
          ].map(item => (
            <div key={item.label} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 0',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}>
              <span style={{ fontSize: '1rem', width: '24px', textAlign: 'center' }}>{item.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>{item.label}</div>
                {item.value ? (
                  item.href ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer"
                      style={{ color: '#FE6462', fontSize: '0.88rem', textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.value}
                    </a>
                  ) : (
                    <div style={{ color: '#fff', fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.value}</div>
                  )
                ) : (
                  <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem', fontStyle: 'italic' }}>Not available</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Location */}
        {biz.city && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ ...lbl, marginBottom: '12px', fontSize: '0.7rem' }}>Location</div>
            <div style={{ ...glass, padding: '16px 20px' }}>
              <div style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '6px' }}>{biz.city}{biz.state ? `, ${biz.state}` : ''}</div>
              {biz.lat !== 0 && biz.lng !== 0 && (
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>
                  {biz.lat.toFixed(4)}, {biz.lng.toFixed(4)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Opening Hours */}
        {biz.openingHours && Object.keys(biz.openingHours).length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ ...lbl, marginBottom: '12px', fontSize: '0.7rem' }}>Opening Hours</div>
            <div style={{ ...glass, padding: '12px 16px' }}>
              {Object.entries(biz.openingHours).map(([day, hours]) => (
                <div key={day} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', textTransform: 'capitalize' }}>{day}</span>
                  <span style={{ color: '#fff', fontSize: '0.82rem' }}>{String(hours)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Google Maps Link */}
        {biz.googleUrl && (
          <a href={biz.googleUrl} target="_blank" rel="noopener noreferrer"
            style={{
              display: 'block',
              textAlign: 'center',
              padding: '12px',
              ...glass,
              color: '#FE6462',
              textDecoration: 'none',
              fontSize: '0.88rem',
              fontWeight: 600,
            }}>
            View on Google Maps &rarr;
          </a>
        )}
      </div>
    </div>
  );
}

/* ─────────── Export Helpers ─────────── */
function exportData(results: ScrapedBusiness[], format: ExportFormat, selectedCols: SortField[]) {
  const cols = TABLE_COLS.filter(c => selectedCols.includes(c.key));
  const getValue = (biz: ScrapedBusiness, key: SortField): string => {
    const v = biz[key];
    return v === null || v === undefined ? '' : String(v);
  };

  let content: string;
  let mime: string;
  let ext: string;

  if (format === 'json') {
    const data = results.map(biz => {
      const obj: Record<string, unknown> = {};
      cols.forEach(c => { obj[c.key] = biz[c.key]; });
      return obj;
    });
    content = JSON.stringify(data, null, 2);
    mime = 'application/json';
    ext = 'json';
  } else {
    const bom = format === 'excel' ? '\uFEFF' : '';
    const sep = ',';
    const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
    const header = cols.map(c => esc(c.label)).join(sep);
    const rows = results.map(biz => cols.map(c => esc(getValue(biz, c.key))).join(sep));
    content = bom + [header, ...rows].join('\n');
    mime = format === 'excel' ? 'text/csv;charset=utf-8-sig' : 'text/csv';
    ext = 'csv';
  }

  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `scrape-results-${new Date().toISOString().slice(0, 10)}.${ext}`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─────────── Main Component ─────────── */
export default function ScraperPage() {
  // ── Form state
  const [trade, setTrade] = useState('');
  const [customTrade, setCustomTrade] = useState('');
  const [location, setLocation] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [maxResults, setMaxResults] = useState(50);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [language, setLanguage] = useState('en');
  const [zoom, setZoom] = useState(12);

  // ── Results state
  const [results, setResults] = useState<ScrapedBusiness[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // ── Table state
  const [sortField, setSortField] = useState<SortField>('businessName');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [filterText, setFilterText] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  // ── Panels
  const [detailBiz, setDetailBiz] = useState<ScrapedBusiness | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [exportCols, setExportCols] = useState<SortField[]>(TABLE_COLS.map(c => c.key));
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv');

  // ── History
  const [history, setHistory] = useState<ScrapeHistoryEntry[]>([]);

  // ── Column visibility
  const [visibleCols, setVisibleCols] = useState<Set<SortField>>(new Set(TABLE_COLS.map(c => c.key)));
  const [showColPicker, setShowColPicker] = useState(false);
  const colPickerRef = useRef<HTMLDivElement>(null);

  // ── Refs
  const resultsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load history on mount
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  // Click outside column picker
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (colPickerRef.current && !colPickerRef.current.contains(e.target as Node)) {
        setShowColPicker(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Search
  const handleSearch = useCallback(async () => {
    const searchQuery = trade === '__custom__' ? customTrade : trade;
    const loc = stateFilter ? `${location ? location + ', ' : ''}${stateFilter}, USA` : (location || 'United States');

    if (!searchQuery) { setError('Please select or enter a trade'); return; }
    if (!location && !stateFilter) { setError('Please enter a location or select a state'); return; }

    setLoading(true);
    setError('');
    setProgress(0);
    setStatusText('Initializing scrape...');
    setHasSearched(true);
    setResults([]);
    setPage(1);
    setSelectedRows(new Set());

    // Fake progress animation
    let prog = 0;
    progressRef.current = setInterval(() => {
      prog += Math.random() * 3 + 0.5;
      if (prog > 90) prog = 90;
      setProgress(prog);
      const msgs = [
        'Connecting to data sources...',
        'Scanning Google Maps...',
        'Extracting business data...',
        'Processing contact information...',
        'Parsing addresses...',
        'Analyzing ratings & reviews...',
        'Compiling results...',
      ];
      setStatusText(msgs[Math.min(Math.floor(prog / 14), msgs.length - 1)]);
    }, 800);

    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchQuery: `${searchQuery} near ${loc}`,
          locationQuery: loc,
          maxResults,
          language,
          zoom,
        }),
      });

      if (progressRef.current) clearInterval(progressRef.current);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed: ${res.status}`);
      }

      setProgress(100);
      setStatusText('Complete!');

      const data = await res.json();
      setResults(data.results || []);

      // Save to history
      const entry: ScrapeHistoryEntry = {
        id: uid(),
        query: searchQuery,
        location: loc,
        date: new Date().toISOString(),
        count: (data.results || []).length,
        results: data.results || [],
      };
      const newHistory = [entry, ...history].slice(0, 20);
      setHistory(newHistory);
      saveHistory(newHistory);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } catch (err: unknown) {
      if (progressRef.current) clearInterval(progressRef.current);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setProgress(0);
      setStatusText('');
    } finally {
      setLoading(false);
    }
  }, [trade, customTrade, location, stateFilter, maxResults, language, zoom, history]);

  // ── Filtered & sorted results
  const processedResults = useMemo(() => {
    let filtered = [...results];

    if (filterText) {
      const lower = filterText.toLowerCase();
      filtered = filtered.filter(b =>
        b.businessName.toLowerCase().includes(lower) ||
        b.phone.includes(lower) ||
        b.email.toLowerCase().includes(lower) ||
        b.city.toLowerCase().includes(lower) ||
        b.state.toLowerCase().includes(lower) ||
        b.category.toLowerCase().includes(lower) ||
        b.address.toLowerCase().includes(lower)
      );
    }

    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const aStr = String(aVal || '').toLowerCase();
      const bStr = String(bVal || '').toLowerCase();
      return sortDir === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });

    return filtered;
  }, [results, filterText, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(processedResults.length / perPage));
  const pagedResults = processedResults.slice((page - 1) * perPage, page * perPage);

  // ── KPI computation
  const kpis = useMemo(() => {
    if (!results.length) return null;
    return {
      total: results.length,
      withPhone: results.filter(b => b.phone).length,
      withEmail: results.filter(b => b.email).length,
      withWebsite: results.filter(b => b.website).length,
      avgRating: results.filter(b => b.rating > 0).reduce((s, b) => s + b.rating, 0) / (results.filter(b => b.rating > 0).length || 1),
      avgReviews: Math.round(results.reduce((s, b) => s + b.reviews, 0) / results.length),
    };
  }, [results]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
    setPage(1);
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === pagedResults.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(pagedResults.map(b => b.placeId || b.businessName)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedRows);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedRows(next);
  };

  const loadFromHistory = (entry: ScrapeHistoryEntry) => {
    setResults(entry.results);
    setHasSearched(true);
    setShowHistory(false);
    setPage(1);
    setSelectedRows(new Set());
    setFilterText('');
  };

  const deleteHistoryEntry = (id: string) => {
    const next = history.filter(h => h.id !== id);
    setHistory(next);
    saveHistory(next);
  };

  // ── Render
  return (
    <div style={{
      minHeight: '100vh',
      background: '#070b0f',
      fontFamily: 'DM Sans, sans-serif',
      color: '#fff',
      position: 'relative',
    }}>
      <SpaceBackground />

      {/* Overlay for detail panel */}
      {detailBiz && (
        <div
          onClick={() => setDetailBiz(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1050,
          }}
        />
      )}
      {detailBiz && <DetailPanel biz={detailBiz} onClose={() => setDetailBiz(null)} />}

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
        {/* ── Header ── */}
        <header style={{ padding: '48px 0 40px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px',
            padding: '6px 16px',
            borderRadius: '100px',
            background: 'rgba(254,100,98,0.1)',
            border: '1px solid rgba(254,100,98,0.2)',
          }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#FE6462', letterSpacing: '0.04em' }}>
              REVCORE SCRAPER
            </span>
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 800,
            margin: '0 0 12px',
            lineHeight: 1.1,
            background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Contractor Intelligence
          </h1>
          <p style={{
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.5)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Scrape contractor data from Google Maps. Search by trade, location, and more. Export and analyze.
          </p>
        </header>

        {/* ── Search Form ── */}
        <div style={{ ...glass, padding: '32px', marginBottom: '28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            {/* Trade */}
            <div>
              <label style={lbl}>Trade / Business Type</label>
              <select
                value={trade}
                onChange={e => setTrade(e.target.value)}
                style={{ ...inp, cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath d=\'M2 4l4 4 4-4\' stroke=\'rgba(255,255,255,0.5)\' stroke-width=\'1.5\' fill=\'none\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
              >
                <option value="" style={{ background: '#0d1117' }}>Select a trade...</option>
                {TRADES.map(t => (
                  <option key={t} value={t} style={{ background: '#0d1117' }}>{t}</option>
                ))}
                <option value="__custom__" style={{ background: '#0d1117' }}>Custom search...</option>
              </select>
            </div>

            {/* Custom Trade */}
            {trade === '__custom__' && (
              <div>
                <label style={lbl}>Custom Search Term</label>
                <input
                  value={customTrade}
                  onChange={e => setCustomTrade(e.target.value)}
                  placeholder="e.g. Bathroom Remodelers"
                  style={inp}
                />
              </div>
            )}

            {/* City / Zip */}
            <div>
              <label style={lbl}>City, Zip, or Region</label>
              <input
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Austin, TX or 78701"
                style={inp}
              />
            </div>

            {/* State Filter */}
            <div>
              <label style={lbl}>State</label>
              <select
                value={stateFilter}
                onChange={e => setStateFilter(e.target.value)}
                style={{ ...inp, cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath d=\'M2 4l4 4 4-4\' stroke=\'rgba(255,255,255,0.5)\' stroke-width=\'1.5\' fill=\'none\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
              >
                <option value="" style={{ background: '#0d1117' }}>All States</option>
                {US_STATES.map(s => (
                  <option key={s} value={s} style={{ background: '#0d1117' }}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Max Results Slider */}
          <div style={{ marginBottom: '20px' }}>
            <label style={lbl}>Max Results: <span style={{ color: '#FE6462', fontWeight: 700 }}>{maxResults}</span></label>
            <input
              type="range"
              min={10}
              max={500}
              step={10}
              value={maxResults}
              onChange={e => setMaxResults(Number(e.target.value))}
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                appearance: 'none',
                background: `linear-gradient(to right, #FE6462 0%, #FE6462 ${((maxResults - 10) / 490) * 100}%, rgba(255,255,255,0.1) ${((maxResults - 10) / 490) * 100}%, rgba(255,255,255,0.1) 100%)`,
                cursor: 'pointer',
                outline: 'none',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>
              <span>10</span>
              <span>{maxResults > 100 ? 'Large scrape — may take longer' : 'Quick scrape'}</span>
              <span>500</span>
            </div>
          </div>

          {/* Advanced Options Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{
              ...btn('ghost'),
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: showAdvanced ? '16px' : '0',
            }}
          >
            <span style={{ transform: showAdvanced ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', display: 'inline-block' }}>
              &#9662;
            </span>
            Advanced Options
          </button>

          {showAdvanced && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', padding: '16px', ...glass, marginBottom: '16px' }}>
              <div>
                <label style={lbl}>Language</label>
                <select value={language} onChange={e => setLanguage(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
                  <option value="en" style={{ background: '#0d1117' }}>English</option>
                  <option value="es" style={{ background: '#0d1117' }}>Spanish</option>
                  <option value="fr" style={{ background: '#0d1117' }}>French</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Map Zoom Level: {zoom}</label>
                <input
                  type="range" min={5} max={20} value={zoom}
                  onChange={e => setZoom(Number(e.target.value))}
                  style={{ width: '100%', appearance: 'none', height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.1)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>
                  <span>Wide (5)</span>
                  <span>Close (20)</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
            <button
              onClick={handleSearch}
              disabled={loading}
              style={{
                ...btn('primary'),
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minWidth: '160px',
                justifyContent: 'center',
                fontSize: '0.95rem',
                padding: '14px 32px',
              }}
            >
              {loading ? (
                <>
                  <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Scraping...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="2"/>
                    <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Start Scrape
                </>
              )}
            </button>

            <button
              onClick={() => setShowHistory(!showHistory)}
              style={{ ...btn('secondary'), display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M7 4v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              History ({history.length})
            </button>
          </div>

          {error && (
            <div style={{
              marginTop: '16px',
              padding: '14px 18px',
              borderRadius: '10px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              color: '#ef4444',
              fontSize: '0.88rem',
            }}>
              {error}
            </div>
          )}
        </div>

        {/* ── History Panel ── */}
        {showHistory && (
          <div style={{ ...glass, padding: '24px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Scrape History</h3>
              <button onClick={() => setShowHistory(false)} style={btn('ghost')}>&times; Close</button>
            </div>
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: 'rgba(255,255,255,0.35)' }}>
                No scrape history yet. Run your first scrape!
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '10px' }}>
                {history.map(entry => (
                  <div key={entry.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 18px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(254,100,98,0.3)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
                    onClick={() => loadFromHistory(entry)}
                  >
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>{entry.query}</div>
                      <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                        {entry.location} &middot; {new Date(entry.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={badge('#FE6462')}>{entry.count} results</span>
                      <button
                        onClick={e => { e.stopPropagation(); deleteHistoryEntry(entry.id); }}
                        style={{ ...btn('ghost'), color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem', padding: '4px 8px' }}
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Progress ── */}
        {loading && (
          <div style={{ ...glass, padding: '28px 32px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{statusText}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FE6462' }}>{Math.round(progress)}%</span>
            </div>
            <div style={{
              height: '6px',
              borderRadius: '3px',
              background: 'rgba(255,255,255,0.06)',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                borderRadius: '3px',
                background: 'linear-gradient(90deg, #FE6462 0%, #ff8a88 100%)',
                transition: 'width 0.3s ease',
                boxShadow: '0 0 12px rgba(254,100,98,0.4)',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '16px' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#FE6462',
                  opacity: 0.4,
                  animation: `pulse 1.4s infinite ${i * 0.2}s`,
                }} />
              ))}
            </div>
          </div>
        )}

        {/* ── KPI Strip ── */}
        {kpis && !loading && (
          <div ref={resultsRef} style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '28px' }}>
            <KpiCard label="Total Found" value={kpis.total} icon="&#x1F4CA;" color="#FE6462" />
            <KpiCard label="With Phone" value={kpis.withPhone} icon="&#x260E;" color="#4ade80" />
            <KpiCard label="With Email" value={kpis.withEmail} icon="&#x2709;" color="#60a5fa" />
            <KpiCard label="With Website" value={kpis.withWebsite} icon="&#x1F310;" color="#a78bfa" />
            <KpiCard label="Avg Rating" value={kpis.avgRating.toFixed(1)} icon="&#x2B50;" color="#fbbf24" />
            <KpiCard label="Avg Reviews" value={kpis.avgReviews} icon="&#x1F4AC;" color="#f472b6" />
          </div>
        )}

        {/* ── Results Section ── */}
        {hasSearched && !loading && results.length > 0 && (
          <div style={{ ...glass, padding: '0', marginBottom: '60px', overflow: 'hidden' }}>
            {/* Toolbar */}
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 300px' }}>
                <div style={{ position: 'relative', flex: '1 1 auto', maxWidth: '360px' }}>
                  <input
                    value={filterText}
                    onChange={e => { setFilterText(e.target.value); setPage(1); }}
                    placeholder="Search results..."
                    style={{ ...inp, paddingLeft: '38px', fontSize: '0.85rem' }}
                  />
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.35 }}>
                    <circle cx="6" cy="6" r="4.5" stroke="white" strokeWidth="1.5"/>
                    <path d="M10 10l2.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>
                  {processedResults.length} result{processedResults.length !== 1 ? 's' : ''}
                  {selectedRows.size > 0 && ` · ${selectedRows.size} selected`}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* View mode toggle */}
                <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {(['table', 'cards'] as ViewMode[]).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      style={{
                        ...btn('ghost'),
                        borderRadius: 0,
                        border: 'none',
                        background: viewMode === mode ? 'rgba(254,100,98,0.15)' : 'transparent',
                        color: viewMode === mode ? '#FE6462' : 'rgba(255,255,255,0.5)',
                        padding: '6px 12px',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {mode === 'table' ? '☰' : '▦'} {mode}
                    </button>
                  ))}
                </div>

                {/* Column picker */}
                <div style={{ position: 'relative' }} ref={colPickerRef}>
                  <button onClick={() => setShowColPicker(!showColPicker)} style={btn('ghost')}>
                    Columns
                  </button>
                  {showColPicker && (
                    <div style={{
                      position: 'absolute',
                      right: 0,
                      top: '100%',
                      marginTop: '6px',
                      ...glass,
                      padding: '12px',
                      minWidth: '180px',
                      zIndex: 20,
                    }}>
                      {TABLE_COLS.map(col => (
                        <label key={col.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', cursor: 'pointer', fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>
                          <input
                            type="checkbox"
                            checked={visibleCols.has(col.key)}
                            onChange={() => {
                              const next = new Set(visibleCols);
                              next.has(col.key) ? next.delete(col.key) : next.add(col.key);
                              setVisibleCols(next);
                            }}
                            style={{ accentColor: '#FE6462' }}
                          />
                          {col.label}
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Per page */}
                <select
                  value={perPage}
                  onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
                  style={{ ...inp, width: 'auto', padding: '6px 10px', fontSize: '0.8rem' }}
                >
                  {[10, 25, 50, 100].map(n => (
                    <option key={n} value={n} style={{ background: '#0d1117' }}>{n}/page</option>
                  ))}
                </select>

                {/* Export */}
                <button
                  onClick={() => setShowExport(!showExport)}
                  style={{ ...btn('secondary'), display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 2v8M4 7l3 3 3-3M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Export
                </button>
              </div>
            </div>

            {/* Export Panel */}
            {showExport && (
              <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ ...lbl, marginBottom: '8px' }}>Format</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {([
                        { v: 'csv' as ExportFormat, l: 'CSV' },
                        { v: 'json' as ExportFormat, l: 'JSON' },
                        { v: 'excel' as ExportFormat, l: 'Excel CSV' },
                      ]).map(f => (
                        <button
                          key={f.v}
                          onClick={() => setExportFormat(f.v)}
                          style={{
                            ...btn('ghost'),
                            background: exportFormat === f.v ? 'rgba(254,100,98,0.15)' : 'transparent',
                            color: exportFormat === f.v ? '#FE6462' : 'rgba(255,255,255,0.5)',
                            border: `1px solid ${exportFormat === f.v ? 'rgba(254,100,98,0.3)' : 'rgba(255,255,255,0.1)'}`,
                            padding: '6px 14px',
                          }}
                        >
                          {f.l}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ flex: '1 1 200px' }}>
                    <div style={{ ...lbl, marginBottom: '8px' }}>Columns to Export</div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {TABLE_COLS.map(col => (
                        <label key={col.key} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: exportCols.includes(col.key) ? 'rgba(254,100,98,0.1)' : 'transparent',
                          border: `1px solid ${exportCols.includes(col.key) ? 'rgba(254,100,98,0.2)' : 'rgba(255,255,255,0.08)'}`,
                          cursor: 'pointer',
                          fontSize: '0.78rem',
                          color: exportCols.includes(col.key) ? '#FE6462' : 'rgba(255,255,255,0.5)',
                        }}>
                          <input
                            type="checkbox"
                            checked={exportCols.includes(col.key)}
                            onChange={() => {
                              setExportCols(prev =>
                                prev.includes(col.key) ? prev.filter(c => c !== col.key) : [...prev, col.key]
                              );
                            }}
                            style={{ accentColor: '#FE6462', width: '12px', height: '12px' }}
                          />
                          {col.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button
                      onClick={() => {
                        const toExport = selectedRows.size > 0
                          ? processedResults.filter(b => selectedRows.has(b.placeId || b.businessName))
                          : processedResults;
                        exportData(toExport, exportFormat, exportCols);
                      }}
                      style={{ ...btn('primary'), padding: '10px 24px' }}
                    >
                      Download {selectedRows.size > 0 ? `(${selectedRows.size})` : `(${processedResults.length})`}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Table View */}
            {viewMode === 'table' ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                  <thead>
                    <tr>
                      <th style={{ ...thStyle, width: '40px', cursor: 'default' }}>
                        <input
                          type="checkbox"
                          checked={selectedRows.size === pagedResults.length && pagedResults.length > 0}
                          onChange={toggleSelectAll}
                          style={{ accentColor: '#FE6462' }}
                        />
                      </th>
                      {TABLE_COLS.filter(c => visibleCols.has(c.key)).map(col => (
                        <th key={col.key} style={{ ...thStyle, width: col.w }} onClick={() => handleSort(col.key)}>
                          {col.label}
                          {sortField === col.key && (
                            <span style={{ marginLeft: '4px', fontSize: '0.65rem' }}>
                              {sortDir === 'asc' ? '▲' : '▼'}
                            </span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pagedResults.map((biz, i) => {
                      const rowId = biz.placeId || biz.businessName;
                      const isSelected = selectedRows.has(rowId);
                      return (
                        <tr
                          key={rowId + i}
                          style={{
                            background: isSelected ? 'rgba(254,100,98,0.06)' : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                            cursor: 'pointer',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => {
                            if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                          }}
                          onMouseLeave={e => {
                            if (!isSelected) e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)';
                          }}
                          onClick={() => setDetailBiz(biz)}
                        >
                          <td style={{ ...tdStyle, width: '40px' }} onClick={e => { e.stopPropagation(); toggleSelect(rowId); }}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(rowId)}
                              onClick={e => e.stopPropagation()}
                              style={{ accentColor: '#FE6462' }}
                            />
                          </td>
                          {visibleCols.has('businessName') && (
                            <td style={{ ...tdStyle, fontWeight: 600, color: '#fff', maxWidth: '260px' }}>{biz.businessName}</td>
                          )}
                          {visibleCols.has('phone') && (
                            <td style={tdStyle}>
                              {biz.phone ? (
                                <a href={`tel:${biz.phone}`} onClick={e => e.stopPropagation()} style={{ color: '#FE6462', textDecoration: 'none' }}>{biz.phone}</a>
                              ) : <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>}
                            </td>
                          )}
                          {visibleCols.has('email') && (
                            <td style={{ ...tdStyle, maxWidth: '200px' }}>
                              {biz.email ? (
                                <a href={`mailto:${biz.email}`} onClick={e => e.stopPropagation()} style={{ color: '#60a5fa', textDecoration: 'none' }}>{biz.email}</a>
                              ) : <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>}
                            </td>
                          )}
                          {visibleCols.has('website') && (
                            <td style={{ ...tdStyle, maxWidth: '180px' }}>
                              {biz.website ? (
                                <a href={biz.website} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                                  style={{ color: '#a78bfa', textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {biz.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                                </a>
                              ) : <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>}
                            </td>
                          )}
                          {visibleCols.has('city') && <td style={tdStyle}>{biz.city || '—'}</td>}
                          {visibleCols.has('state') && <td style={tdStyle}>{biz.state || '—'}</td>}
                          {visibleCols.has('rating') && (
                            <td style={tdStyle}>
                              {biz.rating > 0 ? (
                                <span style={{ color: biz.rating >= 4.5 ? '#4ade80' : biz.rating >= 4 ? '#fbbf24' : '#f87171' }}>
                                  {'★'} {biz.rating.toFixed(1)}
                                </span>
                              ) : <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>}
                            </td>
                          )}
                          {visibleCols.has('reviews') && (
                            <td style={tdStyle}>{biz.reviews > 0 ? biz.reviews.toLocaleString() : '—'}</td>
                          )}
                          {visibleCols.has('category') && (
                            <td style={tdStyle}>
                              {biz.category ? (
                                <span style={badge('rgba(255,255,255,0.6)')}>{biz.category}</span>
                              ) : '—'}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Card View */
              <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
                {pagedResults.map((biz, i) => (
                  <div
                    key={(biz.placeId || biz.businessName) + i}
                    onClick={() => setDetailBiz(biz)}
                    style={{
                      ...glass,
                      padding: '20px',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s, transform 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(254,100,98,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {biz.businessName}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
                          {biz.category || 'Contractor'}
                        </div>
                      </div>
                      {biz.rating > 0 && (
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ color: '#fbbf24', fontSize: '0.88rem', fontWeight: 700 }}>{'★'} {biz.rating.toFixed(1)}</div>
                          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>{biz.reviews} reviews</div>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {biz.phone && (
                        <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.7rem' }}>&#x260E;</span> {biz.phone}
                        </div>
                      )}
                      {biz.email && (
                        <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <span style={{ fontSize: '0.7rem' }}>&#x2709;</span> {biz.email}
                        </div>
                      )}
                      {biz.city && (
                        <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.7rem' }}>&#x1F4CD;</span> {biz.city}{biz.state ? `, ${biz.state}` : ''}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
                      {biz.phone && <span style={badge('#4ade80')}>Phone</span>}
                      {biz.email && <span style={badge('#60a5fa')}>Email</span>}
                      {biz.website && <span style={badge('#a78bfa')}>Website</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                padding: '16px 24px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
                  Page {page} of {totalPages}
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(1)}
                    style={{ ...btn('ghost'), opacity: page <= 1 ? 0.3 : 1 }}
                  >
                    &laquo;
                  </button>
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}
                    style={{ ...btn('ghost'), opacity: page <= 1 ? 0.3 : 1 }}
                  >
                    &lsaquo; Prev
                  </button>
                  {/* Page number buttons */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        style={{
                          ...btn('ghost'),
                          background: page === pageNum ? 'rgba(254,100,98,0.15)' : 'transparent',
                          color: page === pageNum ? '#FE6462' : 'rgba(255,255,255,0.5)',
                          minWidth: '34px',
                          padding: '6px 10px',
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                    style={{ ...btn('ghost'), opacity: page >= totalPages ? 0.3 : 1 }}
                  >
                    Next &rsaquo;
                  </button>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(totalPages)}
                    style={{ ...btn('ghost'), opacity: page >= totalPages ? 0.3 : 1 }}
                  >
                    &raquo;
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty state after search */}
        {hasSearched && !loading && results.length === 0 && !error && (
          <div style={{
            ...glass,
            padding: '60px 32px',
            textAlign: 'center',
            marginBottom: '60px',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>&#x1F50D;</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>No Results Found</h3>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>
              Try broadening your search or selecting a different location.
            </p>
          </div>
        )}

        {/* Location Distribution */}
        {results.length > 0 && !loading && (
          <div style={{ ...glass, padding: '24px', marginBottom: '60px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1.05rem', fontWeight: 700 }}>Location Distribution</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
              {(() => {
                const cityCount: Record<string, number> = {};
                results.forEach(b => {
                  const key = b.city && b.state ? `${b.city}, ${b.state}` : b.city || b.state || 'Unknown';
                  cityCount[key] = (cityCount[key] || 0) + 1;
                });
                const sorted = Object.entries(cityCount).sort((a, b) => b[1] - a[1]).slice(0, 20);
                const max = sorted[0]?.[1] || 1;
                return sorted.map(([city, count]) => (
                  <div key={city} style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{city}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FE6462', marginLeft: '8px' }}>{count}</span>
                    </div>
                    <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)' }}>
                      <div style={{ height: '100%', borderRadius: '2px', background: '#FE6462', width: `${(count / max) * 100}%`, transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}
      </div>

      {/* ── CSS Animations ── */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #FE6462;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 0 8px rgba(254,100,98,0.4);
        }
        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #FE6462;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 0 8px rgba(254,100,98,0.4);
        }
        @media (max-width: 768px) {
          table { font-size: 0.8rem !important; }
        }
        @media (max-width: 480px) {
          .detail-panel { width: 100vw !important; }
        }
      `}</style>
    </div>
  );
}
